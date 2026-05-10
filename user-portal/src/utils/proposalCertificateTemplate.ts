type ProposalCertificateTemplateParams = {
  safeTitle: string;
  safeMessage: string;
  safeAskedBy: string;
  safeAcceptedBy: string;
  acceptedDate: string;
};

export function createProposalCertificateTemplate({
  safeTitle,
  safeMessage,
  safeAskedBy,
  safeAcceptedBy,
  acceptedDate,
}: ProposalCertificateTemplateParams) {
  return `
    <div style="
      width: 698px;
      height: 1027px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 16% 12%, rgba(255,255,255,.75), transparent 18%),
        radial-gradient(circle at 84% 18%, rgba(255,210,225,.72), transparent 22%),
        linear-gradient(135deg, #ffd8e5, #fff1f6);
      color: #3d2b2f;
      font-family: Poppins, Arial, sans-serif;
    ">
      <main style="
        position: relative;
        width: 620px;
        height: 930px;
        padding: 48px 48px 34px;
        border-radius: 26px;
        text-align: center;
        background:
          linear-gradient(rgba(255,250,245,.94), rgba(255,250,245,.94)),
          radial-gradient(circle at 50% 0%, rgba(255,199,211,.30), transparent 36%);
        border: 1.5px solid rgba(232,142,126,.58);
        box-shadow: 0 24px 70px rgba(125,63,74,.18);
        overflow: hidden;
        box-sizing: border-box;
      ">
        <div style="
          position: absolute;
          top: 20px;
          left: 22px;
          color: rgba(232,112,132,.72);
          font-size: 24px;
          line-height: 1;
        ">♡</div>

        <div style="
          position: absolute;
          right: 22px;
          bottom: 20px;
          color: rgba(232,112,132,.72);
          font-size: 24px;
          line-height: 1;
        ">♡</div>

        <div style="font-size:34px;line-height:1;margin-bottom:18px;">
          💗
        </div>

        <h1 style="
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 46px;
          line-height: .95;
          color: #3b252b;
          letter-spacing: -1.4px;
        ">${safeTitle}</h1>

        <h2 style="
          margin: 8px 0 24px;
          font-family: 'Great Vibes', cursive;
          font-size: 36px;
          font-weight: 400;
          line-height: 1;
          color: #e76d86;
        ">Will you be my girlfriend?</h2>

        <p style="
          margin: 0 auto 24px;
          max-width: 500px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 14px;
          line-height: 1.45;
          color: #3e2d31;
        ">
          ${safeMessage}<br />
          If you say yes, I promise to cherish you, make you smile,
          and create beautiful memories together.
        </p>

        <section style="
          position: relative;
          margin: 0 auto 28px;
          max-width: 460px;
          padding: 30px 30px 16px;
          border-radius: 14px;
          border: 1px solid rgba(232,142,126,.56);
          background: rgba(255,246,239,.58);
          box-sizing: border-box;
        ">
          <div style="
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 200px;
            padding: 8px 18px;
            border-radius: 999px;
            background: #ffe1da;
            border: 1px solid rgba(232,142,126,.38);
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16px;
            font-weight: 700;
            color: #3d2b2f;
            box-sizing: border-box;
          ">♥ Terms of Our Love ♥</div>

          <ol style="
            margin: 0;
            padding-left: 18px;
            text-align: left;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.8;
            color: #2f2226;
          ">
            <li>Good morning and good night texts</li>
            <li>Unlimited hugs and support</li>
            <li>Random treats and little surprises</li>
            <li>Listening to your stories and dreams</li>
            <li>Making lovely memories together</li>
          </ol>
        </section>

        <section>
          <h3 style="
            display: inline-block;
            margin: 0 0 14px;
            padding: 8px 28px;
            border-radius: 999px;
            background: #ffe1da;
            border: 1px solid rgba(232,142,126,.35);
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            color: #3d2b2f;
          ">Agreement</h3>

          <p style="
            margin: 0;
            color: #4f4045;
            font-size: 11px;
            font-family: Poppins, Arial, sans-serif;
          ">By signing below, we agree to start a lovely story together.</p>
        </section>

        <section style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 34px;
          margin: 26px auto 14px;
          max-width: 480px;
        ">
          <div style="
            text-align: left;
            color: #d86778;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
          ">
            Asked by
            <div style="
              margin-top: 8px;
              padding: 8px 4px 10px;
              border-bottom: 1.5px solid rgba(232,142,126,.45);
              color: #3b252b;
              font-family: 'Great Vibes', cursive;
              font-size: 24px;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${safeAskedBy}</div>
          </div>

          <div style="
            text-align: left;
            color: #d86778;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
          ">
            Accepted by
            <div style="
              margin-top: 8px;
              padding: 8px 4px 10px;
              border-bottom: 1.5px solid rgba(232,142,126,.45);
              color: #3b252b;
              font-family: 'Great Vibes', cursive;
              font-size: 24px;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${safeAcceptedBy}</div>
          </div>
        </section>

        <div style="
          margin-top: 12px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 12px;
          color: #3d2b2f;
        ">
          Date: <strong>${acceptedDate}</strong>
        </div>

        <p style="
          margin: 22px 0 0;
          font-family: 'Great Vibes', cursive;
          font-size: 20px;
          line-height: 1;
          color: #d86778;
        ">
          No expiration. Valid for a lifetime of affection.
        </p>
      </main>
    </div>
  `;
}