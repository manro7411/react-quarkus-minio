import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import {
  getPublicFullSite,
  type PublicFullSiteResponse,
} from "./services/publicSiteService";

import { useCountdown } from "./hooks/useCountdown";
import { getDateTime } from "./utils/date";

import FlowerIntro from "./components/FlowerIntro";
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
import PolaroidPage from "./pages/PolaroidPage";

const FLOWER_INTRO_STORAGE_KEY = "flower_intro_done";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem(FLOWER_INTRO_STORAGE_KEY) === "true";
  });

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

      if (sortA !== sortB) return sortA - sortB;

      return getDateTime(b.memoryDate) - getDateTime(a.memoryDate);
    });
  }, [siteData?.memories]);

  const gallery = useMemo(() => {
    return [...(siteData?.gallery ?? [])].sort((a, b) => {
      const sortA = a.sortOrder ?? 0;
      const sortB = b.sortOrder ?? 0;

      if (sortA !== sortB) return sortA - sortB;

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

  function handleEnterWebsite() {
    sessionStorage.setItem(FLOWER_INTRO_STORAGE_KEY, "true");
    setIntroDone(true);
  }

  if (!introDone) {
    return <FlowerIntro onEnter={handleEnterWebsite} />;
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

  if (siteData.site?.status !== "ACTIVE") {
    return (
      <UnavailablePage status={siteData.site?.status || "MAINTENANCE"} />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            siteData={siteData}
            memories={memories}
            gallery={gallery}
            countdown={countdown}
            letterOpen={letterOpen}
            miniGameOpen={miniGameOpen}
            finalUnlocked={finalUnlocked}
            onOpenLetter={() => setLetterOpen(true)}
            onCloseLetter={() => setLetterOpen(false)}
            onOpenMiniGame={() => setMiniGameOpen(true)}
            onCloseMiniGame={() => setMiniGameOpen(false)}
            onFinalUnlocked={() => setFinalUnlocked(true)}
          />
        }
      />

      <Route path="/polaroid" element={<PolaroidPage siteData={siteData} />} />

      <Route
        path="*"
        element={
          <HomePage
            siteData={siteData}
            memories={memories}
            gallery={gallery}
            countdown={countdown}
            letterOpen={letterOpen}
            miniGameOpen={miniGameOpen}
            finalUnlocked={finalUnlocked}
            onOpenLetter={() => setLetterOpen(true)}
            onCloseLetter={() => setLetterOpen(false)}
            onOpenMiniGame={() => setMiniGameOpen(true)}
            onCloseMiniGame={() => setMiniGameOpen(false)}
            onFinalUnlocked={() => setFinalUnlocked(true)}
          />
        }
      />
    </Routes>
  );
}

type HomePageProps = {
  siteData: PublicFullSiteResponse;
  memories: PublicFullSiteResponse["memories"];
  gallery: PublicFullSiteResponse["gallery"];
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  letterOpen: boolean;
  miniGameOpen: boolean;
  finalUnlocked: boolean;
  onOpenLetter: () => void;
  onCloseLetter: () => void;
  onOpenMiniGame: () => void;
  onCloseMiniGame: () => void;
  onFinalUnlocked: () => void;
};

function HomePage({
  siteData,
  memories,
  gallery,
  countdown,
  letterOpen,
  miniGameOpen,
  finalUnlocked,
  onOpenLetter,
  onCloseLetter,
  onOpenMiniGame,
  onCloseMiniGame,
  onFinalUnlocked,
}: HomePageProps) {
  const site = siteData.site;
  const hero = siteData.hero;
  const countdownConfig = siteData.countdown;
  const loveLetter = siteData.loveLetter;
  const finalSurprise = siteData.finalSurprise;

  const finalSurpriseActive = finalSurprise?.active ?? false;

  function handleOpenFinalSurprise() {
    if (!finalSurpriseActive) {
      return;
    }

    onOpenMiniGame();
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

        <LetterSection loveLetter={loveLetter} onOpen={onOpenLetter} />

        <GallerySection gallery={gallery} />

        <FinalSurpriseSection
          finalSurprise={finalSurprise}
          finalUnlocked={finalUnlocked}
          onOpenMiniGame={handleOpenFinalSurprise}
        />
      </main>

      {letterOpen && (
        <LetterModal loveLetter={loveLetter} onClose={onCloseLetter} />
      )}

      {finalSurpriseActive && miniGameOpen && (
        <UnlockHeartMiniGame
          finalTitle={finalSurprise?.title || "Official Love Proposal"}
          finalMessage={
            finalSurprise?.message ||
            "This is my sweetest little promise from the heart."
          }
          finalImageUrl={finalSurprise?.imageUrl || undefined}
          onClose={onCloseMiniGame}
          onUnlocked={onFinalUnlocked}
        />
      )}

      <footer>
        <p>Made with ♥ just for you</p>
        <small>
          © 2026 {site?.title || "For My Love"}. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default App;