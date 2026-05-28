import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { sanityClient, isSanityConfigured } from "./sanity";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  categorySlug?: string;
  categoryNumber?: string;
  author: string;
  authorRole?: string;
  authorPermission?: string;
  readingTime: string;
  featured?: boolean;
  number?: string;
  coverImage?: string;
  contentHtml?: string; // Untuk Markdown lokal
  content?: any;        // Untuk Portable Text Sanity
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  tagline: string;
  slugs: string[];
}

// Mengambil semua data kategori
export async function getCategoriesData(): Promise<CategoryData[]> {
  if (isSanityConfigured) {
    try {
      const query = `*[_type == "category"] | order(number asc) {
        "id": number,
        "name": title,
        "tagline": description,
        "slugs": *[_type == "post" && references(^._id)].slug.current
      }`;
      const sanityCategories = await sanityClient.fetch<CategoryData[]>(query);
      if (sanityCategories && sanityCategories.length > 0) {
        return sanityCategories;
      }
    } catch (error) {
      console.error("Failed to fetch categories from Sanity:", error);
    }
  }

  // Fallback ke data statis
  return [
    {
      id: "1.0",
      name: "AI & Agen",
      tagline: "Masa depan komputasi terdistribusi dan sistem berbasis AI-first.",
      slugs: ["membangun-aplikasi-ai-native"],
    },
    {
      id: "2.0",
      name: "Desain UX",
      tagline: "Kecepatan ekstrim, interaksi mikro, dan detail estetika visual premium.",
      slugs: ["desain-sistem-kecepatan-tinggi"],
    },
    {
      id: "3.0",
      name: "Rekayasa Frontend",
      tagline: "Arsitektur web modern, performa bundling, dan optimasi runtime.",
      slugs: ["arsitektur-frontend-tanpa-bundle"],
    },
    {
      id: "4.0",
      name: "Simulasi & Komputasi",
      tagline: "Simulasi fisika teoretis, geometri dimensi tinggi, dan rekayasa komputasi.",
      slugs: [],
    },
    {
      id: "5.0",
      name: "Embedded & IoT",
      tagline: "Integrasi perangkat keras pintar, sistem sensor terdistribusi, dan otomasi lapangan.",
      slugs: [],
    },
  ];
}

// Mengambil semua data postingan blog dan mengurutkannya berdasarkan tanggal terbaru
export async function getSortedPostsData(): Promise<PostData[]> {
  // 1. Ambil data dari Sanity jika terkonfigurasi
  if (isSanityConfigured) {
    try {
      const query = `*[_type == "post"] | order(date desc) {
        "slug": slug.current,
        title,
        description,
        date,
        "category": category->title,
        "categorySlug": category->slug.current,
        "categoryNumber": category->number,
        "author": author->name,
        "authorRole": author->role,
        "authorPermission": author->permissionRole,
        readingTime,
        featured,
        "number": coalesce(number, category->number),
        "coverImage": coverImage.asset->url,
        tags,
        seoTitle,
        seoDescription
      }`;
      const sanityPosts = await sanityClient.fetch<PostData[]>(query);
      if (sanityPosts && sanityPosts.length > 0) {
        return sanityPosts;
      }
    } catch (error) {
      console.error("Failed to fetch posts from Sanity, falling back to local files:", error);
    }
  }

  // 2. Fallback: Ambil data dari Markdown Lokal
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "General",
        author: data.author || "Anonymous",
        authorRole: data.authorRole || "",
        readingTime: data.readingTime || "1 min read",
        featured: data.featured === true,
        number: data.number || "0.0",
        coverImage: data.coverImage || "",
        tags: data.tags || [],
      } as PostData;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Mengambil detail satu postingan blog berdasarkan slug
export async function getPostData(slug: string): Promise<PostData | null> {
  // 1. Ambil data dari Sanity jika terkonfigurasi
  if (isSanityConfigured) {
    try {
      const query = `*[_type == "post" && slug.current == $slug][0] {
        "slug": slug.current,
        title,
        description,
        date,
        "category": category->title,
        "categorySlug": category->slug.current,
        "categoryNumber": category->number,
        "author": author->name,
        "authorRole": author->role,
        "authorPermission": author->permissionRole,
        readingTime,
        featured,
        "number": coalesce(number, category->number),
        "coverImage": coverImage.asset->url,
        content,
        tags,
        seoTitle,
        seoDescription
      }`;
      const post = await sanityClient.fetch<PostData | null>(query, { slug });
      if (post) {
        return post;
      }
    } catch (error) {
      console.error(`Failed to fetch post '${slug}' from Sanity, falling back to local file:`, error);
    }
  }

  // 2. Fallback: Ambil data dari Markdown Lokal
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const contentHtml = await marked.parse(content);

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || "",
      category: data.category || "General",
      author: data.author || "Anonymous",
      authorRole: data.authorRole || "",
      readingTime: data.readingTime || "1 min read",
      featured: data.featured === true,
      number: data.number || "0.0",
      coverImage: data.coverImage || "",
      contentHtml,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error reading local post data for '${slug}':`, error);
    return null;
  }
}
