"use client";

import { useEffect, useRef } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { redirect } from "next/navigation";

interface SanityStudioProps {
  projectId: string | null;
  dataset: string;
  isDraftMode?: boolean;
}

export function SanityStudio({
  projectId,
  dataset,
  isDraftMode,
}: SanityStudioProps) {
  const studioRef = useRef<HTMLDivElement>(null);
  const { tenant } = useDashboard();

  useEffect(() => {
    if (studioRef.current) {
      // Load Sanity Studio dynamically
      import("studio").then((sanity) => {
        // Configure and mount Sanity Studio
        // This is a simplified version - you'll need to configure properly
        const config = {
          projectId,
          dataset,
          // Add your Sanity configuration
        };

        // Mount studio component
      });
    }
  }, [projectId, dataset, tenant]);

  if (!projectId) {
    // TODO: Needs proper implementations - this is will not work.
    redirect("/somewhere");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Content Manager</h3>
        <p className="text-sm text-muted-foreground">
          Manage your site content
        </p>
      </div>
      <div ref={studioRef} className="flex-1">
        {/* Sanity Studio will be mounted here */}
        <div className="p-4 text-center text-muted-foreground">
          Loading Sanity Studio...
        </div>
      </div>
      {isDraftMode && (
        <div className="p-2 bg-yellow-100 text-yellow-800 text-xs text-center">
          Draft Mode Active
        </div>
      )}
    </div>
  );
}
