import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { UploadForm } from "@/components/UploadForm";
import Link from "next/link";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";

export default async function EventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div className="flex flex-col w-full h-full relative" key={event.id}>
      <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors w-fit group mb-8 md:mb-12">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> Retornar
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-stretch">
        
        {/* Lado Esquerdo - Detalhes */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold text-xs tracking-wider uppercase border border-indigo-500/20 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Transforme Sua Foto
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {event.nome}
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Chegou a hora de fazer parte da experiência. Faça upload com fundo limpo (e boa iluminação) para gerarmos sua arte oficial e divulgarmos juntos este super evento.
          </p>

          <div className="bg-slate-800/40 p-6 md:p-8 rounded-[2rem] border border-slate-700/60 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Wand2 className="w-32 h-32" />
             </div>
             
             <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                Boas Práticas:
             </h3>
             <ul className="space-y-4 text-slate-300">
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-indigo-500/50">1</div>
                   <span>Busque um lugar claro e tire uma selfie que mostre bem o rosto e pescoço.</span>
                </li>
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-purple-500/50">2</div>
                   <span>Envie no formato padrão JPEG ou PNG, com menos de 5MB.</span>
                </li>
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-blue-500/50">3</div>
                   <span>O sistema mesclará automaticamente sua foto com a matriz criativa, no formato ideal.</span>
                </li>
             </ul>
          </div>
        </div>

        {/* Lado Direito - Uploader */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
           <UploadForm eventId={event.id} />
        </div>
        
      </div>
    </div>
  );
}
