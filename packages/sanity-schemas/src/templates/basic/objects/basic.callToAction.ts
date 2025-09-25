// basic.callToAction.ts
import { defineType, defineField } from "sanity";

export const basicCallToAction = defineType({
  name: "basic.callToAction",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button Label",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "Button URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});
