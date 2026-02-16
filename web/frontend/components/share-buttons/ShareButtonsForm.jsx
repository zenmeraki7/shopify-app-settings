// FILE: web/frontend/components/share-buttons/ShareButtonsForm.jsx
import React, { useCallback, useMemo } from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  ChoiceList,
  RangeSlider,
  Select,
  Checkbox,
  TextField,
  Divider,
} from "@shopify/polaris";

const PLATFORM_ITEMS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "instagram", label: "Instagram" },
  { key: "messenger", label: "Messenger" },
  { key: "facebook", label: "Facebook" },
  { key: "pinterest", label: "Pinterest" },
  { key: "twitter", label: "Twitter/X" },
  { key: "email", label: "Email" },
  { key: "copy", label: "Copy link" },
];

export function ShareButtonsForm({ draft, setDraft }) {
  const setField = useCallback(
    (patch) => setDraft((prev) => ({ ...prev, ...patch })),
    [setDraft]
  );

  const setNested = useCallback(
    (key, patch) =>
      setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } })),
    [setDraft]
  );

  const setPlatform = useCallback(
    (platformKey, value) =>
      setDraft((prev) => ({
        ...prev,
        platforms: { ...prev.platforms, [platformKey]: value },
      })),
    [setDraft]
  );

  const buttonStyleChoices = useMemo(
    () => [
      { label: "Icon only", value: "icon_only" },
      { label: "Icon + text", value: "icon_text" },
      { label: "Floating bar", value: "floating_bar" },
    ],
    []
  );

  return (
    <BlockStack gap="400">
      {/* Status */}
      <Card>
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">Status</Text>
          <Checkbox
            label="Enable share buttons"
            checked={draft.enabled}
            onChange={(v) => setField({ enabled: v })}
          />
        </BlockStack>
      </Card>

      {/* Style */}
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">Button Style</Text>

          <ChoiceList
            title="Style"
            choices={buttonStyleChoices}
            selected={[draft.buttonStyle]}
            onChange={(selected) => setField({ buttonStyle: selected[0] })}
          />

          <Divider />

          <InlineStack gap="400" wrap>
            <Select
              label="Shape"
              options={[
                { label: "Round", value: "round" },
                { label: "Square", value: "square" },
                { label: "Pill", value: "pill" },
              ]}
              value={draft.shape}
              onChange={(v) => setField({ shape: v })}
            />

            <Select
              label="Theme"
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ]}
              value={draft.theme}
              onChange={(v) => setField({ theme: v })}
            />

            <Select
              label="Alignment"
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              value={draft.alignment}
              onChange={(v) => setField({ alignment: v })}
            />

            <Select
              label="Placement"
              options={[
                { label: "Above add to cart", value: "above_atc" },
                { label: "Below description", value: "below_description" },
                { label: "Floating", value: "floating" },
              ]}
              value={draft.placement}
              onChange={(v) => setField({ placement: v })}
            />
          </InlineStack>

          <RangeSlider
            label="Spacing"
            value={draft.spacing}
            onChange={(v) => setField({ spacing: v })}
            output
            min={0}
            max={24}
          />

          <Divider />

          <Text as="h3" variant="headingSm">Brand color (HSB)</Text>
          <InlineStack gap="400" wrap>
            <RangeSlider
              label="Hue"
              value={draft.brandColor.hue}
              onChange={(v) => setNested("brandColor", { hue: v })}
              output
              min={0}
              max={360}
            />
            <RangeSlider
              label="Saturation"
              value={draft.brandColor.saturation}
              onChange={(v) => setNested("brandColor", { saturation: v })}
              output
              min={0}
              max={100}
            />
            <RangeSlider
              label="Brightness"
              value={draft.brandColor.brightness}
              onChange={(v) => setNested("brandColor", { brightness: v })}
              output
              min={0}
              max={100}
            />
          </InlineStack>

          <Divider />

          <InlineStack gap="600" wrap>
            <Checkbox
              label="Sticky on scroll"
              checked={draft.stickyOnScroll}
              onChange={(v) => setField({ stickyOnScroll: v })}
              helpText="Keeps the buttons visible while scrolling (best for floating bar)."
            />
            <Checkbox
              label="Mobile-only"
              checked={draft.mobileOnly}
              onChange={(v) => setField({ mobileOnly: v })}
              helpText="Only show on small screens."
            />
          </InlineStack>

          <Divider />

          <Text as="h3" variant="headingSm">Animation</Text>
          <InlineStack gap="400" wrap>
            <Checkbox
              label="Enable animation"
              checked={draft.animation.enabled}
              onChange={(v) => setNested("animation", { enabled: v })}
            />
            <Select
              label="Type"
              options={[
                { label: "None", value: "none" },
                { label: "Fade", value: "fade" },
                { label: "Slide", value: "slide" },
                { label: "Pop", value: "pop" },
              ]}
              value={draft.animation.type}
              onChange={(v) => setNested("animation", { type: v })}
            />
            <TextField
              label="Speed (ms)"
              type="number"
              value={String(draft.animation.speedMs)}
              onChange={(v) => setNested("animation", { speedMs: Number(v || 0) })}
              autoComplete="off"
            />
          </InlineStack>
        </BlockStack>
      </Card>

      {/* Display rules */}
      <Card>
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">Display rules</Text>

          <TextField
            label="Show only if price is greater than"
            type="number"
            value={String(draft.rules.minPrice)}
            onChange={(v) => setNested("rules", { minPrice: Number(v || 0) })}
            autoComplete="off"
            helpText="Example: 499 means show only if price > 499."
          />

          <InlineStack gap="600" wrap>
            <Checkbox
              label="Hide on sold out products"
              checked={draft.rules.hideSoldOut}
              onChange={(v) => setNested("rules", { hideSoldOut: v })}
            />
          </InlineStack>

          <TextField
            label="Hide for certain collections (IDs)"
            value={draft.rules.excludedCollectionIds.join(",")}
            onChange={(v) =>
              setNested("rules", {
                excludedCollectionIds: v
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            autoComplete="off"
            helpText="Comma-separated collection IDs/GIDs. Your theme extension can read this list."
          />
        </BlockStack>
      </Card>

      {/* Platforms */}
      <Card>
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">Share options</Text>
          <Text as="p" tone="subdued">
            Toggle which platforms appear on the product page.
          </Text>

          <InlineStack gap="600" wrap>
            {PLATFORM_ITEMS.map((p) => (
              <Checkbox
                key={p.key}
                label={p.label}
                checked={!!draft.platforms[p.key]}
                onChange={(v) => setPlatform(p.key, v)}
              />
            ))}
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
