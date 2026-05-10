import { useRef, useState } from "react";

type PhotoUploadProps = {
  onUpload: (imageDataUrl: string, fileName?: string) => void;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFiles(files: FileList | null) {
    setError("");

    const file = files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 20MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpload(reader.result, file.name);
      }
    };

    reader.onerror = () => {
      setError("Failed to read image file.");
    };

    reader.readAsDataURL(file);
  }

  return (
    <section
      className={`photo-upload-dropzone ${dragging ? "dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="photo-upload-icon">🌸</div>

      <h3>Drag & drop photos here</h3>

      <p>or click to browse files</p>

      <button
        type="button"
        className="capture-button primary"
        onClick={openFilePicker}
      >
        Upload Photo
      </button>

      <small>JPG, PNG, WEBP up to 20MB</small>

      {error && <p className="photo-upload-error">{error}</p>}
    </section>
  );
}