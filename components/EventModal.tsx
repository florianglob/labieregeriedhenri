"use client";

import { useEffect } from "react";
import { Evenement } from "@/lib/data";

interface Props {
  event: Evenement;
  onClose: () => void;
}

export default function EventModal({ event: e, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (ev: KeyboardEvent) => { if (ev.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const paragraphs = e.desc.split(/\n+/).filter(Boolean);

  return (
    <div
      className="ev-modal-backdrop"
      onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
    >
      <div className="ev-modal" role="dialog" aria-modal="true" aria-label={e.titre}>
        <button className="ev-modal-close" aria-label="Fermer" onClick={onClose}>×</button>

        <div className="ev-modal-layout">
          {/* Photo */}
          <div className="ev-modal-img">
            {e.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.photo} alt={e.titre} />
            ) : (
              <div className="ev-modal-img-ph">
                <span className="ev-modal-date-big">
                  <span>{e.jour}</span>
                  <span>{e.mois}</span>
                </span>
              </div>
            )}
            <div className="ev-modal-tag">{e.tag}</div>
            {e.photo && (
              <div className="ev-modal-date-pill">
                <span className="ev-dp-day">{e.jour}</span>
                <span className="ev-dp-mon">{e.mois}</span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="ev-modal-body">
            <div className="ev-modal-eyebrow">{e.tag}</div>
            <h2 className="ev-modal-title">{e.titre}</h2>

            <div className="ev-modal-meta">
              <div className="ev-modal-meta-item">
                <span className="ev-modal-meta-icon">📅</span>
                <span>{e.jour} {e.mois} · {e.moisFull.split(" ").pop()}</span>
              </div>
              <div className="ev-modal-meta-item">
                <span className="ev-modal-meta-icon">🕗</span>
                <span>{e.heure}</span>
              </div>
            </div>

            <div className="ev-modal-desc">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="ev-modal-footer">
              <span className="script script-sm" style={{ color: "var(--encre-soft)" }}>
                La Bièregerie d&apos;Henri · Mortagne-sur-Sèvre
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
