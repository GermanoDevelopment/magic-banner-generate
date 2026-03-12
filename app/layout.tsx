import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banner Generator para Eventos",
  description: "Crie e compartilhe banners personalizados para seus eventos favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-purple-500/30 selection:text-white relative`}
      >
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 lg:p-16">
          <header className="mb-10 lg:mb-16 text-center flex flex-col items-center mt-6 z-10 w-full animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Eventos Ao Vivo
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-[family-name:var(--font-outfit)] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-400/80 drop-shadow-sm mb-4">
              Banner Generator
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              Destaque-se na multidão. Crie banners com a sua foto instantaneamente para qualquer evento e compartilhe com sua rede.
            </p>
          </header>
          
          <main className="w-full max-w-5xl flex-1 backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 shadow-2xl rounded-3xl p-6 md:p-12 relative overflow-hidden ring-1 ring-white/10 z-10 transition-all duration-300">
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>
            {children}
          </main>
          
          <footer className="mt-16 mb-8 text-center text-sm text-slate-500 font-medium z-10">
            <p>&copy; {new Date().getFullYear()} Banner Generator. Crafted with magic.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
