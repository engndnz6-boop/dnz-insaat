/** Sitedeki teklif formundan gelen talepler (OneDrive: teklif-talepleri.json) */
export const QUOTES_FILE = "teklif-talepleri.json";

export type QuoteStatus = "yeni" | "arandi" | "teklif-verildi" | "kapandi";

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  yeni: "Yeni",
  arandi: "Arandı",
  "teklif-verildi": "Teklif verildi",
  kapandi: "Kapandı",
};

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  topic: string;
  location?: string;
  message: string;
  status: QuoteStatus;
  note?: string;
}

export type QuotesFile = { quotes: QuoteRequest[] };
