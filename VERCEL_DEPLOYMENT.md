Step 1: Environment Variables
Update your .env file with Vercel credentials:
bash# Existing variables
DATABASE_URL="postgresql://..."

# NEW: Vercel API credentials

VERCEL_API_TOKEN="your_vercel_token_here"
VERCEL_TEAM_ID="team_xxx" # Optional, only if deploying to a team
VERCEL_WEBHOOK_SECRET="your_webhook_secret_here"

# For local development with webhooks

NEXT_PUBLIC_APP_URL="https://your-ngrok-url.ngrok.io"
Getting Vercel Credentials

API Token: Go to https://vercel.com/account/tokens
Team ID: Found in your team settings URL or via vercel whoami
Webhook Secret: Generated when creating the webhook in Vercel dashboard

Step 2: Install Dependencies
No new dependencies needed! The implementation uses only fetch (built-in) and crypto (Node.js standard library).

Step 3: Testing
3.1 Integration Test
tsx scripts/test-vercel-deployment.ts

3.2 Verify Webhook Reception

Create a deployment via your API or test script
Watch your server logs for webhook events
Check your database to see status updates

Step 4: Production Deployment
4.1 Update Production Environment
Add the same environment variables to your production environment:
VERCEL_API_TOKEN=...
VERCEL_TEAM_ID=...
VERCEL_WEBHOOK_SECRET=...

4.2 Update Webhook URL
Change the webhook URL in Vercel dashboard from your ngrok URL to your production URL:
https://your-production-domain.com/api/webhooks/vercel

# Related methods

- vercelDeployer.createDeployment()
- vercelDeployer.getDeploymentStatus()
- vercelDeployer.deleteDeployment()
- vercelDeployer.assignDomain()
- deploymentService.syncDeploymentStatus()

# Behavior

- deploy() - Now returns immediately after creating Vercel deployment
- redeploy() - Creates a new Vercel deployment instead of restarting container
- getLogs() - Fetches from Vercel API instead of Docker
- deleteDeployment() - Calls Vercel API to delete deployment
