import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type GalleryPhoto = {
  id: string;
  mediaObjectId: string;
  caption: string;
  photoDate: string;
  favorite: boolean;
  hidden: boolean;
  sortOrder: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateGalleryPhotoRequest = {
  mediaObjectId: string;
  caption?: string;
  photoDate?: string;
  favorite?: boolean;
  hidden?: boolean;
  sortOrder?: number;
};

export type UpdateGalleryPhotoRequest = {
  mediaObjectId?: string;
  caption?: string;
  photoDate?: string;
  favorite?: boolean;
  hidden?: boolean;
  sortOrder?: number;
};

const DEV_NO_AUTH = true;

export async function getGalleryPhotos() {
  return apiClient<GalleryPhoto[]>(API_ENDPOINTS.gallery.photos, {
    auth: !DEV_NO_AUTH,
    retryOnUnauthorized: false,
  });
}

export async function createGalleryPhoto(payload: CreateGalleryPhotoRequest) {
  return apiClient<GalleryPhoto>(API_ENDPOINTS.gallery.photos, {
    method: "POST",
    auth: !DEV_NO_AUTH,
    retryOnUnauthorized: false,
    body: JSON.stringify(payload),
  });
}

export async function updateGalleryPhoto(
  id: string,
  payload: UpdateGalleryPhotoRequest
) {
  return apiClient<GalleryPhoto>(API_ENDPOINTS.gallery.photo(id), {
    method: "PUT",
    auth: !DEV_NO_AUTH,
    retryOnUnauthorized: false,
    body: JSON.stringify(payload),
  });
}

export async function deleteGalleryPhoto(id: string) {
  return apiClient<void>(API_ENDPOINTS.gallery.photo(id), {
    method: "DELETE",
    auth: !DEV_NO_AUTH,
    retryOnUnauthorized: false,
  });
}