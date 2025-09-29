import { nanoid } from "nanoid";
import fs from "fs-extra";
import { MockSanityService } from "./mock-sanity-service";
import path from "path";

interface DevTenant {
  id: string;
  subdomain: string;
  companyName: string;
  sanityProjectId: string;
  sanityToken: string;
  port: number;
  status: "active" | "provisioning" | "failed";
  createdAt: Date;
}

export class DevTenantService {
  private tenantsFile: string;
  private mockSanity: MockSanityService;
  private basePort = 3001;

  constructor() {
    this.tenantsFile = path.join(process.cwd(), ".dev-data", "tenants.json");
    this.mockSanity = new MockSanityService();
    fs.ensureDirSync(path.dirname(this.tenantsFile));
  }

  async provisionTenant(data: {
    subdomain: string;
    companyName: string;
  }): Promise<DevTenant> {
    const tenants = await this.loadTenants();

    // Check if subdomain exists
    if (tenants.some((t) => t.subdomain === data.subdomain)) {
      throw new Error(`Subdomain '${data.subdomain}' already exists`);
    }

    console.log(`🚀 Provisioning tenant: ${data.subdomain}...`);

    // Create mock Sanity project
    const sanityProject = await this.mockSanity.createProject(
      data.subdomain,
      `${data.companyName} CMS`
    );

    // Create tenant record
    const tenant: DevTenant = {
      id: nanoid(),
      subdomain: data.subdomain,
      companyName: data.companyName,
      sanityProjectId: sanityProject.projectId,
      sanityToken: sanityProject.token,
      port: this.basePort + tenants.length,
      status: "active",
      createdAt: new Date(),
    };

    tenants.push(tenant);
    await this.saveTenants(tenants);

    console.log(`✅ Tenant provisioned: http://localhost:${tenant.port}`);
    console.log(`   Sanity Studio: http://localhost:${tenant.port}/studio`);

    return tenant;
  }

  async getTenant(subdomain: string): Promise<DevTenant | null> {
    const tenants = await this.loadTenants();
    return tenants.find((t) => t.subdomain === subdomain) || null;
  }

  async listTenants(): Promise<DevTenant[]> {
    return await this.loadTenants();
  }

  async deleteTenant(subdomain: string): Promise<void> {
    const tenants = await this.loadTenants();
    const tenant = tenants.find((t) => t.subdomain === subdomain);

    if (tenant) {
      await this.mockSanity.deleteProject(tenant.sanityProjectId);
      const updated = tenants.filter((t) => t.subdomain !== subdomain);
      await this.saveTenants(updated);
      console.log(`🗑️  Tenant deleted: ${subdomain}`);
    }
  }

  private async loadTenants(): Promise<DevTenant[]> {
    if (await fs.pathExists(this.tenantsFile)) {
      return await fs.readJson(this.tenantsFile);
    }
    return [];
  }

  private async saveTenants(tenants: DevTenant[]): Promise<void> {
    await fs.writeJson(this.tenantsFile, tenants, { spaces: 2 });
  }
}
