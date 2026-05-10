import { useMemo, useState } from "react";
import type { PublicFullSiteResponse } from "../services/publicSiteService";
import Navbar from "../components/Navbar";
import { SavePolaroidButton } from "../features/polaroid-export";
import { CameraCapture } from "../features/polaroid-camera";

type PolaroidPageProps = {
  siteData: PublicFullSiteResponse;
};

type GalleryItem = PublicFullSiteResponse["gallery"][number];

type CapturedPhoto = {
  id: string;
  imageUrl: string;
  caption: string;
  photoDate: string;
  sortOrder: number;
};

type PolaroidPhoto = GalleryItem | CapturedPhoto;

type TemplateStyle = {
  id: string;
  name: string;
  frameClass: string;
  accent: string;
};

type FilterStyle = {
  id: string;
  name: string;
  className: string;
};

const templates: TemplateStyle[] = [
  {
    id: "classic",
    name: "Classic Love",
    frameClass: "template-classic",
    accent: "💗",
  },
  {
    id: "gold",
    name: "Gold Romance",
    frameClass: "template-gold",
    accent: "♡",
  },
  {
    id: "purple",
    name: "Dreamy Purple",
    frameClass: "template-purple",
    accent: "💜",
  },
  {
    id: "beige",
    name: "Minimal Beige",
    frameClass: "template-beige",
    accent: "🌸",
  },
];

const filters: FilterStyle[] = [
  { id: "original", name: "Original", className: "" },
  { id: "warm", name: "Warm", className: "filter-warm" },
  { id: "romantic", name: "Romantic", className: "filter-romantic" },
  { id: "dreamy", name: "Dreamy", className: "filter-dreamy" },
  { id: "bw", name: "B&W", className: "filter-bw" },
];

const stickers = ["💗", "💕", "✨", "💖", "🎀"];

