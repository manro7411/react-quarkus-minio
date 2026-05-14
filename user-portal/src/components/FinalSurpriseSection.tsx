import type { PublicFullSiteResponse } from "../services/publicSiteService";

type FinalSurpriseSectionProps = {
  finalSurprise: PublicFullSiteResponse["finalSurprise"];
  finalUnlocked: boolean;
  onOpenMiniGame: () => void;
};

export default function FinalSurpriseSection({
  finalSurprise,
  finalUnlocked,
  onOpenMiniGame,
}: FinalSurpriseSectionProps) {
  const isFinalSurpriseActive = finalSurprise?.active ?? false;

  return (
    <section
      id="surprise"
      className={`final-section ${
        isFinalSurpriseActive ? "active" : "inactive"
      }`}
      style={
        finalSurprise?.imageUrl
          ? {
              backgroundImage: `linear-gradient(rgba(255, 240, 247, 0.84), rgba(255, 228, 239, 0.9)), url(${finalSurprise.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div>
        <h2>
          {finalSurprise?.title || "Are you ready for your final surprise?"}
        </h2>

        <p>{finalSurprise?.message || "The best is yet to come..."}</p>

        <button
          className="primary-button"
          type="button"
          onClick={onOpenMiniGame}
          disabled={!isFinalSurpriseActive}
        >
          {!isFinalSurpriseActive
            ? "Final Surprise is closed 🔒"
            : finalUnlocked
              ? "Open Final Surprise Again 💖"
              : finalSurprise?.buttonText || "Reveal Final Surprise 🎁"}
        </button>

        {!isFinalSurpriseActive && (
          <div className="final-unlocked-note">
            <span>🔒</span>
            <p>Final Surprise is currently closed.</p>
          </div>
        )}

        {isFinalSurpriseActive && finalUnlocked && (
          <div className="final-unlocked-note">
            <span>💖</span>
            <p>Your final surprise has been unlocked.</p>
          </div>
        )}
      </div>

      <div className="mini-gift">
        <div className="mini-gift-box"></div>
        <div className="mini-gift-lid"></div>
        <div className="mini-ribbon-x"></div>
        <div className="mini-ribbon-y"></div>
      </div>
    </section>
  );
}