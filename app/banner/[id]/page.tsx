import Link from 'next/link';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { ShareButtons } from '@/components/ShareButtons';

export default async function BannerResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Decodifica a URL (base64url) enviada pelo form
  const decodedUrl = Buffer.from(id, 'base64url').toString('utf-8');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto flex w-full max-w-4xl flex-col items-center gap-12 text-center duration-700 ease-out">
      <div className="-mb-4 flex w-full items-center justify-between">
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />{' '}
          Início
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 shadow-lg shadow-emerald-500/5">
          <Check className="h-4 w-4" /> Arte Finalizada com Sucesso!
        </div>
        <h2 className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text font-[family-name:var(--font-outfit)] text-3xl leading-tight font-extrabold tracking-tight text-transparent sm:text-4xl md:text-6xl">
          O seu banner está pronto
        </h2>
        <p className="mx-auto max-w-xl px-4 text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
          Sua imagem foi processada e otimizada. Salve no seu dispositivo ou
          compartilhe diretamente com sua rede.
        </p>
      </div>

      <div className="mt-4 flex w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-10">
        {/* Lado Esquerdo - Preview da Imagem */}
        <div className="group relative aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-slate-800/80 bg-slate-900 shadow-[0_0_60px_-15px_rgba(124,58,237,0.4)] ring-1 ring-white/10 sm:rounded-[2.5rem] md:max-w-[450px]">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
          <img
            src={decodedUrl}
            alt="Banner Gerado Oficial"
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        </div>

        {/* Lado Direito - Ações */}
        <div className="flex w-full max-w-sm flex-col items-start rounded-[2rem] border border-slate-700/50 bg-slate-800/50 p-6 text-left sm:p-8 md:max-w-[350px]">
          <div className="mb-6 flex h-12 w-12 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">
            Compartilhe sua <span className="text-purple-400">#Presença</span>
          </h3>
          <p className="mb-8 text-sm text-slate-400">
            Utilize os botões abaixo para engajar seus amigos nas redes sociais.
          </p>

          <div className="w-full">
            <ShareButtons bannerUrl={decodedUrl} eventName="Evento" />
          </div>
        </div>
      </div>
    </div>
  );
}
