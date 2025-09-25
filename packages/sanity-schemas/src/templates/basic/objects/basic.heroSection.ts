// basic.heroSection.ts
import { defineType, defineField } from "sanity";

export const basicHeroSection = defineType({
  name: "basic.heroSection", // Name with a prefix for clarity
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "basic.callToAction", // Reference to another object schema
    }),
  ],
});