export default function PolaroidPage({ siteData }: PolaroidPageProps) {
  const gallery = useMemo(() => {
    return [...(siteData.gallery ?? [])].sort((a, b) => {
      const sortA = a.sortOrder ?? 0;
      const sortB = b.sortOrder ?? 0;

      if (sortA !== sortB) {
        return sortA - sortB;
      }

      return (
        new Date(b.photoDate || "").getTime() -
        new Date(a.photoDate || "").getTime()
      );
    });
  }, [siteData.gallery]);

  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(
    gallery[0] ?? null
  );

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedSticker, setSelectedSticker] = useState("💗");
  const [caption, setCaption] = useState(
    gallery[0]?.caption || "You + Me = Us"
  );
  const [showDate, setShowDate] = useState(true);

  const allPhotos = useMemo(() => {
    return [...capturedPhotos, ...gallery];
  }, [capturedPhotos, gallery]);

  const photoDate = selectedPhoto?.photoDate || "";
  const finalCaption = caption.trim() || "You + Me = Us";

  function handleCameraCapture(imageDataUrl: string) {
    const now = new Date();

    const newPhoto: CapturedPhoto = {
      id: `captured-${now.getTime()}`,
      imageUrl: imageDataUrl,
      caption: "Our New Moment",
      photoDate: now.toISOString(),
      sortOrder: 0,
    };

    setCapturedPhotos((current) => [newPhoto, ...current]);
    setSelectedPhoto(newPhoto);
    setCaption(newPhoto.caption);
    setShowDate(true);
  }

  function handleSelectPhoto(photo: PolaroidPhoto) {
    setSelectedPhoto(photo);
    setCaption(photo.caption || "You + Me = Us");
  }

  function handleRetakeStyle() {
    setSelectedTemplate(templates[0]);
    setSelectedFilter(filters[0]);
    setSelectedSticker("💗");
    setCaption(selectedPhoto?.caption || "You + Me = Us");
    setShowDate(true);
  }

  function handleNextTemplate() {
    const currentIndex = templates.findIndex(
      (template) => template.id === selectedTemplate.id
    );

    const next = templates[(currentIndex + 1) % templates.length];
    setSelectedTemplate(next);
  }

  function handleNextPhoto() {
    if (!allPhotos.length || !selectedPhoto) {
      return;
    }

    const currentIndex = allPhotos.findIndex(
      (item) => item.id === selectedPhoto.id
    );

    const next = allPhotos[(currentIndex + 1) % allPhotos.length];

    setSelectedPhoto(next);
    setCaption(next.caption || "You + Me = Us");
  }

  return (
    <div className="page">
      <Navbar title={siteData.site?.title} />

      <main className="polaroid-capture-page">
        <section className="capture-left-panel">
          <div>
            <p className="capture-script">Our Moments ♡</p>

            <h1>
              Capture Our
              <br />
              Moment
            </h1>

            <p className="capture-description">
              Take a sweet photo and turn it into a memory.
            </p>
          </div>

          <div className="capture-tip-card">
            <div className="capture-tip-icon">💗</div>

            <h3>Make it yours</h3>

            <p>
              Take a new photo, add captions, choose stickers, and save it as a
              romantic Polaroid.
            </p>
          </div>
        </section>

        <section className="capture-center-panel">
          <div
            className={`polaroid-camera-card ${selectedTemplate.frameClass}`}
          >
            <div className="camera-badge">HD</div>
            <div className="camera-settings">⚙</div>

            <div className="camera-preview">
              {selectedPhoto ? (
                <img
                  className={selectedFilter.className}
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption || "Selected memory"}
                />
              ) : (
                <div className="camera-empty">No photo selected</div>
              )}

              <div className="camera-heart-outline">♡</div>
              <div className="camera-sticker">{selectedSticker}</div>
            </div>

            <div className="polaroid-caption-area">
              <p>{finalCaption}</p>
              {showDate && photoDate && (
                <span>{formatDisplayDate(photoDate)}</span>
              )}
            </div>
          </div>

          <div className="capture-main-actions">
            {selectedPhoto ? (
              <SavePolaroidButton
                imageUrl={selectedPhoto.imageUrl}
                caption={finalCaption}
                date={showDate ? formatDisplayDate(photoDate) : ""}
                fileName={`polaroid-${finalCaption}`}
                className="capture-button primary"
              >
                📸 Take Polaroid Photo
              </SavePolaroidButton>
            ) : (
              <button className="capture-button primary" disabled>
                📸 Take Polaroid Photo
              </button>
            )}

            <button
              type="button"
              className="capture-button soft"
              onClick={handleRetakeStyle}
            >
              ↻ Reset Style
            </button>

            <button
              type="button"
              className="capture-button outline"
              onClick={handleNextTemplate}
            >
              ▦ Choose Template
            </button>

            <button
              type="button"
              className="capture-button outline pink"
              onClick={handleNextPhoto}
            >
              ✓ Use Next Photo
            </button>
          </div>
        </section>

        <aside className="capture-right-panel">
          <div className="custom-panel">
            <h2>✦ 0. Take New Photo 📸</h2>
            <CameraCapture onCapture={handleCameraCapture} />
          </div>

          <div className="custom-panel">
            <div className="custom-panel-header">
              <h2>✦ 1. Choose Template ✨</h2>
              <button type="button">View all</button>
            </div>

            <div className="template-options">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`template-option ${
                    selectedTemplate.id === template.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className={`template-mini ${template.frameClass}`}>
                    {selectedPhoto && (
                      <img src={selectedPhoto.imageUrl} alt={template.name} />
                    )}
                    <span>{template.accent}</span>
                  </div>

                  <small>{template.name}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-panel">
            <h2>✦ 2. Customize Your Photo ✨</h2>

            <label className="custom-label">Filter</label>

            <div className="filter-options">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-option ${
                    selectedFilter.id === filter.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {selectedPhoto && (
                    <img
                      className={filter.className}
                      src={selectedPhoto.imageUrl}
                      alt={filter.name}
                    />
                  )}

                  <small>{filter.name}</small>
                </button>
              ))}
            </div>

            <label className="custom-label">Caption</label>

            <div className="caption-input-wrap">
              <input
                value={caption}
                maxLength={50}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="You + Me = Us"
              />
              <span>{caption.length}/50</span>
            </div>

            <label className="date-toggle">
              <span>▣ Date Stamp</span>
              <input
                type="checkbox"
                checked={showDate}
                onChange={(event) => setShowDate(event.target.checked)}
              />
              <b />
            </label>
          </div>

          <div className="custom-panel">
            <h2>✦ 3. Add Stickers ✨</h2>

            <div className="sticker-options">
              {stickers.map((sticker) => (
                <button
                  key={sticker}
                  type="button"
                  className={selectedSticker === sticker ? "active" : ""}
                  onClick={() => setSelectedSticker(sticker)}
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="capture-memory-strip">
          <div className="memory-strip-info">
            <p className="capture-script small">Our Little Memories ♡</p>
            <span>Every picture tells our story.</span>
            <a href="/#gallery">▧ View Gallery</a>
          </div>

          <div className="memory-strip-list">
            {allPhotos.slice(0, 8).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`memory-strip-card rotate-${(index % 4) + 1} ${
                  selectedPhoto?.id === item.id ? "active" : ""
                }`}
                onClick={() => handleSelectPhoto(item)}
              >
                <img src={item.imageUrl} alt={item.caption || "Memory"} />
                <span>{item.caption || "Lovely Memory"} ♡</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="memory-strip-next"
            onClick={handleNextPhoto}
          >
            ›
          </button>
        </section>
      </main>
    </div>
  );
}

function formatDisplayDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}