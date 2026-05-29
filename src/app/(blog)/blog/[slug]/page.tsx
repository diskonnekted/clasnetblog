import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData, getCategoriesData } from "@/lib/posts";
import Card from "@/components/Card";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Custom components to style PortableText block elements beautifully
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imgUrl = urlFor(value);
      if (!imgUrl) return null;
      return (
        <div className="relative my-8 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={value.alt || "Gambar Artikel"}
            className="w-full h-auto object-cover max-h-[500px]"
          />
          {value.caption && (
            <div className="p-3 text-center text-xs text-neutral-500 border-t border-neutral-850">
              {value.caption}
            </div>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4 tracking-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg md:text-xl font-semibold text-white mt-8 mb-3 tracking-tight">{children}</h3>,
    normal: ({ children }: any) => <p className="text-neutral-400 mb-6 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-white pl-4 italic text-neutral-300 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-400">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-neutral-400">{children}</ol>,
  },
};

// Generate static params for all posts to enable SSG
export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const categories = await getCategoriesData();

  if (!post) {
    notFound();
  }

  // Ambil postingan lain untuk rekomendasi (Related Posts)
  const allPosts = await getSortedPostsData();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="relative min-h-screen bg-black grid-bg pb-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/3 w-[300px] h-[300px] rounded-full bg-white/1 blur-[80px]" />
        <div className="absolute top-20 right-1/3 w-[300px] h-[300px] rounded-full bg-white/1 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16">
        
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-neutral-500 hover:text-white transition-colors mb-12 group"
        >
          <span className="mr-1 transform group-hover:-translate-x-1 transition-transform">←</span>
          Kembali ke beranda
        </Link>

        {/* Article Header */}
        <header className="flex flex-col space-y-6 mb-12 border-b border-border-subtle pb-10">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 border border-white/10 bg-white/5 px-2 py-0.5 rounded">
              {post.category}
            </span>
            <span className="text-xs text-neutral-500">{post.date}</span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-500">{post.readingTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-3xl italic">
            {post.description}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            {/* Author avatar placeholder */}
            <div className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center text-xs font-bold text-white">
              {post.author.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author}</p>
              <p className="text-xs text-neutral-500">{post.authorRole || "Kontributor"}</p>
            </div>
          </div>
        </header>

        {/* Article content and layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content body */}
          <article className="lg:col-span-9 blog-content w-full overflow-hidden">
            {/* Render Sanity Portable Text if present */}
            {post.content ? (
              <PortableText value={post.content} components={portableTextComponents} />
            ) : post.contentHtml ? (
              /* Fallback to Markdown HTML */
              <div
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : null}
          </article>

          {/* Sidebar (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              {/* Categories list */}
              <div className="border border-border-subtle bg-card-bg backdrop-blur p-5 rounded-xl flex flex-col space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-900 pb-2">
                  Kategori
                </h4>
                <ul className="flex flex-col space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href="/#categories"
                        className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center justify-between group"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400 transition-colors">
                          {cat.id}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-border-subtle">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-8">
              Artikel Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <Link href={`/blog/${rPost.slug}`} key={rPost.slug} className="block">
                  <Card className="hover:border-neutral-750 p-6">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-500">
                        <span className="font-semibold text-neutral-400">{rPost.category}</span>
                        <span>•</span>
                        <span>{rPost.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-neutral-300 transition-colors line-clamp-2">
                        {rPost.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {rPost.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
