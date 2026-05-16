import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FilteredBeers from "@/components/FilteredBeers";
import MapEmbedClient from "@/components/MapEmbedClient";
import ScrollAnimations from "@/components/ScrollAnimations";
import { BASE_DATA } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 60;

function semaineLabel(): string {
  const now = new Date();
  const day = now.getDay(); // 0=dim, 1=lun, ...
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const monStr = mon.toLocaleDateString("fr-FR", { day: "numeric" });
  const satFull = fmt(sat);
  return `Semaine du ${monStr} au ${satFull}`;
}

function buildStrip(D: typeof BASE_DATA): string[] {
  const items: string[] = [];

  // Bière du moment
  items.push(`BIÈRE DU MOMENT · ${D.biereDuMoment.nom} · ${D.biereDuMoment.prix}`);

  // Menu de la semaine — formule complète
  const complet = D.menuSemaine.formules.find((f) => f.nom.toLowerCase().includes("complet"));
  if (complet) items.push(`LE MIDI · ${complet.nom} à ${complet.prix} · Mar. au Ven. 12h–14h`);

  // Événements à venir (3 max)
  D.evenementsAvenir.slice(0, 3).forEach((e) => {
    items.push(`${e.tag.toUpperCase()} · ${e.titre} · ${e.jour} ${e.mois} à ${e.heure}`);
  });

  // Horaires — premier et dernier jour ouvert
  const ouverts = D.horaires.filter((h) => !h.closed);
  if (ouverts.length > 0) {
    const premier = ouverts[0].jour.slice(0, 3) + ".";
    const dernier = ouverts[ouverts.length - 1].jour.slice(0, 3) + ".";
    items.push(`OUVERT · Du ${premier} au ${dernier} · Midi & soir`);
  }

  // Localisation
  items.push(`OÙ NOUS TROUVER · ${D.contact.adresse.ligne1} · ${D.contact.adresse.ligne2}`);

  return items;
}

