export type GenerateProposalPayload = {
  siteKey: string;
  title: string;
  subtitle: string;
  message: string;
  askedBy: string;
  acceptedBy: string;
  acceptedDate: string;
};

export type GenerateProposalResponse = {
  referenceNo: string;
  fileName: string;
  downloadUrl: string;
  sizeBytes: number;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://api.n9ne.cc";

export async function generateProposal(
  payload: GenerateProposalPayload
): Promise<GenerateProposalResponse> {
  const response = await fetch(`${API_BASE_URL}/api/public/proposals/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to generate proposal");
  }

  return response.json();
}