// components/dashboard/recent-deployments.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deploymentService } from "@/lib/services/deployment-service";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface RecentDeploymentsProps {
  tenantId: string;
}

export async function RecentDeployments({ tenantId }: RecentDeploymentsProps) {
  const deployments = await deploymentService.listDeployments(tenantId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "building":
      case "deploying":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default";
      case "failed":
        return "destructive";
      case "building":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Deployments</CardTitle>
        <CardDescription>
          Your most recent application deployments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {deployments.slice(0, 5).map((deployment) => (
          <div
            key={deployment.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(deployment.status)}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{deployment.name}</span>
                <span className="text-xs text-muted-foreground">
                  {deployment.template.name}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(deployment.status)}>
                {deployment.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(deployment.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {deployments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No deployments yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
