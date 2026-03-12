import { getEvents } from "@/lib/db";
import { EventCard } from "@/components/EventCard";
import { Calendar } from "lucide-react";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-700/50 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)] tracking-tight flex items-center gap-3">
             <Calendar className="text-purple-400 w-8 h-8"/> Próximos Eventos
          </h2>
          <p className="text-slate-400">Selecione uma experiência e gere sua arte de divulgação oficial.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.map((event, i) => (
          <div key={event.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${i * 150}ms`}}>
             <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
