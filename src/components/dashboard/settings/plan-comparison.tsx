"use client";

import React from "react";
import { SettingSection } from "./settings-section";
import { Button } from "@/components/ui/button";
import { $Enums } from "@/generated/prisma";

interface PlanComparisonProps {
  currentPlan: $Enums.PlanType;
}

export default function PlanComparison({ currentPlan }: PlanComparisonProps) {
  return (
    <SettingSection
      title="Plan Comparison"
      description="Explore available plans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(["starter", "pro", "enterprise"] as const).map((plan) => (
          <div
            key={plan}
            className={`border rounded-md p-4 ${
              plan === currentPlan ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="text-sm font-medium capitalize mb-1">{plan}</div>
            <div className="text-2xl font-semibold mb-4">
              {plan === "enterprise"
                ? "Custom"
                : plan === "starter"
                ? "$19"
                : "$49"}
              {plan !== "enterprise" && (
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              )}
            </div>
            <Button
              variant={plan === currentPlan ? "ghost" : "outline"}
              className="w-full"
              disabled={plan === currentPlan}
            >
              {plan === currentPlan && "Current Plan"}
              {plan === "pro" &&
                (currentPlan === "free" || currentPlan === "starter") &&
                "Upgrade"}
              {plan === "pro" &&
                (currentPlan === "free" || currentPlan === "starter") &&
                "Upgrade"}
              {plan === "starter" && currentPlan === "free" && "Upgrade"}
              {plan === "starter" &&
                (currentPlan === "pro" || currentPlan === "enterprise") &&
                "Downgrade"}
              {plan === "enterprise" && currentPlan === "pro" && "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </SettingSection>
  );
}
