import type { PublicFullSiteResponse } from "../services/publicSiteService";

type LetterSectionProps = {
  loveLetter: PublicFullSiteResponse["loveLetter"];
  onOpen: () => void;
};

export default function LetterSection({
  loveLetter,
  onOpen,
}: LetterSectionProps) {
  return (
    <section id="story" className="letter-section">
      <div className="envelope">
        <div className="envelope-flap"></div>
        <div className="envelope-heart">♥</div>
      </div>

      <div className="letter-card">
        <h2>A Letter For You ♡</h2>

        <p className="script">{loveLetter?.title || "My Dearest Love,"}</p>

        <p>
          {loveLetter?.body ||
            "From the moment we met, my world became brighter. You are my today and all of my tomorrows."}
        </p>

        <p className="signature">
          {loveLetter?.signature || "Forever yours, ♡"}
        </p>

        <button className="primary-button small" type="button" onClick={onOpen}>
          Read My Letter ✉
        </button>
      </div>
    </section>
  );
}