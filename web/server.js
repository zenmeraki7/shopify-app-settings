// FILE: web/server.js (snippet)
import express from "express";
import settingsShareButtonsRouter from "./routes/settings.shareButtons.js";

// ... your existing app init
const app = express();

app.use(express.json());

// ... your existing Shopify auth middleware that sets res.locals.shopify.session
// app.use(shopifyAuthMiddleware)

app.use(settingsShareButtonsRouter);

// ...
export default app;
