import { DashboardHeader } from "@/components/dashboard/header";
import ThemeEditor from "@/components/dashboard/theme-editor";
import { getTenantFromHeaders } from "@/lib/tenant";

export default async function DesignPage() {
  const tenant = await getTenantFromHeaders();

  return (
    <div className="p-6">
      <DashboardHeader
        tenant={tenant}
        title="Design"
        description="Customize your site's appearance"
      />

      <ThemeEditor tenant={tenant} />
    </div>
  );
}
