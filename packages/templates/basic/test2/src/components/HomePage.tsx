import React from "react";
import { TemplateComponentProps } from "@dn/templates/types";

export const HomePage = ({ tenant, pageData }: TemplateComponentProps) => (
  <div className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold mb-8">Welcome to test2</h2>
    <p className="text-lg text-gray-600">This is your new test2 template.</p>
  </div>
);
