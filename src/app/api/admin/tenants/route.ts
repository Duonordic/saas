import { DevTenantService } from "@/lib/dev-services/dev-tenant-provisioning";
import { getCurrentTenant } from "@/utils/tenant-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const service = new DevTenantService();
  const tenants = await service.listTenants();
  return NextResponse.json(tenants);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const service = new DevTenantService();
    const tenant = await getCurrentTenant();

    if (tenant) {
      return NextResponse.json({
        success: true,
        tenant,
        url: `http://localhost:3000?tenant=${tenant?.domain}`,
        studioUrl: `http://localhost:3000/studio?tenant=${tenant?.domain}`,
      });
    } else {
      throw new Error("No current tenant.");
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { subdomain } = await request.json();
  const service = new DevTenantService();
  await service.deleteTenant(subdomain);
  return NextResponse.json({ success: true });
}
