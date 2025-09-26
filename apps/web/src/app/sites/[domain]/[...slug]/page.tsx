import { getPageData } from "@/lib/sanity/client";
import { generateTenantMetadata } from "@/lib/seo";
import { getTenantTemplateSafe } from "@/lib/templates/registry";
import { getTenantFromHeaders } from "@/lib/tenant";

import { FALLBACK_TENANT } from "@/lib/tenant";

interface TenantDynamicPageProps {
  params: { domain: string; slug: string[] };
}

export async function generateMetadata({ params }: TenantDynamicPageProps) {
  try {
    const tenant = await getTenantFromHeaders();
    const slug = `/${params.slug.join("/")}`;

    return generateTenantMetadata(tenant, {
      slug,
      pageType: "article", // Default to article, can be overridden by page data
    });
  } catch (error) {
    return generateTenantMetadata(FALLBACK_TENANT);
  }
}

export default async function TenantDynamicPage({
  params,
}: TenantDynamicPageProps) {
  let tenant;
  try {
    tenant = await getTenantFromHeaders();
  } catch (error) {
    tenant = FALLBACK_TENANT;
  }

  const template = await getTenantTemplateSafe(tenant.template);

  // Determine which page component to render based on slug
  const pageType = params.slug[0] || "home";
  const pageComponentName = `${pageType.charAt(0).toUpperCase() + pageType.slice(1)}Page`;
  const PageComponent =
    template.components[pageComponentName] || template.components.HomePage;

  // Fetch page data
  const pageData = await getPageData(tenant.sanityProjectId, pageType);

  return <PageComponent tenant={tenant} pageData={pageData} />;
}
