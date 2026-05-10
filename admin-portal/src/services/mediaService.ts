import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type MediaObject = {
  id: string;
  bucketName: string;
  objectKey: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  visibility: string;
  imageUrl: string;
  createdAt: string;
};

export type MediaUploadResponse = {
  mediaObjectId: string;
  bucketName: string;
  objectKey: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  imageUrl: string;
};

export async function uploadMedia(
  file: File,
  folder = "user-portal/gallery"
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  return apiClient<MediaUploadResponse>(API_ENDPOINTS.media.upload, {
    method: "POST",
    auth: false, // ชั่วคราว ถ้ายังปิด auth filter อยู่
    body: formData,
  });
}

export async function getMediaObjects() {
  return apiClient<MediaObject[]>(API_ENDPOINTS.media.list, {
    auth: false,
  });
}

export async function getMediaObject(id: string) {
  return apiClient<MediaObject>(API_ENDPOINTS.media.detail(id), {
    auth: false,
  });
}

export async function deleteMediaObject(id: string) {
  return apiClient<void>(API_ENDPOINTS.media.delete(id), {
    method: "DELETE",
    auth: false,
  });
}