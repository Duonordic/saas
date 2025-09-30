// components/dashboard/resource-usage.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ResourceUsage() {
  const usage = {
    deployments: { used: 3, total: 10 },
    storage: { used: 2.5, total: 50 }, // GB
    bandwidth: { used: 15, total: 100 }, // GB
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Usage</CardTitle>
        <CardDescription>Current plan usage and limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Deployments</span>
            <span>
              {usage.deployments.used} / {usage.deployments.total}
            </span>
          </div>
          <Progress
            value={(usage.deployments.used / usage.deployments.total) * 100}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage</span>
            <span>
              {usage.storage.used}GB / {usage.storage.total}GB
            </span>
          </div>
          <Progress value={(usage.storage.used / usage.storage.total) * 100} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Bandwidth</span>
            <span>
              {usage.bandwidth.used}GB / {usage.bandwidth.total}GB
            </span>
          </div>
          <Progress
            value={(usage.bandwidth.used / usage.bandwidth.total) * 100}
          />
        </div>
      </CardContent>
    </Card>
  );
}
