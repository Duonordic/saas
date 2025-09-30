import { DeploymentTimeline } from "@/components/dashboard/deployment-timeline";
import { QuickDeployGrid } from "@/components/dashboard/quick-deply-grid";
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { ResourceUsage } from "@/components/dashboard/resource-usage";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { getCurrentTenantId } from "@/utils/tenant-utils";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    console.log("tenantId", tenantId);
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {"Welcome back! Here's what's happening with your deployments."}
        </p>
      </div>
      <StatsOverview tenantId={tenantId} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* <RecentDeployments tenantId={tenantId} /> */}
        </div>
        <div className="space-y-6">
          {/* <DeploymentTimeline tenantId={tenantId} /> */}
          <ResourceUsage />
        </div>
      </div>
      <QuickDeployGrid />
    </div>
  );
}
