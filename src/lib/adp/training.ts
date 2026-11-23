export const SO_DANG_KY = {
  repo: "2708halinh-cloud/SOL-LONG-MACH",
  path: "CONFIG_SOL/ENVIRONMENT_COORDINATE_REGISTRY.json",
  blob: "9ffdc2da742bd9ad07fbdfb8b27fcd8c8cf8b74e",
  dat: "Tọa độ đất trong sổ đang để trống. Không lấy chữ mới ghi đè sổ.",
} as const;

export const NEO_CHU = {
  viet: "10°20'52.07\"N 107°04'27.83\"E",
  soTrongLink: "10.34780096, 107.07439497",
  kml: "G:\\OS_Workspace\\Coaching\\Ha_Linh_Earth.kml",
  docLaiKml: false,
  thayTheSoDoDat: false,
} as const;

export const BA = {
  nangLuong: "Năng lượng là lực. Nó trôi và đổi theo từng khoảnh khắc.",
  suThat: "Sự thật là mạch nhân tới quả. Khoảnh khắc khép thì sự kiện khép.",
  vatMang: "Thời gian và vật mang ở giữa ôm cả hai, kể cả khi chúng nghịch. Không cực nào bị xóa.",
} as const;

export interface Nhip {
  tocDoGo: number | null;
  tiLeXoa: number | null;
  ngatQuangGiay: number | null;
}

export function giuNhip(nhip: Nhip): { so: Nhip; nhanTamLy: null } {
  return { so: nhip, nhanTamLy: null };
}

export interface O {
  ten: string;
  chu: string;
}

export interface ThuXoa {
  that: readonly O[];
  nhanh: O[];
  mat: string[];
  chapNhanThat: false;
  lyDo: string;
}

export function thuXoa(o: readonly O[], ten: string): ThuXoa {
  const mat = o.filter((tep) => tep.ten === ten).map((tep) => tep.ten);
  const nhanh = o.filter((tep) => tep.ten !== ten).map((tep) => ({ ...tep }));
  return {
    that: o,
    nhanh,
    mat,
    chapNhanThat: false,
    lyDo: mat.length
      ? "Nhánh thấy mất byte. Không hợp nhất vào bản thật."
      : "Nhánh không thấy tệp đó.",
  };
}

export interface Tem {
  loai: "STAMP_OUTPUT";
  tacGia: "may";
  tacNhan: "Grok";
  nen: "sandbox-grok";
  luc: string;
  n: number;
  noiDung: string;
  chuKyNguoi: null;
  canhBao: string;
}

export function temMay(noiDung: string, n: number, luc: string): Tem {
  return {
    loai: "STAMP_OUTPUT",
    tacGia: "may",
    tacNhan: "Grok",
    nen: "sandbox-grok",
    luc,
    n,
    noiDung,
    chuKyNguoi: null,
    canhBao: "Không có chữ ký người. Dòng này là của máy.",
  };
}

export interface Tay {
  ra: string;
  soMa: number;
}

export function tay(chu: string): Tay {
  let soMa = 0;
  const ra = chu
    .replace(/\b\d{12}\b/gu, () => {
      soMa += 1;
      return "[SO_12]";
    })
    .replace(/\b0\d{9}\b/gu, () => {
      soMa += 1;
      return "[SO_10]";
    });
  return { ra, soMa };
}

export interface CongCu {
  ten: string;
  coTrenBanNay: boolean;
  ghi: string;
}

export const CONG_CU: CongCu[] = [
  { ten: "node", coTrenBanNay: true, ghi: "Có trên bàn này. Không phải node.exe 89.4 MB của bộ Codex." },
  { ten: "python", coTrenBanNay: true, ghi: "Có Python 3.10. Không phải bộ Python 3.12 kèm pdfplumber của Codex." },
  { ten: "git", coTrenBanNay: true, ghi: "Có git của bàn này. Không phải bộ portable git.exe vừa kể." },
  { ten: "qemu", coTrenBanNay: false, ghi: "Không có. Nhớ tương lai ở đây là nhánh trong bộ nhớ, không phải VM." },
  { ten: "pwsh", coTrenBanNay: false, ghi: "Không có PowerShell 7 trên bàn này." },
  { ten: "tectonic", coTrenBanNay: false, ghi: "Không có." },
];

export const TANG = [
  "Nguồn",
  "Tiền xử lý",
  "Huấn luyện",
  "Đánh giá",
  "Triển khai",
  "Giám sát",
] as const;

export type LoaiNhip = "giu" | "cach" | "xoa";

export interface NhipSuKien {
  loai: LoaiNhip;
  ms: number;
}

export interface BaoNhip {
  soPhim: number;
  soXoa: number;
  tiLeXoa: number | null;
  giuGiua: number | null;
  cachGiua: number | null;
}

const NHIP_KEY = "xtime.nhip.v1";

function giua(so: number[]): number | null {
  if (so.length === 0) return null;
  const xep = [...so].sort((a, b) => a - b);
  const i = Math.floor(xep.length / 2);
  if (xep.length % 2 === 1) return xep[i]!;
  return (xep[i - 1]! + xep[i]!) / 2;
}

export function gomNhip(ds: NhipSuKien[]): BaoNhip {
  const giu = ds.filter((muc) => muc.loai === "giu" || muc.loai === "xoa");
  const xoa = ds.filter((muc) => muc.loai === "xoa");
  const cach = ds.filter((muc) => muc.loai === "cach");
  const soPhim = giu.length;
  return {
    soPhim,
    soXoa: xoa.length,
    tiLeXoa: soPhim === 0 ? null : xoa.length / soPhim,
    giuGiua: giua(giu.map((muc) => muc.ms)),
    cachGiua: giua(cach.map((muc) => muc.ms)),
  };
}

export function khoangNhip(a: BaoNhip, b: BaoNhip): number | null {
  if (a.soPhim < 4 || b.soPhim < 4) return null;
  if (a.giuGiua == null || b.giuGiua == null || a.cachGiua == null || b.cachGiua == null) return null;
  if (a.tiLeXoa == null || b.tiLeXoa == null) return null;
  return Math.abs(a.giuGiua - b.giuGiua) + Math.abs(a.cachGiua - b.cachGiua) + Math.abs(a.tiLeXoa - b.tiLeXoa) * 100;
}

export function luuMauNhip(bao: BaoNhip): boolean {
  if (typeof localStorage === "undefined") return false;
  localStorage.setItem(NHIP_KEY, JSON.stringify(bao));
  return true;
}

export function docMauNhip(): BaoNhip | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(NHIP_KEY);
  if (!raw) return null;
  try {
    const bao = JSON.parse(raw) as Partial<BaoNhip>;
    if (typeof bao.soPhim !== "number") return null;
    return {
      soPhim: bao.soPhim,
      soXoa: typeof bao.soXoa === "number" ? bao.soXoa : 0,
      tiLeXoa: typeof bao.tiLeXoa === "number" ? bao.tiLeXoa : null,
      giuGiua: typeof bao.giuGiua === "number" ? bao.giuGiua : null,
      cachGiua: typeof bao.cachGiua === "number" ? bao.cachGiua : null,
    };
  } catch {
    return null;
  }
}

export function xoaMauNhip(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(NHIP_KEY);
}
