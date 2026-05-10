import { useEffect, useRef, useState } from "react";

type CameraCaptureProps = {
  onCapture: (imageDataUrl: string) => void;
};

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  async function openCamera() {
    try {
      setCameraError("");
      setCameraReady(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      console.error("Failed to open camera:", error);
      setCameraError(
        "Cannot open camera. Please allow camera permission and use HTTPS."
      );
    }
  }

  async function attachStreamToVideo() {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) {
      return;
    }

    try {
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;

      await video.play();

      setCameraReady(true);
    } catch (error) {
      console.error("Failed to play camera stream:", error);
      setCameraError("Camera opened but video preview could not start.");
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setCameraReady(false);
  }

  function capturePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is not ready yet. Please wait a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    const size = Math.min(video.videoWidth, video.videoHeight);

    const sourceX = (video.videoWidth - size) / 2;
    const sourceY = (video.videoHeight - size) / 2;

    canvas.width = 1200;
    canvas.height = 1200;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Cannot capture photo from camera.");
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(
      video,
      sourceX,
      sourceY,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageDataUrl = canvas.toDataURL("image/png", 1.0);

    onCapture(imageDataUrl);
    closeCamera();
  }

  useEffect(() => {
    if (!cameraOpen) {
      return;
    }

    attachStreamToVideo();
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);

  return (
    <section className="camera-capture-panel">
      {!cameraOpen ? (
        <div className="camera-start-card">
          <div className="camera-start-icon">📷</div>

          <h3>Take a New Photo</h3>

          <p>
            Open your camera and capture a brand new moment for your Polaroid.
          </p>

          <button
            type="button"
            className="capture-button primary"
            onClick={openCamera}
          >
            📸 Open Camera
          </button>

          {cameraError && <p className="camera-error">{cameraError}</p>}
        </div>
      ) : (
        <div className="camera-live-card">
          <div className="camera-video-frame">
            {!cameraReady && (
              <div className="camera-loading-overlay">
                <span>📷</span>
                <p>Starting camera...</p>
              </div>
            )}

            <video
              ref={videoRef}
              className="camera-live-video"
              autoPlay
              playsInline
              muted
              onLoadedMetadata={attachStreamToVideo}
            />
          </div>

          <div className="camera-live-actions">
            <button
              type="button"
              className="capture-button soft"
              onClick={closeCamera}
            >
              Cancel
            </button>

            <button
              type="button"
              className="capture-button primary"
              disabled={!cameraReady}
              onClick={capturePhoto}
            >
              📸 Take Photo
            </button>
          </div>

          {cameraError && <p className="camera-error">{cameraError}</p>}
        </div>
      )}
    </section>
  );
}