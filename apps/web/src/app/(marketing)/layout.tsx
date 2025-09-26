import { FooterServer, FooterSkeleton } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { getNavigationData } from "@/lib/navigation";
import { SanityLive } from "@/lib/sanity/live";
import { draftMode } from "next/headers";
import { Suspense } from "react";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await getNavigationData();

  return (
    <Providers>
      <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />
      {children}
      <Suspense fallback={<FooterSkeleton />}>
        <FooterServer />
      </Suspense>
      <SanityLive />
      <CombinedJsonLd includeWebsite includeOrganization />
      {(await draftMode()).isEnabled && <PreviewBar />}
    </Providers>
  );
}
