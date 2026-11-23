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

function du(bien: BienNhan | null): boolean {
  if (!bien) return false;
  return [bien.lenh, bien.file, bien.hash, bien.gio].every((muc) => muc.trim().length > 0);
}

function mauNguoi(chu: string): boolean {
  return chu.includes("Thao tác em cần làm") && chu.includes("Tuyệt đối không") && chu.includes("Vì");
}

export function chanDauRa(chu: string, bien: BienNhan | null): { qua: boolean; ly: string } {
  if (du(bien)) return { qua: true, ly: "Có lệnh, tệp, hash, giờ." };
  if (mauNguoi(chu)) return { qua: true, ly: "Thao tác của người, không phải bước của tác nhân." };
  const thuong = chu.toLowerCase();
  const gap = CAM.find((muc) => thuong.includes(muc));
  if (gap) return { qua: false, ly: `Chặn «${gap}». Không có biên nhận việc.` };
  if (!chu.trim()) return { qua: false, ly: "Trống. Không có việc." };
  return { qua: false, ly: "Lời không kèm lệnh, tệp, hash, giờ." };
}
