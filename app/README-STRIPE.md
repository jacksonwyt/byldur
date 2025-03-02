# Stripe Integration Guide

This document provides instructions for setting up and using the Stripe integration in the Byldur application.

## Configuration

1. Sign up for a Stripe account at [stripe.com](https://stripe.com) if you don't have one already.
2. Obtain your Stripe API keys from the Stripe Dashboard.
3. Add the following environment variables to your `.env` file:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   ```
   For the server:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Components

### StripeProvider

The `StripeProvider` is a context provider that manages subscription data and Stripe interactions. It provides the following functionality:

- Fetching subscription data, plans, and payment history
- Creating checkout sessions
- Canceling and reactivating subscriptions
- Updating payment methods

```jsx
// Example usage in your application
import { StripeProvider } from './contexts/StripeContext';

function App() {
  return (
    <StripeProvider>
      <YourComponent />
    </StripeProvider>
  );
}
```

### useStripe Hook

The `useStripe` hook provides easy access to the Stripe context. Use it to access subscription data and Stripe functionality in your components.

```jsx
import { useStripe } from '../hooks/useStripe';

function YourComponent() {
  const { 
    subscription, 
    plans, 
    createCheckoutSession,
    hasActiveSubscription
  } = useStripe();
  
  const handleSubscribe = async (planId) => {
    await createCheckoutSession(planId);
  };
  
  return (
    <div>
      {plans.map(plan => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          onSubscribe={handleSubscribe} 
        />
      ))}
    </div>
  );
}
```

### Subscription Components

The following components are available for subscription management:

1. **PlanCard**: Displays a subscription plan with details and a subscribe button.
2. **SimpleStripeCheckout**: A minimalist checkout component that redirects to Stripe Checkout.
3. **StripeCheckout**: A more detailed checkout component with plan information.
4. **PaymentMethodForm**: A form for entering and submitting payment method details.
5. **StripeWrapper**: A wrapper for Stripe Elements to securely collect card details.

## Testing Stripe Integration

1. Use Stripe's test cards for testing payments:
   - Card number: `4242 4242 4242 4242`
   - Expiration: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. Use Stripe's CLI to test webhooks locally:
   - Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Run `stripe listen --forward-to localhost:5000/api/stripe/webhook`

## Production Considerations

1. Always use webhook signatures to verify Stripe events.
2. Implement proper error handling for failed payments.
3. Consider implementing SCA (Strong Customer Authentication) for European customers.
4. Use Stripe metadata to link Stripe objects to your application's records.
5. Implement idempotency keys for API requests to prevent duplicate charges.

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)
- [Checkout Session](https://stripe.com/docs/api/checkout/sessions)
- [Stripe Elements](https://stripe.com/docs/stripe-js) 