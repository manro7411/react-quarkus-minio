import type { PhotoItem } from "../types/admin";

type Props = {
  photo: PhotoItem | null;
  onClose: () => void;
};

export default function EditPhotoModal({ photo, onClose }: Props) {
  if (!photo) return null;

  return (
    <div className="modal-backdrop">
      <div className="edit-modal">
        <div className="modal-header">
          <h3>Edit Photo</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <img src={photo.image} alt={photo.title} />

          <div className="modal-form">
            <label>
              Caption
              <input defaultValue={photo.title} />
            </label>

            <label>
              Date Taken
              <input defaultValue={photo.date} />
            </label>

            <label>
              Tags
              <div className="tag-list">
                {photo.tags.map((tag) => (
                  <span key={tag}>{tag} ×</span>
                ))}
              </div>
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="outline-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button small" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}