"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
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

  async function deleteTenant(subdomain: string) {
    if (!confirm(`Delete tenant '${subdomain}'?`)) return;

    await fetch("/api/admin/tenants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    });

    loadTenants();
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
                    <h3 className="font-semibold">{tenant.companyName}</h3>
                    <p className="text-sm text-gray-600">
                      Subdomain: {tenant.subdomain}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sanity: {tenant.sanityProjectId}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <a
                      href={`/?tenant=${tenant.subdomain}`}
                      target="_blank"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Visit Site
                    </a>
                    <button
                      onClick={() => deleteTenant(tenant.subdomain)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
