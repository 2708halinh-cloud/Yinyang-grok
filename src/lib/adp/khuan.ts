export type Vo = "linux" | "alpine" | "cmd" | "termux";

export interface KetLenh {
  ma: 0 | 1;
  cuc: "Dương" | "Âm";
  luat: string;
  loi: string;
  goiY: string;
  giet: false;
}

export interface Luat {
  so: number;
  ten: string;
  trongLenh: string;
  tuChoi: string;
}

export const LUAT: Luat[] = [
  { so: 1, ten: "Nhất thể", trongLenh: "Lệnh không đứng một mình. Nó phải thuộc đúng vỏ môi trường.", tuChoi: "Gọi một lệnh của vỏ khác là phá vỏ đó." },
  { so: 2, ten: "Rung động", trongLenh: "Đúng từng ký tự thì parser mới cộng hưởng.", tuChoi: "Sai một dấu cách hoặc thiếu gạch ngang là nhiễu." },
  { so: 3, ten: "Tương ứng", trongLenh: "Câu gõ bên ngoài phải khớp cây cú pháp bên trong.", tuChoi: "Không khớp thì báo lỗi cú pháp." },
  { so: 4, ten: "Hấp dẫn", trongLenh: "Tên lệnh hút tệp thực thi trên đường tìm.", tuChoi: "Không hút được tệp nào thì không thấy lệnh." },
  { so: 5, ten: "Hành động", trongLenh: "Gõ mà chưa nhấn Enter thì chưa có việc.", tuChoi: "Không Enter, không thực thi." },
  { so: 6, ten: "Chuyển hóa", trongLenh: "Chữ chuyển thành việc chỉ khi đầu vào đủ sạch.", tuChoi: "Đầu vào đứt thì chuỗi chuyển hóa đứt." },
  { so: 7, ten: "Nhân quả", trongLenh: "Đúng cú pháp thì chạy. Sai thì lỗi. Không hên xui.", tuChoi: "Không có quả ngọt từ nhân sai." },
  { so: 8, ten: "Bù trừ", trongLenh: "Thiếu gì thì nhận lại đúng phần thiếu, kèm cách bù.", tuChoi: "Thiếu một mảnh thì trả một thông báo để bù, không xóa phiên." },
  { so: 9, ten: "Tương đối", trongLenh: "Một lệnh chỉ đúng trong hệ quy chiếu của nó.", tuChoi: "Mang cú pháp hệ này sang hệ kia thì từ chối." },
  { so: 10, ten: "Phân cực", trongLenh: "Mã 0 là cực Dương. Mã 1 là cực Âm.", tuChoi: "Cực Âm là để chỉnh lại, không phải để giết phiên." },
  { so: 11, ten: "Nhịp điệu", trongLenh: "Đọc, đánh giá, in, rồi chờ lệnh mới.", tuChoi: "Chuỗi vô nhịp thì báo lỗi để đưa về nhịp." },
  { so: 12, ten: "Giới tính", trongLenh: "Dương là cấu trúc. Âm là ý định và dòng chảy.", tuChoi: "Ý định không được cấu trúc thì không sinh tiến trình." },
];

export const DO_THI = {
  nguon: "Nhà sáng lập viết phép cộng chữ. Máy không đo số này.",
  ten: "NGUYEN TIEN DAT",
  nguyen: 5,
  tien: 3,
  dat: 7,
  tongTen: 6,
  ngay: "27/08/2003",
  duongDoi: "22/4",
  ngaySinh: 9,
  thaiDo: 8,
  truongThanh: 1,
};

const LENH: Record<Vo, string[]> = {
  linux: ["ls", "cat", "grep", "sort", "rm", "echo", "apt-get"],
  alpine: ["ls", "cat", "grep", "sort", "rm", "echo"],
  cmd: ["dir", "type", "echo"],
  termux: ["ls", "pkg", "echo"],
};

const ALIAS: Record<Vo, Record<string, string>> = {
  linux: { ll: "ls -la" },
  alpine: { ll: "ls -la" },
  cmd: {},
  termux: { ll: "ls -la" },
};

function am(luat: string, loi: string, goiY: string): KetLenh {
  return { ma: 1, cuc: "Âm", luat, loi, goiY, giet: false };
}

function duong(luat: string, loi: string): KetLenh {
  return { ma: 0, cuc: "Dương", luat, loi, goiY: "", giet: false };
}

function khoang(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
    }
  }
  return dp[a.length]![b.length]!;
}

function gan(ten: string, vo: Vo): string | null {
  let best: string | null = null;
  let bestD = 2;
  for (const name of LENH[vo]) {
    const d = khoang(ten, name);
    if (d > 0 && d < bestD) {
      best = name;
      bestD = d;
    }
  }
  return best;
}

