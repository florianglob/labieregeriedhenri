"use client";

import { useEffect } from "react";
import { Beer, SiteData, beerDetails, allPrices, formatLabel, ibuLevel, ebcColor } from "@/lib/data";
import BeerVisual from "./BeerVisual";

interface Props {
  beer: Beer;
  data: SiteData;
  onClose: () => void;
}

export default function BeerModal({ beer, data, onClose }: Props) {
  const d = beerDetails(beer, data);
  const prices = allPrices(beer);
  const amertumePct = d.amertume?.pct ?? ibuLevel(d.ibu);
  const amertumeLabelStr = d.amertume?.label ?? null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      className="beer-modal-backdrop show"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="beer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Fiche ${beer.nom}`}
      >
        <button className="bm-close" aria-label="Fermer" onClick={onClose}>
          ×
        </button>

        <div className="bm-layout">
          {/* Colonne visuelle */}
          <div className="bm-vis-wrap">
            <div className="bm-vis">
              <BeerVisual beer={beer} />
            </div>
            {beer.coup && (
              <div className="bm-coup">★ Coup de cœur d&apos;Henri</div>
            )}
            <div className="bm-vis-meta">
              <span className="bm-pill">{formatLabel(beer.format)}</span>
              <span className="bm-pill">{beer.styleLabel}</span>
              <span className="bm-pill">{beer.deg}</span>
            </div>
          </div>

          {/* Colonne contenu */}
          <div className="bm-body">
            <div className="bm-eyebrow">
              {beer.brasserie} · {beer.origine}
            </div>
            <h2 className="bm-title">{beer.nom}</h2>
            <p className="bm-note">
              <span className="script script-md">«&nbsp;</span>
              {beer.note}
              <span className="script script-md">&nbsp;»</span>
            </p>

            {/* Stats */}
            <div className="bm-stats">
              <div className="bm-stat">
                <div className="bm-stat-label">Degré</div>
                <div className="bm-stat-value">{beer.deg}</div>
                <div className="bm-stat-sub">alc. vol.</div>
              </div>
              <div className="bm-stat">
                <div className="bm-stat-label">IBU</div>
                <div className="bm-stat-value">{d.ibu ?? "—"}</div>
                <div className="bm-stat-sub">amertume</div>
              </div>
              <div className="bm-stat">
                <div className="bm-stat-label">EBC</div>
                <div className="bm-stat-value">
                  {d.ebc != null && (
                    <span
                      className="bm-ebc-chip"
                      style={{ background: ebcColor(d.ebc) }}
                    />
                  )}
                  {d.ebc ?? "—"}
                </div>
                <div className="bm-stat-sub">couleur</div>
              </div>
              <div className="bm-stat">
                <div className="bm-stat-label">Format</div>
                <div className="bm-stat-value">{formatLabel(beer.format)}</div>
                <div className="bm-stat-sub">
                  {beer.format === "pression" ? "au comptoir" : "à emporter"}
                </div>
              </div>
            </div>

            {/* Amertume bar */}
            {amertumePct != null && (
              <div className="bm-bar">
                {amertumeLabelStr && (
                  <div className="bm-bar-label">{amertumeLabelStr}</div>
                )}
                <div className="bm-bar-track">
                  <div
                    className="bm-bar-fill"
                    style={{ left: `${amertumePct}%`, right: 0 }}
                  />
                  <div
                    className="bm-bar-cursor"
                    style={{ left: `${amertumePct}%` }}
                  />
                </div>
                <div className="bm-bar-scale">
                  <span>doux</span>
                  <span>équilibré</span>
                  <span>amer</span>
                  <span>très amer</span>
                </div>
              </div>
            )}

            {/* Histoire */}
            {d.histoire && (
              <div className="bm-histoire">
                <div className="script script-sm" style={{ color: "var(--orange)" }}>
                  L&apos;histoire
                </div>
                <p>{d.histoire}</p>
              </div>
            )}

            {/* Prix */}
            <div className="bm-prices">
              {prices.map((p) => (
                <div key={p.vol} className="bm-price">
                  <div className="bm-price-vol">{p.vol}</div>
                  <div className="bm-price-amt">{p.price}</div>
                </div>
              ))}
            </div>

            <div className="bm-footer">
              <span className="script script-sm">à découvrir au comptoir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
