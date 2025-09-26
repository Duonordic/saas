import { DashboardHeader } from "@/components/dashboard/header";
import SiteTabs from "@/components/dashboard/site-tabs";
import { getTenantFromHeaders } from "@/lib/tenant";

interface SitePageProps {
  params: {
    siteId: string;
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const tenant = await getTenantFromHeaders();

  // Fetch site data based on siteId
  const site = {
    id: params.siteId,
    name: "My Site",
    domain: tenant.domain,
    template: tenant.template,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="p-6">
      <DashboardHeader
        tenant={tenant}
        title={site.name}
        description={site.domain ? site.domain : undefined}
      />

      <SiteTabs siteId={params.siteId} />

      <div className="mt-6">
        {/* Site overview content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-semibold">Visitors</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-semibold">Pages</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-semibold">Status</h3>
            <p className="text-green-600 font-semibold">Live</p>
          </div>
        </div>
      </div>
    </div>
  );
}
