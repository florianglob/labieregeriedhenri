"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MapEmbedClient from "@/components/MapEmbedClient";
import { BASE_DATA, SiteData } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export default function ContactPage() {
  const [D, setD] = useState<SiteData>(BASE_DATA);
  useEffect(() => { loadAdminData().then(setD).catch(() => {}); }, []);
  const [resSent, setResSent] = useState(false);
  const [privSent, setPrivSent] = useState(false);

  return (
    <>
      <Nav active="contact" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · Contact
          </div>
          <div>
            <span className="eyebrow">Mortagne-sur-Sèvre</span>
            <h1 style={{ marginTop: 14 }}>
              On est <span className="scripted">là</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Infos + carte */}
      <section className="tight">
        <div className="wrap">
          <div className="contact-grid">
            <div className="info-card">
              <div className="info-block">
                <div className="label">Adresse</div>
                <div className="value">{D.contact.adresse.ligne1}</div>
                <div className="sub">{D.contact.adresse.ligne2}</div>
              </div>
              <div className="info-block">
                <div className="label">Téléphone</div>
                <div className="value">
                  <a href={`tel:${D.contact.tel.replace(/\s/g, "")}`}>{D.contact.tel}</a>
                </div>
                <div className="sub">On décroche pendant les services, du mardi au samedi.</div>
              </div>
              <div className="info-block">
                <div className="label">Email</div>
                <div style={{ fontSize: 18, color: "var(--encre)", marginTop: 4 }}>
                  <a href={`mailto:${D.contact.email}`}>{D.contact.email}</a>
                </div>
              </div>
              <div className="info-block">
                <div className="label">Horaires</div>
                {D.horaires.map((h) => (
                  <div key={h.jour} className={`horaire-row${h.closed ? " closed" : ""}`}>
                    <span className="day">{h.jour}</span>
                    <span className="hour">{h.hr}</span>
                  </div>
                ))}
              </div>
              <div className="info-block">
                <div className="label">Réseaux sociaux</div>
                <div className="socials" style={{ marginTop: 8 }}>
                  <a href={D.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ background: "rgba(91,58,30,0.08)", color: "var(--brun)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="map-card">
              <MapEmbedClient
                lat={D.coords?.lat ?? 46.9822}
                lng={D.coords?.lng ?? -0.9401}
                adresse={`${D.contact.adresse.ligne1}, ${D.contact.adresse.ligne2}`}
                nom={D.contact.nom}
                style={{ minHeight: 420 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Réservation */}
      <section id="reserver" style={{ background: "var(--papier-warm)" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "start" }}>
            <div>
              <span className="eyebrow">Réservation</span>
              <h2 style={{ marginTop: 14 }}>
                Retiens <span className="scripted">ta table</span>
              </h2>
              <p style={{ color: "var(--encre-soft)", marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
                On accepte les réservations pour 2 personnes et plus. Pour le midi, on
                prend les réservations jusqu&apos;à la veille au soir. Pour le soir, jusqu&apos;à
                18h le jour même.
              </p>
              <p style={{ color: "var(--encre-soft)", marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
                Tu peux aussi appeler directement au{" "}
                <a href={`tel:${D.contact.tel.replace(/\s/g, "")}`} style={{ color: "var(--orange)", fontWeight: 600 }}>
                  {D.contact.tel}
                </a>
                .
              </p>
            </div>

            <div className="form-card" style={{ marginTop: 0 }}>
              {resSent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--orange)" }}>✓</div>
                  <h3 style={{ marginTop: 12 }}>Réservation reçue !</h3>
                  <p style={{ color: "var(--encre-soft)" }}>On confirme par SMS ou email dans l&apos;heure.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setResSent(true); }}>
                  <div className="form-grid">
                    <div className="field">
                      <label>Prénom</label>
                      <input type="text" required placeholder="Henri" />
                    </div>
                    <div className="field">
                      <label>Téléphone</label>
                      <input type="tel" required placeholder="06 12 34 56 78" />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" placeholder="ton@mail.fr" />
                    </div>
                    <div className="field">
                      <label>Date</label>
                      <input type="date" required />
                    </div>
                    <div className="field">
                      <label>Heure</label>
                      <select>
                        <option>12h00</option>
                        <option>12h30</option>
                        <option>19h00</option>
                        <option>19h30</option>
                        <option>20h00</option>
                        <option>20h30</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Nombre de personnes</label>
                      <select>
                        {[2,3,4,5,6,7,8].map(n => <option key={n}>{n} personnes</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Type de visite</label>
                      <select>
                        <option>Déjeuner (midi)</option>
                        <option>Dîner / soirée</option>
                        <option>Afterwork</option>
                        <option>Occasion spéciale</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label>Demande particulière</label>
                      <textarea placeholder="Allergie, anniversaire, table en terrasse…" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
                  >
                    Réserver ma table <span className="arrow">→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Privatisation */}
      <section id="privatiser" style={{ background: "var(--brun-dark)", borderRadius: 0 }}>
        <div className="wrap">
          <div style={{ background: "var(--brun-dark)", borderRadius: "var(--radius-lg)", padding: "56px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--dore)" }}>Privatisation</span>
                <h2 style={{ marginTop: 14, color: "var(--craie)" }}>
                  Le bar est <span className="scripted" style={{ color: "var(--orange)" }}>à toi</span>
                </h2>
                <p style={{ color: "rgba(245,241,232,0.7)", marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
                  Anniversaire, pot de départ, team building, événement d&apos;entreprise —
                  on privatise la salle et on s&apos;occupe des bières, du menu et de
                  l&apos;ambiance.
                </p>
                <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
                  {[
                    { val: "60", lbl: "places assises" },
                    { val: "90", lbl: "debout" },
                    { val: "3h+", lbl: "formules soirée" },
                  ].map((s) => (
                    <div key={s.lbl}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--dore)" }}>{s.val}</div>
                      <div style={{ fontSize: 13, color: "rgba(245,241,232,0.6)", marginTop: 4 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32 }}>
                  <a href={`mailto:${D.contact.email}?subject=Demande de privatisation`} className="btn btn-primary">
                    Nous écrire <span className="arrow">→</span>
                  </a>
                </div>

                {privSent && (
                  <p style={{ color: "var(--dore)", marginTop: 16, fontSize: 14 }}>
                    ✓ On revient vers toi dans les 24h.
                  </p>
                )}
              </div>

              {D.photos?.privatisation ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={D.photos.privatisation} alt="Privatisation" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "var(--radius-lg)" }} />
              ) : (
                <div className="ph" style={{ aspectRatio: "4/5", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                  <div className="ph-inner">
                    <span className="ph-tag">PHOTO PRIVATISATION</span>
                    <span className="ph-dim">soirée privatisée · 4:5 · 1000×1250</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
