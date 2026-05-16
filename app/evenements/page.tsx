"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EventModal from "@/components/EventModal";
import { BASE_DATA, SiteData, Evenement } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

const MONTHS = ["Mai 2026", "Juin 2026"];

export default function EvenementsPage() {
  const [D, setD] = useState<SiteData>(BASE_DATA);
  useEffect(() => { loadAdminData().then(setD).catch(() => {}); }, []);
  const [activeTag, setActiveTag] = useState("Toutes");
  const [monthIdx, setMonthIdx] = useState(0);
  const [selected, setSelected] = useState<Evenement | null>(null);

  const allTags = ["Toutes", ...Array.from(new Set(D.evenementsAvenir.map((e) => e.tag)))];

  const filtered = D.evenementsAvenir.filter((e) => {
    const matchTag = activeTag === "Toutes" || e.tag === activeTag;
    const matchMonth = e.moisFull === MONTHS[monthIdx];
    return matchTag && matchMonth;
  });

  return (
    <>
      <Nav active="evenements" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · Événements
          </div>
          <div>
            <span className="eyebrow">Agenda</span>
            <h1 style={{ marginTop: 14 }}>
              Ce qui se <span className="scripted">passe</span> ici
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Dégustations, concerts, quizz, soirées thématiques. Il se passe toujours
              quelque chose au comptoir.
            </p>
          </div>
        </div>
      </header>

      <section className="tight">
        <div className="wrap">
          {/* Filtre catégorie */}
          <div className="chips">
            {allTags.map((t) => (
              <button
                key={t}
                className={`chip${activeTag === t ? " active" : ""}`}
                onClick={() => setActiveTag(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Navigation par mois */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16, background: "var(--papier-warm)", borderRadius: 14, padding: "18px 24px" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
              disabled={monthIdx === 0}
              style={{ opacity: monthIdx === 0 ? 0.4 : 1 }}
            >
              ←
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--brun)", flex: 1, textAlign: "center" }}>
              {MONTHS[monthIdx]}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setMonthIdx((i) => Math.min(MONTHS.length - 1, i + 1))}
              disabled={monthIdx === MONTHS.length - 1}
              style={{ opacity: monthIdx === MONTHS.length - 1 ? 0.4 : 1 }}
            >
              →
            </button>
          </div>

          {/* Grille */}
          <div className="events-grid" style={{ marginTop: 32 }}>
            {filtered.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "var(--encre-soft)" }}>
                Pas d&apos;événement ce mois-ci pour ce filtre.
              </div>
            ) : (
              filtered.map((e) => (
                <div
                  key={e.id}
                  id={`ev-${e.id}`}
                  className="event-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(e)}
                >
                  <div className="img">
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
                          <span className="ph-dim">800×800</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="body">
                    <h4>{e.titre}</h4>
                    <div className="meta-line">
                      <span>● {e.heure}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--encre-soft)", margin: "8px 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {e.desc}
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}>
                      En savoir plus <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>


{selected && <EventModal event={selected} onClose={() => setSelected(null)} />}

      <Footer data={D} />
    </>
  );
}
