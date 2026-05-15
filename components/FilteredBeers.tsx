"use client";

import { useState, useMemo } from "react";
import { Beer, SiteData } from "@/lib/data";
import BeerGrid from "./BeerGrid";
import BeerList from "./BeerList";

interface Props {
  beers: Beer[];
  data: SiteData;
  homeMode?: boolean; // show max 8, no list view
}

const PRICE_ORDER = ["25cl", "33cl", "50cl", "75cl", "pichet"];

function parsePrice(b: Beer): number {
  const k = PRICE_ORDER.find((k) => b.prix[k]);
  if (!k) return 0;
  return parseFloat(b.prix[k].replace(",", "."));
}

function parseDeg(b: Beer): number {
  return parseFloat(b.deg.replace(",", "."));
}

export default function FilteredBeers({ beers, data, homeMode = false }: Props) {
  const [activeStyle, setActiveStyle] = useState("all");
  const [activeFormat, setActiveFormat] = useState("all");
  const [activeOrigines, setActiveOrigines] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("coup");

  const filtered = useMemo(() => {
    let list = beers;
    if (activeStyle !== "all") list = list.filter((b) => b.style === activeStyle);
    if (!homeMode && activeFormat !== "all") list = list.filter((b) => b.format === activeFormat);
    if (!homeMode && activeOrigines.size > 0)
      list = list.filter((b) => activeOrigines.has(b.origine));

    if (!homeMode) {
      switch (sort) {
        case "prix-asc": list = [...list].sort((a, b) => parsePrice(a) - parsePrice(b)); break;
        case "prix-desc": list = [...list].sort((a, b) => parsePrice(b) - parsePrice(a)); break;
        case "deg": list = [...list].sort((a, b) => parseDeg(b) - parseDeg(a)); break;
        case "nom": list = [...list].sort((a, b) => a.nom.localeCompare(b.nom, "fr")); break;
        default: list = [...list].sort((a, b) => (b.coup ? 1 : 0) - (a.coup ? 1 : 0));
      }
    }
    return list;
  }, [beers, activeStyle, activeFormat, activeOrigines, sort, homeMode]);

  function toggleOrigine(o: string) {
    setActiveOrigines((prev) => {
      const next = new Set(prev);
      next.has(o) ? next.delete(o) : next.add(o);
      return next;
    });
  }

  return (
    <>
      {!homeMode && (
        <section className="tight">
          <div className="wrap">
            {/* Filters */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 700, color: "var(--brun)", paddingTop: 9, minWidth: 88 }}>
                Contenant
              </div>
              <div className="chips" style={{ margin: 0 }}>
                {(["all", "pression", "canette", "bouteille"] as const).map((f) => (
                  <button
                    key={f}
                    className={`chip${activeFormat === f ? " active" : ""}`}
                    onClick={() => setActiveFormat(f)}
                  >
                    {f === "all" ? "Tous" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ fontWeight: 700, color: "var(--brun)", paddingTop: 9, marginTop: 12 }}>
                Style
              </div>
              <div className="chips" style={{ marginTop: 12 }}>
                {data.styles.map((s) => (
                  <button
                    key={s.id}
                    className={`chip${activeStyle === s.id ? " active" : ""}`}
                    onClick={() => setActiveStyle(s.id)}
                  >
                    {s.label}{" "}
                    <span className="count">
                      {s.id === "all" ? beers.length : beers.filter((b) => b.style === s.id).length}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ fontWeight: 700, color: "var(--brun)", paddingTop: 9, marginTop: 12 }}>
                Origine
              </div>
              <div className="chips" style={{ marginTop: 12 }}>
                {data.origines.map((o) => (
                  <button
                    key={o}
                    className={`chip${activeOrigines.has(o) ? " active" : ""}`}
                    onClick={() => toggleOrigine(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 14, color: "var(--encre-soft)" }}>
                <strong style={{ color: "var(--brun)" }}>{filtered.length}</strong> bière{filtered.length !== 1 ? "s" : ""} · {" "}
                {activeStyle !== "all" || activeFormat !== "all" || activeOrigines.size > 0 ? (
                  <button
                    style={{ background: "none", border: "none", color: "var(--orange)", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 14 }}
                    onClick={() => { setActiveStyle("all"); setActiveFormat("all"); setActiveOrigines(new Set()); }}
                  >
                    Réinitialiser les filtres
                  </button>
                ) : "toutes les bières"}
              </span>
            </div>
          </div>
        </section>
      )}

      {homeMode && (
        <div className="chips" id="filter-chips">
          {data.styles.map((s) => (
            <button
              key={s.id}
              className={`chip${activeStyle === s.id ? " active" : ""}`}
              onClick={() => setActiveStyle(s.id)}
            >
              {s.label}{" "}
              <span className="count">
                {s.id === "all" ? beers.length : beers.filter((b) => b.style === s.id).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <section style={homeMode ? { paddingTop: 0, paddingBottom: 0 } : { paddingTop: 32, paddingBottom: 88 }}>
        <div className={homeMode ? "" : "wrap"}>
          {!homeMode && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, justifyContent: "flex-end" }}>
              <div className="view-toggle">
                <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
                  ▦ Grille
                </button>
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
                  ≡ Liste
                </button>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ padding: "10px 14px", border: "1.5px solid rgba(91,58,30,.18)", borderRadius: 999, background: "var(--papier)", fontFamily: "var(--font-body)", fontSize: 14 }}
              >
                <option value="coup">Tri · Coup de cœur</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="deg">Degré</option>
                <option value="nom">A → Z</option>
              </select>
            </div>
          )}

          {view === "grid" || homeMode ? (
            <BeerGrid
              beers={filtered}
              data={data}
              limit={homeMode ? 8 : undefined}
              showStrip={!homeMode}
            />
          ) : (
            <BeerList beers={filtered} data={data} />
          )}
        </div>
      </section>
    </>
  );
}
