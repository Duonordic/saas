import { deploymentService } from "@/lib/services/deployment-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tenantId, templateId, name, subdomain, customDomain, envVars } =
      await request.json();

    const deployment = await deploymentService.deploy({
      tenantId,
      templateId,
      name,
      subdomain,
      customDomain,
      envVars,
    });

    return NextResponse.json(deployment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  const deployments = await deploymentService.listDeployments(tenantId);
  return NextResponse.json(deployments);
}
