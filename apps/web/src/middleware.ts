import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantByDomain } from "@/lib/tenant";

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
const APP_SUBDOMAIN = "app";
const API_SUBDOMAIN = "api";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const pathname = url.pathname;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Handle local development
  const isLocalhost = hostname.includes("localhost");
  const baseDomain = isLocalhost ? "localhost" : PLATFORM_DOMAIN;

  // Extract subdomain
  const hostParts = hostname.split(".");
  const isPlatformDomain =
    hostname === baseDomain || (isLocalhost && hostParts.length === 1);
  const subdomain = !isPlatformDomain ? hostParts[0] : null;

  // Platform routes (main domain)
  if (isPlatformDomain) {
    if (pathname.startsWith("/dashboard")) {
      // Redirect to app subdomain for dashboard
      url.hostname = `${APP_SUBDOMAIN}.${baseDomain}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Dashboard routes (app.subdomain)
  if (subdomain === APP_SUBDOMAIN) {
    url.pathname = `/dashboard${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // API subdomain
  if (subdomain === API_SUBDOMAIN) {
    return NextResponse.next();
  }

  // Tenant sites (custom domains or tenant subdomains)
  const tenant = await getTenantByDomain(hostname);

  if (tenant) {
    // Add tenant context to request headers
    const headers = new Headers(request.headers);
    headers.set("x-tenant-id", tenant.id);
    headers.set("x-tenant-slug", tenant.slug);
    headers.set("x-tenant-template", tenant.template);
    headers.set("x-sanity-project-id", tenant.sanityProjectId);
    headers.set("x-tenant-domain", hostname);

    // Rewrite to tenant site handler
    url.pathname = `/sites/${hostname}${pathname}`;
    const response = NextResponse.rewrite(url);

    // Set headers for the response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Unknown domain - show site not found
  if (!isLocalhost) {
    url.pathname = "/site-not-found";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sites/).*)"],
};