export default async function Home() {
  const D = await loadAdminData().catch(() => BASE_DATA);
  const m = D.menuSemaine;
  const e0 = m.entrees[0] ?? { nom: "", prix: "" };
  const p0 = m.plats[0] ?? { nom: "", desc: "", prix: "" };
  const d0 = m.desserts[0] ?? { nom: "", prix: "" };
  const stripItems = buildStrip(D);

  return (
    <>
      <ScrollAnimations />
      <Nav active="accueil" />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="dot" />
              {(() => {
                const open = D.horaires.filter(h => !h.closed);
                const groups: { jours: string[]; hr: string }[] = [];
                for (const h of open) {
                  const last = groups[groups.length - 1];
                  if (last && last.hr === h.hr) last.jours.push(h.jour.slice(0, 3));
                  else groups.push({ jours: [h.jour.slice(0, 3)], hr: h.hr });
                }
                return groups.map(g =>
                  `${g.jours.length > 1 ? `${g.jours[0]}–${g.jours[g.jours.length - 1]}` : g.jours[0]} ${g.hr}`
                ).join(" · ");
              })()}
            </div>
            <h1>
              <span className="line">La Bièregerie</span>
              <span className="line">
                <span className="scripted" style={{ fontSize: 112 }}>d&apos;Henri</span>
              </span>
            </h1>
            <p className="hero-tag">
              Bières, vins &amp; afterworks dans ton quartier. Une{" "}
              <strong>belle sélection</strong> au comptoir, un{" "}
              <strong>menu de la semaine</strong> sur ardoise et la{" "}
              <strong>tireuse 2 becs</strong> à venir chercher chez nous.
            </p>
            <div className="hero-ctas">
              <Link href="/bieres" className="btn btn-primary">
                Voir la carte des bières <span className="arrow">→</span>
              </Link>
              <Link href="/midi" className="btn btn-secondary">
                Voir le menu du midi
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num">Pression<br />Canette<br />Bouteille</div>
                <div className="lbl">Faites votre choix</div>
              </div>
              <div className="hero-stat">
                <div className="num">Brasseries<br />du coin</div>
                <div className="lbl">D&apos;ici et d&apos;ailleurs</div>
              </div>
              <div className="hero-stat">
                <div className="num">Tireuse<br />2 becs</div>
                <div className="lbl">Selon disponibilité</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            {(D.sticker?.visible ?? true) && (
              <div className="hero-sticker" aria-hidden="true">
                <div className="star">★</div>
                {D.sticker?.ligne1 ?? "Afterwork"}
                <span className="small">{D.sticker?.ligne2 ?? "tous les jeudis"}</span>
              </div>
            )}
            {D.photos?.hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={D.photos.hero} alt="La Bièregerie d'Henri" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-lg)" }} />
            ) : (
              <div className="ph" style={{ borderRadius: "var(--radius-lg)", height: "100%" }}>
                <div className="ph-inner">
                  <span className="ph-tag">PHOTO AMBIANCE</span>
                  <span className="ph-dim">salle au comptoir · 4:5 · 1200×1500</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="strip">
        <div className="strip-inner">
          {/* Doublé pour le défilement continu */}
          {[0, 1].map((pass) => (
            <span key={pass} aria-hidden={pass === 1}>
              {stripItems.map((item, i) => (
                <span key={i}><strong>{item}</strong> <span className="dot" /></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== BIÈRE DU MOMENT ===== */}
      <section className="tight mob-hide">
        <div className="wrap">
          <div className="feature-bar" data-anim>
            <div className="fb-bottle">capsule</div>
            <div>
              <span className="fb-tag">★ {D.biereDuMoment.tag}</span>
              <h3>{D.biereDuMoment.nom}</h3>
              <p className="fb-desc">
                {D.biereDuMoment.style} · {D.biereDuMoment.brasserie}.{" "}
                {D.biereDuMoment.descriptif}
              </p>
              <span className="fb-label">— le choix d&apos;Henri</span>
            </div>
            <div className="fb-meta">
              <span className="fb-price">{D.biereDuMoment.prix}</span>
              <span className="fb-unit">{D.biereDuMoment.unite}</span>
            </div>
            <Link
              href="/bieres"
              className="btn btn-secondary"
              style={{ background: "var(--brun-dark)", color: "var(--dore)", borderColor: "var(--brun-dark)" }}
            >
              Voir toutes nos bières <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SÉLECTION ===== */}
      <section id="selection" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">Notre sélection</span>
              <h2 style={{ marginTop: 14 }}>
                Tu viens boire{" "}
                <span className="scripted" style={{ fontSize: 52 }}>quoi</span>{" "}
                ce soir&nbsp;?
              </h2>
              <p className="lead">
                Une bonne moitié de brasseries du coin, le reste pioché chez les copains
                belges, anglais et allemands. Pas de prise de tête : si tu hésites, on te
                fait goûter.
              </p>
            </div>
            <Link href="/bieres" className="btn btn-ghost">
              Voir toute la carte <span className="arrow">→</span>
            </Link>
          </div>
          <FilteredBeers beers={D.bieres} data={D} homeMode />
        </div>
      </section>

      {/* ===== CETTE SEMAINE ===== */}
      <section style={{ background: "var(--papier-warm)" }}>
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">Cette semaine</span>
              <h2 style={{ marginTop: 14 }}>
                Ce qui se{" "}
                <span className="scripted" style={{ fontSize: 48 }}>trame</span>{" "}
                au comptoir
              </h2>
            </div>
            <Link href="/evenements" className="btn btn-ghost">
              Tout l&apos;agenda <span className="arrow">→</span>
            </Link>
          </div>
          <div className="events-grid">
            {D.evenementsAvenir.slice(0, 3).map((e, i) => (
              <Link key={e.id} className="event-card" href={`/evenements#ev-${e.id}`}>
                <div className="img" data-anim="fade" style={{ transitionDelay: `${i * 100}ms` }}>
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
                        <span className="ph-dim">800×800 · {e.tag.toLowerCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="body">
                  <h4>{e.titre}</h4>
                  <div className="meta-line">
                    <span>● {e.heure}</span>
                    <span>{e.desc}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MIDI + TIREUSE ===== */}
      <section id="midi-tireuse">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow mob-hide">Le midi · La tireuse</span>
              <span className="eyebrow desk-hide">Le menu du midi</span>
              <h2 style={{ marginTop: 14 }}>
                <span className="mob-hide">Deux bonnes raisons{" "}
                <span className="scripted" style={{ fontSize: 58 }}>de revenir</span></span>
                <span className="desk-hide">Ce midi,{" "}
                <span className="scripted" style={{ fontSize: 58 }}>qu&apos;est-ce qu&apos;on mange ?</span></span>
              </h2>
            </div>
          </div>

          <div className="split" data-anim>
            {/* Ardoise du midi */}
            <div className="chalkboard">
              <div className="chalk-title">{semaineLabel()}</div>
              <div className="chalk-sub">— servi de 12h à 14h · du mardi au vendredi —</div>

              <div className="chalk-divider" />
              {m.formules.map((f) => (
                <div key={f.nom} className="chalk-row">
                  <span className="name">{f.nom}</span>
                  <span className="dots" />
                  <span className="price">{f.prix}</span>
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: 18 }}>
                <Link href="/midi" className="btn btn-primary btn-sm">
                  Le menu en entier <span className="arrow">→</span>
                </Link>
              </div>
            </div>

            {/* Forfaits tireuse */}
            <div className="formules mob-hide">
              <span className="tag-line">Tireuse 2 becs · à retirer chez nous</span>
              <h3>La pression à emporter</h3>
              <p style={{ color: "var(--encre-soft)", margin: "12px 0 4px" }}>
                Anniversaire, mariage, pot de départ — choisis ton forfait et tes fûts,
                tu viens récupérer le matos.
              </p>

              {D.forfaits.map((f) => (
                <div key={f.id} className={`formule-item${f.featured ? " featured" : ""}`}>
                  <div
                    className="icon"
                    style={f.featured ? { background: "var(--dore)", color: "var(--brun-dark)" } : {}}
                  >
                    {f.featured ? "★" : f.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="name">
                      {f.nom}
                      {f.featured && <span className="badge-pop">Le + demandé</span>}
                    </div>
                    <div className="desc">{f.kicker} · {f.addon.toLowerCase()}</div>
                  </div>
                  <div className="price">{f.base.replace("à partir de ", "dès ")}</div>
                </div>
              ))}

              <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/tireuse" className="btn btn-primary">
                  Voir les forfaits <span className="arrow">→</span>
                </Link>
                <Link href="/tireuse#devis" className="btn btn-secondary">
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" style={{ background: "var(--papier-warm)", paddingBottom: 120 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">Passe nous voir</span>
              <h2 style={{ marginTop: 14 }}>
                On t&apos;attend{" "}
                <span className="scripted" style={{ fontSize: 58 }}>au comptoir</span>
              </h2>
            </div>
          </div>

          <div className="contact-grid" data-anim>
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
                <div className="label">Horaires</div>
                {D.horaires.map((h) => (
                  <div key={h.jour} className={`horaire-row${h.closed ? " closed" : ""}`}>
                    <span className="day">{h.jour}</span>
                    <span className="hour">{h.hr}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/contact#reserver" className="btn btn-primary btn-sm">
                  Réserver <span className="arrow">→</span>
                </Link>
                <Link href="/contact#privatiser" className="btn btn-secondary btn-sm">
                  Privatiser
                </Link>
              </div>
            </div>

            <div className="map-card">
              <MapEmbedClient
                lat={D.coords?.lat ?? 46.9822}
                lng={D.coords?.lng ?? -0.9401}
                adresse={`${D.contact.adresse.ligne1}, ${D.contact.adresse.ligne2}`}
                nom={D.contact.nom}
                style={{ minHeight: 320 }}
              />

            </div>
          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
