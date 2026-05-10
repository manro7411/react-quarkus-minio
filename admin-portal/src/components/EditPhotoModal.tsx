import { useEffect, useState } from "react";
import type { PhotoItem } from "../types/admin";
import { updateGalleryPhoto } from "../services/galleryService";

type Props = {
  photo: PhotoItem | null;
  onClose: () => void;
  onSaved?: () => void;
};

export default function EditPhotoModal({ photo, onClose, onSaved }: Props) {
  const [caption, setCaption] = useState("");
  const [photoDate, setPhotoDate] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
      if (!photo) {
        return;
      }

      setCaption(photo.title || "");
      setPhotoDate(normalizeDate(photo.date));
      setFavorite(Boolean(photo.favorite));
      setHidden(Boolean(photo.hidden));
      setSortOrder(Number(photo.sortOrder ?? 0));
      setError("");
    }, [photo]);

  if (!photo) {
    return null;
  }

  async function handleSave() {
    if (!photo) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateGalleryPhoto(photo.id, {
        caption,
        photoDate,
        favorite,
        hidden,
        sortOrder,
      });

      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save photo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="edit-modal">
        <div className="modal-header">
          <h3>Edit Photo</h3>
          <button type="button" onClick={onClose} disabled={saving}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <img src={photo.image} alt={caption || photo.title} />

          <div className="modal-form">
            <label>
              Caption
              <input
                value={caption}
                disabled={saving}
                onChange={(event) => setCaption(event.target.value)}
              />
            </label>

            <label>
              Date Taken
              <input
                type="date"
                value={photoDate}
                disabled={saving}
                onChange={(event) => setPhotoDate(event.target.value)}
              />
            </label>

            <label>
              Sort Order
             <input
               type="number"
               value={sortOrder}
               disabled={saving}
               onChange={(event) => setSortOrder(Number(event.target.value))}
             />
            </label>

            <label>
              Status
              <div className="tag-list">
                <label>
                  <input
                    type="checkbox"
                    checked={favorite}
                    disabled={saving}
                    onChange={(event) => setFavorite(event.target.checked)}
                  />
                  <span>♡ Favorite</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={hidden}
                    disabled={saving}
                    onChange={(event) => setHidden(event.target.checked)}
                  />
                  <span>⊘ Hidden</span>
                </label>
              </div>
            </label>

            {photo.tags && photo.tags.length > 0 && (
              <label>
                Tags
                <div className="tag-list">
                  {photo.tags.map((tag) => (
                    <span key={tag}>{tag} ×</span>
                  ))}
                </div>
              </label>
            )}

            {error && <div className="modal-error">{error}</div>}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="outline-button"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="primary-button small"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeDate(value?: string) {
  if (!value || value === "-") {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}