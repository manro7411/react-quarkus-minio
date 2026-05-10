export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  auth: {
    register: "/api/admin/auth/register",
    login: "/api/admin/auth/login",
    refresh: "/api/admin/auth/refresh",
    logout: "/api/admin/auth/logout",
  },

  dashboard: {
    stats: "/api/admin/dashboard/stats",
  },

  site: {
    get: "/api/admin/site",
    update: "/api/admin/site",
  },

  media: {
    upload: "/api/admin/media/upload",
    list: "/api/admin/media",
    detail: (id: string) => `/api/admin/media/${id}`,
    delete: (id: string) => `/api/admin/media/${id}`,
  },

  gallery: {
    photos: "/api/admin/gallery/photos",
    photo: (id: string) => `/api/admin/gallery/photos/${id}`,
  },

  memories: {
    list: "/api/admin/memories",
    detail: (id: string) => `/api/admin/memories/${id}`,
  },

  hero: {
    get: "/api/admin/hero",
    update: "/api/admin/hero",
  },

  countdown: {
    get: "/api/admin/countdown",
    update: "/api/admin/countdown",
  },

  loveLetter: {
    get: "/api/admin/love-letter",
    update: "/api/admin/love-letter",
  },

  finalSurprise: {
    get: "/api/admin/final-surprise",
    update: "/api/admin/final-surprise",
  },

  allowedIps: {
    list: "/api/admin/allowed-ips",
    create: "/api/admin/allowed-ips",
    detail: (id: string) => `/api/admin/allowed-ips/${id}`,
    update: (id: string) => `/api/admin/allowed-ips/${id}`,
    delete: (id: string) => `/api/admin/allowed-ips/${id}`,
  },

  publicSite: {
    get: (siteKey = "panpan") => `/api/public/site/${siteKey}`,
    full: (siteKey = "panpan") => `/api/public/site/${siteKey}/full`,
    hero: (siteKey = "panpan") => `/api/public/site/${siteKey}/hero`,
    countdown: (siteKey = "panpan") =>
      `/api/public/site/${siteKey}/countdown`,
    memories: (siteKey = "panpan") =>
      `/api/public/site/${siteKey}/memories`,
    gallery: (siteKey = "panpan") => `/api/public/site/${siteKey}/gallery`,
    loveLetter: (siteKey = "panpan") =>
      `/api/public/site/${siteKey}/love-letter`,
    finalSurprise: (siteKey = "panpan") =>
      `/api/public/site/${siteKey}/final-surprise`,
  },
};