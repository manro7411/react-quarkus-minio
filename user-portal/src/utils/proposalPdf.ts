import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { ProposalSignature } from "../types/site";
import { formatFileDate } from "./date";
import { createProposalCertificateTemplate } from "./proposalCertificateTemplate";

export async function downloadProposalPdf(proposal: ProposalSignature) {
  const acceptedDate = new Date(proposal.acceptedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const safeAskedBy = escapeHtml(proposal.askedBy);
  const safeAcceptedBy = escapeHtml(proposal.acceptedBy);
  const safeTitle = escapeHtml(proposal.title);
  const safeMessage = escapeHtml(proposal.message);

  const certificate = document.createElement("div");

  certificate.style.position = "fixed";
  certificate.style.left = "-10000px";
  certificate.style.top = "0";
  certificate.style.width = "794px";
  certificate.style.height = "1123px";
  certificate.style.overflow = "hidden";
  certificate.style.background = "#ffd8e5";
  certificate.style.padding = "48px";
  certificate.style.boxSizing = "border-box";
  certificate.style.zIndex = "-1";

  certificate.innerHTML = createProposalCertificateTemplate({
    safeTitle,
    safeMessage,
    safeAskedBy,
    safeAcceptedBy,
    acceptedDate,
  });

  document.body.appendChild(certificate);

  try {
    await document.fonts.ready;

    const canvas = await html2canvas(certificate, {
      scale: 2,
      backgroundColor: "#ffd8e5",
      useCORS: true,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageData = canvas.toDataURL("image/png", 1.0);

    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);

    pdf.save(
      `official-love-proposal-${formatFileDate(proposal.acceptedAt)}.pdf`
    );
  } finally {
    certificate.remove();
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}