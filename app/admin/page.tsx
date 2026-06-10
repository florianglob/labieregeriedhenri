"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BASE_DATA,
  SiteData,
  Beer,
  Boisson,
  Evenement,
  Forfait,
  Fut,
} from "@/lib/data";
import {
  supabase,
  loadAdminData,
  saveBeers,
  saveEvenements,
  saveMenu,
  saveHoraires,
  saveForfaits,
  saveFuts,
  saveBoissons,
  saveSiteConfig,
} from "@/lib/supabase";

// ---- Constantes partagées ----

const BEER_STYLES: { id: Beer["style"]; label: string }[] = [
  { id: "blonde",  label: "Blonde" },
  { id: "ambree",  label: "Ambrée" },
  { id: "ipa",     label: "IPA" },
  { id: "brune",   label: "Brune" },
  { id: "blanche", label: "Blanche" },
  { id: "sour",    label: "Sour" },
  { id: "sans",    label: "Sans alcool" },
];

const ORIGINES_OPTIONS = [
  "Pays de la Loire", "Bretagne", "Normandie", "Alsace", "Bourgogne",
  "France", "Belgique", "Allemagne", "Royaume-Uni", "USA",
  "République Tchèque", "Italie", "Espagne", "Autre",
];

const FUT_STYLES = [
  "Blonde", "Ambrée", "IPA", "NEIPA", "Brune", "Stout",
  "Blanche", "Weizen", "Pilsner", "Sour", "Trappiste", "Sans alcool", "Autre",
];

const PRIX_PAR_FORMAT: Record<Beer["format"], string[]> = {
  pression:  ["25cl", "33cl", "50cl", "pichet"],
  canette:   ["25cl", "33cl", "50cl"],
  bouteille: ["33cl", "75cl"],
};

type Section =
  | "dashboard"
  | "bieres"
  | "menu"
  | "evenements"
  | "forfaits"
  | "futs"
  | "boissons"
  | "horaires"
  | "contact"
  | "photos";

const CONFIG_KEYS: (keyof SiteData)[] = [
  "contact", "biereDuMoment", "biereDuMomentId", "tireuse", "etapes", "styles", "origines", "detailsParStyle", "photos", "sticker", "coords",
];

