import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { MoreVertical, Crown, Shield, Eye, User, InfoIcon } from "lucide-react";
import { SettingSection } from "./settings-section";
import { InviteUserButton } from "@/components/ui/buttons/invite-user-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GridSpacer,
  GridTable,
  GridTableRow,
  GridTableCell,
  GridCard,
  GridStats,
  GridStatItem,
} from "@/components/ui/grid";

interface TeamSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock data
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

const roleDescriptions = {
  owner:
    "Full access to all workspace settings, billing, and member management",
  admin: "Can manage deployments, team members, and workspace settings",
  member: "Can view and manage their own deployments",
};

export function TeamSettings({ tenant }: TeamSettingsProps) {
  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Team Members"
        description="Manage who has access to your workspace"
      >
        <div className="flex justify-between items-center pl-4 mx-4 border-x">
          <div className="text-sm text-muted-foreground">
            {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
          </div>
          <InviteUserButton />
        </div>

        <GridTable headers={["Member", "Role", "Last Active", ""]}>
          {teamMembers.map((member) => (
            <GridTableRow key={member.id}>
              <GridTableCell>
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
              </GridTableCell>
              <GridTableCell>
                <Badge variant="outline" className="capitalize gap-1">
                  {member.role === "owner" && <Crown className="w-3 h-3" />}
                  {member.role === "admin" && <Shield className="w-3 h-3" />}
                  {member.role === "member" && <User className="w-3 h-3" />}
                  {member.role === "viewer" && <Eye className="w-3 h-3" />}
                  {member.role}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="text-accent w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="relative z-[1] max-w-48">
                          <div className="flex items-center gap-1 mb-2">
                            {member.role === "owner" && (
                              <Crown className="w-4 h-4 text-primary" />
                            )}
                            {member.role === "admin" && (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                            {member.role === "member" && (
                              <Eye className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-sm font-semibold capitalize">
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs">
                            {
                              roleDescriptions[
                                member.role as keyof typeof roleDescriptions
                              ]
                            }
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </GridTableCell>
              <GridTableCell>
                <div className="text-sm text-muted-foreground">
                  {member.lastActive}
                </div>
              </GridTableCell>
              <GridTableCell>
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </GridTableCell>
            </GridTableRow>
          ))}
        </GridTable>

        <GridSpacer />
      </SettingSection>

      {pendingInvites.length > 0 && (
        <SettingSection
          title="Pending Invitations"
          description="Users who haven't accepted their invite yet"
        >
          <GridSpacer />

          <GridTable
            headers={["Email", "Role", "Actions"]}
            customColTemplate="2fr 1fr 1fr"
          >
            {pendingInvites.map((invite) => (
              <GridTableRow key={invite.id}>
                <GridTableCell>
                  <div>
                    <div className="text-sm font-medium">{invite.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Invited {invite.sentAt}
                    </div>
                  </div>
                </GridTableCell>
                <GridTableCell>
                  <Badge variant="secondary" className="capitalize">
                    {invite.role}
                  </Badge>
                </GridTableCell>
                <GridTableCell>
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-muted-foreground hover:text-foreground">
                      Resend
                    </button>
                    <button className="text-xs text-destructive hover:text-destructive/80">
                      Revoke
                    </button>
                  </div>
                </GridTableCell>
              </GridTableRow>
            ))}
          </GridTable>

          <GridSpacer />
        </SettingSection>
      )}

      <SettingSection
        className="h-full"
        title="Role Permissions"
        description="What each role can do in your workspace"
      >
        <GridSpacer />

        <GridStats columns={3}>
          <GridStatItem>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Owner</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full access to all workspace settings, billing, and member
              management
            </p>
          </GridStatItem>

          <GridStatItem>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can manage deployments, team members, and workspace settings
            </p>
          </GridStatItem>

          <GridStatItem>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Member</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can view and manage their own deployments
            </p>
          </GridStatItem>
        </GridStats>

        <GridSpacer />
      </SettingSection>
    </div>
  );
}
