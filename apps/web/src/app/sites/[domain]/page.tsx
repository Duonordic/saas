import { getTenantTemplateSafe } from "@/lib/templates/registry";
import { getTenantFromHeaders } from "@/lib/tenant";
import { FALLBACK_TENANT } from "@/lib/tenant";
import { generateTenantMetadata } from "@/lib/seo";
import { getPageData } from "@/lib/sanity/client";

interface TenantHomePageProps {
  params: { domain: string };
}

export async function generateMetadata({ params }: TenantHomePageProps) {
  try {
    const tenant = await getTenantFromHeaders();
    return generateTenantMetadata(tenant, {
      slug: "/",
      pageType: "website",
    });
  } catch (error) {
    return generateTenantMetadata(FALLBACK_TENANT, {
      slug: "/",
      pageType: "website",
    });
  }
}

export default async function TenantHomePage({ params }: TenantHomePageProps) {
  let tenant;
  try {
    tenant = await getTenantFromHeaders();
  } catch (error) {
    tenant = FALLBACK_TENANT;
  }

  const template = await getTenantTemplateSafe(tenant.template);
  const HomePage = template.components.HomePage;

  // Fetch page data from tenant's Sanity project
  const pageData = await getPageData(tenant.sanityProjectId, "home");

  return <HomePage tenant={tenant} pageData={pageData} />;
}
