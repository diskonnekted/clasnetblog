import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "permissionRole",
      title: "Role Ijin Penulis (Permissions)",
      type: "string",
      options: {
        list: [
          { title: "Administrator", value: "admin" },
          { title: "Editor", value: "editor" },
          { title: "Kontributor / Penulis", value: "contributor" },
        ],
      },
      initialValue: "contributor",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
