const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const isAuthenticated = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

// Stripe webhook - no authentication required
// Must be before the authentication middleware
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

// All other routes require authentication
router.use(isAuthenticated);

// Subscription routes
router.get('/', subscriptionController.getCurrentSubscription);
router.post('/', subscriptionController.createSubscription);
router.put('/:id/cancel', subscriptionController.cancelSubscription);
router.put('/:id/resume', subscriptionController.resumeSubscription);

// Payment history route
router.get('/payments', subscriptionController.getPaymentHistory);

module.exports = router; 