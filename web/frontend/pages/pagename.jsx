import React, { useState } from 'react';
import {
  Page,
  Card,
  Layout,
  FormLayout,
  Select,
  Button,
  TextContainer,
  Heading,
  Stack,
  Icon,
  Banner,
  Link
} from '@shopify/polaris';
import { PlusMinor, ExternalMinor } from '@shopify/polaris-icons';
import { useTranslation } from "react-i18next";

export default function PageName() {
  const { t } = useTranslation();
  const [socialMedia, setSocialMedia] = useState({
    whatsapp: true,
    facebook: true,
    instagram: true,
    twitter: true,
    pinterest: true
  });

  // State for button style and position
  const [buttonStyle, setButtonStyle] = useState('circular');
  const [buttonPosition, setButtonPosition] = useState('below_cart');

  // State for activation status
  const [isActivated, setIsActivated] = useState(false);

  // Handle toggle change for social media platforms
  const handleToggle = (platform) => {
    setSocialMedia({
      ...socialMedia,
      [platform]: !socialMedia[platform]
    });
  };

  // Handle activation toggle
  const handleActivation = () => {
    setIsActivated(!isActivated);
  };

  // Custom toggle style to match the image
  const ToggleSwitch = ({ platform, isActive }) => {
    return (
      <div
        onClick={() => handleToggle(platform)}
        style={{
          width: '46px',
          height: '24px',
          backgroundColor: isActive ? '#5c6ac4' : '#e4e9f2',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            top: '2px',
            left: isActive ? '24px' : '2px',
            transition: 'left 0.3s ease',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    );
  };

  // Platform Icon component for visual enhancement
  const PlatformIcon = ({ platform }) => {
    const iconColors = {
      whatsapp: '#25D366',
      facebook: '#1877F2',
      instagram: '#E4405F',
      twitter: '#1DA1F2',
      pinterest: '#BD081C'
    };

    return (
      <div style={{
        width: '28px',
        height: '28px',
        backgroundColor: iconColors[platform],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        {platform.charAt(0).toUpperCase()}
      </div>
    );
  };

  // MetaMatrix Logo component
  const MetaMatrixLogo = () => {
    return (
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#5c6ac4',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#5c6ac4',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          marginRight: '8px'
        }}>
          M
        </div>
        MetaMatrix
      </div>
    );
  };

  return (
    <Page title="Social Share Buttons - App Settings">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack distribution="equalSpacing">
              <Heading>General Settings</Heading>
              <Button icon={<Icon source={PlusMinor} />} accessibilityLabel="Add new setting" />
            </Stack>
          </Card>

          <div style={{ marginTop: '16px' }}>
            <Card sectioned>
              <TextContainer>
                <Heading>Share Platforms</Heading>
              </TextContainer>

              {/* Social Media Platform List */}
              <div style={{ marginTop: '16px' }}>
                {/* WhatsApp Toggle */}
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f4f6f8' }}>
                  <Stack distribution="equalSpacing" alignment="center">
                    <Stack alignment="center" spacing="tight">
                      <PlatformIcon platform="whatsapp" />
                      <TextContainer>
                        <span style={{ color: '#212b36', fontSize: '14px' }}>WhatsApp</span>
                      </TextContainer>
                    </Stack>
                    <ToggleSwitch platform="whatsapp" isActive={socialMedia.whatsapp} />
                  </Stack>
                </div>

                {/* Facebook Toggle */}
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f4f6f8' }}>
                  <Stack distribution="equalSpacing" alignment="center">
                    <Stack alignment="center" spacing="tight">
                      <PlatformIcon platform="facebook" />
                      <TextContainer>
                        <span style={{ color: '#212b36', fontSize: '14px' }}>Facebook</span>
                      </TextContainer>
                    </Stack>
                    <ToggleSwitch platform="facebook" isActive={socialMedia.facebook} />
                  </Stack>
                </div>

                {/* Instagram Toggle */}
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f4f6f8' }}>
                  <Stack distribution="equalSpacing" alignment="center">
                    <Stack alignment="center" spacing="tight">
                      <PlatformIcon platform="instagram" />
                      <TextContainer>
                        <span style={{ color: '#212b36', fontSize: '14px' }}>Instagram</span>
                      </TextContainer>
                    </Stack>
                    <ToggleSwitch platform="instagram" isActive={socialMedia.instagram} />
                  </Stack>
                </div>

                {/* Twitter Toggle */}
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f4f6f8' }}>
                  <Stack distribution="equalSpacing" alignment="center">
                    <Stack alignment="center" spacing="tight">
                      <PlatformIcon platform="twitter" />
                      <TextContainer>
                        <span style={{ color: '#212b36', fontSize: '14px' }}>Twitter</span>
                      </TextContainer>
                    </Stack>
                    <ToggleSwitch platform="twitter" isActive={socialMedia.twitter} />
                  </Stack>
                </div>

                {/* Pinterest Toggle */}
                <div style={{ padding: '12px 0' }}>
                  <Stack distribution="equalSpacing" alignment="center">
                    <Stack alignment="center" spacing="tight">
                      <PlatformIcon platform="pinterest" />
                      <TextContainer>
                        <span style={{ color: '#212b36', fontSize: '14px' }}>Pinterest</span>
                      </TextContainer>
                    </Stack>
                    <ToggleSwitch platform="pinterest" isActive={socialMedia.pinterest} />
                  </Stack>
                </div>
              </div>
            </Card>
          </div>

          {/* Activation Button Section - Added Between Share Platforms and Design Settings */}
          <div style={{ marginTop: '16px' }}>
            <Card sectioned>
              <div style={{ textAlign: 'center' }}>
                <TextContainer>
                  <Heading>Activate Social Share Buttons</Heading>
                  <p style={{ marginBottom: '16px', color: '#637381' }}>
                    Enable social sharing functionality on your store
                  </p>
                </TextContainer>

                <Button
                  primary={!isActivated}
                  destructive={isActivated}
                  size="large"
                  onClick={handleActivation}
                  style={{ minWidth: '200px' }}
                >
                  {isActivated ? 'Deactivate' : 'Activate'} Social Sharing
                </Button>

                {isActivated && (
                  <div style={{ marginTop: '16px' }}>
                    <Banner status="success">
                      Social share buttons are currently active on your store
                    </Banner>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Card sectioned>
              <TextContainer>
                <Heading>Design Settings</Heading>
              </TextContainer>

              <FormLayout>
                <Select
                  label="Button Style"
                  options={[
                    { label: 'Circular', value: 'circular' },
                    { label: 'Rounded', value: 'rounded' },
                    { label: 'Square', value: 'square' }
                  ]}
                  onChange={(value) => setButtonStyle(value)}
                  value={buttonStyle}
                  helpText="Choose the shape of your social media buttons"
                />

                <Select
                  label="Button Position"
                  options={[
                    { label: 'Below Add to Cart', value: 'below_cart' },
                    { label: 'Above Add to Cart', value: 'above_cart' },
                    { label: 'Floating Left', value: 'floating_left' },
                    { label: 'Floating Right', value: 'floating_right' }
                  ]}
                  onChange={(value) => setButtonPosition(value)}
                  value={buttonPosition}
                  helpText="Choose where buttons will appear on the product page"
                />
              </FormLayout>

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Button primary>Save</Button>
              </div>
            </Card>
          </div>

          {/* MetaMatrix Section */}
          <div style={{ marginTop: '16px' }}>
            <Card sectioned>
              <Stack distribution="equalSpacing">
                <Heading>Also Try This</Heading>
              </Stack>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '16px 0 0 0'
              }}>
                <MetaMatrixLogo />

                <div style={{ margin: '20px 0' }}>
                  <TextContainer>
                    <p style={{ fontSize: '15px', color: '#637381', maxWidth: '600px', margin: '0 auto 24px auto' }}>
                      This app is powered by MetaMatrix, a leading provider of e-commerce enhancement tools.
                      Our mission is to help you boost engagement and drive more sales through innovative social sharing solutions.
                    </p>
                    <p style={{ fontSize: '15px', color: '#637381', maxWidth: '600px', margin: '0 auto' }}>
                      Unlock additional features like analytics, custom designs, and advanced sharing options with our premium plans.
                    </p>
                  </TextContainer>
                </div>

                <Button
                  primary
                  size="large"
                  icon={<Icon source={ExternalMinor} />}
                  style={{ minWidth: '250px' }}
                  onClick={() => window.open('https://metamatrix.io', '_blank')}
                >
                  Explore MetaMatrix Solutions
                </Button>

                <div style={{ marginTop: '16px' }}>
                  <Link url="https://metamatrix.io/support" external>
                    Need help? Contact MetaMatrix Support
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}