import type { PhotoItem } from "../types/admin";

type Props = {
  photo: PhotoItem;
  onEdit: (photo: PhotoItem) => void;
};

export default function PhotoCard({ photo, onEdit }: Props) {
  return (
    <article className={`photo-card ${photo.selected ? "selected" : ""}`}>
      <div className="photo-top-actions">
        <button>{photo.selected ? "✓" : ""}</button>
        <button>{photo.favorite ? "♥" : "♡"}</button>
      </div>

      <img src={photo.image} alt={photo.title} />

      <div className="photo-card-body">
        <div className="photo-title-row">
          <p>{photo.title}</p>
          <button onClick={() => onEdit(photo)}>✎</button>
        </div>

        <div className="photo-footer">
          <span>{photo.date}</span>
          <div>
            <button>👁</button>
            <button onClick={() => onEdit(photo)}>✎</button>
            <button className="danger">🗑</button>
          </div>
        </div>
      </div>
    </article>
  );
}