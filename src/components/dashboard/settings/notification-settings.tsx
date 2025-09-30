import { SettingField } from "./setting-field";
import { Tenant } from "@/generated/prisma";
import { SettingSection } from "./settings-section";
import { ClientToggle } from "@/components/ui/client-toggle";
import { ClientButton } from "@/components/ui/save-button";
import { Save } from "lucide-react";
import { SaveButton } from "@/components/ui/buttons/save-button";

interface NotificationSettingsProps {
  tenant: Partial<Tenant>;
}

export function NotificationSettings({ tenant }: NotificationSettingsProps) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Email Notifications"
        description="Choose what updates you want to receive"
      >
        <ClientToggle
          id="deploy-success"
          label="Deployment Success"
          description="When your deployment completes successfully"
          defaultChecked={true}
        />
        <ClientToggle
          id="deploy-failure"
          label="Deployment Failure"
          description="When a deployment fails or encounters errors"
          defaultChecked={true}
        />
        <ClientToggle
          id="domain-verified"
          label="Domain Verification"
          description="When a custom domain is verified"
          defaultChecked={true}
        />
        <ClientToggle
          id="ssl-renewal"
          label="SSL Certificate Renewal"
          description="SSL certificate renewal reminders"
          defaultChecked={false}
        />
      </SettingSection>

      <SettingSection
        title="Team Notifications"
        description="Updates about your team and workspace"
      >
        <ClientToggle
          id="team-invite"
          label="Team Invitations"
          description="When someone is invited to your workspace"
          defaultChecked={true}
        />
        <ClientToggle
          id="team-join"
          label="Member Joined"
          description="When a team member accepts an invitation"
          defaultChecked={false}
        />
        <ClientToggle
          id="role-change"
          label="Role Changes"
          description="When team member roles are updated"
          defaultChecked={true}
        />
      </SettingSection>

      <SettingSection
        title="Security Notifications"
        description="Important security alerts"
      >
        <ClientToggle
          id="security-login"
          label="New Login"
          description="Alert on new device or location login"
          defaultChecked={true}
        />
        <ClientToggle
          id="security-api"
          label="API Key Usage"
          description="Notify on API key creation or deletion"
          defaultChecked={true}
        />
        <ClientToggle
          id="security-password"
          label="Password Changes"
          description="When your password is changed"
          defaultChecked={true}
        />
      </SettingSection>

      <SettingSection
        title="Billing Notifications"
        description="Updates about your subscription and payments"
      >
        <ClientToggle
          id="billing-invoice"
          label="Invoice Generated"
          description="Monthly invoice notifications"
          defaultChecked={true}
        />
        <ClientToggle
          id="billing-payment"
          label="Payment Received"
          description="Confirmation when payment is processed"
          defaultChecked={false}
        />
        <ClientToggle
          id="billing-failed"
          label="Payment Failed"
          description="Alert when a payment fails"
          defaultChecked={true}
        />
      </SettingSection>

      <SettingSection
        title="Product Updates"
        description="News about features and improvements"
      >
        <ClientToggle
          id="product-features"
          label="New Features"
          description="Learn about new platform capabilities"
          defaultChecked={false}
        />
        <ClientToggle
          id="product-changelog"
          label="Changelog Digest"
          description="Weekly summary of changes"
          defaultChecked={false}
        />
      </SettingSection>

      <div className="flex justify-end pt-4 border-t">
        <SaveButton />
      </div>
    </div>
  );
}
