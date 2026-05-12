import { useMemo, useState } from "react";
import type { FloatingHeart } from "../types/site";

const TOTAL_HEARTS = 5;
const PROPOSAL_API_URL = "http://api.n9ne.cc/api/public/proposals/generate";

type UnlockHeartMiniGameProps = {
  finalTitle: string;
  finalMessage: string;
  finalImageUrl?: string;
  onClose: () => void;
  onUnlocked: () => void;
};

type GenerateProposalRequest = {
  siteKey: string;
  title: string;
  subtitle: string;
  message: string;
  askedBy: string;
  acceptedBy: string;
  acceptedDate: string;
};

type GenerateProposalResponse = {
  referenceNo: string;
  fileName: string;
  bucketName?: string;
  objectKey?: string;
  downloadUrl: string;
  sizeBytes?: number;
};

function createGameHearts(): FloatingHeart[] {
  return [
    { id: 1, top: "18%", left: "10%", collected: false },
    { id: 2, top: "48%", left: "8%", collected: false },
    { id: 3, top: "76%", left: "16%", collected: false },
    { id: 4, top: "28%", left: "82%", collected: false },
    { id: 5, top: "60%", left: "78%", collected: false },
  ];
}

function formatAcceptedDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}${month}${year}`;
}

export default function UnlockHeartMiniGame({
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
  const [savingProposal, setSavingProposal] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const [generatedProposalUrl, setGeneratedProposalUrl] = useState("");
  const [generatedReferenceNo, setGeneratedReferenceNo] = useState("");

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
    if (!askedBy.trim() || !acceptedBy.trim() || savingProposal) {
      return;
    }

    try {
      setSavingProposal(true);
      setProposalError("");
      setGeneratedProposalUrl("");
      setGeneratedReferenceNo("");

      const payload: GenerateProposalRequest = {
        siteKey: "panpan",
        title: "Official Love Proposal",
        subtitle: "Will you be my girlfriend?",
        message: "This memo is a sweet little promise from my heart.",
        askedBy: askedBy.trim(),
        acceptedBy: acceptedBy.trim(),
        acceptedDate: formatAcceptedDate(new Date()),
      };

      const response = await fetch(PROPOSAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to generate proposal. Status ${response.status}`
        );
      }

      const data: GenerateProposalResponse = await response.json();

      if (!data.downloadUrl) {
        throw new Error("Backend did not return downloadUrl.");
      }

      setProposalAccepted(true);
      setGeneratedReferenceNo(data.referenceNo || "");
      setGeneratedProposalUrl(data.downloadUrl);

      onUnlocked();
    } catch (error) {
      console.error("Failed to generate proposal:", error);
      setProposalError(
        error instanceof Error ? error.message : "Failed to generate proposal."
      );
    } finally {
      setSavingProposal(false);
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

        <header className="heart-game-header">
          <span>✦ MINI GAME ✦</span>
          <h2>Unlock My Heart</h2>
          <p>Collect all my hearts to unlock your final surprise.</p>
        </header>

        <HeartProgressMeter collectedCount={collectedCount} />

        <GameBoard
          hearts={hearts}
          allCollected={allCollected}
          heartsLeft={heartsLeft}
          collectedCount={collectedCount}
          onCollectHeart={collectHeart}
          onReveal={revealFinalSurprise}
        />

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
          <ProposalModal
            finalTitle={finalTitle}
            finalMessage={finalMessage}
            finalImageUrl={finalImageUrl}
            askedBy={askedBy}
            acceptedBy={acceptedBy}
            proposalAccepted={proposalAccepted}
            savingProposal={savingProposal}
            proposalError={proposalError}
            generatedProposalUrl={generatedProposalUrl}
            generatedReferenceNo={generatedReferenceNo}
            onClose={onClose}
            onAskedByChange={setAskedBy}
            onAcceptedByChange={setAcceptedBy}
            onAcceptProposal={acceptProposal}
          />
        )}
      </section>
    </div>
  );
}

type HeartProgressMeterProps = {
  collectedCount: number;
};

