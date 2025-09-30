import { Tenant } from "@/generated/prisma";
import { SettingField } from "./setting-field";
import { SettingSection } from "./settings-section";
import { ImageUpload } from "@/components/ui/image-upload";
import { ColorPicker } from "@/components/ui/color-picker";
import { Save } from "lucide-react";
import { ClientButton } from "@/components/ui/save-button";
import { SaveButton } from "@/components/ui/buttons/save-button";

interface BrandingSettingsProps {
  tenant: Partial<Tenant>;
}

export function BrandingSettings({ tenant }: BrandingSettingsProps) {
  const branding = tenant.config?.branding || {};
  const theme = tenant.config?.theme || {};

  return (
    <div className="space-y-8">
      <SettingSection
        title="Logo & Identity"
        description="Customize your workspace visual identity"
      >
        <SettingField
          label="Logo"
          description="Upload your company logo (recommended: 200x50px, PNG or SVG)"
          htmlFor="logo"
        >
          <ImageUpload
            id="logo"
            currentImage={branding.logoUrl}
            aspectRatio="logo"
          />
        </SettingField>

        <SettingField
          label="Favicon"
          description="Small icon displayed in browser tabs (32x32px)"
          htmlFor="favicon"
        >
          <ImageUpload
            id="favicon"
            currentImage={branding.faviconUrl}
            aspectRatio="square"
          />
        </SettingField>
      </SettingSection>

      <SettingSection
        title="Color Scheme"
        description="Define your brand colors"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingField
            label="Primary Color"
            description="Main brand color"
            htmlFor="primary-color"
          >
            <ColorPicker
              id="primary-color"
              name="primaryColor"
              defaultValue={theme.primaryColor || "#3B82F6"}
            />
          </SettingField>

          <SettingField
            label="Secondary Color"
            description="Accent and highlights"
            htmlFor="secondary-color"
          >
            <ColorPicker
              id="secondary-color"
              name="secondaryColor"
              defaultValue={theme.secondaryColor || "#10B981"}
            />
          </SettingField>
        </div>
      </SettingSection>

      <SettingSection
        title="Typography"
        description="Choose your preferred font family"
      >
        <SettingField
          label="Font Family"
          description="Applied across your deployed sites"
          htmlFor="font-family"
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
        </SettingField>
      </SettingSection>

      <SettingSection
        title="Custom CSS"
        description="Add custom styles to your sites"
      >
        <SettingField
          label="CSS Override"
          description="Advanced styling options"
          htmlFor="custom-css"
        >
          <textarea
            id="custom-css"
            name="customCSS"
            rows={8}
            placeholder=".my-custom-class { color: red; }"
            defaultValue={branding.customCSS}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
          />
        </SettingField>
      </SettingSection>

      <div className="flex justify-end pt-4 border-t">
        <SaveButton />
      </div>
    </div>
  );
}
