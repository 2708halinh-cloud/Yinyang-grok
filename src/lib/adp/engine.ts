// yinyang.adp core — hyper-static, immutable, bijective, proof-carrying.
// A gap names its own need (NhuCau). It does not wait, and it does not open a sealed root.

export const DIRECTOR = {
  name: "Nguyễn Tiến Đạt",
  alias: "Hà Linh",
  role: "System Architect / Director",
  base: "Carbon",
  decision: "R-000",
} as const;

export type Polarity = "THUC_TAI" | "MO_PHONG";
export type Stamp = "STAMP_OLD" | "STAMP_LIVE" | "STAMP_BETA";
export type Phase = "DONE" | "NHU_CAU" | "STOP";
export type Severity = "error" | "warn" | "info";

export interface Diagnostic {
  severity: Severity;
  phase: "lex" | "parse" | "type" | "exec";
  code: string;
  message: string;
  line: number;
  col: number;
}

export type TokenKind =
  | "IDENT"
  | "NUMBER"
  | "STRING"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COMMA"
  | "SEMI"
  | "DOT"
  | "EQ"
  | "GT"
  | "COLON"
  | "PLUS"
  | "ARROW"
  | "EOF"
  | "KienTruc"
  | "NenTang"
  | "MoPhong"
  | "ThucTai"
  | "Duong"
  | "Am"
  | "Ham"
  | "Neu"
  | "TraVe"
  | "VatChung"
  | "GiaoUoc"
  | "HoaGiai"
  | "GhiNhan"
  | "DoLech"
  | "KhoaBang"
  | "BaoLoi"
  | "Dung"
  | "GiaiDoan"
  | "SHA256"
  | "STAMP_LIVE"
  | "STAMP_OLD"
  | "STAMP_BETA"
  | "TrangThai"
  | "NhuCau"
  | "KetQua"
  | "Hash"
  | "LechPha"
  | "TaiTao"
  | "TaoBanSaoLoi";

export interface Token {
  kind: TokenKind;
  lexeme: string;
  line: number;
  col: number;
}

export interface Binding {
  taiTao: boolean;
  kind: "NenTang" | "MoPhong";
  polarity: Polarity;
  name: string;
  literal: string;
  value: number;
  line: number;
  col: number;
}

export interface Param {
  polarity: Polarity;
  name: string;
  line: number;
}

export type Expr =
  | { kind: "name"; name: string; line: number }
  | { kind: "sha"; args: string[]; line: number };

export interface ProofSyntax {
  ketQua: Expr | null;
  hash: Expr | null;
  claim: Stamp | null;
  line: number;
}

export type Stmt =
  | { kind: "neu"; a: string; b: string; threshold: number; thresholdLiteral: string; body: Stmt[]; line: number }
  | { kind: "ghiNhan"; what: string; line: number }
  | { kind: "hoaGiai"; a: string; b: string; line: number }
  | { kind: "nhuCau"; ten: string; line: number }
  | { kind: "khoaBang"; a: string; b: string; line: number }
  | { kind: "banSao"; a: string; b: string; line: number }
  | { kind: "baoLoi"; message: string; line: number }
  | { kind: "dung"; line: number }
  | { kind: "traVeProof"; proof: ProofSyntax; line: number }
  | { kind: "traVeOpen"; message: string; line: number };

export interface Func {
  name: string;
  params: Param[];
  ret: "VatChung" | "TrangThai";
  body: Stmt[];
  line: number;
}

export interface Arch {
  name: string;
  bindings: Binding[];
  functions: Func[];
  line: number;
}

export interface Call {
  arch: string;
  method: string;
  args: string[];
  line: number;
  col: number;
}

export interface Program {
  architectures: Arch[];
  calls: Call[];
}

export interface Cell {
  name: string;
  polarity: Polarity;
  value: number;
  literal: string;
  stamp: Stamp;
  frozen: boolean;
  version: number;
  kienTruc: string;
}

export interface VatChung {
  kienTruc: string;
  ham: string;
  ketQua: number | null;
  ketQuaLiteral: string;
  dataHash: string;
  envelopeHash: string;
  claimStamp: Stamp;
  acceptedStamp: Stamp;
  phase: Phase;
  timestamp: string;
  agentId: string;
  director: string;
  decision: string;
  readback: "KHOP" | "LECH";
  note: string;
}

export interface CorrectionEntry {
  id: string;
  at: string;
  kienTruc: string;
  ham: string;
  lech: number;
  nguong: number;
  thucTai: { name: string; value: number; literal: string };
  moPhong: { name: string; value: number; literal: string };
  lesson: string;
}

export interface NhuCauItem {
  id: string;
  ten: string;
  lyDo: string;
  khongCho: true;
  khongMoKhoa: boolean;
  kienTruc: string;
}

export interface TraceEvent {
  tone: "yang" | "yin" | "bone" | "stop";
  title: string;
  detail: string;
}

export interface RunResult {
  ok: boolean;
  tokens: Token[];
  diagnostics: Diagnostic[];
  program: Program | null;
  outline: string;
  trace: TraceEvent[];
  cells: Cell[];
  proofs: VatChung[];
  corrections: CorrectionEntry[];
  needs: NhuCauItem[];
  agentId: string;
}

const KEYWORDS: Record<string, TokenKind> = {
  KienTruc: "KienTruc",
  NenTang: "NenTang",
  MoPhong: "MoPhong",
  ThucTai: "ThucTai",
  Duong: "Duong",
  Am: "Am",
  Ham: "Ham",
  Neu: "Neu",
  TraVe: "TraVe",
  VatChung: "VatChung",
  GiaoUoc: "GiaoUoc",
  HoaGiai: "HoaGiai",
  GhiNhan: "GhiNhan",
  DoLech: "DoLech",
  KhoaBang: "KhoaBang",
  BaoLoi: "BaoLoi",
  Dung: "Dung",
  GiaiDoan: "GiaiDoan",
  SHA256: "SHA256",
  STAMP_LIVE: "STAMP_LIVE",
  STAMP_OLD: "STAMP_OLD",
  STAMP_BETA: "STAMP_BETA",
  TrangThai: "TrangThai",
  NhuCau: "NhuCau",
  KetQua: "KetQua",
  Hash: "Hash",
  LechPha: "LechPha",
  TaiTao: "TaiTao",
  TaoBanSaoLoi: "TaoBanSaoLoi",
};

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_]/.test(ch);
}
function isIdentPart(ch: string): boolean {
  return /[A-Za-z0-9_]/.test(ch);
}

