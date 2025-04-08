import React from 'react';
import { Page, Card, Layout, TextContainer, Button, Image, List, Link, Banner, Stack, MediaCard, VideoThumbnail } from "@shopify/polaris";

function Help() {
  return (
    <Page title="How to Set Up Your App">
      <Layout>
        {/* Introduction */}
        <Layout.Section>
          <Banner
            title="Installation Guide"
            status="info"
          >
            <p>Follow this simple guide to add the app widget to your store within minutes.</p>
          </Banner>
        </Layout.Section>



        {/* Step-by-Step Instructions */}
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <h2>Step-by-Step Guide</h2>
              <p>Follow these steps to add the app widget to your Shopify store:</p>
              <List type="number">
                <List.Item>Go to your Shopify Admin and navigate to <strong>Online Store &gt; Themes</strong>.</List.Item>
                <List.Item>Click on <strong>Customize</strong> to open the theme editor.</List.Item>
                <List.Item>In the left-hand panel, find <strong>App Embeds</strong> or <strong>App Blocks</strong>.</List.Item>
                <List.Item>Locate our app and enable the widget.</List.Item>
                <List.Item>Adjust the settings as needed.</List.Item>
                <List.Item>Click <strong>Save</strong> to apply changes.</List.Item>
              </List>
            </TextContainer>
          </Card>
        </Layout.Section>

        {/* Screenshots */}
        <Layout.Section>
          <Card title="Visual Guide">
            <Card.Section>
              <Stack vertical>
                <Stack.Item>
                  <TextContainer>
                    <h3>1. Access Theme Editor</h3>
                    <p>Navigate to Online Store &gt; Themes and click "Customize"</p>
                  </TextContainer>
                  <div style={{ marginTop: "10px" }}>
                    {/* <Image source={themeEditorImg} alt="Accessing Theme Editor" /> */}
                    {/* <Image source="/api/placeholder/800/450" alt="Accessing Theme Editor" /> */}
                  </div>
                </Stack.Item>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical>
                <Stack.Item>
                  <TextContainer>
                    <h3>2. Find App Blocks</h3>
                    <p>Look for App Blocks in the left sidebar</p>
                  </TextContainer>
                  <div style={{ marginTop: "10px" }}>
                    {/* <Image source={appBlocksImg} alt="Finding App Blocks" /> */}
                    {/* <Image source="/api/placeholder/800/450" alt="Finding App Blocks" /> */}
                  </div>
                </Stack.Item>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical>
                <Stack.Item>
                  <TextContainer>
                    <h3>3. Configure Settings</h3>
                    <p>Adjust the settings to fit your store's needs</p>
                  </TextContainer>
                  <div style={{ marginTop: "10px" }}>
                    {/* <Image source={setupGuideImg} alt="Configuring Settings" /> */}
                    {/* <Image source="/api/placeholder/800/450" alt="Configuring Settings" /> */}
                  </div>
                </Stack.Item>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
{/* Video Tutorial Section */}
<Layout.Section>
          <Card sectioned>
            <TextContainer>
              <h2>Video Tutorial</h2>
              <p>Watch this short video to see how to set up the app in your store:</p>
            </TextContainer>
            <div style={{ 
              marginTop: "20px", 
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{ 
                width: "100%", 
                maxWidth: "800px",
                position: "relative", 
                paddingBottom: "56.25%", 
                height: 0, 
                overflow: "hidden" 
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
                  src="https://www.youtube.com/embed/916_bQB-xgI?si=AMjWZa76k7Q5FEgI" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </Card>
        </Layout.Section>
        {/* Direct Link to Theme Editor */}
        <Layout.Section>
          <Card sectioned>
            <Stack vertical spacing="loose">
              <Stack.Item>
                <TextContainer>
                  <h2>Quick Access to Theme Editor</h2>
                  <p>Click the button below to go directly to your theme editor and start configuring the app widget.</p>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <Button primary url="https://admin.shopify.com/themes/current/editor" external>
                  Open Theme Editor
                </Button>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Need Help Section */}
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <h2>Need Help?</h2>
              <p>If you're having trouble setting up the app, please contact our support team.</p>
              <Link url="mailto:zenmerakihelp@gmail.com">Contact Support</Link>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Help;