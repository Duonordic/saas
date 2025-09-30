// components/template-marketplace.tsx
"use client";
import { useState } from "react";
import { Template } from "@/generated/prisma";
import Image from "next/image";

export function TemplateMarketplace({ tenantId }: { tenantId: string }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const handleDeployTemplate = async (template: Template) => {
    try {
      await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          templateId: template.id,
          name: template.name,
          subdomain: `${template.slug}-${Date.now()}`,
          envVars: template.default_env as Record<string, string>,
        }),
      });

      // Show success message or redirect
      alert("Deployment started! Check your deployments.");
    } catch (error) {
      console.error("Deployment failed:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div key={template.id} className="border rounded-lg p-6">
          <Image
            src={template.thumbnail_url || "/default-thumbnail.jpg"}
            alt={template.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
          <p className="text-gray-600 mb-4">{template.description}</p>
          <button
            onClick={() => handleDeployTemplate(template)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Deploy Now
          </button>
        </div>
      ))}
    </div>
  );
}
