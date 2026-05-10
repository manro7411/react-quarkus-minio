const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const SITE_KEY = import.meta.env.VITE_SITE_KEY || "panpan";

export type PublicFullSiteResponse = {
  site: {
    siteKey: string;
    title: string;
    subtitle: string;
    status: string;
  };

  hero: {
    headline: string;
    subtitle: string;
    ctaText: string;
    ctaUrl: string;
    imageUrl?: string;
  } | null;

  countdown: {
    title: string;
    targetDatetime: string;
  } | null;

  memories: Array<{
    id: string;
    title: string;
    description: string;
    memoryDate: string;
    imageUrl?: string;
    sortOrder: number;
  }>;

  gallery: Array<{
    id: string;
    caption: string;
    photoDate: string;
    imageUrl: string;
    favorite: boolean;
    sortOrder: number;
  }>;

  loveLetter: {
    title: string;
    body: string;
    signature: string;
  } | null;

  finalSurprise: {
    title: string;
    message: string;
    buttonText: string;
    imageUrl?: string;
  } | null;
};

export async function getPublicFullSite() {
  const response = await fetch(
    `${API_BASE_URL}/api/public/site/${SITE_KEY}/full`
  );

  if (!response.ok) {
    throw new Error(`Failed to load public site: ${response.status}`);
  }

  return response.json() as Promise<PublicFullSiteResponse>;
}