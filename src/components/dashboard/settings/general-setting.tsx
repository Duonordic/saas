import { SettingField } from "./setting-field";
import { Tenant } from "@/generated/prisma";
import { SettingSection } from "./settings-section";
import { SaveButton } from "@/components/ui/buttons/save-button";

interface GeneralSettingsProps {
  tenant: Partial<Tenant>;
}

export function GeneralSettings({ tenant }: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Workspace Information"
        description="Basic information about your workspace"
      >
        <SettingField
          label="Workspace Name"
          description="This is the display name for your workspace"
          htmlFor="workspace-name"
        >
          <input
            id="workspace-name"
            name="name"
            type="text"
            defaultValue={tenant.name}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </SettingField>

        <SettingField
          label="Workspace Slug"
          description="Used in your workspace URL and API endpoints"
          htmlFor="workspace-slug"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              app.yourplatform.com/
            </span>
            <input
              id="workspace-slug"
              name="slug"
              type="text"
              defaultValue={tenant.slug}
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </SettingField>

        <SettingField
          label="Sanity Project ID"
          description="Your headless CMS project identifier"
          htmlFor="sanity-id"
        >
          <input
            id="sanity-id"
            name="sanityProjectId"
            type="text"
            defaultValue={tenant.sanityProjectId}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </SettingField>
      </SettingSection>

      <SettingSection
        title="Workspace Status"
        description="Current state of your workspace"
      >
        <div className="grid grid-cols-2 gap-4 p-4 border border-dashed rounded-md">
          <div>
            <div className="text-sm font-medium">Status</div>
            <div className="text-sm text-muted-foreground capitalize mt-1">
              {tenant.status || "active"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Plan</div>
            <div className="text-sm text-muted-foreground capitalize mt-1">
              {tenant.plan || "free"}
            </div>
          </div>
        </div>
      </SettingSection>

      <div className="flex justify-end pt-4 border-t">
        <SaveButton />
      </div>
    </div>
  );
}
