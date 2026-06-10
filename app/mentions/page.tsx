import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE_DATA, telHref } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mentions légales · La Bièregerie d'Henri",
  description: "Mentions légales du site labieregeriedhenri.fr",
};

export default async function MentionsPage() {
  const D = await loadAdminData().catch(() => BASE_DATA);

  return (
    <>
      <Nav />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · Mentions légales
          </div>
          <h1 style={{ marginTop: 14 }}>Mentions <span className="scripted">légales</span></h1>
        </div>
      </header>

      <section className="tight">
        <div className="wrap">
          <div style={{ maxWidth: "72ch", display: "flex", flexDirection: "column", gap: 40 }}>

            {/* Éditeur */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>1. Éditeur du site</h2>
              <p style={{ margin: "0 0 8px" }}>Le site <strong>labieregeriedhenri.fr</strong> est édité par :</p>
              <div className="papier-card">
                <strong>La Bièregerie d&apos;Henri</strong><br />
                Forme juridique : SARL Thomas Beaufreton<br />
                SIRET : 98972966000013<br />
                Siège social : {D.contact.adresse.ligne1}, {D.contact.adresse.ligne2}<br />
                Téléphone : <a href={`tel:${telHref(D.contact.tel)}`} style={{ color: "var(--orange)" }}>{D.contact.tel}</a><br />
                Email : <a href={`mailto:${D.contact.email}`} style={{ color: "var(--orange)" }}>{D.contact.email}</a><br />
                Directeur de la publication : Thomas Beaufreton
              </div>
            </div>

            {/* Hébergeur */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>2. Hébergeur</h2>
              <div className="papier-card">
                <strong>Vercel Inc.</strong><br />
                340 Pine Street, Suite 601<br />
                San Francisco, CA 94104 — États-Unis<br />
                Site : <a href="https://vercel.com" style={{ color: "var(--orange)" }}>vercel.com</a>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>3. Propriété intellectuelle</h2>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                L&apos;ensemble du contenu de ce site (textes, images, logo, mise en page) est la propriété exclusive de La Bièregerie d&apos;Henri, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation de tout ou partie du site, sous quelque forme que ce soit, sans autorisation écrite préalable, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                Les marques et logos figurant sur le site sont déposés par La Bièregerie d&apos;Henri. Toute reproduction totale ou partielle de ces marques ou logos sans autorisation expresse est prohibée.
              </p>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>4. Protection des données personnelles</h2>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée, vous disposez des droits suivants sur vos données personnelles :
              </p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 22, fontSize: 15, lineHeight: 2 }}>
                <li>Droit d&apos;accès (art. 15 RGPD)</li>
                <li>Droit de rectification (art. 16 RGPD)</li>
                <li>Droit à l&apos;effacement (art. 17 RGPD)</li>
                <li>Droit à la limitation du traitement (art. 18 RGPD)</li>
                <li>Droit à la portabilité (art. 20 RGPD)</li>
                <li>Droit d&apos;opposition (art. 21 RGPD)</li>
              </ul>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                <strong>Données collectées :</strong> adresse email dans le cadre de la newsletter, et données de formulaire de contact ou de réservation (prénom, téléphone, email).
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                <strong>Finalité :</strong> envoi de la gazette mensuelle (newsletter) et traitement des demandes de réservation ou de devis tireuse. Les données ne sont jamais transmises à des tiers à des fins commerciales.
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                <strong>Durée de conservation :</strong> 3 ans à compter du dernier contact, sauf désinscription anticipée.
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                Pour exercer vos droits ou pour toute question relative à vos données, contactez-nous à l&apos;adresse : <a href={`mailto:${D.contact.email}`} style={{ color: "var(--orange)" }}>{D.contact.email}</a>. Vous disposez également du droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés, <a href="https://www.cnil.fr" style={{ color: "var(--orange)" }}>cnil.fr</a>).
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>5. Cookies</h2>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement (session d&apos;authentification pour l&apos;espace admin). Aucun cookie de traçage publicitaire ou analytique tiers n&apos;est utilisé.
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                Conformément à l&apos;article 5(3) de la directive ePrivacy et aux lignes directrices de la CNIL, les cookies strictement nécessaires ne requièrent pas de consentement préalable.
              </p>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>6. Limitation de responsabilité</h2>
              <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>
                Les informations diffusées sur ce site sont présentées à titre indicatif et sans garantie d&apos;exactitude. La Bièregerie d&apos;Henri se réserve le droit de les modifier à tout moment sans préavis, notamment les tarifs, horaires et disponibilités.
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                La Bièregerie d&apos;Henri ne saurait être tenue responsable de tout dommage, direct ou indirect, résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder.
              </p>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>7. Droit applicable</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
              </p>
            </div>

            <p style={{ fontSize: 13, color: "var(--encre-soft)", borderTop: "1px dashed rgba(91,58,30,0.15)", paddingTop: 20 }}>
              Dernière mise à jour : mai 2026 — Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN).
            </p>
          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
