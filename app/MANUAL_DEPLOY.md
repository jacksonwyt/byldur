# Manual Deployment to Vercel

If the deployment script doesn't work for you, follow these manual steps:

## 1. Log in to Vercel

```bash
vercel login
```

## 2. Link your project to Vercel

```bash
vercel link
```

## 3. Set up environment variables

Option 1: Using the CLI:
```bash
vercel env add REACT_APP_API_URL
# Enter the value when prompted
```

Option 2: Via the Vercel Dashboard:
1. Go to your project on vercel.com
2. Navigate to Settings > Environment Variables
3. Add your variables there

## 4. Deploy to Vercel

For a standard deployment:
```bash
vercel --prod
```

For a deployment using a local build (avoids ESLint warnings):
```bash
# Build locally first
npm run build

# Deploy the prebuilt app
vercel deploy --prebuilt --prod
```

## Troubleshooting

If you get ESLint warnings being treated as errors, you have two options:

1. Fix all warnings in your code (recommended)
2. Disable CI mode for the build by adding this to your vercel.json:
```json
{
  "build": {
    "env": {
      "CI": "false"
    }
  }
}
```

## Helpful Commands

Check your deployments:
```bash
vercel ls
```

Get deployment details:
```bash
vercel inspect <deployment-url>
```

View environment variables:
```bash
vercel env ls
```