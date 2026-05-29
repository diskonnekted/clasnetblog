import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-subtle bg-black py-12 mt-20 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-tr from-brand-purple to-brand-pink p-[1px]">
              <div className="w-full h-full bg-black rounded-[3px] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              ClasnetBlog
            </span>
          </div>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            Menulis pemikiran, teknik desain sistem, dan arsitektur pengembangan produk untuk tim modern.
          </p>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Kategori
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#posts" className="text-neutral-500 hover:text-white transition-colors">
                AI & Agen
              </Link>
            </li>
            <li>
              <Link href="/#posts" className="text-neutral-500 hover:text-white transition-colors">
                Desain UX
              </Link>
            </li>
            <li>
              <Link href="/#posts" className="text-neutral-500 hover:text-white transition-colors">
                Rekayasa Frontend
              </Link>
            </li>
            <li>
              <Link href="/#posts" className="text-neutral-500 hover:text-white transition-colors">
                Simulasi & Komputasi
              </Link>
            </li>
            <li>
              <Link href="/#posts" className="text-neutral-500 hover:text-white transition-colors">
                Embedded & IoT
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Sumber Daya
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
                Dokumentasi
              </Link>
            </li>
            <li>
              <Link href="/#newsletter" className="text-neutral-500 hover:text-white transition-colors">
                Newsletter
              </Link>
            </li>
            <li>
              <Link href="https://github.com" target="_blank" className="text-neutral-500 hover:text-white transition-colors">
                Repositori GitHub
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Legal & Kontak
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-neutral-500">hello@clasnetblog.com</span>
            </li>
            <li>
              <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-neutral-600">
          &copy; {currentYear} ClasnetBlog. Seluruh hak cipta dilindungi.
        </span>
        <div className="flex space-x-6 text-[10px] text-neutral-600">
          <span>Dibuat dengan Next.js & Tailwind CSS v4</span>
        </div>
      </div>
    </footer>
  );
}
