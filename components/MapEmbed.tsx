"use client";

interface Props {
  lat: number;
  lng: number;
  adresse: string;
  nom: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MapEmbed({ lat, lng, adresse, nom, className, style }: Props) {
  const q = encodeURIComponent(`${adresse}`);
  const src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div className={className} style={{ position: "relative", height: "100%", width: "100%", borderRadius: "inherit", overflow: "hidden", ...style }}>
      <iframe
        src={src}
        style={{ height: "100%", width: "100%", border: 0 }}
        loading="lazy"
        allowFullScreen
        title={`Localisation ${nom}`}
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute", bottom: 12, right: 12,
          background: "var(--brun-dark)", color: "var(--dore)",
          padding: "8px 14px", borderRadius: "var(--radius-pill)",
          fontSize: 13, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Ouvrir dans Maps →
      </a>
    </div>
  );
}
