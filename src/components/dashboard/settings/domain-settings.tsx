import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/generated/prisma";
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { SettingSection } from "./settings-section";
import { SaveButton } from "@/components/ui/buttons/save-button";
import { VerifyDomainButton } from "@/components/ui/buttons/verify-domain-button";

interface DomainSettingsProps {
  tenant: Partial<Tenant>;
}

export function DomainSettings({ tenant }: DomainSettingsProps) {
  const hasCustomDomain = !!tenant.domain;

  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Default Domain"
        description="Your workspace is accessible at this subdomain"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed">
          <div className="p-4 border-x border-dashed bg-background-dark">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-medium">
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
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <SettingSection
        title="Custom Domain"
        description="Use your own domain for your deployed sites"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed">
          <div className="grid grid-cols-3 border-x border-dashed">
            <div className="col-span-1 p-4 bg-background-dark border-r border-dashed">
              <div className="text-sm font-medium mb-1">Domain Name</div>
              <div className="text-xs text-muted-foreground">
                Enter your domain (e.g., mysite.com)
              </div>
            </div>
            <div className="col-span-2 p-4 bg-background">
              <div className="space-y-3">
                <input
                  id="custom-domain"
                  name="domain"
                  type="text"
                  placeholder="mysite.com"
                  defaultValue={tenant.domain ? tenant.domain : undefined}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            </div>
          </div>
        </div>

        {hasCustomDomain && (
          <>
            <div className="bg-background-light mx-4 pl-4 py-2 border-x">
              DNS Configuration
            </div>
            <div className="border-y px-4 border-t-dashed">
              <div className="border-x border-dashed divide-y divide-dashed">
                {/* Header */}
                <div className="grid grid-cols-[120px_1fr_120px] gap-px bg-border">
                  <div className="p-3 bg-background-dark text-xs font-medium text-muted-foreground">
                    Type
                  </div>
                  <div className="p-3 bg-background-dark text-xs font-medium text-muted-foreground">
                    Value
                  </div>
                  <div className="p-3 bg-background-dark text-xs font-medium text-muted-foreground">
                    Status
                  </div>
                </div>
                {/* A Record */}
                <div className="grid grid-cols-[120px_1fr_120px] gap-px bg-border">
                  <div className="p-3 bg-background font-mono text-sm">A</div>
                  <div className="p-3 bg-background font-mono text-sm text-muted-foreground">
                    76.76.21.21
                  </div>
                  <div className="p-3 bg-background">
                    <Badge variant="outline" className="gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      Valid
                    </Badge>
                  </div>
                </div>
                {/* CNAME Record */}
                <div className="grid grid-cols-[120px_1fr_120px] gap-px bg-border">
                  <div className="p-3 bg-background font-mono text-sm">
                    CNAME
                  </div>
                  <div className="p-3 bg-background font-mono text-sm text-muted-foreground">
                    cname.vercel-dns.com
                  </div>
                  <div className="p-3 bg-background">
                    <Badge variant="outline" className="gap-1 w-fit">
                      <AlertCircle className="w-3 h-3 text-yellow-600" />
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="SSL Certificate"
        description="Automatic HTTPS encryption for your domains"
      >
        <div className="h-4 mx-4 border-x border-dashed" />
        <div className="border-y px-4 border-t-dashed">
          <div className="p-4 border-x border-dashed bg-background">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">SSL Enabled</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Certificates are automatically provisioned and renewed
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-4 mx-4 border-x border-dashed" />
      </SettingSection>

      <div className="flex justify-end p-4 border-l bg-background-light border-t">
        <SaveButton />
      </div>
    </div>
  );
}
