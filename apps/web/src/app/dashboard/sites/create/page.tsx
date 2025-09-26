import { DashboardHeader } from "@/components/dashboard/header";
import SiteCreationWizard from "@/components/dashboard/site-creation-wizard";
import { getTenantFromHeaders } from "@/lib/tenant";

export default async function CreateSitePage() {
  const tenant = await getTenantFromHeaders();

  return (
    <div className="p-6">
      <DashboardHeader
        tenant={tenant}
        title="Create New Site"
        description="Choose a template and configure your new site"
      />

      <SiteCreationWizard tenant={tenant} />
    </div>
  );
}
