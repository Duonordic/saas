// app/dashboard/deployments/page.tsx
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { DeploymentTimeline } from "@/components/dashboard/deployment-timeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DeploymentsPageProps {
  tenantId: string;
}

export default async function DeploymentsPage({
  tenantId,
}: DeploymentsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="text-muted-foreground">
            Manage and monitor your application deployments
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/deployments/new">
            <Plus className="h-4 w-4 mr-2" />
            New Deployment
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* <RecentDeployments tenantId={tenantId} /> */}
        </div>
        <div>{/* <DeploymentTimeline tenantId={tenantId} /> */}</div>
      </div>
    </div>
  );
}
