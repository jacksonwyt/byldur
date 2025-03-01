const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY is not set. Payment functionality will not work.');
    }
  }

  /**
   * Create a subscription for a user
   * @param {Object} data - Subscription data
   * @param {string} data.customerId - Stripe customer ID
   * @param {string} data.planType - 'basic' or 'pro'
   * @returns {Promise<Object>} - Created subscription
   */
  async createSubscription(data) {
    try {
      // Map planType to price ID
      const priceId = data.planType === 'basic' 
        ? process.env.STRIPE_BASIC_PRICE_ID 
        : process.env.STRIPE_PRO_PRICE_ID;

      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} - Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return {
        id: subscription.id,
        cancelAt: new Date(subscription.cancel_at * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Create a Stripe checkout session for credit purchase
   * @param {Object} data - Credit purchase data
   * @param {string} data.customerId - Stripe customer ID
   * @param {number} data.amount - Number of credits to purchase
   * @param {string} data.successUrl - URL to redirect to on success
   * @param {string} data.cancelUrl - URL to redirect to on cancel
   * @returns {Promise<Object>} - Checkout session
   */
  async createCreditPurchaseSession(data) {
    try {
      // Calculate price based on credit amount
      // For example, $5 for 10 credits
      const unitAmount = 500; // $5.00 in cents
      const quantity = Math.ceil(data.amount / 10);

      const session = await stripe.checkout.sessions.create({
        customer: data.customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AI Credits',
                description: `${quantity * 10} AI credits for Byldur Website Builder`,
              },
              unit_amount: unitAmount,
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        metadata: {
          credits: quantity * 10,
          userId: data.userId,
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Error creating credit purchase session:', error);
      throw new Error('Failed to create credit purchase session');
    }
  }

  /**
   * Create or retrieve a Stripe customer
   * @param {Object} user - User object
   * @returns {Promise<string>} - Stripe customer ID
   */
  async createOrRetrieveCustomer(user) {
    try {
      // First, check if user already has a Stripe customer ID
      if (user.stripeCustomerId) {
        // Verify the customer exists
        try {
          await stripe.customers.retrieve(user.stripeCustomerId);
          return user.stripeCustomerId;
        } catch (error) {
          // Customer doesn't exist or was deleted, create a new one
          console.warn(`Stripe customer ${user.stripeCustomerId} not found. Creating new customer.`);
        }
      }

      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user._id.toString(),
        },
      });

      return customer.id;
    } catch (error) {
      console.error('Error creating/retrieving Stripe customer:', error);
      throw new Error('Failed to process payment information');
    }
  }

  /**
   * Handle Stripe webhook events
   * @param {Object} event - Stripe event
   * @returns {Promise<Object>} - Processing result
   */
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          // Handle credit purchase completion
          if (session.mode === 'payment' && session.metadata.credits) {
            return {
              type: 'credit_purchase',
              userId: session.metadata.userId,
              credits: parseInt(session.metadata.credits, 10),
              paymentId: session.payment_intent,
            };
          }
          break;
        }
        case 'invoice.paid': {
          const invoice = event.data.object;
          // Handle subscription payment
          return {
            type: 'subscription_renewed',
            subscriptionId: invoice.subscription,
            customerId: invoice.customer,
            amount: invoice.amount_paid,
          };
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          // Handle subscription cancelation
          return {
            type: 'subscription_ended',
            subscriptionId: subscription.id,
            customerId: subscription.customer,
          };
        }
        default:
          return { type: 'unhandled', event: event.type };
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw new Error('Failed to process webhook event');
    }
  }
}

module.exports = PaymentService; 