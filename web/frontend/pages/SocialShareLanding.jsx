import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  InlineStack,
  BlockStack,
  Link,
} from "@shopify/polaris";
import { Share2, Palette } from "lucide-react";

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

      const link = document.createElement("a");
      link.href = data.charge.confirmationUrl;
      link.target = "_top";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      alert("Cancelled");
    } catch {
      setIsLoading(false);
    }
  };

  const FeatureCard = ({ icon, title, desc }) => (
    <Card>
      <BlockStack gap="300" align="center">
        {icon}
        <Text variant="headingMd">{title}</Text>
        <Text tone="subdued">{desc}</Text>
      </BlockStack>
    </Card>
  );

  return (
    <Page title="SocialShare">
      <Layout>

        {/* HERO */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingXl">
                Boost Your Sales Through Social Sharing
              </Text>
              <Text tone="subdued">
                SocialShare lets customers share products instantly across
                platforms and increase conversions.
              </Text>
              <Button
                variant="secondary"
                onClick={() => window.open("https://youtu.be/916_bQB-xgI")}
              >
                Watch Demo
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* FEATURES */}
        <Layout.Section>
          <InlineStack gap="400">
            <FeatureCard
              icon={<Share2 size={24} />}
              title="One-Click Sharing"
              desc="Share to all social platforms instantly."
            />
            <FeatureCard
              icon={<Palette size={24} />}
              title="Custom Buttons"
              desc="Style buttons to match your brand."
            />
          </InlineStack>
        </Layout.Section>

        {/* HOW IT WORKS */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg">How It Works</Text>

              <InlineStack gap="400">
                <BlockStack>
                  <Text variant="headingMd">1. Install</Text>
                  <Text tone="subdued">Add app to store</Text>
                </BlockStack>
                <BlockStack>
                  <Text variant="headingMd">2. Customize</Text>
                  <Text tone="subdued">Choose styles</Text>
                </BlockStack>
                <BlockStack>
                  <Text variant="headingMd">3. Grow</Text>
                  <Text tone="subdued">Increase traffic</Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* PRICING */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400" align="center">
              <Text variant="headingLg">Simple Pricing</Text>

              {isSubscribed ? (
                <>
                  <Text variant="headingMd">
                    {planDetails?.name || "Active Plan"}
                  </Text>
                  <Text tone="subdued">$3/month</Text>
                  <Button
                    destructive
                    loading={isLoading}
                    onClick={cancelSubscription}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Text variant="headingMd">$3 / month</Text>
                  <Button
                    primary
                    loading={isLoading}
                    onClick={createSubscriptionPlan}
                  >
                    Subscribe
                  </Button>
                </>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* FOOTER */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300" align="center">
              <Text variant="headingMd">Powered by MetaMatrix</Text>
              <Text tone="subdued">
                Advanced ecommerce growth tools.
              </Text>
              <Button
                variant="secondary"
                onClick={() =>
                  window.open("https://apps.shopify.com/metamatrix")
                }
              >
                Explore
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>

      </Layout>
    </Page>
  );
};

export default SocialShareLanding;
