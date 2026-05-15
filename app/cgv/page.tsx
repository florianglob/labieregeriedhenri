import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BASE_DATA, telHref } from "@/lib/data";
import { loadAdminData } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Conditions Générales de Vente · La Bièregerie d'Henri",
  description: "CGV de La Bièregerie d'Henri — vente de boissons, location de tireuse.",
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{num}. {title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "var(--encre)", display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

export default async function CGVPage() {
  const D = await loadAdminData().catch(() => BASE_DATA);

  return (
    <>
      <Nav />

      <header className="page-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> · CGV
          </div>
          <h1 style={{ marginTop: 14 }}>Conditions <span className="scripted">générales</span> de vente</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            Applicables à toute commande passée auprès de La Bièregerie d&apos;Henri,
            que ce soit en établissement, par téléphone ou via le site internet.
          </p>
        </div>
      </header>

      <section className="tight">
        <div className="wrap">
          <div style={{ maxWidth: "72ch", display: "flex", flexDirection: "column", gap: 40 }}>

            <Section num="1" title="Objet">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>La Bièregerie d&apos;Henri</strong> (ci-après &laquo; le Vendeur &raquo;) et tout client (ci-après &laquo; le Client &raquo;) pour :
              </p>
              <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2 }}>
                <li>La vente de boissons, plats et snacks consommés sur place ou à emporter</li>
                <li>La location de matériel de tirage pression (tireuse 2 becs + fûts)</li>
                <li>La privatisation de l&apos;établissement</li>
              </ul>
              <p>
                Toute commande implique l&apos;acceptation sans réserve des présentes CGV par le Client. Le Vendeur se réserve le droit de les modifier à tout moment ; la version applicable est celle en vigueur au moment de la commande.
              </p>
            </Section>

            <Section num="2" title="Identification du vendeur">
              <div className="papier-card">
                <strong>La Bièregerie d&apos;Henri</strong><br />
                {D.contact.adresse.ligne1}, {D.contact.adresse.ligne2}<br />
                Téléphone : <a href={`tel:${telHref(D.contact.tel)}`} style={{ color: "var(--orange)" }}>{D.contact.tel}</a><br />
                Email : <a href={`mailto:${D.contact.email}`} style={{ color: "var(--orange)" }}>{D.contact.email}</a><br />
                SIRET : [À compléter]
              </div>
            </Section>

            <Section num="3" title="Prix">
              <p>
                Les prix sont indiqués en euros TTC (toutes taxes comprises), incluant la TVA applicable. La TVA sur les boissons alcoolisées servies sur place est de <strong>10 %</strong> ; celle sur les ventes à emporter de boissons alcoolisées est de <strong>20 %</strong>.
              </p>
              <p>
                Les prix affichés sur le site internet sont donnés à titre indicatif et peuvent être mis à jour à tout moment. Les prix définitifs sont ceux affichés en établissement au moment de la commande ou confirmés par écrit dans le cadre d&apos;un devis pour la location de tireuse.
              </p>
              <p>
                Le Vendeur se réserve le droit de modifier ses tarifs sans préavis pour les ventes en établissement. Pour les devis de location de tireuse acceptés, le prix est garanti jusqu&apos;à la date de prestation.
              </p>
            </Section>

            <Section num="4" title="Commande et confirmation">
              <p>
                <strong>En établissement :</strong> la commande est validée dès sa passation au comptoir ou en salle. Le paiement vaut acceptation.
              </p>
              <p>
                <strong>Location de tireuse :</strong> la commande est formalisée par l&apos;acceptation d&apos;un devis écrit (par email ou SMS). Elle devient ferme à réception d&apos;un acompte de 30 % du montant total TTC.
              </p>
              <p>
                <strong>Privatisation :</strong> sur demande écrite et confirmation par le Vendeur. Un acompte de 30 % est demandé à la réservation.
              </p>
            </Section>

            <Section num="5" title="Modalités de paiement">
              <p>
                Les modes de paiement acceptés sont :
              </p>
              <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2 }}>
                <li>Espèces</li>
                <li>Carte bancaire (Visa, Mastercard, CB)</li>
                <li>Virement bancaire (pour les devis de location ou privatisation)</li>
              </ul>
              <p>
                Le paiement est exigible intégralement à la livraison ou à la remise du matériel, déduction faite de l&apos;acompte versé. Aucun escompte n&apos;est accordé pour paiement anticipé.
              </p>
              <p>
                En cas de paiement par virement, les références bancaires sont communiquées lors de la confirmation de commande. Tout retard de paiement entraîne l&apos;application de pénalités au taux légal en vigueur (art. L. 441-10 du Code de Commerce), ainsi qu&apos;une indemnité forfaitaire de recouvrement de 40 € (décret n° 2012-1115).
              </p>
            </Section>

            <Section num="6" title="Location de tireuse — conditions spécifiques">
              <p>
                <strong>Dépôt de garantie (caution) :</strong> une caution est exigée au moment de la remise du matériel. Son montant est précisé dans le devis. Elle est restituée dans un délai de 5 jours ouvrés après retour complet et en bon état du matériel.
              </p>
              <p>
                <strong>Retrait et retour :</strong> le matériel est à retirer et à restituer directement en établissement aux horaires d&apos;ouverture, aux dates convenues dans le devis. Tout retard de retour sera facturé au tarif journalier en vigueur.
              </p>
              <p>
                <strong>Responsabilité du Client :</strong> le Client est responsable du matériel mis à sa disposition dès la remise et jusqu&apos;au retour. Tout dommage, perte ou vol sera déduit de la caution et facturé en complément si le préjudice dépasse son montant.
              </p>
              <p>
                <strong>Fûts :</strong> les fûts entamés ne sont ni repris ni remboursés. Les fûts non entamés peuvent être repris sous réserve de leur état et de leur date de péremption, à la discrétion du Vendeur.
              </p>
              <p>
                <strong>Usage :</strong> le matériel est mis à disposition pour un usage privé et non-commercial. Toute sous-location ou utilisation à des fins commerciales est formellement interdite.
              </p>
            </Section>

            <Section num="7" title="Droit de rétractation">
              <p>
                Conformément aux articles L. 221-1 et suivants du Code de la consommation, le droit de rétractation de 14 jours <strong>ne s&apos;applique pas</strong> aux prestations suivantes, conformément à l&apos;article L. 221-28 du Code de la consommation :
              </p>
              <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2 }}>
                <li>Fourniture de biens périssables (boissons, produits alimentaires)</li>
                <li>Prestations de services dont l&apos;exécution a commencé avec l&apos;accord du consommateur avant l&apos;expiration du délai de rétractation</li>
                <li>Prestations de loisirs à une date ou une période déterminée (événements, privatisation)</li>
              </ul>
              <p>
                Pour la location de tireuse, toute annulation est soumise aux conditions suivantes :
              </p>
              <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2 }}>
                <li>Annulation à plus de 15 jours avant la date : remboursement intégral de l&apos;acompte</li>
                <li>Annulation entre 8 et 15 jours avant la date : remboursement de 50 % de l&apos;acompte</li>
                <li>Annulation à moins de 8 jours avant la date : acompte conservé</li>
              </ul>
            </Section>

            <Section num="8" title="Responsabilité">
              <p>
                Le Vendeur s&apos;engage à fournir des produits conformes à la réglementation en vigueur, notamment en matière de sécurité alimentaire (Règlement CE n° 852/2004, arrêté du 21 décembre 2009).
              </p>
              <p>
                La responsabilité du Vendeur ne saurait être engagée en cas d&apos;utilisation inappropriée du matériel de tirage par le Client ou en cas de non-respect des consignes d&apos;utilisation fournies lors de la remise.
              </p>
              <p>
                Conformément à l&apos;article L. 3342-1 du Code de la santé publique, la vente d&apos;alcool à des mineurs de moins de 18 ans est interdite. Le Vendeur est en droit d&apos;exiger une pièce d&apos;identité. La location de tireuse est réservée aux personnes majeures.
              </p>
            </Section>

            <Section num="9" title="Réclamations et médiation">
              <p>
                Pour toute réclamation, contactez-nous en priorité :
              </p>
              <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2 }}>
                <li>Par email : <a href={`mailto:${D.contact.email}`} style={{ color: "var(--orange)" }}>{D.contact.email}</a></li>
                <li>Par téléphone : <a href={`tel:${telHref(D.contact.tel)}`} style={{ color: "var(--orange)" }}>{D.contact.tel}</a></li>
                <li>Par courrier : {D.contact.adresse.ligne1}, {D.contact.adresse.ligne2}</li>
              </ul>
              <p>
                Conformément à l&apos;ordonnance n° 2015-1033 du 20 août 2015 et au décret n° 2015-1382 du 30 octobre 2015, en cas de litige non résolu à l&apos;amiable dans un délai de 60 jours, le Client consommateur peut recourir gratuitement à la médiation de la consommation. Le médiateur compétent est :
              </p>
              <div className="papier-card">
                <strong>CNPM — Médiation de la Consommation</strong><br />
                27 avenue de la Libération, 42400 Saint-Chamond<br />
                <a href="https://www.cnpm-mediation-consommation.eu" style={{ color: "var(--orange)" }}>cnpm-mediation-consommation.eu</a>
              </div>
              <p>
                La Commission Européenne met également à disposition une plateforme de règlement en ligne des litiges (RLL) accessible à l&apos;adresse <a href="https://ec.europa.eu/consumers/odr" style={{ color: "var(--orange)" }}>ec.europa.eu/consumers/odr</a>.
              </p>
            </Section>

            <Section num="10" title="Droit applicable et juridiction">
              <p>
                Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux du ressort de [ville du tribunal compétent], sauf disposition légale contraire applicable aux consommateurs.
              </p>
            </Section>

            <p style={{ fontSize: 13, color: "var(--encre-soft)", borderTop: "1px dashed rgba(91,58,30,0.15)", paddingTop: 20 }}>
              Dernière mise à jour : mai 2026 — Conformément au Code de la consommation (L. 111-1 et s.), à la Directive UE 2011/83/UE relative aux droits des consommateurs, et au Règlement UE 2016/679 (RGPD).
            </p>

          </div>
        </div>
      </section>

      <Footer data={D} />
    </>
  );
}
