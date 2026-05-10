import { useState } from "react";
import { downloadPolaroidImage } from "./polaroidCapture";
import type { PolaroidExportPayload } from "./types";

type SavePolaroidButtonProps = PolaroidExportPayload & {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function SavePolaroidButton({
  imageUrl,
  caption,
  date,
  fileName,
  className = "primary-button small",
  disabled = false,
  children = "📸 Save Polaroid",
}: SavePolaroidButtonProps) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving || disabled || !imageUrl) {
      return;
    }

    try {
      setSaving(true);

      await downloadPolaroidImage({
        imageUrl,
        caption,
        date,
        fileName,
      });
    } catch (error) {
      console.error("Failed to save polaroid:", error);
      window.alert(
        "Failed to save polaroid. Please check image URL or CORS settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || saving || !imageUrl}
      onClick={handleSave}
    >
      {saving ? "Saving..." : children}
    </button>
  );
}