// components/domains/domain-manager.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Plus } from "lucide-react";

export function DomainManager() {
  const domains = [
    {
      domain: "myapp.example.com",
      status: "active",
      deployment: "my-app-production",
      ssl: true,
    },
    {
      domain: "staging.myapp.com",
      status: "pending",
      deployment: "my-app-staging",
      ssl: false,
    },
    {
      domain: "docs.myapp.com",
      status: "error",
      deployment: "my-app-docs",
      ssl: true,
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          variant: "default" as const,
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          variant: "secondary" as const,
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-500",
          variant: "destructive" as const,
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-500",
          variant: "outline" as const,
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Domains</CardTitle>
            <CardDescription>
              Manage custom domains for your deployments
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Domain Form */}
        <div className="flex space-x-2">
          <Input placeholder="Enter your domain (e.g., app.example.com)" />
          <Button>Verify</Button>
        </div>

        {/* Domains List */}
        <div className="space-y-3">
          {domains.map((domain, index) => {
            const {
              icon: Icon,
              color,
              variant,
            } = getStatusConfig(domain.status);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <p className="font-medium">{domain.domain}</p>
                    <p className="text-sm text-muted-foreground">
                      Linked to {domain.deployment}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={variant}>{domain.status}</Badge>
                  {domain.ssl && <Badge variant="outline">SSL</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
