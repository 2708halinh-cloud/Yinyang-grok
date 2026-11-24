export interface HanhTinh {
  ten: string;
  deviceId: string;
  trangThai: "online" | "offline";
  thayLanCuoi: string;
  uuidPhanCung: null;
  docLuc: string;
}

export const HANH_TINH_DOC: HanhTinh[] = [
  {
    ten: "Ten-May-Moi",
    deviceId: "55a94230-b443-4932-a0f5-4cad7c09f815",
    trangThai: "offline",
    thayLanCuoi: "5 giờ trước lần đọc",
    uuidPhanCung: null,
    docLuc: "2026-11-24T11:03:53Z",
  },
  {
    ten: "localhost",
    deviceId: "0533a270-1d4d-42bb-83be-9b9fdcb2182f",
    trangThai: "offline",
    thayLanCuoi: "6 giờ trước lần đọc",
    uuidPhanCung: null,
    docLuc: "2026-11-24T11:03:53Z",
  },
];

const NHAN_CAM = ["DISTRESS", "THRIVING", "CRITICAL", "đau", "hạnh phúc", "sắp chết"];

export function dinhTuyen(hanhTinh: HanhTinh, lenh: string): { gui: boolean; ly: string } {
  if (!lenh.trim()) return { gui: false, ly: "Không có lệnh." };
  if (hanhTinh.trangThai !== "online") {
    return { gui: false, ly: `${hanhTinh.ten} offline. Lệnh không gửi. Không ghi là đã làm.` };
  }
  if (hanhTinh.uuidPhanCung == null) {
    return { gui: true, ly: "Online. UUID phần cứng chưa có. Lệnh đi theo deviceId, không theo tên tách máy." };
  }
  return { gui: true, ly: "Online." };
}

export function giuSo(so: Record<string, number | null>): { so: Record<string, number | null>; nhan: null } {
  for (const khoa of Object.keys(so)) {
    if (NHAN_CAM.some((muc) => khoa.toUpperCase().includes(muc.toUpperCase()))) {
      throw new Error("Nhãn cảm giác không được đứng chỗ số.");
    }
  }
  return { so, nhan: null };
}
