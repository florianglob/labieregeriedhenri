import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE_DATA } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu du midi · La Bièregerie d'Henri",
  description: "Menu de la semaine sur ardoise — entrées, plats et desserts. Servi de 12h à 14h du mardi au vendredi.",
};

export default async function MidiPage() {
  const D = await loadAdminData().catch(() => BASE_DATA);
  const m = D.menuSemaine;

  return (
    <>
      <Nav active="midi" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · Le midi
          </div>
          <div>
            <span className="eyebrow">Servi de 12h à 14h · Mar → Ven</span>
            <h1 style={{ marginTop: 14 }}>
              Le menu <span className="scripted">de la semaine</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Une ardoise courte, des produits frais. Ça change chaque semaine.
            </p>
          </div>
        </div>
      </header>

      {/* Ardoise principale */}
      <section className="tight">
        <div className="wrap">
          <div
            className="chalkboard chalk-full"
          >
            <div className="chalk-title">{m.semaine}</div>
            <div className="chalk-sub">— mardi au vendredi · 12h–14h —</div>

            <div className="chalk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
              {/* Colonne gauche */}
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,232,0.6)", marginBottom: 12 }}>
                  Entrées
                </div>
                {m.entrees.map((e) => (
                  <div key={e.nom} className="chalk-row">
                    <span className="name">{e.nom}</span>
                    <span className="dots" />
                    <span className="price">{e.prix}</span>
                  </div>
                ))}

                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,232,0.6)", margin: "24px 0 12px" }}>
                  Plats
                </div>
                {m.plats.map((p) => (
                  <div key={p.nom}>
                    <div className="chalk-row">
                      <span className="name">
                        {p.nom}
                        {p.desc && <span className="small">{p.desc}</span>}
                      </span>
                      <span className="dots" />
                      <span className="price">{p.prix}</span>
                    </div>
                  </div>
                ))}

              </div>

              {/* Colonne droite */}
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,232,0.6)", marginBottom: 12 }}>
                  Desserts au choix
                </div>
                {m.desserts.map((d) => (
                  <div key={d.nom} className="chalk-row">
                    <span className="name">{d.nom}</span>
                    <span className="dots" />
                    <span className="price">{d.prix}</span>
                  </div>
                ))}

                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,232,0.6)", margin: "24px 0 12px" }}>
                  Dessert du jour
                </div>
                <div className="chalk-row" style={{ fontWeight: 700 }}>
                  <span className="name">{m.dessertDuJour.nom}</span>
                  <span className="dots" />
                  <span className="price">{m.dessertDuJour.prix}</span>
                </div>

                <div className="chalk-divider" style={{ margin: "28px 0" }} />
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,232,0.6)", marginBottom: 12 }}>
                  Formules
                </div>
                {m.formules.map((f) => (
                  <div key={f.nom} className="chalk-row">
                    <span className="name">{f.nom}</span>
                    <span className="dots" />
                    <span className="price">{f.prix}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
