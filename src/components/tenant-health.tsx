import { useState, useEffect } from "react";
import React from "react"; // React import is good practice for JSX

// --- 1. Type Definitions ---

/**
 * Defines the possible health statuses the API can return.
 * This is crucial for type-safety and better component logic.
 */
type HealthStatus = "healthy" | "unhealthy" | "degraded" | "unknown";

interface TenantHealthProps {
  /** The unique identifier for the tenant whose health is being checked. */
  tenantId: string;
}

interface HealthIndicatorProps {
  /** The current health status to display. */
  status: HealthStatus;
}

// --- 2. HealthIndicator Component (Visual Representation) ---

/**
 * A visual component that displays the health status using a colored dot
 * and text, which is more intuitive than just showing the raw status string.
 */
export function HealthIndicator({ status }: HealthIndicatorProps) {
  const baseClasses = "inline-flex items-center text-sm font-medium";
  let colorClass = "text-gray-500";
  let dotColor = "bg-gray-400";
  let text: string = status;

  switch (status) {
    case "healthy":
      colorClass = "text-green-600";
      dotColor = "bg-green-500";
      text = "Healthy";
      break;
    case "unhealthy":
      colorClass = "text-red-600";
      dotColor = "bg-red-500";
      text = "Unhealthy";
      break;
    case "degraded":
      colorClass = "text-yellow-600";
      dotColor = "bg-yellow-500";
      text = "Degraded";
      break;
    case "unknown":
    default:
      colorClass = "text-gray-500";
      dotColor = "bg-gray-400 animate-pulse";
      text = "Checking...";
      break;
  }

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${dotColor}`}></span>
      {text}
    </span>
  );
}

// --- 3. TenantHealth Component (Logic & Fetching) ---

/**
 * Fetches and displays the health status for a specific tenant,
 * polling the API every 30 seconds for real-time updates.
 */
export function TenantHealth({ tenantId }: TenantHealthProps) {
  const [health, setHealth] = useState<HealthStatus>("unknown");

  useEffect(() => {
    // The inner function for fetching the data
    const checkHealth = async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/health`);

        if (!response.ok) {
          // Handle API errors (e.g., 404, 500)
          console.error(
            `Health check failed for tenant ${tenantId}. Status: ${response.status}`
          );
          setHealth("unhealthy");
          return;
        }

        // Assuming the API returns a string that matches HealthStatus
        const status: HealthStatus = await response.json();
        setHealth(status);
      } catch (error) {
        // Handle network errors (e.g., server unreachable)
        console.error("Network or parsing error during health check:", error);
        setHealth("unknown");
      }
    };

    // 1. Run immediately on mount
    checkHealth();

    // 2. Set up interval for polling (e.g., every 30 seconds)
    const interval = setInterval(checkHealth, 30000);

    // 3. Clean up the interval when the component unmounts or tenantId changes
    return () => clearInterval(interval);
  }, [tenantId]); // Re-run effect if the tenantId changes

  return <HealthIndicator status={health} />;
}
