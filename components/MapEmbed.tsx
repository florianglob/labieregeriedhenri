"use client";

interface Props {
  lat: number;
  lng: number;
  adresse: string;
  nom: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MapEmbed({ lat, lng, className, style }: Props) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <iframe
      src={src}
      className={className}
      style={{ height: "100%", width: "100%", borderRadius: "inherit", border: 0, ...style }}
      loading="lazy"
      allowFullScreen
    />
  );
}
