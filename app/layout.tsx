import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Bièregerie d'Henri · Bières, Vins & Afterworks",
  description:
    "Bar à bières, cave-épicerie fine et afterworks. Carte renouvelée, menu de la semaine, location de tireuse 2 becs et événements. Mortagne-sur-Sèvre.",
  openGraph: {
    title: "La Bièregerie d'Henri",
    description: "Bières, Vins & Afterworks — Mortagne-sur-Sèvre",
    type: "website",
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
