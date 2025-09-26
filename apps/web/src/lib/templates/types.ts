import { ComponentType } from "react";
import { Tenant } from "@/lib/tenant";
import { PageBuilderProps } from "@/components/pagebuilder";

export interface TemplateComponentProps {
  tenant: Tenant;
  children?: React.ReactNode;
  pageData?: any; // Sanity page data
}

export interface TemplateComponents {
  Layout: ComponentType<TemplateComponentProps>;
  HomePage: ComponentType<TemplateComponentProps>;
  PageBuilder?: ComponentType<PageBuilderProps>;
  PostPage?: ComponentType<TemplateComponentProps>;
  ProjectPage?: ComponentType<TemplateComponentProps>;
  [key: string]: ComponentType<any> | undefined;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  components: TemplateComponents;
  previewImage: string;
  supportedPages: string[];
  seoConfig?: {
    defaultTitle: string;
    defaultDescription: string;
  };
}

export interface Site {
  id: string;
  name: string;
  domain: string;
  status: "live" | "draft" | "building" | "error";
  template: string;
  lastDeployed?: string;
  pageCount?: number;
}
