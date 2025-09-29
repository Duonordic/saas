import { DevTenantService } from "@/lib/dev-services/dev-tenant-provisioning";
import { MockSanityService } from "@/lib/dev-services/mock-sanity-service";
import { headers } from "next/headers";

export default async function HomePage() {
  const headersList = await headers();
  const subdomain = headersList.get("x-tenant-subdomain");

  if (!subdomain) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Multi-Tenant Dev Server</h1>
        <p>Add ?tenant=subdomain to view a tenant site</p>
        <p className="text-gray-600">
          Example: http://localhost:3000?tenant=acme
        </p>
      </div>
    );
  }

  const tenantService = new DevTenantService();
  const sanityService = new MockSanityService();

  const tenant = await tenantService.getTenant(subdomain);

  if (!tenant) {
    return <div className="p-8">Tenant '{subdomain}' not found</div>;
  }

  // Load mock Sanity content
  const content = await sanityService.getDocuments(tenant.sanityProjectId);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-2">{content.settings.title}</h1>
      <p className="text-gray-600 mb-8">{content.settings.description}</p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pages</h2>
        {content.pages.length === 0 ? (
          <p className="text-gray-500">
            No pages yet. Add content in the Studio.
          </p>
        ) : (
          <ul>
            {content.pages.map((page: any) => (
              <li key={page._id}>{page.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
