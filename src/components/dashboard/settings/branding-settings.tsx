import { Tenant } from "@/generated/prisma";
import { SettingSection } from "./settings-section";
import { ImageUpload } from "@/components/ui/image-upload";
import { SaveButton } from "@/components/ui/buttons/save-button";
import { CSSVariablesEditor } from "@/components/dashboard/settings/css-var-editor";
import { GridSpacer, GridRow, GridCard } from "@/components/ui/grid";

interface BrandingSettingsProps {
  tenant: Partial<Tenant>;
}

export function BrandingSettings({ tenant }: BrandingSettingsProps) {
  const branding = tenant.config?.branding || {};
  const theme = tenant.config?.theme || {};

  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Logo & Identity"
        description="Customize your workspace visual identity"
      >
        <GridSpacer />

        <GridRow
          label="Logo"
          description="Upload your company logo (recommended: 200x50px, PNG or SVG)"
          isFirst
        >
          <ImageUpload
            id="logo"
            currentImage={branding.logoUrl}
            aspectRatio="logo"
          />
        </GridRow>

        <GridRow
          label="Favicon"
          description="Small icon displayed in browser tabs (32x32px)"
        >
          <ImageUpload
            id="favicon"
            currentImage={branding.faviconUrl}
            aspectRatio="square"
          />
        </GridRow>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        title="Typography"
        description="Choose your preferred font family"
      >
        <GridSpacer />

        <GridRow
          label="Font Family"
          description="Applied across your deployed sites"
          isFirst
        >
          <select
            id="font-family"
            name="fontFamily"
            defaultValue={theme.fontFamily || "Inter"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Poppins">Poppins</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </GridRow>

        <GridSpacer />
      </SettingSection>

      <CSSVariablesEditor defaultValues={theme.cssVariables} />

      <div className="flex justify-end p-4 border-l bg-background-light border-t">
        <SaveButton />
      </div>
    </div>
  );
}
