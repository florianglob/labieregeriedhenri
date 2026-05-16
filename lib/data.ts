export type Format = "pression" | "canette" | "bouteille";
export type Style = "blonde" | "ambree" | "ipa" | "brune" | "blanche" | "sour" | "sans";

export interface BeerDetails {
  ibu?: number;
  ebc?: number;
  amertume?: { label: string; pct: number };
  houblons?: string;
  malts?: string;
  fermentation?: string;
  service?: string;
  garde?: string;
  accord?: string;
  histoire?: string;
}

export interface Beer {
  id: number;
  nom: string;
  brasserie: string;
  style: Style;
  styleLabel: string;
  origine: string;
  deg: string;
  format: Format;
  coup?: boolean;
  note: string;
  prix: Record<string, string>;
  photo?: string;
  details?: BeerDetails;
}

export interface Evenement {
  id: number;
  jour: number;
  mois: string;
  moisFull: string;
  titre: string;
  tag: string;
  heure: string;
  desc: string;
  photo?: string;
  dateStr?: string; // ISO date "YYYY-MM-DD" — utilisé pour l'écriture en DB
}

export interface FormatItem { nom: string; prix: string }
export interface MenuSemaine {
  semaine: string;
  entrees: FormatItem[];
  plats: Array<FormatItem & { desc?: string }>;
  desserts: FormatItem[];
  dessertDuJour: FormatItem;
  formules: FormatItem[];
  accord: { nom: string; desc: string };
}

export interface Forfait {
  id: string;
  nom: string;
  kicker: string;
  base: string;
  desc: string;
  inclus: string[];
  featured: boolean;
  addon: string;
}

export interface Fut {
  id?: number; // DB-assigned
  nom: string;
  vol: string;
  style: string;
  prix: string;
  brasserie: string;
}

export interface Boisson {
  id?: number;
  nom: string;
  categorie: string;
  description?: string;
  origine?: string;
  prix: Record<string, string>;
  actif: boolean;
  position: number;
}

export interface Etape {
  num: number;
  titre: string;
  desc: string;
}

export interface SiteData {
  contact: {
    nom: string;
    tagline: string;
    tel: string;
    email: string;
    adresse: { ligne1: string; ligne2: string };
    instagram: string;
  };
  horaires: Array<{ jour: string; hr: string; closed?: boolean }>;
  biereDuMomentId?: number;
  biereDuMoment: {
    nom: string;
    brasserie: string;
    style: string;
    descriptif: string;
    prix: string;
    unite: string;
    tag: string;
  };
  styles: Array<{ id: string; label: string }>;
  origines: string[];
  detailsParStyle: Record<string, BeerDetails & { service?: string; garde?: string; accord?: string }>;
  photos: {
    hero?: string;
    privatisation?: string;
  };
  coords?: { lat: number; lng: number };
  sticker?: {
    visible: boolean;
    ligne1: string;
    ligne2: string;
  };
  bieres: Beer[];
  evenementsAvenir: Evenement[];
  menuSemaine: MenuSemaine;
  tireuse: { pitch: string; retrait: string; caution: string };
  forfaits: Forfait[];
  futsDisponibles: Fut[];
  etapes: Etape[];
  boissons: Boisson[];
}

