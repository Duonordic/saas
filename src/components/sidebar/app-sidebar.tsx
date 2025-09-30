"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Box,
  Command,
  FileText,
  Frame,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Rocket,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavCta } from "./nav-cta";
import { NavUser } from "./nav-user";
import { Tenant } from "@/generated/prisma";
import Link from "next/link";

export function AppSidebar({
  tenant,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tenant: Tenant }) {
  const data = {
    user: {
      name: "user",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Deployments",
        url: "/dashboard/deployments",
        icon: Rocket,
      },
      {
        title: "Templates",
        url: "/dashboard/templates",
        icon: Box,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Documentation",
        url: "https://docs.yoursaas.com",
        icon: FileText,
      },
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
    ],
    projects: [
      {
        name: "Production",
        url: "/dashboard/deployments?environment=production",
        icon: Zap,
      },
      {
        name: "Staging",
        url: "/dashboard/deployments?environment=staging",
        icon: Globe,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{tenant.domain}</span>
                  <span className="truncate text-xs">
                    {(tenant.plan && tenant.plan) || "No Active Plan"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavCta
          title="Upgrade to Business"
          description="Get advanced features and priority support"
          actionText="Upgrade Now"
          onAction={() => console.log("Upgrade clicked!")}
        />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
