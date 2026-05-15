"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE_DATA, SiteData } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export default function TireusePage() {
  const [D, setD] = useState<SiteData>(BASE_DATA);
  useEffect(() => { loadAdminData().then(setD).catch(() => {}); }, []);
  const [activeStyle, setActiveStyle] = useState("all");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const futStyles = ["all", ...Array.from(new Set(D.futsDisponibles.map((f) => f.style)))];
  const filteredFuts = activeStyle === "all" ? D.futsDisponibles : D.futsDisponibles.filter((f) => f.style === activeStyle);

  function handleDevis(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 800);
  }

  return (
    <>
      <Nav active="tireuse" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · Tireuse
          </div>
          <div>
            <span className="eyebrow">Location de tireuse 2 becs</span>
            <h1 style={{ marginTop: 14 }}>
              La pression <span className="scripted">à emporter</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              {D.tireuse.pitch}
            </p>
          </div>
        </div>
      </header>

      {/* Forfaits */}
      <section className="tight">
        <div className="wrap">
          <span className="eyebrow">Les forfaits</span>
          <h2 style={{ marginTop: 14 }}>
            Choisis ton <span className="scripted">format</span>
          </h2>
          <div className="forfaits">
            {D.forfaits.map((f) => (
              <div key={f.id} className={`forfait-card${f.featured ? " featured" : ""}`}>
                {f.featured && <div className="star-badge">★ Le plus demandé</div>}
                <div className="kicker">{f.kicker}</div>
                <h3>{f.nom}</h3>
                <div className="price">
                  {f.base}
                  {f.base !== "sur devis" && <span className="unit">location seule</span>}
                </div>
                <p className="desc">{f.desc}</p>
                <ul>
                  {f.inclus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p style={{ fontSize: 12, opacity: 0.65, marginBottom: 12 }}>
                  {f.addon}
                </p>
                <a href="#devis" className="btn btn-primary">
                  Demander un devis <span className="arrow">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau des fûts */}
      <section style={{ background: "var(--papier-warm)" }}>
        <div className="wrap">
          <span className="eyebrow">Les fûts disponibles</span>
          <h2 style={{ marginTop: 14 }}>
            Ce qu&apos;on a <span className="scripted">en stock</span>
          </h2>
          <p style={{ color: "var(--encre-soft)", marginTop: 12, maxWidth: "56ch" }}>
            Prix indicatifs — ils varient selon l&apos;arrivage. {D.tireuse.retrait}.
            Caution : {D.tireuse.caution}.
          </p>

          <div className="chips" style={{ marginTop: 24 }}>
            {futStyles.map((s) => (
              <button
                key={s}
                className={`chip${activeStyle === s ? " active" : ""}`}
                onClick={() => setActiveStyle(s)}
              >
                {s === "all" ? "Tous les styles" : s}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 28, background: "#fff", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid rgba(91,58,30,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--brun-dark)", color: "var(--craie)" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14 }}>Bière</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14 }}>Style</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14 }}>Brasserie</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14 }}>Volume</th>
                  <th style={{ padding: "14px 20px", textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 14, color: "var(--dore)" }}>Prix</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuts.map((f, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(91,58,30,0.07)",
                      background: i % 2 === 0 ? "#fff" : "var(--papier)",
                    }}
                  >
                    <td style={{ padding: "14px 20px", fontFamily: "var(--font-display)", color: "var(--brun)", fontSize: 17 }}>
                      {f.nom}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--encre-soft)" }}>{f.style}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--encre-soft)" }}>{f.brasserie}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span style={{ background: "var(--brun-dark)", color: "var(--dore)", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                        {f.vol}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontFamily: "var(--font-display)", fontSize: 22, color: "var(--orange)" }}>
                      {f.prix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section>
        <div className="wrap">
          <span className="eyebrow">Comment ça marche</span>
          <h2 style={{ marginTop: 14 }}>
            En <span className="scripted">4 étapes</span> chrono
          </h2>
          <div className="steps">
            {D.etapes.map((e) => (
              <div key={e.num} className="step">
                <div className="num">{e.num}</div>
                <h4>{e.titre}</h4>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de devis */}
      <section id="devis" style={{ background: "var(--brun-dark)", paddingBottom: 88 }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "start" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--dore)" }}>Devis gratuit</span>
              <h2 style={{ marginTop: 14, color: "var(--craie)" }}>
                On te rappelle <span className="scripted" style={{ color: "var(--orange)" }}>dans la journée</span>
              </h2>
              <p style={{ color: "rgba(245,241,232,0.7)", marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
                Complète le formulaire, on te recontacte sous 24h pour confirmer la
                dispo et peaufiner ta sélection de fûts.
              </p>
              <div style={{ marginTop: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--dore)" }}>☎</span>
                  <div>
                    <div style={{ color: "var(--dore)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Téléphone</div>
                    <a href={`tel:${D.contact.tel.replace(/\s/g, "")}`} style={{ color: "var(--craie)", fontSize: 22, fontFamily: "var(--font-display)" }}>
                      {D.contact.tel}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--orange)" }}>✓</div>
                  <h3 style={{ marginTop: 12 }}>Demande envoyée !</h3>
                  <p style={{ color: "var(--encre-soft)", marginTop: 8 }}>On te recontacte sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleDevis}>
                  <div className="form-grid">
                    <div className="field">
                      <label>Prénom</label>
                      <input type="text" required placeholder="Henri" />
                    </div>
                    <div className="field">
                      <label>Nom</label>
                      <input type="text" required placeholder="Dupont" />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" required placeholder="ton@mail.fr" />
                    </div>
                    <div className="field">
                      <label>Téléphone</label>
                      <input type="tel" required placeholder="06 12 34 56 78" />
                    </div>
                    <div className="field">
                      <label>Date de l&apos;événement</label>
                      <input type="date" required />
                    </div>
                    <div className="field">
                      <label>Forfait souhaité</label>
                      <select>
                        <option>Week-end</option>
                        <option>Semaine</option>
                        <option>Événement (+100 pers.)</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Nombre d&apos;invités</label>
                      <input type="number" min="1" placeholder="ex : 50" />
                    </div>
                    <div className="field">
                      <label>Durée</label>
                      <select>
                        <option>Week-end (ven → dim)</option>
                        <option>Une semaine</option>
                        <option>Plus longtemps</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label>Message</label>
                      <textarea placeholder="Des infos utiles : type d'événement, lieu, bières souhaitées..." />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
                    disabled={sending}
                  >
                    {sending ? "Envoi…" : "Envoyer la demande"}
                    {!sending && <span className="arrow">→</span>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
