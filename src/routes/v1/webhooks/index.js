const express = require("express");

const route = express.Router();
const paymentWebhookRoutes = require("./webhook.route");

route.use("/", paymentWebhookRoutes);

module.exports = route;