export function docLenh(raw: string, vo: Vo, enter: boolean, bien: Record<string, string> = {}): KetLenh {
  if (!enter) return am("Hành động", "Chưa nhấn Enter.", "Nhấn Enter thì lời gọi mới thành việc.");
  const line = raw.replace(/\s+$/u, "");
  if (!line.trim()) return am("Nhịp điệu", "Nhịp trống.", "Gõ một lệnh thuộc vỏ này.");
  if ((line.match(/"/g) ?? []).length % 2 === 1) {
    return am("Tương ứng", "Ngoặc kép không khép.", "Câu bên ngoài phải khớp cây bên trong.");
  }
  if (/[^\s\w$.*|'"=-]/u.test(line)) {
    return am("Nhịp điệu", "Chuỗi không theo nhịp lệnh.", "Giữ tên lệnh, cờ, ống | hoặc dấu *.");
  }
  if (line.includes("|")) {
    const stages = line.split("|").map((part) => part.trim());
    if (stages.some((part) => part.length === 0)) {
      return am("Chuyển hóa", "Ống bị đứt.", "Mỗi đoạn hai bên dấu | phải là một lệnh.");
    }
    for (const stage of stages) {
      const got = docLenh(stage, vo, true, bien);
      if (got.ma !== 0) return { ...got, loi: `Ống dừng ở «${stage}». ${got.loi}` };
    }
    return duong("Giới tính", "Dòng chảy đi qua ống. Âm nằm trong Dương.");
  }
  const bits = line.split(/\s+/u);
  let head = bits[0] ?? "";
  const alias = ALIAS[vo][head];
  if (alias) {
    const rest = bits.slice(1).join(" ");
    return docLenh(rest ? `${alias} ${rest}` : alias, vo, true, bien);
  }
  if (head.startsWith("$")) {
    return am("Bù trừ", `«${head}» là giá trị, không phải lệnh.`, "Đặt tên lệnh trước, biến đứng sau.");
  }
  const known = LENH[vo];
  if (!known.includes(head)) {
    if (head === "ls" && vo === "cmd") return am("Tương đối", "ls không thuộc CMD.", "Trong CMD dùng dir.");
    if (head === "dir" && vo !== "cmd") return am("Tương đối", "dir không thuộc vỏ này.", "Trong Linux dùng ls.");
    if (head === "apt-get" && vo === "alpine") return am("Nhất thể", "apt-get không thuộc Alpine.", "Đừng gọi lệnh của vỏ khác vào vỏ này.");
    if ((head === "apt-get" || head === "apt") && vo === "termux") return am("Tương đối", "apt của Debian không phải pkg của Termux.", "Trong Termux dùng pkg.");
    const near = gan(head, vo);
    if (near) return am("Giới tính", `«${head}» lệch một ký tự.`, `Ý định gần «${near}». Dương không chạy hộ. Sửa rồi Enter.`);
    return am("Hấp dẫn", `Không thấy «${head}» trên đường tìm của vỏ ${vo}.`, "Gõ đúng tên tệp thực thi đang có.");
  }
  for (let i = 1; i < bits.length; i += 1) {
    const bit = bits[i] ?? "";
    if (/^-[^-]/u.test(bit) === false && bit.startsWith("- ") ) {
      return am("Rung động", "Gạch ngang và chữ bị tách.", "Viết liền: -l hoặc --help.");
    }
    if (bit === "-" ) return am("Rung động", "Gạch ngang trơ.", "Cờ cần chữ đi cùng: -l.");
  }
  if (bits.includes("-") || bits.some((bit) => bit === "--")) {
    return am("Rung động", "Cờ không có thân.", "Viết -l hoặc --help, không để gạch trần.");
  }
  const loose = bits.slice(1).find((bit) => /^[a-z]$/u.test(bit));
  if (loose && head === "ls") return am("Rung động", `«${loose}» thiếu gạch ngang.`, `Thử ls -${loose}.`);
  for (const bit of bits) {
    const found = bit.match(/^\$([A-Za-z_][A-Za-z0-9_]*)/u);
    if (found && !(found[1] && found[1] in bien)) {
      return am("Bù trừ", `Thiếu biến ${found[1]}.`, `Đặt ${found[1]} rồi gõ lại. Không xóa phiên.`);
    }
  }
  if (line.includes("*")) return duong("Giới tính", "Dấu * là khoảng trống Âm trong cấu trúc Dương.");
  return duong("Nhân quả", "Cú pháp đúng. Mã 0. Cực Dương.");
}
