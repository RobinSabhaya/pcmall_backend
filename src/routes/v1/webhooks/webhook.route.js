const express = require('express');
const { handleStripeWebhook } = require('../../../webhooks/stripeWebhook');
const {
  paymentGateway: { paymentProvider },
} = require('../../../config/config');

const route = express.Router();

// Stripe webhook
route.post(`/${paymentProvider}/webhook`, express.raw({ type: 'application/json' }), handleStripeWebhook);

route.get('/success', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Payment Success ✅',
  });
});

route.get('/cancel', (req, res) => {
  return res.status(400).json({
    success: false,
    message: 'Payment Failed ❌',
  });
});

module.exports = route;
