import { SettingField } from "./setting-field";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { SettingSection } from "./settings-section";
import { Input } from "@/components/ui/input";
import { SaveButton } from "@/components/ui/buttons/save-button";
import { VerifyDomainButton } from "@/components/ui/buttons/verify-domain-button";

interface DomainSettingsProps {
  tenant: Partial<Tenant>;
}

export function DomainSettings({ tenant }: DomainSettingsProps) {
  const hasCustomDomain = !!tenant.domain;

  return (
    <div className="space-y-8">
      <SettingSection
        title="Default Domain"
        description="Your workspace is accessible at this subdomain"
      >
        <div className="p-4 border rounded-md bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-sm">
                {tenant.slug}.yourplatform.com
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Primary workspace URL
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </Badge>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Custom Domain"
        description="Use your own domain for your deployed sites"
      >
        <SettingField
          label="Domain Name"
          description="Enter your domain (e.g., mysite.com or www.mysite.com)"
          htmlFor="custom-domain"
        >
          <div className="space-y-3">
            <Input
              id="custom-domain"
              name="domain"
              type="text"
              placeholder="mysite.com"
              defaultValue={tenant.domain ? tenant.domain : undefined}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {hasCustomDomain && (
              <div className="flex items-center gap-2">
                <VerifyDomainButton domain={tenant.domain!} />
                <a
                  href={`https://${tenant.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  Visit site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </SettingField>

        {hasCustomDomain && (
          <div className="space-y-3">
            <div className="text-sm font-medium">DNS Configuration</div>
            <div className="border rounded-md divide-y">
              <div className="p-3 grid grid-cols-[100px_1fr_100px] gap-4 items-center text-sm">
                <div className="font-medium text-muted-foreground">Type</div>
                <div className="font-medium text-muted-foreground">Value</div>
                <div className="font-medium text-muted-foreground">Status</div>
              </div>
              <div className="p-3 grid grid-cols-[100px_1fr_100px] gap-4 items-center text-sm">
                <div className="font-mono">A</div>
                <div className="font-mono text-muted-foreground">
                  76.76.21.21
                </div>
                <Badge variant="outline" className="gap-1 w-fit">
                  <CheckCircle2 className="w-3 h-3" />
                  Valid
                </Badge>
              </div>
              <div className="p-3 grid grid-cols-[100px_1fr_100px] gap-4 items-center text-sm">
                <div className="font-mono">CNAME</div>
                <div className="font-mono text-muted-foreground">
                  cname.vercel-dns.com
                </div>
                <Badge variant="outline" className="gap-1 w-fit">
                  <AlertCircle className="w-3 h-3" />
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        )}
      </SettingSection>

      <SettingSection
        title="SSL Certificate"
        description="Automatic HTTPS encryption for your domains"
      >
        <div className="p-4 border border-dashed rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">SSL Enabled</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Certificates are automatically provisioned and renewed
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      <div className="flex justify-end pt-4 border-t">
        <SaveButton />
      </div>
    </div>
  );
}
