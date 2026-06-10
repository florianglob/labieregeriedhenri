import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { Beer, Evenement, Forfait, Fut, Boisson, MenuSemaine, SiteData } from "@/lib/data";

type Row = Record<string, unknown>;

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return false;
  const { data: { user } } = await admin.auth.getUser(token);
  return !!user;
}

function beerToDb(b: Beer, position: number): Row {
  const row: Row = {
    nom: b.nom, brasserie: b.brasserie, style: b.style, style_label: b.styleLabel,
    origine: b.origine, deg: b.deg, format: b.format, coup: b.coup ?? false,
    note: b.note, prix: b.prix, photo: b.photo ?? null, details: b.details ?? {},
    actif: b.actif ?? true, position,
  };
  if (b.id && b.id < 1_000_000_000) row.id = b.id;
  return row;
}

const MOIS_FR: Record<string, number> = {
  janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12,
};

export async function POST(req: NextRequest) {
  const ok = await verifyAuth(req);
  if (!ok) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { type: string; payload: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  const { type, payload } = body;

  try {
    if (type === "beers") {
      const beers = payload as Beer[];
      const { data: existing } = await admin.from("beers").select("id");
      const existingIds = new Set((existing ?? []).map((r: Row) => r.id as number));
      const keepIds = new Set(beers.filter(b => b.id < 1_000_000_000).map(b => b.id));
      const toDelete = [...existingIds].filter(id => !keepIds.has(id as number));
      if (toDelete.length > 0) {
        const { error } = await admin.from("beers").delete().in("id", toDelete);
        if (error) throw error;
      }
      if (beers.length > 0) {
        const rows = beers.map((b, i) => beerToDb(b, i));
        const toUpdate = rows.filter(r => r.id !== undefined);
        const toInsert = rows.filter(r => r.id === undefined);
        if (toUpdate.length > 0) {
          const { error } = await admin.from("beers").upsert(toUpdate, { onConflict: "id" });
          if (error) throw error;
        }
        if (toInsert.length > 0) {
          const { error } = await admin.from("beers").insert(toInsert);
          if (error) throw error;
        }
      }
      const { data: fresh } = await admin.from("beers").select("*").order("position");
      return NextResponse.json({ beers: fresh });
    }

    if (type === "evenements") {
      const evs = payload as Evenement[];
      await admin.from("evenements").delete().gte("id", 0);
      if (evs.length > 0) {
        const rows = evs.map((e) => {
          let date_event = e.dateStr;
          if (!date_event) {
            const month = MOIS_FR[e.mois.toLowerCase()] ?? 1;
            date_event = `2026-${String(month).padStart(2, "0")}-${String(e.jour).padStart(2, "0")}`;
          }
          return { titre: e.titre, tag: e.tag, date_event, heure: e.heure, description: e.desc, photo: e.photo ?? null, actif: true };
        });
        const { error } = await admin.from("evenements").insert(rows);
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "menu") {
      const menu = payload as MenuSemaine;
      await admin.from("menu_semaine").update({ actif: false }).eq("actif", true);
      const { error } = await admin.from("menu_semaine").insert({
        semaine: menu.semaine, entrees: menu.entrees, plats: menu.plats,
        desserts: menu.desserts, dessert_du_jour: menu.dessertDuJour,
        formules: menu.formules, accord: menu.accord, actif: true,
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (type === "horaires") {
      const horaires = payload as SiteData["horaires"];
      await admin.from("horaires").delete().gte("id", 0);
      if (horaires.length > 0) {
        const { error } = await admin.from("horaires").insert(
          horaires.map((h, i) => ({ jour: h.jour, heure: h.hr, ferme: h.closed ?? false, position: i }))
        );
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "forfaits") {
      const forfaits = payload as Forfait[];
      const { error } = await admin.from("forfaits").upsert(
        forfaits.map((f, i) => ({
          id: f.id, nom: f.nom, kicker: f.kicker, base: f.base,
          description: f.desc, inclus: f.inclus, featured: f.featured,
          addon: f.addon, position: i,
        }))
      );
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (type === "futs") {
      const futs = payload as Fut[];
      await admin.from("futs").delete().gte("id", 0);
      if (futs.length > 0) {
        const { error } = await admin.from("futs").insert(
          futs.map((f) => ({ nom: f.nom, style: f.style, brasserie: f.brasserie, volume: f.vol, prix: f.prix, actif: true }))
        );
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "boissons") {
      const boissons = payload as Boisson[];
      await admin.from("boissons").delete().gte("id", 0);
      if (boissons.length > 0) {
        const { error } = await admin.from("boissons").insert(
          boissons.map((b, i) => ({
            nom: b.nom, categorie: b.categorie, description: b.description ?? null,
            origine: b.origine ?? null, prix: b.prix, actif: true, position: i,
          }))
        );
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "config") {
      const patch = payload as Record<string, unknown>;
      const { data: existing } = await admin.from("site_config").select("data").eq("id", 1).single();
      const current = (existing?.data as Record<string, unknown>) ?? {};
      const { error } = await admin.from("site_config").upsert({ id: 1, data: { ...current, ...patch } });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  } catch (err) {
    const msg = (err as { message?: string })?.message ?? "Erreur serveur";
    console.error("[admin/save]", type, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
