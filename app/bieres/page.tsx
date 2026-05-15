import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FilteredBeers from "@/components/FilteredBeers";
import { BASE_DATA } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "La carte des bières · La Bièregerie d'Henri",
  description: "Pression, canette, bouteille. 20 bières artisanales filtrées par style, origine et contenant.",
};

export default async function BieresPage() {
  const D = await loadAdminData().catch(() => BASE_DATA);

  return (
    <>
      <Nav active="bieres" />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · La carte
          </div>
          <div className="layout">
            <div>
              <span className="eyebrow">Pression, canette, bouteille</span>
              <h1 style={{ marginTop: 14 }}>
                La carte <span className="scripted">des bières</span>
              </h1>
              <p className="lead" style={{ marginTop: 16 }}>
                Filtre par style, par origine ou par contenant. Si tu hésites, regarde
                les <strong>coups de cœur d&apos;Henri</strong> — c&apos;est ce qu&apos;on sert
                d&apos;abord quand un copain s&apos;assied au comptoir.
              </p>
            </div>
          </div>
        </div>
      </header>

      <FilteredBeers beers={D.bieres} data={D} />

      <Footer data={D} />
    </>
  );
}
