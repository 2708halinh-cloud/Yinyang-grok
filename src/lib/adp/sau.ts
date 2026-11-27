export const SAU = [
  "Coaching",
  "Mentoring",
  "Training",
  "Therapy",
  "Consulting",
  "Systems Coaching New",
] as const;

export function chanDon(ten: string): { qua: boolean; ly: string } {
  if ((SAU as readonly string[]).includes(ten)) {
    return { qua: false, ly: "Sáu thư mục đã quy hoạch. Không dọn." };
  }
  return { qua: true, ly: "Không nằm trong sáu thư mục." };
}
