import { SettingField } from "./setting-field";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import {
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Clock,
  Save,
} from "lucide-react";
import { SettingSection } from "./settings-section";
import { ClientButton } from "@/components/ui/save-button";
import { SaveButton } from "@/components/ui/buttons/save-button";

interface SecuritySettingsProps {
  tenant: Partial<Tenant>;
}

// Mock session data
const activeSessions = [
  {
    id: "1",
    device: "Chrome on MacOS",
    location: "Oslo, Norway",
    current: true,
    lastActive: "Active now",
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Oslo, Norway",
    current: false,
    lastActive: "2 hours ago",
  },
];

export function SecuritySettings({ tenant }: SecuritySettingsProps) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Password"
        description="Manage your account password"
      >
        <SettingField
          label="Change Password"
          description="Ensure your password is strong and unique"
          htmlFor="current-password"
        >
          <div className="space-y-3 max-w-md">
            <input
              id="current-password"
              type="password"
              placeholder="Current password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <input
              id="new-password"
              type="password"
              placeholder="New password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </SettingField>
      </SettingSection>

      <SettingSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Authenticator App</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Not configured
                </div>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">
              Enable
            </button>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Active Sessions"
        description="Manage devices currently logged into your account"
      >
        <div className="border rounded-md divide-y">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {session.location} • {session.lastActive}
                  </div>
                </div>
              </div>
              {!session.current && (
                <button className="text-sm text-destructive hover:underline">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Security Log" description="Recent security events">
        <div className="border border-dashed rounded-md divide-y divide-dashed">
          <div className="p-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-sm">Successful login</div>
              <div className="text-xs text-muted-foreground">
                Oslo, Norway • 2 hours ago
              </div>
            </div>
          </div>
          <div className="p-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-sm">Password changed</div>
              <div className="text-xs text-muted-foreground">3 days ago</div>
            </div>
          </div>
          <div className="p-3 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <div className="flex-1">
              <div className="text-sm">Failed login attempt</div>
              <div className="text-xs text-muted-foreground">
                Unknown location • 1 week ago
              </div>
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