export const BASE_DATA: SiteData = {
  contact: {
    nom: "La Bièregerie d'Henri",
    tagline: "Bières, Vins & Afterworks",
    tel: "02 51 57 86 09",
    email: "contact@labieregeriedhenri.fr",
    adresse: {
      ligne1: "53 Route de Poitiers",
      ligne2: "85290 Mortagne-sur-Sèvre",
    },
    instagram: "https://www.instagram.com/la_bieregerie_dhenri/",
  },

  horaires: [
    { jour: "Lundi", hr: "Fermé", closed: true },
    { jour: "Mardi", hr: "10h–14h · 16h30–21h" },
    { jour: "Mercredi", hr: "10h–14h · 16h30–21h" },
    { jour: "Jeudi", hr: "10h–14h · 16h30–21h" },
    { jour: "Vendredi", hr: "10h–14h · 16h30–00h" },
    { jour: "Samedi", hr: "16h–00h" },
    { jour: "Dimanche", hr: "Fermé", closed: true },
  ],

  biereDuMoment: {
    nom: "La Houblonnée du Bocage",
    brasserie: "Brasserie de la Croix",
    style: "IPA · 6,2°",
    descriptif:
      "Notes d'agrumes confits, finale résineuse — un coup de cœur de cette quinzaine.",
    prix: "3,90 €",
    unite: "le 25cl · à la pression",
    tag: "Bière du moment",
  },

  styles: [
    { id: "all", label: "Toutes" },
    { id: "blonde", label: "Blonde" },
    { id: "ambree", label: "Ambrée" },
    { id: "ipa", label: "IPA" },
    { id: "brune", label: "Brune" },
    { id: "blanche", label: "Blanche" },
    { id: "sour", label: "Sour" },
    { id: "sans", label: "Sans alcool" },
  ],

  origines: [
    "Pays de la Loire",
    "Bretagne",
    "Belgique",
    "Allemagne",
    "Royaume-Uni",
    "USA",
    "République Tchèque",
    "France",
  ],

  detailsParStyle: {
    ipa: { ibu: 55, ebc: 14, fermentation: "Haute", houblons: "Citra · Mosaic · Simcoe", malts: "Pale Ale · Munich léger · Avoine", service: "6–8°C · verre tulipe", garde: "À boire frais, dans les 6 mois", accord: "Burgers, currys, fromages affinés" },
    blonde: { ibu: 22, ebc: 8, fermentation: "Haute", houblons: "Hallertau · Saaz", malts: "Pilsner · Munich léger", service: "5–7°C · verre droit", garde: "1 an au frais", accord: "Apéro, salades, poissons fumés" },
    ambree: { ibu: 28, ebc: 28, fermentation: "Haute", houblons: "East Kent Goldings · Fuggle", malts: "Pale Ale · Caramel · Munich", service: "8–10°C · verre tulipe", garde: "1 an au frais", accord: "Viandes rouges, sauces brunes, comté" },
    brune: { ibu: 38, ebc: 75, fermentation: "Haute", houblons: "Northern Brewer · Fuggle", malts: "Pale Ale · Caramel · Chocolat · Black", service: "10–12°C · verre tulipe", garde: "2 ans au frais", accord: "Chocolat noir, gibier, fromages bleus" },
    blanche: { ibu: 14, ebc: 6, fermentation: "Haute", houblons: "Saaz · Styrian", malts: "Froment · Pilsner · Avoine", service: "5–7°C · verre haut", garde: "6 mois au frais", accord: "Fruits de mer, salades, brunch" },
    sour: { ibu: 8, ebc: 10, fermentation: "Mixte · Lacto + Brett", houblons: "Citra (en finition)", malts: "Pilsner · Froment", service: "5–7°C · verre tulipe", garde: "1 an au frais — évolue", accord: "Huîtres, ceviche, tartes aux fruits" },
    sans: { ibu: 24, ebc: 10, fermentation: "Spéciale · sans fermentation", houblons: "Citra · Mosaic", malts: "Pilsner · Caramel léger", service: "4–6°C · verre droit", garde: "9 mois au frais", accord: "À toute heure, designated driver" },
  },

  bieres: [
    { id: 1, nom: "La Houblonnée", brasserie: "Brasserie de la Croix", style: "ipa", styleLabel: "IPA", origine: "Pays de la Loire", deg: "6,2°", format: "pression", coup: true, note: "Agrumes, résine, sec.", prix: { "25cl": "3,90 €", "50cl": "7,20 €", "pichet": "20,00 €" }, details: { ibu: 58, ebc: 12, houblons: "Citra · Centennial · Cascade", malts: "Pale Ale · Caramel 60 · Avoine maltée", accord: "Tacos, fish & chips, comté 18 mois", histoire: "Brassée à 8 km du bar par Vincent et Marion. L'eau vient directement du forage du Bocage — sa minéralité tendre est le secret de la finale sèche." } },
    { id: 2, nom: "Blonde des Vignes", brasserie: "Atelier de Saint-Lyphard", style: "blonde", styleLabel: "Blonde", origine: "Pays de la Loire", deg: "5,0°", format: "pression", note: "Maltée, ronde, fleurie.", prix: { "25cl": "3,50 €", "50cl": "6,50 €", "pichet": "18,00 €" }, details: { ibu: 20, ebc: 9, malts: "Pilsner · Vienna · Froment malté", accord: "L'apéro avec rillettes de Sébastien", histoire: "L'Atelier brasse à 50 m d'une parcelle de chenin. Le moût est filtré sur sarments — d'où ce final légèrement fumé." } },
    { id: 3, nom: "Pierre des Champs", brasserie: "Mélusine", style: "ambree", styleLabel: "Ambrée", origine: "Pays de la Loire", deg: "5,8°", format: "bouteille", note: "Caramel, biscuit, équilibrée.", prix: { "33cl": "4,80 €" }, details: { ibu: 26, ebc: 32, accord: "Magret, parmentier, tomme de chèvre", histoire: "Recette historique de la maison — celle de Tom et son père. Maltage en partie maison sur orge de la Vendée." } },
    { id: 4, nom: "Stout du Nord", brasserie: "Brasserie Rade", style: "brune", styleLabel: "Stout", origine: "Bretagne", deg: "7,2°", format: "canette", coup: true, note: "Café, chocolat noir, soyeuse.", prix: { "33cl": "5,20 €" }, details: { ibu: 42, ebc: 95, fermentation: "Haute · ajout café froid", houblons: "Magnum · East Kent Goldings", malts: "Pale Ale · Chocolat · Roasted Barley · Avoine", accord: "Tarte au chocolat, bœuf braisé, stilton", histoire: "Le café (un brésilien de la torréfaction Mokxa) est ajouté à froid pendant 36h. Brassage et canettage en direct au port de Brest." } },
    { id: 5, nom: "Blanche Marine", brasserie: "L'Embrunée", style: "blanche", styleLabel: "Blanche", origine: "Bretagne", deg: "4,8°", format: "pression", note: "Coriandre, agrumes, fraîche.", prix: { "25cl": "3,50 €", "50cl": "6,50 €", "pichet": "18,00 €" }, details: { accord: "Plateau de fruits de mer, beignets de calamar", histoire: "Coriandre fraîche et zeste de yuzu (et pas d'orange — la signature locale). Embouteillée à 200 m de la côte." } },
    { id: 6, nom: "Frisée des Pommiers", brasserie: "Côté Verger", style: "sour", styleLabel: "Sour", origine: "Bretagne", deg: "4,2°", format: "bouteille", note: "Acidulée, pomme, framboise.", prix: { "33cl": "5,80 €" }, details: { ibu: 6, ebc: 14, fermentation: "Mixte · macération sur fruits 3 semaines", accord: "Chèvres frais, salade de roquette, pavlova", histoire: "Macération sur framboises de Plougastel et jus de pommes du verger de la maison. Acidulée mais douce." } },
    { id: 7, nom: "Zerolope", brasserie: "Maison Bonneau", style: "sans", styleLabel: "Sans alcool", origine: "France", deg: "0,4°", format: "canette", note: "Houblonnée, fraîche, légère.", prix: { "33cl": "4,20 €" }, details: { histoire: "Désalcoolisation sous vide à basse température — ça préserve les arômes de houblon là où la pasteurisation les détruit." } },
    { id: 8, nom: "Trappiste S.-Bernard", brasserie: "Westvleteren 8", style: "brune", styleLabel: "Trappiste", origine: "Belgique", deg: "8,0°", format: "bouteille", note: "Fruits secs, complexe, longue.", prix: { "33cl": "6,80 €" }, details: { ibu: 24, ebc: 60, fermentation: "Haute · re-fermentation en bouteille", houblons: "Styrian Goldings · Hallertau", malts: "Pilsner · Caramunich · Spécial B · Candi sucre brun", service: "12–14°C · verre calice", garde: "Jusqu'à 10 ans en cave", accord: "Vieux gouda, civet de lapin, tiramisu", histoire: "Brassée par les moines depuis 1839. À servir tempérée — la sortir du frigo 15 minutes avant." } },
    { id: 9, nom: "Hazy Coast", brasserie: "Cap Houblon", style: "ipa", styleLabel: "NEIPA", origine: "Pays de la Loire", deg: "6,5°", format: "pression", coup: true, note: "Mangue, pêche, voilée.", prix: { "25cl": "4,20 €", "50cl": "7,80 €", "pichet": "21,00 €" }, details: { ibu: 38, ebc: 8, fermentation: "Haute · levure London III", houblons: "Galaxy · Nelson Sauvin · Mosaic (dry hop massif)", malts: "Pale Ale · Avoine flocon · Froment cru", service: "4–6°C · verre tulipe", garde: "À boire dans les 3 mois — le houblon s'efface vite", accord: "Burger poulet pané, tacos al pastor, fromages frais", histoire: "Dry-hop à 8 g/L — un des plus généreux de la région. Marc fait son houblonnage à 4h du matin pour préserver les huiles." } },
    { id: 10, nom: "Blonde de Plouër", brasserie: "Brasserie Bréhat", style: "blonde", styleLabel: "Blonde", origine: "Bretagne", deg: "4,8°", format: "pression", note: "Légère, miel, biscuit.", prix: { "25cl": "3,50 €", "50cl": "6,50 €", "pichet": "18,00 €" }, details: { histoire: "La bière du quotidien — celle qui se boit avec tout. Eau de source du granit breton." } },
    { id: 11, nom: "Reine d'Octobre", brasserie: "Brassin de Sèvre", style: "ambree", styleLabel: "Ambrée", origine: "Pays de la Loire", deg: "6,5°", format: "bouteille", note: "Caramel brûlé, automnale.", prix: { "33cl": "5,20 €", "75cl": "11,50 €" }, details: { ibu: 32, ebc: 38, malts: "Pale Ale · Munich · Caramel 120 · Black malt (en touche)", accord: "Plateau de charcuterie, gibier, mimolette", histoire: "Brassée une fois par an pour les fêtes d'octobre. Le format 75cl est numéroté à la main." } },
    { id: 12, nom: "Pilsner Bohème", brasserie: "Plzeň 1842", style: "blonde", styleLabel: "Pilsner", origine: "République Tchèque", deg: "4,4°", format: "pression", note: "Amère, herbacée, croquante.", prix: { "25cl": "3,80 €", "50cl": "7,00 €", "pichet": "19,50 €" }, details: { ibu: 35, ebc: 8, fermentation: "Basse · garde 6 semaines à 2°C", houblons: "Saaz (3 ajouts)", malts: "Pilsner tchèque (orge Moravian)", service: "4–6°C · verre droit", accord: "Saucisses, schnitzel, fromages doux", histoire: "Le style original, depuis 1842. À déguster en pression — la version embouteillée n'a pas la même mousse." } },
    { id: 13, nom: "Hefe de Bavière", brasserie: "Schneider Weisse", style: "blanche", styleLabel: "Weizen", origine: "Allemagne", deg: "5,4°", format: "bouteille", note: "Banane, clou de girofle.", prix: { "50cl": "6,80 €" }, details: { ibu: 14, ebc: 12, fermentation: "Haute · levure Weihenstephan", houblons: "Hallertau Tradition", malts: "Froment malté 60% · Pilsner", service: "5–7°C · verre Weizen haut", accord: "Brunch, saucisses blanches, bretzel", histoire: "Verser doucement, garder 2 cm au fond, faire tourner la bouteille pour décrocher la levure, puis verser le reste." } },
    { id: 14, nom: "Imperial Maris", brasserie: "Rade Atlantique", style: "brune", styleLabel: "Imp. Stout", origine: "Bretagne", deg: "10,0°", format: "canette", note: "Réglisse, vanille, costaud.", prix: { "33cl": "7,20 €" }, details: { ibu: 65, ebc: 110, malts: "Pale Ale · Maris Otter · Chocolat · Roasted · Avoine flocon · Black malt", service: "10–14°C · verre snifter", garde: "Jusqu'à 5 ans — évolue vers le porto", accord: "Brownie, fromages très affinés, fin de soirée", histoire: "Vieillie 3 mois en cuve avec gousses de vanille de Madagascar. Production limitée à 800 canettes par an." } },
    { id: 15, nom: "Goyave Wild", brasserie: "Côté Verger", style: "sour", styleLabel: "Berliner", origine: "Bretagne", deg: "3,5°", format: "canette", note: "Goyave, kéfir, acidulé.", prix: { "33cl": "5,80 €" }, details: { fermentation: "Mixte · kettle souring + ajout fruits", accord: "Ceviche, salades acidulées, sorbet", histoire: "Kettle-souring rapide (24h) puis ajout de purée de goyave rose au conditionnement. Très peu d'alcool, très peu d'amertume." } },
    { id: 16, nom: "London Pride Cask", brasserie: "Fuller's", style: "ambree", styleLabel: "Bitter", origine: "Royaume-Uni", deg: "4,7°", format: "pression", note: "Toffee, fruits secs, ronde.", prix: { "25cl": "3,90 €", "50cl": "7,20 €", "pichet": "20,00 €" }, details: { ibu: 30, ebc: 22, fermentation: "Haute · cask-conditioned (re-fermentation en fût)", houblons: "Target · Northdown · East Kent Goldings", service: "12–14°C · pinte impériale, pompe à main", accord: "Fish & chips, shepherd's pie, cheddar mûr", histoire: "Servie à la pompe à main, sans CO2 forcé — la mousse vient de la re-fermentation naturelle. Une cask = un fût = une semaine de service maxi." } },
    { id: 17, nom: "Saison du Comptoir", brasserie: "Atelier de Saint-Lyphard", style: "blonde", styleLabel: "Saison", origine: "Pays de la Loire", deg: "6,0°", format: "bouteille", coup: true, note: "Poivre, foin, festive.", prix: { "33cl": "5,50 €", "75cl": "12,00 €" }, details: { ibu: 28, ebc: 10, fermentation: "Haute · levure saison Dupont, fermentation à 32°C", houblons: "Styrian Goldings · poivre de Kampot en infusion", malts: "Pilsner · Froment · Épeautre", service: "6–8°C · verre tulipe", accord: "Volaille rôtie, fromages de chèvre, fruits de mer", histoire: "Notre exclusivité — recette mise au point avec Élise pour notre 1er anniversaire. Le poivre est ajouté en infusion à froid." } },
    { id: 18, nom: "West Coast '96", brasserie: "Stone & Co.", style: "ipa", styleLabel: "IPA", origine: "USA", deg: "7,4°", format: "canette", note: "Pamplemousse, pin, amère.", prix: { "33cl": "6,20 €" }, details: { ibu: 75, ebc: 14, houblons: "Simcoe · Centennial · Chinook", malts: "Pale Ale · Caramel 40", accord: "Burgers épicés, chili, blue cheese", histoire: "Style West Coast nineties — amertume franche, malt sec, pas de jus de fruit. La résine de pin qui t'arrache la mâchoire." } },
    { id: 19, nom: "Tripel d'Abbaye", brasserie: "Saint-Feuillien", style: "blonde", styleLabel: "Tripel", origine: "Belgique", deg: "8,5°", format: "bouteille", note: "Miel, agrumes, charpentée.", prix: { "33cl": "5,80 €" }, details: { ibu: 26, ebc: 12, fermentation: "Haute · re-fermentation en bouteille", houblons: "Hallertau · Styrian Goldings", malts: "Pilsner · Candi sucre clair", service: "8–10°C · verre calice", garde: "5 ans en cave", accord: "Volaille, brie, tarte aux fruits", histoire: "Tradition d'abbaye depuis 1873. Le sucre candi rend la bière sèche et puissante, sans lourdeur." } },
    { id: 20, nom: "Nona Pale", brasserie: "Maison Bonneau", style: "sans", styleLabel: "Sans alcool", origine: "France", deg: "0,5°", format: "canette", note: "Pamplemousse, légère, sèche.", prix: { "33cl": "4,50 €" }, details: { ibu: 30, houblons: "Citra · Amarillo (dry hop)", accord: "Le repas du midi quand on bosse l'aprèm", histoire: "Profil pale ale classique mais sans la gueule de bois. Distillation sous vide pour garder les arômes." } },
  ],

  evenementsAvenir: [
    { id: 1, jour: 14, mois: "Mai", moisFull: "Mai 2026", titre: "Soirée brasseur · Mélusine", tag: "Dégustation", heure: "19h30", desc: "Rencontre avec Tom de la brasserie Mélusine, 4 bières en dégustation accompagnée." },
    { id: 2, jour: 22, mois: "Mai", moisFull: "Mai 2026", titre: "Vinyles & vins natures", tag: "Soirée", heure: "20h", desc: "Aldo en sélection 100% vinyle pendant qu'on débouche 6 quilles vivantes." },
    { id: 3, jour: 28, mois: "Mai", moisFull: "Mai 2026", titre: "Apéro Quizz du jeudi", tag: "Quizz", heure: "19h", desc: "Catégories sportives & culture générale — par équipes de 4. Inscription au comptoir." },
    { id: 4, jour: 6, mois: "Juin", moisFull: "Juin 2026", titre: "Concert · Trio Saumâtre", tag: "Concert", heure: "21h", desc: "Trio bocage-blues, sans micro, dans la cour. Chapeau à la fin." },
    { id: 5, jour: 14, mois: "Juin", moisFull: "Juin 2026", titre: "Fête de la bière artisanale", tag: "Festival", heure: "12h – 23h", desc: "8 brasseurs invités, foodtruck, programmation musique toute la journée." },
    { id: 6, jour: 21, mois: "Juin", moisFull: "Juin 2026", titre: "Fête de la musique", tag: "Concert", heure: "18h", desc: "Plateau ouvert — 4 groupes locaux, terrasse étendue, on ferme tard." },
  ],

  menuSemaine: {
    semaine: "Semaine du 11 au 16 mai",
    entrees: [
      { nom: "Velouté de petits pois, menthe", prix: "7 €" },
      { nom: "Œuf parfait, lard fumé, croûton aillé", prix: "8 €" },
    ],
    plats: [
      { nom: "Pièce du boucher, frites maison", desc: "★ la pièce du boucher · sauce au choix", prix: "18 €" },
      { nom: "Maquereau grillé, sauce vierge", desc: "frites de patate douce", prix: "15 €" },
      { nom: "Risotto aux champignons", desc: "végétarien · parmesan râpé minute", prix: "14 €" },
    ],
    desserts: [
      { nom: "Île flottante, pralin", prix: "6 €" },
      { nom: "Crème caramel beurre salé", prix: "6 €" },
      { nom: "Mousse au chocolat noir", prix: "6 €" },
      { nom: "Fromage blanc & coulis maison", prix: "6 €" },
      { nom: "Café gourmand", prix: "7 €" },
    ],
    dessertDuJour: { nom: "Tarte fine aux pommes, glace vanille", prix: "7 €" },
    formules: [
      { nom: "Entrée + Plat", prix: "19 €" },
      { nom: "Plat + Dessert", prix: "19 €" },
      { nom: "Le complet", prix: "23 €" },
    ],
    accord: { nom: "Blonde de Plouër", desc: "se boit avec tout, surtout avec la pièce du boucher" },
  },

  tireuse: {
    pitch: "La tireuse est gratuite. Tu paies uniquement les fûts que tu choisis dans notre sélection. On prépare le matos, tu passes le récupérer.",
    retrait: "À retirer chez nous · pas de livraison",
    caution: "200 € (rendus à la reprise du matériel propre et entier)",
  },

  forfaits: [
    { id: "weekend", nom: "Week-end", kicker: "vendredi → dimanche", base: "Gratuit", desc: "La tireuse 2 becs pour le week-end. Tu choisis tes fûts, on prépare tout.", inclus: ["Tireuse pro 2 becs", "Bac à glace + détendeurs", "Notice & briefing", "30 gobelets réutilisables", "Caution 200 €"], featured: false, addon: "Tu paies uniquement les fûts" },
    { id: "semaine", nom: "Semaine", kicker: "5 à 7 jours", base: "Gratuit", desc: "Pour les soirées qui s'étalent ou les semaines de mariage. Le best-seller.", inclus: ["Tireuse pro 2 becs", "Bac à glace + détendeurs", "Notice & briefing", "50 gobelets réutilisables", "1 changement de fût offert", "Caution 200 €"], featured: true, addon: "Tu paies uniquement les fûts" },
    { id: "evenement", nom: "Événement", kicker: "+ de 100 personnes", base: "sur devis", desc: "Mariage, festival, kermesse : on adapte le matos et la sélection bières.", inclus: ["Tireuse pro 2 becs haute capacité", "Bac à glace renforcé", "200 gobelets réutilisables", "Brief sur place", "Liste fûts personnalisée", "Caution selon volume"], featured: false, addon: "Fûts + prestation sur devis" },
  ],

  futsDisponibles: [
    { nom: "Blonde de Plouër", vol: "20L", style: "Blonde", prix: "115 €", brasserie: "Brasserie Bréhat" },
    { nom: "Blonde des Vignes", vol: "20L", style: "Blonde", prix: "125 €", brasserie: "Atelier de Saint-Lyphard" },
    { nom: "Pilsner Bohème", vol: "20L", style: "Pilsner", prix: "135 €", brasserie: "Plzeň 1842" },
    { nom: "La Houblonnée", vol: "20L", style: "IPA", prix: "145 €", brasserie: "Brasserie de la Croix" },
    { nom: "Hazy Coast", vol: "20L", style: "NEIPA", prix: "155 €", brasserie: "Cap Houblon" },
    { nom: "Pierre des Champs", vol: "20L", style: "Ambrée", prix: "125 €", brasserie: "Mélusine" },
    { nom: "Blanche Marine", vol: "20L", style: "Blanche", prix: "125 €", brasserie: "L'Embrunée" },
    { nom: "Stout du Nord", vol: "20L", style: "Stout", prix: "145 €", brasserie: "Brasserie Rade" },
    { nom: "Zerolope (sans alc.)", vol: "20L", style: "Sans alc.", prix: "95 €", brasserie: "Maison Bonneau" },
    { nom: "Blonde de Plouër", vol: "30L", style: "Blonde", prix: "165 €", brasserie: "Brasserie Bréhat" },
    { nom: "La Houblonnée", vol: "30L", style: "IPA", prix: "195 €", brasserie: "Brasserie de la Croix" },
    { nom: "Pierre des Champs", vol: "30L", style: "Ambrée", prix: "175 €", brasserie: "Mélusine" },
  ],

  etapes: [
    { num: 1, titre: "Tu choisis tes fûts", desc: "Blonde, IPA, ambrée, brune, blanche, sans alcool. On t'envoie la liste à jour à ta date." },
    { num: 2, titre: "On prépare le matos", desc: "Tireuse, détendeurs, glace. Tout est prêt 24h avant l'événement." },
    { num: 3, titre: "Tu passes récupérer", desc: "Retrait sur place pendant nos horaires d'ouverture. Briefing rapide pour l'installation chez toi." },
    { num: 4, titre: "Tu ramènes le matériel", desc: "Reprise sous 48h après l'événement. Les fûts entamés non finis ne sont pas remboursés." },
  ],

  photos: {},
  coords: { lat: 46.9903291, lng: -0.9461340 },
  boissons: [],
};

