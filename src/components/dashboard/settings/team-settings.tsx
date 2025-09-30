import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { MoreVertical, Crown, Shield, Eye, UserPlus } from "lucide-react";
import { SettingSection } from "./settings-section";
import { ClientButton } from "@/components/ui/save-button";
import { InviteUserButton } from "@/components/ui/buttons/invite-user-button";

interface TeamSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock data - replace with actual data fetching
const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "member",
    lastActive: "3 days ago",
  },
];

const pendingInvites = [
  { id: "1", email: "alice@example.com", role: "member", sentAt: "2 days ago" },
];

export function TeamSettings({ tenant }: TeamSettingsProps) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Team Members"
        description="Manage who has access to your workspace"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
          </div>
          <InviteUserButton />
        </div>

        <div className="border rounded-md divide-y">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {member.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize gap-1">
                  {member.role === "owner" && <Crown className="w-3 h-3" />}
                  {member.role === "admin" && <Shield className="w-3 h-3" />}
                  {member.role === "member" && <Eye className="w-3 h-3" />}
                  {member.role}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {member.lastActive}
                </div>
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingSection>

      {pendingInvites.length > 0 && (
        <SettingSection
          title="Pending Invitations"
          description="Users who haven't accepted their invite yet"
        >
          <div className="border border-dashed rounded-md divide-y divide-dashed">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{invite.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Invited {invite.sentAt}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {invite.role}
                  </Badge>
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Resend
                  </button>
                  <button className="text-xs text-destructive hover:text-destructive/80">
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SettingSection>
      )}

      <SettingSection
        title="Role Permissions"
        description="What each role can do in your workspace"
      >
        <div className="grid gap-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Owner</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full access to all workspace settings, billing, and member
              management
            </p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can manage deployments, team members, and workspace settings
            </p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Member</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can view and manage their own deployments
            </p>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
