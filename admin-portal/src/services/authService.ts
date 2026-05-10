import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";
import {
  clearAuthStorage,
  getRefreshToken,
  saveAdminProfile,
  saveTokens,
} from "./authStorage";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  displayName: string;
  role: string;
};

export async function loginAdmin(payload: LoginRequest) {
  const response = await apiClient<LoginResponse>(API_ENDPOINTS.auth.login, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });

  saveTokens(response.accessToken, response.refreshToken);
  saveAdminProfile({
    displayName: response.displayName,
    role: response.role,
  });

  return response;
}

export async function logoutAdmin() {
  const refreshToken = getRefreshToken();

  clearAuthStorage();

  if (!refreshToken) {
    return;
  }

  apiClient<void>(API_ENDPOINTS.auth.logout, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  }).catch((error) => {
    console.warn("Logout request failed:", error);
  });
}