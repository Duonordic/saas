import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/generated/prisma";
import { CreditCard, Download, TrendingUp, Calendar } from "lucide-react";
import { SettingSection } from "./settings-section";
import PlanComparison from "./plan-comparison";
import BillingHistorySection from "./billing-history-section";
import PaymentMethodSection from "./payment-method-section";
import CurrentPlanSection from "./current-plan-section";

interface BillingSettingsProps {
  tenant: Partial<Tenant>;
}

// Mock billing data
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
  { id: "1", date: "Sep 1, 2024", amount: "$29.00", status: "paid" },
  { id: "2", date: "Aug 1, 2024", amount: "$29.00", status: "paid" },
  { id: "3", date: "Jul 1, 2024", amount: "$29.00", status: "paid" },
];

export type Invoices = typeof invoices;
export type PlanFeatures = typeof planFeatures;

export function BillingSettings({ tenant }: BillingSettingsProps) {
  const currentPlan = tenant.plan || "free";

  return (
    <div className="space-y-8">
      <CurrentPlanSection
        planFeatures={planFeatures}
        currentPlan={currentPlan}
      />

      <PaymentMethodSection />

      <BillingHistorySection invoices={invoices} />

      <PlanComparison currentPlan={currentPlan} />
    </div>
  );
}
