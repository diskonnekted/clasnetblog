import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClasnetBlog — Jurnal & Wawasan untuk Kreator Produk",
  description: "Platform blog premium yang dirancang untuk pembangun produk, tim pengembang, dan kreator modern. Terinspirasi dari estetika desain Linear.app.",
  metadataBase: new URL("https://clasnetblog.vercel.app"),
  openGraph: {
    title: "ClasnetBlog — Jurnal & Wawasan untuk Kreator Produk",
    description: "Platform blog premium yang dirancang untuk pembangun produk, tim pengembang, dan kreator modern. Terinspirasi dari estetika desain Linear.app.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClasnetBlog — Jurnal & Wawasan untuk Kreator Produk",
    description: "Platform blog premium yang dirancang untuk pembangun produk, tim pengembang, dan kreator modern. Terinspirasi dari estetika desain Linear.app.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-black text-foreground selection:bg-brand-purple/30 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
