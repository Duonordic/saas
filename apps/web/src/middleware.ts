import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host")!;

  // Define your main app and dashboard domains from environment variables
  const mainAppDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "duonordic.com";
  const dashboardDomain = `app.${mainAppDomain}`;

  // If the request is for the main domain, rewrite to the (main) group
  // This includes `duonordic.com` and `www.duonordic.com`
  if (hostname.includes(mainAppDomain)) {
    url.pathname = `/(main)${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // If the request is for the dashboard subdomain, rewrite to the (dashboard) group
  if (hostname === dashboardDomain) {
    url.pathname = `/(dashboard)${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Otherwise, assume it's a tenant and rewrite to the (tenant) group
  url.pathname = `/(tenant)${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all paths except for static files, image optimization, and API routes
    "/((?!_next/static|_next/image|api|favicon.ico).*)",
  ],
};
