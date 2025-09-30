"use client";

import { TenantHealth } from "@/components/tenant-health";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tenant } from "@/generated/prisma";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [subdomain, setSubdomain] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    loadTenants();
  }, []);

  async function loadTenants() {
    const res = await fetch("/api/admin/tenants");
    const data = await res.json();
    setTenants(data);
  }

  async function createTenant(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain, companyName }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`Tenant created! Visit: ${data.url}`);
      setSubdomain("");
      setCompanyName("");
      loadTenants();
    } else {
      alert(data.error);
    }
  }

  async function deleteTenant(domain: string) {
    if (!confirm(`Delete tenant '${domain}'?`)) return;

    await fetch("/api/admin/tenants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    loadTenants();
  }

  function handleDelete(domain: string | null) {
    if (domain) {
      deleteTenant(domain);
      return;
    }

    console.warn("No registered domain to delete.");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tenant Admin Dashboard</h1>

      <div className="bg-card rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Tenant</h2>
        <form onSubmit={createTenant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subdomain</label>
            <Input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="acme"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <Button type="submit">Provision Tenant</Button>
        </form>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Active Tenants</h2>
        {tenants.length === 0 ? (
          <p className="text-gray-500">No tenants yet</p>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{tenant.name}</h3>
                    <p className="text-sm text-gray-600">
                      Subdomain: {tenant.domain}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sanity: {tenant.sanityProjectId}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <a
                      href={`/?tenant=${tenant.domain}`}
                      target="_blank"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Visit Site
                    </a>
                    <Button
                      onClick={() => handleDelete(tenant.domain)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <TenantHealth tenantId={tenant.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
