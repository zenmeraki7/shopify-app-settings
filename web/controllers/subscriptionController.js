import shopify from "../shopify.js";
import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";



const createShopifyCharge = async (session, planDetails) => {
    const { name, price, trial_days = 0, return_url, interval } = planDetails;
    console.log(planDetails);
  
    try {
      const client = new shopify.api.clients.Graphql({ session });
  
      // GraphQL Mutation to create a recurring application charge
      const mutation = `
      mutation appSubscriptionCreate(
      $name: String!
      $interval: AppPricingInterval!
      $returnUrl: URL!
      $trialDays: Int
      $price: Decimal!
    ) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        trialDays: $trialDays
        test: true
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: $price, currencyCode: USD }
                interval: $interval
              }
            }
          }
        ]
      ) {
        appSubscription {
      id
      name
      status
      trialDays
      createdAt
      currentPeriodEnd
      lineItems {
        plan {
          pricingDetails {
            ... on AppRecurringPricing {  # Use inline fragment for correct structure
              interval
              price {
                amount
              }
            }
          }
        }
      }
    }
    
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
    
        `;
  
      // Execute the mutation
      const response = await client.query({
        data: {
          query: mutation,
          variables: {
            name,
            interval,
            returnUrl: return_url,
            trialDays: trial_days,
            price: price.toString(),
          },
        },
      });
  
      const { appSubscription, confirmationUrl, userErrors } =
        response.body.data.appSubscriptionCreate;
  
      if (userErrors.length > 0) {
        console.error("Error creating Shopify charge:", userErrors);
        throw new Error(userErrors.map((err) => err.message).join(", "));
      }
  
      return {
        id: appSubscription.id,
        name: appSubscription.name,
        price,
        trial_days: appSubscription.trialDays,
        return_url,
        interval,
        status: appSubscription.status,
        confirmationUrl,
        createdAt: appSubscription.createdAt,
        currentPeriodEnd: appSubscription.currentPeriodEnd,
      };
    } catch (error) {
      console.log("--------------------------------");
  
      console.log("Error creating recurring charge:", error);
      console.log("--------------------------------");
  
      throw new Error(error);
    }
  };

  // Create Subscription Plan API Endpoint
export const createSubscriptionPlan = async (req, res) => {
    const { planType, billingCycle } = req.body;
  // const planType = 'basic'
  // const billingCycle = 'monthly'
    const validPlans = {
      basic_monthly: {
        name: "Basic (Monthly)",
        price: 3,
        interval: BillingInterval.Every30Days,
      }
    };
  
    // Validate the requested plan
    const planKey = billingCycle ? `${planType}_${billingCycle}` : planType;
    const selectedPlan = validPlans[planKey];
  
    if (!selectedPlan) {
      return res.status(400).send("Invalid subscription plan or billing cycle.");
    }
  
    const session = res.locals.shopify.session;
  
    try {
      let charge = null;
  
      function extractShopName(fullShopName) {
        const shopName = fullShopName.split(".")[0];
        return shopName;
      }

      charge = await createShopifyCharge(session, {
        ...selectedPlan,
        trial_days: 0,
        return_url: `https://admin.shopify.com/store/${extractShopName(
          session.shop
        )}/apps/app-settings-1`,
      });
console.log(charge.confirmationUrl)
      res.status(200).json({message:"Subscription created successfully",charge});
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const checkActivePlan = async (req, res) => {
    let session = req.session;
    if (!session) {
      session = res.locals.shopify.session;
    }
    try {
      const client = new shopify.api.clients.Graphql({ session });
  
      // GraphQL query to fetch active recurring application charges
      const query = `
        query {
          currentAppInstallation {
            activeSubscriptions {
              id
              name
              status
              lineItems {
                plan {
                  pricingDetails {
                    ... on AppRecurringPricing {
                      interval
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
  
      const response = await client.query({ data: { query } });
  
      const activeSubscriptions =
        response.body.data.currentAppInstallation.activeSubscriptions;
  
      const activeSubscription = activeSubscriptions?.find(
        (subscription) => subscription.status === "ACTIVE"
      );
  
      if (activeSubscription) {
        return res.status(200).json({
          active: true,
          activePlan: {
            name: activeSubscription.name,
            price:
              activeSubscription.lineItems[0]?.plan.pricingDetails.price.amount,
              id: activeSubscription.id,
          },
        });
      } else {
        return res.status(404).json({
          active: false,
          message: "No active plans found, please purchase a plan.",
        });
      }
    } catch (error) {
      console.error("Error verifying subscription:", error);
      res.status(500).json({ error: "Error verifying subscription" });
    }
  };

  export const deleteSubscriptionPlans = async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      const { id } = req.body;
  
      const client = new shopify.api.clients.Graphql({ session });
  
      // GraphQL mutation to delete the subscription plan
      const mutation = `
        mutation appSubscriptionCancel($id: ID!) {
          appSubscriptionCancel(id: $id) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
            }
          }
        }
      `;
  
      const response = await client.query({
        data: {
          query: mutation,
          variables: { id: `gid://shopify/AppSubscription/${id}` },
        },
      });
  
      const { userErrors, appSubscription } =
        response.body.data.appSubscriptionCancel;
  
      // Handle any user errors returned by the mutation
      if (userErrors && userErrors.length > 0) {
        console.error("User errors:", userErrors);
        return res
          .status(400)
          .json({ error: userErrors.map((err) => err.message).join(", ") });
      }
  
      if (!appSubscription) {
        return res
          .status(404)
          .json({ error: "Subscription plan not found or already canceled." });
      }
  
      res.status(200).json("Deleted successfully");
    } catch (error) {
      console.error("Error deleting subscriptions:", error);
      res.status(500).json({ error: error.message });
    }
  };
  