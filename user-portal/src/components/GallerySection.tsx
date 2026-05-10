import type { PublicFullSiteResponse } from "../services/publicSiteService";

type GalleryItem = PublicFullSiteResponse["gallery"][number];

type GallerySectionProps = {
  gallery: GalleryItem[];
};

export default function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section id="gallery" className="gallery-section">
      <h2>♡ Moments We’ll Never Forget ♡</h2>

      <div className="polaroid-row">
        {gallery.length > 0 ? (
          gallery.map((item, index) => (
            <div
              className={`polaroid rotate-${(index % 4) + 1}`}
              key={item.id}
            >
              <img src={item.imageUrl} alt={item.caption || "Memory"} />
              <span>{item.caption || "Beautiful moment"} ♡</span>
            </div>
          ))
        ) : (
          <div className="empty-section">
            <h3>No gallery photos yet ♡</h3>
            <p>Upload photos from the admin dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}