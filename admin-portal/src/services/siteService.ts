import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type AdminSiteResponse = {
  id: string;
  siteKey: string;
  title: string;
  subtitle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminSiteUpdateRequest = {
  title?: string;
  subtitle?: string;
  status?: string;
};

export function getAdminSite() {
  return apiClient<AdminSiteResponse>(API_ENDPOINTS.site.get, {
    auth: false,
  });
}

export function updateAdminSite(payload: AdminSiteUpdateRequest) {
  return apiClient<AdminSiteResponse>(API_ENDPOINTS.site.update, {
    method: "PUT",
    auth: false,
    body: JSON.stringify(payload),
  });
}