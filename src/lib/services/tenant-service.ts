// lib/services/tenant-service.ts
import { Tenant, TenantStatus, PlanType, UserRole } from "@/generated/prisma";
import prisma from "../prisma";

export class TenantService {
  private cache = new Map<string, { tenant: Tenant; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get tenant by ID with caching
   */
  async getTenant(tenantId: string): Promise<Tenant | null> {
    const cached = this.cache.get(tenantId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.tenant;
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
        status: TenantStatus.active,
        deleted_at: null,
      },
    });

    if (tenant) {
      this.cache.set(tenantId, { tenant, timestamp: Date.now() });
    }

    return tenant;
  }

  /**
   * Get tenant by slug (for URL-based routing)
   */
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findUnique({
      where: {
        slug,
        status: TenantStatus.active,
        deleted_at: null,
      },
    });

    if (tenant) {
      this.cache.set(tenant.id, { tenant, timestamp: Date.now() });
    }

    return tenant;
  }

  /**
   * Get tenant by custom domain (for production)
   */
  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findUnique({
      where: {
        domain,
        status: TenantStatus.active,
        deleted_at: null,
      },
    });

    if (tenant) {
      this.cache.set(tenant.id, { tenant, timestamp: Date.now() });
    }

    return tenant;
  }

  /**
   * Create a new tenant
   */
  async createTenant(data: {
    name: string;
    slug: string;
    domain?: string;
    plan?: PlanType;
    config?: any;
  }): Promise<Tenant> {
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        plan: data.plan || PlanType.free,
        status: TenantStatus.trial,
        config: data.config,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });

    return tenant;
  }

  /**
   * Update tenant configuration
   */
  async updateConfig(tenantId: string, updates: any): Promise<Tenant> {
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        config: updates,
        updated_at: new Date(),
      },
    });

    this.cache.delete(tenantId);
    return tenant;
  }

  /**
   * Check if tenant has access to a feature
   */
  async hasFeature(tenantId: string, feature: string): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return false;

    const config = tenant.config as any;
    const features = config?.features || {};

    return features[feature] === true;
  }

  /**
   * Get tenant theme configuration
   */
  async getTheme(tenantId: string) {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return null;

    const config = tenant.config as any;
    return (
      config?.theme || {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        fontFamily: "Inter",
        borderRadius: "8px",
        darkMode: false,
      }
    );
  }

  /**
   * List all active tenants (for admin)
   */
  async listTenants(filters?: {
    status?: TenantStatus;
    plan?: PlanType;
    limit?: number;
    offset?: number;
  }) {
    return prisma.tenant.findMany({
      where: {
        status: filters?.status,
        plan: filters?.plan,
        deleted_at: null,
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Soft delete a tenant
   */
  async deleteTenant(tenantId: string): Promise<void> {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: TenantStatus.cancelled,
        deleted_at: new Date(),
      },
    });

    this.cache.delete(tenantId);
  }

  /**
   * Clear cache for a specific tenant
   */
  clearCache(tenantId?: string): void {
    if (tenantId) {
      this.cache.delete(tenantId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Retrieves slugs and IDs of seeded tenants for dev/testing environment.
   */
  async getSeededTenantDetails(): Promise<
    { id: string; slug: string; email: string }[]
  > {
    // Fetch only the active tenants and select the necessary fields
    const tenants = await prisma.tenant.findMany({
      where: {
        status: TenantStatus.active,
        slug: { in: ["acme", "techco", "startup"] }, // Target your seeded tenants
      },
      select: {
        id: true,
        slug: true,
        // Include a user's email for easy login reference in dev
        users: {
          where: { role: UserRole.owner },
          select: { email: true },
          take: 1,
        },
      },
    });

    // Format the data for easy frontend consumption
    return tenants.map((t) => ({
      id: t.id,
      slug: t.slug,
      // Safely access the owner's email
      email: t.users[0]?.email || "N/A",
    }));
  }
}

// Export singleton instance
export const tenantService = new TenantService();
