"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Settings,
  Globe,
  Palette,
  Users,
  Bell,
  Shield,
  CreditCard,
  Key,
} from "lucide-react";

interface SettingsNavProps {
  currentSection: string;
}

const navItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
];

export function SettingsNav({ currentSection }: SettingsNavProps) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;

        return (
          <Link
            key={item.id}
            href={`/dashboard/settings/${item.id}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
