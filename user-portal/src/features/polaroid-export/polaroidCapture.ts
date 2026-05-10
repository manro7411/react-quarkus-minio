import html2canvas from "html2canvas";
import { createPolaroidTemplate } from "./polaroidTemplate";
import type { PolaroidExportPayload } from "./types";

export async function downloadPolaroidImage({
  imageUrl,
  caption = "Our lovely memory",
  date = "",
  fileName = "polaroid-memory",
}: PolaroidExportPayload) {
  if (!imageUrl) {
    throw new Error("Missing image URL");
  }

  const container = document.createElement("div");

  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "900px";
  container.style.height = "1200px";
  container.style.overflow = "hidden";
  container.style.background = "#ffd8e5";
  container.style.zIndex = "-1";

  container.innerHTML = createPolaroidTemplate({
    imageUrl,
    caption: escapeHtml(caption),
    date: escapeHtml(date),
  });

  document.body.appendChild(container);

  try {
    await document.fonts.ready;
    await waitForImages(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      width: 900,
      height: 1200,
      windowWidth: 900,
      windowHeight: 1200,
      backgroundColor: "#ffd8e5",
      useCORS: true,
      allowTaint: false,
    });

    const image = canvas.toDataURL("image/png", 1.0);

    const link = document.createElement("a");
    link.href = image;
    link.download = `${sanitizeFileName(fileName)}.png`;
    link.click();
  } finally {
    container.remove();
  }
}

function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Failed to load image"));
      });
    })
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "polaroid-memory";
}