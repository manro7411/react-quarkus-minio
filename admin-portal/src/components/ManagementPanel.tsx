import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountdown,
  getFinalSurprise,
  getHero,
  getLoveLetter,
  updateCountdown,
  updateFinalSurprise,
  updateHero,
  updateLoveLetter,
} from "../services/siteContentService";
import { getAdminSite, updateAdminSite } from "../services/siteService";
import { uploadMedia } from "../services/mediaService";

type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

type SiteStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

type ManagementMenu =
  | "Dashboard"
  | "Memories"
  | "Gallery"
  | "Hero Section"
  | "Countdown"
  | "Love Letter"
  | "Final Surprise"
  | "Settings";

type ManagementPanelProps = {
  activeMenu?: ManagementMenu | string;
};

export default function ManagementPanel({
  activeMenu = "Dashboard",
}: ManagementPanelProps) {
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);
  const finalSurpriseImageInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingFinalImage, setUploadingFinalImage] = useState(false);

  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [finalSurpriseImageUrl, setFinalSurpriseImageUrl] = useState("");

  const [hero, setHero] = useState({
    headline: "You Are My Today & All of My Tomorrows",
    subtitle: "Every moment with you is my favorite.",
    ctaText: "Open My Heart",
    ctaUrl: "#love-letter",
    active: true,
  });

  const [countdown, setCountdown] = useState({
    title: "Something special is coming",
    targetDate: "2025-06-05",
    targetTime: "00:00",
    active: true,
  });

  const [loveLetter, setLoveLetter] = useState({
    title: "My Dearest Love,",
    body: "Every day with you feels like a beautiful dream come true. Thank you for being my everything.",
    signature: "Forever yours, ❤ Always",
    active: true,
  });

  const [finalSurprise, setFinalSurprise] = useState({
    title: "A Special Surprise Just for You",
    message: "Get ready for something magical!",
    buttonText: "Reveal My Surprise",
    active: true,
  });

  const [site, setSite] = useState<{
    title: string;
    subtitle: string;
    status: SiteStatus;
  }>({
    title: "For My Love",
    subtitle: "",
    status: "ACTIVE",
  });

  const countdownPreview = useMemo(() => {
    const target = new Date(`${countdown.targetDate}T${countdown.targetTime}:00`);
    const now = new Date();
    const diff = Math.max(target.getTime() - now.getTime(), 0);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [countdown.targetDate, countdown.targetTime]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function normalizeSiteStatus(value?: string): SiteStatus {
    if (value === "MAINTENANCE" || value === "INACTIVE" || value === "ACTIVE") {
      return value;
    }

    return "ACTIVE";
  }

  async function loadData() {
    try {
      setStatus("loading");
      setError("");

      const results = await Promise.allSettled([
        getHero(),
        getCountdown(),
        getLoveLetter(),
        getFinalSurprise(),
        getAdminSite(),
      ]);

      const [
        heroResult,
        countdownResult,
        loveLetterResult,
        finalSurpriseResult,
        siteResult,
      ] = results;

      if (heroResult.status === "fulfilled") {
        setHero({
          headline: heroResult.value.headline || "",
          subtitle: heroResult.value.subtitle || "",
          ctaText: heroResult.value.ctaText || "",
          ctaUrl: heroResult.value.ctaUrl || "",
          active: heroResult.value.active ?? true,
        });

        setHeroImageUrl(heroResult.value.imageUrl || "");
      }

      if (countdownResult.status === "fulfilled") {
        const targetDatetime = countdownResult.value.targetDatetime || "";
        const [datePart, timePart] = targetDatetime.split("T");

        setCountdown({
          title: countdownResult.value.title || "",
          targetDate: datePart || "2025-06-05",
          targetTime: timePart ? timePart.slice(0, 5) : "00:00",
          active: countdownResult.value.active ?? true,
        });
      }

      if (loveLetterResult.status === "fulfilled") {
        setLoveLetter({
          title: loveLetterResult.value.title || "",
          body: loveLetterResult.value.body || "",
          signature: loveLetterResult.value.signature || "",
          active: loveLetterResult.value.active ?? true,
        });
      }

      if (finalSurpriseResult.status === "fulfilled") {
        setFinalSurprise({
          title: finalSurpriseResult.value.title || "",
          message: finalSurpriseResult.value.message || "",
          buttonText: finalSurpriseResult.value.buttonText || "",
          active: finalSurpriseResult.value.active ?? true,
        });

        setFinalSurpriseImageUrl(finalSurpriseResult.value.imageUrl || "");
      }

      if (siteResult.status === "fulfilled") {
        setSite({
          title: siteResult.value.title || "",
          subtitle: siteResult.value.subtitle || "",
          status: normalizeSiteStatus(siteResult.value.status),
        });
      }

      setStatus("idle");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load content";

      setStatus("error");
      setError(message);
      showToast("error", message);
    }
  }

  async function runSave(
    callback: () => Promise<void>,
    successMessage = "Updated successfully"
  ) {
    try {
      setStatus("saving");
      setError("");

      await callback();

      setStatus("saved");
      showToast("success", successMessage);

      window.setTimeout(() => {
        setStatus("idle");
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";

      setStatus("error");
      setError(message);
      showToast("error", message);
    }
  }

  async function saveHero() {
    await runSave(async () => {
      const updated = await updateHero({
        headline: hero.headline,
        subtitle: hero.subtitle,
        ctaText: hero.ctaText,
        ctaUrl: hero.ctaUrl,
        active: hero.active,
      });

      setHero({
        headline: updated.headline || "",
        subtitle: updated.subtitle || "",
        ctaText: updated.ctaText || "",
        ctaUrl: updated.ctaUrl || "",
        active: updated.active ?? true,
      });

      setHeroImageUrl(updated.imageUrl || heroImageUrl);
    }, "Hero updated successfully ☆");
  }

  async function saveCountdown() {
    await runSave(async () => {
      const targetDatetime =
        countdown.targetDate && countdown.targetTime
          ? `${countdown.targetDate}T${countdown.targetTime}:00`
          : undefined;

      const updated = await updateCountdown({
        title: countdown.title,
        targetDatetime,
        active: countdown.active,
      });

      const [datePart, timePart] = (updated.targetDatetime || "").split("T");

      setCountdown({
        title: updated.title || "",
        targetDate: datePart || countdown.targetDate,
        targetTime: timePart ? timePart.slice(0, 5) : countdown.targetTime,
        active: updated.active ?? true,
      });
    }, "Countdown updated successfully ▧");
  }

  async function saveLoveLetter() {
    await runSave(async () => {
      const updated = await updateLoveLetter({
        title: loveLetter.title,
        body: loveLetter.body,
        signature: loveLetter.signature,
        active: loveLetter.active,
      });

      setLoveLetter({
        title: updated.title || "",
        body: updated.body || "",
        signature: updated.signature || "",
        active: updated.active ?? true,
      });
    }, "Love letter updated successfully 💌");
  }

  async function saveFinalSurprise() {
    await runSave(async () => {
      const updated = await updateFinalSurprise({
        title: finalSurprise.title,
        message: finalSurprise.message,
        buttonText: finalSurprise.buttonText,
        active: finalSurprise.active,
      });

      setFinalSurprise({
        title: updated.title || "",
        message: updated.message || "",
        buttonText: updated.buttonText || "",
        active: updated.active ?? true,
      });

      setFinalSurpriseImageUrl(updated.imageUrl || finalSurpriseImageUrl);
    }, "Final surprise updated successfully 🎁");
  }

async function toggleFinalSurpriseActive(nextActive: boolean) {
  setFinalSurprise((current) => ({
    ...current,
    active: nextActive,
  }));

  await runSave(async () => {
    const updated = await updateFinalSurprise({
      title: finalSurprise.title,
      message: finalSurprise.message,
      buttonText: finalSurprise.buttonText,
      active: nextActive,
    });

    setFinalSurprise({
      title: updated.title || "",
      message: updated.message || "",
      buttonText: updated.buttonText || "",
      active: updated.active ?? false,
    });

    setFinalSurpriseImageUrl(updated.imageUrl || finalSurpriseImageUrl);
  }, nextActive ? "Final Surprise opened 💝" : "Final Surprise closed 🔒");
}

  async function saveSite(successMessage?: string) {
    await runSave(async () => {
      const updated = await updateAdminSite({
        title: site.title,
        subtitle: site.subtitle,
        status: site.status,
      });

      setSite({
        title: updated.title || "",
        subtitle: updated.subtitle || "",
        status: normalizeSiteStatus(updated.status),
      });
    }, successMessage || "Website access updated successfully ⚙");
  }

  async function setSiteStatusAndSave(nextStatus: SiteStatus) {
    const nextSite = {
      ...site,
      status: nextStatus,
    };

    setSite(nextSite);

    await runSave(async () => {
      const updated = await updateAdminSite({
        title: nextSite.title,
        subtitle: nextSite.subtitle,
        status: nextSite.status,
      });

      setSite({
        title: updated.title || "",
        subtitle: updated.subtitle || "",
        status: normalizeSiteStatus(updated.status),
      });
    }, getStatusToastMessage(nextStatus));
  }

  function getStatusToastMessage(nextStatus: SiteStatus) {
    if (nextStatus === "ACTIVE") {
      return "User portal is now live 💗";
    }

    if (nextStatus === "MAINTENANCE") {
      return "User portal is now in maintenance mode 🛠";
    }

    return "User portal is now unavailable 🔒";
  }

  async function handleHeroImageChange(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    try {
      setUploadingHeroImage(true);
      setError("");

      const uploaded = await uploadMedia(file, "user-portal/hero");

      const updated = await updateHero({
        mediaObjectId: uploaded.mediaObjectId,
        headline: hero.headline,
        subtitle: hero.subtitle,
        ctaText: hero.ctaText,
        ctaUrl: hero.ctaUrl,
        active: hero.active,
      });

      setHero({
        headline: updated.headline || "",
        subtitle: updated.subtitle || "",
        ctaText: updated.ctaText || "",
        ctaUrl: updated.ctaUrl || "",
        active: updated.active ?? true,
      });

      setHeroImageUrl(uploaded.imageUrl || updated.imageUrl || "");
      setStatus("saved");
      showToast("success", "Hero image updated successfully 🖼");

      window.setTimeout(() => {
        setStatus("idle");
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload hero image";

      setStatus("error");
      setError(message);
      showToast("error", message);
    } finally {
      setUploadingHeroImage(false);

      if (heroImageInputRef.current) {
        heroImageInputRef.current.value = "";
      }
    }
  }

  async function handleFinalSurpriseImageChange(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    try {
      setUploadingFinalImage(true);
      setError("");

      const uploaded = await uploadMedia(file, "user-portal/surprise");

      const updated = await updateFinalSurprise({
        mediaObjectId: uploaded.mediaObjectId,
        title: finalSurprise.title,
        message: finalSurprise.message,
        buttonText: finalSurprise.buttonText,
        active: finalSurprise.active,
      });

      setFinalSurprise({
        title: updated.title || "",
        message: updated.message || "",
        buttonText: updated.buttonText || "",
        active: updated.active ?? true,
      });

      setFinalSurpriseImageUrl(uploaded.imageUrl || updated.imageUrl || "");
      setStatus("saved");
      showToast("success", "Final surprise image updated successfully 🎁");

      window.setTimeout(() => {
        setStatus("idle");
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload final surprise image";

      setStatus("error");
      setError(message);
      showToast("error", message);
    } finally {
      setUploadingFinalImage(false);

      if (finalSurpriseImageInputRef.current) {
        finalSurpriseImageInputRef.current.value = "";
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);


  function renderStatus() {
    return (
      <>
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "!"}</span>
          <strong>{toast.message}</strong>
          <button type="button" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="panel-status">Loading content...</div>
      )}

      {status === "saving" && (
        <div className="panel-status">Saving changes...</div>
      )}

      {status === "saved" && (
        <div className="panel-status success">Saved successfully ✓</div>
      )}

      {error && <div className="panel-error">{error}</div>}
      </>
    );
  }

  function renderAccessPanel() {
    return (
      <section className="panel-card access-panel">
        <div className="panel-title">
          <h3>🚦 Website Access</h3>
          <span className={`access-pill ${site.status.toLowerCase()}`}>
            {site.status}
          </span>
        </div>

        <div className={`site-status-preview ${site.status.toLowerCase()}`}>
          <strong>
            {site.status === "ACTIVE" && "Website is live 💗"}
            {site.status === "MAINTENANCE" && "Maintenance mode is on 🛠"}
            {site.status === "INACTIVE" && "Website is unavailable 🔒"}
          </strong>

          <p>
            {site.status === "ACTIVE" &&
              "Visitors can access the user portal normally."}
            {site.status === "MAINTENANCE" &&
              "Visitors will see a temporary unavailable page while you update content."}
            {site.status === "INACTIVE" &&
              "Visitors cannot access the user portal content."}
          </p>
        </div>

        <div className="access-actions">
          <button
            type="button"
            className={`access-button live ${
              site.status === "ACTIVE" ? "selected" : ""
            }`}
            onClick={() => setSiteStatusAndSave("ACTIVE")}
          >
            💗 Open Website
          </button>

          <button
            type="button"
            className={`access-button maintenance ${
              site.status === "MAINTENANCE" ? "selected" : ""
            }`}
            onClick={() => setSiteStatusAndSave("MAINTENANCE")}
          >
            🛠 Maintenance
          </button>

          <button
            type="button"
            className={`access-button closed ${
              site.status === "INACTIVE" ? "selected" : ""
            }`}
            onClick={() => setSiteStatusAndSave("INACTIVE")}
          >
            🔒 Close Website
          </button>
        </div>
      </section>
    );
  }

  function renderHeroPanel() {
    return (
      <section className="panel-card">
        <div className="panel-title">
          <h3>☆ Hero Section Management</h3>
          <label className="switch">
            <input
              type="checkbox"
              checked={hero.active}
              onChange={(event) =>
                setHero((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            <span></span>
          </label>
        </div>

        <label>
          Main headline
          <input
            value={hero.headline}
            onChange={(event) =>
              setHero((current) => ({
                ...current,
                headline: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Subtitle
          <input
            value={hero.subtitle}
            onChange={(event) =>
              setHero((current) => ({
                ...current,
                subtitle: event.target.value,
              }))
            }
          />
        </label>

        <label>
          CTA Button Text
          <input
            value={hero.ctaText}
            onChange={(event) =>
              setHero((current) => ({
                ...current,
                ctaText: event.target.value,
              }))
            }
          />
        </label>

        <label>
          CTA URL
          <input
            value={hero.ctaUrl}
            onChange={(event) =>
              setHero((current) => ({
                ...current,
                ctaUrl: event.target.value,
              }))
            }
          />
        </label>

        <div
          className="hero-preview"
          style={
            heroImageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${heroImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div>
            <strong>{hero.headline || "Hero headline"}</strong>
            <strong>{hero.subtitle || "Hero subtitle"}</strong>
            <button>{hero.ctaText || "Open My Heart"}</button>
          </div>
        </div>

        <input
          ref={heroImageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => handleHeroImageChange(event.target.files)}
        />

        <div className="panel-actions">
          <button
            className="outline-button"
            type="button"
            disabled={uploadingHeroImage}
            onClick={() => heroImageInputRef.current?.click()}
          >
            {uploadingHeroImage ? "Uploading..." : "Change Image"}
          </button>

          <button className="primary-button small" type="button" onClick={saveHero}>
            Save Hero
          </button>
        </div>
      </section>
    );
  }

  function renderCountdownPanel() {
    return (
      <section className="panel-card">
        <div className="panel-title">
          <h3>▧ Countdown Management</h3>
          <label className="switch">
            <input
              type="checkbox"
              checked={countdown.active}
              onChange={(event) =>
                setCountdown((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            <span></span>
          </label>
        </div>

        <label>
          Countdown Title
          <input
            value={countdown.title}
            onChange={(event) =>
              setCountdown((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Target Date
          <input
            type="date"
            value={countdown.targetDate}
            onChange={(event) =>
              setCountdown((current) => ({
                ...current,
                targetDate: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Target Time
          <input
            type="time"
            value={countdown.targetTime}
            onChange={(event) =>
              setCountdown((current) => ({
                ...current,
                targetTime: event.target.value,
              }))
            }
          />
        </label>

        <div className="mini-countdown">
          <div>
            <b>{countdownPreview.days}</b>
            <span>Days</span>
          </div>
          <div>
            <b>{countdownPreview.hours}</b>
            <span>Hours</span>
          </div>
          <div>
            <b>{countdownPreview.minutes}</b>
            <span>Minutes</span>
          </div>
          <div>
            <b>{countdownPreview.seconds}</b>
            <span>Seconds</span>
          </div>
        </div>

        <button className="primary-button small" type="button" onClick={saveCountdown}>
          Save Countdown
        </button>
      </section>
    );
  }

  function renderLoveLetterPanel() {
    return (
      <section className="panel-card">
        <div className="panel-title">
          <h3>♡ Love Letter Management</h3>
          <label className="switch">
            <input
              type="checkbox"
              checked={loveLetter.active}
              onChange={(event) =>
                setLoveLetter((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            <span></span>
          </label>
        </div>

        <label>
          Letter Title
          <input
            value={loveLetter.title}
            onChange={(event) =>
              setLoveLetter((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Letter Body
          <textarea
            rows={5}
            value={loveLetter.body}
            onChange={(event) =>
              setLoveLetter((current) => ({
                ...current,
                body: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Signature
          <input
            value={loveLetter.signature}
            onChange={(event) =>
              setLoveLetter((current) => ({
                ...current,
                signature: event.target.value,
              }))
            }
          />
        </label>

        <div className="letter-preview">
          <div>
            <p>{loveLetter.title || "My Dearest Love,"}</p>
            <p>{loveLetter.body || "Your letter preview will show here."}</p>
            <b>{loveLetter.signature || "Forever yours, ❤ Always"}</b>
          </div>
          <div className="envelope-preview">💌</div>
        </div>

        <div className="panel-actions">
          <button className="outline-button" type="button">
            👁 Preview Letter
          </button>
          <button
            className="primary-button small"
            type="button"
            onClick={saveLoveLetter}
          >
            Save Letter
          </button>
        </div>
      </section>
    );
  }

  function renderFinalSurprisePanel() {
    return (
      <section className="panel-card final-panel">
        <div className="panel-title">
          <h3>🎁 Final Surprise Management</h3>
          <label
            className={`switch ${
              finalSurprise.active ? "switch-on" : "switch-off"
            }`}
          >
           <input
             type="checkbox"
             checked={finalSurprise.active}
             disabled={status === "saving"}
             onChange={(event) => toggleFinalSurpriseActive(event.target.checked)}
           />
            <span></span>
          </label>
        </div>

        <div
          className={`final-surprise-access-preview ${
            finalSurprise.active ? "enabled" : "disabled"
          }`}
        >
          <strong>
            {finalSurprise.active
              ? "Final Surprise is open 💝"
              : "Final Surprise is closed 🔒"}
          </strong>
          <p>
            {finalSurprise.active
              ? "Visitors can open the final surprise mini game."
              : "Visitors will not be able to open the final surprise."}
          </p>
        </div>

        <label>
          Title
          <input
            value={finalSurprise.title}
            onChange={(event) =>
              setFinalSurprise((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Message
          <input
            value={finalSurprise.message}
            onChange={(event) =>
              setFinalSurprise((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Button Text
          <input
            value={finalSurprise.buttonText}
            onChange={(event) =>
              setFinalSurprise((current) => ({
                ...current,
                buttonText: event.target.value,
              }))
            }
          />
        </label>

        <div
          className="gift-preview"
          style={
            finalSurpriseImageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.28)), url(${finalSurpriseImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "#ffffff",
                }
              : undefined
          }
        >
          {finalSurpriseImageUrl ? "" : "🎁"}
        </div>

        <input
          ref={finalSurpriseImageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) =>
            handleFinalSurpriseImageChange(event.target.files)
          }
        />

        <div className="panel-actions">
          <button
            className="outline-button"
            type="button"
            disabled={uploadingFinalImage}
            onClick={() => finalSurpriseImageInputRef.current?.click()}
          >
            {uploadingFinalImage ? "Uploading..." : "Change Image"}
          </button>

          <button
            className="primary-button small"
            type="button"
            onClick={saveFinalSurprise}
          >
            Save Surprise
          </button>
        </div>
      </section>
    );
  }

  function renderSettingsPanel() {
    return (
      <section className="panel-card settings-card">
        <div className="panel-title">
          <h3>⚙ Settings</h3>
          <span>⌄</span>
        </div>

        <label>
          Website Title
          <input
            value={site.title}
            onChange={(event) =>
              setSite((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Website Subtitle
          <input
            value={site.subtitle}
            onChange={(event) =>
              setSite((current) => ({
                ...current,
                subtitle: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Status
          <select
            value={site.status}
            onChange={(event) =>
              setSite((current) => ({
                ...current,
                status: event.target.value as SiteStatus,
              }))
            }
          >
            <option value="ACTIVE">ACTIVE - Public website is open</option>
            <option value="MAINTENANCE">
              MAINTENANCE - Temporarily unavailable
            </option>
            <option value="INACTIVE">INACTIVE - Website is closed</option>
          </select>
        </label>

        <button
          className="primary-button small"
          type="button"
          onClick={() => saveSite()}
        >
          Save Changes
        </button>
      </section>
    );
  }

  function renderPanelByMenu() {
    switch (activeMenu) {
      case "Hero Section":
        return renderHeroPanel();

      case "Countdown":
        return renderCountdownPanel();

      case "Love Letter":
        return renderLoveLetterPanel();

      case "Final Surprise":
        return renderFinalSurprisePanel();

      case "Settings":
        return renderSettingsPanel();

      case "Dashboard":
      default:
        return (
          <>
            {renderAccessPanel()}
            {renderHeroPanel()}
            {renderCountdownPanel()}
            {renderLoveLetterPanel()}
            {renderFinalSurprisePanel()}
            {renderSettingsPanel()}
          </>
        );
    }
  }

  return (
    <aside className="right-panel">
      {renderStatus()}
      {renderPanelByMenu()}
    </aside>
  );

}