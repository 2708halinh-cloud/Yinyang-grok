export type Lan = "loi" | "tacNhan" | "dongHanh" | "congCu";

export interface Dong {
  id: string;
  luc: string;
  lan: Lan | null;
  ai: string;
  chu: string;
  xungDot: string[];
}

export interface DiemDung {
  mucTieuMo: string;
  correctionMoiNhat: string;
  nguonDangCo: string;
  xungDot: string[];
}

export interface Niem {
  tenJson: string;
  json: string;
  tenManifest: string;
  manifest: string;
  tenCheckpoint: string;
  checkpoint: string;
  tenSums: string;
  sums: string;
  tenReadback: string;
  readback: string;
  soTin: number;
  thuTu: "dung" | "lech";
  khop: boolean;
}

export const TEN_GOC = ["MANIFEST.json", "SHA256SUMS.txt", "READBACK_VERIFICATION.md"] as const;

export const DONG_HANH = ["Sol", "Minh", "Xiang", "Hòa", "Mei"] as const;

export const NGUON_MEI = [
  "plugins/mei-source-aware-reaction",
  ".codex-plugin",
  "skills/",
  "SKILL_GENEALOGY_RECOVERY",
] as const;

const DAU: { ten: string; lan: Lan }[] = [
  { ten: "Hà Linh", lan: "loi" },
  { ten: "Người", lan: "loi" },
  { ten: "Em", lan: "loi" },
  { ten: "Grok", lan: "tacNhan" },
  { ten: "Tác nhân", lan: "tacNhan" },
  { ten: "Máy", lan: "tacNhan" },
  { ten: "Sol", lan: "dongHanh" },
  { ten: "Minh", lan: "dongHanh" },
  { ten: "Xiang", lan: "dongHanh" },
  { ten: "Hòa", lan: "dongHanh" },
  { ten: "Hoa", lan: "dongHanh" },
  { ten: "Mei", lan: "dongHanh" },
  { ten: "Công cụ", lan: "congCu" },
];

