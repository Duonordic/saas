import { DashboardHeader } from "@/components/dashboard/header";
import SiteOverview from "@/components/dashboard/site-overview";
import { getTenantFromHeaders } from "@/lib/tenant";

export default async function DashboardPage() {
  const tenant = await getTenantFromHeaders();

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader tenant={tenant} />
      <SiteOverview tenant={tenant} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          {/* Dashboard actions */}
        </div>
        <div className="bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          {/* Recent activity feed */}
        </div>
      </div>
    </div>
  );
}
