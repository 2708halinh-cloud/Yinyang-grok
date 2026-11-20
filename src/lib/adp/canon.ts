import type { NhuCauItem, Opposition, RunResult, TraceEvent } from "./engine.ts";

export function isCanon(source: string): boolean {
  return /^\s*TRẬN\s/m.test(source) || /^\s*NEURON\s/m.test(source);
}

function linesOf(source: string): string[] {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function scan(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    const ch = line[i] ?? "";
    if (ch === " " || ch === "\t") {
      i += 1;
      continue;
    }
    if (ch === '"') {
      let value = "";
      i += 1;
      while (i < line.length && line[i] !== '"') {
        value += line[i];
        i += 1;
      }
      i += 1;
      out.push(value);
      continue;
    }
    if (ch === "{") {
      out.push(line.slice(i));
      break;
    }
    let end = i;
    while (end < line.length && line[end] !== " " && line[end] !== "\t") end += 1;
    out.push(line.slice(i, end));
    i = end;
  }
  return out;
}

function pole(desc: string): "DUONG" | "AM" | "KHAC" {
  if (desc.includes("Cực Dương")) return "DUONG";
  if (desc.includes("Cực Âm")) return "AM";
  return "KHAC";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function agentId(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return (
    "AGT-" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export async function runCanon(source: string): Promise<RunResult> {
  const trace: TraceEvent[] = [];
  const needs: NhuCauItem[] = [];
  const oppositions: Opposition[] = [];
  const outline: string[] = [];
  const neurons: { id: string; title: string; desc: string }[] = [];
  let tran = "";
  let dest = "";

  for (const line of linesOf(source)) {
    const part = scan(line);
    const head = part[0] ?? "";
    if (head === "TRẬN") {
      tran = part[1] ?? "";
      outline.push(`TRẬN ${tran}`);
      trace.push({ tone: "bone", title: `TRẬN ${tran}`, detail: part[2] ?? "" });
    } else if (head === "ĐÍCH") {
      dest = part[1] ?? "";
      outline.push(`ĐÍCH ${dest}`);
    } else if (head === "NEURON") {
      const id = part[1] ?? "";
      const title = part[2] ?? id;
      const desc = part[3] ?? "";
      neurons.push({ id, title, desc });
      outline.push(`NEURON ${id}`);
      const side = pole(desc);
      trace.push({
        tone: side === "DUONG" ? "yang" : side === "AM" ? "yin" : "bone",
        title: title,
        detail: desc,
      });
    } else if (head === "KHO") {
      outline.push(`KHO ${part[1] ?? ""}`);
      trace.push({ tone: "bone", title: `KHO ${part[2] ?? part[1] ?? ""}`, detail: part[3] ?? "" });
    } else if (head === "SYNAPSE") {
      const from = part[1] ?? "";
      const to = part[3] ?? "";
      const rel = part[4] ?? "";
      outline.push(`SYNAPSE ${from} -> ${to}`);
      trace.push({ tone: "bone", title: `${from} → ${to}`, detail: rel });
    } else if (head === "NẠP") {
      outline.push(`NẠP ${part[1] ?? ""} VÀO ${part[3] ?? ""}`);
      trace.push({ tone: "yang", title: `Nạp ${part[1] ?? ""} vào ${part[3] ?? ""}`, detail: "Dòng chảy, không phải cửa mở." });
    } else if (head === "CẢM") {
      const call = part[3] ?? "";
      const tool = call.replace("()", "");
      needs.push({
        id: `NEED-${String(needs.length + 1).padStart(3, "0")}`,
        ten: tool || (part[1] ?? "Cam"),
        lyDo: `Cần đo ${tool || "cảm"} trên máy thật, rồi đưa số vào CẢM ${part[1] ?? ""}. Có số mới được tuyên.`,
        khongCho: true,
        khongMoKhoa: false,
        kienTruc: tran || "README.adp",
      });
      trace.push({ tone: "yin", title: `CẢM ${part[1] ?? ""}`, detail: `Thiếu ${tool}. Không bịa kết quả đo.` });
    } else if (head === "TUYÊN") {
      const chung = part[4] ?? "";
      trace.push({
        tone: "stop",
        title: `TUYÊN chờ số · ${part[1] ?? ""}`,
        detail: `Cần bằng chứng «${chung}» trước khi phong tuyên này.`,
      });
      if (chung.startsWith("local:")) {
        needs.push({
          id: `NEED-${String(needs.length + 1).padStart(3, "0")}`,
          ten: "DocDuongMay",
          lyDo: `Cần đọc ${chung} khi có phiếu. Đường đó là việc phải làm, chưa phải số đã thấy.`,
          khongCho: true,
          khongMoKhoa: true,
          kienTruc: tran || "README.adp",
        });
      }
    } else if (head === "ANAPANA" || head === "VIPASSANA" || head === "QUÁN") {
      outline.push(`${head} ${part[1] ?? ""}`);
      trace.push({ tone: "bone", title: `${head} ${part[1] ?? ""}`, detail: part[2] ?? "" });
    } else {
      trace.push({ tone: "stop", title: "Dòng chưa đọc", detail: line });
    }
  }

  let pending: { title: string; side: "DUONG" | "AM" } | null = null;
  for (const neuron of neurons) {
    const side = pole(neuron.desc);
    if (side === "KHAC") {
      pending = null;
      continue;
    }
    if (!pending) {
      pending = { title: neuron.title, side };
      continue;
    }
    if (pending.side !== side) {
      oppositions.push({
        duong: side === "DUONG" ? neuron.title : pending.title,
        am: side === "AM" ? neuron.title : pending.title,
        quanHe: "đối đãi, không chủ tớ",
      });
      pending = null;
    } else pending = { title: neuron.title, side };
  }

  const id = agentId();
  const dataHash = await sha256Hex(source);
  const timestamp = new Date().toISOString();
  const envelopeHash = await sha256Hex(
    JSON.stringify({ dataHash, director: "Nguyễn Tiến Đạt", agentId: id, timestamp, dest }),
  );

  return {
    ok: neurons.length > 0,
    tokens: [],
    diagnostics:
      neurons.length > 0
        ? []
        : [
            {
              severity: "error",
              phase: "parse",
              code: "PARSE",
              message: "Không thấy NEURON trong nguồn canon.",
              line: 1,
              col: 1,
            },
          ],
    program: null,
    outline: outline.join("\n"),
    trace,
    cells: [],
    proofs: [
      {
        kienTruc: tran || "README.adp",
        ham: dest || "Canon",
        ketQua: null,
        ketQuaLiteral: "—",
        dataHash,
        envelopeHash,
        claimStamp: "STAMP_LIVE",
        acceptedStamp: "STAMP_BETA",
        phase: "NHU_CAU",
        timestamp,
        agentId: id,
        director: "Nguyễn Tiến Đạt",
        decision: "R-000",
        readback: "LECH",
        note: "Đã đọc trận và các mặt đối lập. Cần số CẢM thật trước khi phong TUYÊN. Hash này là hash của nguồn.",
      },
    ],
    corrections: [],
    needs,
    oppositions,
    agentId: id,
  };
}
