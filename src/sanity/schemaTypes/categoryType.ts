import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nama Kategori",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "number",
      title: "Nomor Pilar (e.g. 1.0, 2.0)",
      type: "string",
      description: "Digunakan untuk penomoran visual kategori di halaman beranda.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
