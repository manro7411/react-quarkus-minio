import { useState } from "react";
import UnlockHeartMiniGameModal from "./UnlockHeartMiniGameModal";
type FinalSurpriseSectionProps = {
  title: string;
  message: string;
  buttonText?: string;
  imageUrl?: string;
};

export default function FinalSurpriseSection({
  title,
  message,
  buttonText = "Reveal Final Surprise",
  imageUrl,
}: FinalSurpriseSectionProps) {
  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <>
      <section className="final-surprise-section" id="surprise">
        <div className="final-surprise-copy">
          <h2>{title}</h2>
          <p>{message}</p>

          <button
            type="button"
            className="primary-romantic-button"
            onClick={() => setMiniGameOpen(true)}
          >
            {buttonText}
          </button>

          {isUnlocked && (
            <div className="final-surprise-success">
              <span>💖</span>
              <p>Mini game completed! Final surprise unlocked.</p>
            </div>
          )}
        </div>

        <div className="final-surprise-visual">
          {imageUrl ? (
            <img src={imageUrl} alt="Final Surprise" />
          ) : (
            <div className="final-surprise-fallback-gift">🎁</div>
          )}
        </div>
      </section>

      <UnlockHeartMiniGameModal
        open={miniGameOpen}
        onClose={() => setMiniGameOpen(false)}
        onUnlocked={() => setIsUnlocked(true)}
      />
    </>
  );
}