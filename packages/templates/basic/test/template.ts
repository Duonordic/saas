import { TemplateConfig } from "@/lib/templates/types";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { PageBuilder } from "./components/PageBuilder";

export const TEST_TEMPLATE: TemplateConfig = {
  id: "test",
  name: "test",
  description: "test",
  category: "test",
  plan: "basic",
  components: {
    Layout,
    HomePage,
    PageBuilder,
  },
  previewImage: "/templates/basic/test-preview.jpg",
  supportedPages: ["home", "about", "contact"],
  seoConfig: {
    defaultTitle: "test",
    defaultDescription: "test",
  },
};
