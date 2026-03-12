import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Magic Banner | G-Dev',
  description:
    'Crie banners profissionais personalizados para seus eventos instantaneamente.',
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} relative font-sans antialiased selection:bg-purple-500/30 selection:text-white`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

        <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-16">
          <header className="animate-in fade-in slide-in-from-top-4 z-10 mt-6 mb-10 flex w-full flex-col items-center text-center duration-700 ease-out lg:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-purple-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
              </span>
              Eventos Ao Vivo
            </div>
            <h1 className="mb-4 bg-gradient-to-br from-white via-indigo-100 to-indigo-400/80 bg-clip-text font-[family-name:var(--font-outfit)] text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-5xl md:text-7xl">
              Magic Banner
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
              Sua presença, sua marca. Gere banners personalizados em segundos
              para destacar sua participação nos maiores eventos.
            </p>
          </header>

          <main className="relative z-10 w-full max-w-5xl flex-1 overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/40 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 sm:p-8 md:p-12">
            <div className="absolute top-0 left-1/4 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>
            {children}
          </main>

          <footer className="z-10 mt-16 mb-8 flex flex-col items-center gap-2 text-center text-sm font-medium text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Magic Banner. Desenvolvido com
              excelência por{' '}
              <span className="font-bold text-indigo-400">G-Dev</span>.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
