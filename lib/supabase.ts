import { createClient } from "@supabase/supabase-js";
import {
  BASE_DATA,
  Beer,
  Boisson,
  Evenement,
  Forfait,
  Fut,
  MenuSemaine,
  SiteData,
} from "./data";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
);

// ---- Mappers DB → TypeScript ----

type Row = Record<string, unknown>;

function dbToBeer(r: Row): Beer {
  return {
    id: r.id as number,
    nom: r.nom as string,
    brasserie: r.brasserie as string,
    style: r.style as Beer["style"],
    styleLabel: r.style_label as string,
    origine: r.origine as string,
    deg: r.deg as string,
    format: r.format as Beer["format"],
    coup: r.coup as boolean | undefined,
    actif: r.actif as boolean,
    note: r.note as string,
    prix: r.prix as Record<string, string>,
    photo: r.photo as string | undefined,
    details: r.details as Beer["details"],
  };
}

function beerToDb(b: Beer, position: number): Row {
  const row: Row = {
    nom: b.nom,
    brasserie: b.brasserie,
    style: b.style,
    style_label: b.styleLabel,
    origine: b.origine,
    deg: b.deg,
    format: b.format,
    coup: b.coup ?? false,
    note: b.note,
    prix: b.prix,
    photo: b.photo ?? null,
    details: b.details ?? {},
    actif: b.actif ?? true,
    position,
  };
  // inclure l'id seulement pour les bières existantes (id DB, pas un Date.now() temporaire)
  if (b.id && b.id < 1_000_000_000) row.id = b.id;
  return row;
}

function dbToEvent(r: Row): Evenement {
  const dateStr = r.date_event as string;
  const d = new Date(dateStr + "T00:00:00");
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const moisStr = d.toLocaleDateString("fr-FR", { month: "long" });
  const moisFull = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return {
    id: r.id as number,
    jour: d.getDate(),
    mois: cap(moisStr),
    moisFull: cap(moisFull),
    titre: r.titre as string,
    tag: r.tag as string,
    heure: r.heure as string,
    desc: r.description as string,
    photo: r.photo as string | undefined,
    dateStr,
  };
}

function dbToMenu(r: Row): MenuSemaine {
  return {
    semaine: r.semaine as string,
    entrees: r.entrees as MenuSemaine["entrees"],
    plats: r.plats as MenuSemaine["plats"],
    desserts: r.desserts as MenuSemaine["desserts"],
    dessertDuJour: r.dessert_du_jour as MenuSemaine["dessertDuJour"],
    formules: r.formules as MenuSemaine["formules"],
    accord: r.accord as MenuSemaine["accord"],
  };
}

function dbToForfait(r: Row): Forfait {
  return {
    id: r.id as string,
    nom: r.nom as string,
    kicker: r.kicker as string,
    base: r.base as string,
    desc: r.description as string,
    inclus: r.inclus as string[],
    featured: r.featured as boolean,
    addon: r.addon as string,
  };
}

function dbToFut(r: Row): Fut {
  return {
    id: r.id as number,
    nom: r.nom as string,
    style: r.style as string,
    brasserie: r.brasserie as string,
    vol: r.volume as string,
    prix: r.prix as string,
  };
}

function dbToBoisson(r: Row): Boisson {
  return {
    id: r.id as number,
    nom: r.nom as string,
    categorie: r.categorie as string,
    description: r.description as string | undefined,
    origine: r.origine as string | undefined,
    prix: r.prix as Record<string, string>,
    actif: r.actif as boolean,
    position: r.position as number,
  };
}

// ---- Chargement complet (admin + pages publiques) ----