export function lex(source: string): { tokens: Token[]; diagnostics: Diagnostic[] } {
  const tokens: Token[] = [];
  const diagnostics: Diagnostic[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const push = (kind: TokenKind, lexeme: string, sl: number, sc: number) => {
    tokens.push({ kind, lexeme, line: sl, col: sc });
  };

  while (i < source.length) {
    const ch = source[i] ?? "";
    if (ch === " " || ch === "\t" || ch === "\r") {
      i += 1;
      col += 1;
      continue;
    }
    if (ch === "\n") {
      i += 1;
      line += 1;
      col = 1;
      continue;
    }
    if (ch === "/" && source[i + 1] === "/") {
      while (i < source.length && source[i] !== "\n") i += 1;
      continue;
    }
    const sl = line;
    const sc = col;
    if (ch === "-" && source[i + 1] === ">") {
      push("ARROW", "->", sl, sc);
      i += 2;
      col += 2;
      continue;
    }
    const singles: Record<string, TokenKind> = {
      "{": "LBRACE",
      "}": "RBRACE",
      "(": "LPAREN",
      ")": "RPAREN",
      ",": "COMMA",
      ";": "SEMI",
      ".": "DOT",
      "=": "EQ",
      ">": "GT",
      ":": "COLON",
      "+": "PLUS",
    };
    if (singles[ch]) {
      push(singles[ch], ch, sl, sc);
      i += 1;
      col += 1;
      continue;
    }
    if (ch === '"') {
      i += 1;
      col += 1;
      let value = "";
      let closed = false;
      while (i < source.length) {
        const c = source[i] ?? "";
        if (c === "\\") {
          const n = source[i + 1] ?? "";
          if (n === "n") value += "\n";
          else if (n === "t") value += "\t";
          else value += n;
          i += 2;
          col += 2;
          continue;
        }
        if (c === '"') {
          i += 1;
          col += 1;
          closed = true;
          break;
        }
        if (c === "\n") {
          line += 1;
          col = 1;
          i += 1;
          value += c;
          continue;
        }
        value += c;
        i += 1;
        col += 1;
      }
      if (!closed) {
        diagnostics.push({
          severity: "error",
          phase: "lex",
          code: "LEX",
          message: "Chuỗi chưa đóng.",
          line: sl,
          col: sc,
        });
      }
      push("STRING", value, sl, sc);
      continue;
    }
    if (ch === "-" && /[0-9]/.test(source[i + 1] ?? "")) {
      let lexeme = "-";
      i += 1;
      col += 1;
      while (i < source.length && /[0-9.]/.test(source[i] ?? "")) {
        lexeme += source[i];
        i += 1;
        col += 1;
      }
      push("NUMBER", lexeme, sl, sc);
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let lexeme = "";
      while (i < source.length && /[0-9.]/.test(source[i] ?? "")) {
        lexeme += source[i];
        i += 1;
        col += 1;
      }
      push("NUMBER", lexeme, sl, sc);
      continue;
    }
    if (isIdentStart(ch)) {
      let lexeme = "";
      while (i < source.length && isIdentPart(source[i] ?? "")) {
        lexeme += source[i];
        i += 1;
        col += 1;
      }
      const kind = KEYWORDS[lexeme] ?? "IDENT";
      push(kind, lexeme, sl, sc);
      continue;
    }
    diagnostics.push({
      severity: "error",
      phase: "lex",
      code: "LEX",
      message: `Ký tự không thuộc ngôn ngữ: «${ch}».`,
      line: sl,
      col: sc,
    });
    i += 1;
    col += 1;
  }
  tokens.push({ kind: "EOF", lexeme: "", line, col });
  return { tokens, diagnostics };
}

interface Parser {
  tokens: Token[];
  i: number;
  diagnostics: Diagnostic[];
}

function parse(tokens: Token[], seed: Diagnostic[]): { program: Program; diagnostics: Diagnostic[] } {
  const p: Parser = { tokens, i: 0, diagnostics: [...seed] };
  const program: Program = { architectures: [], calls: [] };
  while (!check(p, "EOF")) {
    if (check(p, "KienTruc")) program.architectures.push(parseArch(p));
    else if (check(p, "GiaoUoc")) program.calls.push(parseCall(p));
    else {
      const t = peek(p);
      err(p, t, "PARSE", `Không nhận ra «${t.lexeme || t.kind}» ở tầng kiến trúc.`);
      p.i += 1;
      syncTop(p);
    }
  }
  return { program, diagnostics: p.diagnostics };
}

function peek(p: Parser): Token {
  return p.tokens[p.i] ?? { kind: "EOF", lexeme: "", line: 1, col: 1 };
}
function check(p: Parser, kind: TokenKind): boolean {
  return peek(p).kind === kind;
}
function eat(p: Parser, kind: TokenKind): Token | null {
  if (!check(p, kind)) return null;
  const t = peek(p);
  p.i += 1;
  return t;
}
function err(p: Parser, t: Token, code: string, message: string) {
  p.diagnostics.push({
    severity: "error",
    phase: "parse",
    code,
    message,
    line: t.line,
    col: t.col,
  });
}
function expect(p: Parser, kind: TokenKind): Token {
  const t = peek(p);
  if (t.kind === kind) {
    p.i += 1;
    return t;
  }
  err(p, t, "PARSE", `Thiếu ${kind}, gặp ${t.kind}${t.lexeme ? ` «${t.lexeme}»` : ""}.`);
  if (t.kind !== "EOF") p.i += 1;
  return { kind, lexeme: "", line: t.line, col: t.col };
}
function expectSemi(p: Parser) {
  if (eat(p, "SEMI")) return;
  const t = peek(p);
  err(p, t, "PARSE", "Thiếu dấu chấm phẩy.");
}
function syncTop(p: Parser) {
  while (!check(p, "EOF") && !check(p, "KienTruc") && !check(p, "GiaoUoc")) p.i += 1;
}

function parsePolarity(p: Parser): Polarity | null {
  if (eat(p, "ThucTai") || eat(p, "Duong")) return "THUC_TAI";
  if (eat(p, "Am") || eat(p, "MoPhong")) return "MO_PHONG";
  return null;
}

function parseArch(p: Parser): Arch {
  const kw = expect(p, "KienTruc");
  const nameTok = expect(p, "STRING");
  expect(p, "LBRACE");
  const bindings: Binding[] = [];
  const functions: Func[] = [];
  while (!check(p, "RBRACE") && !check(p, "EOF") && !check(p, "KienTruc")) {
    if (check(p, "TaiTao") || check(p, "NenTang") || check(p, "MoPhong")) {
      const b = parseBinding(p);
      if (b) bindings.push(b);
    } else if (check(p, "Ham")) functions.push(parseFunc(p));
    else {
      const t = peek(p);
      err(p, t, "PARSE", `Trong KienTruc không có «${t.lexeme || t.kind}».`);
      p.i += 1;
    }
  }
  expect(p, "RBRACE");
  return { name: nameTok.lexeme, bindings, functions, line: kw.line };
}

function parseBinding(p: Parser): Binding | null {
  const taiTao = Boolean(eat(p, "TaiTao"));
  const head = peek(p);
  let kind: "NenTang" | "MoPhong";
  if (eat(p, "NenTang")) kind = "NenTang";
  else if (eat(p, "MoPhong")) kind = "MoPhong";
  else {
    err(p, head, "PARSE", "TaiTao phải đi với NenTang hoặc MoPhong.");
    return null;
  }
  let polarity: Polarity = kind === "NenTang" ? "THUC_TAI" : "MO_PHONG";
  if (check(p, "ThucTai") || check(p, "Duong") || check(p, "Am") || check(p, "MoPhong")) {
    const parsed = parsePolarity(p);
    if (parsed) polarity = parsed;
  }
  const nameTok = expect(p, "IDENT");
  expect(p, "EQ");
  const num = expect(p, "NUMBER");
  expectSemi(p);
  const value = Number(num.lexeme);
  if (num.lexeme !== "" && Number.isNaN(value)) {
    err(p, num, "PARSE", `Không đọc được số «${num.lexeme}».`);
  }
  return {
    taiTao,
    kind,
    polarity,
    name: nameTok.lexeme,
    literal: num.lexeme,
    value: Number.isNaN(value) ? 0 : value,
    line: head.line,
    col: head.col,
  };
}

function parseFunc(p: Parser): Func {
  const kw = expect(p, "Ham");
  const nameTok = expect(p, "IDENT");
  expect(p, "LPAREN");
  const params: Param[] = [];
  if (!check(p, "RPAREN")) {
    do {
      const polTok = peek(p);
      const polarity = parsePolarity(p);
      if (!polarity) err(p, polTok, "PARSE", "Tham số phải khai cực: ThucTai/Duong hoặc Am/MoPhong.");
      const n = expect(p, "IDENT");
      params.push({ polarity: polarity ?? "THUC_TAI", name: n.lexeme, line: n.line });
    } while (eat(p, "COMMA"));
  }
  expect(p, "RPAREN");
  let ret: "VatChung" | "TrangThai" = "VatChung";
  if (eat(p, "ARROW")) {
    if (eat(p, "VatChung")) ret = "VatChung";
    else if (eat(p, "TrangThai")) ret = "TrangThai";
    else err(p, peek(p), "PARSE", "Kiểu trả về chỉ được là VatChung hoặc TrangThai.");
  }
  expect(p, "LBRACE");
  const body = parseBlock(p);
  return { name: nameTok.lexeme, params, ret, body, line: kw.line };
}

function parseBlock(p: Parser): Stmt[] {
  const body: Stmt[] = [];
  while (!check(p, "RBRACE") && !check(p, "EOF")) {
    const stmt = parseStmt(p);
    if (stmt) body.push(stmt);
    else break;
  }
  expect(p, "RBRACE");
  return body;
}

function parseStmt(p: Parser): Stmt | null {
  const t = peek(p);
  if (eat(p, "Neu")) {
    expect(p, "LPAREN");
    expect(p, "DoLech");
    expect(p, "LPAREN");
    const a = expect(p, "IDENT");
    expect(p, "COMMA");
    const b = expect(p, "IDENT");
    expect(p, "RPAREN");
    expect(p, "GT");
    const n = expect(p, "NUMBER");
    expect(p, "RPAREN");
    expect(p, "LBRACE");
    const body = parseBlock(p);
    return {
      kind: "neu",
      a: a.lexeme,
      b: b.lexeme,
      threshold: Number(n.lexeme),
      thresholdLiteral: n.lexeme,
      body,
      line: t.line,
    };
  }
  if (eat(p, "GhiNhan")) {
    expect(p, "LPAREN");
    const what = eat(p, "LechPha") ?? expect(p, "IDENT");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "ghiNhan", what: what.lexeme || "LechPha", line: t.line };
  }
  if (eat(p, "KhoaBang")) {
    expect(p, "LPAREN");
    const a = expect(p, "IDENT");
    expect(p, "COMMA");
    const b = expect(p, "IDENT");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "khoaBang", a: a.lexeme, b: b.lexeme, line: t.line };
  }
  if (eat(p, "TaoBanSaoLoi")) {
    expect(p, "LPAREN");
    const a = expect(p, "IDENT");
    expect(p, "COMMA");
    const b = expect(p, "IDENT");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "banSao", a: a.lexeme, b: b.lexeme, line: t.line };
  }
  if (eat(p, "NhuCau")) {
    expect(p, "LPAREN");
    const ten = expect(p, "STRING");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "nhuCau", ten: ten.lexeme, line: t.line };
  }
  if (eat(p, "BaoLoi")) {
    expect(p, "LPAREN");
    const msg = expect(p, "STRING");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "baoLoi", message: msg.lexeme, line: t.line };
  }
  if (eat(p, "Dung")) {
    expect(p, "LPAREN");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "dung", line: t.line };
  }
  if (eat(p, "GiaiDoan")) {
    expect(p, "LPAREN");
    expect(p, "Dung");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "dung", line: t.line };
  }
  if (eat(p, "TrangThai")) {
    expect(p, "EQ");
    expect(p, "HoaGiai");
    expect(p, "LPAREN");
    const a = expect(p, "IDENT");
    expect(p, "COMMA");
    const b = expect(p, "IDENT");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "hoaGiai", a: a.lexeme, b: b.lexeme, line: t.line };
  }
  if (eat(p, "TraVe")) {
    if (eat(p, "VatChung")) {
      expect(p, "LBRACE");
      const proof = parseProof(p, t.line);
      expect(p, "RBRACE");
      expectSemi(p);
      return { kind: "traVeProof", proof, line: t.line };
    }
    expect(p, "TrangThai");
    expect(p, "DOT");
    expect(p, "NhuCau");
    expect(p, "LPAREN");
    const msg = expect(p, "STRING");
    expect(p, "RPAREN");
    expectSemi(p);
    return { kind: "traVeOpen", message: msg.lexeme, line: t.line };
  }
  err(p, t, "PARSE", `Lệnh không hợp lệ: «${t.lexeme || t.kind}».`);
  if (!check(p, "EOF")) p.i += 1;
  return null;
}