export default function AdminPage() {
  const [section, setSection] = useState<Section>("dashboard");
  const [data, setData] = useState<SiteData>(BASE_DATA);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    loadAdminData(true)
      .then(setData)
      .catch(() => setData(BASE_DATA))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(
    async (patch: Partial<SiteData>) => {
      const next = { ...data, ...patch };
      setData(next);
      setError(null);
      try {
        if ("bieres" in patch) {
          const freshBeers = await saveBeers(patch.bieres!);
          fetch("/api/revalidate", { method: "POST" });
          setData((prev) => ({ ...prev, bieres: freshBeers }));
        }
        if ("evenementsAvenir" in patch) await saveEvenements(patch.evenementsAvenir!);
        if ("menuSemaine" in patch) await saveMenu(patch.menuSemaine!);
        if ("horaires" in patch) await saveHoraires(patch.horaires!);
        if ("forfaits" in patch) await saveForfaits(patch.forfaits!);
        if ("futsDisponibles" in patch) await saveFuts(patch.futsDisponibles!);
        if ("boissons" in patch) await saveBoissons(patch.boissons!);

        const configPatch: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(patch)) {
          if (CONFIG_KEYS.includes(k as keyof SiteData)) configPatch[k] = v;
        }
        if (Object.keys(configPatch).length > 0) await saveSiteConfig(configPatch);

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        console.error(err);
        const msg = (err as { message?: string })?.message ?? "Erreur de connexion";
        setError(`Erreur : ${msg}`);
      }
    },
    [data]
  );

  const navItems: { id: Section; label: string }[] = [
    { id: "dashboard",     label: "Tableau de bord" },
    { id: "bieres",        label: "Bières" },
    { id: "boissons",      label: "Boissons & vins" },
    { id: "menu",          label: "Menu du midi" },
    { id: "evenements",    label: "Événements" },
    { id: "forfaits",      label: "Forfaits tireuse" },
    { id: "futs",          label: "Fûts disponibles" },
    { id: "horaires",      label: "Horaires" },
    { id: "contact",       label: "Contact" },
    { id: "photos",        label: "Photos du site" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--papier)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--brun-dark)" }}>Chargement…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--papier)" }}>
      {/* ── Sidebar desktop ── */}
      <aside style={{
        width: 220, background: "var(--brun-dark)", color: "var(--craie)",
        position: "fixed", top: 0, left: 0, bottom: 0,
        display: "flex", flexDirection: "column", zIndex: 10,
      }} className="admin-sidebar-desk">
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(245,241,232,0.1)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--dore)" }}>La Bièregerie</div>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 22, color: "var(--orange)" }}>d&apos;Henri</div>
          <div style={{ fontSize: 11, color: "rgba(245,241,232,0.5)", marginTop: 4, letterSpacing: "0.1em" }}>BACK-OFFICE</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "11px 20px", border: "none", cursor: "pointer",
              background: section === item.id ? "rgba(217,122,58,0.15)" : "transparent",
              color: section === item.id ? "var(--orange)" : "rgba(245,241,232,0.75)",
              fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
              borderLeft: section === item.id ? "3px solid var(--orange)" : "3px solid transparent",
              transition: "all .15s",
            }}>{item.label}</button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(245,241,232,0.1)" }}>
          <Link href="/" style={{ color: "var(--dore)", opacity: 0.8, fontSize: 13 }}>← Voir le site</Link>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => supabase.auth.signOut()} style={{
              border: "1px solid rgba(245,241,232,0.2)", background: "transparent",
              color: "rgba(245,241,232,0.55)", padding: "7px 14px", borderRadius: 6,
              fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer", width: "100%",
            }}>Se déconnecter</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main" style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>

        {/* Topbar desktop */}
        <div className="admin-topbar-desk" style={{
          position: "sticky", top: 0, zIndex: 9,
          background: "rgba(251,248,241,0.95)", backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(91,58,30,0.08)",
          padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--brun)", margin: 0 }}>
            {navItems.find((n) => n.id === section)?.label}
          </h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {saved && <span style={{ color: "#2BB673", fontSize: 13, fontWeight: 600 }}>✓ Sauvegardé</span>}
            {error && <span style={{ color: "#C25A3F", fontSize: 13 }}>{error}</span>}
            <button className="btn btn-secondary btn-sm" onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `bieregerie-${new Date().toISOString().slice(0, 10)}.json`; a.click();
            }}>Exporter JSON</button>
          </div>
        </div>

        {/* ── App bar mobile ── */}
        <div className="admin-appbar-mob">
          <div className="admin-appbar-top">
            <span className="admin-appbar-title">{navItems.find((n) => n.id === section)?.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {saved && <span style={{ color: "#2BB673", fontSize: 13, fontWeight: 600 }}>✓</span>}
              {error && <span style={{ color: "#C25A3F", fontSize: 12 }}>!</span>}
              <Link href="/" className="admin-appbar-link">Site</Link>
              <button className="admin-nav-burger" aria-label="Menu" onClick={() => setNavOpen(true)}>
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>

        {/* ── Nav drawer mobile ── */}
        {navOpen && (
          <div className="admin-nav-overlay" onClick={() => setNavOpen(false)}>
            <div className="admin-nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="admin-nav-drawer-head">
                <span className="admin-nav-drawer-title">Navigation</span>
                <button className="admin-nav-drawer-close" onClick={() => setNavOpen(false)}>✕</button>
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`admin-nav-item${section === item.id ? " active" : ""}`}
                  onClick={() => { setSection(item.id); setNavOpen(false); }}
                >
                  {item.label}
                </button>
              ))}
              <div style={{ marginTop: "auto", padding: "20px 24px 8px", borderTop: "1px solid rgba(245,241,232,0.08)" }}>
                <button onClick={() => { supabase.auth.signOut(); }} style={{ border: "1px solid rgba(245,241,232,0.2)", background: "transparent", color: "rgba(245,241,232,0.5)", padding: "10px 16px", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13, cursor: "pointer", width: "100%" }}>Se déconnecter</button>
              </div>
            </div>
          </div>
        )}

        <div className="admin-content" style={{ padding: 36 }}>
          {/* Dashboard */}
          {section === "dashboard" && (
            <div>
              <div className="admin-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
                {[
                  { label: "Bières en carte",      val: data.bieres.length },
                  { label: "Événements à venir",   val: data.evenementsAvenir.length },
                  { label: "Fûts disponibles",     val: data.futsDisponibles.length },
                  { label: "Boissons & vins",      val: data.boissons.length },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#fff", border: "1px solid rgba(91,58,30,0.08)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ fontSize: 13, color: "var(--encre-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--brun)", lineHeight: 1, marginTop: 8 }}>{s.val}</div>
                  </div>
                ))}
              </div>

<div className="admin-quick-nav" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {navItems.slice(1).map((item) => (
                  <button key={item.id} onClick={() => setSection(item.id)} className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                    {item.label} <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === "bieres" && (
            <BieresEditor
              beers={data.bieres}
              momentId={data.biereDuMomentId}
              onSave={(bieres) => persist({ bieres })}
              onSetMoment={(id) => persist({ biereDuMomentId: id })}
            />
          )}

          {section === "boissons" && (
            <BoissonEditor boissons={data.boissons} onSave={(boissons) => persist({ boissons })} />
          )}


          {section === "menu" && (
            <MenuEditor menu={data.menuSemaine} onSave={(m) => persist({ menuSemaine: m })} />
          )}

          {section === "evenements" && (
            <EvenementsEditor evs={data.evenementsAvenir} onSave={(e) => persist({ evenementsAvenir: e })} />
          )}

          {section === "forfaits" && (
            <ForfaitsEditor forfaits={data.forfaits} onSave={(f) => persist({ forfaits: f })} />
          )}

          {section === "futs" && (
            <FutsEditor futs={data.futsDisponibles} onSave={(f) => persist({ futsDisponibles: f })} />
          )}

          {section === "horaires" && (
            <HorairesEditor horaires={data.horaires} onSave={(h) => persist({ horaires: h })} />
          )}

          {section === "contact" && (
            <SimpleFormEditor
              title="Contact"
              fields={[
                { key: "nom",       label: "Nom de l'établissement" },
                { key: "tagline",   label: "Tagline" },
                { key: "tel",       label: "Téléphone" },
                { key: "email",     label: "Email" },
                { key: "instagram", label: "Instagram (URL complète)" },
              ]}
              values={{
                nom:       data.contact.nom,
                tagline:   data.contact.tagline,
                tel:       data.contact.tel,
                email:     data.contact.email,
                instagram: data.contact.instagram,
              }}
              onSave={(v) => persist({ contact: { ...data.contact, ...v } })}
            />
          )}

          {section === "photos" && (
            <div style={{ maxWidth: 600 }}>
              <h2 style={{ marginBottom: 32 }}>Photos du site</h2>

              {/* Pastille hero */}
              <div style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(91,58,30,0.1)" }}>
                <h4 style={{ marginBottom: 4 }}>Pastille sur la photo d&apos;accueil</h4>
                <p style={{ color: "var(--encre-soft)", fontSize: 14, marginBottom: 16 }}>
                  Petit badge circulaire affiché sur la photo hero.
                </p>
                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={data.sticker?.visible ?? true}
                    onChange={(e) => persist({ sticker: { ligne1: data.sticker?.ligne1 ?? "Afterwork", ligne2: data.sticker?.ligne2 ?? "tous les jeudis", visible: e.target.checked } })}
                  />
                  <span style={{ fontSize: 15 }}>Afficher la pastille</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: (data.sticker?.visible ?? true) ? 1 : 0.4, pointerEvents: (data.sticker?.visible ?? true) ? "auto" : "none" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "var(--encre-soft)", marginBottom: 4 }}>Ligne 1 (grande)</label>
                    <input
                      type="text"
                      value={data.sticker?.ligne1 ?? "Afterwork"}
                      onChange={(e) => persist({ sticker: { visible: data.sticker?.visible ?? true, ligne2: data.sticker?.ligne2 ?? "tous les jeudis", ligne1: e.target.value } })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(91,58,30,0.2)", fontFamily: "var(--font-body)", fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "var(--encre-soft)", marginBottom: 4 }}>Ligne 2 (petite)</label>
                    <input
                      type="text"
                      value={data.sticker?.ligne2 ?? "tous les jeudis"}
                      onChange={(e) => persist({ sticker: { visible: data.sticker?.visible ?? true, ligne1: data.sticker?.ligne1 ?? "Afterwork", ligne2: e.target.value } })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(91,58,30,0.2)", fontFamily: "var(--font-body)", fontSize: 14 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 40 }}>
                <h4 style={{ marginBottom: 8 }}>Photo Hero (page d&apos;accueil)</h4>
                <p style={{ color: "var(--encre-soft)", fontSize: 14, marginBottom: 16 }}>
                  Photo principale affichée sur la page d&apos;accueil. Format recommandé : 4:5, 1200×1500px.
                </p>
                <ImageUpload
                  value={data.photos?.hero}
                  folder="site"
                  onChange={(url) => persist({ photos: { ...data.photos, hero: url } })}
                />
                {data.photos?.hero && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 10, color: "#C25A3F", borderColor: "#C25A3F" }}
                    onClick={() => persist({ photos: { ...data.photos, hero: undefined } })}
                  >
                    Supprimer
                  </button>
                )}
              </div>

              <div>
                <h4 style={{ marginBottom: 8 }}>Photo Privatisation (page contact)</h4>
                <p style={{ color: "var(--encre-soft)", fontSize: 14, marginBottom: 16 }}>
                  Photo illustrant l&apos;espace privatisé. Format recommandé : 4:5, 1000×1250px.
                </p>
                <ImageUpload
                  value={data.photos?.privatisation}
                  folder="site"
                  onChange={(url) => persist({ photos: { ...data.photos, privatisation: url } })}
                />
                {data.photos?.privatisation && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 10, color: "#C25A3F", borderColor: "#C25A3F" }}
                    onClick={() => persist({ photos: { ...data.photos, privatisation: undefined } })}
                  >
                    Supprimer
                  </button>
                )}
              </div>

              {/* Coordonnées GPS */}
              <div style={{ marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(91,58,30,0.1)" }}>
                <h4 style={{ marginBottom: 4 }}>Position sur la carte</h4>
                <p style={{ color: "var(--encre-soft)", fontSize: 14, marginBottom: 16 }}>
                  Coordonnées GPS du marqueur sur la carte interactive (home &amp; contact).
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "var(--encre-soft)", marginBottom: 4 }}>Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={data.coords?.lat ?? 46.9822}
                      onChange={(e) => persist({ coords: { lat: parseFloat(e.target.value), lng: data.coords?.lng ?? -0.9401 } })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(91,58,30,0.2)", fontFamily: "var(--font-body)", fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "var(--encre-soft)", marginBottom: 4 }}>Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={data.coords?.lng ?? -0.9401}
                      onChange={(e) => persist({ coords: { lat: data.coords?.lat ?? 46.9822, lng: parseFloat(e.target.value) } })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(91,58,30,0.2)", fontFamily: "var(--font-body)", fontSize: 14 }}
                    />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--encre-soft)", marginTop: 10 }}>
                  Astuce : cherche l&apos;adresse sur <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: "var(--orange)" }}>openstreetmap.org</a>, clique droit → &quot;Afficher l&apos;adresse&quot; pour obtenir les coordonnées exactes.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---- Upload image ---- */

