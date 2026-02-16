// FILE: web/schema/ShareButtonsSettings.js
import mongoose from "mongoose";

const PlatformTogglesSchema = new mongoose.Schema(
  {
    whatsapp: { type: Boolean, default: true },
    instagram: { type: Boolean, default: true },
    messenger: { type: Boolean, default: true },
    facebook: { type: Boolean, default: true },
    pinterest: { type: Boolean, default: true },
    twitter: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    copy: { type: Boolean, default: true },
  },
  { _id: false }
);

const BrandColorSchema = new mongoose.Schema(
  {
    hue: { type: Number, default: 210, min: 0, max: 360 },
    saturation: { type: Number, default: 70, min: 0, max: 100 },
    brightness: { type: Number, default: 50, min: 0, max: 100 },
  },
  { _id: false }
);

const DisplayRulesSchema = new mongoose.Schema(
  {
    minPrice: { type: Number, default: 0, min: 0 }, // Show only if price > X
    hideSoldOut: { type: Boolean, default: false },
    excludedCollectionIds: { type: [String], default: [] }, // collection GIDs or numeric IDs as strings
  },
  { _id: false }
);

const AnimationSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    type: { type: String, default: "none", enum: ["none", "fade", "slide", "pop"] },
    speedMs: { type: Number, default: 180, min: 0, max: 2000 },
  },
  { _id: false }
);

const ShareButtonsSettingsSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true, index: true, unique: true },

    enabled: { type: Boolean, default: true },

    // Tabs: Icon only / Icon + text / Floating bar
    buttonStyle: {
      type: String,
      default: "icon_text",
      enum: ["icon_only", "icon_text", "floating_bar"],
    },

    // Shape: Round/Square/Pill
    shape: { type: String, default: "round", enum: ["round", "square", "pill"] },

    // Theme: Light/Dark
    theme: { type: String, default: "light", enum: ["light", "dark"] },

    // Spacing (0–24)
    spacing: { type: Number, default: 8, min: 0, max: 24 },

    // Alignment (Left/Center/Right)
    alignment: { type: String, default: "left", enum: ["left", "center", "right"] },

    // Full merchant styling controls
    brandColor: { type: BrandColorSchema, default: () => ({}) },
    stickyOnScroll: { type: Boolean, default: false },
    mobileOnly: { type: Boolean, default: false },

    animation: { type: AnimationSchema, default: () => ({}) },

    placement: {
      type: String,
      default: "below_description",
      enum: ["above_atc", "below_description", "floating"],
    },

    rules: { type: DisplayRulesSchema, default: () => ({}) },

    platforms: { type: PlatformTogglesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.ShareButtonsSettings ||
  mongoose.model("ShareButtonsSettings", ShareButtonsSettingsSchema);