function parseProof(p: Parser, line: number): ProofSyntax {
  const proof: ProofSyntax = { ketQua: null, hash: null, claim: null, line };
  while (!check(p, "RBRACE") && !check(p, "EOF")) {
    if (eat(p, "KetQua")) {
      expect(p, "COLON");
      proof.ketQua = parseExpr(p);
    } else if (eat(p, "Hash")) {
      expect(p, "COLON");
      if (!check(p, "SHA256")) err(p, peek(p), "PARSE", "Hash phải là SHA256(...).");
      proof.hash = parseExpr(p);
    } else if (eat(p, "TrangThai")) {
      expect(p, "COLON");
      if (eat(p, "STAMP_LIVE")) proof.claim = "STAMP_LIVE";
      else if (eat(p, "STAMP_OLD")) proof.claim = "STAMP_OLD";
      else if (eat(p, "STAMP_BETA")) proof.claim = "STAMP_BETA";
      else err(p, peek(p), "PARSE", "TrangThai của VatChung phải là STAMP_LIVE, STAMP_OLD hoặc STAMP_BETA.");
    } else {
      err(p, peek(p), "PARSE", `Trường VatChung lạ: «${peek(p).lexeme || peek(p).kind}».`);
      break;
    }
    eat(p, "COMMA");
  }
  return proof;
}