// ---- Helpers ----

export function primaryPrice(b: Beer): { vol: string; price: string } {
  const order = ["25cl", "33cl", "50cl", "75cl", "pichet"];
  for (const k of order) if (b.prix[k]) return { vol: k, price: b.prix[k] };
  const k = Object.keys(b.prix)[0];
  return { vol: k, price: b.prix[k] };
}

export function allPrices(b: Beer): Array<{ vol: string; price: string }> {
  const order = ["25cl", "33cl", "50cl", "75cl", "pichet"];
  return order.filter((k) => b.prix[k]).map((k) => ({ vol: k, price: b.prix[k] }));
}

export function formatLabel(f: Format): string {
  return f === "pression" ? "Pression" : f === "canette" ? "Canette" : "Bouteille";
}

export function beerDetails(b: Beer, data: SiteData): BeerDetails {
  const styleDefaults = data.detailsParStyle[b.style] || {};
  return { ...styleDefaults, ...(b.details || {}) };
}

export function ibuLevel(ibu: number | undefined): number | null {
  if (ibu == null) return null;
  return Math.max(0, Math.min(100, Math.round((ibu / 80) * 100)));
}

export function telHref(tel: string): string {
  return tel.replace(/\s/g, "");
}

export function ebcColor(ebc: number | undefined): string {
  if (ebc == null) return "#E8B14A";
  if (ebc < 6) return "#F4DA92";
  if (ebc < 10) return "#EBC471";
  if (ebc < 16) return "#E2A845";
  if (ebc < 26) return "#C58737";
  if (ebc < 40) return "#9B6029";
  if (ebc < 60) return "#6E3F1B";
  if (ebc < 90) return "#3F2511";
  return "#1E1208";
}
