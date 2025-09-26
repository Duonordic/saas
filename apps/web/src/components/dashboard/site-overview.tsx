import { Tenant } from "@/lib/tenant";
import React from "react";

interface SiteOverviewProps {
  tenant: Tenant;
}
export default function SiteOverview({ tenant }: SiteOverviewProps) {
  return <div>site-overview</div>;
}
