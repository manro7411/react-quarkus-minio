import { useEffect, useMemo, useState } from "react";

type FloatingHeart = {
  id: number;
  top: string;
  left: string;
  collected: boolean;
};

type UnlockHeartMiniGameModalProps = {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
};

const TOTAL_HEARTS = 5;

function createHearts(): FloatingHeart[] {
  return [
    { id: 1, top: "16%", left: "10%", collected: false },
    { id: 2, top: "50%", left: "8%", collected: false },
    { id: 3, top: "74%", left: "14%", collected: false },
    { id: 4, top: "28%", left: "82%", collected: false },
    { id: 5, top: "60%", left: "78%", collected: false },
  ];
}

export default function UnlockHeartMiniGameModal({
  open,
  onClose,
  onUnlocked,
}: UnlockHeartMiniGameModalProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>(createHearts());
  const [showUnlockedState, setShowUnlockedState] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (open) {
      setHearts(createHearts());
      setShowUnlockedState(false);
      setRevealed(false);
    }
  }, [open]);

  const collectedCount = useMemo(
    () => hearts.filter((heart) => heart.collected).length,
    [hearts]
  );

  const allCollected = collectedCount === TOTAL_HEARTS;

  useEffect(() => {
    if (allCollected) {
      const timer = window.setTimeout(() => {
        setShowUnlockedState(true);
      }, 300);

      return () => window.clearTimeout(timer);
    }
  }, [allCollected]);

  function handleCollectHeart(id: number) {
    setHearts((current) =>
      current.map((heart) =>
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );
  }

  function handleRevealFinalSurprise() {
    if (!allCollected) return;

    setRevealed(true);
    onUnlocked();
  }

  if (!open) return null;

  return (
    <div className="unlock-game-overlay">
      <div className="unlock-game-shell">
        <button
          type="button"
          className="unlock-game-close"
          onClick={onClose}
          aria-label="Close mini game"
        >
          ×
        </button>

        <div className="unlock-game-header">
          <p className="unlock-game-badge">✦ Mini Game ✦</p>
          <h2>Unlock My Heart</h2>
          <p>Collect all my hearts to unlock your final surprise.</p>
        </div>

        <div className="unlock-game-progress-card">
          <div className="unlock-game-heart-meter">
            {Array.from({ length: TOTAL_HEARTS }).map((_, index) => {
              const active = index < collectedCount;
              return (
                <span
                  key={index}
                  className={`meter-heart ${active ? "active" : ""}`}
                >
                  ❤
                </span>
              );
            })}
          </div>

          <div className="unlock-game-progress-text">
            <strong>
              {collectedCount} / {TOTAL_HEARTS}
            </strong>
            <span>hearts collected</span>
          </div>
        </div>

        <div className={`unlock-game-board ${showUnlockedState ? "unlocked" : ""}`}>
          <div className="unlock-game-sparkles" />

          {hearts.map((heart, index) =>
            heart.collected ? null : (
              <button
                key={heart.id}
                type="button"
                className={`floating-heart floating-heart-${index + 1}`}
                style={{ top: heart.top, left: heart.left }}
                onClick={() => handleCollectHeart(heart.id)}
              >
                <span>❤</span>
                <small>Click me!</small>
              </button>
            )
          )}

          <div className="unlock-game-gift-area">
            <div className={`unlock-game-gift ${showUnlockedState ? "ready" : ""}`}>
              <div className="gift-lid" />
              <div className="gift-ribbon-vertical" />
              <div className="gift-ribbon-horizontal" />
              <div className="gift-bow bow-left" />
              <div className="gift-bow bow-right" />
              <div className="gift-lock">🔒</div>
            </div>

            {!allCollected && (
              <div className="unlock-game-hint-card">
                <div className="hint-icon">💗</div>
                <div>
                  <strong>Almost there!</strong>
                  <p>{TOTAL_HEARTS - collectedCount} heart left</p>
                </div>
              </div>
            )}
          </div>

          {showUnlockedState && <div className="unlock-game-confetti" />}

          <div className="unlock-game-bottom-card">
            <div className="unlock-game-bottom-icon">
              {allCollected ? "🎁" : "🔒"}
            </div>

            <div className="unlock-game-bottom-copy">
              <h3>
                {allCollected
                  ? "Your final surprise is unlocked!"
                  : "Collect all 5 hearts to unlock"}
              </h3>
              <p>
                {allCollected
                  ? "Everything is ready. Tap the button below."
                  : "Your final surprise is waiting for you."}
              </p>
            </div>

            <button
              type="button"
              className={`unlock-game-reveal-button ${
                allCollected ? "enabled" : "disabled"
              }`}
              disabled={!allCollected}
              onClick={handleRevealFinalSurprise}
            >
              {allCollected ? "🎁 Reveal Final Surprise" : "🔒 Reveal Final Surprise"}
            </button>
          </div>
        </div>

        <div className="unlock-game-footer-notes">
          <div className="unlock-note-card">
            <span>💗</span>
            <div>
              <strong>Find the hidden hearts</strong>
              <p>They’re closer than you think.</p>
            </div>
          </div>

          <div className="unlock-note-card">
            <span>🎁</span>
            <div>
              <strong>Collect all 5 hearts</strong>
              <p>Each one brings you closer.</p>
            </div>
          </div>

          <div className="unlock-note-card">
            <span>✨</span>
            <div>
              <strong>Unlock the surprise</strong>
              <p>A special moment awaits.</p>
            </div>
          </div>
        </div>

        {revealed && (
          <div className="unlock-game-final-message">
            <div className="unlock-final-card">
              <h3>Surprise unlocked! 💖</h3>
              <p>
                Your final surprise is now ready. You can now show your special
                final content here.
              </p>
              <button type="button" className="primary-romantic-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}