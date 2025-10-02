import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";

interface SettingsHeaderProps {
  tenant: Partial<Tenant>;
}

export function SettingsHeader({ tenant }: SettingsHeaderProps) {
  return (
    <div className="p-4 flex items-start justify-between pb-6 border-b">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace configuration and preferences
        </p>
      </div>
      <Badge variant="outline" className="capitalize">
        {tenant.plan || "free"} plan
      </Badge>
    </div>
  );
}