function parseExpr(p: Parser): Expr {
  const t = peek(p);
  if (eat(p, "SHA256")) {
    expect(p, "LPAREN");
    const args: string[] = [];
    if (!check(p, "RPAREN")) {
      const first = expect(p, "IDENT");
      args.push(first.lexeme);
      while (eat(p, "COMMA") || eat(p, "PLUS")) {
        const n = expect(p, "IDENT");
        args.push(n.lexeme);
      }
    }
    expect(p, "RPAREN");
    return { kind: "sha", args, line: t.line };
  }
  if (eat(p, "IDENT")) return { kind: "name", name: t.lexeme, line: t.line };
  if (eat(p, "NUMBER")) return { kind: "name", name: "", line: t.line };
  err(p, t, "PARSE", "Biểu thức không hợp lệ.");
  return { kind: "name", name: "", line: t.line };
}

function parseCall(p: Parser): Call {
  const kw = expect(p, "GiaoUoc");
  expect(p, "LPAREN");
  const name = expect(p, "STRING");
  expect(p, "RPAREN");
  expect(p, "DOT");
  const method = expect(p, "IDENT");
  expect(p, "LPAREN");
  const args: string[] = [];
  if (!check(p, "RPAREN")) {
    do {
      const a = expect(p, "IDENT");
      args.push(a.lexeme);
    } while (eat(p, "COMMA"));
  }
  expect(p, "RPAREN");
  expectSemi(p);
  return { arch: name.lexeme, method: method.lexeme, args, line: kw.line, col: kw.col };
}

interface Sym {
  polarity: Polarity;
  literalKind: "number";
  line: number;
}

