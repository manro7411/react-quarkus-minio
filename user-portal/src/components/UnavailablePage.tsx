import type { UnavailablePageProps } from "../types/site";

export default function UnavailablePage({ status }: UnavailablePageProps) {
  const isMaintenance = status === "MAINTENANCE";

  return (
    <div className="unavailable-page-only">
      <div className="unavailable-card-only">
        <div className="unavailable-icon-only">
          {isMaintenance ? "🛠" : "🔒"}
        </div>

        <p className="unavailable-eyebrow-only">
          {isMaintenance ? "Temporarily unavailable" : "Website unavailable"}
        </p>

        <h1>
          {isMaintenance
            ? "We’re updating something special"
            : "This page is unavailable"}
        </h1>

        <p>
          {isMaintenance
            ? "This love story is getting a little update. Please come back again soon."
            : "This website is currently closed. Please come back again later."}
        </p>

        <div className="unavailable-hearts-only">
          <span>♡</span>
          <span>♡</span>
          <span>♡</span>
        </div>
      </div>
    </div>
  );
}