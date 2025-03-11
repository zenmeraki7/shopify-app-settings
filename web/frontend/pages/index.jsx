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
  Banner,
  Image,
} from "@shopify/polaris";
import { OrdersMajor, ProductsMajor } from "@shopify/polaris-icons";

const SocialShareLanding = () => {
  const [isSubscribed, setIsSubscribed] = useState(null);

  useEffect(() => {
    fetch("/api/verify-subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setIsSubscribed(data.isActive))
      .catch((error) => {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
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
  return (
    <Page>
      {/* Hero Section */}
      <Card sectioned>
        <Layout>
          <Layout.Section oneHalf>
            <Stack vertical spacing="loose">
              <Stack alignment="center" spacing="tight">
                <Icon source={OrdersMajor} color="primary" />
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
                <Button outline>Watch Demo</Button>
              </Stack>
            </Stack>
          </Layout.Section>

          <Layout.Section oneHalf>
            <div style={{ position: "relative" }}>
              <Image
                source="/api/placeholder/600/400"
                alt="SocialShare in action"
              />
            </div>
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
                    <Icon source={OrdersMajor} color="primary" />
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
                    <Icon source={ProductsMajor} color="primary" />
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
          <Heading element="h2">Simple, Transparent Pricing</Heading>
          <p>Start boosting your social sales today</p>
        </TextContainer>

        <div style={{ maxWidth: "450px", margin: "0 auto" }}>
          <Card
            primaryFooterAction={{
              content: "Subscribe",
              onAction: createSubscriptionPlan, // Call the function on button click
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
                <Heading element="h3">Premium Plan</Heading>
              </div>
            </Card.Section>

            <Card.Section>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <DisplayText size="medium">$19</DisplayText>
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
        </div>
      </Card>
    </Page>
  );
};

export default SocialShareLanding;
