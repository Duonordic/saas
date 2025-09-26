import type { Metadata } from "next";

import type { Maybe } from "@/types";
import { capitalize, getBaseUrl } from "@/utils";
import { Tenant } from "./tenant";

// Site-wide configuration interface
interface SiteConfig {
  title: string;
  description: string;
  twitterHandle: string;
  keywords: string[];
}

// Page-specific SEO data interface
interface PageSeoData extends Metadata {
  title?: string;
  description?: string;
  slug?: string;
  contentId?: string;
  contentType?: string;
  keywords?: string[];
  seoNoIndex?: boolean;
  pageType?: Extract<Metadata["openGraph"], { type: string }>["type"];
}

// OpenGraph image generation parameters
interface OgImageParams {
  type?: string;
  id?: string;
}

// Default site configuration
const siteConfig: SiteConfig = {
  title: "Duonordic",
  description: "A powerful multi-tenant SaaS platform",
  twitterHandle: "@",
  keywords: [
    "saas",
    "multi-tenant",
    "website",
    "nextjs",
    "sanity",
    "data ownership",
  ],
};

function generateOgImageUrl(params: OgImageParams = {}): string {
  const { type, id } = params;
  const searchParams = new URLSearchParams();

  if (id) searchParams.set("id", id);
  if (type) searchParams.set("type", type);

  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

function buildPageUrl({
  baseUrl,
  slug,
}: {
  baseUrl: string;
  slug: string;
}): string {
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
  return `${baseUrl}${normalizedSlug}`;
}

function extractTitle({
  pageTitle,
  slug,
  siteTitle,
}: {
  pageTitle?: Maybe<string>;
  slug: string;
  siteTitle: string;
}): string {
  if (pageTitle) return pageTitle;
  if (slug && slug !== "/") return capitalize(slug.replace(/^\//, ""));
  return siteTitle;
}

export function getSEOMetadata(page: PageSeoData = {}): Metadata {
  const {
    title: pageTitle,
    description: pageDescription,
    slug = "/",
    contentId,
    contentType,
    keywords: pageKeywords = [],
    seoNoIndex = false,
    pageType = "website",
    ...pageOverrides
  } = page;

  const baseUrl = getBaseUrl();
  const pageUrl = buildPageUrl({ baseUrl, slug });

  // Build default metadata values
  const defaultTitle = extractTitle({
    pageTitle,
    slug,
    siteTitle: siteConfig.title,
  });
  const defaultDescription = pageDescription || siteConfig.description;
  const allKeywords = [...siteConfig.keywords, ...pageKeywords];

  const ogImage = generateOgImageUrl({
    type: contentType,
    id: contentId,
  });

  const fullTitle =
    defaultTitle === siteConfig.title
      ? defaultTitle
      : `${defaultTitle} | ${siteConfig.title}`;

  // Build default metadata object
  const defaultMetadata: Metadata = {
    title: fullTitle,
    description: defaultDescription,
    metadataBase: new URL(baseUrl),
    creator: siteConfig.title,
    authors: [{ name: siteConfig.title }],
    icons: {
      icon: `${baseUrl}/favicon.ico`,
    },
    keywords: allKeywords,
    robots: seoNoIndex ? "noindex, nofollow" : "index, follow",
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: siteConfig.twitterHandle,
      title: defaultTitle,
      description: defaultDescription,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: pageType ?? "website",
      countryName: "UK",
      description: defaultDescription,
      title: defaultTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };

  // Override any defaults with page-specific metadata
  return {
    ...defaultMetadata,
    ...pageOverrides,
  };
}

interface TenantPageSeoData {
  title?: string;
  description?: string;
  slug?: string;
  contentId?: string;
  contentType?: string;
  keywords?: string[];
  seoNoIndex?: boolean;
  pageType?: Extract<Metadata["openGraph"], { type: string }>["type"];
  // Allow any additional metadata properties
  [key: string]: any;
}

function getTenantBaseUrl(tenant: Tenant): string {
  // For tenant sites, use their custom domain
  if (tenant.domain && tenant.domain !== "unknown.com") {
    return `https://${tenant.domain}`;
  }

  // Fallback to platform domain
  return process.env.NEXT_PUBLIC_APP_URL || "https://saas.com";
}

export function generateTenantMetadata(
  tenant: Tenant,
  page: TenantPageSeoData = {},
): Metadata {
  const baseUrl = getTenantBaseUrl(tenant);
  const slug = page.slug || "/";

  // Enhance page data with tenant-specific information
  const enhancedPageData = {
    ...page,
    // Use tenant's site title/description if available
    title: page.title || tenant.siteTitle,
    description: page.description || tenant.siteDescription,
    keywords: [...(page.keywords || []), ...(tenant.siteKeywords || [])],
    // Ensure proper URL construction
    slug: slug,
  };

  // Use your existing SEO function but override metadataBase
  const metadata = getSEOMetadata(enhancedPageData);

  return {
    ...metadata,
    metadataBase: new URL(baseUrl),
    // Ensure canonical URL uses tenant's domain
    alternates: {
      canonical: `${baseUrl}${slug === "/" ? "" : slug}`,
    },
    // Update openGraph URL
    openGraph: metadata.openGraph
      ? {
          ...metadata.openGraph,
          url: `${baseUrl}${slug === "/" ? "" : slug}`,
        }
      : undefined,
  };
}

// Platform-specific metadata (for marketing site)
export function generatePlatformMetadata(
  page: TenantPageSeoData = {},
): Metadata {
  return getSEOMetadata(page);
}

// Helper to automatically detect context and generate appropriate metadata
export async function generatePageMetadata(
  page: TenantPageSeoData = {},
): Promise<Metadata> {
  try {
    const { getTenantFromHeaders } = await import("./tenant");
    const tenant = await getTenantFromHeaders();

    // If we have a valid tenant (not fallback), use tenant-specific metadata
    if (tenant.id !== "fallback") {
      return generateTenantMetadata(tenant, page);
    }

    // Otherwise, use platform metadata
    return generatePlatformMetadata(page);
  } catch (error) {
    // Fallback to platform metadata
    return generatePlatformMetadata(page);
  }
}
