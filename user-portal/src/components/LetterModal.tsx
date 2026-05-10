import type { PublicFullSiteResponse } from "../services/publicSiteService";

type LetterModalProps = {
  loveLetter: PublicFullSiteResponse["loveLetter"];
  onClose: () => void;
};

export default function LetterModal({ loveLetter, onClose }: LetterModalProps) {
  return (
    <div className="letter-modal-backdrop">
      <section className="letter-modal">
        <button
          className="letter-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close letter"
        >
          ×
        </button>

        <div className="letter-modal-envelope">
          <div className="modal-envelope">
            <div className="modal-envelope-flap"></div>
            <div className="modal-envelope-paper">
              <div className="modal-envelope-heart-soft">♥</div>
            </div>
            <div className="modal-envelope-heart">♥</div>
          </div>

          <div className="floating-hearts">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
          </div>
        </div>

        <div className="letter-modal-content">
          <h2>A Letter For You ♡</h2>

          <article className="full-letter-card">
            <div className="letter-card-top-heart">♥</div>

            <p className="script">{loveLetter?.title || "My Dearest Love,"}</p>

            <p>
              {loveLetter?.body ||
                "From the moment we met, my world became brighter. You are my today and all of my tomorrows."}
            </p>

            <p className="signature">
              {loveLetter?.signature || "Forever yours, ♡"}
            </p>
          </article>

          <button
            className="primary-button letter-close-button"
            type="button"
            onClick={onClose}
          >
            ♥ Close Letter
          </button>
        </div>
      </section>
    </div>
  );
}