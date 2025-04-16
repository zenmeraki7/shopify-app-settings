import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  TextContainer,
  DisplayText,
  TextStyle,
  Stack,
  Icon,
  Heading,
  Link,
  Image,
} from "@shopify/polaris";
import { Share2, Palette } from 'lucide-react';


const SocialShareLanding = () => {
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    fetch("/api/verify-subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the response has active property
        setIsSubscribed(data.active || false);

        // Store plan details if available
        if (data.activePlan) {
          setPlanDetails(data.activePlan);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
        setIsLoading(false);
      });
  }, []); // Runs only once when the component mounts

  const createSubscriptionPlan = async () => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType: "basic", billingCycle: "monthly" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Dynamically create an <a> tag and trigger a click event  
      const link = document.createElement("a");
      link.href = data.charge.confirmationUrl;
      link.target = "_top"; // Ensures it opens in the top frame (important for Shopify apps)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup after click
    } catch (error) {
      console.log("Subscription creation error:", error.message);
      alert("Failed to create subscription. Please try again.");
    }
  };
  const cancelSubscription = async () => {
    try {
      if (!window.confirm("Are you sure you want to cancel your subscription?")) {
        return;
      }
  
      if (!planDetails?.id) {
        alert("Invalid subscription ID. Cannot cancel.");
        return;
      }
  
      setIsLoading(true);
      
      // Send just the numeric portion of the ID
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: planDetails.id.toString().replace(/\D/g, '')  // Strip any non-numeric characters
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }
   const data = await response.json();
      setIsSubscribed(false);
      setPlanDetails(null);
      setIsLoading(false);
      alert("Your subscription has been canceled successfully.");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      setIsLoading(false);
      alert(`There was an error canceling your subscription: ${error.message}`);
    }
  };
  
  const MetaMatrixLogo = () => {
    return (
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#5c6ac4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#5c6ac4",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "24px",
            marginRight: "8px",
          }}
        >
          M
        </div>
        MetaMatrix
      </div>
    );
  };

  return (
    <Page>
      {/* Hero Section */}
      <Card sectioned>
        <Layout>
          <Layout.Section oneHalf>
            <Stack vertical spacing="loose">
              <Stack alignment="center" spacing="tight">
                <TextStyle variation="strong">SocialShare</TextStyle>
              </Stack>

              <DisplayText size="large">
                Boost Your Sales Through Social Sharing
              </DisplayText>

              <TextContainer>
                <p>
                  SocialShare makes it simple for your customers to share their
                  favorite products on social media, driving traffic and
                  increasing conversions for your Shopify store.
                </p>
              </TextContainer>

              <Stack distribution="leading" spacing="tight">
                <Button outline onClick={() => window.open("https://youtu.be/916_bQB-xgI", "_blank")}>Watch Demo</Button>
              </Stack>
            </Stack>
          </Layout.Section>
        </Layout>
      </Card>

      {/* Features Section */}
      <Card sectioned>
        <TextContainer>
          <Heading element="h2">Seamless Social Sharing</Heading>
        </TextContainer>

        <Layout>
  <Layout.Section oneQuarter>
    <Card>
      <Card.Section>
        <Stack alignment="center" distribution="center" spacing="tight">
          <div
            style={{
              background: "var(--p-color-bg-primary-subdued)",
              padding: "12px",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <Share2 size={24} />
          </div>
        </Stack>
        <TextContainer spacing="tight">
          <Heading>One-click sharing</Heading>
          <p>
            Enable customers to share to multiple platforms with just
            one click
          </p>
        </TextContainer>
      </Card.Section>
    </Card>
  </Layout.Section>

  <Layout.Section oneQuarter>
    <Card>
      <Card.Section>
        <Stack alignment="center" distribution="center" spacing="tight">
          <div
            style={{
              background: "var(--p-color-bg-primary-subdued)",
              padding: "12px",
              borderRadius: "50%",
              marginBottom: "16px",
            }}
          >
            <Palette size={24} />
          </div>
        </Stack>
        <TextContainer spacing="tight">
          <Heading>Customizable Buttons</Heading>
          <p>
            Adjust button shapes, styles, and sizes to match your brand
          </p>
        </TextContainer>
      </Card.Section>
    </Card>
  </Layout.Section>
</Layout>
      </Card>

      {/* How It Works Section */}
      <Card sectioned>
        <TextContainer>
          <Heading element="h2">How SocialShare Works</Heading>
          <p>
            Get up and running in minutes with our simple installation process
          </p>
        </TextContainer>

        <Layout>
          <Layout.Section oneThird>
            <Card>
              <Card.Section>
                <Stack vertical alignment="center" spacing="tight">
                  <div
                    style={{
                      background: "var(--p-color-bg-primary)",
                      color: "var(--p-color-text-on-primary)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    1
                  </div>
                  <Heading>Install the App</Heading>
                  <p>
                    Add SocialShare to your Shopify store with just one click
                  </p>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>

          <Layout.Section oneThird>
            <Card>
              <Card.Section>
                <Stack vertical alignment="center" spacing="tight">
                  <div
                    style={{
                      background: "var(--p-color-bg-primary)",
                      color: "var(--p-color-text-on-primary)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    2
                  </div>
                  <Heading>Customize Settings</Heading>
                  <p>Choose which products can be shared and how they appear</p>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>

          <Layout.Section oneThird>
            <Card>
              <Card.Section>
                <Stack vertical alignment="center" spacing="tight">
                  <div
                    style={{
                      background: "var(--p-color-bg-primary)",
                      color: "var(--p-color-text-on-primary)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    3
                  </div>
                  <Heading>Increase Sales</Heading>
                  <p>
                    Watch as customers share products and drive new traffic to
                    your store
                  </p>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Card>

      {/* Pricing Section */}
     <Card sectioned>
    <TextContainer>
      <DisplayText size="large">Simple, Transparent Pricing</DisplayText>
      <div style={{  marginBottom: "16px" }}>
      <Heading element="h1" >Start boosting your social sales today</Heading>
      </div>
    </TextContainer>

    <div style={{ maxWidth: "450px", margin: "0 auto" }}>
      {isSubscribed ? (
        <Card>
          <Card.Section>
            <div
              style={{
                background: "var(--p-color-bg-success)",
                color: "var(--p-color-text-on-primary)",
                padding: "16px",
                textAlign: "center",
                marginTop: "-20px",
                marginLeft: "-20px",
                marginRight: "-20px",
              }}
            >
              <Heading element="h3">Current Subscription</Heading>
            </div>
          </Card.Section>
                   <Card.Section>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <DisplayText size="medium">
                {planDetails?.name || "Active Plan"}
              </DisplayText>
              <TextStyle variation="subdued">
                $3.00/month
              </TextStyle>
            </div>

            <Stack vertical>
              <Stack alignment="center" spacing="tight">
                <div style={{ color: "var(--p-color-text-success)" }}>
                  ✓
                </div>
                <p>Your subscription is active</p>
              </Stack>
            </Stack>
          </Card.Section>
          <Card.Section>
            <div style={{ textAlign: "center" }}>
              <Button
                destructive
                onClick={cancelSubscription}
                disabled={isLoading}
                loading={isLoading}
              >
                Cancel Subscription
              </Button>
            </div>
          </Card.Section>
        </Card>
      ) : (
        <Card
          primaryFooterAction={{
            content: "Subscribe",
            onAction: createSubscriptionPlan,
            disabled: isLoading,
            loading: isLoading,
          }}
        >
         <Card.Section>
            <div
              style={{
                background: "var(--p-color-bg-primary)",
                color: "var(--p-color-text-on-primary)",
                padding: "16px",
                textAlign: "center",
                marginTop: "-20px",
                marginLeft: "-20px",
                marginRight: "-20px",
              }}
            >
              <Heading element="h3">Basic (Monthly)</Heading>
            </div>
          </Card.Section>
            <Card.Section>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <DisplayText size="medium">$3.0</DisplayText>
              <TextStyle variation="subdued">/month</TextStyle>
            </div>

            <Stack vertical>
              {[
                "Unlimited product sharing",
                "All social networks supported",
                "Custom buttons",
                "Priority support",
              ].map((feature, index) => (
                <Stack key={index} alignment="center" spacing="tight">
                  <div style={{ color: "var(--p-color-text-success)" }}>
                    ✓
                  </div>
                  <p>{feature}</p>
                </Stack>
              ))}
            </Stack>
          </Card.Section>
</Card>
      )}
    </div>
</Card>

      {/* MetaMatrix Section */}
      <div style={{ marginTop: "16px" }}>
        <Card sectioned>
          <Stack distribution="equalSpacing">
            <Heading>Also Try This</Heading>
          </Stack>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "16px 0 0 0",
            }}
          >
            <MetaMatrixLogo />

            <div style={{ margin: "20px 0" }}>
              <TextContainer>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#637381",
                    maxWidth: "600px",
                    margin: "0 auto 24px auto",
                  }}
                >
                  This app is powered by MetaMatrix, a leading provider of
                  e-commerce enhancement tools. Our mission is to help you boost
                  engagement and drive more sales through innovative social
                  sharing solutions.
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#637381",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Unlock additional features like analytics, custom designs, and
                  advanced sharing options with our premium plans.
                </p>
              </TextContainer>
            </div>

            <Button
              primary
              size="large"
              style={{ minWidth: "250px" }}
              onClick={() => window.open("https://apps.shopify.com/metamatrix", "_blank")}
            >
              Explore MetaMatrix Solutions
            </Button>
{/* 
            <div style={{ marginTop: "16px" }}>
              <Link url="zenmerakihelp@gmail.com" external>
                Need help? Contact MetaMatrix Support
              </Link>
            </div> */}
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default SocialShareLanding;
