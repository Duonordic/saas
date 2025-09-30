// components/dashboard/stats-overview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Rocket, Box, Users } from "lucide-react";

interface StatsOverviewProps {
  tenantId: string;
}

export async function StatsOverview({ tenantId }: StatsOverviewProps) {
  // Mock data - replace with actual service calls
  const stats = {
    activeDeployments: 3,
    totalDeployments: 12,
    templatesUsed: 5,
    teamMembers: 4,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Deployments
          </CardTitle>
          <Rocket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeDeployments}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalDeployments} total deployments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.templatesUsed}</div>
          <p className="text-xs text-muted-foreground">
            Across all deployments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.teamMembers}</div>
          <p className="text-xs text-muted-foreground">Active team members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Active</div>
          <p className="text-xs text-muted-foreground">
            All systems operational
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
