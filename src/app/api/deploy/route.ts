import { NextRequest, NextResponse } from "next/server";
import { LocalDeploymentService } from "@/lib/deployment-service";
import { Tenant } from "@/lib/tenant-model";

const deploymentService = new LocalDeploymentService();
const tenants = new Map<string, Tenant>();

export async function POST(request: NextRequest) {
  try {
    const {
      subdomain,
      siteName,
      template = "launchpad",
      sanityConfig = {},
    } = await request.json();

    if (!subdomain || !siteName) {
      return NextResponse.json(
        { error: "Missing required fields: subdomain and siteName" },
        { status: 400 }
      );
    }

    if (tenants.has(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain already exists" },
        { status: 409 }
      );
    }

    const tenantId = `tenant_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const tenant = new Tenant(tenantId, subdomain, siteName, sanityConfig);
    tenants.set(subdomain, tenant);

    const result = await deploymentService.deployTemplate(tenant, template);

    return NextResponse.json({
      success: true,
      tenant: tenant.toConfig(),
      deployment: result,
      message: `Successfully deployed ${siteName}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Deployment failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const deployments = await deploymentService.listDeployments();
    const tenantList = Array.from(tenants.values()).map((tenant) => ({
      ...tenant.toConfig(),
      status: tenant.status,
      port: tenant.port,
    }));

    return NextResponse.json({
      success: true,
      tenants: tenantList,
      deployments,
      total: tenantList.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list deployments" },
      { status: 500 }
    );
  }
}
