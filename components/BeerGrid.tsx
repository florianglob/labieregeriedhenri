"use client";

import { useState } from "react";
import { Beer, SiteData, primaryPrice, formatLabel } from "@/lib/data";
import BeerVisual from "./BeerVisual";
import BeerModal from "./BeerModal";

interface Props {
  beers: Beer[];
  data: SiteData;
  limit?: number;
  showStrip?: boolean;
}

export default function BeerGrid({ beers, data, limit, showStrip = false }: Props) {
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);

  const displayed = limit ? beers.slice(0, limit) : beers;

  return (
    <>
      <div className="beer-grid">
        {displayed.length === 0 ? (
          <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "var(--encre-soft)" }}>
            Rien dans ce style en ce moment — reviens nous voir.
          </div>
        ) : (
          displayed.map((b) => {
            const pp = primaryPrice(b);
            const prices = Object.entries(b.prix);
            return (
              <div
                key={b.id}
                className="beer-card"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedBeer(b)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedBeer(b); }}
              >
                <div className="img">
                  <span className="badge">{b.styleLabel}</span>
                  {b.coup && <span className="coup-de-coeur">★ Coup de cœur</span>}
                  <BeerVisual beer={b} />
                </div>
                <div className="body">
                  <span className="style-line">{b.origine}</span>
                  <h4>{b.nom}</h4>
                  <div className="origin">
                    {b.brasserie} · {b.note}
                  </div>
                  <div className="meta">
                    <span className="deg">{b.deg}</span>
                    <span className={`format-pill ${b.format}`}>
                      {formatLabel(b.format)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10 }}>
                    <span className="deg" style={{ fontSize: 11, letterSpacing: ".04em" }}>{pp.vol}</span>
                    <span className="price">{pp.price}</span>
                  </div>
                </div>
                {showStrip && (
                  <div className="price-strip">
                    {prices.map(([vol, price]) => (
                      <div key={vol} className="pp">
                        <span className="vol">{vol}</span>
                        <span className="pr">{price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedBeer && (
        <BeerModal
          beer={selectedBeer}
          data={data}
          onClose={() => setSelectedBeer(null)}
        />
      )}
    </>
  );
}
