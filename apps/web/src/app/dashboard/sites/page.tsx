import { DashboardHeader } from "@/components/dashboard/header";
import { SiteCard } from "@/components/dashboard/site-card";
import { Button } from "@dn/ui/components/button";
import { getTenantFromHeaders } from "@/lib/tenant";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Site } from "@/lib/templates/types";

export default async function SitesPage() {
  const tenant = await getTenantFromHeaders();

  // Proper mock data that satisfies the Site interface
  const sites: Site[] = [
    {
      id: "1",
      name: "Main Site",
      domain: tenant.domain,
      status: "live" as const,
      template: tenant.template,
      lastDeployed: new Date().toISOString(),
      pageCount: 12,
    },
    {
      id: "2",
      name: "Development",
      domain: `dev.${tenant.domain}`,
      status: "draft" as const,
      template: "blog",
      lastDeployed: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      pageCount: 5,
    },
    {
      id: "3",
      name: "Staging",
      domain: `staging.${tenant.domain}`,
      status: "building" as const,
      template: "portfolio",
      pageCount: 8,
    },
  ];

  return (
    <div className="p-6">
      <DashboardHeader
        tenant={tenant}
        title="Your Sites"
        description="Manage and create new sites"
        actions={
          <Link href="/dashboard/sites/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Site
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
}
