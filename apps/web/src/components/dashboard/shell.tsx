import { Tenant } from "@/lib/tenant";
import { Sidebar } from "./sidebar";
import { DashboardProvider } from "./dashboard-context";

interface DashboardShellProps {
  tenant: Tenant;
  children: React.ReactNode;
}

export function DashboardShell({ tenant, children }: DashboardShellProps) {
  return (
    <DashboardProvider tenant={tenant}>
      <div className="flex h-screen bg-background">
        <Sidebar tenant={tenant} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b h-14 flex items-center gap-4 px-4 bg-sidebar">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {tenant.domain}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* User menu, notifications, etc. */}
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
