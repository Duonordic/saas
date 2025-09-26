// Use dynamic import for performance and client-side rendering
"use client";

import dynamic from "next/dynamic";

import _StdComp from "../../../../../studio/components/studio-component";

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
