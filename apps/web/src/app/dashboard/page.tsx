// import { DashboardHeader } from "@/components/dashboard/header";
// import SiteOverview from "@/components/dashboard/site-overview";
// import { getTenantFromHeaders } from "@/lib/tenant";

// export default async function DashboardPage() {
//   const tenant = await getTenantFromHeaders();

//   return (
//     <div className="container mx-auto p-6">
//       <DashboardHeader tenant={tenant} />
//       <SiteOverview tenant={tenant} />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//         <div className="bg-card rounded-lg p-6">
//           <h3 className="text-lg font-semibold">Quick Actions</h3>
//           {/* Dashboard actions */}
//         </div>
//         <div className="bg-card rounded-lg p-6">
//           <h3 className="text-lg font-semibold">Recent Activity</h3>
//           {/* Recent activity feed */}
//         </div>
//       </div>
//     </div>
//   );
// }

// Use dynamic import for performance and client-side rendering
"use client";

import dynamic from "next/dynamic";

import _StdComp from "../../../../studio/components/studio-component";

// 1. Dynamically import the component from your internal package
// const StudioComponent = dynamic(
//   // The path refers to the 'component' export defined in studio/package.json
//   () => import("../../../../../studio/components/studio-component").then((mod) => mod.StudioComponent),
//   {
//     // 2. MUST be rendered client-side (Sanity relies on browser APIs)
//     ssr: false,
//     loading: () => <p>Loading CMS dashboard...</p>,
//   },
// );

// 3. Define the React page component
export default function StudioPage() {
  const internalRoute = "/dashboard/studio";

  return (
    // Wrap it in your main application's layout, ensuring it spans the necessary area
    <div>
      {/* <StudioComponent basePath={internalRoute} /> */}
      <_StdComp basePath={internalRoute} />
    </div>
  );
}
