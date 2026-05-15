"use client";

import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

export default function MapEmbedClient(props: React.ComponentProps<typeof MapEmbed>) {
  return <MapEmbed {...props} />;
}
