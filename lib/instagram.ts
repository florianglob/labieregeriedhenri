export interface InstaPost {
  id: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
}

export async function fetchInstagramPosts(limit = 6): Promise<InstaPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type,timestamp&limit=${limit}&access_token=${token}`,
      { next: { revalidate: 3600 } } // re-fetch toutes les heures
    );
    if (!res.ok) return [];
    const json = await res.json();
    // Garder uniquement les images (pas les vidéos sans thumbnail exploitable)
    return (json.data as InstaPost[]).filter(
      (p) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM"
    );
  } catch {
    return [];
  }
}
