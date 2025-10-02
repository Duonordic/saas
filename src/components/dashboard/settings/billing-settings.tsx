import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/generated/prisma";
import { CreditCard, Download, Calendar, Check } from "lucide-react";
import { SettingSection } from "./settings-section";
import {
  GridSpacer,
  GridRow,
  GridStats,
  GridStatItem,
  GridTable,
  GridTableRow,
  GridTableCell,
  GridCard,
} from "@/components/ui/grid";

interface BillingSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock data
const planFeatures = {
  free: ["5 deployments", "1 GB storage", "Community support"],
  starter: [
    "25 deployments",
    "10 GB storage",
    "Email support",
    "Custom domains",
  ],
  pro: [
    "Unlimited deployments",
    "100 GB storage",
    "Priority support",
    "Custom domains",
    "Advanced analytics",
  ],
  enterprise: [
    "Unlimited everything",
    "Dedicated support",
    "SLA",
    "Custom integrations",
  ],
};

const invoices = [
  { id: "INV-001", date: "Sep 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-002", date: "Aug 1, 2024", amount: "$29.00", status: "paid" },
  { id: "INV-003", date: "Jul 1, 2024", amount: "$29.00", status: "paid" },
];

const plans = [
  { name: "starter", price: "$19", features: planFeatures.starter },
  { name: "pro", price: "$49", features: planFeatures.pro },
  { name: "enterprise", price: "Custom", features: planFeatures.enterprise },
];

export function BillingSettings({ tenant }: BillingSettingsProps) {
  const currentPlan = tenant.plan || "free";

  return (
    <div className="flex-1 min-h-0">
      <SettingSection
        title="Current Plan"
        description="Your subscription and usage"
      >
        <GridSpacer />

        <GridRow
          label="Active Plan"
          description="Your current subscription tier"
          columns={2}
          isFirst
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold capitalize">
                {currentPlan}
              </span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <Button variant="outline" size="sm">
              Change Plan
            </Button>
          </div>
        </GridRow>

        <GridSpacer />

        <GridStats columns={3}>
          <GridStatItem label="Deployments" value="12" subtitle="of 25 used" />
          <GridStatItem
            label="Storage"
            value="2.4 GB"
            subtitle="of 10 GB used"
          />
          <GridStatItem label="Bandwidth" value="45 GB" subtitle="this month" />
        </GridStats>

        <GridSpacer />

        <div className="border-y px-4 border-t-dashed">
          <div className="p-4 border-x border-dashed bg-background">
            <div className="text-xs font-medium text-muted-foreground mb-3">
              Included Features
            </div>
            <div className="grid grid-cols-2 gap-2">
              {planFeatures[currentPlan as keyof typeof planFeatures]?.map(
                (feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        title="Payment Method"
        description="Manage your payment information"
      >
        <GridSpacer />

        <GridRow
          label="Credit Card"
          description="Default payment method"
          isFirst
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">•••• •••• •••• 4242</div>
                <div className="text-xs text-muted-foreground">
                  Expires 12/2025
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </GridRow>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        title="Billing History"
        description="View and download past invoices"
      >
        <GridSpacer />

        <GridTable
          headers={["Date", "Invoice", "Amount", "Status", ""]}
          customColTemplate="1fr 1fr 1fr 1fr auto"
        >
          {invoices.map((invoice) => (
            <GridTableRow key={invoice.id}>
              <GridTableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{invoice.date}</span>
                </div>
              </GridTableCell>
              <GridTableCell>
                <div className="text-sm text-muted-foreground">
                  {invoice.id}
                </div>
              </GridTableCell>
              <GridTableCell>
                <div className="text-sm font-medium">{invoice.amount}</div>
              </GridTableCell>
              <GridTableCell>
                <Badge variant="outline" className="capitalize">
                  {invoice.status}
                </Badge>
              </GridTableCell>
              <GridTableCell>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </GridTableCell>
            </GridTableRow>
          ))}
        </GridTable>

        <GridSpacer />
      </SettingSection>

      <SettingSection
        className="h-full"
        title="Available Plans"
        description="Compare and upgrade your subscription"
      >
        <GridSpacer />

        <div className="border-y px-4 border-t-dashed">
          <div className="grid grid-cols-3 gap-px bg-border border-x border-dashed">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-4 bg-background ${
                  plan.name === currentPlan
                    ? "ring-2 ring-primary ring-inset"
                    : ""
                }`}
              >
                <div className="mb-4">
                  <div className="text-sm font-medium capitalize mb-1">
                    {plan.name}
                  </div>
                  <div className="text-2xl font-semibold mb-3">
                    {plan.price}
                    {plan.price !== "Custom" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    )}
                  </div>
                  <Button
                    variant={plan.name === currentPlan ? "ghost" : "outline"}
                    className="w-full"
                    disabled={plan.name === currentPlan}
                    size="sm"
                  >
                    {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>

                <div className="space-y-2 pt-4 border-t border-dashed">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GridSpacer />
      </SettingSection>
    </div>
  );
}
