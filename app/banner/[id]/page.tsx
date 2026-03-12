import Link from "next/link";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

export default async function BannerResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Decodifica a URL (base64url) enviada pelo form
  const decodedUrl = Buffer.from(id, 'base64url').toString('utf-8');

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto gap-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both w-full">
      <div className="w-full flex justify-between items-center -mb-4">
         <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors w-fit group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> Início
         </Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-sm border border-emerald-500/20 mb-6 shadow-lg shadow-emerald-500/5">
          <Check className="w-4 h-4" /> Arte Finalizada com Sucesso!
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight font-[family-name:var(--font-outfit)] leading-tight mb-4">
          O seu banner está pronto
        </h2>
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed px-4">
          Sua imagem foi processada e otimizada. Salve no seu dispositivo ou compartilhe diretamente com sua rede.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 w-full mt-4">
         {/* Lado Esquerdo - Preview da Imagem */}
        <div className="w-full max-w-sm md:max-w-[450px] aspect-square rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(124,58,237,0.4)] ring-1 ring-white/10 relative group bg-slate-900 border-4 border-slate-800/80">
           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-10 pointer-events-none rounded-[2.5rem]"></div>
           <img 
              src={decodedUrl} 
              alt="Banner Gerado Oficial" 
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
           />
        </div>

         {/* Lado Direito - Ações */}
        <div className="w-full max-w-sm md:max-w-[350px] flex flex-col items-start text-left bg-slate-800/50 p-6 sm:p-8 rounded-[2rem] border border-slate-700/50">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-6 rotate-3">
              <Sparkles className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Compartilhe sua <span className="text-purple-400">#Presença</span></h3>
           <p className="text-slate-400 text-sm mb-8">Utilize os botões abaixo para engajar seus amigos nas redes sociais.</p>

           <div className="w-full">
              <ShareButtons bannerUrl={decodedUrl} eventName="Evento" />
           </div>
        </div>
      </div>
    </div>
  );
}
