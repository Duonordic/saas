export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion?: string;
}

export interface TenantConfig {
  tenantId: string;
  subdomain: string;
  siteName: string;
  sanity: SanityConfig;
}

export class Tenant {
  public tenantId: string;
  public subdomain: string;
  public siteName: string;
  public sanity: SanityConfig;
  public createdAt: Date;
  public status: "deploying" | "deployed" | "failed";
  public port: number | null;

  constructor(
    tenantId: string,
    subdomain: string,
    siteName: string,
    sanityConfig: Partial<SanityConfig> = {}
  ) {
    this.tenantId = tenantId;
    this.subdomain = subdomain;
    this.siteName = siteName;
    this.sanity = {
      projectId: sanityConfig.projectId || "default-sanity-project",
      dataset: sanityConfig.dataset || "production",
      apiVersion: sanityConfig.apiVersion || "2023-01-01",
      ...sanityConfig,
    };
    this.createdAt = new Date();
    this.status = "deploying";
    this.port = null;
  }

  toConfig(): TenantConfig {
    return {
      tenantId: this.tenantId,
      subdomain: this.subdomain,
      siteName: this.siteName,
      sanity: this.sanity,
    };
  }
}
