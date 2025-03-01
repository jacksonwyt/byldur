const { User, Subscription, PaymentHistory } = require('../models');
const withTransaction = require('../utils/transactionWrapper');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get user's current subscription
exports.getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ subscription: subscription || null });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new subscription
exports.createSubscription = withTransaction(async (req, res, transaction) => {
  try {
    const { plan, paymentMethodId } = req.body;
    
    // Get or create Stripe customer
    let user = await User.findByPk(req.user.id, { transaction });
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save({ transaction });
    } else {
      // Update customer's payment method
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId
      });
      
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    }
    
    // Get the price ID for the selected plan
    const priceId = process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`];
    if (!priceId) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    // Create the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });
    
    // Create subscription in database
    const subscription = await Subscription.create({
      userId: user.id,
      planType: plan,
      status: 'active',
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: false,
      autoRenew: true
    }, { transaction });
    
    // Record the payment
    const invoice = stripeSubscription.latest_invoice;
    if (invoice && invoice.payment_intent && invoice.payment_intent.status === 'succeeded') {
      await PaymentHistory.create({
        userId: user.id,
        stripePaymentId: invoice.payment_intent.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'succeeded',
        description: `Subscription to ${plan} plan`
      }, { transaction });
    }
    
    res.json({ subscription });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id,
        status: 'active'
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Active subscription not found' });
    }
    
    // Update the subscription in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
    }
    
    // Update our database
    subscription.cancelAtPeriodEnd = true;
    subscription.autoRenew = false;
    await subscription.save();
    
    res.json({ subscription });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resume a canceled subscription
exports.resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id,
        cancelAtPeriodEnd: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Cancelable subscription not found' });
    }
    
    // Update the subscription in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false
      });
    }
    
    // Update our database
    subscription.cancelAtPeriodEnd = false;
    subscription.autoRenew = true;
    await subscription.save();
    
    res.json({ subscription });
  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await PaymentHistory.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stripe webhook handler
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};

// Helper function to handle invoice payment succeeded event
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      // Get the subscription from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
      
      // Update or create the subscription in our database
      const [subscription, created] = await Subscription.findOrCreate({
        where: { stripeSubscriptionId: invoice.subscription },
        defaults: {
          userId: await getUserIdFromStripeCustomerId(invoice.customer),
          planType: await getPlanTypeFromProductId(stripeSubscription.items.data[0].price.product),
          status: 'active',
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          autoRenew: !stripeSubscription.cancel_at_period_end
        }
      });
      
      if (!created) {
        // Update existing subscription
        subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
        subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
        subscription.status = 'active';
        await subscription.save();
      }
      
      // Record the payment
      await PaymentHistory.create({
        userId: subscription.userId,
        stripePaymentId: invoice.payment_intent,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status,
        description: `Subscription payment for ${subscription.planType} plan`
      });
    }
  } catch (error) {
    console.error('Error handling invoice.payment_succeeded:', error);
  }
}

// Helper function to handle subscription deleted event
async function handleSubscriptionDeleted(subscription) {
  try {
    const dbSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id }
    });
    
    if (dbSubscription) {
      dbSubscription.status = 'expired';
      dbSubscription.autoRenew = false;
      await dbSubscription.save();
    }
  } catch (error) {
    console.error('Error handling customer.subscription.deleted:', error);
  }
}

// Helper function to handle subscription updated event
async function handleSubscriptionUpdated(subscription) {
  try {
    const dbSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id }
    });
    
    if (dbSubscription) {
      dbSubscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      dbSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      dbSubscription.autoRenew = !subscription.cancel_at_period_end;
      await dbSubscription.save();
    }
  } catch (error) {
    console.error('Error handling customer.subscription.updated:', error);
  }
}

// Helper function to get userId from Stripe customer ID
async function getUserIdFromStripeCustomerId(stripeCustomerId) {
  const user = await User.findOne({
    where: { stripeCustomerId }
  });
  
  if (!user) {
    throw new Error(`User not found for Stripe customer: ${stripeCustomerId}`);
  }
  
  return user.id;
}

// Helper function to get plan type from product ID
async function getPlanTypeFromProductId(productId) {
  // This would be a mapping of Stripe product IDs to our plan types
  // For now, we'll assume basic_ai as default
  return 'basic_ai';
} 