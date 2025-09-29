import { NextRequest, NextResponse } from "next/server";

const tenants = new Map<string, any>(); // Would come from your service

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const tenant = tenants.get(params.subdomain);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get deployment status from your service
    const deploymentService = new LocalDeploymentService();
    const deployment = await deploymentService.getDeployment(params.subdomain);

    return NextResponse.json({
      success: true,
      tenant: tenant.toConfig(),
      status: tenant.status,
      port: tenant.port,
      deployment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get deployment" },
      { status: 500 }
    );
  }
}
