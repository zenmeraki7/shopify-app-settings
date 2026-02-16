import express from "express";
const router = express.Router();

// Fake DB (replace with Mongo/Mongoose)
const storeDB = new Map();

const defaultSettings = {
  enabled: true,
  style: "icon_text",
  shape: "round",
  theme: "light",
  spacing: 8,
  alignment: "left",
  platforms: {
    whatsapp: true,
    facebook: true,
    twitter: true,
    pinterest: false,
  },
};

router.get("/share-buttons", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    if (!session) return res.status(401).json({ error: "No session" });

    const shop = session.shop;

    const settings = storeDB.get(shop) || defaultSettings;

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/share-buttons", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    if (!session) return res.status(401).json({ error: "No session" });

    const shop = session.shop;

    storeDB.set(shop, req.body);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
