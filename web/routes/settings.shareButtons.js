// FILE: web/routes/settings.shareButtons.js
import express from "express";
import Joi from "joi";
import ShareButtonsSettings from "../schema/ShareButtonsSettings.js";

/**
 * Assumption (best-practice for Shopify embedded apps):
 * - You already have auth middleware that sets:
 *   res.locals.shopify.session.shop (shop domain)
 */
function requireShopSession(req, res, next) {
  const shop = res?.locals?.shopify?.session?.shop;
  if (!shop) return res.status(401).json({ error: "Unauthorized" });
  req.shop = shop;
  next();
}

const router = express.Router();

const settingsSchema = Joi.object({
  enabled: Joi.boolean().required(),
  buttonStyle: Joi.string().valid("icon_only", "icon_text", "floating_bar").required(),
  shape: Joi.string().valid("round", "square", "pill").required(),
  theme: Joi.string().valid("light", "dark").required(),
  spacing: Joi.number().integer().min(0).max(24).required(),
  alignment: Joi.string().valid("left", "center", "right").required(),

  brandColor: Joi.object({
    hue: Joi.number().min(0).max(360).required(),
    saturation: Joi.number().min(0).max(100).required(),
    brightness: Joi.number().min(0).max(100).required(),
  }).required(),

  stickyOnScroll: Joi.boolean().required(),
  mobileOnly: Joi.boolean().required(),

  animation: Joi.object({
    enabled: Joi.boolean().required(),
    type: Joi.string().valid("none", "fade", "slide", "pop").required(),
    speedMs: Joi.number().integer().min(0).max(2000).required(),
  }).required(),

  placement: Joi.string().valid("above_atc", "below_description", "floating").required(),

  rules: Joi.object({
    minPrice: Joi.number().min(0).required(),
    hideSoldOut: Joi.boolean().required(),
    excludedCollectionIds: Joi.array().items(Joi.string().trim().min(1)).required(),
  }).required(),

  platforms: Joi.object({
    whatsapp: Joi.boolean().required(),
    instagram: Joi.boolean().required(),
    messenger: Joi.boolean().required(),
    facebook: Joi.boolean().required(),
    pinterest: Joi.boolean().required(),
    twitter: Joi.boolean().required(),
    email: Joi.boolean().required(),
    copy: Joi.boolean().required(),
  }).required(),
}).required();

const DEFAULTS = {
  enabled: true,
  buttonStyle: "icon_text",
  shape: "round",
  theme: "light",
  spacing: 8,
  alignment: "left",
  brandColor: { hue: 210, saturation: 70, brightness: 50 },
  stickyOnScroll: false,
  mobileOnly: false,
  animation: { enabled: true, type: "none", speedMs: 180 },
  placement: "below_description",
  rules: { minPrice: 0, hideSoldOut: false, excludedCollectionIds: [] },
  platforms: {
    whatsapp: true,
    instagram: true,
    messenger: true,
    facebook: true,
    pinterest: true,
    twitter: true,
    email: true,
    copy: true,
  },
};

router.get("/api/settings/share-buttons", requireShopSession, async (req, res) => {
  const shop = req.shop;

  const doc = await ShareButtonsSettings.findOne({ shop }).lean();
  if (!doc) {
    return res.status(200).json({ settings: DEFAULTS });
  }

  // Return only the settings fields (avoid leaking internal fields)
  const settings = {
    enabled: doc.enabled ?? DEFAULTS.enabled,
    buttonStyle: doc.buttonStyle ?? DEFAULTS.buttonStyle,
    shape: doc.shape ?? DEFAULTS.shape,
    theme: doc.theme ?? DEFAULTS.theme,
    spacing: doc.spacing ?? DEFAULTS.spacing,
    alignment: doc.alignment ?? DEFAULTS.alignment,
    brandColor: doc.brandColor ?? DEFAULTS.brandColor,
    stickyOnScroll: doc.stickyOnScroll ?? DEFAULTS.stickyOnScroll,
    mobileOnly: doc.mobileOnly ?? DEFAULTS.mobileOnly,
    animation: doc.animation ?? DEFAULTS.animation,
    placement: doc.placement ?? DEFAULTS.placement,
    rules: doc.rules ?? DEFAULTS.rules,
    platforms: doc.platforms ?? DEFAULTS.platforms,
  };

  return res.status(200).json({ settings });
});

router.put("/api/settings/share-buttons", requireShopSession, async (req, res) => {
  const shop = req.shop;

  const { error, value } = settingsSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      error: "Invalid settings",
      details: error.details.map((d) => d.message),
    });
  }

  await ShareButtonsSettings.updateOne(
    { shop },
    { $set: { shop, ...value } },
    { upsert: true }
  );

  return res.status(200).json({ ok: true });
});

export default router;
