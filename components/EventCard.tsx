import Link from 'next/link';
import Image from 'next/image';
import { EventConfig } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export function EventCard({ event }: { event: EventConfig }) {
  return (
    <Link
      href={`/eventos/${event.id}`}
      className="group block rounded-3xl focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-800/80 p-5 transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.3)]">
        <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-black/40 shadow-inner transition-colors group-hover:border-purple-500/30">
          <Image
            src={event.templatePath}
            alt={event.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40"></div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-300">
            {event.nome}
          </h3>

          <div className="flex w-fit items-center gap-2 text-sm font-medium tracking-wide text-purple-400">
            <span>Criar Banner</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
