import { $Enums } from "@/generated/prisma";
import React from "react";
import { SettingSection } from "./settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanFeatures } from "./billing-settings";

interface CurrentPlanSectionProps {
  currentPlan: $Enums.PlanType;
  planFeatures: PlanFeatures;
}

export default function CurrentPlanSection({
  currentPlan,
  planFeatures,
}: CurrentPlanSectionProps) {
  return (
    <SettingSection
      title="Current Plan"
      description="Your subscription and usage"
    >
      <div className="border rounded-md p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-semibold capitalize">
                {currentPlan}
              </h3>
              <Badge variant="secondary">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPlan === "free" ? "Free forever" : "$29/month"}
            </p>
          </div>
          <Button variant="outline">Change Plan</Button>
        </div>

        <div className="space-y-2 mb-6">
          {planFeatures[currentPlan as keyof typeof planFeatures]?.map(
            (feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {feature}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dashed">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Deployments
            </div>
            <div className="text-2xl font-semibold">12</div>
            <div className="text-xs text-muted-foreground">of 25 used</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Storage</div>
            <div className="text-2xl font-semibold">2.4 GB</div>
            <div className="text-xs text-muted-foreground">of 10 GB used</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Bandwidth</div>
            <div className="text-2xl font-semibold">45 GB</div>
            <div className="text-xs text-muted-foreground">this month</div>
          </div>
        </div>
      </div>
    </SettingSection>
  );
}
