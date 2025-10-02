import { SettingSection } from "./settings-section";
import { Tenant } from "@/generated/prisma";
import { SaveButton } from "@/components/ui/buttons/save-button";
import {
  GridRow,
  GridSpacer,
  GridStats,
  GridStatItem,
  GridDecorative,
} from "@/components/ui/grid";

interface GeneralSettingsProps {
  tenant: Partial<Tenant>;
}

export function GeneralSettings({ tenant }: GeneralSettingsProps) {
  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Workspace Information"
        description="Basic information about your workspace"
      >
        <GridSpacer />
        <GridRow
          isFirst
          label="Workspace Name"
          description="This is the display name for your workspace"
        >
          <input
            id="workspace-name"
            name="name"
            type="text"
            defaultValue={tenant.name}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </GridRow>

        <GridRow
          label="Workspace Slug"
          description="Used in your workspace URL and API endpoints"
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
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </GridRow>

        <GridRow
          label="Sanity Project ID"
          description="Your headless CMS project identifier"
        >
          <input
            id="sanity-id"
            name="sanityProjectId"
            type="text"
            disabled
            defaultValue={tenant.sanityProjectId}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </GridRow>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="Workspace Status"
        description="Current state of your workspace"
      >
        <GridSpacer />

        <GridStats columns={3}>
          <GridStatItem
            label="Status"
            value={tenant.status || "active"}
            subtitle={"Active"}
          />
          <GridStatItem
            label="Plan"
            value={tenant.plan || "free"}
            subtitle="Billed monthly"
          />
          <GridDecorative className="bg-background-dark" pattern="crosshatch" />
        </GridStats>

        <GridSpacer />
      </SettingSection>

      <div className="flex justify-end p-4 border-l bg-background-light border-t">
        <SaveButton />
      </div>
    </div>
  );
}
