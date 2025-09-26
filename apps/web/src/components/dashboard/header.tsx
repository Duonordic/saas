import { Tenant } from "@/lib/tenant";

interface DashboardHeaderProps {
  tenant: Tenant;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  tenant,
  title = "Dashboard",
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center space-x-2">{actions}</div>
    </div>
  );
}
