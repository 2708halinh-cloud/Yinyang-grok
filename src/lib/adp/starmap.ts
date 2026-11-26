export interface HanhTinh {
  ten: string;
  deviceId: string;
  trangThai: "online" | "offline";
  thayLanCuoi: string;
  uuidPhanCung: null;
  docLuc: string;
  tenTruoc?: string;
  computerName?: string;
  user?: string;
  machineGuid?: string;
  o?: string[];
  duong?: Record<string, boolean>;
}

export const HANH_TINH_DOC: HanhTinh[] = [
  {
    ten: "Super-AI-Flatform",
    tenTruoc: "Ten-May-Moi",
    computerName: "SUPER-AI-FLATFO",
    deviceId: "55a94230-b443-4932-a0f5-4cad7c09f815",
    trangThai: "online",
    user: "2708h",
    machineGuid: "258f867b-3096-4bdd-a526-8e1452c0c550",
    thayLanCuoi: "online, đọc 2026-11-26T00:19:00Z",
    uuidPhanCung: null,
    o: ["C", "D", "E", "F", "G", "H", "I"],
    duong: {
      "C:\\Users\\2708h": true,
      "G:\\OS_Workspace": true,
      "D:\\": true,
      "W:\\": false,
    },
    docLuc: "2026-11-26T00:19:00Z",
  },
  {
    ten: "localhost",
    deviceId: "0533a270-1d4d-42bb-83be-9b9fdcb2182f",
    trangThai: "offline",
    thayLanCuoi: "43 giờ trước lần đọc",
    uuidPhanCung: null,
    docLuc: "2026-11-26T00:19:00Z",
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
