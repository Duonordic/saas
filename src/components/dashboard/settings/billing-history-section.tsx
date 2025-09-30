import React from "react";
import { SettingSection } from "./settings-section";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoices } from "./billing-settings";

interface BillingHistorySectionProps {
  invoices: Invoices;
}

export default function BillingHistorySection({
  invoices,
}: BillingHistorySectionProps) {
  return (
    <SettingSection
      title="Billing History"
      description="View and download past invoices"
    >
      <div className="border rounded-md divide-y">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{invoice.date}</div>
                <div className="text-xs text-muted-foreground">
                  Invoice #{invoice.id}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">{invoice.amount}</div>
              <Badge variant="outline" className="capitalize">
                {invoice.status}
              </Badge>
              <Button variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SettingSection>
  );
}
