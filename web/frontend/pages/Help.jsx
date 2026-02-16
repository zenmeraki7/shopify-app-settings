import React from "react";
import {
  Page,
  Card,
  Layout,
  Button,
  Link,
  Banner,
  BlockStack,
  InlineStack,
  Text,
  Divider,
  List,
} from "@shopify/polaris";

function Help() {
  return (
    <Page title="How to Set Up Your App">
      <Layout>

        {/* Introduction */}
        <Layout.Section>
          <Banner title="Installation Guide" tone="info">
            <Text as="p">
              Follow this simple guide to add the app widget to your store within minutes.
            </Text>
          </Banner>
        </Layout.Section>

        {/* Step-by-Step Instructions */}
        <Layout.Section>
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Step-by-Step Guide</Text>
              <Text as="p">
                Follow these steps to add the app widget to your Shopify store:
              </Text>

              <List type="number">
                <List.Item>Go to Shopify Admin → <strong>Online Store &gt; Themes</strong>.</List.Item>
                <List.Item>Click <strong>Customize</strong>.</List.Item>
                <List.Item>Find <strong>App Embeds</strong> or <strong>App Blocks</strong>.</List.Item>
                <List.Item>Enable our app widget.</List.Item>
                <List.Item>Adjust settings as needed.</List.Item>
                <List.Item>Click <strong>Save</strong>.</List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Visual Guide */}
        <Layout.Section>
          <Card padding="600">
            <BlockStack gap="500">
              <Text variant="headingMd">Visual Guide</Text>

              <BlockStack gap="300">
                <Text variant="headingSm">1. Access Theme Editor</Text>
                <Text tone="subdued">
                  Navigate to Online Store &gt; Themes and click "Customize".
                </Text>
              </BlockStack>

              <Divider />

              <BlockStack gap="300">
                <Text variant="headingSm">2. Find App Blocks</Text>
                <Text tone="subdued">
                  Look for App Blocks in the left sidebar.
                </Text>
              </BlockStack>

              <Divider />

              <BlockStack gap="300">
                <Text variant="headingSm">3. Configure Settings</Text>
                <Text tone="subdued">
                  Adjust the settings to fit your store needs.
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Video Tutorial */}
        <Layout.Section>
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingMd">Video Tutorial</Text>
              <Text tone="subdued">
                Watch this short video to see how to set up the app:
              </Text>

              <div style={{
                width: "100%",
                maxWidth: "800px",
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                margin: "0 auto"
              }}>
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0
                  }}
                  src="https://www.youtube.com/embed/916_bQB-xgI"
                  title="Setup Tutorial"
                  allowFullScreen
                />
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Theme Editor Quick Access */}
        <Layout.Section>
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingMd">Quick Access to Theme Editor</Text>
              <Text tone="subdued">
                Click below to open your theme editor instantly.
              </Text>

              <InlineStack>
                <Button
                  variant="primary"
                  url="https://admin.shopify.com/themes/current/editor"
                  external
                >
                  Open Theme Editor
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Need Help */}
        <Layout.Section>
          <Card padding="600">
            <BlockStack gap="300">
              <Text variant="headingMd">Need Help?</Text>
              <Text tone="subdued">
                If you're having trouble, contact our support team.
              </Text>

              <Link url="mailto:zenmerakihelp@gmail.com">
                Contact Support
              </Link>
            </BlockStack>
          </Card>
        </Layout.Section>

      </Layout>
    </Page>
  );
}

export default Help;
