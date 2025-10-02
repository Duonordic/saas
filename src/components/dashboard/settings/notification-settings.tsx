import { SettingSection } from "./settings-section";
import { Tenant } from "@/generated/prisma";
import { SaveButton } from "@/components/ui/buttons/save-button";
import {
  GridSpacer,
  GridRow,
  GridSectionHeader,
  GridList,
  GridListItem,
} from "@/components/ui/grid";
import { ClientToggle } from "@/components/ui/client-toggle";

interface NotificationSettingsProps {
  tenant: Partial<Tenant>;
}

export function NotificationSettings({ tenant }: NotificationSettingsProps) {
  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Email Notifications"
        description="Choose what updates you want to receive"
      >
        <GridSpacer />
        <GridSectionHeader isFirst>
          <div className="text-xs font-medium text-muted-foreground">
            Deployment Events
          </div>
        </GridSectionHeader>

        <GridList>
          <GridListItem>
            <ClientToggle
              id="deploy-success"
              label="Deployment Success"
              description="When your deployment completes successfully"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="deploy-failure"
              label="Deployment Failure"
              description="When a deployment fails or encounters errors"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="deploy-verification"
              label="Domain Verification"
              description="When a custom domain is verified"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="ssl-renewal"
              label="SSL Certificate Renewal"
              description="SSL certificate renewal reminders"
              defaultChecked={true}
            />
          </GridListItem>
        </GridList>

        <GridSectionHeader>
          <div className="text-xs font-medium text-muted-foreground">
            Team Activity
          </div>
        </GridSectionHeader>

        <GridList>
          <GridListItem>
            <ClientToggle
              id="team-invitations"
              label="Team Invitations"
              description="When someone is invited to your workspace"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="team-join"
              label="Member Joined"
              description="When a team member accepts an invitation"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="role-change"
              label="Role Changes"
              description="When team member roles are updated"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="ssl-renewal"
              label="SSL Certificate Renewal"
              description="SSL certificate renewal reminders"
              defaultChecked={true}
            />
          </GridListItem>
        </GridList>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        title="Security & Billing"
        description="Important alerts and updates"
      >
        <GridSpacer />

        <GridSectionHeader isFirst>
          <div className="text-xs font-medium text-muted-foreground">
            Security Alerts
          </div>
        </GridSectionHeader>

        <GridList>
          <GridListItem>
            <ClientToggle
              id="security-login"
              label="New Login"
              description="Alert on new device or location login"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="security-api"
              label="API Key Usage"
              description="Notify on API key creation or deletion"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="security-password"
              label="Password Changes"
              description="When your password is changed"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="ssl-renewal"
              label="SSL Certificate Renewal"
              description="SSL certificate renewal reminders"
              defaultChecked={true}
            />
          </GridListItem>
        </GridList>

        <GridSectionHeader>
          <div className="text-xs font-medium text-muted-foreground">
            Billing Updates
          </div>
        </GridSectionHeader>

        <GridList>
          <GridListItem>
            <ClientToggle
              id="billing-invoice"
              label="Invoice Generated"
              description="Monthly invoice notifications"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="billing-payment"
              label="Payment Received"
              description="Confirmation when payment is processed"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="billing-failed"
              label="Payment Failed"
              description="Alert when a payment fails"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="ssl-renewal"
              label="SSL Certificate Renewal"
              description="SSL certificate renewal reminders"
              defaultChecked={true}
            />
          </GridListItem>
        </GridList>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="Product Updates"
        description="News about features and improvements"
      >
        <GridSpacer />

        <GridList>
          <GridListItem>
            <ClientToggle
              id="product-features"
              label="New Features"
              description="Learn about new platform capabilities"
              defaultChecked={true}
            />
          </GridListItem>
          <GridListItem>
            <ClientToggle
              id="product-changelog"
              label="Changelog Digest"
              description="Weekly summary of changes"
              defaultChecked={true}
            />
          </GridListItem>
        </GridList>

        <GridSpacer />
      </SettingSection>

      <div className="flex justify-end p-4 border-l bg-background-light border-t">
        <SaveButton />
      </div>
    </div>
  );
}
