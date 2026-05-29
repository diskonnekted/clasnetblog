import Link from "next/link";
import { getSortedPostsData, getCategoriesData } from "@/lib/posts";
import Card from "@/components/Card";

export default async function Home() {
  const posts = await getSortedPostsData();
  const categories = await getCategoriesData();
  
  // Ambil postingan unggulan (featured) atau postingan terbaru
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  // Postingan non-unggulan
  const regularPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <div className="relative min-h-screen bg-black grid-bg overflow-hidden flex flex-col pb-20">
      
      {/* Subtle Glow Effects in Background */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-[350px] h-[350px] rounded-full bg-white/2 blur-[80px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-white/1 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 w-full flex flex-col items-start text-left">
        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-6 max-w-3xl leading-[1.1] text-gradient">
          Jurnal Pembangunan Produk <br />
          <span className="text-gradient-accent">untuk Tim Masa Depan.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base md:text-lg text-neutral-400 max-w-2xl mb-8 leading-relaxed tracking-tight">
          Tempat kami menulis pemikiran mendalam mengenai rekayasa perangkat lunak, 
          desain antarmuka berkecepatan tinggi, dan integrasi agen AI secara native.
        </p>

        {/* Hero CTAs */}
        <div className="flex items-center space-x-4">
          <Link
            href="#posts"
            className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 cursor-pointer"
          >
            Mulai Membaca
          </Link>
          <Link
            href="#categories"
            className="px-6 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-300 text-sm font-medium hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Lihat Kategori
          </Link>
        </div>
      </section>

      {/* A New Species of Tech Journal Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="border border-card-border bg-neutral-950/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Subtle grid background inside the card */}
          <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
          
          {/* Subtle glows inside the card */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-white/[0.01] blur-3xl pointer-events-none" />
          
          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tighter leading-tight max-w-4xl text-neutral-400 mb-16 relative z-10">
            <span className="text-white">Spesies baru jurnal teknologi.</span> Dirancang khusus untuk kreator produk dengan rekayasa sistem modern, ClasnetBlog menetapkan standar baru dalam mendokumentasikan pemikiran, desain, dan arsitektur produk.
          </h2>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            {/* Column 1 */}
            <div className="flex flex-col space-y-6 md:border-r md:border-neutral-900 md:pr-10 lg:pr-12">
              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                FIG 1.0
              </span>
              <div className="h-48 flex items-center justify-start text-neutral-500 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 100 100" className="w-44 h-44 stroke-current fill-none">
                  <g strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M50 25 L80 40 L50 55 L20 40 Z" />
                    <ellipse cx="50" cy="40" rx="15" ry="7.5" />
                    <path d="M20 45 L50 60 L80 45" />
                    <path d="M20 50 L50 65 L80 50" />
                    <path d="M20 55 L50 70 L80 55" />
                    <path d="M20 60 L50 75 L80 60" />
                    <line x1="20" y1="40" x2="20" y2="60" />
                    <line x1="50" y1="55" x2="50" y2="75" />
                    <line x1="80" y1="40" x2="80" y2="60" />
                  </g>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Kajian AI-First</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Menjelajahi arsitektur masa depan yang didukung oleh Model Context Protocol (MCP) dan integrasi agen AI mandiri di dalam sistem.
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-6 md:border-r md:border-neutral-900 md:pr-10 lg:pr-12">
              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                FIG 2.0
              </span>
              <div className="h-48 flex items-center justify-start text-neutral-500 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 100 100" className="w-44 h-44 stroke-current fill-none">
                  <g strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    {/* Box 1 (back) */}
                    <path d="M45 25 L65 15 L85 25 L65 35 Z" />
                    <path d="M45 25 L45 42 L65 52 L65 35 Z" />
                    <path d="M85 25 L85 42 L65 52" />
                    
                    {/* Box 2 (front right) */}
                    <path d="M60 48 L75 40 L90 48 L75 56 Z" />
                    <path d="M60 48 L60 62 L75 70 L75 56 Z" />
                    <path d="M90 48 L90 62 L75 70" />

                    {/* Box 3 (front left) */}
                    <path d="M22 42 L37 34 L52 42 L37 50 Z" />
                    <path d="M22 42 L22 56 L37 64 L37 50 Z" />
                    <path d="M52 42 L52 56 L37 64" />
                  </g>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Filosofi Kecepatan</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Menganalisis teknik interaksi mikro, optimistik UI, dan data caching lokal untuk menyajikan antarmuka pengguna yang secepat kilat.
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-6">
              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                FIG 3.0
              </span>
              <div className="h-48 flex items-center justify-start text-neutral-500 hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 100 100" className="w-44 h-44 stroke-current fill-none">
                  <g strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M65 20 L90 30 L90 65 L65 55 Z" />
                    <path d="M58 25 L83 35 L83 70 M83 35 L58 25" />
                    <path d="M51 30 L76 40 L76 75 M76 40 L51 30" />
                    <path d="M44 35 L69 45 L69 80 M69 45 L44 35" />
                    <path d="M37 40 L62 50 L62 85 M62 50 L37 40" />
                    <path d="M30 45 L55 55 L55 90 M55 55 L30 45" />
                  </g>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Akurasi Arsitektur</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Membedah transisi ke native ESM, performa bundling edge, serta optimalisasi pemuatan halaman statis untuk efisiensi tak tertandingi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Section (Linear side-by-side layout) */}
      {featuredPost && (
        <section id="posts" className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full">
          {/* Section Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start border-b border-neutral-900 pb-6 mb-8">
            <div className="lg:col-span-7">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white leading-tight">
                Featured Article — Sorotan Utama
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                Kajian mendalam mengenai teknologi andalan yang memengaruhi cara kerja pengembang produk modern.
              </p>
            </div>
          </div>
          
          <Link href={`/blog/${featuredPost.slug}`} className="block">
            <Card className="group">
              <div className="flex flex-col">
                {/* Visual Graphics Block (Linear Aesthetic Cover Image) */}
                <div className="w-full h-64 md:h-[450px] relative overflow-hidden bg-neutral-950 border-b border-border-subtle flex items-center justify-center">
                  {featuredPost.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900 z-0" />
                  )}
                  {/* Decorative grid inside graphics */}
                  <div className="absolute inset-0 grid-bg opacity-30 z-10" />
                  
                  {/* Glowing abstract graphic */}
                  <div className="w-48 h-48 rounded-full bg-white/5 opacity-10 filter blur-3xl" />
                  
                  <div className="relative z-20 flex flex-col items-center text-center p-6 space-y-4">
                    <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest border border-neutral-800 bg-black/80 backdrop-blur-sm px-3 py-1 rounded shadow-lg">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Article Info Section */}
                <div className="p-8 flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-300 uppercase tracking-wider">{featuredPost.category}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:text-neutral-200 transition-colors leading-tight tracking-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-4xl">
                    {featuredPost.description}
                  </p>
                  
                  <div className="pt-6 border-t border-neutral-900 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                        {featuredPost.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white leading-none">{featuredPost.author}</p>
                        <p className="text-[10px] text-neutral-500 pt-0.5">{featuredPost.authorRole}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1">
                      <span>Baca Selengkapnya</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Numbered Category Grid (Linear Structure Concept) */}
      <section id="categories" className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full">
        {/* Section Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start border-b border-neutral-900 pb-6 mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white leading-tight">
              Kategori Pembahasan
            </h2>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
              Lima pilar utama rekayasa produk: Kecerdasan Buatan, Desain UX, Arsitektur Frontend, Simulasi Fisika & Komputasi, serta Sistem IoT & Perangkat Keras Pintar.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            categories.filter((_, i) => i % 3 === 0),
            categories.filter((_, i) => i % 3 === 1),
            categories.filter((_, i) => i % 3 === 2),
          ].map((columnCategories, colIdx) => (
            <div key={colIdx} className="flex flex-col space-y-12">
              {columnCategories.map((cat) => {
                // Temukan postingan yang termasuk dalam kategori ini
                const catPosts = posts.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase() || cat.slugs.includes(p.slug)
                );

                return (
                  <div key={cat.id} className="flex flex-col space-y-6">
                    {/* Header Kategori */}
                    <div className="border-b border-neutral-900 pb-4 flex flex-col space-y-2">
                      <span className="text-xs font-mono text-neutral-500 font-bold uppercase tracking-wider">
                        {cat.id}
                      </span>
                      <h3 className="text-base font-semibold text-white tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {cat.tagline}
                      </p>
                    </div>

                    {/* Daftar Artikel Kategori */}
                    <div className="flex flex-col space-y-4">
                      {catPosts.length > 0 ? (
                        catPosts.map((post) => (
                          <Link href={`/blog/${post.slug}`} key={post.slug} className="block">
                            <Card className="p-4">
                              <div className="flex flex-col space-y-3">
                                {post.coverImage && (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-32 object-cover rounded-lg border border-border-subtle opacity-75 group-hover:opacity-100 transition-all duration-300"
                                  />
                                )}
                                <div className="flex flex-col space-y-1">
                                  <span className="text-[10px] text-neutral-500">{post.date} • {post.readingTime}</span>
                                  <h4 className="text-sm font-semibold text-white group-hover:text-neutral-300 transition-colors line-clamp-2 tracking-tight">
                                    {post.title}
                                  </h4>
                                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                                    {post.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-600 italic">Belum ada artikel di kategori ini.</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section (Linear Footer CTA Style) */}
      <section id="newsletter" className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full mt-10">
        <Card className="border-border-subtle p-8 md:p-12 relative overflow-hidden bg-neutral-950">
          <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-white/1 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-xl flex flex-col space-y-6">
            <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tighter">
              Tetap Terdepan dalam <br />
              <span className="text-gradient-accent">Pengembangan Produk.</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Bergabunglah dengan ribuan kreator produk dan insinyur perangkat lunak lainnya. Kami mengirimkan satu wawasan mendalam setiap minggu, bebas dari spam.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="Alamat email Anda..."
                required
                className="px-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-white/20 placeholder-neutral-500 transition-all flex-grow"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 active:scale-95 transition-all shadow-md shadow-white/10 whitespace-nowrap cursor-pointer"
              >
                Langganan Sekarang
              </button>
            </form>
          </div>
        </Card>
      </section>
      
    </div>
  );
}
