"use client";

import { useState, useMemo } from "react";
import { Beer, SiteData } from "@/lib/data";
import BeerGrid from "./BeerGrid";
import BeerList from "./BeerList";

interface Props {
  beers: Beer[];
  data: SiteData;
  homeMode?: boolean;
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
  const [activeStyle, setActiveStyle] = useState("all"); // "all" ou un styleLabel
  const [activeFormat, setActiveFormat] = useState("all");
  const [activeOrigines, setActiveOrigines] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("coup");

  // Styles uniques tirés des vraies données (styleLabel)
  const allStyleLabels = useMemo(() =>
    [...new Set(beers.map(b => b.styleLabel))].sort((a, b) => a.localeCompare(b, "fr")),
    [beers]
  );

  // Origines uniques tirées des vraies données
  const allOriginesFromBeers = useMemo(() =>
    [...new Set(beers.map(b => b.origine))].sort((a, b) => a.localeCompare(b, "fr")),
    [beers]
  );

  // Styles disponibles selon les filtres origine + format actifs.
  // On inclut toujours le style actif pour que son bouton reste visible (déselection possible).
  const availableStyleLabels = useMemo(() => {
    let base = beers;
    if (!homeMode && activeFormat !== "all") base = base.filter(b => b.format === activeFormat);
    if (!homeMode && activeOrigines.size > 0) base = base.filter(b => activeOrigines.has(b.origine));
    const available = new Set(base.map(b => b.styleLabel));
    if (activeStyle !== "all") available.add(activeStyle);
    return allStyleLabels.filter(l => available.has(l));
  }, [beers, activeFormat, activeOrigines, activeStyle, allStyleLabels, homeMode]);

  // Origines disponibles selon les filtres style + format actifs.
  // On inclut toujours les origines actives pour que leurs boutons restent visibles.
  const availableOrigines = useMemo(() => {
    let base = beers;
    if (!homeMode && activeFormat !== "all") base = base.filter(b => b.format === activeFormat);
    if (activeStyle !== "all") base = base.filter(b => b.styleLabel === activeStyle);
    const available = new Set(base.map(b => b.origine));
    activeOrigines.forEach(o => available.add(o));
    return allOriginesFromBeers.filter(o => available.has(o));
  }, [beers, activeFormat, activeStyle, activeOrigines, allOriginesFromBeers, homeMode]);

  const filtered = useMemo(() => {
    let list = beers;
    if (activeStyle !== "all") list = list.filter(b => b.styleLabel === activeStyle);
    if (!homeMode && activeFormat !== "all") list = list.filter(b => b.format === activeFormat);
    if (!homeMode && activeOrigines.size > 0) list = list.filter(b => activeOrigines.has(b.origine));

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
    setActiveOrigines(prev => {
      const next = new Set(prev);
      next.has(o) ? next.delete(o) : next.add(o);
      return next;
    });
  }

  function toggleStyle(label: string) {
    setActiveStyle(prev => prev === label ? "all" : label);
  }

  const hasActiveFilters = activeStyle !== "all" || activeFormat !== "all" || activeOrigines.size > 0;

  return (
    <>
      {!homeMode && (
        <section className="tight">
          <div className="wrap">
            <div className="chips" id="filter-chips">
              <button
                className={`chip${activeStyle === "all" ? " active" : ""}`}
                onClick={() => setActiveStyle("all")}
              >
                Toutes <span className="count">{beers.length}</span>
              </button>
              {availableStyleLabels.map((label) => (
                <button
                  key={label}
                  className={`chip${activeStyle === label ? " active" : ""}`}
                  onClick={() => toggleStyle(label)}
                >
                  {label}{" "}
                  <span className="count">{beers.filter(b => b.styleLabel === label).length}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 14, color: "var(--encre-soft)" }}>
                <strong style={{ color: "var(--brun)" }}>{filtered.length}</strong> bière{filtered.length !== 1 ? "s" : ""} ·{" "}
                {hasActiveFilters ? (
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
          <button
            className={`chip${activeStyle === "all" ? " active" : ""}`}
            onClick={() => setActiveStyle("all")}
          >
            Toutes <span className="count">{beers.length}</span>
          </button>
          {availableStyleLabels.map((label) => (
            <button
              key={label}
              className={`chip${activeStyle === label ? " active" : ""}`}
              onClick={() => toggleStyle(label)}
            >
              {label}{" "}
              <span className="count">{beers.filter(b => b.styleLabel === label).length}</span>
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
