"use client";

import { useState } from "react";
import { Beer, SiteData, primaryPrice, formatLabel } from "@/lib/data";
import BeerModal from "./BeerModal";

interface Props {
  beers: Beer[];
  data: SiteData;
}

export default function BeerList({ beers, data }: Props) {
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);

  return (
    <>
      <div className="beer-list">
        {beers.map((b) => {
          const pp = primaryPrice(b);
          return (
            <div
              key={b.id}
              className="beer-row"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedBeer(b)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedBeer(b); }}
            >
              <div className="vis">
                <div className={`glass ${b.style}`}>
                  <div className="foam" />
                </div>
              </div>
              <div>
                <div className="name">{b.nom}</div>
                <div className="meta">{b.brasserie} · {b.origine}</div>
              </div>
              <span className="pill">{formatLabel(b.format)}</span>
              <span className="deg-col">{b.deg}</span>
              <span className="price-col">{pp.price}</span>
            </div>
          );
        })}
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
