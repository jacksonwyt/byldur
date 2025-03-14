# Deploying to Vercel

This guide walks you through deploying your Byldur app to Vercel with the correct environment variables.

## Step 1: Log in to Vercel

```bash
vercel login
```

Follow the prompts to log in to your Vercel account.

## Step 2: Initial Setup (First Deployment Only)

If this is your first time deploying this project to Vercel, run:

```bash
vercel
```

This will guide you through linking your local project to a Vercel project. Use these settings:
- Set up and deploy: Yes
- Directory: ./
- Build Command: npm run build
- Output Directory: build
- Development Command: npm start
- Override settings: No

## Step 3: Set Up Environment Variables

You can set environment variables in three ways:

### Option 1: Vercel UI (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable (like `REACT_APP_API_URL`) with its value
5. Select which environments to apply to (Production, Preview, Development)

### Option 2: Vercel CLI

```bash
# Set a production environment variable
vercel env add REACT_APP_API_URL production
# Then enter the value when prompted

# Set a preview/development environment variable
vercel env add REACT_APP_API_URL preview
vercel env add REACT_APP_API_URL development
```

### Option 3: Use .env Files

Our setup already has:
- `.env` - Default for all environments
- `.env.production` - For production environment
- `.env.local.example` - Template for local development

## Step 4: Deploy

Use the deployment script:

```bash
./deploy-to-vercel.sh
```

Or deploy manually:

```bash
vercel --prod
```

## Troubleshooting

- **Missing environment variables**: Check Vercel UI to ensure all needed variables are set
- **Build errors**: Run `npm run build` locally to troubleshoot before deploying
- **Deployment issues**: Try `vercel --debug` for detailed logs

## Important Notes

- Environment variables in `.env.production` will be used when building locally with `npm run build`
- Environment variables set in the Vercel UI will override those in your `.env` files during deployment
- The `.env` files in your repo are for local development only and are not used directly by Vercel
- Remember to add necessary environment variables for both production and preview environments