function HeartProgressMeter({ collectedCount }: HeartProgressMeterProps) {
  return (
    <div className="heart-game-meter">
      <div className="heart-meter-icons">
        {Array.from({ length: TOTAL_HEARTS }).map((_, index) => (
          <span key={index} className={index < collectedCount ? "collected" : ""}>
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
  );
}

type GameBoardProps = {
  hearts: FloatingHeart[];
  allCollected: boolean;
  heartsLeft: number;
  collectedCount: number;
  onCollectHeart: (id: number) => void;
  onReveal: () => void;
};

function GameBoard({
  hearts,
  allCollected,
  heartsLeft,
  onCollectHeart,
  onReveal,
}: GameBoardProps) {
  return (
    <div className={`heart-game-board ${allCollected ? "unlocked" : ""}`}>
      <div className="heart-game-sparkles" />

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
            onClick={() => onCollectHeart(heart.id)}
            aria-label={`Collect heart ${index + 1}`}
          >
            <span>♥</span>
            <small>Click me!</small>
          </button>
        )
      )}

      <div className="heart-game-gift" aria-hidden="true">
        <div className="heart-gift-box" />
        <div className="heart-gift-lid" />
        <div className="heart-gift-ribbon-x" />
        <div className="heart-gift-ribbon-y" />
        <div className="heart-gift-bow-left" />
        <div className="heart-gift-bow-right" />
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

      {allCollected && <div className="heart-game-confetti" />}

      <div className="heart-game-unlock-card">
        <div className="heart-game-lock-icon">{allCollected ? "🎁" : "🔒"}</div>

        <div className="heart-game-unlock-copy">
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
          onClick={onReveal}
        >
          {allCollected ? "🎁 Reveal Final Surprise" : "🔒 Reveal Final Surprise"}
        </button>
      </div>
    </div>
  );
}

type ProposalModalProps = {
  finalTitle: string;
  finalMessage: string;
  finalImageUrl?: string;
  askedBy: string;
  acceptedBy: string;
  proposalAccepted: boolean;
  savingProposal: boolean;
  proposalError: string;
  generatedProposalUrl: string;
  generatedReferenceNo: string;
  onClose: () => void;
  onAskedByChange: (value: string) => void;
  onAcceptedByChange: (value: string) => void;
  onAcceptProposal: () => void;
};

function ProposalModal({
  finalMessage,
  finalImageUrl,
  askedBy,
  acceptedBy,
  proposalAccepted,
  savingProposal,
  proposalError,
  generatedProposalUrl,
  generatedReferenceNo,
  onClose,
  onAskedByChange,
  onAcceptedByChange,
  onAcceptProposal,
}: ProposalModalProps) {
  const canAccept = askedBy.trim() && acceptedBy.trim() && !savingProposal;

  return (
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
            {finalMessage || "This memo is a sweet little promise from my heart."}
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
            <p>By signing below, we agree to start a lovely story together.</p>
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
                onChange={(event) => onAskedByChange(event.target.value)}
              />
            </label>

            <label>
              Accepted by
              <input
                value={acceptedBy}
                placeholder="Her name"
                onChange={(event) => onAcceptedByChange(event.target.value)}
              />
            </label>
          </div>

          <div className="proposal-date-row">
            <span>Date:</span>
            <strong>{new Date().toLocaleDateString("en-GB")}</strong>
          </div>

          <button
            type="button"
            className="proposal-accept-button"
            disabled={!canAccept}
            onClick={onAcceptProposal}
          >
            {savingProposal ? "Generating Proposal..." : "💌 Sign & Accept Proposal"}
          </button>

          {proposalError && (
            <div className="proposal-error">
              <strong>Generate failed</strong>
              <p>{proposalError}</p>
            </div>
          )}

          {proposalAccepted && (
            <div className="proposal-success">
              <span>💖</span>
              <strong>Proposal accepted!</strong>
              <p>
                {acceptedBy} signed this lovely promise with {askedBy}.
              </p>
              {generatedReferenceNo && (
                <small>Reference No: {generatedReferenceNo}</small>
              )}
            </div>
          )}

          {generatedProposalUrl && (
            <div className="proposal-preview-section">
              <h4>Generated Proposal Document</h4>

              <div className="proposal-preview-actions">
                <a
                  href={generatedProposalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="proposal-view-link"
                >
                  Open Proposal PDF
                </a>
              </div>

              <iframe
                src={generatedProposalUrl}
                title="Generated Proposal PDF"
                className="proposal-pdf-frame"
              />
            </div>
          )}

          <p className="proposal-footer">
            No expiration. Valid for a lifetime of affection.
          </p>
        </div>
      </section>
    </div>
  );
}