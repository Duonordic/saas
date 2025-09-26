import { TemplateConfig } from "@dn/templates/types";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { PageBuilder } from "./components/PageBuilder";

export const TEST2_TEMPLATE: TemplateConfig = {
  id: "test2",
  name: "test2",
  description: "test2",
  category: "test2",
  plan: "basic",
  components: {
    Layout,
    HomePage,
    PageBuilder,
  },
  previewImage: "/templates/basic/test2-preview.jpg",
  supportedPages: ["home", "about", "contact"],
  seoConfig: {
    defaultTitle: "test2",
    defaultDescription: "test2",
  },
};