import { headers } from "next/headers";

export interface Tenant {
  id: string;
  slug: string;
  domain: string;
  template: string;
  sanityProjectId: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "pending";
  createdAt: string;
  updatedAt: string;
  // SEO/Site configuration
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string[];
  // Additional metadata
  favicon?: string;
  logo?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// Fallback tenant for error handling
export const FALLBACK_TENANT: Tenant = {
  id: "fallback",
  slug: "fallback",
  domain: "example.com",
  template: "blog",
  sanityProjectId: "fallback",
  plan: "free",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  siteTitle: "Default Site",
  siteDescription: "A default site description",
  siteKeywords: ["default", "site"],
};

async function getTenantFromHeaders(): Promise<Tenant> {
  try {
    const headersList = await headers();

    const tenantId = headersList.get("x-tenant-id");
    if (!tenantId) {
      console.warn("No tenant ID found in headers, using fallback");
      return FALLBACK_TENANT;
    }

    return {
      id: tenantId,
      slug: headersList.get("x-tenant-slug") || "unknown",
      domain: headersList.get("x-tenant-domain") || "unknown.com",
      template: headersList.get("x-tenant-template") || "blog",
      sanityProjectId: headersList.get("x-sanity-project-id") || "fallback",
      plan: "pro" as const, // Default plan
      status: "active" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting tenant from headers:", error);
    return FALLBACK_TENANT;
  }
}

// Simple in-memory cache (use Redis in production)
const tenantCache = new Map<string, any>();

async function getTenantByDomain(domain: string) {
  if (tenantCache.has(domain)) {
    return tenantCache.get(domain);
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3003"}/api/tenants/resolve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      },
    );

    if (!response.ok) return null;

    const tenant = await response.json();
    tenantCache.set(domain, tenant);
    return tenant;
  } catch (error) {
    console.error("Tenant resolution error:", error);
    return null;
  }
}

export { tenantCache, getTenantByDomain, getTenantFromHeaders };
