const express = require("express");
const { handleStripeWebhook } = require("../../../webhooks/stripeWebhook");
const { paymentGateway: { paymentProvider} } = require("../../../config/config");

const route = express.Router();

// Stripe webhook
route.post(
  `/${paymentProvider}/webhook`,
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = route;
