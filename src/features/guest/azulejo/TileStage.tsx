import { Baby, Bike, Car, Clock, Wine, type LucideIcon } from "lucide-react";
import type { ShowEvent } from "@/shared/types";
import { extraById, roomById } from "@/shared/hotel";
import { getQuote } from "@/shared/pricing";
import { ROOMS_DISPLAY } from "../siteContent";
import { az, num, serif } from "./palette";
import { Tile, pat } from "./Tile";

const EXTRA_ICONS: Record<string, LucideIcon> = { airport_transfer: Car, celebration_package: Wine, late_checkout: Clock, bike_rental: Bike, baby_cot: Baby };

type Stay = {
  room?: string | undefined;
  checkIn?: string | undefined;
  checkOut?: string | undefined;
  guests?: string | undefined;
  extra?: string | undefined;
  price?: string | undefined;
  confirmed: boolean;
};

/** Folds the agent's events into "what we know about the stay so far". */
function toStay(events: ShowEvent[]): Stay {
  const s: Stay = { confirmed: false };
  for (const e of events) {
    if (e.kind === "room" && e.id) s.room = e.id;
    if (e.kind === "extra" && e.id) s.extra = e.id;
    if (e.kind === "guests" && e.data) s.guests = e.data;
    if (e.kind === "price" && e.data) s.price = e.data;
    if (e.kind === "dates" && e.data) {
      const m = e.data.match(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/);
      if (m) {
        s.checkIn = m[1];
        s.checkOut = m[2];
      }
    }
    if (e.kind === "confirmation") s.confirmed = true;
  }
  return s;
}

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** One slot: a patterned tile that flips to reveal its content when filled. */
function Slot({ filled, i, children, wide = false }: { filled: boolean; i: number; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`[perspective:900px] ${wide ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}>
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1)", transform: filled ? "rotateY(180deg)" : "none" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-sm opacity-50 [backface-visibility:hidden]">
          <Tile pattern={pat(i)} className="h-full w-full" />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-sm shadow-[0_18px_40px_-20px_rgba(15,27,61,0.5)] [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ backgroundColor: az.paper }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs" style={{ color: az.cobalt }}>{children}</p>;
}

export function TileStage({ events }: { events: ShowEvent[] }) {
  const s = toStay(events);
  const room = roomById(s.room);
  const roomImg = ROOMS_DISPLAY.find((r) => r.name === room?.name)?.image;
  const extra = extraById(s.extra);
  const ExtraIcon = (s.extra && EXTRA_ICONS[s.extra]) || Wine;
  const quote = room && s.checkIn && s.checkOut ? getQuote({ room_id: room.id, check_in: s.checkIn, check_out: s.checkOut, ...(extra ? { extra_id: extra.id } : {}) }) : null;
  const total = quote?.total ?? (s.price ? Number(s.price) : undefined);
  const priceShown = Boolean(s.price);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-3">
        <Slot filled={!!room} i={0} wide>
          {room && (
            <div className="relative h-full">
              {roomImg && <img src={roomImg} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0" style={{ background: `linear-gradient(transparent 30%, ${az.navy}dd)` }} />
              <div className="absolute bottom-3 left-4 right-4" style={{ color: az.glaze }}>
                <p className="text-[10px] tracking-[0.25em] opacity-80">your room.</p>
                <p className="text-2xl" style={serif}>{room.name}</p>
                <p className="text-xs opacity-80">{room.size_m2} m² · {room.feature}</p>
              </div>
            </div>
          )}
        </Slot>

        <Slot filled={!!s.checkIn} i={1}>
          <div className="flex h-full flex-col justify-between p-3">
            <Label>dates.</Label>
            {s.checkIn && s.checkOut && (
              <div>
                <p className="text-lg leading-tight" style={{ ...serif, color: az.ink }}>{fmt(s.checkIn)}</p>
                <p className="text-xs" style={{ color: az.muted }}>to {fmt(s.checkOut)}</p>
                <p className="mt-1 text-xs" style={{ color: az.cobalt, ...num }}>{quote?.nights ?? ""} nights</p>
              </div>
            )}
          </div>
        </Slot>

        <Slot filled={!!s.guests} i={2}>
          <div className="flex h-full flex-col justify-between p-3">
            <Label>guests.</Label>
            <p className="text-lg leading-tight" style={{ ...serif, color: az.ink }}>{s.guests}</p>
          </div>
        </Slot>

        <Slot filled={!!extra} i={3}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
            <ExtraIcon size={26} strokeWidth={1.3} style={{ color: az.cobalt }} className="az-label-in" />
            <p className="text-sm leading-tight" style={{ ...serif, color: az.ink }}>{extra?.name}</p>
          </div>
        </Slot>

        <Slot filled={priceShown} i={4}>
          <div className="flex h-full flex-col justify-between p-3" style={num}>
            <Label>your stay.</Label>
            {quote && (
              <div className="space-y-0.5 text-[11px]" style={{ color: az.muted }}>
                <div className="flex justify-between"><span>{quote.nights} × room</span><span>€{quote.room_total}</span></div>
                {quote.extra_total > 0 && <div className="flex justify-between"><span>extra</span><span>€{quote.extra_total}</span></div>}
              </div>
            )}
            <p className="text-2xl" style={{ ...serif, color: az.cobalt }}>€{total}</p>
          </div>
        </Slot>
      </div>

      {s.confirmed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="az-stamp rounded-sm border-4 px-6 py-3 text-center" style={{ borderColor: az.cobalt, color: az.cobalt, backgroundColor: `${az.glaze}ee` }}>
            <p className="text-2xl" style={serif}>enviado ✓</p>
            <p className="text-xs">sent to the team · reply by 10:00</p>
          </div>
        </div>
      )}
    </div>
  );
}