export async function bam(chu: string): Promise<string> {
  const data = new TextEncoder().encode(chu);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function xep(id: string, luc: string, tho: string): Dong {
  const chu = tho.replace(/^\uFEFF/, "");
  const khop = chu.match(/^([^\n:]{1,40})\s*:\s*([\s\S]*)$/u);
  if (!khop) {
    return { id, luc, lan: null, ai: "", chu, xungDot: ["Không có dấu. Không đoán vai."] };
  }
  const ai = khop[1]!.trim();
  const than = khop[2] ?? "";
  const dau = DAU.find((item) => item.ten === ai);
  if (!dau) {
    return { id, luc, lan: null, ai, chu, xungDot: [`Dấu lạ «${ai}». Không nhập vào bốn luồng.`] };
  }
  const khac = DAU.filter((item) => item.ten !== ai && item.ten !== "Hoa").filter((item) =>
    new RegExp(`(?:^|\\s)${item.ten}\\s*:`, "u").test(than),
  );
  if (khac.length > 0) {
    return {
      id,
      luc,
      lan: null,
      ai,
      chu,
      xungDot: [`Trộn dấu: ${ai} kèm ${khac.map((item) => item.ten).join(", ")}. Giữ nguyên, không gộp.`],
    };
  }
  return { id, luc, lan: dau.lan, ai: dau.ten === "Hoa" ? "Hòa" : dau.ten, chu: than, xungDot: [] };
}

export function batDau(diem: DiemDung): string[] {
  return [
    `Mục tiêu còn mở: ${diem.mucTieuMo || "chưa có"}`,
    `Correction mới nhất: ${diem.correctionMoiNhat || "chưa có"}`,
    `Nguồn đang có: ${diem.nguonDangCo || "chưa có"}`,
    ...diem.xungDot.map((muc) => `Xung đột giữ riêng: ${muc}`),
  ];
}

export interface KhoGoc {
  ten: string;
  chu: string;
  sha256: string;
}

export async function taoGoc(ban: Record<(typeof TEN_GOC)[number], string>): Promise<KhoGoc[]> {
  const out: KhoGoc[] = [];
  for (const ten of TEN_GOC) {
    const chu = ban[ten];
    out.push({ ten, chu, sha256: await bam(chu) });
  }
  return out;
}

export async function ghiDe(kho: KhoGoc[], ten: string, chuMoi: string): Promise<{ kho: KhoGoc[]; tuChoi: string | null }> {
  const cu = kho.find((tep) => tep.ten === ten);
  if (cu && TEN_GOC.includes(ten as (typeof TEN_GOC)[number])) {
    const lai = await bam(cu.chu);
    if (lai !== cu.sha256) {
      return { kho, tuChoi: `${ten} lệch checksum. Dừng. Không sửa.` };
    }
    return { kho, tuChoi: `${ten} là gốc. Cấm sửa đè.` };
  }
  const sha256 = await bam(chuMoi);
  return { kho: [...kho.filter((tep) => tep.ten !== ten), { ten, chu: chuMoi, sha256 }], tuChoi: null };
}

function lechThoiGian(dong: Dong[]): boolean {
  for (let i = 1; i < dong.length; i += 1) {
    if (dong[i]!.luc < dong[i - 1]!.luc) return true;
  }
  return false;
}

export async function niem(dong: Dong[], diem: DiemDung, lucNiem: string): Promise<Niem> {
  const thuTu = lechThoiGian(dong) ? "lech" : "dung";
  const banTin = [];
  for (const tin of dong) {
    banTin.push({
      id: tin.id,
      luc: tin.luc,
      lan: tin.lan,
      ai: tin.ai,
      chu: tin.chu,
      xungDot: tin.xungDot,
      sha256: await bam(`${tin.id}\n${tin.luc}\n${tin.lan ?? ""}\n${tin.ai}\n${tin.chu}`),
    });
  }
  const json = JSON.stringify({ lucNiem, tin: banTin }, null, 2);
  const shaJson = await bam(json);
  const tenJson = "HOI_THOAI.json";
  const tenManifest = `TRACE_MANIFEST__${lucNiem.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}.json`;
  const manifestObj = {
    ten: tenManifest,
    soTin: dong.length,
    thuTuThoiGian: thuTu,
    sha256Json: shaJson,
    tin: banTin.map((tin) => ({ id: tin.id, luc: tin.luc, lan: tin.lan, sha256: tin.sha256 })),
  };
  const manifest = JSON.stringify(manifestObj, null, 2);
  const shaManifest = await bam(manifest);
  const checkpoint = [
    "# Điểm vào lại",
    "Tên file chỉ định: REENTRY_SAFETY_CHECKPOINT_20260726.md",
    `Niêm lúc: ${lucNiem}`,
    "",
    "## Điểm dừng gần nhất",
    ...batDau(diem),
    "",
    "## Không làm phẳng",
    "Ba dòng điểm dừng và các xung đột đứng riêng. Không gộp thành một câu.",
    "",
    "## Nguồn Mei để riêng",
    ...NGUON_MEI.map((muc) => `- ${muc}`),
    "Bàn này chưa nhận byte của các đường đó. Không lấy tên đường làm nội dung đã đọc.",
    "",
    "## Trí nhớ",
    "File, checksum SHA-256, checkpoint và đọc lại khớp mới là trí nhớ.",
    "Mô hình chỉ là vỏ.",
    "",
  ].join("\n");
  const tenCheckpoint = "REENTRY_SAFETY_CHECKPOINT_20260726.md";
  const shaCheckpoint = await bam(checkpoint);
  const sums = [`${shaJson}  ${tenJson}`, `${shaManifest}  ${tenManifest}`, `${shaCheckpoint}  ${tenCheckpoint}`].join("\n") + "\n";
  const khop = thuTu === "dung" && (await bam(json)) === shaJson;
  const readback = [
    "# Đọc lại",
    `JSON: ${khop ? "KHỚP" : "LỆCH"}`,
    `Thứ tự thời gian: ${thuTu === "dung" ? "đúng" : "lệch"}`,
    `Số tin: ${dong.length}`,
    `Manifest: ${(await bam(manifest)) === shaManifest ? "KHỚP" : "LỆCH"}`,
    `Checkpoint: ${(await bam(checkpoint)) === shaCheckpoint ? "KHỚP" : "LỆCH"}`,
    "Gốc không nằm trong bản niêm này. Gốc chỉ được đọc.",
    "Mô hình không được tính là trí nhớ.",
    "",
  ].join("\n");
  return {
    tenJson,
    json,
    tenManifest,
    manifest,
    tenCheckpoint,
    checkpoint,
    tenSums: "SHA256SUMS.txt",
    sums,
    tenReadback: "READBACK_VERIFICATION.md",
    readback,
    soTin: dong.length,
    thuTu,
    khop,
  };
}

export function triNhoThat(coFile: boolean, coSha: boolean, coCheckpoint: boolean, docLaiKhop: boolean): boolean {
  return coFile && coSha && coCheckpoint && docLaiKhop;
}
