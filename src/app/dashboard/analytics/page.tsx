// app/dashboard/analytics/page.tsx
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deploymentService } from "@/lib/services/deployment-service";
import { Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default async function AnalyticsPage() {
  const deployments = await deploymentService.listDeployments(
    "current-tenant-id"
  );

  // Calculate stats
  const totalDeployments = deployments.length;
  const successfulDeployments = deployments.filter(
    (d) => d.status === "running"
  ).length;
  const averageDeployTime = 2.5; // Mock data - calculate from actual deployment times

  const templateUsage = deployments.reduce((acc, deployment) => {
    const templateName = deployment.template.name;
    acc[templateName] = (acc[templateName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into your deployment performance and usage
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalDeployments}</p>
                <p className="text-sm text-muted-foreground">
                  Total Deployments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{successfulDeployments}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{averageDeployTime}m</p>
                <p className="text-sm text-muted-foreground">
                  Avg. Deploy Time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.keys(templateUsage).length}
                </p>
                <p className="text-sm text-muted-foreground">Templates Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Chart */}
      <AnalyticsOverview />

      {/* Template Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Template Usage</CardTitle>
          <CardDescription>
            Most frequently used templates across your deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(templateUsage)
              .sort(([, a], [, b]) => b - a)
              .map(([template, count]) => (
                <div
                  key={template}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{template}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{
                          width: `${(count / totalDeployments) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
