import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE_DATA, Boisson } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "La carte · La Bièregerie d'Henri",
  description: "Bières pression, vins au verre, apéritifs et planches à partager.",
};

const VIN_CATEGORIES = ["Vin blanc", "Vin rouge", "Vin rosé", "Vin pétillant"];

const SIZES = [
  { key: "25cl",   label: "25cl" },
  { key: "33cl",   label: "33cl" },
  { key: "50cl",   label: "50cl" },
  { key: "pichet", label: "Pichet 1L" },
] as const;

function PriceRow({ nom, prix, description }: { nom: string; prix: string; description?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid rgba(91,58,30,0.08)" }}>
      <div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--encre)" }}>{nom}</span>
        {description && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--encre-soft)" }}>{description}</span>}
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--orange)", flexShrink: 0, marginLeft: 16 }}>
        {prix}
      </span>
    </div>
  );
}

export default async function CartePage() {
  const D = await loadAdminData().catch(() => BASE_DATA);

  const bieresPression = D.bieres.filter((b) => b.format === "pression");

  const byCat: Record<string, Boisson[]> = {};
  for (const b of D.boissons) (byCat[b.categorie] ??= []).push(b);

  const vins = VIN_CATEGORIES.filter((c) => (byCat[c]?.length ?? 0) > 0);
  const aperitifs = byCat["Apéritif"] ?? [];
  const softs = byCat["Soft"] ?? [];
  const aPartager = byCat["À partager"] ?? [];

  return (
    <>
      <Nav active="carte" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · La carte
          </div>
          <div>
            <span className="eyebrow">Bières, vins &amp; grignotages</span>
            <h1 style={{ marginTop: 14 }}>
              La <span className="scripted">carte</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Tout ce qu&apos;on sert au comptoir — bières pression, vins au verre,
              apéritifs et planches à partager.
            </p>
          </div>
        </div>
      </header>

      {/* ── BIÈRES PRESSION ── */}
      <section className="tight">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="eyebrow">Pression</span>
              <h2 style={{ marginTop: 8 }}>Les bières <span className="scripted">du moment</span></h2>
            </div>
            <Link href="/bieres" className="btn btn-ghost btn-sm">
              Toute la carte bières <span className="arrow">→</span>
            </Link>
          </div>

          <div style={{ background: "#fff", border: "1px solid rgba(91,58,30,0.08)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                <thead>
                  <tr style={{ background: "var(--brun-dark)", color: "var(--craie)" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14 }}>Bière</th>
                    {SIZES.map((s) => (
                      <th key={s.key} style={{ padding: "14px 12px", textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14, color: "var(--dore)" }}>{s.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bieresPression.map((b, i) => (
                    <tr key={b.id} style={{ borderTop: "1px solid rgba(91,58,30,0.07)", background: i % 2 === 0 ? "#fff" : "var(--papier)" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--brun)" }}>
                          {b.coup && <span style={{ color: "var(--orange)", marginRight: 6 }}>★</span>}
                          {b.nom}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--encre-soft)", marginTop: 2 }}>
                          {b.styleLabel} · {b.deg} · {b.brasserie}
                        </div>
                      </td>
                      {SIZES.map((s) => (
                        <td key={s.key} style={{ padding: "14px 12px", textAlign: "center" }}>
                          {b.prix[s.key] ? (
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--orange)" }}>
                              {b.prix[s.key]}
                            </span>
                          ) : (
                            <span style={{ color: "var(--encre-soft)", opacity: 0.35 }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 20px", background: "var(--papier-warm)", fontSize: 13, color: "var(--encre-soft)", borderTop: "1px solid rgba(91,58,30,0.08)" }}>
              Supplément Picon : 0,50 € · Service au bar
            </div>
          </div>
        </div>
      </section>

      {/* ── VINS ── */}
      {vins.length > 0 && (
        <section style={{ background: "var(--papier-warm)" }}>
          <div className="wrap">
            <span className="eyebrow">Au verre · 12cl</span>
            <h2 style={{ marginTop: 8 }}>Les <span className="scripted">vins</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginTop: 28 }}>
              {vins.map((cat) => {
                const items = byCat[cat];
                const prix = items[0]?.prix["verre"] ?? "";
                return (
                  <div key={cat} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "24px 26px", border: "1px solid rgba(91,58,30,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--brun-dark)" }}>{cat}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--orange)" }}>{prix}</div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                      {items.map((item) => (
                        <li key={item.id} style={{ fontSize: 14, color: "var(--encre-soft)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--dore)", flexShrink: 0, display: "inline-block" }} />
                          {item.nom}
                          {item.description && item.description !== "Verre 12cl" && (
                            <span style={{ opacity: 0.6, fontSize: 12 }}>· {item.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── APÉRITIFS + SOFTS ── */}
      {(aperitifs.length > 0 || softs.length > 0) && (
        <section>
          <div className="wrap">
            <div className="duo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
              {aperitifs.length > 0 && (
                <div>
                  <span className="eyebrow">Apéritifs</span>
                  <h2 style={{ marginTop: 8 }}>Pour <span className="scripted">l&apos;apéro</span></h2>
                  <div style={{ marginTop: 20 }}>
                    {aperitifs.map((b) => (
                      <PriceRow key={b.id} nom={b.nom} prix={b.prix["verre"] ?? ""} description={b.description} />
                    ))}
                  </div>
                </div>
              )}
              {softs.length > 0 && (
                <div>
                  <span className="eyebrow">Softs &amp; autres</span>
                  <h2 style={{ marginTop: 8 }}>Sans <span className="scripted">alcool</span></h2>
                  <div style={{ marginTop: 20 }}>
                    {softs.map((b) => (
                      <PriceRow key={b.id} nom={b.nom} prix={b.prix["verre"] ?? ""} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── À PARTAGER ── */}
      {aPartager.length > 0 && (
        <section style={{ background: "var(--brun-dark)" }}>
          <div className="wrap">
            <span className="eyebrow" style={{ color: "var(--dore)" }}>Pour grignoter</span>
            <h2 style={{ marginTop: 8, color: "var(--craie)" }}>
              À <span className="scripted" style={{ color: "var(--orange)" }}>partager</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
              {aPartager.map((b) => (
                <div key={b.id} style={{ background: "rgba(245,241,232,0.07)", border: "1px solid rgba(245,241,232,0.12)", borderRadius: "var(--radius-md)", padding: "24px 28px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--craie)" }}>{b.nom}</div>
                  {b.description && (
                    <div style={{ fontSize: 12, color: "rgba(245,241,232,0.5)", marginTop: 4 }}>{b.description}</div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--dore)", marginTop: 14 }}>
                    {b.prix["verre"]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer data={D} />
    </>
  );
}
