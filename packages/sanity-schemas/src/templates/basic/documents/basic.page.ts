// basic.page.ts
import { defineType, defineField } from "sanity";

export const basicPage = defineType({
  name: "basic.page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "basic.heroSection" }, // Reference the Hero Section object
        // Add other schemas here as you create them
        // For a blog module, a blog-posts-list object would be here
      ],
    }),
  ],
});
