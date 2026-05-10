import { useEffect, useRef, useState } from "react";
import {
  createMemory,
  deleteMemory,
  getMemories,
  type MemoryItem,
  updateMemory,
} from "../services/memoryService";
import { uploadMedia } from "../services/mediaService";

type ToastType = "success" | "error";

type Props = {
  onChanged?: () => void;
  onToast?: (type: ToastType, message: string) => void;
};

type MemoryFormState = {
  id: string;
  title: string;
  description: string;
  memoryDate: string;
  visible: boolean;
  sortOrder: number;
  mediaObjectId: string;
  imageUrl: string;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm: MemoryFormState = {
  id: "",
  title: "",
  description: "",
  memoryDate: getToday(),
  visible: true,
  sortOrder: 0,
  mediaObjectId: "",
  imageUrl: "",
};

export default function MemoriesManager({ onChanged, onToast }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [form, setForm] = useState<MemoryFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(form.id);

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    try {
      setLoading(true);
      const data = await getMemories();

      const sorted = [...data].sort((a, b) => {
        const sortA = a.sortOrder ?? 0;
        const sortB = b.sortOrder ?? 0;

        if (sortA !== sortB) return sortA - sortB;

        const dateA = a.memoryDate ? new Date(a.memoryDate).getTime() : 0;
        const dateB = b.memoryDate ? new Date(b.memoryDate).getTime() : 0;

        return dateB - dateA;
      });

      setMemories(sorted);
    } catch (error) {
      console.error("Failed to load memories:", error);
      onToast?.("error", "Failed to load memories");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      memoryDate: getToday(),
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function editMemory(memory: MemoryItem) {
    setForm({
      id: memory.id,
      title: memory.title || "",
      description: memory.description || "",
      memoryDate: memory.memoryDate || getToday(),
      visible: memory.visible ?? true,
      sortOrder: memory.sortOrder ?? 0,
      mediaObjectId: memory.mediaObjectId || "",
      imageUrl: memory.imageUrl || "",
    });
  }

  async function saveMemory() {
    if (!form.title.trim()) {
      onToast?.("error", "Please enter a memory title");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        mediaObjectId: form.mediaObjectId || null,
        title: form.title.trim(),
        description: form.description.trim(),
        memoryDate: form.memoryDate,
        visible: form.visible,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (isEditing) {
        await updateMemory(form.id, payload);
        onToast?.("success", "Memory updated successfully 💗");
      } else {
        await createMemory(payload);
        onToast?.("success", "Memory created successfully 💗");
      }

      resetForm();
      await loadMemories();
      onChanged?.();
    } catch (error) {
      console.error("Failed to save memory:", error);
      onToast?.(
        "error",
        error instanceof Error ? error.message : "Failed to save memory"
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeMemory(id: string) {
    const confirmed = window.confirm("Delete this memory?");
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteMemory(id);

      onToast?.("success", "Memory deleted successfully");
      await loadMemories();
      onChanged?.();

      if (form.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Failed to delete memory:", error);
      onToast?.("error", "Failed to delete memory");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageChange(files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      setSaving(true);

      const uploaded = await uploadMedia(files[0], "user-portal/memories");

      setForm((current) => ({
        ...current,
        mediaObjectId: uploaded.mediaObjectId,
        imageUrl: uploaded.imageUrl,
      }));

      onToast?.("success", "Memory image uploaded successfully 🖼");
    } catch (error) {
      console.error("Failed to upload memory image:", error);
      onToast?.("error", "Failed to upload memory image");
    } finally {
      setSaving(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <section className="gallery-card memories-manager-card">
      <div className="section-header memories-header">
        <div>
          <h2>Memories Management 💌</h2>
          <p>Create, edit, and organize your beautiful memories</p>
        </div>

        <button className="primary-button" type="button" onClick={resetForm}>
          ＋ New Memory
        </button>
      </div>

      <div className="memory-editor-grid">
        <form
          className="memory-editor-card"
          onSubmit={(event) => {
            event.preventDefault();
            saveMemory();
          }}
        >
          <div className="memory-editor-title">
            <div>
              <h3>{isEditing ? "Edit Memory" : "Create Memory"}</h3>
              <p>
                {isEditing
                  ? "Update the selected memory below."
                  : "Add a new memory to the user portal."}
              </p>
            </div>

            {isEditing && (
              <button className="outline-button tiny" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <label className="memory-field">
            <span>Title</span>
            <input
              value={form.title}
              placeholder="Our First Date"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </label>

          <label className="memory-field">
            <span>Description</span>
            <textarea
              rows={5}
              value={form.description}
              placeholder="Write a short romantic memory..."
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </label>

          <div className="memory-form-row">
            <label className="memory-field">
              <span>Memory Date</span>
              <input
                type="date"
                value={form.memoryDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    memoryDate: event.target.value,
                  }))
                }
              />
            </label>

            <label className="memory-field">
              <span>Sort Order</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>

          <label className="memory-visible-toggle">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  visible: event.target.checked,
                }))
              }
            />
            <span>
              <b>Show on user portal</b>
              <small>
                {form.visible
                  ? "Visible to visitors"
                  : "Hidden from public page"}
              </small>
            </span>
          </label>

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(event.target.files)}
          />

          <div className="memory-image-preview">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt={form.title || "Memory"} />
            ) : (
              <div className="memory-image-empty">
                <span>♡</span>
                <p>No image selected</p>
              </div>
            )}
          </div>

          <div className="memory-editor-actions">
            <button
              className="outline-button"
              type="button"
              disabled={saving}
              onClick={() => fileInputRef.current?.click()}
            >
              🖼 Upload Image
            </button>

            <button
              className="primary-button small"
              type="submit"
              disabled={saving || !form.title.trim()}
            >
              {saving ? "Saving..." : isEditing ? "Save Memory" : "Create Memory"}
            </button>
          </div>
        </form>

        <div className="memory-list-card">
          <div className="memory-list-title">
            <div>
              <h3>All Memories</h3>
              <p>Choose a memory to edit or remove it.</p>
            </div>
            <span>{memories.length}</span>
          </div>

          {loading ? (
            <div className="memory-loading-box">Loading memories...</div>
          ) : memories.length === 0 ? (
            <div className="empty-memory-list">
              <span>💌</span>
              <h3>No memories yet</h3>
              <p>Create your first memory to show it on the user portal.</p>
            </div>
          ) : (
            <div className="memory-admin-list">
              {memories.map((memory) => (
                <article
                  className={`memory-admin-item ${
                    form.id === memory.id ? "selected" : ""
                  }`}
                  key={memory.id}
                >
                  <div className="memory-admin-thumb">
                    {memory.imageUrl ? (
                      <img src={memory.imageUrl} alt={memory.title} />
                    ) : (
                      <span>♡</span>
                    )}
                  </div>

                  <div className="memory-admin-info">
                    <h4>{memory.title || "Untitled Memory"}</h4>
                    <p>{memory.description || "No description"}</p>

                    <div className="memory-admin-meta">
                      <span>▣ {memory.memoryDate || "-"}</span>
                      <span>Order: {memory.sortOrder ?? 0}</span>
                      <b className={memory.visible ? "visible" : "hidden"}>
                        {memory.visible ? "Visible" : "Hidden"}
                      </b>
                    </div>
                  </div>

                  <div className="memory-admin-actions">
                    <button type="button" onClick={() => editMemory(memory)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-soft"
                      onClick={() => removeMemory(memory.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}