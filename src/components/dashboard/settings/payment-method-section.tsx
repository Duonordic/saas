import React from "react";
import { SettingSection } from "./settings-section";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

// interface PaymentMethodSectionProps {

// }

export default function PaymentMethodSection() {
  return (
    <SettingSection
      title="Payment Method"
      description="Manage your payment information"
    >
      <div className="border rounded-md p-4">
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
          <Button
            variant="link"
            className="text-sm text-primary hover:underline"
          >
            Update
          </Button>
        </div>
      </div>
    </SettingSection>
  );
}
