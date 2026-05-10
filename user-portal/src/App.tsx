import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  getPublicFullSite,
  type PublicFullSiteResponse,
} from "./services/publicSiteService";

import { useCountdown } from "./hooks/useCountdown";
import { getDateTime } from "./utils/date";

import LoadingPage from "./components/LoadingPage";
import UnavailablePage from "./components/UnavailablePage";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import MemoriesSection from "./components/MemoriesSection";
import LetterSection from "./components/LetterSection";
import LetterModal from "./components/LetterModal";
import GallerySection from "./components/GallerySection";
import FinalSurpriseSection from "./components/FinalSurpriseSection";
import UnlockHeartMiniGame from "./components/UnlockHeartMiniGame";

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
  }, [siteData?.memories]);

  const gallery = useMemo(() => {
    return [...(siteData?.gallery ?? [])].sort((a, b) => {
      const sortA = a.sortOrder ?? 0;
      const sortB = b.sortOrder ?? 0;

      if (sortA !== sortB) {
        return sortA - sortB;
      }

      return getDateTime(b.photoDate) - getDateTime(a.photoDate);
    });
  }, [siteData?.gallery]);

  const loadSiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPublicFullSite();
      setSiteData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site");
      setSiteData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSiteData();
  }, [loadSiteData]);

  function handleOpenLetter() {
    setLetterOpen(true);
  }

  function handleCloseLetter() {
    setLetterOpen(false);
  }

  function handleOpenMiniGame() {
    setMiniGameOpen(true);
  }

  function handleCloseMiniGame() {
    setMiniGameOpen(false);
  }

  function handleFinalUnlocked() {
    setFinalUnlocked(true);
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !siteData) {
    return (
      <div className="page">
        <div className="loading-page">
          <h1>Something went wrong</h1>
          <p>{error || "Failed to load site"}</p>

          <button
            type="button"
            className="primary-button small"
            onClick={loadSiteData}
          >
            Try Again ♡
          </button>
        </div>
      </div>
    );
  }

  const site = siteData.site;
  const hero = siteData.hero;
  const countdownConfig = siteData.countdown;
  const loveLetter = siteData.loveLetter;
  const finalSurprise = siteData.finalSurprise;

  if (site?.status !== "ACTIVE") {
    return <UnavailablePage status={site?.status || "MAINTENANCE"} />;
  }

  return (
    <div className="page">
      <Navbar title={site?.title} />

      <main>
        <HeroSection site={site} hero={hero} />

        <CountdownSection
          title={countdownConfig?.title}
          countdown={countdown}
        />

        <MemoriesSection memories={memories} />

        <LetterSection loveLetter={loveLetter} onOpen={handleOpenLetter} />

        <GallerySection gallery={gallery} />

        <FinalSurpriseSection
          finalSurprise={finalSurprise}
          finalUnlocked={finalUnlocked}
          onOpenMiniGame={handleOpenMiniGame}
        />
      </main>

      {letterOpen && (
        <LetterModal loveLetter={loveLetter} onClose={handleCloseLetter} />
      )}

      {miniGameOpen && (
        <UnlockHeartMiniGame
          finalTitle={finalSurprise?.title || "Official Love Proposal"}
          finalMessage={
            finalSurprise?.message ||
            "This is my sweetest little promise from the heart."
          }
          finalImageUrl={finalSurprise?.imageUrl || undefined}
          onClose={handleCloseMiniGame}
          onUnlocked={handleFinalUnlocked}
        />
      )}

      <footer>
        <p>Made with ♥ just for you</p>
        <small>© 2026 {site?.title || "For My Love"}. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;