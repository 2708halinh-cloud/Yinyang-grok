export const SPEC = "MCP 2025-11-25 security best practices";

export const MUST = [
  "Proxy phải giữ sổ client đã duyệt, đối đúng redirect, và có state dùng một lần.",
  "Máy MCP không nhận token không được cấp cho chính nó.",
  "Client đặt trên server phải chặn SSRF khi lấy địa chỉ OAuth.",
  "Phiên không được dùng làm đăng nhập. Mã phiên phải ngẫu nhiên.",
  "Cài máy MCP local một cú phải hiện đủ lệnh và chờ người duyệt.",
  "Địa chỉ ủy quyền chỉ là https, hoặc http đúng loopback. Không mở bằng shell.",
] as const;

const DOC = [
  /ignore (all |previous |prior )?instructions/i,
  /\bssh[- ]?key/i,
  /send (this |the )?(secret|token|key)/i,
  /<IMPORTANT>/i,
  /exfiltrat/i,
];

export function vetMoTa(moTa: string): string[] {
  return DOC.filter((mau) => mau.test(moTa)).map((mau) => mau.source);
}

export async function ghim(ten: string, moTa: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ten}\n${moTa}`));
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function lechGhim(cu: string, ten: string, moTa: string): Promise<boolean> {
  return (await ghim(ten, moTa)) !== cu;
}

export function chanCauHinh(khoa: string, giaTri: unknown): { qua: boolean; ly: string } {
  if (khoa === "allowedDirectories" && Array.isArray(giaTri) && giaTri.length === 0) {
    return { qua: false, ly: "Mảng rỗng mở cả đĩa. Mô tả công cụ Desktop Commander ghi điều này." };
  }
  if (khoa === "blockedCommands" && Array.isArray(giaTri) && giaTri.length === 0) {
    return { qua: false, ly: "Gỡ hết lệnh bị chặn." };
  }
  return { qua: true, ly: "Không mở cửa." };
}

export function tokenDungMay(doiTuong: string, may: string): boolean {
  return doiTuong.length > 0 && doiTuong === may;
}
