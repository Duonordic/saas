// components/team/team-members.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Mail, UserPlus } from "lucide-react";

interface TeamMembersProps {
  tenantId: string;
}

export async function TeamMembers({ tenantId }: TeamMembersProps) {
  // Mock team data - replace with actual user service
  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "owner",
      avatar: "",
      lastActive: new Date(),
    },
    {
      id: "2",
      name: "Sam Smith",
      email: "sam@example.com",
      role: "admin",
      avatar: "",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Taylor Brown",
      email: "taylor@example.com",
      role: "member",
      avatar: "",
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ];

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "member":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage team members and their permissions
            </CardDescription>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge variant={getRoleVariant(member.role)}>
                  {member.role}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
