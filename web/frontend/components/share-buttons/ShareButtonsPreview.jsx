// FILE: web/frontend/components/share-buttons/ShareButtonsPreview.jsx
import React, { useMemo } from "react";
import { Card, BlockStack, InlineStack, Text, Box, Badge } from "@shopify/polaris";
import { hsbToRgbCss } from "../../utils/hsbToCss";

const PLATFORM_LABELS = [
  ["whatsapp", "WhatsApp"],
  ["instagram", "Instagram"],
  ["messenger", "Messenger"],
  ["facebook", "Facebook"],
  ["pinterest", "Pinterest"],
  ["twitter", "X"],
  ["email", "Email"],
  ["copy", "Copy link"],
];

export function ShareButtonsPreview({ settings }) {
  const bg = settings.theme === "dark" ? "bg-surface-inverse" : "bg-surface";
  const color = useMemo(() => hsbToRgbCss(settings.brandColor), [settings.brandColor]);

  const visiblePlatforms = PLATFORM_LABELS.filter(([k]) => settings.platforms?.[k]);

  const justify =
    settings.alignment === "left"
      ? "start"
      : settings.alignment === "center"
      ? "center"
      : "end";

  const radius =
    settings.shape === "square" ? 6 : settings.shape === "pill" ? 999 : 999;

  const showText = settings.buttonStyle === "icon_text";
  const floating = settings.buttonStyle === "floating_bar" || settings.placement === "floating";

  return (
    <Card>
      <BlockStack gap="300">
        <Text as="h2" variant="headingMd">
          Live Preview
        </Text>

        <Box padding="300" background={bg} borderRadius="200">
          <BlockStack gap="200">
            <InlineStack align="space-between">
              <Text as="h3" variant="headingSm">
                Mock product
              </Text>
              {settings.enabled ? <Badge tone="success">Enabled</Badge> : <Badge tone="critical">Disabled</Badge>}
            </InlineStack>

            <Text as="p" variant="bodyMd">
              “Minimal Linen Shirt” — ₹1,999
            </Text>

            <Box
              padding="200"
              background="bg-surface-secondary"
              borderRadius="200"
              borderColor="border"
              borderWidth="025"
            >
              <InlineStack gap="200" align={justify} wrap>
                {settings.enabled ? (
                  visiblePlatforms.length ? (
                    visiblePlatforms.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        style={{
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: floating ? color : "transparent",
                          color: floating ? "white" : "inherit",
                          borderRadius: radius,
                          padding: showText ? "8px 12px" : "8px",
                          margin: settings.spacing ? `${settings.spacing / 4}px` : 0,
                          cursor: "default",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: floating ? "rgba(255,255,255,0.9)" : color }} />
                        {showText ? label : null}
                      </button>
                    ))
                  ) : (
                    <Text as="p" tone="subdued">
                      All platforms disabled
                    </Text>
                  )
                ) : (
                  <Text as="p" tone="subdued">
                    Disabled — customers won’t see buttons.
                  </Text>
                )}
              </InlineStack>
            </Box>

            <Text as="p" variant="bodySm" tone="subdued">
              Placement: {settings.placement} • Sticky: {settings.stickyOnScroll ? "on" : "off"} • Mobile-only:{" "}
              {settings.mobileOnly ? "on" : "off"}
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Card>
  );
}
