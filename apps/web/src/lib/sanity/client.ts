import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "../../config";
import { Tenant } from "@/lib/tenant";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    studioUrl,
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
  },
});

export function createTenantClient(tenant: Tenant) {
  return createClient({
    projectId: tenant.sanityProjectId,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
    token: process.env.SANITY_API_TOKEN, // For mutations
  });
}

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");

// Should this really be here?
export async function getPageData(projectId: string, pageType: string) {
  const client = createClient({
    projectId,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  try {
    const query = `*[_type == "page" && pageType == $pageType][0]{
      _id,
      _type,
      title,
      pageBuilder[]{
        _type,
        _key,
        ...,
        // Add all your block types here
        _type == "hero" => {
          heading,
          subheading,
          ctaButton,
          image
        },
        _type == "cta" => {
          title,
          description,
          buttons
        }
        // ... other block types
      }
    }`;

    return await client.fetch(query, { pageType });
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}
