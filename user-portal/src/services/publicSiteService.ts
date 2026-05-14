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
  id?: string;
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

type RawPublicFinalSurprise = Omit<PublicFinalSurprise, "active"> & {
  active?: boolean | string | number | null;
};

type RawPublicFullSiteResponse = Omit<
  PublicFullSiteResponse,
  "finalSurprise"
> & {
  finalSurprise?: RawPublicFinalSurprise | null;
};

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}

function normalizeFinalSurprise(
  finalSurprise?: RawPublicFinalSurprise | null
): PublicFinalSurprise | null {
  if (!finalSurprise) {
    return null;
  }

  return {
    id: finalSurprise.id,
    mediaObjectId: finalSurprise.mediaObjectId ?? null,
    title: finalSurprise.title || "Are you ready for your final surprise?",
    message: finalSurprise.message || "The best is yet to come...",
    buttonText: finalSurprise.buttonText || "Reveal Final Surprise",
    active: normalizeBoolean(finalSurprise.active),
    imageUrl: finalSurprise.imageUrl ?? null,
    updatedAt: finalSurprise.updatedAt,
  };
}

export async function getPublicFullSite(): Promise<PublicFullSiteResponse> {
  const url = `${normalizeBaseUrl(
    API_BASE_URL
  )}/api/public/site/${SITE_KEY}/full`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

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

  const data = (await response.json()) as RawPublicFullSiteResponse;

  const normalizedData: PublicFullSiteResponse = {
    ...data,
    memories: [...(data.memories ?? [])].sort(sortBySortOrderAndDate),
    gallery: [...(data.gallery ?? [])].sort(sortBySortOrderAndDate),
    finalSurprise: normalizeFinalSurprise(data.finalSurprise),
  };

  console.log("PUBLIC FULL SITE DATA", normalizedData);
  console.log("PUBLIC FINAL SURPRISE", normalizedData.finalSurprise);
  console.log(
    "PUBLIC FINAL SURPRISE ACTIVE",
    normalizedData.finalSurprise?.active
  );

  return normalizedData;
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