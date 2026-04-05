import { TicketPercent } from "lucide-react";

export const AnnouncementBar = () => (
  <div className="w-full bg-indigo-700 text-white py-2 px-4">
    <div className="mx-auto max-w-360 flex justify-center items-center gap-3">
      <TicketPercent className="w-4 h-4 animate-bounce" />
      <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-center">
        ¡Semana de locura! Usa el código <span className="bg-white text-indigo-700 px-2 py-0.5 rounded ml-1">NOVA20</span> para 20% OFF
      </p>
    </div>
  </div>
);