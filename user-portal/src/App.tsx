import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  getPublicFullSite,
  type PublicFullSiteResponse,
} from "./services/publicSiteService";

type FloatingHeart = {
  id: number;
  top: string;
  left: string;
  collected: boolean;
};

type UnavailablePageProps = {
  status: string;
};

const TOTAL_HEARTS = 5;

function createGameHearts(): FloatingHeart[] {
  return [
    { id: 1, top: "18%", left: "10%", collected: false },
    { id: 2, top: "48%", left: "8%", collected: false },
    { id: 3, top: "76%", left: "16%", collected: false },
    { id: 4, top: "28%", left: "82%", collected: false },
    { id: 5, top: "60%", left: "78%", collected: false },
  ];
}

function App() {
  const [siteData, setSiteData] = useState<PublicFullSiteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [finalUnlocked, setFinalUnlocked] = useState(false);

  const countdown = useCountdown(siteData?.countdown?.targetDatetime);

  const memories = useMemo(() => {
    return siteData?.memories ?? [];
  }, [siteData]);

  const gallery = useMemo(() => {
    return siteData?.gallery ?? [];
  }, [siteData]);

  useEffect(() => {
    getPublicFullSite()
      .then(setSiteData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load site");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-page">
          <div className="big-heart">♥</div>
          <h1>Loading love story...</h1>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="page">
        <div className="loading-page">
          <h1>Something went wrong</h1>
          <p>{error || "Failed to load site"}</p>
        </div>
      </div>
    );
  }

  if (siteData.site?.status !== "ACTIVE") {
    return <UnavailablePage status={siteData.site?.status || "MAINTENANCE"} />;
  }

  const hero = siteData.hero;
  const loveLetter = siteData.loveLetter;
  const finalSurprise = siteData.finalSurprise;

  return (
    <div className="page">
      <header className="navbar">
        <a className="brand" href="#home">
          {siteData.site?.title || "For My Love"} ♡
        </a>

        <nav className="nav-links">
          <a className="active" href="#home">
            Home
          </a>
          <a href="#story">Our Story</a>
          <a href="#memories">Memories</a>
          <a href="#gallery">Gallery</a>
          <a href="#surprise">Surprise</a>
        </nav>

        <button className="heart-button" type="button">
          ♡
        </button>
      </header>

      <main>
        <section
          id="home"
          className="hero"
          style={
            hero?.imageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(255, 245, 250, 0.58), rgba(255, 238, 245, 0.68)), url(${hero.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="hero-content">
            <span className="eyebrow">
              {siteData.site?.subtitle || "A little surprise made just for you"}
            </span>

            <h1>{hero?.headline || "I have something special for you ♡"}</h1>

            <p>
              {hero?.subtitle ||
                "A soft, sweet, and tiny corner of the internet made with love."}
            </p>

            <a href={hero?.ctaUrl || "#surprise"} className="primary-button">
              {hero?.ctaText || "Open Your Surprise ♡"}
            </a>
          </div>

          <div className="hero-art">
            <div className="gift-box">
              <div className="gift-lid"></div>
              <div className="gift-body"></div>
              <div className="gift-ribbon-x"></div>
              <div className="gift-ribbon-y"></div>
              <div className="gift-bow left"></div>
              <div className="gift-bow right"></div>
            </div>
            <div className="big-heart">♥</div>
          </div>

          <div className="scroll-cue">⌄</div>
        </section>

        <section className="countdown">
          <h2>
            {siteData.countdown?.title || "Something special is coming in ♡"}
          </h2>

          <div className="timer-card">
            <div className="time-box">
              <strong>{padTime(countdown.days)}</strong>
              <span>Days</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>{padTime(countdown.hours)}</strong>
              <span>Hours</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>{padTime(countdown.minutes)}</strong>
              <span>Minutes</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>{padTime(countdown.seconds)}</strong>
              <span>Seconds</span>
            </div>
          </div>
        </section>

        <section id="memories" className="memories-section">
          <h2>♡ Our Beautiful Memories ♡</h2>

          <div className="memory-grid">
            {memories.length > 0 ? (
              memories.map((memory) => (
                <article className="memory-card" key={memory.id}>
                  <div className="heart-badge">♥</div>
                  {memory.imageUrl && (
                    <img src={memory.imageUrl} alt={memory.title} />
                  )}
                  <div className="memory-body">
                    <h3>{memory.title}</h3>
                    <p>{memory.description}</p>
                    <span>▣ {formatDate(memory.memoryDate)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-section">
                <h3>No memories yet ♡</h3>
                <p>Add memories from the admin dashboard.</p>
              </div>
            )}
          </div>
        </section>

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

            <button
              className="primary-button small"
              type="button"
              onClick={() => setLetterOpen(true)}
            >
              Read My Letter ✉
            </button>
          </div>
        </section>

        <section id="gallery" className="gallery-section">
          <h2>♡ Moments We’ll Never Forget ♡</h2>

          <div className="polaroid-row">
            {gallery.length > 0 ? (
              gallery.map((item, index) => (
                <div
                  className={`polaroid rotate-${(index % 4) + 1}`}
                  key={item.id}
                >
                  <img src={item.imageUrl} alt={item.caption || "Memory"} />
                  <span>{item.caption || "Beautiful moment"} ♡</span>
                </div>
              ))
            ) : (
              <div className="empty-section">
                <h3>No gallery photos yet ♡</h3>
                <p>Upload photos from the admin dashboard.</p>
              </div>
            )}
          </div>
        </section>

        <section
          id="surprise"
          className="final-section"
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
              {finalSurprise?.title ||
                "Are you ready for your final surprise?"}
            </h2>
            <p>{finalSurprise?.message || "The best is yet to come..."}</p>

            <button
              className="primary-button"
              type="button"
              onClick={() => setMiniGameOpen(true)}
            >
              {finalUnlocked
                ? "Open Final Surprise Again 💖"
                : finalSurprise?.buttonText || "Reveal Final Surprise 🎁"}
            </button>

            {finalUnlocked && (
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
      </main>

      {letterOpen && (
        <div className="letter-modal-backdrop">
          <section className="letter-modal">
            <button
              className="letter-modal-close"
              type="button"
              onClick={() => setLetterOpen(false)}
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

                <p className="script">
                  {loveLetter?.title || "My Dearest Love,"}
                </p>

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
                onClick={() => setLetterOpen(false)}
              >
                ♥ Close Letter
              </button>
            </div>
          </section>
        </div>
      )}

      {miniGameOpen && (
        <UnlockHeartMiniGame
          finalTitle={finalSurprise?.title || "Your Final Surprise"}
          finalMessage={
            finalSurprise?.message ||
            "You unlocked the sweetest little surprise made just for you."
          }
          finalImageUrl={finalSurprise?.imageUrl}
          onClose={() => setMiniGameOpen(false)}
          onUnlocked={() => setFinalUnlocked(true)}
        />
      )}

      <footer>
        <p>Made with ♥ just for you</p>
        <small>
          © 2026 {siteData.site?.title || "For My Love"}. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

function UnavailablePage({ status }: UnavailablePageProps) {
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

type UnlockHeartMiniGameProps = {
  finalTitle: string;
  finalMessage: string;
  finalImageUrl?: string;
  onClose: () => void;
  onUnlocked: () => void;
};

function UnlockHeartMiniGame({
  finalTitle,
  finalMessage,
  finalImageUrl,
  onClose,
  onUnlocked,
}: UnlockHeartMiniGameProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>(createGameHearts());
  const [revealed, setRevealed] = useState(false);

  const collectedCount = useMemo(() => {
    return hearts.filter((heart) => heart.collected).length;
  }, [hearts]);

  const allCollected = collectedCount === TOTAL_HEARTS;
  const heartsLeft = TOTAL_HEARTS - collectedCount;

  function collectHeart(id: number) {
    setHearts((current) =>
      current.map((heart) =>
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );
  }

  function revealFinalSurprise() {
    if (!allCollected) return;

    setRevealed(true);
    onUnlocked();
  }

  return (
    <div className="heart-game-backdrop">
      <section className="heart-game-modal">
        <button
          className="heart-game-close"
          type="button"
          onClick={onClose}
          aria-label="Close mini game"
        >
          ×
        </button>

        <div className="heart-game-header">
          <span>✦ MINI GAME ✦</span>
          <h2>Unlock My Heart</h2>
          <p>Collect all my hearts to unlock your final surprise.</p>
        </div>

        <div className="heart-game-meter">
          <div className="heart-meter-icons">
            {Array.from({ length: TOTAL_HEARTS }).map((_, index) => (
              <span
                key={index}
                className={index < collectedCount ? "collected" : ""}
              >
                ♥
              </span>
            ))}
          </div>

          <div className="heart-meter-count">
            <strong>
              {collectedCount} / {TOTAL_HEARTS}
            </strong>
            <small>hearts collected</small>
          </div>
        </div>

        <div className={`heart-game-board ${allCollected ? "unlocked" : ""}`}>
          <div className="heart-game-sparkles"></div>

          {hearts.map((heart, index) =>
            heart.collected ? null : (
              <button
                key={heart.id}
                className={`collect-heart collect-heart-${index + 1}`}
                type="button"
                style={{
                  top: heart.top,
                  left: heart.left,
                }}
                onClick={() => collectHeart(heart.id)}
              >
                <span>♥</span>
                <small>Click me!</small>
              </button>
            )
          )}

          <div className="heart-game-gift">
            <div className="heart-gift-box"></div>
            <div className="heart-gift-lid"></div>
            <div className="heart-gift-ribbon-x"></div>
            <div className="heart-gift-ribbon-y"></div>
            <div className="heart-gift-bow-left"></div>
            <div className="heart-gift-bow-right"></div>
            <div className="heart-gift-lock">{allCollected ? "💖" : "🔒"}</div>
          </div>

          {!allCollected && (
            <div className="heart-game-hint">
              <span>💗</span>
              <div>
                <strong>{heartsLeft === 1 ? "Almost there!" : "Keep going!"}</strong>
                <p>
                  {heartsLeft} {heartsLeft === 1 ? "heart" : "hearts"} left
                </p>
              </div>
            </div>
          )}

          {allCollected && <div className="heart-game-confetti"></div>}

          <div className="heart-game-unlock-card">
            <div className="heart-game-lock-icon">
              {allCollected ? "🎁" : "🔒"}
            </div>

            <div>
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
              disabled={!allCollected}
              className={allCollected ? "enabled" : "disabled"}
              onClick={revealFinalSurprise}
            >
              {allCollected ? "🎁 Reveal Final Surprise" : "🔒 Reveal Final Surprise"}
            </button>
          </div>
        </div>

        <div className="heart-game-footer">
          <div>
            <span>💗</span>
            <strong>Find the hidden hearts</strong>
            <p>They’re closer than you think.</p>
          </div>

          <div>
            <span>🎁</span>
            <strong>Collect all 5 hearts</strong>
            <p>Each one brings you closer.</p>
          </div>

          <div>
            <span>✨</span>
            <strong>Unlock the surprise</strong>
            <p>A special moment awaits.</p>
          </div>
        </div>

        {revealed && (
          <div className="final-surprise-modal">
            <article className="final-surprise-card">
              <button
                type="button"
                className="final-surprise-close"
                onClick={onClose}
                aria-label="Close final surprise"
              >
                ×
              </button>

              {finalImageUrl && <img src={finalImageUrl} alt={finalTitle} />}

              <h3>{finalTitle}</h3>
              <p>{finalMessage}</p>

              <button className="primary-button" type="button" onClick={onClose}>
                Close Surprise 💖
              </button>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}

function useCountdown(targetDatetime?: string) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!targetDatetime) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const target = new Date(targetDatetime).getTime();
  const diff = Math.max(target - now, 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default App;