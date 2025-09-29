import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // In dev, we use ?tenant=subdomain query param instead of actual subdomains
  // Example: localhost:3000?tenant=acme
  const tenantParam = url.searchParams.get("tenant");

  if (tenantParam) {
    // Clone the URL and remove the tenant param
    const newUrl = url.clone();
    newUrl.searchParams.delete("tenant");

    // Create response and pass tenant via header
    const response = NextResponse.rewrite(newUrl);
    response.headers.set("x-tenant-subdomain", tenantParam);
    return response;
  }

  return NextResponse.next();
}
