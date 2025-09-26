import dynamic from "next/dynamic";
import { TemplateConfig } from "./types";
import { PageBuilder } from "@/components/pagebuilder";

const DEFAULT_TEMPLATE_ID = "blog";

// Template registry - maps template IDs to their implementations
const templateRegistry: Record<string, TemplateConfig> = {
  blog: {
    id: "blog",
    name: "Blog",
    description: "A modern blog template",
    category: "blog",
    components: {
      Layout: dynamic(() => import("@/templates/blog/components/layout")),
      HomePage: dynamic(() => import("@/templates/blog/components/home-page")),
      PostPage: dynamic(() => import("@/templates/blog/components/post-page")),
    },
    previewImage: "/templates/blog/preview.jpg",
    supportedPages: ["home", "post", "about", "contact"],
  },
  portfolio: {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work",
    category: "portfolio",
    components: {
      Layout: dynamic(() => import("@/templates/portfolio/components/layout")),
      HomePage: dynamic(
        () => import("@/templates/portfolio/components/home-page"),
      ),
      ProjectPage: dynamic(
        () => import("@/templates/portfolio/components/project-page"),
      ),
      PageBuilder: PageBuilder,
    },
    previewImage: "/templates/portfolio/preview.jpg",
    supportedPages: ["home", "project", "about", "services"],
  },
  landing: {
    id: "landing",
    name: "Landing Page",
    description: "High-converting landing page",
    category: "landing",
    components: {
      Layout: dynamic(() => import("@/templates/landing/components/layout")),
      HomePage: dynamic(
        () => import("@/templates/landing/components/home-page"),
      ),
      PageBuilder: PageBuilder,
    },
    previewImage: "/templates/landing/preview.jpg",
    supportedPages: ["home"],
  },
};

export async function getTenantTemplate(
  templateId?: string | null,
): Promise<TemplateConfig | null> {
  if (!templateId || !templateRegistry[templateId]) {
    console.warn(`Template "${templateId}" not found`);
    return null;
  }

  try {
    return templateRegistry[templateId];
  } catch (error) {
    console.error(`Error loading template "${templateId}":`, error);
    return null;
  }
}

export async function getTenantTemplateSafe(
  templateId?: string | null,
): Promise<TemplateConfig> {
  const template = await getTenantTemplate(templateId);
  return template || templateRegistry[DEFAULT_TEMPLATE_ID];
}

export function getAvailableTemplates(): TemplateConfig[] {
  return Object.values(templateRegistry);
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return Object.values(templateRegistry).filter(
    (template) => template.category === category,
  );
}