function ImageUpload({ value, onChange, folder = "general" }: { value?: string; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(""); setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: true });
    if (error) { console.error("Upload error:", error); setErr(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, border: "1.5px solid rgba(91,58,30,0.12)" }} />
      ) : (
        <div style={{ width: 72, height: 72, borderRadius: 10, background: "var(--papier-warm)", border: "1.5px dashed rgba(91,58,30,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "rgba(91,58,30,0.3)" }}>
          ＋
        </div>
      )}
      <div>
        <label style={{ display: "inline-block", padding: "8px 16px", background: "var(--papier-warm)", border: "1.5px solid rgba(91,58,30,0.2)", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--brun)" }}>
          {uploading ? "Upload…" : value ? "Changer la photo" : "Choisir une photo"}
          <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading} onChange={handleFile} />
        </label>
        {value && (
          <button onClick={() => onChange("")} style={{ marginLeft: 8, border: "none", background: "none", color: "#C25A3F", cursor: "pointer", fontSize: 13 }}>
            Supprimer
          </button>
        )}
        {err && <div style={{ color: "#C25A3F", fontSize: 12, marginTop: 4 }}>{err}</div>}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function SimpleFormEditor({
  title: _title, fields, values, onSave,
}: {
  title: string;
  fields: { key: string; label: string }[];
  values: Record<string, string>;
  onSave: (v: Record<string, string>) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(values);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {fields.map((f) => (
          <div key={f.key} className="field">
            <label>{f.label}</label>
            <input value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>
        Sauvegarder <span className="arrow">→</span>
      </button>
    </form>
  );
}

function HorairesEditor({ horaires, onSave }: { horaires: SiteData["horaires"]; onSave: (h: SiteData["horaires"]) => void }) {
  const [list, setList] = useState(horaires);
  return (
    <div style={{ maxWidth: 560 }}>
      {list.map((h, i) => (
        <div key={h.jour} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px dashed rgba(91,58,30,0.15)" }}>
          <span style={{ fontFamily: "var(--font-display)", color: "var(--brun)", minWidth: 100 }}>{h.jour}</span>
          <input
            style={{ flex: 1, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
            value={h.hr}
            onChange={(e) => {
              const next = [...list];
              next[i] = { ...h, hr: e.target.value, closed: e.target.value.toLowerCase() === "fermé" };
              setList(next);
            }}
          />
        </div>
      ))}
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => onSave(list)}>
        Sauvegarder <span className="arrow">→</span>
      </button>
    </div>
  );
}

function BieresEditor({ beers, momentId, onSave, onSetMoment }: {
  beers: Beer[];
  momentId?: number;
  onSave: (b: Beer[]) => void;
  onSetMoment: (id: number | undefined) => void;
}) {
  const [list, setList] = useState<Beer[]>(beers);
  const [editing, setEditing] = useState<Beer | null>(null);
  const [isNew, setIsNew] = useState(false);

  function newBeer(): Beer {
    return { id: Date.now(), nom: "", brasserie: "", style: "blonde", styleLabel: "Blonde", origine: "France", deg: "5,0°", format: "pression", coup: false, actif: true, note: "", prix: { "25cl": "", "50cl": "" } };
  }

  function update(updated: Beer) {
    const next = isNew ? [...list, updated] : list.map((b) => (b.id === updated.id ? updated : b));
    setList(next); onSave(next); setEditing(null); setIsNew(false);
  }
  function remove(id: number) {
    if (!confirm("Supprimer cette bière ?")) return;
    const next = list.filter((b) => b.id !== id);
    setList(next); onSave(next);
  }

  function toggleActif(id: number) {
    const next = list.map((b) => b.id === id ? { ...b, actif: !(b.actif ?? true) } : b);
    setList(next); onSave(next);
  }

  return (
    <div>
      <button className="btn btn-primary btn-sm" style={{ marginBottom: 20 }} onClick={() => { setIsNew(true); setEditing(newBeer()); }}>
        + Ajouter une bière
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((b) => {
          const actif = b.actif ?? true;
          return (
          <div key={b.id} className="a-item" style={{ opacity: actif ? 1 : 0.5 }}>
            <div className="a-item-head">
              <div>
                <span className="a-item-name">{b.nom}</span>
                <span className="a-item-meta">{b.brasserie} · {b.styleLabel} · {b.deg}</span>
              </div>
              <div className="a-item-right">
                {!actif && <span className="a-badge" style={{ background: "rgba(91,58,30,0.12)", color: "var(--encre-soft)" }}>masquée</span>}
                <span className="a-badge">{b.format}</span>
                <span className="a-item-price">{Object.values(b.prix)[0]}</span>
                <button
                  className="a-icon-btn"
                  title={b.id === momentId ? "Bière du moment (cliquer pour retirer)" : "Définir comme bière du moment"}
                  onClick={() => onSetMoment(b.id === momentId ? undefined : b.id)}
                  style={{ color: b.id === momentId ? "var(--dore)" : undefined, fontSize: 16 }}
                >★</button>
                <button
                  className="a-icon-btn"
                  title={actif ? "Masquer (rupture de stock)" : "Remettre en carte"}
                  onClick={() => toggleActif(b.id)}
                  style={{ fontSize: 15, color: actif ? "var(--encre-soft)" : "var(--orange)" }}
                >{actif ? "👁" : "🚫"}</button>
                <button className="a-icon-btn" onClick={() => setEditing(b)} title="Modifier">✎</button>
                <button className="a-icon-btn danger" onClick={() => remove(b.id)} title="Supprimer">✕</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {b.id === momentId && <span className="a-badge orange" style={{ alignSelf: "flex-start" }}>★ Bière du moment</span>}
              {b.coup && <span className="a-badge orange" style={{ alignSelf: "flex-start" }}>❤ Coup de cœur</span>}
            </div>
          </div>
          );
        })}
      </div>
      {editing && <BeerEditModal beer={editing} isNew={isNew} onSave={update} onClose={() => { setEditing(null); setIsNew(false); }} />}
    </div>
  );
}

function BeerEditModal({ beer, isNew, onSave, onClose }: { beer: Beer; isNew?: boolean; onSave: (b: Beer) => void; onClose: () => void }) {
  const [form, setForm] = useState<Beer>({ ...beer });

  function setStyle(id: Beer["style"]) {
    const defaultLabel = BEER_STYLES.find((s) => s.id === id)?.label ?? id;
    setForm((f) => ({ ...f, style: id, styleLabel: defaultLabel }));
  }

  function setFormat(fmt: Beer["format"]) {
    // Garde les prix existants compatibles avec le nouveau format, vide les autres
    const tiers = PRIX_PAR_FORMAT[fmt];
    const newPrix: Record<string, string> = {};
    tiers.forEach((t) => { if (form.prix[t]) newPrix[t] = form.prix[t]; });
    setForm((f) => ({ ...f, format: fmt, prix: newPrix }));
  }

  const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 };

  return (
    <div className="a-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="a-modal-box" style={{ background: "#fff", borderRadius: 22, maxWidth: 640, width: "100%", maxHeight: "90vh", overflow: "auto", padding: 36 }}>
        <h3 style={{ marginBottom: 24 }}>{isNew ? "Nouvelle bière" : `Modifier — ${beer.nom}`}</h3>

        <div className="a-modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field">
            <label>Nom</label>
            <input style={inputStyle} value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} placeholder="La Houblonnée" />
          </div>
          <div className="field">
            <label>Brasserie</label>
            <input style={inputStyle} value={form.brasserie} onChange={(e) => setForm((f) => ({ ...f, brasserie: e.target.value }))} placeholder="Brasserie de la Croix" />
          </div>

          <div className="field">
            <label>Style</label>
            <select style={inputStyle} value={form.style} onChange={(e) => setStyle(e.target.value as Beer["style"])}>
              {BEER_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Label affiché <span style={{ fontWeight: 400, color: "var(--encre-soft)" }}>(ex : NEIPA, Trappiste…)</span></label>
            <input style={inputStyle} value={form.styleLabel} onChange={(e) => setForm((f) => ({ ...f, styleLabel: e.target.value }))} />
          </div>

          <div className="field">
            <label>Origine</label>
            <select style={inputStyle} value={ORIGINES_OPTIONS.includes(form.origine) ? form.origine : "Autre"} onChange={(e) => setForm((f) => ({ ...f, origine: e.target.value }))}>
              {ORIGINES_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Degré d&apos;alcool</label>
            <input style={inputStyle} value={form.deg} onChange={(e) => setForm((f) => ({ ...f, deg: e.target.value }))} placeholder="5,2°" />
          </div>

          <div className="field">
            <label>Format de service</label>
            <select style={inputStyle} value={form.format} onChange={(e) => setFormat(e.target.value as Beer["format"])}>
              <option value="pression">Pression</option>
              <option value="canette">Canette</option>
              <option value="bouteille">Bouteille</option>
            </select>
          </div>
          <div className="field" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 26 }}>
            <input type="checkbox" checked={!!form.coup} onChange={(e) => setForm((f) => ({ ...f, coup: e.target.checked }))} id="coup" style={{ width: 18, height: 18, accentColor: "var(--orange)" }} />
            <label htmlFor="coup" style={{ textTransform: "none", letterSpacing: 0, fontSize: 15, margin: 0, cursor: "pointer" }}>Coup de cœur d&apos;Henri ❤</label>
          </div>

          <div className="field" style={{ gridColumn: "1/-1" }}>
            <label>Note de dégustation</label>
            <input style={inputStyle} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Agrumes, résine, finale sèche…" />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--brun)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Photo</label>
            <ImageUpload value={form.photo} onChange={(url) => setForm((f) => ({ ...f, photo: url }))} folder="bieres" />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--brun)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Prix
            </label>
            <div style={{ display: "flex", gap: 20 }}>
              {PRIX_PAR_FORMAT[form.format].map((vol) => (
                <div key={vol} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--encre-soft)", textTransform: "uppercase" }}>{vol}</span>
                  <input
                    style={{ width: 110, padding: "9px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
                    value={form.prix[vol] ?? ""}
                    placeholder="3,90 €"
                    onChange={(e) => {
                      const p = { ...form.prix };
                      if (e.target.value) p[vol] = e.target.value; else delete p[vol];
                      setForm((f) => ({ ...f, prix: p }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Sauvegarder <span className="arrow">→</span></button>
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

function EvenementsEditor({ evs, onSave }: { evs: Evenement[]; onSave: (e: Evenement[]) => void }) {
  const [list, setList] = useState(evs);
  const [editing, setEditing] = useState<Evenement | null>(null);
  const [isNew, setIsNew] = useState(false);

  function newEv(): Evenement {
    const today = new Date().toISOString().slice(0, 10);
    const d = new Date(today + "T00:00:00");
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      id: Date.now(),
      jour: d.getDate(),
      mois: cap(d.toLocaleDateString("fr-FR", { month: "long" })),
      moisFull: cap(d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })),
      titre: "", tag: "Soirée", heure: "20h", desc: "", dateStr: today,
    };
  }

  function updateDate(dateStr: string): Partial<Evenement> {
    const d = new Date(dateStr + "T00:00:00");
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      dateStr,
      jour: d.getDate(),
      mois: cap(d.toLocaleDateString("fr-FR", { month: "long" })),
      moisFull: cap(d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })),
    };
  }

  function save(ev: Evenement) {
    const next = isNew ? [...list, ev] : list.map((e) => (e.id === ev.id ? ev : e));
    setList(next); onSave(next); setEditing(null); setIsNew(false);
  }
  function remove(id: number) {
    if (!confirm("Supprimer cet événement ?")) return;
    const next = list.filter((e) => e.id !== id);
    setList(next); onSave(next);
  }

  return (
    <div>
      <button className="btn btn-primary btn-sm" style={{ marginBottom: 20 }} onClick={() => { setIsNew(true); setEditing(newEv()); }}>
        + Ajouter un événement
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((e) => (
          <div key={e.id} className="a-item">
            <div className="a-item-head">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div className="a-date-pill">
                  <span className="a-date-day">{e.jour}</span>
                  <span className="a-date-mon">{e.mois}</span>
                </div>
                <div>
                  <span className="a-item-name">{e.titre}</span>
                  <span className="a-item-meta">{e.heure} · {e.tag}</span>
                </div>
              </div>
              <div className="a-item-right">
                <button className="a-icon-btn" onClick={() => { setIsNew(false); setEditing(e); }} title="Modifier">✎</button>
                <button className="a-icon-btn danger" onClick={() => remove(e.id)} title="Supprimer">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="a-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="a-modal-box" style={{ background: "#fff", borderRadius: 22, maxWidth: 560, width: "100%", padding: 36, overflow: "auto", maxHeight: "90vh" }}>
            <h3 style={{ marginBottom: 20 }}>{isNew ? "Nouvel événement" : "Modifier l'événement"}</h3>
            <div className="a-modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label>Titre</label>
                <input value={editing.titre} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  value={editing.dateStr ?? ""}
                  onChange={(e) => setEditing({ ...editing, ...updateDate(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>Heure</label>
                <input value={editing.heure} onChange={(e) => setEditing({ ...editing, heure: e.target.value })} />
              </div>
              <div className="field">
                <label>Catégorie</label>
                <select value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}>
                  {["Dégustation", "Concert", "Quizz", "Soirée", "Festival", "Atelier", "Autre"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label>Description</label>
                <textarea value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--brun)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Photo</label>
                <ImageUpload value={editing.photo} onChange={(url) => setEditing({ ...editing, photo: url })} folder="evenements" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={() => save(editing)}>Sauvegarder</button>
              <button className="btn btn-secondary" onClick={() => { setEditing(null); setIsNew(false); }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ForfaitsEditor({ forfaits, onSave }: { forfaits: Forfait[]; onSave: (f: Forfait[]) => void }) {
  const [list, setList] = useState(forfaits);
  function update(idx: number, f: Forfait) {
    const next = list.map((x, i) => (i === idx ? f : x));
    setList(next); onSave(next);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {list.map((f, i) => (
        <div key={f.id} style={{ background: "#fff", border: "1px solid rgba(91,58,30,0.08)", borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>{f.nom}</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--encre-soft)", cursor: "pointer" }}>
              <input type="checkbox" checked={f.featured} onChange={(e) => update(i, { ...f, featured: e.target.checked })} />
              Le plus demandé
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {(["kicker", "base", "desc"] as const).map((k) => (
              <div key={k} className="field" style={k === "desc" ? { gridColumn: "1/-1" } : {}}>
                <label>{k}</label>
                {k === "desc" ? (
                  <textarea value={f[k]} onChange={(e) => update(i, { ...f, [k]: e.target.value })} />
                ) : (
                  <input value={f[k]} onChange={(e) => update(i, { ...f, [k]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brun)", display: "block", marginBottom: 8 }}>Inclus</label>
            {f.inclus.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <input
                  style={{ flex: 1, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
                  value={item}
                  onChange={(e) => { const next = [...f.inclus]; next[j] = e.target.value; update(i, { ...f, inclus: next }); }}
                />
                <button style={{ border: "none", background: "none", color: "#C25A3F", cursor: "pointer", fontSize: 18 }} onClick={() => update(i, { ...f, inclus: f.inclus.filter((_, k) => k !== j) })}>✕</button>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => update(i, { ...f, inclus: [...f.inclus, ""] })}>
              + Ajouter un élément
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FutsEditor({ futs, onSave }: { futs: Fut[]; onSave: (f: Fut[]) => void }) {
  const [list, setList] = useState(futs);
  function update(i: number, f: Fut) { const next = list.map((x, j) => (j === i ? f : x)); setList(next); onSave(next); }
  function remove(i: number) { const next = list.filter((_, j) => j !== i); setList(next); onSave(next); }
  function add() { const next = [...list, { nom: "", vol: "20L", style: "Blonde", prix: "0 €", brasserie: "" }]; setList(next); onSave(next); }

  return (
    <div>
      <button className="btn btn-primary btn-sm" style={{ marginBottom: 20 }} onClick={add}>+ Ajouter un fût</button>
      <div style={{ background: "#fff", border: "1px solid rgba(91,58,30,0.08)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
          <thead>
            <tr style={{ background: "var(--papier-warm)" }}>
              {["Bière", "Style", "Brasserie", "Volume", "Prix", ""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--encre-soft)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((f, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(91,58,30,0.07)" }}>
                {(["nom", "style", "brasserie", "vol", "prix"] as const).map((k) => (
                  <td key={k} style={{ padding: "8px 12px" }}>
                    {k === "style" ? (
                      <select
                        style={{ width: "100%", padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 14 }}
                        value={f[k] ?? ""}
                        onChange={(e) => update(i, { ...f, style: e.target.value })}
                      >
                        {FUT_STYLES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input
                        style={{ width: "100%", padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 14 }}
                        value={f[k] ?? ""}
                        onChange={(e) => update(i, { ...f, [k]: e.target.value })}
                      />
                    )}
                  </td>
                ))}
                <td style={{ padding: "8px 12px" }}>
                  <button style={{ border: "none", background: "none", color: "#C25A3F", cursor: "pointer", fontSize: 18 }} onClick={() => remove(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function BoissonEditor({ boissons, onSave }: { boissons: Boisson[]; onSave: (b: Boisson[]) => void }) {
  const [list, setList] = useState(boissons);
  const categories = ["Vin blanc", "Vin rouge", "Vin rosé", "Cocktail", "Soft", "Spiritueux", "Autre"];

  function update(i: number, b: Boisson) { const next = list.map((x, j) => (j === i ? b : x)); setList(next); }
  function remove(i: number) {
    if (!confirm("Supprimer ?")) return;
    const next = list.filter((_, j) => j !== i); setList(next); onSave(next);
  }
  function add() {
    setList([...list, { nom: "", categorie: "Vin blanc", origine: "", prix: { "verre": "", "bouteille": "" }, actif: true, position: list.length }]);
  }

  return (
    <div>
      <button className="btn btn-primary btn-sm" style={{ marginBottom: 20 }} onClick={add}>+ Ajouter une boisson</button>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((b, i) => (
          <div key={i} className="a-item">
            <div className="a-item-head">
              <input
                style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--brun)", border: "none", background: "transparent", flex: 1, padding: 0, outline: "none", fontWeight: 400 }}
                value={b.nom} placeholder="Nom de la boisson"
                onChange={(e) => update(i, { ...b, nom: e.target.value })}
              />
              <button className="a-icon-btn danger" onClick={() => remove(i)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <select
                style={{ padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13, background: "var(--papier)", gridColumn: "1/-1" }}
                value={b.categorie}
                onChange={(e) => update(i, { ...b, categorie: e.target.value })}
              >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input
                style={{ padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13 }}
                value={b.origine ?? ""} placeholder="Origine"
                onChange={(e) => update(i, { ...b, origine: e.target.value })}
              />
              <input
                style={{ padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13 }}
                value={b.prix["verre"] ?? ""} placeholder="Prix au verre"
                onChange={(e) => update(i, { ...b, prix: { ...b.prix, verre: e.target.value } })}
              />
              <input
                style={{ padding: "7px 10px", border: "1.5px solid rgba(91,58,30,0.15)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13 }}
                value={b.prix["bouteille"] ?? ""} placeholder="Prix bouteille"
                onChange={(e) => update(i, { ...b, prix: { ...b.prix, bouteille: e.target.value } })}
              />
            </div>
          </div>
        ))}
      </div>
      {list.length > 0 && (
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onSave(list)}>
          Sauvegarder <span className="arrow">→</span>
        </button>
      )}
    </div>
  );
}

function MenuEditor({ menu, onSave }: { menu: SiteData["menuSemaine"]; onSave: (m: SiteData["menuSemaine"]) => void }) {
  const [m, setM] = useState(menu);
  return (
    <div style={{ maxWidth: 700 }}>
      <div className="field" style={{ marginBottom: 20 }}>
        <label>Intitulé de la semaine</label>
        <input value={m.semaine} onChange={(e) => setM({ ...m, semaine: e.target.value })} />
      </div>

      {(["entrees", "plats", "desserts"] as const).map((sec) => (
        <div key={sec} style={{ marginBottom: 28 }}>
          <h4 style={{ marginBottom: 12, textTransform: "capitalize" }}>{sec}</h4>
          {m[sec].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <input
                style={{ flex: 2, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
                placeholder="Nom" value={item.nom}
                onChange={(e) => {
                  const next = [...m[sec]] as typeof m[typeof sec];
                  (next[i] as { nom: string }).nom = e.target.value;
                  setM({ ...m, [sec]: next });
                }}
              />
              <input
                style={{ width: 90, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
                placeholder="Prix" value={item.prix}
                onChange={(e) => {
                  const next = [...m[sec]] as typeof m[typeof sec];
                  (next[i] as { prix: string }).prix = e.target.value;
                  setM({ ...m, [sec]: next });
                }}
              />
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginBottom: 28 }}>
        <h4 style={{ marginBottom: 12 }}>Formules</h4>
        {m.formules.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <input
              style={{ flex: 2, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
              placeholder="Nom de la formule" value={f.nom}
              onChange={(e) => {
                const next = [...m.formules];
                next[i] = { ...next[i], nom: e.target.value };
                setM({ ...m, formules: next });
              }}
            />
            <input
              style={{ width: 90, padding: "8px 12px", border: "1.5px solid rgba(91,58,30,0.18)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 14 }}
              placeholder="Prix" value={f.prix}
              onChange={(e) => {
                const next = [...m.formules];
                next[i] = { ...next[i], prix: e.target.value };
                setM({ ...m, formules: next });
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        <div className="field">
          <label>Dessert du jour</label>
          <input value={m.dessertDuJour.nom} onChange={(e) => setM({ ...m, dessertDuJour: { ...m.dessertDuJour, nom: e.target.value } })} />
        </div>
        <div className="field">
          <label>Prix dessert du jour</label>
          <input value={m.dessertDuJour.prix} onChange={(e) => setM({ ...m, dessertDuJour: { ...m.dessertDuJour, prix: e.target.value } })} />
        </div>
        <div className="field">
          <label>Accord de la semaine</label>
          <input value={m.accord.nom} onChange={(e) => setM({ ...m, accord: { ...m.accord, nom: e.target.value } })} />
        </div>
        <div className="field">
          <label>Descriptif accord</label>
          <input value={m.accord.desc} onChange={(e) => setM({ ...m, accord: { ...m.accord, desc: e.target.value } })} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => onSave(m)}>
        Sauvegarder le menu <span className="arrow">→</span>
      </button>
    </div>
  );
}
