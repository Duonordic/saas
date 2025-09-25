const CREATE_PACKAGE_JSON = (templateName: string) => {
  const packageData = {
    name: `@dn/template-${templateName}`,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "next dev --turbopack",
      build: "next build",
      start: "next start",
      lint: "eslint . --max-warnings 0",
    },
    dependencies: {
      next: "latest",
      react: "latest",
      "react-dom": "latest",
      "@sanity/image-url": "latest",
      groq: "latest",
      "next-sanity": "latest",
      "@dn/ui": "workspace:*",
      "@dn/sanity-utils": "workspace:*",
      tailwindcss: "^4.1.12",
    },
    devDependencies: {
      "@turbo/gen": "^2.5.6",
      typescript: "latest",
      "@types/node": "latest",
      "@types/react": "latest",
      "@types/react-dom": "latest",
    },
  };

  return JSON.stringify(packageData, null, 2);
};

const CREATE_TSCONFIG = (templateName: string) => {
  const tsConfigData = {
    extends: "@dn/typescript-config/nextjs.json",
    compilerOptions: {
      baseUrl: "../../../",
      paths: {
        "@/*": [`templates/basic/${templateName}/src/*`],
        "@dn/ui/*": ["packages/ui/src/*"],
        "@dn/sanity-utils": ["packages/sanity-utils/src/*"],
      },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };

  return JSON.stringify(tsConfigData, null, 2);
};

const INDEX_CSS_TEMPLATE = `
@import "tailwindcss";
`;

const NEXT_CONFIG_TS_TEMPLATE = `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dn/ui"],
  experimental: {
    reactCompiler: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
};

export default nextConfig;
`;

const GITIGNORE_TEMPLATE = `.env*
.next/
node_modules/
`;

const SAMPLE_PAGE_TEMPLATE = (templateName: string) => `
"use client"; 
import Head from 'next/head';
import { Button } from "@dn/ui/components/button";

export default function Home() {
  return (
    <div>
      <Head>
        <title>${templateName}</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to ${templateName}!</h1>
        <Button onClick={() => alert('Hello!')}>Click Me</Button>
      </main>
    </div>
  );
}`;

const CREATE_NEXTJS_ROOT = (templateName: string) =>
  `
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "${templateName}",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
        {children}
      </body>
    </html>
  );
}
`;

export {
  CREATE_TSCONFIG,
  CREATE_PACKAGE_JSON,
  NEXT_CONFIG_TS_TEMPLATE,
  GITIGNORE_TEMPLATE,
  INDEX_CSS_TEMPLATE,
  CREATE_NEXTJS_ROOT,
  SAMPLE_PAGE_TEMPLATE,
};
