import type { PublicFullSiteResponse } from "../services/publicSiteService";

export type SiteData = PublicFullSiteResponse;

export type FloatingHeart = {
  id: number;
  top: string;
  left: string;
  collected: boolean;
};

export type ProposalSignature = {
  title: string;
  message: string;
  askedBy: string;
  acceptedBy: string;
  acceptedAt: string;
};

export type UnavailablePageProps = {
  status: string;
};

export type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};