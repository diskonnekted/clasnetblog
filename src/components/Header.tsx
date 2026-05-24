import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-4 h-4 rounded border border-neutral-700 bg-neutral-900 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
            ClasnetBlog
          </span>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors tracking-tight"
          >
            Beranda
          </Link>
          <Link
            href="/#posts"
            className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors tracking-tight"
          >
            Artikel
          </Link>
          <Link
            href="/#categories"
            className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors tracking-tight"
          >
            Kategori
          </Link>
          <Link
            href="/#newsletter"
            className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors tracking-tight"
          >
            Newsletter
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          <Link
            href="/#newsletter"
            className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-full border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-white hover:text-black hover:border-white transition-all focus:outline-none cursor-pointer"
          >
            Mulai Langganan
          </Link>
        </div>
      </div>
    </header>
  );
}