function checkProgram(program: Program): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const archByName = new Map<string, Arch>();
  for (const arch of program.architectures) {
    if (archByName.has(arch.name)) {
      diagnostics.push(typeErr(arch.line, 1, "DUP_NAME", `KienTruc «${arch.name}» bị khai hai lần.`));
    }
    archByName.set(arch.name, arch);
    const table = new Map<string, Sym>();
    for (const b of arch.bindings) {
      if (!b.name) continue;
      const prev = table.get(b.name);
      if (prev && !b.taiTao) {
        diagnostics.push(
          typeErr(
            b.line,
            b.col,
            "IMMUTABLE_MUTATION",
            `Đập lén «${b.name}». Khối đã xây là hằng. Dùng TaiTao để khóa bản cũ thành STAMP_OLD rồi dựng khối mới.`,
          ),
        );
      } else if (!prev && b.taiTao) {
        diagnostics.push(
          typeErr(b.line, b.col, "TAITAO_MISSING", `TaiTao «${b.name}» nhưng chưa có khối nào để khóa.`),
        );
      } else if (prev && b.taiTao && prev.polarity !== b.polarity) {
        diagnostics.push(
          typeErr(
            b.line,
            b.col,
            "TAITAO_POLARITY",
            `Không được đổi cực của «${b.name}». ThucTai không hóa thành MoPhong.`,
          ),
        );
      }
      table.set(b.name, { polarity: b.polarity, literalKind: "number", line: b.line });
    }
    const fnNames = new Set<string>();
    for (const fn of arch.functions) {
      if (fnNames.has(fn.name)) {
        diagnostics.push(typeErr(fn.line, 1, "DUP_NAME", `Ham «${fn.name}» bị khai hai lần.`));
      }
      fnNames.add(fn.name);
      const local = new Map(table);
      for (const param of fn.params) {
        if (local.has(param.name) && table.has(param.name)) {
          diagnostics.push(
            typeErr(param.line, 1, "DUP_NAME", `Tham số «${param.name}» che một NenTang/MoPhong. Đặt tên khác.`),
          );
        }
        local.set(param.name, { polarity: param.polarity, literalKind: "number", line: param.line });
      }
      const referenced = new Set<string>();
      let sawDoLech = false;
      const walk = (stmts: Stmt[]) => {
        for (const s of stmts) {
          if (s.kind === "neu") {
            sawDoLech = true;
            note(s.a);
            note(s.b);
            checkPair(local, s.a, s.b, s.line, "DoLech");
            walk(s.body);
          } else if (s.kind === "hoaGiai" || s.kind === "khoaBang" || s.kind === "banSao") {
            note(s.a);
            note(s.b);
            if (s.kind === "hoaGiai") checkHoa(local, s.a, s.b, s.line);
          } else if (s.kind === "traVeProof") {
            checkProof(local, s.proof, referenced);
          }
        }
      };
      const note = (name: string) => {
        if (!name) return;
        referenced.add(name);
        if (!local.has(name)) {
          diagnostics.push(typeErr(fn.line, 1, "UNKNOWN_NAME", `«${name}» chưa được khai trong kiến trúc này.`));
        }
      };
      walk(fn.body);
      const poles = new Set<Polarity>();
      for (const name of referenced) {
        const sym = local.get(name);
        if (sym) poles.add(sym.polarity);
      }
      if (poles.has("THUC_TAI") && poles.has("MO_PHONG") && !sawDoLech) {
        diagnostics.push(
          typeErr(
            fn.line,
            1,
            "BIJECTION_MISSING",
            `Ham «${fn.name}» chạm cả ThucTai và MoPhong nhưng không có DoLech. Song ánh là bắt buộc — không được trộn sự kiện với mô phỏng.`,
          ),
        );
      }
    }
  }

  for (const call of program.calls) {
    const arch = archByName.get(call.arch);
    if (!arch) {
      diagnostics.push(typeErr(call.line, call.col, "CALL_UNKNOWN", `Không có KienTruc «${call.arch}».`));
      continue;
    }
    const fn = arch.functions.find((f) => f.name === call.method);
    if (!fn) {
      diagnostics.push(
        typeErr(call.line, call.col, "CALL_UNKNOWN", `«${call.arch}» không có Ham ${call.method}.`),
      );
      continue;
    }
    if (fn.params.length !== call.args.length) {
      diagnostics.push(
        typeErr(
          call.line,
          call.col,
          "CALL_ARITY",
          `${call.method} cần ${fn.params.length} đối số, nhận ${call.args.length}.`,
        ),
      );
    }
    const table = new Map<string, Sym>();
    for (const b of visibleBindings(arch)) table.set(b.name, { polarity: b.polarity, literalKind: "number", line: b.line });
    for (let i = 0; i < Math.min(fn.params.length, call.args.length); i += 1) {
      const arg = call.args[i] ?? "";
      const param = fn.params[i];
      if (!param) continue;
      const sym = table.get(arg);
      if (!sym) {
        diagnostics.push(typeErr(call.line, call.col, "UNKNOWN_NAME", `Đối số «${arg}» không có trong ${call.arch}.`));
        continue;
      }
      if (sym.polarity !== param.polarity) {
        diagnostics.push(
          typeErr(
            call.line,
            call.col,
            "CALL_POLARITY",
            `Lẫn cực: «${arg}» là ${labelPole(sym.polarity)} nhưng ${param.name} yêu cầu ${labelPole(param.polarity)}.`,
          ),
        );
      }
    }
  }
  diagnostics.push(...pairErrors.splice(0, pairErrors.length));
  return diagnostics;
}

function visibleBindings(arch: Arch): Binding[] {
  const map = new Map<string, Binding>();
  for (const b of arch.bindings) if (b.name) map.set(b.name, b);
  return [...map.values()];
}

function checkPair(local: Map<string, Sym>, a: string, b: string, line: number, what: string) {
  const sa = local.get(a);
  const sb = local.get(b);
  if (sa && sb && sa.polarity === sb.polarity) {
    // pushed by caller via closure? We'll push from outer by returning. Use a side channel: attach on function property.
    pairErrors.push(typeErr(line, 1, "POLARITY_MISMATCH", `${what}(${a}, ${b}) không phải song ánh — hai cực cùng phía.`));
  }
}

const pairErrors: Diagnostic[] = [];

function checkHoa(local: Map<string, Sym>, a: string, b: string, line: number) {
  const sa = local.get(a);
  const sb = local.get(b);
  if (!sa || !sb) return;
  if (sa.polarity !== "THUC_TAI" || sb.polarity !== "MO_PHONG") {
    pairErrors.push(
      typeErr(
        line,
        1,
        "POLARITY_MISMATCH",
        `HoaGiai(${a}, ${b}) phải là HoaGiai(ThucTai, MoPhong). Không đảo cực, không hòa hai phía cùng dấu.`,
      ),
    );
  }
}

function checkProof(local: Map<string, Sym>, proof: ProofSyntax, referenced: Set<string>) {
  if (!proof.ketQua || (proof.ketQua.kind === "name" && proof.ketQua.name === "")) {
    pairErrors.push(
      typeErr(proof.line, 1, "NAKED_RESULT", "VatChung thiếu KetQua là một tên ThucTai. Không trả kết quả suông, không trả hằng số trần."),
    );
  } else if (proof.ketQua.kind === "name") {
    referenced.add(proof.ketQua.name);
    const sym = local.get(proof.ketQua.name);
    if (!sym) {
      pairErrors.push(typeErr(proof.line, 1, "UNKNOWN_NAME", `KetQua «${proof.ketQua.name}» không tồn tại.`));
    } else if (sym.polarity !== "THUC_TAI") {
      pairErrors.push(
        typeErr(
          proof.line,
          1,
          "INFERENCE_RESULT",
          `KetQua «${proof.ketQua.name}» là mô phỏng. Đừng suy diễn. Hãy trả về ThucTai — sự kiện đã đọc.`,
        ),
      );
    }
  }
  if (!proof.hash || proof.hash.kind !== "sha") {
    pairErrors.push(typeErr(proof.line, 1, "PROOF_INCOMPLETE", "VatChung thiếu Hash: SHA256(...). Không có bằng chứng thì không có kết quả."));
  } else {
    for (const arg of proof.hash.args) {
      referenced.add(arg);
      if (!local.has(arg)) {
        pairErrors.push(typeErr(proof.line, 1, "UNKNOWN_NAME", `SHA256 không thấy «${arg}».`));
      }
    }
  }
  if (!proof.claim) {
    pairErrors.push(typeErr(proof.line, 1, "PROOF_INCOMPLETE", "VatChung thiếu TrangThai: STAMP_LIVE | STAMP_OLD | STAMP_BETA."));
  }
}

