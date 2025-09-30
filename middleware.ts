// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tenantService } from "@/lib/services/tenant-service";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip tenant resolution for static files and API routes that don't need it
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Resolve tenant using multiple strategies
  const tenant = await resolveTenant(request);

  if (!tenant && !pathname.startsWith("/admin")) {
    // Redirect to tenant selection or error page
    return NextResponse.redirect(new URL("/select-tenant", request.url));
  }

  // Add tenant information to request headers
  const requestHeaders = new Headers(request.headers);

  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.id);
    requestHeaders.set("x-tenant-slug", tenant.slug);
    requestHeaders.set("x-tenant-name", tenant.name);
    requestHeaders.set("x-tenant-config", JSON.stringify(tenant.config));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

async function resolveTenant(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = new URL(request.url);

  // Strategy 1: Custom domain (production)
  // Example: client1.com -> tenant with domain "client1.com"
  if (!hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
    const domainParts = hostname.split(".");

    // Check if this is a custom domain (not your main app domain)
    if (!hostname.includes("yourmainapp.com")) {
      const tenant = await tenantService.getTenantByDomain(hostname);
      if (tenant) return tenant;
    }

    // Strategy 2: Subdomain routing (production)
    // Example: client1.yourmainapp.com -> tenant with slug "client1"
    if (domainParts.length > 2) {
      const subdomain = domainParts[0];
      if (subdomain !== "www" && subdomain !== "app") {
        const tenant = await tenantService.getTenantBySlug(subdomain);
        if (tenant) return tenant;
      }
    }
  }

  // Strategy 3: Query parameter (development)
  // Example: localhost:3000?tenant=client1
  const tenantSlug = url.searchParams.get("tenant");
  if (tenantSlug) {
    return tenantService.getTenantBySlug(tenantSlug);
  }

  // Strategy 4: Header-based (API requests)
  // Example: x-tenant-id: abc-123
  const headerTenantId = request.headers.get("x-tenant-id");
  if (headerTenantId) {
    return tenantService.getTenant(headerTenantId);
  }

  const headerTenantSlug = request.headers.get("x-tenant-slug");
  if (headerTenantSlug) {
    return tenantService.getTenantBySlug(headerTenantSlug);
  }

  return null;
}

export const runtime = "nodejs";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
