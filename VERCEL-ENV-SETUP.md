# Setting Up Environment Variables in Vercel

To fix loading errors and ensure your Byldur site works correctly, you need to configure your environment variables in Vercel. This guide explains how to do this step-by-step.

## Required Environment Variables

These variables are essential for your site to function properly:

### Frontend (App) Variables
- `REACT_APP_API_URL`: Your API endpoint URL (e.g., https://byldur.com/api)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `REACT_APP_ENABLE_ANALYTICS`: Set to "true" to enable Google Analytics

### Backend (Server) Variables
- `JWT_SECRET`: Secret key for JWT authentication
- `MONGODB_URI`: Your MongoDB connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `ANTHROPIC_API_KEY`: API key for Claude AI integration
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `NODE_ENV`: Set to "production" for production deployment

## Adding Environment Variables in Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Byldur project
3. Click on **Settings** in the top navigation
4. Select **Environment Variables** from the left sidebar
5. For each variable:
   - Enter the variable name (e.g., `REACT_APP_API_URL`) 
   - Enter the value
   - Select the environments (Production, Preview, Development)
   - Click **Add**
6. After adding all variables, redeploy your application:
   - Go to **Deployments** tab
   - Click on the three-dot menu next to your latest deployment
   - Select **Redeploy**

## Troubleshooting Environment Variable Issues

If you're still experiencing issues:

1. **Check for typos**: Ensure variable names are exact (e.g., `REACT_APP_API_URL`, not `REACT_APP_API_URL`)
2. **Verify values**: Double-check all values are correct (no extra spaces, etc.)
3. **Redeploy completely**: Sometimes a full redeploy is needed for variables to take effect
4. **Check browser console**: Look for specific error messages about missing environment variables
5. **Inspect network requests**: Look for failed API calls that might indicate environment issues

## Local Development

For local development, create a `.env` file in the root directory with the same variables. Example:

```
# Frontend variables
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_ENABLE_ANALYTICS=false

# Backend variables
JWT_SECRET=your_local_dev_secret
MONGODB_URI=mongodb://localhost:27017/byldur
STRIPE_SECRET_KEY=sk_test_your_key
NODE_ENV=development
```

Then run both the server and client:
- Server: `cd server && npm run dev`
- Client: `cd app && npm start`