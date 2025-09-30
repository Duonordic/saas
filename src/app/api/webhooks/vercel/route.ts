// app/api/webhooks/vercel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deploymentService } from "@/lib/services/deployment-service";
import { DeploymentStatus } from "@/generated/prisma";
import crypto from "crypto";

/**
 * Vercel Deployment Webhook Payload
 * https://vercel.com/docs/observability/webhooks-overview/webhooks-api#deployment
 */
interface VercelWebhookPayload {
  id: string;
  type:
    | "deployment"
    | "deployment.created"
    | "deployment.ready"
    | "deployment.error";
  createdAt: number;
  payload: {
    deployment: {
      id: string;
      url: string;
      name: string;
      state: "BUILDING" | "READY" | "ERROR" | "QUEUED" | "CANCELED";
      readyState: "BUILDING" | "READY" | "ERROR" | "QUEUED" | "CANCELED";
      createdAt: number;
      meta?: {
        githubCommitMessage?: string;
        githubCommitSha?: string;
        githubCommitRef?: string;
      };
    };
    links?: {
      deployment: string;
      project: string;
    };
    team?: {
      id: string;
      name: string;
    };
    user?: {
      id: string;
      username: string;
    };
  };
}

/**
 * Verify Vercel webhook signature
 * https://vercel.com/docs/observability/webhooks-overview/webhooks-api#securing-webhooks
 */
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha1", secret);
  const digest = "sha1=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

/**
 * Map Vercel deployment state to our DeploymentStatus
 */
function mapVercelStateToStatus(state: string): DeploymentStatus {
  const stateMap: Record<string, DeploymentStatus> = {
    QUEUED: DeploymentStatus.queued,
    BUILDING: DeploymentStatus.building,
    READY: DeploymentStatus.running,
    ERROR: DeploymentStatus.failed,
    CANCELED: DeploymentStatus.stopped,
  };

  return stateMap[state] || DeploymentStatus.pending;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get the webhook secret from environment
    const webhookSecret = process.env.VERCEL_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("VERCEL_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // 2. Verify the signature
    const signature = request.headers.get("x-vercel-signature");
    if (!signature) {
      console.error("Missing x-vercel-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawBody = await request.text();

    // Verify signature
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse the payload
    const payload: VercelWebhookPayload = JSON.parse(rawBody);

    console.log("Received Vercel webhook:", {
      type: payload.type,
      deploymentId: payload.payload.deployment.id,
      state: payload.payload.deployment.state,
    });

    // 4. Handle different event types
    switch (payload.type) {
      case "deployment.created":
      case "deployment":
        // Deployment was created, update to queued/building
        await handleDeploymentUpdate(payload);
        break;

      case "deployment.ready":
        // Deployment is ready
        await handleDeploymentReady(payload);
        break;

      case "deployment.error":
        // Deployment failed
        await handleDeploymentError(payload);
        break;

      default:
        console.log("Unhandled webhook type:", payload.type);
    }

    // 5. Return success response
    return NextResponse.json({
      received: true,
      deploymentId: payload.payload.deployment.id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Handle general deployment updates
 */
async function handleDeploymentUpdate(payload: VercelWebhookPayload) {
  const { deployment } = payload.payload;

  try {
    await deploymentService.updateStatus(
      deployment.id,
      mapVercelStateToStatus(deployment.state),
      {
        deploymentUrl: `https://${deployment.url}`,
      }
    );

    console.log(`Updated deployment ${deployment.id} to ${deployment.state}`);
  } catch (error) {
    console.error(`Failed to update deployment ${deployment.id}:`, error);
    // Don't throw - we want to acknowledge receipt even if DB update fails
  }
}

/**
 * Handle deployment ready event
 */
async function handleDeploymentReady(payload: VercelWebhookPayload) {
  const { deployment } = payload.payload;

  try {
    await deploymentService.updateStatus(
      deployment.id,
      DeploymentStatus.running,
      {
        deploymentUrl: `https://${deployment.url}`,
      }
    );

    console.log(
      `Deployment ${deployment.id} is now READY at ${deployment.url}`
    );
  } catch (error) {
    console.error(
      `Failed to mark deployment ${deployment.id} as ready:`,
      error
    );
  }
}

/**
 * Handle deployment error event
 */
async function handleDeploymentError(payload: VercelWebhookPayload) {
  const { deployment } = payload.payload;

  try {
    await deploymentService.updateStatus(
      deployment.id,
      DeploymentStatus.failed,
      {
        deploymentUrl: `https://${deployment.url}`,
        errorMessage: "Deployment failed on Vercel",
      }
    );

    console.log(`Deployment ${deployment.id} FAILED`);
  } catch (error) {
    console.error(
      `Failed to mark deployment ${deployment.id} as failed:`,
      error
    );
  }
}

// Disable body parsing so we can verify the raw body signature
export const config = {
  api: {
    bodyParser: false,
  },
};
