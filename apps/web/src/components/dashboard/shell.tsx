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
          <header className="bg-background border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <span className="text-sm text-muted-foreground">
                  {tenant.domain}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {/* User menu, notifications, etc. */}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
