import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type DashboardStatsResponse = {
  totalMemories: number;
  totalPhotos: number;
  favoritePhotos: number;
  hiddenPhotos: number;
  countdownActive: boolean;
  finalSurpriseActive: boolean;
  lastUpdated: string;
};

export async function getDashboardStats() {
  return apiClient<DashboardStatsResponse>(API_ENDPOINTS.dashboard.stats, {
    auth: false, // ใช้ชั่วคราว ถ้ายังปิด auth filter อยู่
  });
}