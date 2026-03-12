import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/db';
import { UploadForm } from '@/components/UploadForm';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';

export default async function EventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div className="relative flex h-full w-full flex-col" key={event.id}>
      <Link
        href="/"
        className="group mb-8 inline-flex w-fit items-center gap-2 font-medium text-slate-400 transition-colors hover:text-white md:mb-12"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />{' '}
        Retornar
      </Link>

      <div className="flex flex-col items-stretch gap-12 lg:flex-row xl:gap-20">
        {/* Lado Esquerdo - Detalhes */}
        <div className="animate-in fade-in slide-in-from-left-8 flex w-full flex-col pt-2 duration-700 lg:w-[45%]">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Transforme Sua Foto
          </div>

          <h2 className="mt-2 mb-4 text-3xl leading-tight font-extrabold tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:mt-0">
            {event.nome}
          </h2>

          <p className="mb-8 text-base leading-relaxed text-slate-400 sm:mb-10 sm:text-lg">
            Diga ao mundo que você estará lá! O Magic Banner mescla sua foto com
            o design oficial do evento para criar uma arte única de divulgação.
          </p>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/60 bg-slate-800/40 p-6 shadow-inner md:p-8">
            <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
              <Wand2 className="h-32 w-32" />
            </div>

            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
              Boas Práticas:
            </h3>
            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/50">
                  1
                </div>
                <span>
                  Busque um lugar claro e tire uma selfie que mostre bem o rosto
                  e pescoço.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300 ring-1 ring-purple-500/50">
                  2
                </div>
                <span>
                  Envie no formato padrão JPEG ou PNG, com menos de 5MB.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 ring-1 ring-blue-500/50">
                  3
                </div>
                <span>
                  O sistema mesclará automaticamente sua foto com a matriz
                  criativa, no formato ideal.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lado Direito - Uploader */}
        <div className="animate-in fade-in slide-in-from-right-8 flex w-full flex-col justify-center delay-150 duration-700 lg:w-[55%]">
          <UploadForm eventId={event.id} />
        </div>
      </div>
    </div>
  );
}
