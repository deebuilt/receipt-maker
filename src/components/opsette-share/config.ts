export type OpsetteShareConfig = {
  appName: string;
  tagline: string;
  url: string;
  logoSrc?: string;
};

export const opsetteShareConfig: OpsetteShareConfig = {
  appName: "Receipt Maker",
  tagline: "Generate clean, printable receipts.",
  url: "https://tools.opsette.io/receipt-maker/",
  logoSrc: "opsette-logo.png",
};
