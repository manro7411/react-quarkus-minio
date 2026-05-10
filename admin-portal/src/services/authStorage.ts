const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const ADMIN_PROFILE_KEY = "admin_profile";

export type AdminProfile = {
  displayName: string;
  role: string;
};

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function saveAdminProfile(profile: AdminProfile) {
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAdminProfile(): AdminProfile | null {
  const raw = localStorage.getItem(ADMIN_PROFILE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminProfile;
  } catch {
    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PROFILE_KEY);
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}