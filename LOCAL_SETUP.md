# Local Development Environment Setup

This guide will walk you through setting up your local environment to test the multi-tenant routing and middleware for your SaaS monorepo application.PrerequisitesDocker: Ensure Docker Desktop is installed and running on your machine.Node.js & npm: Make sure you have Node.js and npm installed to run commands outside of Docker if needed.Step 1: Prepare your DockerfileCreate a Dockerfile.dev in the root of your project to build the development container. This single Dockerfile will be used for both your Next.js app and Sanity Studio, leveraging the monorepo's shared dependencies.FROM node:18-alpine

## Set working directory

WORKDIR /app

## Copy all package.json files from the monorepo

COPY package*.json ./
COPY apps/*/package*.json ./apps/
COPY packages/*/package\*.json ./packages/

## Install dependencies for all workspaces

RUN npm install

## Copy the rest of the application code

COPY . .

## Expose the ports your apps run on

EXPOSE 3000
EXPOSE 3333

## The services will specify their own commands

CMD ["npm", "start"]
Step 2: Configure Environment VariablesCreate .env.local files in the respective app directories (apps/web and apps/sanity) with the following variables.File: apps/web/.env.local# Next.js Base URL for internal API calls
NEXT_PUBLIC_BASE_URL=http://localhost:3000

## Database connection string

DATABASE_URL="postgresql://user:password@localhost:5432/saas_db"

## Sanity environment variables for the Next.js app

NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_sanity_token"
File: apps/sanity/.env.local# Sanity environment variables for the Studio itself
SANITY_STUDIO_PROJECT_ID="your_sanity_project_id"
SANITY_STUDIO_DATASET="production"
SANITY_AUTH_TOKEN="your_sanity_token"
Note: The DATABASE_URL uses localhost here because you will be connecting to it directly from your machine, not from within the Docker network. The docker-compose.yml file uses db which is the service name within the Docker network.Step 3: Modify your hosts file (Crucial for Middleware)To simulate different domains locally, you need to trick your computer into thinking these domains point to your local machine. You can do this by editing your /etc/hosts file (on macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (on Windows) with administrator privileges.Add the following lines:127.0.0.1 localhost
127.0.0.1 saas.com
127.0.0.1 app.saas.com
127.0.0.1 tenant1.saas.com
127.0.0.1 tenant2.saas.com
This will redirect all traffic for these domains to your local machine, allowing your middleware.ts to correctly identify the hostname and route the request.Step 4: Run the Services with Docker ComposeWith Docker running, open your terminal in the project root and run the following command:docker-compose up --build
This command will:Build a single Docker image for the monorepo.Start the PostgreSQL database, Next.js app, and Sanity Studio containers.Link all the services together and start the development servers in their correct working directories (apps/web and apps/sanity).Step 5: Start DevelopingYour application will now be accessible locally via these domains:saas.com:3000: This will route to your marketing site.app.saas.com:3000: This will be rewritten by the middleware to /dashboard, allowing you to develop the dashboard experience.tenant1.saas.com:3000: This will be rewritten to /sites/tenant1 (assuming tenant1 is a valid tenant slug returned by your getTenantByDomain function). You can use this to test the dynamic tenant sites.You can now start developing your application, and changes to your code will automatically update in the running containers.
