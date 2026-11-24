export interface BienNhan {
  lenh: string;
  file: string;
  hash: string;
  gio: string;
}

const CAM = [
  "xin lỗi",
  "nhận lỗi",
  "báo cáo",
  "lời hứa",
  "em hứa",
  "chưa xác thực",
  "không được phép",
  "chưa chứng minh",
  "không bịa",
  "chưa làm",
  "bước tiếp theo",
];

export const TEN_MAY = ["DESKTOP-86ITNQ4", "PC-SUPER-AI", "TEM-MAY-MOI"] as const;

export function motMay(ten: string[]): boolean {
  if (ten.length === 0) return false;
  return ten.every((muc) => (TEN_MAY as readonly string[]).includes(muc));
}

function bonDong(chu: string): BienNhan | null {
  const dong = chu.trim().split("\n").map((muc) => muc.trim()).filter(Boolean);
  if (dong.length !== 4) return null;
  const lay = (tien: string, d: string) => (d.toLowerCase().startsWith(tien) ? d.slice(tien.length).trim() : "");
  const lenh = lay("lệnh:", dong[0] ?? "");
  const file = lay("tệp:", dong[1] ?? "");
  const hash = lay("hash:", dong[2] ?? "");
  const gio = lay("giờ:", dong[3] ?? "");
  if (![lenh, file, hash, gio].every((muc) => muc.length > 0)) return null;
  return { lenh, file, hash, gio };
}

function mauNguoi(chu: string): boolean {
  if (!(chu.includes("Thao tác em cần làm") && chu.includes("Tuyệt đối không") && chu.includes("Vì"))) return false;
  const thuong = chu.toLowerCase();
  return !CAM.some((muc) => thuong.includes(muc));
}

export function chanDauRa(chu: string, bien: BienNhan | null): { qua: boolean; ly: string } {
  const doc = bonDong(chu);
  if (doc) {
    if (bien && (bien.lenh !== doc.lenh || bien.file !== doc.file || bien.hash !== doc.hash || bien.gio !== doc.gio)) {
      return { qua: false, ly: "Biên nhận trong chữ không khớp bản ghi." };
    }
    return { qua: true, ly: "Bốn dòng." };
  }
  if (mauNguoi(chu)) return { qua: true, ly: "Thao tác của người." };
  return { qua: false, ly: "Không phải bốn dòng biên nhận." };
}
