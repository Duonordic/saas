import { ApiSettings } from "@/components/dashboard/settings/api-settings";
import { BillingSettings } from "@/components/dashboard/settings/billing-settings";
import { BrandingSettings } from "@/components/dashboard/settings/branding-settings";
import { DomainSettings } from "@/components/dashboard/settings/domain-settings";
import { GeneralSettings } from "@/components/dashboard/settings/general-setting";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { SettingsHeader } from "@/components/dashboard/settings/settings-header";
import { SettingsNav } from "@/components/dashboard/settings/settings-nav";
import { TeamSettings } from "@/components/dashboard/settings/team-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentTenant } from "@/utils/tenant-utils";
import { notFound } from "next/navigation";

interface SettingsPageProps {
  params: Promise<{
    section?: string[];
  }>;
}
export default async function SettingsPage({ params }: SettingsPageProps) {
  const tenant = await getCurrentTenant();
  const { section: sectionArray } = await params;
  const section = sectionArray?.[0] || "general";

  if (!tenant) {
    console.log("No tenant");
    return notFound();
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <SettingsHeader tenant={tenant} />

      <div className="flex-1 min-h-0 grid grid-cols-[180px_1fr]">
        <SettingsNav currentSection={section} />

        <ScrollArea className="h-full overflow-y-auto">
          {section === "general" && <GeneralSettings tenant={tenant} />}
          {section === "domain" && <DomainSettings tenant={tenant} />}
          {section === "branding" && <BrandingSettings tenant={tenant} />}
          {section === "team" && <TeamSettings tenant={tenant} />}
          {section === "notifications" && (
            <NotificationSettings tenant={tenant} />
          )}
          {section === "security" && <SecuritySettings tenant={tenant} />}
          {section === "billing" && <BillingSettings tenant={tenant} />}
          {section === "api" && <ApiSettings tenant={tenant} />}
        </ScrollArea>
      </div>
    </div>
  );
}
