import { ErrorBoundary } from "@/components/error-boundary";
import { getTenantTemplateSafe } from "@/lib/templates/registry";
import { getTenantFromHeaders } from "@/lib/tenant";
import { FALLBACK_TENANT } from "@/lib/tenant";

interface TenantSiteLayoutProps {
  children: React.ReactNode;
  params: { domain: string };
}

export default async function TenantSiteLayout({
  children,
  params,
}: TenantSiteLayoutProps) {
  let tenant;
  try {
    tenant = await getTenantFromHeaders();
  } catch (error) {
    console.error("Error getting tenant:", error);
    tenant = FALLBACK_TENANT;
  }

  const template = await getTenantTemplateSafe(tenant.template);
  const LayoutComponent = template.components.Layout;

  return (
    <ErrorBoundary fallback={<FallbackLayout tenant={tenant} />}>
      <LayoutComponent tenant={tenant}>{children}</LayoutComponent>
    </ErrorBoundary>
  );
}

// Fallback layout when template fails to load
function FallbackLayout({ tenant }: { tenant: any }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Site Temporarily Unavailable
        </h1>
        <p className="text-gray-600">
          We're experiencing technical difficulties. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mt-2">{tenant.domain}</p>
      </div>
    </div>
  );
}
