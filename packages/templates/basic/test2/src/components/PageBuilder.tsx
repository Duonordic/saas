import React from "react";
import { PageBuilderProps } from "@dn/templates/types";

export const PageBuilder = ({
  pageBuilder,
  id,
  type,
  tenantProjectId,
}: PageBuilderProps) => (
  <div className="space-y-8">
    {pageBuilder?.map((block: any) => (
      <section key={block._key} className="template-section">
        {/* Add your block rendering logic here */}
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </section>
    ))}
  </div>
);
