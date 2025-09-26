"use client";

import { PageBuilder } from "@/components/pagebuilder";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { usePageData } from "../sanity/sanity-tenant-hooks";

export function ContentEditor() {
  const { tenant } = useDashboard();
  const { data: pageData, loading, error } = usePageData("home");

  if (loading) {
    return <div>Loading content...</div>;
  }

  if (error) {
    return <div>Error loading content: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Content Editor</h2>
        <p className="text-muted-foreground">
          Edit your site content with visual editing
        </p>
      </div>

      {pageData && (
        <PageBuilder
          pageBuilder={pageData.pageBuilder}
          id={pageData._id}
          type={pageData._type}
        />
      )}
    </div>
  );
}