export async function loadAdminData(adminMode = false): Promise<SiteData> {
  const beersQuery = adminMode
    ? supabase.from("beers").select("*").order("position")
    : supabase.from("beers").select("*").eq("actif", true).order("position");
  const [beersR, eventsR, menuR, horairesR, forfaitsR, futsR, boissonsR, configR] =
    await Promise.all([
      beersQuery,
      supabase.from("evenements").select("*").eq("actif", true).order("date_event"),
      supabase.from("menu_semaine").select("*").eq("actif", true).order("id", { ascending: false }).limit(1),
      supabase.from("horaires").select("*").order("position"),
      supabase.from("forfaits").select("*").order("position"),
      supabase.from("futs").select("*").eq("actif", true),
      supabase.from("boissons").select("*").eq("actif", true).order("position"),
      supabase.from("site_config").select("data").eq("id", 1).single(),
    ]);

  const orBase = <T,>(r: { data: T[] | null; error: unknown }, fallback: T[]) =>
    !r.error && (r.data?.length ?? 0) > 0 ? r.data! : fallback;

  const beers = orBase(beersR, BASE_DATA.bieres).map(dbToBeer);
  const evenements = orBase(eventsR, BASE_DATA.evenementsAvenir).map(dbToEvent);
  const menu =
    !menuR.error && (menuR.data?.length ?? 0) > 0
      ? dbToMenu(menuR.data![0] as Row)
      : BASE_DATA.menuSemaine;
  const horaires =
    !horairesR.error && (horairesR.data?.length ?? 0) > 0
      ? horairesR.data!.map((h: Row) => ({ jour: h.jour as string, hr: h.heure as string, closed: h.ferme as boolean }))
      : BASE_DATA.horaires;
  const forfaits = orBase(forfaitsR, BASE_DATA.forfaits).map(dbToForfait);
  const futs = orBase(futsR, BASE_DATA.futsDisponibles).map(dbToFut);
  const boissons = (!boissonsR.error ? boissonsR.data ?? [] : []).map(dbToBoisson);
  const config = (!configR.error ? configR.data?.data : null) ?? {};

  return {
    ...BASE_DATA,
    ...config,
    bieres: beers,
    evenementsAvenir: evenements,
    menuSemaine: menu,
    horaires,
    forfaits,
    futsDisponibles: futs,
    boissons,
  };
}

// ---- Fonctions de sauvegarde par table ----

// ---- Helper : toutes les écritures admin passent par la route API (service role, bypass RLS) ----

async function adminSave(type: string, payload: unknown): Promise<unknown> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch("/api/admin/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ type, payload }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error ?? "Erreur de sauvegarde");
  return result;
}

export async function saveBeers(beers: Beer[]): Promise<Beer[]> {
  const result = await adminSave("beers", beers) as { beers: Row[] };
  return (result.beers ?? []).map(dbToBeer);
}

export async function saveEvenements(evs: Evenement[]): Promise<void> {
  await adminSave("evenements", evs);
}

export async function saveMenu(menu: MenuSemaine): Promise<void> {
  await adminSave("menu", menu);
}

export async function saveHoraires(horaires: SiteData["horaires"]): Promise<void> {
  await adminSave("horaires", horaires);
}

export async function saveForfaits(forfaits: Forfait[]): Promise<void> {
  await adminSave("forfaits", forfaits);
}

export async function saveFuts(futs: Fut[]): Promise<void> {
  await adminSave("futs", futs);
}

export async function saveBoissons(boissons: Boisson[]): Promise<void> {
  await adminSave("boissons", boissons);
}

export async function saveSiteConfig(patch: Record<string, unknown>): Promise<void> {
  await adminSave("config", patch);
}

export async function seedAllData(data: SiteData): Promise<void> {
  await Promise.all([
    saveBeers(data.bieres),
    saveEvenements(data.evenementsAvenir),
    saveMenu(data.menuSemaine),
    saveHoraires(data.horaires),
    saveForfaits(data.forfaits),
    saveFuts(data.futsDisponibles),
    saveBoissons(data.boissons),
    saveSiteConfig({
      contact: data.contact,
      biereDuMoment: data.biereDuMoment,
      tireuse: data.tireuse,
      etapes: data.etapes,
    }),
  ]);
}

// ---- Ancienne API (fallback pour les pages publiques) ----

export async function getSiteData(): Promise<SiteData> {
  return loadAdminData();
}
