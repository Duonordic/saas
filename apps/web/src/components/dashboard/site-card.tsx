import Link from "next/link";
import { cn } from "@dn/ui/lib/utils";
import { Badge } from "@dn/ui/components/badge";
import { Button } from "@dn/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@dn/ui/components/card";
import { Eye, Settings, ExternalLink } from "lucide-react";
import { Site } from "@/lib/templates/types";

interface SiteCardProps {
  site: Site;
  className?: string;
}

const statusConfig = {
  live: { label: "Live", variant: "success" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  building: { label: "Building", variant: "warning" as const },
  error: { label: "Error", variant: "destructive" as const },
};

export function SiteCard({ site, className }: SiteCardProps) {
  const status = statusConfig[site.status];

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{site.name}</h3>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{site.domain}</p>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Template</span>
          <span className="capitalize">{site.template}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Pages</span>
          <span>{site.pageCount || 0}</span>
        </div>
        {site.lastDeployed && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Last deployed</span>
            <span className="text-xs">
              {new Date(site.lastDeployed).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-3 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/sites/${site.id}`}>
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Link>
        </Button>

        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/sites/${site.id}/preview`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>

          {site.status === "live" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`https://${site.domain}`} target="_blank">
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
