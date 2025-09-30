// app/api/webhooks/github/route.ts
import { deploymentService } from "@/lib/services/deployment-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  // Handle GitHub webhook for auto-redeploy on push
  if (payload.ref === "refs/heads/main") {
    const deployment = await findDeploymentByRepo(payload.repository.html_url);
    if (deployment) {
      await deploymentService.redeploy(deployment.id);
    }
  }

  return NextResponse.json({ received: true });
}
