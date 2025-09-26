import React from "react";
import { TemplateComponentProps } from "@dn/templates/types";

export const Layout = ({ tenant, children }: TemplateComponentProps) => (
  <div className="min-h-screen bg-white">
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">test2</h1>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-4 text-center">
        © {new Date().getFullYear()} {tenant.domain}
      </div>
    </footer>
  </div>
);
