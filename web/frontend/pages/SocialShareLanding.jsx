import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  InlineGrid,
  BlockStack,
  Divider,
  Box
} from "@shopify/polaris";
import { Share2, Palette, CheckCircle } from "lucide-react";

const SocialShareLanding = () => {
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    fetch("/api/verify-subscription")
      .then((res) => res.json())
      .then((data) => {
        setIsSubscribed(data.active || false);
        if (data.activePlan) setPlanDetails(data.activePlan);
        setIsLoading(false);
      })
      .catch(() => {
        setIsSubscribed(false);
        setIsLoading(false);
      });
  }, []);

  const createSubscriptionPlan = async () => {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "basic", billingCycle: "monthly" }),
      });
      const data = await res.json();
      window.open(data.charge.confirmationUrl, "_top");
    } catch {
      alert("Subscription failed.");
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm("Cancel subscription?")) return;
    try {
      setIsLoading(true);
      await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: planDetails.id }),
      });
      setIsSubscribed(false);
      setPlanDetails(null);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const FeatureCard = ({ icon, title, desc }) => (
    <Card padding="600">
      <BlockStack gap="300" align="center">
        {icon}
        <Text variant="headingMd">{title}</Text>
        <Text tone="subdued" alignment="center">
          {desc}
        </Text>
      </BlockStack>
    </Card>
  );

  return (
    <Page>
      <Layout>

        {/* HERO */}
        <Layout.Section>
          <Card padding="800">
            <BlockStack gap="400" align="center">
              <Text variant="headingXl" alignment="center">
                Turn Customers Into Your Best Marketers
              </Text>
              <Text tone="subdued" alignment="center">
                Let shoppers share your products instantly on social media and
                drive more traffic with zero effort.
              </Text>
              <Button
                primary
                onClick={() =>
                  window.open("https://youtu.be/916_bQB-xgI")
                }
              >
                Watch Demo
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* FEATURES */}
        <Layout.Section>
          <BlockStack gap="400">
            <Text variant="headingLg" alignment="center">
              Powerful Features
            </Text>

            <InlineGrid columns={2} gap="400">
              <FeatureCard
                icon={<Share2 size={28} />}
                title="One-Click Sharing"
                desc="Customers share products instantly across social platforms."
              />
              <FeatureCard
                icon={<Palette size={28} />}
                title="Custom Styling"
                desc="Buttons that match your brand perfectly."
              />
            </InlineGrid>
          </BlockStack>
        </Layout.Section>

        {/* HOW IT WORKS */}
        <Layout.Section>
          <Card padding="800">
            <BlockStack gap="600">
              <Text variant="headingLg" alignment="center">
                How It Works
              </Text>

              <InlineGrid columns={3} gap="600">
                <BlockStack gap="200" align="center">
                  <CheckCircle size={32} />
                  <Text variant="headingMd">Install</Text>
                  <Text tone="subdued" alignment="center">
                    Add app to your store
                  </Text>
                </BlockStack>

                <BlockStack gap="200" align="center">
                  <CheckCircle size={32} />
                  <Text variant="headingMd">Customize</Text>
                  <Text tone="subdued" alignment="center">
                    Pick your button style
                  </Text>
                </BlockStack>

                <BlockStack gap="200" align="center">
                  <CheckCircle size={32} />
                  <Text variant="headingMd">Grow</Text>
                  <Text tone="subdued" alignment="center">
                    Get more traffic & sales
                  </Text>
                </BlockStack>
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* PRICING */}
   {/* PRICING */}
<Layout.Section>
  <BlockStack gap="400">
    <Text variant="headingLg">Simple Pricing</Text>

    <Card padding="0">
      <Box paddingBlock="400" paddingInlineStart="200" paddingInlineEnd="400">
        <BlockStack gap="050" inlineAlign="start">
          <Text variant="heading2xl">$3</Text>
          <Text tone="subdued">per month</Text>
        </BlockStack>
      </Box>

      <Divider />

      <Box padding="400">
        {isSubscribed ? (
          <Button
            destructive
            fullWidth
            loading={isLoading}
            onClick={cancelSubscription}
          >
            Cancel Subscription
          </Button>
        ) : (
          <Button
            primary
            fullWidth
            loading={isLoading}
            onClick={createSubscriptionPlan}
          >
            Subscribe Now
          </Button>
        )}
      </Box>
    </Card>
  </BlockStack>
</Layout.Section>



        {/* FOOTER */}
        <Layout.Section>
          <Card padding="500">
            <BlockStack gap="200" align="center">
              <Text variant="headingMd">Powered by MetaMatrix</Text>
              <Text tone="subdued">
                Advanced ecommerce growth tools.
              </Text>
              <Button
                variant="secondary"
                fullWidth
                onClick={() =>
                  window.open("https://apps.shopify.com/metamatrix")
                }
              >
                Explore More Apps
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>

      </Layout>
    </Page>
  );
};

export default SocialShareLanding;
