// components/deployment-list.tsx
"use client";
import { useState, useEffect } from "react";
import { Deployment } from "@/generated/prisma";
import { useCallback } from "react";

interface DeploymentListProps {
  tenantId: string;
}

export function DeploymentList({ tenantId }: DeploymentListProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeployments = useCallback(async () => {
    try {
      const response = await fetch(`/api/deployments?tenantId=${tenantId}`);
      const data = await response.json();
      setDeployments(data);
    } catch (error) {
      console.error("Failed to load deployments:", error);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadDeployments();
  }, [loadDeployments]);

  const handleDeploy = async (templateId: string) => {
    const deployment = await fetch("/api/deployments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId,
        templateId,
        name: "My New App",
        subdomain: `app-${Date.now()}`,
        envVars: { CUSTOM_VAR: "value" },
      }),
    });

    await loadDeployments(); // Refresh list
  };

  if (loading) return <div>Loading deployments...</div>;

  return (
    <div className="space-y-4">
      {deployments.map((deployment) => (
        <DeploymentCard
          key={deployment.id}
          deployment={deployment}
          onRefresh={loadDeployments}
        />
      ))}
    </div>
  );
}
