// components/deployment-dashboard.tsx
"use client";
import { useState } from "react";
import { Deployment } from "@/generated/prisma";

export function DeploymentDashboard({
  deployment,
}: {
  deployment: Deployment;
}) {
  const [logs, setLogs] = useState<string>("");
  const [metrics, setMetrics] = useState<any>(null);

  const handleRestart = async () => {
    await fetch(`/api/deployments/${deployment.id}/restart`, {
      method: "POST",
    });
  };

  const handleStop = async () => {
    await fetch(`/api/deployments/${deployment.id}/stop`, { method: "POST" });
  };

  const loadLogs = async () => {
    const response = await fetch(`/api/deployments/${deployment.id}/logs`);
    const logs = await response.text();
    setLogs(logs);
  };

  const loadMetrics = async () => {
    const response = await fetch(`/api/deployments/${deployment.id}/metrics`);
    const metrics = await response.json();
    setMetrics(metrics);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{deployment.name}</h1>
        <div className="space-x-2">
          <button
            onClick={handleRestart}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Restart
          </button>
          <button
            onClick={handleStop}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Status</h3>
          <p
            className={`text-${
              deployment.status === "running" ? "green" : "red"
            }-600`}
          >
            {deployment.status}
          </p>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">URL</h3>
          <a
            href={deployment.deployment_url || "#"}
            className="text-blue-600 hover:underline"
          >
            {deployment.deployment_url}
          </a>
        </div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Last Deployed</h3>
          <p>{deployment.last_deployed_at?.toLocaleString() || "Never"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Logs</h3>
            <button
              onClick={loadLogs}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Refresh
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded h-64 overflow-auto text-sm">
            {logs || "No logs available"}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Metrics</h3>
            <button
              onClick={loadMetrics}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Refresh
            </button>
          </div>
          {metrics && (
            <div className="bg-gray-100 p-4 rounded h-64 overflow-auto">
              <pre>{JSON.stringify(metrics, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
