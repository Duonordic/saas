import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { SettingSection } from "./settings-section";
import { SaveButton } from "@/components/ui/buttons/save-button";
import { GridRow } from "@/components/ui/grid";
import AppInput from "@/components/ui/app-input";

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
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Password"
        description="Manage your account password"
      >
        <div className="h-4 mx-4 border-x border-dashed border-border/50" />
        <GridRow
          label={"Change Password"}
          description={"Ensure your password is strong and unique"}
          columns={2}
          labelSpan={1}
          isFirst
          withoutPadding
        >
          <div className="grid grid-cols-[1rem_1fr] grid-rows-[0.75rem_1fr_0.75rem]">
            <div className="border-l border-dashed col-start-2 col-end-2 border-border/50" />
            <div className="border-l border-dashed row-start-3 row-end-3 col-start-2 col-end-2 border-border/50" />
            <div className="row-start-2 row-end-2 border-border/50" />
            <div className="border-l border-dashed flex flex-col items-center row-start-2 row-end-2 border-border/50">
              <AppInput
                id="current-password"
                type="password"
                placeholder="Current password"
                className="flex-1 min-h-9 border-x-0 border-border/50 focus-visible:border-x-1"
              />
              <div className="h-4" />
              <AppInput
                id="new-password"
                type="password"
                placeholder="New password"
                className="flex-1 min-h-9 -mx-px border-x-0 border-border/50 focus-visible:border-x-1"
              />
              <div className="h-4" />
              <AppInput
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="flex-1 min-h-9 -mx-px border-x-0 border-border/50 focus-visible:border-x-1"
              />
            </div>
            <div className="border-y border-dashed row-start-2 row-end-2 border-border/50" />
          </div>
        </GridRow>

        <div className="h-4 mx-4 border-x border-dashed border-border/50" />
      </SettingSection>

      <SettingSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed">
          <div className="p-4 border-x border-dashed bg-background-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">Authenticator App</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Not configured
                  </div>
                </div>
              </div>
              <button className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <SettingSection
        title="Active Sessions"
        description="Manage devices currently logged into your account"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed divide-y divide-dashed">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border-x border-dashed bg-background-dark flex items-center justify-between"
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
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="Security Log"
        description="Recent security events"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed divide-y divide-dashed">
          <div className="p-3 border-x border-dashed bg-background-dark flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-sm">Successful login</div>
              <div className="text-xs text-muted-foreground">
                Oslo, Norway • 2 hours ago
              </div>
            </div>
          </div>
          <div className="p-3 border-x border-dashed bg-background-dark flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-sm">Password changed</div>
              <div className="text-xs text-muted-foreground">3 days ago</div>
            </div>
          </div>
          <div className="p-3 border-x border-dashed bg-background-dark flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <div className="flex-1">
              <div className="text-sm">Failed login attempt</div>
              <div className="text-xs text-muted-foreground">
                Unknown location • 1 week ago
              </div>
            </div>
          </div>
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <div className="flex justify-end p-4 border-l bg-background-light border-t">
        <SaveButton />
      </div>
    </div>
  );
}
