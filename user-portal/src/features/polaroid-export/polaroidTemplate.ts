import type { PolaroidTemplatePayload } from "./types";

export function createPolaroidTemplate({
  imageUrl,
  caption,
  date,
}: PolaroidTemplatePayload) {
  return `
    <div style="
      width: 900px;
      height: 1200px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 18% 10%, rgba(255,255,255,.85), transparent 18%),
        radial-gradient(circle at 86% 20%, rgba(255,210,225,.72), transparent 22%),
        linear-gradient(135deg, #ffd8e5, #fff4f8);
      font-family: Poppins, Arial, sans-serif;
      box-sizing: border-box;
      padding: 70px;
      color: #3d2b2f;
    ">
      <main style="
        width: 660px;
        min-height: 900px;
        background: #fffaf7;
        padding: 34px 34px 72px;
        border-radius: 18px;
        box-shadow: 0 34px 90px rgba(120, 60, 75, 0.28);
        transform: rotate(-2deg);
        box-sizing: border-box;
        position: relative;
      ">
        <div style="
          width: 100%;
          height: 620px;
          border-radius: 10px;
          overflow: hidden;
          background: #ffe5ee;
          box-shadow: inset 0 0 0 1px rgba(120,60,75,.12);
        ">
          <img
            src="${imageUrl}"
            alt="${caption}"
            crossorigin="anonymous"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            "
          />
        </div>

        <section style="
          padding: 38px 10px 0;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #3d2b2f;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 44px;
            line-height: 1.1;
          ">
            ${caption}
          </h1>

          <p style="
            margin: 18px 0 0;
            color: #d86778;
            font-family: 'Great Vibes', cursive;
            font-size: 38px;
            line-height: 1;
          ">
            ${date}
          </p>
        </section>

        <div style="
          position: absolute;
          left: 30px;
          bottom: 24px;
          color: rgba(216,103,120,.55);
          font-size: 28px;
        ">♡</div>

        <div style="
          position: absolute;
          right: 30px;
          bottom: 24px;
          color: rgba(216,103,120,.55);
          font-size: 28px;
        ">♡</div>
      </main>
    </div>
  `;
}