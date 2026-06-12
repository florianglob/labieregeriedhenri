"use client";

import { useState } from "react";
import { Evenement } from "@/lib/data";
import EventModal from "@/components/EventModal";

export default function HomeEvents({ events }: { events: Evenement[] }) {
  const [selected, setSelected] = useState<Evenement | null>(null);

  return (
    <>
      <div className="events-grid">
        {events.map((e, i) => (
          <div key={e.id} className="event-card" style={{ cursor: "default" }}>
            <div className="img" data-anim="fade" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="tag">{e.tag}</span>
              <span className="date">
                <span className="d">{e.jour}</span>
                <span className="m">{e.mois}</span>
              </span>
              {e.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.photo} alt={e.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="ph">
                  <div className="ph-inner">
                    <span className="ph-tag">PHOTO ÉVÉNEMENT</span>
                    <span className="ph-dim">800×800 · {e.tag.toLowerCase()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="body">
              <h4>{e.titre}</h4>
              <div className="meta-line">
                <span>● {e.heure}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => setSelected(e)}
              >
                En savoir plus <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
