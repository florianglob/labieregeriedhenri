import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://labieregeriedhenri.fr"),
  title: "La Bièregerie d'Henri · Bières, Vins & Afterworks",
  description:
    "Bar à bières, cave-épicerie fine et afterworks. Carte renouvelée, menu de la semaine, location de tireuse 2 becs et événements. Mortagne-sur-Sèvre.",
  openGraph: {
    title: "La Bièregerie d'Henri",
    description: "Bières, Vins & Afterworks — Mortagne-sur-Sèvre",
    type: "website",
    url: "https://labieregeriedhenri.fr",
    images: [
      {
        url: "/assets/logo.png",
        width: 512,
        height: 512,
        alt: "La Bièregerie d'Henri",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "La Bièregerie d'Henri",
    description: "Bières, Vins & Afterworks — Mortagne-sur-Sèvre",
    images: ["/assets/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
