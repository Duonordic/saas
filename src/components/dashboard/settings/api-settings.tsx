import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import {
  Copy,
  MoreVertical,
  Eye,
  EyeOff,
  Bot,
  ExternalLink,
} from "lucide-react";
import { SettingSection } from "./settings-section";
import { CreateApiKeyButton } from "@/components/ui/buttons/create-api-key-button";
import Link from "next/link";

interface ApiSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock API keys
const apiKeys = [
  {
    id: "1",
    name: "Production API",
    key: "pk_live_****************",
    scopes: ["read", "write"],
    lastUsed: "2 hours ago",
    created: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Development",
    key: "pk_test_****************",
    scopes: ["read"],
    lastUsed: "Never",
    created: "Dec 1, 2023",
  },
];

export function ApiSettings({ tenant }: ApiSettingsProps) {
  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="API Keys"
        description="Manage API keys for programmatic access"
      >
        <div className="flex justify-between items-center pl-4 mx-4 border-x">
          <div className="text-sm text-muted-foreground">
            {apiKeys.length} active key{apiKeys.length !== 1 ? "s" : ""}
          </div>
          <CreateApiKeyButton />
        </div>

        <div className="border-y px-4 divide-y border-t-dashed">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 border-x border-dashed bg-background-dark"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium mb-1">{key.name}</div>
                  <div className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                    {key.key}
                    <button className="hover:text-foreground">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Scopes:</span>
                  <div className="flex gap-1">
                    {key.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>Last used: {key.lastUsed}</div>
                <div>Created: {key.created}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background-light mx-4 pl-4 py-2 border-x border-b">
          Api Documentation
        </div>
        <div className="border-b px-4 border-dashed">
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/docs/api"
              className="border-x border-dashed relative group p-4 hover:bg-background-dark transition-colors"
            >
              <div className="text-sm font-medium mb-1">Getting Started</div>
              <div className="text-xs text-muted-foreground">
                Authentication, rate limits, and basic concepts
              </div>
              <ExternalLink className="h-4 w-4 absolute top-2 right-2 transition group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link
              href="/docs/api/deployments"
              className="border-x border-dashed relative group p-4 hover:bg-background-dark transition-colors"
            >
              <div className="text-sm font-medium mb-1">Webhooks</div>
              <div className="text-xs text-muted-foreground">
                Receive real-time notifications about deployment events
              </div>
              <ExternalLink className="h-4 w-4 absolute top-2 right-2 transition group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link
              href="/docs/api/webhooks"
              className="border-x border-dashed relative group p-4 hover:bg-background-dark transition-colors"
            >
              <div className="text-sm font-medium mb-1">Deployments API</div>
              <div className="text-xs text-muted-foreground">
                Create and manage deployments programmatically
              </div>
              <ExternalLink className="h-4 w-4 absolute top-2 right-2 transition group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="Rate Limits"
        description="Current API usage and limits"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border border-dashed p-4 mx-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Requests</div>
              <div className="text-2xl font-semibold">1,247</div>
              <div className="text-xs text-muted-foreground">
                of 10,000/hour
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Burst</div>
              <div className="text-2xl font-semibold">23</div>
              <div className="text-xs text-muted-foreground">of 100/minute</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Errors</div>
              <div className="text-2xl font-semibold">0</div>
              <div className="text-xs text-muted-foreground">last 24 hours</div>
            </div>
          </div>
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>
    </div>
  );
}
