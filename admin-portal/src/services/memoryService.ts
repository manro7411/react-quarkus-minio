import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type MemoryItem = {
  id: string;
  mediaObjectId?: string | null;
  title: string;
  description: string;
  memoryDate: string;
  visible: boolean;
  sortOrder: number;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateMemoryRequest = {
  mediaObjectId?: string | null;
  title: string;
  description?: string;
  memoryDate?: string;
  visible?: boolean;
  sortOrder?: number;
};

export type UpdateMemoryRequest = Partial<CreateMemoryRequest>;

export function getMemories() {
  return apiClient<MemoryItem[]>(API_ENDPOINTS.memories.list, {
    auth: false,
    retryOnUnauthorized: false,
  });
}

export function createMemory(payload: CreateMemoryRequest) {
  return apiClient<MemoryItem>(API_ENDPOINTS.memories.list, {
    method: "POST",
    auth: false,
    retryOnUnauthorized: false,
    body: JSON.stringify(payload),
  });
}

export function updateMemory(id: string, payload: UpdateMemoryRequest) {
  return apiClient<MemoryItem>(API_ENDPOINTS.memories.detail(id), {
    method: "PUT",
    auth: false,
    retryOnUnauthorized: false,
    body: JSON.stringify(payload),
  });
}

export function deleteMemory(id: string) {
  return apiClient<void>(API_ENDPOINTS.memories.detail(id), {
    method: "DELETE",
    auth: false,
    retryOnUnauthorized: false,
  });
}