function typeErr(line: number, col: number, code: string, message: string): Diagnostic {
  return { severity: "error", phase: "type", code, message, line, col };
}

function labelPole(p: Polarity): string {
  return p === "THUC_TAI" ? "ThucTai (Dương)" : "MoPhong (Âm)";
}

export function outline(program: Program): string {
  const lines: string[] = [];
  for (const arch of program.architectures) {
    lines.push(`KienTruc "${arch.name}"`);
    for (const b of arch.bindings) {
      const pole = b.polarity === "THUC_TAI" ? "ThucTai" : "Am";
      const head = b.taiTao ? "TaiTao " : "";
      lines.push(`  ${head}${b.kind} ${pole} ${b.name} = ${b.literal}`);
    }
    for (const fn of arch.functions) {
      const params = fn.params
        .map((param) => `${param.polarity === "THUC_TAI" ? "ThucTai" : "Am"} ${param.name}`)
        .join(", ");
      lines.push(`  Ham ${fn.name}(${params}) -> ${fn.ret}`);
      const dump = (stmts: Stmt[], pad: string) => {
        for (const s of stmts) {
          if (s.kind === "neu") {
            lines.push(`${pad}Neu DoLech(${s.a}, ${s.b}) > ${s.thresholdLiteral}`);
            dump(s.body, pad + "  ");
          } else if (s.kind === "hoaGiai") lines.push(`${pad}HoaGiai(${s.a}, ${s.b})`);
          else if (s.kind === "nhuCau") lines.push(`${pad}NhuCau("${s.ten}")`);
          else if (s.kind === "ghiNhan") lines.push(`${pad}GhiNhan(${s.what})`);
          else if (s.kind === "khoaBang") lines.push(`${pad}KhoaBang(${s.a}, ${s.b})`);
          else if (s.kind === "banSao") lines.push(`${pad}TaoBanSaoLoi(${s.a}, ${s.b})`);
          else if (s.kind === "baoLoi") lines.push(`${pad}BaoLoi`);
          else if (s.kind === "dung") lines.push(`${pad}GiaiDoan(Dung)`);
          else if (s.kind === "traVeOpen") lines.push(`${pad}TraVe NhuCau`);
          else lines.push(`${pad}TraVe VatChung`);
        }
      };
      dump(fn.body, "    ");
    }
  }
  for (const c of program.calls) {
    lines.push(`GiaoUoc("${c.arch}").${c.method}(${c.args.join(", ")})`);
  }
  return lines.join("\n");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hashPayload(literals: string[]): string {
  return literals.join("|");
}

function newAgentId(): string {
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

function roundDelta(n: number): number {
  return Math.round(Math.abs(n) * 1e6) / 1e6;
}

interface FrameCell extends Cell {
  alias: string;
}

async function interpret(program: Program, agentId: string): Promise<{
  diagnostics: Diagnostic[];
  trace: TraceEvent[];
  cells: Cell[];
  proofs: VatChung[];
  corrections: CorrectionEntry[];
  needs: NhuCauItem[];
}> {
  const diagnostics: Diagnostic[] = [];
  const trace: TraceEvent[] = [];
  const proofs: VatChung[] = [];
  const corrections: CorrectionEntry[] = [];
  const needs: NhuCauItem[] = [];
  const allCells: Cell[] = [];

  const archMap = new Map(program.architectures.map((a) => [a.name, a]));
  const jobs: Call[] =
    program.calls.length > 0
      ? program.calls
      : program.architectures.flatMap((arch) =>
          arch.functions
            .filter((fn) => fn.params.length === 0)
            .map((fn) => ({ arch: arch.name, method: fn.name, args: [], line: fn.line, col: 1 })),
        );

  if (jobs.length === 0) {
    diagnostics.push({
      severity: "error",
      phase: "exec",
      code: "NO_ENTRY",
      message: "Không có GiaoUoc và không có Ham không tham số để thực thi.",
      line: 1,
      col: 1,
    });
    return { diagnostics, trace, cells: allCells, proofs, corrections, needs };
  }

  for (const call of jobs) {
    const arch = archMap.get(call.arch);
    const fn = arch?.functions.find((f) => f.name === call.method);
    if (!arch || !fn) continue;
    const foundations = new Map<string, FrameCell>();
    for (const b of arch.bindings) {
      if (!b.name) continue;
      const prev = foundations.get(b.name);
      if (prev && b.taiTao) {
        prev.stamp = "STAMP_OLD";
        prev.frozen = true;
        trace.push({
          tone: "bone",
          title: `STAMP_OLD · ${prev.name}`,
          detail: `Khối ${prev.literal} bị khóa. Không đập lén. Bản mới sẽ dựng đè lên tên, bản cũ còn làm vật chứng.`,
        });
      }
      const cell: FrameCell = {
        name: b.name,
        polarity: b.polarity,
        value: b.value,
        literal: b.literal,
        stamp: "STAMP_BETA",
        frozen: false,
        version: prev ? prev.version + 1 : 1,
        kienTruc: arch.name,
        alias: b.name,
      };
      foundations.set(b.name, cell);
      allCells.push(cell);
      trace.push({
        tone: cell.polarity === "THUC_TAI" ? "yang" : "yin",
        title: `${cell.polarity === "THUC_TAI" ? "ThucTai" : "MoPhong"} · ${cell.name} = ${cell.literal}`,
        detail: `STAMP_BETA · chờ readback. Director ${DIRECTOR.name} sắp xếp. Agent ${agentId} chỉ nạp.`,
      });
    }

    const frame = new Map<string, FrameCell>();
    for (let i = 0; i < fn.params.length; i += 1) {
      const param = fn.params[i];
      const argName = call.args[i] ?? "";
      const src = foundations.get(argName);
      if (!param || !src) continue;
      const alias: FrameCell = { ...src, name: param.name, alias: src.name };
      frame.set(param.name, alias);
    }

    const resolve = (name: string): FrameCell | undefined => frame.get(name) ?? foundations.get(name);

    const freeze = (name: string) => {
      const cell = resolve(name);
      if (!cell) return;
      cell.frozen = true;
      const root = foundations.get(cell.alias);
      if (root) root.frozen = true;
    };

    const run: { phase: Phase } = { phase: "DONE" };

    const pushNeed = (ten: string, lyDo: string) => {
      const khoa = ten.startsWith("PheDuyet");
      needs.push({
        id: `NEED-${String(needs.length + 1).padStart(3, "0")}`,
        ten,
        lyDo,
        khongCho: true,
        khongMoKhoa: khoa,
        kienTruc: arch.name,
      });
      run.phase = "NHU_CAU";
      trace.push({
        tone: "yin",
        title: `NhuCau · ${ten}`,
        detail: lyDo,
      });
    };

    const sealPast = () => {
      for (const cell of foundations.values()) {
        cell.frozen = true;
        if (cell.polarity === "THUC_TAI") cell.stamp = "STAMP_OLD";
      }
    };
    let halted = false;
    let proofEmitted = false;
    let lastThreshold = 0;

    const execStmts = async (stmts: Stmt[]) => {
      for (const stmt of stmts) {
        if (halted) return;
        if (stmt.kind === "neu") {
          const ca = resolve(stmt.a);
          const cb = resolve(stmt.b);
          const lech = ca && cb ? roundDelta(ca.value - cb.value) : Number.POSITIVE_INFINITY;
          lastThreshold = stmt.threshold;
          const fire = lech > stmt.threshold;
          trace.push({
            tone: fire ? "yin" : "yang",
            title: `DoLech(${stmt.a}, ${stmt.b}) = ${lech}`,
            detail: fire
              ? `Lớn hơn ngưỡng ${stmt.thresholdLiteral}. Mở thân lệch pha — không che.`
              : `Trong ngưỡng ${stmt.thresholdLiteral}. Song ánh giữ được.`,
          });
          if (fire) await execStmts(stmt.body);
        } else if (stmt.kind === "ghiNhan") {
          trace.push({
            tone: "yin",
            title: `GhiNhan(${stmt.what})`,
            detail: "Lệch pha được ghi, không xóa, không nuốt.",
          });
        } else if (stmt.kind === "khoaBang" || stmt.kind === "banSao") {
          freeze(stmt.a);
          freeze(stmt.b);
          trace.push({
            tone: "bone",
            title: stmt.kind === "khoaBang" ? "KhoaBang" : "TaoBanSaoLoi",
            detail: `${stmt.a} và ${stmt.b} đóng băng làm vật chứng.`,
          });
        } else if (stmt.kind === "hoaGiai") {
          const ca = resolve(stmt.a);
          const cb = resolve(stmt.b);
          freeze(stmt.a);
          freeze(stmt.b);
          run.phase = "NHU_CAU";
          const lech = ca && cb ? roundDelta(ca.value - cb.value) : 0;
          const entry: CorrectionEntry = {
            id: `COR-${String(corrections.length + 1).padStart(3, "0")}`,
            at: new Date().toISOString(),
            kienTruc: arch.name,
            ham: fn.name,
            lech,
            nguong: lastThreshold,
            thucTai: {
              name: ca?.alias ?? stmt.a,
              value: ca?.value ?? 0,
              literal: ca?.literal ?? "?",
            },
            moPhong: {
              name: cb?.alias ?? stmt.b,
              value: cb?.value ?? 0,
              literal: cb?.literal ?? "?",
            },
            lesson:
              "Khóa cả hai cực. Lệch pha không bị xóa. Hệ thống nhận ra nhu cầu ThuHepLechPha — không chờ ai, không gọi là xong.",
          };
          corrections.push(entry);
          pushNeed(
            "ThuHepLechPha",
            `Lệch ${lech} vượt ngưỡng ${lastThreshold}. Thiếu công cụ thu hẹp. Đây là nhu cầu của hệ thống.`,
          );
        } else if (stmt.kind === "nhuCau") {
          if (stmt.ten.startsWith("PheDuyet")) sealPast();
          pushNeed(
            stmt.ten,
            stmt.ten.startsWith("PheDuyet")
              ? "Cửa nguồn khóa không mở. Chỉ phát phiếu đối chiếu. Không giữ bí mật đường truyền."
              : "Thiếu công cụ này. Hệ thống nhận ra đó là nhu cầu của chính nó.",
          );
        } else if (stmt.kind === "baoLoi") {
          diagnostics.push({
            severity: "error",
            phase: "exec",
            code: "EXEC_BAOLOI",
            message: stmt.message,
            line: stmt.line,
            col: 1,
          });
          trace.push({ tone: "stop", title: "BaoLoi", detail: stmt.message });
        } else if (stmt.kind === "dung") {
          run.phase = "STOP";
          halted = true;
          trace.push({
            tone: "stop",
            title: "GiaiDoan(Dung)",
            detail: "Dừng để giữ sự thật. Phiên không bị xóa. Đây là điểm dừng có chủ đích, không phải crash.",
          });
        } else if (stmt.kind === "traVeOpen") {
          pushNeed(stmt.message, "Trả về nhu cầu đã gọi tên. Không có trạng thái chờ.");
          halted = true;
          proofEmitted = true;
          await emitProof(stmt.message, null, [], "STAMP_BETA");
        } else if (stmt.kind === "traVeProof") {
          halted = true;
          proofEmitted = true;
          const names = proofNames(stmt.proof);
          const ketName = stmt.proof.ketQua && stmt.proof.ketQua.kind === "name" ? stmt.proof.ketQua.name : "";
          const ket = ketName ? resolve(ketName) : undefined;
          await emitProof("", ket ?? null, names, stmt.proof.claim ?? "STAMP_BETA");
        }
      }
    };

    const emitProof = async (note: string, ket: FrameCell | null, hashNames: string[], claim: Stamp) => {
      const literals: string[] = [];
      const touched: FrameCell[] = [];
      for (const name of hashNames) {
        const cell = resolve(name);
        if (!cell) continue;
        literals.push(cell.literal);
        touched.push(cell);
        const root = foundations.get(cell.alias);
        if (root && root !== cell) touched.push(root);
      }
      if (ket) {
        touched.push(ket);
        const root = foundations.get(ket.alias);
        if (root) touched.push(root);
      }
      const payload = hashPayload(literals.length > 0 ? literals : ket ? [ket.literal] : ["∅"]);
      const dataHash = await sha256Hex(payload);
      const again = await sha256Hex(payload);
      let readback: "KHOP" | "LECH" = again === dataHash ? "KHOP" : "LECH";
      if (readback === "LECH" && run.phase === "DONE") run.phase = "NHU_CAU";
      let accepted: Stamp = claim;
      if (run.phase === "NHU_CAU") accepted = claim === "STAMP_OLD" ? "STAMP_OLD" : "STAMP_BETA";
      else if (run.phase === "STOP") accepted = "STAMP_BETA";
      else if (run.phase === "DONE" && readback === "KHOP") accepted = "STAMP_LIVE";
      if (run.phase === "DONE" && readback === "KHOP") {
        for (const cell of touched) {
          if (cell.stamp !== "STAMP_OLD") cell.stamp = "STAMP_LIVE";
        }
      }
      const timestamp = new Date().toISOString();
      const sealedNote =
        note ||
        (run.phase === "NHU_CAU"
          ? "Nhu cầu đã được gọi tên. Không chờ ai. Khối chưa được phong STAMP_LIVE."
          : run.phase === "STOP"
            ? "Giai đoạn dừng. Vật chứng được niêm, không công nhận DONE."
            : "Readback khớp. KetQua là ThucTai. Khối được phong STAMP_LIVE.");
      const envelopeHash = await sha256Hex(
        JSON.stringify({
          dataHash,
          director: DIRECTOR.name,
          decision: DIRECTOR.decision,
          agentId,
          timestamp,
          phase: run.phase,
          accepted,
          ketQua: ket?.literal ?? null,
        }),
      );
      proofs.push({
        kienTruc: arch.name,
        ham: fn.name,
        ketQua: ket ? ket.value : null,
        ketQuaLiteral: ket?.literal ?? "—",
        dataHash,
        envelopeHash,
        claimStamp: claim,
        acceptedStamp: accepted,
        phase: run.phase,
        timestamp,
        agentId,
        director: DIRECTOR.name,
        decision: DIRECTOR.decision,
        readback,
        note: sealedNote,
      });
      trace.push({
        tone: run.phase === "DONE" ? "yang" : run.phase === "NHU_CAU" ? "yin" : "stop",
        title: `VatChung · ${run.phase} · readback ${readback}`,
        detail: `Data ${dataHash.slice(0, 16)}… · chấp nhận ${accepted} (yêu cầu ${claim}). Thực thi ${agentId}. Quyết định ${DIRECTOR.decision} / ${DIRECTOR.name}.`,
      });
    };

    trace.push({
      tone: "bone",
      title: `GiaoUoc("${arch.name}").${fn.name}`,
      detail: "Bắt đầu thực thi có giao ước.",
    });
    await execStmts(fn.body);
    if (!proofEmitted) {
      const note =
        run.phase === "NHU_CAU"
          ? "Hòa giải không trả VatChung. Hệ thống tự niêm phong — không có bằng chứng thì không có kết quả."
          : "Ham kết thúc mà không TraVe. Không công nhận DONE.";
      if (run.phase === "DONE") {
        run.phase = "STOP";
        diagnostics.push({
          severity: "error",
          phase: "exec",
          code: "MISSING_RETURN",
          message: `Ham ${fn.name} không TraVe VatChung.`,
          line: fn.line,
          col: 1,
        });
      }
      proofEmitted = true;
      const live = [...foundations.values()].filter((c) => c.stamp !== "STAMP_OLD");
      const thuc = live.find((c) => c.polarity === "THUC_TAI") ?? null;
      await emitProof(
        note,
        thuc,
        live.map((c) => c.name),
        "STAMP_BETA",
      );
    }
  }

  return { diagnostics, trace, cells: allCells, proofs, corrections, needs };
}

function proofNames(proof: ProofSyntax): string[] {
  if (proof.hash && proof.hash.kind === "sha") return proof.hash.args.filter(Boolean);
  if (proof.ketQua && proof.ketQua.kind === "name" && proof.ketQua.name) return [proof.ketQua.name];
  return [];
}

export async function runSource(source: string): Promise<RunResult> {
  pairErrors.length = 0;
  const lexed = lex(source);
  const parsed = parse(lexed.tokens, []);
  const diagnostics = [...lexed.diagnostics, ...parsed.diagnostics];
  const program = parsed.program;
  const hasParseError = diagnostics.some((d) => d.severity === "error");
  if (hasParseError) {
    return {
      ok: false,
      tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
      diagnostics,
      program,
      outline: outline(program),
      trace: [],
      cells: [],
      proofs: [],
      corrections: [],
      needs: [],
      agentId: "",
    };
  }
  const typeDiags = checkProgram(program);
  diagnostics.push(...typeDiags);
  if (typeDiags.some((d) => d.severity === "error")) {
    return {
      ok: false,
      tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
      diagnostics,
      program,
      outline: outline(program),
      trace: [
        {
          tone: "stop",
          title: "Siêu tĩnh chặn trước khi chạy",
          detail: "Không thực thi. Không có vật chứng. Lỗi nằm ở khai báo, không phải ở lúc đã ghi nhận sai.",
        },
      ],
      cells: [],
      proofs: [],
      corrections: [],
      needs: [],
      agentId: "",
    };
  }
  const agentId = newAgentId();
  const exec = await interpret(program, agentId);
  diagnostics.push(...exec.diagnostics);
  const ok = !diagnostics.some((d) => d.severity === "error");
  return {
    ok,
    tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
    diagnostics,
    program,
    outline: outline(program),
    trace: exec.trace,
    cells: exec.cells,
    proofs: exec.proofs,
    corrections: exec.corrections,
    needs: exec.needs,
    agentId,
  };
}
