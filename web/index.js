// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { authenticateUser } from "./middlewares/authenticateStorefrontUser.js";
import {
  checkActivePlan,
  createSubscriptionPlan,
  deleteSubscriptionPlans,
} from "./controllers/subscriptionController.js";

// ✅ IMPORTANT: Import your settings router here
import settingsShareButtonsRouter from "./routes/settings.shareButtons.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

/* =========================
   Shopify Auth
========================= */

app.get(shopify.config.auth.path, shopify.auth.begin());

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

/* =========================
   Core Middleware
========================= */

// 🔥 JSON must come BEFORE routes
app.use(express.json({ limit: "2mb" }));

// 🔥 Protect all /api routes
app.use("/api", shopify.validateAuthenticatedSession());

// Storefront auth
app.use("/storefront", authenticateUser);

/* =========================
   API ROUTES
========================= */

app.get("/api/verify-subscription", checkActivePlan);
app.post("/api/subscribe", createSubscriptionPlan);
app.post("/api/cancel-subscription", deleteSubscriptionPlans);

// 🔥 THIS mounts your share-buttons route
app.use(settingsShareButtonsRouter);

/* =========================
   Existing Demo Routes
========================= */

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error });
});

/* =========================
   Frontend + SPA fallback
========================= */

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"), "utf8").replace(
        "%VITE_SHOPIFY_API_KEY%",
        process.env.SHOPIFY_API_KEY || ""
      )
    );
});

app.listen(PORT);
