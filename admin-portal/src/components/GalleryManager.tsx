import { useEffect, useMemo, useRef, useState } from "react";
import type { PhotoItem } from "../types/admin";
import PhotoCard from "./PhotoCard";
import {
  createGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryPhotos,
  updateGalleryPhoto,
  type GalleryPhoto,
} from "../services/galleryService";
import { uploadMedia } from "../services/mediaService";

type Props = {
  photos?: PhotoItem[];
  onEdit: (photo: PhotoItem) => void;
  reloadKey?: number;
};

type FilterType = "all" | "favorites" | "hidden";
type SortType = "newest" | "oldest";

function mapGalleryPhotoToPhotoItem(photo: GalleryPhoto): PhotoItem {
  return {
    id: photo.id,
    image: photo.imageUrl,
    title: photo.caption || "Untitled",
    date: photo.photoDate || "-",
    favorite: photo.favorite,
    hidden: photo.hidden,
  } as PhotoItem;
}

export default function GalleryManager({ onEdit }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    if (filter === "favorites") {
      result = result.filter((photo) => photo.favorite);
    }

    if (filter === "hidden") {
      result = result.filter((photo) => photo.hidden);
    }

    result.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.photoDate || 0).getTime();
      const bTime = new Date(b.createdAt || b.photoDate || 0).getTime();

      return sort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [photos, filter, sort]);

  const selectedCount = selectedIds.length;

  async function loadPhotos() {
    try {
      setLoading(true);
      setError("");

      const data = await getGalleryPhotos();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const currentCount = photos.length;

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];

        const uploaded = await uploadMedia(file, "user-portal/gallery");

        await createGalleryPhoto({
          mediaObjectId: uploaded.mediaObjectId,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          photoDate: new Date().toISOString().slice(0, 10),
          favorite: false,
          hidden: false,
          sortOrder: currentCount + index + 1,
        });
      }

      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredPhotos.map((photo) => photo.id));
      return;
    }

    setSelectedIds([]);
  }

  function handleSelectOne(photoId: string, checked: boolean) {
    if (checked) {
      setSelectedIds((current) => Array.from(new Set([...current, photoId])));
      return;
    }

    setSelectedIds((current) => current.filter((id) => id !== photoId));
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected photos?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      for (const id of selectedIds) {
        await deleteGalleryPhoto(id);
      }

      setPhotos((current) =>
        current.filter((photo) => !selectedIds.includes(photo.id))
      );

      setSelectedIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete selected photos");
    }
  }

  async function handleMarkSelectedAsFavorite() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setError("");

      const updatedPhotos: GalleryPhoto[] = [];

      for (const id of selectedIds) {
        const updated = await updateGalleryPhoto(id, {
          favorite: true,
        });

        updatedPhotos.push(updated);
      }

      setPhotos((current) =>
        current.map((photo) =>
          updatedPhotos.find((updated) => updated.id === photo.id) || photo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark favorite");
    }
  }

  async function handleHideSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setError("");

      const updatedPhotos: GalleryPhoto[] = [];

      for (const id of selectedIds) {
        const updated = await updateGalleryPhoto(id, {
          hidden: true,
        });

        updatedPhotos.push(updated);
      }

      setPhotos((current) =>
        current.map((photo) =>
          updatedPhotos.find((updated) => updated.id === photo.id) || photo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to hide selected photos");
    }
  }

  async function handleDeleteOne(photo: GalleryPhoto) {
    const confirmed = window.confirm(`Delete "${photo.caption || "photo"}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteGalleryPhoto(photo.id);

      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      setSelectedIds((current) => current.filter((id) => id !== photo.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    }
  }

  async function handleToggleFavorite(photo: GalleryPhoto) {
    try {
      setError("");

      const updated = await updateGalleryPhoto(photo.id, {
        favorite: !photo.favorite,
      });

      setPhotos((current) =>
        current.map((item) => (item.id === photo.id ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update favorite");
    }
  }

  async function handleToggleHidden(photo: GalleryPhoto) {
    try {
      setError("");

      const updated = await updateGalleryPhoto(photo.id, {
        hidden: !photo.hidden,
      });

      setPhotos((current) =>
        current.map((item) => (item.id === photo.id ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update hidden");
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <section className="gallery-card">
      <div className="section-header">
        <div>
          <h2>Gallery Management 💗</h2>
          <p>Upload, organize, and manage your romantic memories</p>
        </div>

        <button
          className="primary-button"
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "＋ Upload Photos"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => handleUploadFiles(event.target.files)}
        />
      </div>

      <div
        className="upload-box"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleUploadFiles(event.dataTransfer.files);
        }}
      >
        <div className="upload-icon">☁</div>
        <h3>Drag & drop photos here</h3>
        <p>or click to browse files</p>
        <button
          className="primary-button small"
          type="button"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Photos"}
        </button>
        <span>JPG, PNG, WEBP up to 20MB</span>
      </div>

      <div className="filter-row">
        <div>
          <button
            className={`chip ${filter === "all" ? "active" : ""}`}
            type="button"
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={`chip ${filter === "favorites" ? "active" : ""}`}
            type="button"
            onClick={() => setFilter("favorites")}
          >
            ♡ Favorites
          </button>

          <button
            className={`chip ${filter === "hidden" ? "active" : ""}`}
            type="button"
            onClick={() => setFilter("hidden")}
          >
            ⊘ Hidden
          </button>
        </div>

        <label>
          Sort by:
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortType)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
      </div>

      <div className="bulk-row">
        <label>
          <input
            type="checkbox"
            checked={
              filteredPhotos.length > 0 &&
              filteredPhotos.every((photo) => selectedIds.includes(photo.id))
            }
            onChange={(event) => handleSelectAll(event.target.checked)}
          />
          Select all
        </label>

        <span>{selectedCount} selected</span>

        <button
          className="danger-soft"
          type="button"
          disabled={selectedCount === 0}
          onClick={handleDeleteSelected}
        >
          🗑 Delete selected
        </button>

        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={handleMarkSelectedAsFavorite}
        >
          ♡ Mark as favorite
        </button>

        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={handleHideSelected}
        >
          ⊘ Hide selected
        </button>

        <button type="button" disabled={loading} onClick={loadPhotos}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="gallery-error">{error}</div>}

      <div className="photo-grid">
        {filteredPhotos.map((photo) => {
          const mappedPhoto = mapGalleryPhotoToPhotoItem(photo);

          return (
            <div key={photo.id} className="photo-card-shell">
              <label className="photo-select-control">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(photo.id)}
                  onChange={(event) =>
                    handleSelectOne(photo.id, event.target.checked)
                  }
                />
              </label>

              <PhotoCard
                photo={mappedPhoto}
                onEdit={() => onEdit(mappedPhoto)}
              />

              <div className="photo-inline-actions">
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(photo)}
                >
                  {photo.favorite ? "♥ Favorited" : "♡ Favorite"}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleHidden(photo)}
                >
                  {photo.hidden ? "Show" : "Hide"}
                </button>

                <button
                  className="danger-soft"
                  type="button"
                  onClick={() => handleDeleteOne(photo)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          );
        })}

        {!loading && filteredPhotos.length === 0 && (
          <div className="empty-photo-card">
            <div>🖼️</div>
            <h3>No more photos</h3>
            <p>Upload more memories to fill your gallery.</p>
            <button
              className="outline-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Photos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}