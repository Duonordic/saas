import "@dn/ui/globals.css";

import { VisualEditing } from "next-sanity/visual-editing";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { getNavigationData } from "@/lib/navigation";
import { SanityLive } from "@/lib/sanity/live";
import { preconnect } from "react-dom";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        {children}
        {isDraftMode && (
          <>
            {/* Visual editing components for Sanity */}
            <script src="https://cdn.sanity.io/visual-editing.js" />
          </>
        )}
      </body>
    </html>
  );
}
