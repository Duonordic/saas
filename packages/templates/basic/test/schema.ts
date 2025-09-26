// Sanity schema definitions for test template
export const testSchema = {
  name: 'test',
  title: 'test',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    // Add more fields as needed for your template
  ],
};
