# Stripe Integration Setup

This document explains how to set up the Stripe integration for selling products on your Byldur website.

## Prerequisites

1. A Stripe account - Sign up at [stripe.com](https://stripe.com) if you don't have one
2. Your Vercel deployment of the Byldur website

## Setting Up Environment Variables in Vercel

You need to add the following environment variables to your Vercel project:

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your Byldur project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables:

### 1. Stripe Secret Key

- Name: `STRIPE_SECRET_KEY`
- Value: Your Stripe secret key from the Stripe Dashboard (starts with `sk_`)
- Environment: Production, Preview (and optionally Development)

### 2. Stripe Publishable Key

- Name: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Value: Your Stripe publishable key from the Stripe Dashboard (starts with `pk_`)
- Environment: Production, Preview (and optionally Development)

### 3. Site URL

- Name: `NEXT_PUBLIC_URL`
- Value: The URL of your site (e.g., `https://your-site.vercel.app`)
- Environment: Production, Preview (and optionally Development)

## Updating Your Product Page

After setting up the environment variables in Vercel, you need to update the calculator product page to use your Stripe publishable key:

1. Edit the file `/public/products/calc.html`
2. Find the line with `const stripe = Stripe('YOUR_PUBLISHABLE_KEY');`
3. Replace it with:
   ```javascript
   const stripe = Stripe('{process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}');
   ```

## Testing the Integration

After deploying your changes:

1. Visit your site and navigate to the Products section
2. Click on the "Buy Now" button for the calculator
3. You should be redirected to the Stripe checkout page
4. Use Stripe's test card number `4242 4242 4242 4242` with any future expiration date and any CVC
5. After completing the test purchase, you should be redirected to the download page

## Verify in Stripe Dashboard

You can verify that test payments are coming through in your [Stripe Dashboard](https://dashboard.stripe.com/test/payments).

## Going Live

When you're ready to accept real payments:

1. Go to your Stripe Dashboard and activate your account
2. Update your Vercel environment variables to use the live keys (change from `sk_test_` to `sk_live_` and `pk_test_` to `pk_live_`)
3. Make sure to test the entire flow again to ensure everything works with the live keys

## Support

If you need help with your Stripe integration, you can:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Contact Stripe support at [support.stripe.com](https://support.stripe.com)