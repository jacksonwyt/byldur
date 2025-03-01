const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const AICredit = require('../models/AICredit');
const auth = require('../middleware/auth');

// Initialize payment service
const paymentService = new PaymentService();

// Create a subscription
router.post('/', auth, async (req, res) => {
  try {
    const { planType } = req.body;
    
    if (!planType || !['basic', 'pro'].includes(planType)) {
      return res.status(400).json({ error: 'Valid plan type is required' });
    }
    
    // Get or create Stripe customer
    const customerId = await paymentService.createOrRetrieveCustomer(req.user);
    
    // Store Stripe customer ID with user if it doesn't exist
    if (!req.user.stripeCustomerId) {
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    // Create subscription
    const subscription = await paymentService.createSubscription({
      customerId,
      planType
    });
    
    res.json({
      subscriptionId: subscription.subscriptionId,
      clientSecret: subscription.clientSecret,
      planType
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel a subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }
    
    // Find the subscription in our database
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: req.user._id
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Cancel in Stripe
    const result = await paymentService.cancelSubscription(subscription.paymentId);
    
    // Update in our database
    subscription.status = 'canceled';
    subscription.autoRenew = false;
    await subscription.save();
    
    // Update user subscription status
    req.user.subscription.status = 'canceled';
    await req.user.save();
    
    res.json({
      message: 'Subscription canceled',
      subscription: {
        id: subscription._id,
        status: subscription.status,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Purchase AI credits
router.post('/purchase-credits', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const amountNum = parseInt(amount, 10);
    
    if (!amountNum || amountNum <= 0) {
      return res.status(400).json({ error: 'Valid credit amount is required' });
    }
    
    // Get or create Stripe customer
    const customerId = await paymentService.createOrRetrieveCustomer(req.user);
    
    // Store Stripe customer ID with user if it doesn't exist
    if (!req.user.stripeCustomerId) {
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    // Create checkout session
    const session = await paymentService.createCreditPurchaseSession({
      customerId,
      amount: amountNum,
      userId: req.user._id.toString(),
      successUrl: `${process.env.FRONTEND_URL}/dashboard?purchase=success`,
      cancelUrl: `${process.env.FRONTEND_URL}/dashboard?purchase=canceled`
    });
    
    // Save preliminary credit purchase record
    await AICredit.create({
      userId: req.user._id,
      amount: amountNum,
      priceInCents: amountNum * 50, // $0.50 per credit
      paymentMethod: 'stripe',
      paymentId: session.sessionId,
      status: 'pending'
    });
    
    res.json({
      checkoutUrl: session.url,
      sessionId: session.sessionId
    });
  } catch (error) {
    console.error('Credit purchase error:', error);
    res.status(500).json({ error: 'Failed to create credit purchase' });
  }
});

// Get user's subscriptions
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get user's credit purchases
router.get('/credits', auth, async (req, res) => {
  try {
    const credits = await AICredit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.json({ credits });
  } catch (error) {
    console.error('Error fetching credit purchases:', error);
    res.status(500).json({ error: 'Failed to fetch credit purchases' });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    const result = await paymentService.handleWebhookEvent(event);
    
    // Handle different event types
    switch (result.type) {
      case 'credit_purchase': {
        // Process credit purchase
        await AICredit.processCompletedPayment(result.paymentId, User);
        break;
      }
      case 'subscription_renewed': {
        // Update subscription status
        const subscription = await Subscription.findOne({ paymentId: result.subscriptionId });
        if (subscription) {
          subscription.status = 'active';
          await subscription.save();
          
          // Update user subscription status
          const user = await User.findById(subscription.userId);
          if (user) {
            user.subscription.status = 'active';
            user.subscription.endDate = subscription.endDate;
            await user.save();
          }
        }
        break;
      }
      case 'subscription_ended': {
        // Mark subscription as expired
        const subscription = await Subscription.findOne({ paymentId: result.subscriptionId });
        if (subscription) {
          subscription.status = 'expired';
          await subscription.save();
          
          // Update user subscription status
          const user = await User.findById(subscription.userId);
          if (user) {
            user.subscription.status = 'expired';
            await user.save();
          }
        }
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router; 