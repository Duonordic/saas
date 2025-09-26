import React from 'react';
import { PageBuilderProps } from "@/lib/templates/types";

export const PageBuilder: React.FC<PageBuilderProps> = ({ pageBuilder, id, type, tenantProjectId }) => (
  <div className="space-y-8">
    {pageBuilder?.map((block: any) => (
      <section key={block._key} className="template-section">
        {/* Add your block rendering logic here */}
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </section>
    ))}
  </div>
);
