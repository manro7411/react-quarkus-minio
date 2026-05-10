import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./authStorage";

type RequestOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthStorage();
    throw new Error("Session expired");
  }

  const data = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  saveTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, retryOnUnauthorized = true, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  const isFormData = rest.body instanceof FormData;

  if (!requestHeaders.has("Content-Type") && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const accessToken = getAccessToken();

    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const newAccessToken = await refreshAccessToken();

    requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
    });
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}