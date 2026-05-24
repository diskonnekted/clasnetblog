import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full overflow-hidden min-h-full flex flex-col">
      {/* Ambient background glow elements */}
      <div className="glow-bg-purple -top-40 -left-40 pointer-events-none" />
      <div className="glow-bg-blue top-1/3 -right-40 pointer-events-none" />
      
      <Header />
      <main className="flex-grow z-10">{children}</main>
      <Footer />
    </div>
  );
}
