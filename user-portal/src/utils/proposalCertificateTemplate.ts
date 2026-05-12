type ProposalCertificateTemplateParams = {
  safeTitle: string;
  safeMessage: string;
  safeAskedBy: string;
  safeAcceptedBy: string;
  acceptedDate: string;
};

/**
 * ใช้ background image เป็น template หลัก
 *
 * ต้องวางรูปไว้ให้ browser/exporter เข้าถึงได้ เช่น:
 * public/images/proposal-bg.png
 *
 * ถ้าใช้ path อื่น ให้แก้ PROPOSAL_BG_URL ด้านล่าง
 */
const PROPOSAL_BG_URL = "/images/proposal-bg.png";

export function createProposalCertificateTemplate({
  safeAskedBy,
  safeAcceptedBy,
  acceptedDate,
}: ProposalCertificateTemplateParams) {
  return `
    <div style="
      width: 698px;
      height: 1027px;
      position: relative;
      overflow: hidden;
      background: #fff8f2;
      font-family: 'Playfair Display', Georgia, serif;
      color: #3b252b;
    ">
      <img
        src="${PROPOSAL_BG_URL}"
        alt="Official Love Proposal"
        style="
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        "
      />

      <!-- Asked by -->
      <div style="
        position: absolute;
        left: 107px;
        top: 853px;
        width: 222px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3b252b;
        font-family: 'Great Vibes', cursive;
        font-size: 26px;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      ">
        ${safeAskedBy || ""}
      </div>

      <!-- Accepted by -->
      <div style="
        position: absolute;
        left: 438px;
        top: 853px;
        width: 222px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3b252b;
        font-family: 'Great Vibes', cursive;
        font-size: 26px;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      ">
        ${safeAcceptedBy || ""}
      </div>

      <!-- Date -->
      <div style="
        position: absolute;
        left: 294px;
        top: 920px;
        width: 190px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2e2024;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        text-align: center;
      ">
        ${acceptedDate || ""}
      </div>
    </div>
  `;
}