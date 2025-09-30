// components/dashboard/deployment-timeline.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deploymentService } from "@/lib/services/deployment-service";
import { CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import { PropsWithChildren } from "react";

interface DeploymentTimelineProps {
  tenantId: string;
}

export async function DeploymentTimeline({
  tenantId,
}: PropsWithChildren<DeploymentTimelineProps>) {
  const deployments = await deploymentService.listDeployments(tenantId);

  const getStatusConfig = (status: string) => {
    const config = {
      running: {
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500",
      },
      failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500" },
      building: { icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500" },
      deploying: { icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500" },
      pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500" },
      queued: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500" },
    };
    return config[status as keyof typeof config] || config.pending;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Activity</CardTitle>
        <CardDescription>Recent deployment status updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployments.slice(0, 4).map((deployment, index) => {
            const {
              icon: Icon,
              color,
              bg,
            } = getStatusConfig(deployment.status);
            return (
              <div key={deployment.id} className="flex items-start space-x-3">
                <div className={`rounded-full p-1 ${bg} mt-0.5`}>
                  <Icon className={`h-3 w-3 ${color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{deployment.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(deployment.updated_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {deployment.status.replace(/_/g, " ")} •{" "}
                    {deployment.template.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
