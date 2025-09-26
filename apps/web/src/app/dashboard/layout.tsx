import { DashboardShell } from "@/components/dashboard/shell";
import { SanityStudio } from "@/components/sanity/studio";
import { ContentEditor } from "@/components/dashboard/content-editor";
import { getTenantFromHeaders } from "@/lib/tenant";
import { draftMode } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantFromHeaders();
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <DashboardShell tenant={tenant}>
      <div className="flex h-screen">
        {/* Sanity Studio for structured content */}
        {/* <aside className="w-80 border-r bg-muted/40">
        </aside> */}
        {/* <SanityStudio
            projectId={tenant.sanityProjectId}
            dataset="production"
            isDraftMode={isDraftMode}
          /> */}

        {/* Main content area with visual editing */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {isDraftMode ? (
            // Visual editing mode
            <ContentEditor />
          ) : (
            // Regular dashboard content
            <div className="flex-1 overflow-auto">{children}</div>
          )}
        </main>
      </div>
    </DashboardShell>
  );
}
