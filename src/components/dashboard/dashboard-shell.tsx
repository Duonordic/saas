import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tenant } from "@/generated/prisma";
import { PropsWithChildren } from "react";

interface BreadCrumb {
  label: string;
  href: string;
  isLast: boolean;
}

interface DashboardShellProps {
  tenant: Tenant;
  breadcrumbs: BreadCrumb[];
}

export async function DashboardShell({
  tenant,
  children,
  breadcrumbs,
}: PropsWithChildren<DashboardShellProps>) {
  /* TODO: Implement breadcrumbs properly */
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar tenant={tenant} />

      <SidebarInset className="border bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="contents">
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && (
                      <BreadcrumbSeparator
                        className={index === 0 ? "hidden md:block" : ""}
                      />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
