const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const SITE_KEY = import.meta.env.VITE_SITE_KEY || "panpan";

export type SiteStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE" | string;

export type PublicSite = {
  siteKey: string;
  title: string;
  subtitle: string;
  status: SiteStatus;
};

export type PublicHero = {
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string | null;
};

export type PublicCountdown = {
  title: string;
  targetDatetime: string;
};

export type PublicMemory = {
  id: string;
  title: string;
  description: string;
  memoryDate: string;
  imageUrl?: string | null;
  sortOrder: number;
};

export type PublicGalleryPhoto = {
  id: string;
  caption: string;
  photoDate: string;
  imageUrl: string;
  favorite: boolean;
  sortOrder: number;
};

export type PublicLoveLetter = {
  title: string;
  body: string;
  signature: string;
};

export type PublicFinalSurprise = {
  id: string;
  mediaObjectId?: string | null;
  title: string;
  message: string;
  buttonText: string;
  active: boolean;
  imageUrl?: string | null;
  updatedAt?: string;
};

export type PublicFullSiteResponse = {
  site: PublicSite;
  hero: PublicHero | null;
  countdown: PublicCountdown | null;
  memories: PublicMemory[];
  gallery: PublicGalleryPhoto[];
  loveLetter: PublicLoveLetter | null;
  finalSurprise: PublicFinalSurprise | null;
};

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export async function getPublicFullSite() {
  const response = await fetch(
    `${normalizeBaseUrl(API_BASE_URL)}/api/public/site/${SITE_KEY}/full`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    let message = `Failed to load public site: ${response.status}`;

    try {
      const error = await response.json();
      message = error.message || error.error || message;
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  const data = (await response.json()) as PublicFullSiteResponse;

  return {
    ...data,
    memories: [...(data.memories ?? [])].sort(sortBySortOrderAndDate),
    gallery: [...(data.gallery ?? [])].sort(sortBySortOrderAndDate),
  };
}

function sortBySortOrderAndDate<
  T extends {
    sortOrder?: number;
    memoryDate?: string;
    photoDate?: string;
  }
>(a: T, b: T) {
  const sortA = a.sortOrder ?? 0;
  const sortB = b.sortOrder ?? 0;

  if (sortA !== sortB) {
    return sortA - sortB;
  }

  const dateA = a.memoryDate || a.photoDate || "";
  const dateB = b.memoryDate || b.photoDate || "";

  return new Date(dateB).getTime() - new Date(dateA).getTime();
}