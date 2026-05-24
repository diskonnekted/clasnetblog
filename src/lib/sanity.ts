import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2026-05-25";

// Menentukan apakah Sanity dikonfigurasi secara lengkap
export const isSanityConfigured = Boolean(projectId && projectId !== "your-sanity-project-id");

export const sanityClient = createClient({
  projectId: projectId || "dummy-id",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!isSanityConfigured || !source) {
    return "";
  }
  try {
    return builder.image(source).url();
  } catch (error) {
    console.error("Error generating Sanity image URL:", error);
    return "";
  }
}
