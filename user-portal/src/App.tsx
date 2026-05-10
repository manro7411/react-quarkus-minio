import { useEffect, useMemo, useState } from "react";
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
    return <LoadingPage />;
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
      <Navbar title={siteData.site?.title} />

      <main>
        <HeroSection site={siteData.site} hero={hero} />

        <CountdownSection
          title={siteData.countdown?.title}
          countdown={countdown}
        />

        <MemoriesSection memories={memories} />

        <LetterSection
          loveLetter={loveLetter}
          onOpen={() => setLetterOpen(true)}
        />

        <GallerySection gallery={gallery} />

        <FinalSurpriseSection
          finalSurprise={finalSurprise}
          finalUnlocked={finalUnlocked}
          onOpenMiniGame={() => setMiniGameOpen(true)}
        />
      </main>

      {letterOpen && (
        <LetterModal
          loveLetter={loveLetter}
          onClose={() => setLetterOpen(false)}
        />
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

export default App;