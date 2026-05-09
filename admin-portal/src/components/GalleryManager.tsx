import type { PhotoItem } from "../types/admin";
import PhotoCard from "./PhotoCard";

type Props = {
  photos: PhotoItem[];
  onEdit: (photo: PhotoItem) => void;
};

export default function GalleryManager({ photos, onEdit }: Props) {
  return (
    <section className="gallery-card">
      <div className="section-header">
        <div>
          <h2>Gallery Management 💗</h2>
          <p>Upload, organize, and manage your romantic memories</p>
        </div>

        <button className="primary-button">＋ Upload Photos</button>
      </div>

      <div className="upload-box">
        <div className="upload-icon">☁</div>
        <h3>Drag & drop photos here</h3>
        <p>or click to browse files</p>
        <button className="primary-button small">Upload Photos</button>
        <span>JPG, PNG, WEBP up to 10MB</span>
      </div>

      <div className="filter-row">
        <div>
          <button className="chip active">All</button>
          <button className="chip">♡ Favorites</button>
          <button className="chip">⊘ Hidden</button>
        </div>

        <label>
          Sort by:
          <select>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </label>
      </div>

      <div className="bulk-row">
        <label>
          <input type="checkbox" /> Select all
        </label>
        <span>8 selected</span>
        <button className="danger-soft">🗑 Delete selected</button>
        <button>♡ Mark as favorite</button>
        <button>⊘ Hide selected</button>
      </div>

      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onEdit={onEdit} />
        ))}

        <div className="empty-photo-card">
          <div>🖼️</div>
          <h3>No more photos</h3>
          <p>Upload more memories to fill your gallery.</p>
          <button className="outline-button">Upload Photos</button>
        </div>
      </div>
    </section>
  );
}