"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@dn/ui/lib/utils";
import { Tenant } from "@/lib/tenant";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "📊" },
  { name: "Sites", href: "/dashboard/sites", icon: "🌐" },
  { name: "Content", href: "/dashboard/content", icon: "📝" },
  { name: "Design", href: "/dashboard/design", icon: "🎨" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "📈" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

interface SidebarProps {
  tenant: Tenant;
}

export function Sidebar({ tenant }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{tenant.domain}</h2>
        <p className="text-sm text-muted-foreground">{tenant.plan} Plan</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
