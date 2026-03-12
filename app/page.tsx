import { getEvents } from '@/lib/db';
import { EventCard } from '@/components/EventCard';
import { Calendar } from 'lucide-react';

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-700/50 pb-6 md:flex-row md:items-end">
        <div>
          <h2 className="mb-3 flex items-center gap-3 font-[family-name:var(--font-outfit)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <Calendar className="h-7 w-7 text-purple-400 sm:h-8 sm:w-8" />{' '}
            Próximos Eventos
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Selecione uma experiência e gere sua arte de divulgação oficial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {events.map((event, i) => (
          <div
            key={event.id}
            className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both duration-700"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
