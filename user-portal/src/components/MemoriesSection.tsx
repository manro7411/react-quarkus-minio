import type { PublicFullSiteResponse } from "../services/publicSiteService";
import { formatDate } from "../utils/date";

type MemoryItem = PublicFullSiteResponse["memories"][number];

type MemoriesSectionProps = {
  memories: MemoryItem[];
};

export default function MemoriesSection({ memories }: MemoriesSectionProps) {
  return (
    <section id="memories" className="memories-section">
      <h2>♡ Our Beautiful Memories ♡</h2>

      <div className="memory-grid">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <article className="memory-card" key={memory.id}>
              <div className="heart-badge">♥</div>

              {memory.imageUrl ? (
                <img
                  src={memory.imageUrl}
                  alt={memory.title || "Beautiful memory"}
                />
              ) : (
                <div className="memory-placeholder-image">
                  <span>♡</span>
                </div>
              )}

              <div className="memory-body">
                <h3>{memory.title || "Untitled Memory"}</h3>
                <p>
                  {memory.description ||
                    "A beautiful moment we will always remember."}
                </p>
                <span>▣ {formatDate(memory.memoryDate)}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-section">
            <h3>No memories yet ♡</h3>
            <p>Add memories from the admin dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}