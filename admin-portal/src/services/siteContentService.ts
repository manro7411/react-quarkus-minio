import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./apiClient";

export type HeroSection = {
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  active: boolean;
};

export type HeroUpdateRequest = {
  mediaObjectId?: string;
  headline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  active?: boolean;
};

export type CountdownSection = {
  title: string;
  targetDatetime: string;
  active: boolean;
};

export type CountdownUpdateRequest = {
  title?: string;
  targetDatetime?: string;
  active?: boolean;
};

export type LoveLetterSection = {
  title: string;
  body: string;
  signature: string;
  active: boolean;
};

export type LoveLetterUpdateRequest = {
  title?: string;
  body?: string;
  signature?: string;
  active?: boolean;
};

export type FinalSurpriseSection = {
  title: string;
  message: string;
  buttonText: string;
  imageUrl?: string;
  active: boolean;
};

export type FinalSurpriseUpdateRequest = {
  mediaObjectId?: string;
  title?: string;
  message?: string;
  buttonText?: string;
  active?: boolean;
};

const NO_AUTH_OPTIONS = {
  auth: false,
  retryOnUnauthorized: false,
};

export function getHero() {
  return apiClient<HeroSection>(API_ENDPOINTS.hero.get, NO_AUTH_OPTIONS);
}

export function updateHero(payload: HeroUpdateRequest) {
  return apiClient<HeroSection>(API_ENDPOINTS.hero.update, {
    ...NO_AUTH_OPTIONS,
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getCountdown() {
  return apiClient<CountdownSection>(
    API_ENDPOINTS.countdown.get,
    NO_AUTH_OPTIONS
  );
}

export function updateCountdown(payload: CountdownUpdateRequest) {
  return apiClient<CountdownSection>(API_ENDPOINTS.countdown.update, {
    ...NO_AUTH_OPTIONS,
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getLoveLetter() {
  return apiClient<LoveLetterSection>(
    API_ENDPOINTS.loveLetter.get,
    NO_AUTH_OPTIONS
  );
}

export function updateLoveLetter(payload: LoveLetterUpdateRequest) {
  return apiClient<LoveLetterSection>(API_ENDPOINTS.loveLetter.update, {
    ...NO_AUTH_OPTIONS,
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getFinalSurprise() {
  return apiClient<FinalSurpriseSection>(
    API_ENDPOINTS.finalSurprise.get,
    NO_AUTH_OPTIONS
  );
}

export function updateFinalSurprise(payload: FinalSurpriseUpdateRequest) {
  return apiClient<FinalSurpriseSection>(API_ENDPOINTS.finalSurprise.update, {
    ...NO_AUTH_OPTIONS,
    method: "PUT",
    body: JSON.stringify(payload),
  });
}