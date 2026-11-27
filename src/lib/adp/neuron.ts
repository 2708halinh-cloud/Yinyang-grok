const CAM = [/w:macro[\s\S]*?<\/w:macros>/gi, /<w:binData[\s\S]*?<\/w:binData>/gi, /<script[\s\S]*?<\/script>/gi, /javascript:/gi];

export const NHA = {
  tay: ["home/tools", "home/connectors", "home/config"],
  nao: ["home/brain/live_context", "home/brain/short_term_memory", "home/brain/long_term_memory"],
} as const;

export function loc(chu: string): string {
  let ra = chu;
  for (const mau of CAM) ra = ra.replace(mau, "");
  return ra;
}

export function chuTuDocx(xml: string): string {
  const manh: string[] = [];
  const mau = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let khop: RegExpExecArray | null;
  while ((khop = mau.exec(xml))) manh.push(khop[1] ?? "");
  return loc(manh.join(""));
}

async function bam(chu: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(chu));
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function dong(chu: string, ramMb: number, cpu: number): Promise<string> {
  const duong = loc(chu);
  const yin = await bam(duong);
  const tom = `${duong.length} ${yin.slice(0, 16)}`;
  return `YYAD\nRAM ${ramMb}\nCPU ${cpu}\nTOM ${tom}\nYIN ${yin}\nDUONG\n${duong}`;
}

export async function mo(tep: string, tranRam: number): Promise<{ tomTat: string; duong: string | null; ly: string }> {
  const dongVan = tep.split("\n");
  if (dongVan[0] !== "YYAD") return { tomTat: "", duong: null, ly: "Khong phai adp" };
  const ram = Number(dongVan[1]?.slice(4) ?? "0");
  const tomTat = dongVan[3]?.slice(4) ?? "";
  const yin = dongVan[4]?.slice(4) ?? "";
  const moc = tep.indexOf("\nDUONG\n");
  const duong = moc < 0 ? "" : tep.slice(moc + "\nDUONG\n".length);
  if ((await bam(duong)) !== yin) return { tomTat, duong: null, ly: "Lech" };
  if (ram > tranRam) return { tomTat, duong: null, ly: "Qua ram" };
  return { tomTat, duong, ly: "Khop" };
}

export function ghiDai(kho: Record<string, string>, khoa: string, chu: string, laFact: boolean): Record<string, string> {
  if (!laFact || khoa in kho) return kho;
  return { ...kho, [khoa]: chu };
}
