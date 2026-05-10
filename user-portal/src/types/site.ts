import { useEffect, useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

type ProposalSignature = {
  title: string;
  message: string;
  askedBy: string;
  acceptedBy: string;
  acceptedAt: string;
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
    return [...(siteData?.memories ?? [])].sort((a, b) => {
      const sortA = a.sortOrder ?? 0;
      const sortB = b.sortOrder ?? 0;

      if (sortA !== sortB) {
        return sortA - sortB;
      }

      return getDateTime(b.memoryDate) - getDateTime(a.memoryDate);
    });
  }, [siteData]);

  const gallery = useMemo(() => {
    return [...(siteData?.gallery ?? [])].sort((a, b) => {
      const sortA = a.sortOrder ?? 0;
      const sortB = b.sortOrder ?? 0;

      if (sortA !== sortB) {
        return sortA - sortB;
      }

      return getDateTime(b.photoDate) - getDateTime(a.photoDate);
    });
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

                  {memory.imageUrl ? (
                    <img
                      src={memory.imageUrl}
                      alt={memory.title || "Beautiful memory"}
                    />
                  ) : (
                    <div className="memory-placeholder-image">
                      <span>♡</span>
                    </div>
                  )}

                  <div className="memory-body">
                    <h3>{memory.title || "Untitled Memory"}</h3>
                    <p>
                      {memory.description ||
                        "A beautiful moment we will always remember."}
                    </p>
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
          finalTitle={finalSurprise?.title || "Official Love Proposal"}
          finalMessage={
            finalSurprise?.message ||
            "This is my sweetest little promise from the heart."
          }
          finalImageUrl={finalSurprise?.imageUrl || undefined}
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
  const [askedBy, setAskedBy] = useState("");
  const [acceptedBy, setAcceptedBy] = useState("");
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);

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

  async function acceptProposal() {
    if (!askedBy.trim() || !acceptedBy.trim() || savingPdf) {
      return;
    }

    const proposal: ProposalSignature = {
      title: finalTitle || "Official Love Proposal",
      message:
        finalMessage || "This is my sweetest little promise from the heart.",
      askedBy: askedBy.trim(),
      acceptedBy: acceptedBy.trim(),
      acceptedAt: new Date().toISOString(),
    };

    try {
      setSavingPdf(true);

      localStorage.setItem("love_proposal_signature", JSON.stringify(proposal));
      await downloadProposalPdf(proposal);

      setProposalAccepted(true);
      onUnlocked();
    } catch (error) {
      console.error("Failed to save proposal PDF:", error);
      window.alert("Failed to save PDF. Please try again.");
    } finally {
      setSavingPdf(false);
    }
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
                <strong>
                  {heartsLeft === 1 ? "Almost there!" : "Keep going!"}
                </strong>
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
              {allCollected
                ? "🎁 Reveal Final Surprise"
                : "🔒 Reveal Final Surprise"}
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
          <div className="proposal-modal-backdrop">
            <section className="proposal-modal">
              <button
                type="button"
                className="proposal-close"
                onClick={onClose}
                aria-label="Close proposal"
              >
                ×
              </button>

              <div
                className="proposal-paper"
                style={
                  finalImageUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(255, 250, 245, 0.92), rgba(255, 250, 245, 0.94)), url(${finalImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <div className="proposal-top-heart">💗</div>

                <p className="proposal-title">Official Love Proposal</p>

                <h2>Will you be my girlfriend?</h2>

                <p className="proposal-intro">
                  {finalMessage ||
                    "This memo is a sweet little promise from my heart."}
                  <br />
                  If you say yes, I promise to cherish you, make you smile,
                  <br />
                  and create beautiful memories together.
                </p>

                <div className="proposal-terms">
                  <div className="proposal-terms-title">
                    <span>♥</span>
                    Terms of Our Love
                    <span>♥</span>
                  </div>

                  <ol>
                    <li>Good morning and good night texts</li>
                    <li>Unlimited hugs and support</li>
                    <li>Random treats and little surprises</li>
                    <li>Listening to your stories and dreams</li>
                    <li>Making lovely memories together</li>
                  </ol>
                </div>

                <div className="proposal-agreement">
                  <h3>Agreement</h3>
                  <p>
                    By signing below, we agree to start a lovely story together.
                  </p>
                </div>

                <div className="proposal-choice-row">
                  <button type="button" className="proposal-choice yes">
                    ♡ Yes, absolutely 💖
                  </button>

                  <button type="button" className="proposal-choice soft">
                    ♡ Need one more smile first 🌷
                  </button>
                </div>

                <div className="proposal-signature-grid">
                  <label>
                    Asked by
                    <input
                      value={askedBy}
                      placeholder="Your name"
                      onChange={(event) => setAskedBy(event.target.value)}
                    />
                  </label>

                  <label>
                    Accepted by
                    <input
                      value={acceptedBy}
                      placeholder="Her name"
                      onChange={(event) => setAcceptedBy(event.target.value)}
                    />
                  </label>
                </div>

                <div className="proposal-date-row">
                  <span>Date:</span>
                  <strong>{new Date().toLocaleDateString()}</strong>
                </div>

                <button
                  type="button"
                  className="proposal-accept-button"
                  disabled={
                    !askedBy.trim() || !acceptedBy.trim() || savingPdf
                  }
                  onClick={acceptProposal}
                >
                  {savingPdf
                    ? "Preparing PDF..."
                    : "💌 Sign & Accept Proposal"}
                </button>

                {proposalAccepted && (
                  <div className="proposal-success">
                    <span>💖</span>
                    <strong>Proposal accepted!</strong>
                    <p>
                      {acceptedBy} signed this lovely promise with {askedBy}.
                    </p>
                    <small>Your PDF has been downloaded.</small>
                  </div>
                )}

                <p className="proposal-footer">
                  No expiration. Valid for a lifetime of affection.
                </p>
              </div>
            </section>
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

function getDateTime(value?: string) {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

async function downloadProposalPdf(proposal: ProposalSignature) {
  const acceptedDate = new Date(proposal.acceptedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const safeAskedBy = escapeHtml(proposal.askedBy);
  const safeAcceptedBy = escapeHtml(proposal.acceptedBy);
  const safeTitle = escapeHtml(proposal.title);
  const safeMessage = escapeHtml(proposal.message);

  const certificate = document.createElement("div");

  certificate.style.position = "fixed";
  certificate.style.left = "-10000px";
  certificate.style.top = "0";
  certificate.style.width = "794px";
  certificate.style.height = "1123px";
  certificate.style.overflow = "hidden";
  certificate.style.background = "#ffd8e5";
  certificate.style.padding = "48px";
  certificate.style.boxSizing = "border-box";
  certificate.style.zIndex = "-1";

  certificate.innerHTML = `
    <div style="
      width: 698px;
      height: 1027px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 16% 12%, rgba(255,255,255,.75), transparent 18%),
        radial-gradient(circle at 84% 18%, rgba(255,210,225,.72), transparent 22%),
        linear-gradient(135deg, #ffd8e5, #fff1f6);
      color: #3d2b2f;
      font-family: Poppins, Arial, sans-serif;
    ">
      <main style="
        position: relative;
        width: 620px;
        height: 930px;
        padding: 48px 48px 34px;
        border-radius: 26px;
        text-align: center;
        background:
          linear-gradient(rgba(255,250,245,.94), rgba(255,250,245,.94)),
          radial-gradient(circle at 50% 0%, rgba(255,199,211,.30), transparent 36%);
        border: 1.5px solid rgba(232,142,126,.58);
        box-shadow: 0 24px 70px rgba(125,63,74,.18);
        overflow: hidden;
        box-sizing: border-box;
      ">
        <div style="
          position: absolute;
          top: 20px;
          left: 22px;
          color: rgba(232,112,132,.72);
          font-size: 24px;
          line-height: 1;
        ">♡</div>

        <div style="
          position: absolute;
          right: 22px;
          bottom: 20px;
          color: rgba(232,112,132,.72);
          font-size: 24px;
          line-height: 1;
        ">♡</div>

        <div style="font-size:34px;line-height:1;margin-bottom:18px;">
          💗
        </div>

        <h1 style="
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 46px;
          line-height: .95;
          color: #3b252b;
          letter-spacing: -1.4px;
        ">${safeTitle}</h1>

        <h2 style="
          margin: 8px 0 24px;
          font-family: 'Great Vibes', cursive;
          font-size: 36px;
          font-weight: 400;
          line-height: 1;
          color: #e76d86;
        ">Will you be my girlfriend?</h2>

        <p style="
          margin: 0 auto 24px;
          max-width: 500px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 14px;
          line-height: 1.45;
          color: #3e2d31;
        ">
          ${safeMessage}<br />
          If you say yes, I promise to cherish you, make you smile,
          and create beautiful memories together.
        </p>

        <section style="
          position: relative;
          margin: 0 auto 28px;
          max-width: 460px;
          padding: 30px 30px 16px;
          border-radius: 14px;
          border: 1px solid rgba(232,142,126,.56);
          background: rgba(255,246,239,.58);
          box-sizing: border-box;
        ">
          <div style="
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 200px;
            padding: 8px 18px;
            border-radius: 999px;
            background: #ffe1da;
            border: 1px solid rgba(232,142,126,.38);
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16px;
            font-weight: 700;
            color: #3d2b2f;
            box-sizing: border-box;
          ">♥ Terms of Our Love ♥</div>

          <ol style="
            margin: 0;
            padding-left: 18px;
            text-align: left;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.8;
            color: #2f2226;
          ">
            <li>Good morning and good night texts</li>
            <li>Unlimited hugs and support</li>
            <li>Random treats and little surprises</li>
            <li>Listening to your stories and dreams</li>
            <li>Making lovely memories together</li>
          </ol>
        </section>

        <section>
          <h3 style="
            display: inline-block;
            margin: 0 0 14px;
            padding: 8px 28px;
            border-radius: 999px;
            background: #ffe1da;
            border: 1px solid rgba(232,142,126,.35);
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            color: #3d2b2f;
          ">Agreement</h3>

          <p style="
            margin: 0;
            color: #4f4045;
            font-size: 11px;
            font-family: Poppins, Arial, sans-serif;
          ">By signing below, we agree to start a lovely story together.</p>
        </section>

        <section style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 34px;
          margin: 26px auto 14px;
          max-width: 480px;
        ">
          <div style="
            text-align: left;
            color: #d86778;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
          ">
            Asked by
            <div style="
              margin-top: 8px;
              padding: 8px 4px 10px;
              border-bottom: 1.5px solid rgba(232,142,126,.45);
              color: #3b252b;
              font-family: 'Great Vibes', cursive;
              font-size: 24px;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${safeAskedBy}</div>
          </div>

          <div style="
            text-align: left;
            color: #d86778;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
          ">
            Accepted by
            <div style="
              margin-top: 8px;
              padding: 8px 4px 10px;
              border-bottom: 1.5px solid rgba(232,142,126,.45);
              color: #3b252b;
              font-family: 'Great Vibes', cursive;
              font-size: 24px;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${safeAcceptedBy}</div>
          </div>
        </section>

        <div style="
          margin-top: 12px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 12px;
          color: #3d2b2f;
        ">
          Date: <strong>${acceptedDate}</strong>
        </div>

        <p style="
          margin: 22px 0 0;
          font-family: 'Great Vibes', cursive;
          font-size: 20px;
          line-height: 1;
          color: #d86778;
        ">
          No expiration. Valid for a lifetime of affection.
        </p>
      </main>
    </div>
  `;

  document.body.appendChild(certificate);

  try {
    await document.fonts.ready;

    const canvas = await html2canvas(certificate, {
      scale: 2,
      backgroundColor: "#ffd8e5",
      useCORS: true,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imageData = canvas.toDataURL("image/png", 1.0);

    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);

    pdf.save(
      `official-love-proposal-${formatFileDate(proposal.acceptedAt)}.pdf`
    );
  } finally {
    certificate.remove();
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFileDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "signed";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default App;