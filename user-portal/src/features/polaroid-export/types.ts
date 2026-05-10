export type PolaroidExportPayload = {
  imageUrl: string;
  caption?: string;
  date?: string;
  fileName?: string;
};

export type PolaroidTemplatePayload = {
  imageUrl: string;
  caption: string;
  date: string;
};