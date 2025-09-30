import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { Copy, MoreVertical, Eye, EyeOff, Bot } from "lucide-react";
import { SettingSection } from "./settings-section";
import { CreateApiKeyButton } from "@/components/ui/buttons/create-api-key-button";

interface ApiSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock API keys
const apiKeys = [
  {
    id: "1",
    name: "Production API",
    key: "pk_live_••••••••••••••••",
    scopes: ["read", "write"],
    lastUsed: "2 hours ago",
    created: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Development",
    key: "pk_test_••••••••••••••••",
    scopes: ["read"],
    lastUsed: "Never",
    created: "Dec 1, 2023",
  },
];

export function ApiSettings({ tenant }: ApiSettingsProps) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="API Keys"
        description="Manage API keys for programmatic access"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {apiKeys.length} active key{apiKeys.length !== 1 ? "s" : ""}
          </div>
          <CreateApiKeyButton />
        </div>

        <div className="border rounded-md divide-y">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4">
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
                      <Badge
                        key={scope}
                        variant="secondary"
                        className="text-xs"
                      >
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
      </SettingSection>

      <SettingSection
        title="API Documentation"
        description="Learn how to integrate with our API"
      >
        <div className="grid gap-4">
          <a
            href="/docs/api"
            className="border rounded-md p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="text-sm font-medium mb-1">Getting Started</div>
            <div className="text-xs text-muted-foreground">
              Authentication, rate limits, and basic concepts
            </div>
          </a>
          <a
            href="/docs/api/deployments"
            className="border rounded-md p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="text-sm font-medium mb-1">Deployments API</div>
            <div className="text-xs text-muted-foreground">
              Create and manage deployments programmatically
            </div>
          </a>
          <a
            href="/docs/api/webhooks"
            className="border rounded-md p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="text-sm font-medium mb-1">Webhooks</div>
            <div className="text-xs text-muted-foreground">
              Receive real-time notifications about deployment events
            </div>
          </a>
        </div>
      </SettingSection>

      <SettingSection
        title="Rate Limits"
        description="Current API usage and limits"
      >
        <div className="border border-dashed rounded-md p-4">
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
      </SettingSection>
    </div>
  );
}
