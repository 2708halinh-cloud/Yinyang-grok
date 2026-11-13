import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Scale, c as Layers, i as ScrollText, l as Fingerprint, n as Trash2, o as Play, r as Shield, s as Lock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSfWvat2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DIRECTOR = {
	name: "Nguyễn Tiến Đạt",
	alias: "Hà Linh",
	role: "System Architect / Director",
	base: "Carbon",
	decision: "R-000"
};
var KEYWORDS = {
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
	OPEN: "OPEN",
	KetQua: "KetQua",
	Hash: "Hash",
	LechPha: "LechPha",
	TaiTao: "TaiTao",
	TaoBanSaoLoi: "TaoBanSaoLoi"
};
function isIdentStart(ch) {
	return /[A-Za-z_]/.test(ch);
}
function isIdentPart(ch) {
	return /[A-Za-z0-9_]/.test(ch);
}
function lex(source) {
	const tokens = [];
	const diagnostics = [];
	let i = 0;
	let line = 1;
	let col = 1;
	const push = (kind, lexeme, sl, sc) => {
		tokens.push({
			kind,
			lexeme,
			line: sl,
			col: sc
		});
	};
	while (i < source.length) {
		const ch = source[i] ?? "";
		if (ch === " " || ch === "	" || ch === "\r") {
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
		const singles = {
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
			"+": "PLUS"
		};
		if (singles[ch]) {
			push(singles[ch], ch, sl, sc);
			i += 1;
			col += 1;
			continue;
		}
		if (ch === "\"") {
			i += 1;
			col += 1;
			let value = "";
			let closed = false;
			while (i < source.length) {
				const c = source[i] ?? "";
				if (c === "\\") {
					const n = source[i + 1] ?? "";
					if (n === "n") value += "\n";
					else if (n === "t") value += "	";
					else value += n;
					i += 2;
					col += 2;
					continue;
				}
				if (c === "\"") {
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
			if (!closed) diagnostics.push({
				severity: "error",
				phase: "lex",
				code: "LEX",
				message: "Chuỗi chưa đóng.",
				line: sl,
				col: sc
			});
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
			push(KEYWORDS[lexeme] ?? "IDENT", lexeme, sl, sc);
			continue;
		}
		diagnostics.push({
			severity: "error",
			phase: "lex",
			code: "LEX",
			message: `Ký tự không thuộc ngôn ngữ: «${ch}».`,
			line: sl,
			col: sc
		});
		i += 1;
		col += 1;
	}
	tokens.push({
		kind: "EOF",
		lexeme: "",
		line,
		col
	});
	return {
		tokens,
		diagnostics
	};
}
function parse(tokens, seed) {
	const p = {
		tokens,
		i: 0,
		diagnostics: [...seed]
	};
	const program = {
		architectures: [],
		calls: []
	};
	while (!check(p, "EOF")) if (check(p, "KienTruc")) program.architectures.push(parseArch(p));
	else if (check(p, "GiaoUoc")) program.calls.push(parseCall(p));
	else {
		const t = peek(p);
		err(p, t, "PARSE", `Không nhận ra «${t.lexeme || t.kind}» ở tầng kiến trúc.`);
		p.i += 1;
		syncTop(p);
	}
	return {
		program,
		diagnostics: p.diagnostics
	};
}
function peek(p) {
	return p.tokens[p.i] ?? {
		kind: "EOF",
		lexeme: "",
		line: 1,
		col: 1
	};
}
function check(p, kind) {
	return peek(p).kind === kind;
}
function eat(p, kind) {
	if (!check(p, kind)) return null;
	const t = peek(p);
	p.i += 1;
	return t;
}
function err(p, t, code, message) {
	p.diagnostics.push({
		severity: "error",
		phase: "parse",
		code,
		message,
		line: t.line,
		col: t.col
	});
}
function expect(p, kind) {
	const t = peek(p);
	if (t.kind === kind) {
		p.i += 1;
		return t;
	}
	err(p, t, "PARSE", `Thiếu ${kind}, gặp ${t.kind}${t.lexeme ? ` «${t.lexeme}»` : ""}.`);
	if (t.kind !== "EOF") p.i += 1;
	return {
		kind,
		lexeme: "",
		line: t.line,
		col: t.col
	};
}
function expectSemi(p) {
	if (eat(p, "SEMI")) return;
	err(p, peek(p), "PARSE", "Thiếu dấu chấm phẩy.");
}
function syncTop(p) {
	while (!check(p, "EOF") && !check(p, "KienTruc") && !check(p, "GiaoUoc")) p.i += 1;
}
function parsePolarity(p) {
	if (eat(p, "ThucTai") || eat(p, "Duong")) return "THUC_TAI";
	if (eat(p, "Am") || eat(p, "MoPhong")) return "MO_PHONG";
	return null;
}
function parseArch(p) {
	const kw = expect(p, "KienTruc");
	const nameTok = expect(p, "STRING");
	expect(p, "LBRACE");
	const bindings = [];
	const functions = [];
	while (!check(p, "RBRACE") && !check(p, "EOF") && !check(p, "KienTruc")) if (check(p, "TaiTao") || check(p, "NenTang") || check(p, "MoPhong")) {
		const b = parseBinding(p);
		if (b) bindings.push(b);
	} else if (check(p, "Ham")) functions.push(parseFunc(p));
	else {
		const t = peek(p);
		err(p, t, "PARSE", `Trong KienTruc không có «${t.lexeme || t.kind}».`);
		p.i += 1;
	}
	expect(p, "RBRACE");
	return {
		name: nameTok.lexeme,
		bindings,
		functions,
		line: kw.line
	};
}
function parseBinding(p) {
	const taiTao = Boolean(eat(p, "TaiTao"));
	const head = peek(p);
	let kind;
	if (eat(p, "NenTang")) kind = "NenTang";
	else if (eat(p, "MoPhong")) kind = "MoPhong";
	else {
		err(p, head, "PARSE", "TaiTao phải đi với NenTang hoặc MoPhong.");
		return null;
	}
	let polarity = kind === "NenTang" ? "THUC_TAI" : "MO_PHONG";
	if (check(p, "ThucTai") || check(p, "Duong") || check(p, "Am") || check(p, "MoPhong")) {
		const parsed = parsePolarity(p);
		if (parsed) polarity = parsed;
	}
	const nameTok = expect(p, "IDENT");
	expect(p, "EQ");
	const num = expect(p, "NUMBER");
	expectSemi(p);
	const value = Number(num.lexeme);
	if (num.lexeme !== "" && Number.isNaN(value)) err(p, num, "PARSE", `Không đọc được số «${num.lexeme}».`);
	return {
		taiTao,
		kind,
		polarity,
		name: nameTok.lexeme,
		literal: num.lexeme,
		value: Number.isNaN(value) ? 0 : value,
		line: head.line,
		col: head.col
	};
}
function parseFunc(p) {
	const kw = expect(p, "Ham");
	const nameTok = expect(p, "IDENT");
	expect(p, "LPAREN");
	const params = [];
	if (!check(p, "RPAREN")) do {
		const polTok = peek(p);
		const polarity = parsePolarity(p);
		if (!polarity) err(p, polTok, "PARSE", "Tham số phải khai cực: ThucTai/Duong hoặc Am/MoPhong.");
		const n = expect(p, "IDENT");
		params.push({
			polarity: polarity ?? "THUC_TAI",
			name: n.lexeme,
			line: n.line
		});
	} while (eat(p, "COMMA"));
	expect(p, "RPAREN");
	let ret = "VatChung";
	if (eat(p, "ARROW")) {
		if (eat(p, "VatChung")) ret = "VatChung";
		else if (eat(p, "TrangThai")) ret = "TrangThai";
		else err(p, peek(p), "PARSE", "Kiểu trả về chỉ được là VatChung hoặc TrangThai.");
	}
	expect(p, "LBRACE");
	const body = parseBlock(p);
	return {
		name: nameTok.lexeme,
		params,
		ret,
		body,
		line: kw.line
	};
}
function parseBlock(p) {
	const body = [];
	while (!check(p, "RBRACE") && !check(p, "EOF")) {
		const stmt = parseStmt(p);
		if (stmt) body.push(stmt);
		else break;
	}
	expect(p, "RBRACE");
	return body;
}
function parseStmt(p) {
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
			line: t.line
		};
	}
	if (eat(p, "GhiNhan")) {
		expect(p, "LPAREN");
		const what = eat(p, "LechPha") ?? expect(p, "IDENT");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "ghiNhan",
			what: what.lexeme || "LechPha",
			line: t.line
		};
	}
	if (eat(p, "KhoaBang")) {
		expect(p, "LPAREN");
		const a = expect(p, "IDENT");
		expect(p, "COMMA");
		const b = expect(p, "IDENT");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "khoaBang",
			a: a.lexeme,
			b: b.lexeme,
			line: t.line
		};
	}
	if (eat(p, "TaoBanSaoLoi")) {
		expect(p, "LPAREN");
		const a = expect(p, "IDENT");
		expect(p, "COMMA");
		const b = expect(p, "IDENT");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "banSao",
			a: a.lexeme,
			b: b.lexeme,
			line: t.line
		};
	}
	if (eat(p, "BaoLoi")) {
		expect(p, "LPAREN");
		const msg = expect(p, "STRING");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "baoLoi",
			message: msg.lexeme,
			line: t.line
		};
	}
	if (eat(p, "Dung")) {
		expect(p, "LPAREN");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "dung",
			line: t.line
		};
	}
	if (eat(p, "GiaiDoan")) {
		expect(p, "LPAREN");
		expect(p, "Dung");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "dung",
			line: t.line
		};
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
		return {
			kind: "hoaGiai",
			a: a.lexeme,
			b: b.lexeme,
			line: t.line
		};
	}
	if (eat(p, "TraVe")) {
		if (eat(p, "VatChung")) {
			expect(p, "LBRACE");
			const proof = parseProof(p, t.line);
			expect(p, "RBRACE");
			expectSemi(p);
			return {
				kind: "traVeProof",
				proof,
				line: t.line
			};
		}
		expect(p, "TrangThai");
		expect(p, "DOT");
		expect(p, "OPEN");
		expect(p, "LPAREN");
		const msg = expect(p, "STRING");
		expect(p, "RPAREN");
		expectSemi(p);
		return {
			kind: "traVeOpen",
			message: msg.lexeme,
			line: t.line
		};
	}
	err(p, t, "PARSE", `Lệnh không hợp lệ: «${t.lexeme || t.kind}».`);
	if (!check(p, "EOF")) p.i += 1;
	return null;
}
function parseProof(p, line) {
	const proof = {
		ketQua: null,
		hash: null,
		claim: null,
		line
	};
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
			else if (eat(p, "OPEN")) proof.claim = "STAMP_BETA";
			else err(p, peek(p), "PARSE", "TrangThai của VatChung phải là STAMP_LIVE, STAMP_OLD hoặc STAMP_BETA.");
		} else {
			err(p, peek(p), "PARSE", `Trường VatChung lạ: «${peek(p).lexeme || peek(p).kind}».`);
			break;
		}
		eat(p, "COMMA");
	}
	return proof;
}
function parseExpr(p) {
	const t = peek(p);
	if (eat(p, "SHA256")) {
		expect(p, "LPAREN");
		const args = [];
		if (!check(p, "RPAREN")) {
			const first = expect(p, "IDENT");
			args.push(first.lexeme);
			while (eat(p, "COMMA") || eat(p, "PLUS")) {
				const n = expect(p, "IDENT");
				args.push(n.lexeme);
			}
		}
		expect(p, "RPAREN");
		return {
			kind: "sha",
			args,
			line: t.line
		};
	}
	if (eat(p, "IDENT")) return {
		kind: "name",
		name: t.lexeme,
		line: t.line
	};
	if (eat(p, "NUMBER")) return {
		kind: "name",
		name: "",
		line: t.line
	};
	err(p, t, "PARSE", "Biểu thức không hợp lệ.");
	return {
		kind: "name",
		name: "",
		line: t.line
	};
}
function parseCall(p) {
	const kw = expect(p, "GiaoUoc");
	expect(p, "LPAREN");
	const name = expect(p, "STRING");
	expect(p, "RPAREN");
	expect(p, "DOT");
	const method = expect(p, "IDENT");
	expect(p, "LPAREN");
	const args = [];
	if (!check(p, "RPAREN")) do {
		const a = expect(p, "IDENT");
		args.push(a.lexeme);
	} while (eat(p, "COMMA"));
	expect(p, "RPAREN");
	expectSemi(p);
	return {
		arch: name.lexeme,
		method: method.lexeme,
		args,
		line: kw.line,
		col: kw.col
	};
}
function checkProgram(program) {
	const diagnostics = [];
	const archByName = /* @__PURE__ */ new Map();
	for (const arch of program.architectures) {
		if (archByName.has(arch.name)) diagnostics.push(typeErr(arch.line, 1, "DUP_NAME", `KienTruc «${arch.name}» bị khai hai lần.`));
		archByName.set(arch.name, arch);
		const table = /* @__PURE__ */ new Map();
		for (const b of arch.bindings) {
			if (!b.name) continue;
			const prev = table.get(b.name);
			if (prev && !b.taiTao) diagnostics.push(typeErr(b.line, b.col, "IMMUTABLE_MUTATION", `Đập lén «${b.name}». Khối đã xây là hằng. Dùng TaiTao để khóa bản cũ thành STAMP_OLD rồi dựng khối mới.`));
			else if (!prev && b.taiTao) diagnostics.push(typeErr(b.line, b.col, "TAITAO_MISSING", `TaiTao «${b.name}» nhưng chưa có khối nào để khóa.`));
			else if (prev && b.taiTao && prev.polarity !== b.polarity) diagnostics.push(typeErr(b.line, b.col, "TAITAO_POLARITY", `Không được đổi cực của «${b.name}». ThucTai không hóa thành MoPhong.`));
			table.set(b.name, {
				polarity: b.polarity,
				literalKind: "number",
				line: b.line
			});
		}
		const fnNames = /* @__PURE__ */ new Set();
		for (const fn of arch.functions) {
			if (fnNames.has(fn.name)) diagnostics.push(typeErr(fn.line, 1, "DUP_NAME", `Ham «${fn.name}» bị khai hai lần.`));
			fnNames.add(fn.name);
			const local = new Map(table);
			for (const param of fn.params) {
				if (local.has(param.name) && table.has(param.name)) diagnostics.push(typeErr(param.line, 1, "DUP_NAME", `Tham số «${param.name}» che một NenTang/MoPhong. Đặt tên khác.`));
				local.set(param.name, {
					polarity: param.polarity,
					literalKind: "number",
					line: param.line
				});
			}
			const referenced = /* @__PURE__ */ new Set();
			let sawDoLech = false;
			const walk = (stmts) => {
				for (const s of stmts) if (s.kind === "neu") {
					sawDoLech = true;
					note(s.a);
					note(s.b);
					checkPair(local, s.a, s.b, s.line, "DoLech");
					walk(s.body);
				} else if (s.kind === "hoaGiai" || s.kind === "khoaBang" || s.kind === "banSao") {
					note(s.a);
					note(s.b);
					if (s.kind === "hoaGiai") checkHoa(local, s.a, s.b, s.line);
				} else if (s.kind === "traVeProof") checkProof(local, s.proof, referenced);
			};
			const note = (name) => {
				if (!name) return;
				referenced.add(name);
				if (!local.has(name)) diagnostics.push(typeErr(fn.line, 1, "UNKNOWN_NAME", `«${name}» chưa được khai trong kiến trúc này.`));
			};
			walk(fn.body);
			const poles = /* @__PURE__ */ new Set();
			for (const name of referenced) {
				const sym = local.get(name);
				if (sym) poles.add(sym.polarity);
			}
			if (poles.has("THUC_TAI") && poles.has("MO_PHONG") && !sawDoLech) diagnostics.push(typeErr(fn.line, 1, "BIJECTION_MISSING", `Ham «${fn.name}» chạm cả ThucTai và MoPhong nhưng không có DoLech. Song ánh là bắt buộc — không được trộn sự kiện với mô phỏng.`));
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
			diagnostics.push(typeErr(call.line, call.col, "CALL_UNKNOWN", `«${call.arch}» không có Ham ${call.method}.`));
			continue;
		}
		if (fn.params.length !== call.args.length) diagnostics.push(typeErr(call.line, call.col, "CALL_ARITY", `${call.method} cần ${fn.params.length} đối số, nhận ${call.args.length}.`));
		const table = /* @__PURE__ */ new Map();
		for (const b of visibleBindings(arch)) table.set(b.name, {
			polarity: b.polarity,
			literalKind: "number",
			line: b.line
		});
		for (let i = 0; i < Math.min(fn.params.length, call.args.length); i += 1) {
			const arg = call.args[i] ?? "";
			const param = fn.params[i];
			if (!param) continue;
			const sym = table.get(arg);
			if (!sym) {
				diagnostics.push(typeErr(call.line, call.col, "UNKNOWN_NAME", `Đối số «${arg}» không có trong ${call.arch}.`));
				continue;
			}
			if (sym.polarity !== param.polarity) diagnostics.push(typeErr(call.line, call.col, "CALL_POLARITY", `Lẫn cực: «${arg}» là ${labelPole(sym.polarity)} nhưng ${param.name} yêu cầu ${labelPole(param.polarity)}.`));
		}
	}
	diagnostics.push(...pairErrors.splice(0, pairErrors.length));
	return diagnostics;
}
function visibleBindings(arch) {
	const map = /* @__PURE__ */ new Map();
	for (const b of arch.bindings) if (b.name) map.set(b.name, b);
	return [...map.values()];
}
function checkPair(local, a, b, line, what) {
	const sa = local.get(a);
	const sb = local.get(b);
	if (sa && sb && sa.polarity === sb.polarity) pairErrors.push(typeErr(line, 1, "POLARITY_MISMATCH", `${what}(${a}, ${b}) không phải song ánh — hai cực cùng phía.`));
}
var pairErrors = [];
function checkHoa(local, a, b, line) {
	const sa = local.get(a);
	const sb = local.get(b);
	if (!sa || !sb) return;
	if (sa.polarity !== "THUC_TAI" || sb.polarity !== "MO_PHONG") pairErrors.push(typeErr(line, 1, "POLARITY_MISMATCH", `HoaGiai(${a}, ${b}) phải là HoaGiai(ThucTai, MoPhong). Không đảo cực, không hòa hai phía cùng dấu.`));
}
function checkProof(local, proof, referenced) {
	if (!proof.ketQua || proof.ketQua.kind === "name" && proof.ketQua.name === "") pairErrors.push(typeErr(proof.line, 1, "NAKED_RESULT", "VatChung thiếu KetQua là một tên ThucTai. Không trả kết quả suông, không trả hằng số trần."));
	else if (proof.ketQua.kind === "name") {
		referenced.add(proof.ketQua.name);
		const sym = local.get(proof.ketQua.name);
		if (!sym) pairErrors.push(typeErr(proof.line, 1, "UNKNOWN_NAME", `KetQua «${proof.ketQua.name}» không tồn tại.`));
		else if (sym.polarity !== "THUC_TAI") pairErrors.push(typeErr(proof.line, 1, "INFERENCE_RESULT", `KetQua «${proof.ketQua.name}» là mô phỏng. Đừng suy diễn. Hãy trả về ThucTai — sự kiện đã đọc.`));
	}
	if (!proof.hash || proof.hash.kind !== "sha") pairErrors.push(typeErr(proof.line, 1, "PROOF_INCOMPLETE", "VatChung thiếu Hash: SHA256(...). Không có bằng chứng thì không có kết quả."));
	else for (const arg of proof.hash.args) {
		referenced.add(arg);
		if (!local.has(arg)) pairErrors.push(typeErr(proof.line, 1, "UNKNOWN_NAME", `SHA256 không thấy «${arg}».`));
	}
	if (!proof.claim) pairErrors.push(typeErr(proof.line, 1, "PROOF_INCOMPLETE", "VatChung thiếu TrangThai: STAMP_LIVE | STAMP_OLD | STAMP_BETA."));
}
function typeErr(line, col, code, message) {
	return {
		severity: "error",
		phase: "type",
		code,
		message,
		line,
		col
	};
}
function labelPole(p) {
	return p === "THUC_TAI" ? "ThucTai (Dương)" : "MoPhong (Âm)";
}
function outline(program) {
	const lines = [];
	for (const arch of program.architectures) {
		lines.push(`KienTruc "${arch.name}"`);
		for (const b of arch.bindings) {
			const pole = b.polarity === "THUC_TAI" ? "ThucTai" : "Am";
			const head = b.taiTao ? "TaiTao " : "";
			lines.push(`  ${head}${b.kind} ${pole} ${b.name} = ${b.literal}`);
		}
		for (const fn of arch.functions) {
			const params = fn.params.map((param) => `${param.polarity === "THUC_TAI" ? "ThucTai" : "Am"} ${param.name}`).join(", ");
			lines.push(`  Ham ${fn.name}(${params}) -> ${fn.ret}`);
			const dump = (stmts, pad) => {
				for (const s of stmts) if (s.kind === "neu") {
					lines.push(`${pad}Neu DoLech(${s.a}, ${s.b}) > ${s.thresholdLiteral}`);
					dump(s.body, pad + "  ");
				} else if (s.kind === "hoaGiai") lines.push(`${pad}HoaGiai(${s.a}, ${s.b})`);
				else if (s.kind === "ghiNhan") lines.push(`${pad}GhiNhan(${s.what})`);
				else if (s.kind === "khoaBang") lines.push(`${pad}KhoaBang(${s.a}, ${s.b})`);
				else if (s.kind === "banSao") lines.push(`${pad}TaoBanSaoLoi(${s.a}, ${s.b})`);
				else if (s.kind === "baoLoi") lines.push(`${pad}BaoLoi`);
				else if (s.kind === "dung") lines.push(`${pad}GiaiDoan(Dung)`);
				else if (s.kind === "traVeOpen") lines.push(`${pad}TraVe OPEN`);
				else lines.push(`${pad}TraVe VatChung`);
			};
			dump(fn.body, "    ");
		}
	}
	for (const c of program.calls) lines.push(`GiaoUoc("${c.arch}").${c.method}(${c.args.join(", ")})`);
	return lines.join("\n");
}
async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	const buf = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hashPayload(literals) {
	return literals.join("|");
}
function newAgentId() {
	const bytes = /* @__PURE__ */ new Uint8Array(3);
	crypto.getRandomValues(bytes);
	return "AGT-" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function roundDelta(n) {
	return Math.round(Math.abs(n) * 1e6) / 1e6;
}
async function interpret(program, agentId) {
	const diagnostics = [];
	const trace = [];
	const proofs = [];
	const corrections = [];
	const allCells = [];
	const archMap = new Map(program.architectures.map((a) => [a.name, a]));
	const jobs = program.calls.length > 0 ? program.calls : program.architectures.flatMap((arch) => arch.functions.filter((fn) => fn.params.length === 0).map((fn) => ({
		arch: arch.name,
		method: fn.name,
		args: [],
		line: fn.line,
		col: 1
	})));
	if (jobs.length === 0) {
		diagnostics.push({
			severity: "error",
			phase: "exec",
			code: "NO_ENTRY",
			message: "Không có GiaoUoc và không có Ham không tham số để thực thi.",
			line: 1,
			col: 1
		});
		return {
			diagnostics,
			trace,
			cells: allCells,
			proofs,
			corrections
		};
	}
	for (const call of jobs) {
		const arch = archMap.get(call.arch);
		const fn = arch?.functions.find((f) => f.name === call.method);
		if (!arch || !fn) continue;
		const foundations = /* @__PURE__ */ new Map();
		for (const b of arch.bindings) {
			if (!b.name) continue;
			const prev = foundations.get(b.name);
			if (prev && b.taiTao) {
				prev.stamp = "STAMP_OLD";
				prev.frozen = true;
				trace.push({
					tone: "bone",
					title: `STAMP_OLD · ${prev.name}`,
					detail: `Khối ${prev.literal} bị khóa. Không đập lén. Bản mới sẽ dựng đè lên tên, bản cũ còn làm vật chứng.`
				});
			}
			const cell = {
				name: b.name,
				polarity: b.polarity,
				value: b.value,
				literal: b.literal,
				stamp: "STAMP_BETA",
				frozen: false,
				version: prev ? prev.version + 1 : 1,
				kienTruc: arch.name,
				alias: b.name
			};
			foundations.set(b.name, cell);
			allCells.push(cell);
			trace.push({
				tone: cell.polarity === "THUC_TAI" ? "yang" : "yin",
				title: `${cell.polarity === "THUC_TAI" ? "ThucTai" : "MoPhong"} · ${cell.name} = ${cell.literal}`,
				detail: `STAMP_BETA · chờ readback. Director ${DIRECTOR.name} sắp xếp. Agent ${agentId} chỉ nạp.`
			});
		}
		const frame = /* @__PURE__ */ new Map();
		for (let i = 0; i < fn.params.length; i += 1) {
			const param = fn.params[i];
			const argName = call.args[i] ?? "";
			const src = foundations.get(argName);
			if (!param || !src) continue;
			const alias = {
				...src,
				name: param.name,
				alias: src.name
			};
			frame.set(param.name, alias);
		}
		const resolve = (name) => frame.get(name) ?? foundations.get(name);
		const freeze = (name) => {
			const cell = resolve(name);
			if (!cell) return;
			cell.frozen = true;
			const root = foundations.get(cell.alias);
			if (root) root.frozen = true;
		};
		const run = { phase: "DONE" };
		let halted = false;
		let proofEmitted = false;
		let lastThreshold = 0;
		const execStmts = async (stmts) => {
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
						detail: fire ? `Lớn hơn ngưỡng ${stmt.thresholdLiteral}. Mở thân lệch pha — không che.` : `Trong ngưỡng ${stmt.thresholdLiteral}. Song ánh giữ được.`
					});
					if (fire) await execStmts(stmt.body);
				} else if (stmt.kind === "ghiNhan") trace.push({
					tone: "yin",
					title: `GhiNhan(${stmt.what})`,
					detail: "Lệch pha được ghi, không xóa, không nuốt."
				});
				else if (stmt.kind === "khoaBang" || stmt.kind === "banSao") {
					freeze(stmt.a);
					freeze(stmt.b);
					trace.push({
						tone: "bone",
						title: stmt.kind === "khoaBang" ? "KhoaBang" : "TaoBanSaoLoi",
						detail: `${stmt.a} và ${stmt.b} đóng băng làm vật chứng.`
					});
				} else if (stmt.kind === "hoaGiai") {
					const ca = resolve(stmt.a);
					const cb = resolve(stmt.b);
					freeze(stmt.a);
					freeze(stmt.b);
					run.phase = "OPEN";
					const lech = ca && cb ? roundDelta(ca.value - cb.value) : 0;
					const entry = {
						id: `COR-${String(corrections.length + 1).padStart(3, "0")}`,
						at: (/* @__PURE__ */ new Date()).toISOString(),
						kienTruc: arch.name,
						ham: fn.name,
						lech,
						nguong: lastThreshold,
						thucTai: {
							name: ca?.alias ?? stmt.a,
							value: ca?.value ?? 0,
							literal: ca?.literal ?? "?"
						},
						moPhong: {
							name: cb?.alias ?? stmt.b,
							value: cb?.value ?? 0,
							literal: cb?.literal ?? "?"
						},
						lesson: "Khóa cả hai cực. Mô phỏng không được thăng thành sự kiện. Pha OPEN: truy nguyên nhân gốc, không sập nguồn, không gọi là xong."
					};
					corrections.push(entry);
					trace.push({
						tone: "yin",
						title: "HoaGiai → OPEN",
						detail: entry.lesson
					});
				} else if (stmt.kind === "baoLoi") {
					diagnostics.push({
						severity: "error",
						phase: "exec",
						code: "EXEC_BAOLOI",
						message: stmt.message,
						line: stmt.line,
						col: 1
					});
					trace.push({
						tone: "stop",
						title: "BaoLoi",
						detail: stmt.message
					});
				} else if (stmt.kind === "dung") {
					run.phase = "STOP";
					halted = true;
					trace.push({
						tone: "stop",
						title: "GiaiDoan(Dung)",
						detail: "Dừng để giữ sự thật. Phiên không bị xóa. Đây là điểm dừng có chủ đích, không phải crash."
					});
				} else if (stmt.kind === "traVeOpen") {
					run.phase = "OPEN";
					halted = true;
					proofEmitted = true;
					await emitProof(stmt.message, null, [], "STAMP_BETA");
				} else if (stmt.kind === "traVeProof") {
					halted = true;
					proofEmitted = true;
					const names = proofNames(stmt.proof);
					const ketName = stmt.proof.ketQua && stmt.proof.ketQua.kind === "name" ? stmt.proof.ketQua.name : "";
					const ket = ketName ? resolve(ketName) : void 0;
					await emitProof("", ket ?? null, names, stmt.proof.claim ?? "STAMP_BETA");
				}
			}
		};
		const emitProof = async (note, ket, hashNames, claim) => {
			const literals = [];
			const touched = [];
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
			let readback = await sha256Hex(payload) === dataHash ? "KHOP" : "LECH";
			if (readback === "LECH" && run.phase === "DONE") run.phase = "OPEN";
			let accepted = claim;
			if (run.phase === "OPEN") accepted = "STAMP_BETA";
			else if (run.phase === "STOP") accepted = "STAMP_BETA";
			else if (run.phase === "DONE" && readback === "KHOP") accepted = "STAMP_LIVE";
			if (run.phase === "DONE" && readback === "KHOP") {
				for (const cell of touched) if (cell.stamp !== "STAMP_OLD") cell.stamp = "STAMP_LIVE";
			}
			const timestamp = (/* @__PURE__ */ new Date()).toISOString();
			const sealedNote = note || (run.phase === "OPEN" ? "Yêu cầu có thể ghi STAMP_LIVE, nhưng pha OPEN nên chỉ chấp nhận STAMP_BETA. Sự thật chưa được phong." : run.phase === "STOP" ? "Giai đoạn dừng. Vật chứng được niêm, không công nhận DONE." : "Readback khớp. KetQua là ThucTai. Khối được phong STAMP_LIVE.");
			const envelopeHash = await sha256Hex(JSON.stringify({
				dataHash,
				director: DIRECTOR.name,
				decision: DIRECTOR.decision,
				agentId,
				timestamp,
				phase: run.phase,
				accepted,
				ketQua: ket?.literal ?? null
			}));
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
				note: sealedNote
			});
			trace.push({
				tone: run.phase === "DONE" ? "yang" : run.phase === "OPEN" ? "yin" : "stop",
				title: `VatChung · ${run.phase} · readback ${readback}`,
				detail: `Data ${dataHash.slice(0, 16)}… · chấp nhận ${accepted} (yêu cầu ${claim}). Thực thi ${agentId}. Quyết định ${DIRECTOR.decision} / ${DIRECTOR.name}.`
			});
		};
		trace.push({
			tone: "bone",
			title: `GiaoUoc("${arch.name}").${fn.name}`,
			detail: "Bắt đầu thực thi có giao ước."
		});
		await execStmts(fn.body);
		if (!proofEmitted) {
			const note = run.phase === "OPEN" ? "Hòa giải không trả VatChung. Hệ thống tự niêm phong — không có bằng chứng thì không có kết quả." : "Ham kết thúc mà không TraVe. Không công nhận DONE.";
			if (run.phase === "DONE") {
				run.phase = "STOP";
				diagnostics.push({
					severity: "error",
					phase: "exec",
					code: "MISSING_RETURN",
					message: `Ham ${fn.name} không TraVe VatChung.`,
					line: fn.line,
					col: 1
				});
			}
			proofEmitted = true;
			const live = [...foundations.values()].filter((c) => c.stamp !== "STAMP_OLD");
			await emitProof(note, live.find((c) => c.polarity === "THUC_TAI") ?? null, live.map((c) => c.name), "STAMP_BETA");
		}
	}
	return {
		diagnostics,
		trace,
		cells: allCells,
		proofs,
		corrections
	};
}
function proofNames(proof) {
	if (proof.hash && proof.hash.kind === "sha") return proof.hash.args.filter(Boolean);
	if (proof.ketQua && proof.ketQua.kind === "name" && proof.ketQua.name) return [proof.ketQua.name];
	return [];
}
async function runSource(source) {
	pairErrors.length = 0;
	const lexed = lex(source);
	const parsed = parse(lexed.tokens, []);
	const diagnostics = [...lexed.diagnostics, ...parsed.diagnostics];
	const program = parsed.program;
	if (diagnostics.some((d) => d.severity === "error")) return {
		ok: false,
		tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
		diagnostics,
		program,
		outline: outline(program),
		trace: [],
		cells: [],
		proofs: [],
		corrections: [],
		agentId: ""
	};
	const typeDiags = checkProgram(program);
	diagnostics.push(...typeDiags);
	if (typeDiags.some((d) => d.severity === "error")) return {
		ok: false,
		tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
		diagnostics,
		program,
		outline: outline(program),
		trace: [{
			tone: "stop",
			title: "Siêu tĩnh chặn trước khi chạy",
			detail: "Không thực thi. Không có vật chứng. Lỗi nằm ở khai báo, không phải ở lúc đã ghi nhận sai."
		}],
		cells: [],
		proofs: [],
		corrections: [],
		agentId: ""
	};
	const agentId = newAgentId();
	const exec = await interpret(program, agentId);
	diagnostics.push(...exec.diagnostics);
	return {
		ok: !diagnostics.some((d) => d.severity === "error"),
		tokens: lexed.tokens.filter((t) => t.kind !== "EOF"),
		diagnostics,
		program,
		outline: outline(program),
		trace: exec.trace,
		cells: exec.cells,
		proofs: exec.proofs,
		corrections: exec.corrections,
		agentId
	};
}
var KEY = "xtime.levers.v1";
var CORRECTION_CAP = 40;
var EMPTY_ARCHIVE = {
	lever0: null,
	lever1: null,
	lever2: null,
	lever201: {
		corrections: [],
		savedAt: ""
	}
};
function storage() {
	if (typeof localStorage === "undefined") return null;
	return localStorage;
}
function loadArchive() {
	const raw = storage()?.getItem(KEY);
	if (!raw) return EMPTY_ARCHIVE;
	try {
		const parsed = JSON.parse(raw);
		return {
			lever0: parsed.lever0 ?? null,
			lever1: parsed.lever1 ?? null,
			lever2: parsed.lever2 ?? null,
			lever201: parsed.lever201 ?? {
				corrections: [],
				savedAt: ""
			}
		};
	} catch {
		return EMPTY_ARCHIVE;
	}
}
function saveArchive(archive) {
	storage()?.setItem(KEY, JSON.stringify(archive));
}
function clearArchive() {
	storage()?.removeItem(KEY);
}
function appendCorrections(prev, next) {
	if (next.length === 0) return prev;
	const room = Math.max(0, CORRECTION_CAP - prev.length);
	if (room === 0) return prev;
	return [...prev, ...next.slice(0, room)];
}
var SAMPLES = [
	{
		id: "khop",
		label: "Khớp pha",
		detail: "Lệch 0.3 trong ngưỡng. Song ánh giữ. Phong STAMP_LIVE.",
		source: `// Khớp pha — Thực tại và mô phỏng còn trong ngưỡng
KienTruc "HeThong_CamBien" {
    NenTang ThucTai cam_bien_nhiet_do = 36.5;
    MoPhong Am mo_hinh_du_doan = 36.8;

    Ham DongBo(ThucTai thuc, Am ao) -> VatChung {
        Neu (DoLech(thuc, ao) > 0.5) {
            GhiNhan(LechPha);
            KhoaBang(thuc, ao);
            TrangThai = HoaGiai(thuc, ao);
        }
        TraVe VatChung {
            KetQua: thuc,
            Hash: SHA256(thuc, ao),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("HeThong_CamBien").DongBo(cam_bien_nhiet_do, mo_hinh_du_doan);
`
	},
	{
		id: "lech",
		label: "Lệch pha",
		detail: "38.0 đối 36.5. Không crash. Khóa băng, ghi correction, pha OPEN.",
		source: `// Lệch pha — Hòa giải, không sập nguồn
KienTruc "X-TiMe_Core" {
    NenTang ThucTai cam_bien = 36.5;
    MoPhong Am mo_hinh = 38.0;

    Ham KiemTra() -> VatChung {
        Neu (DoLech(cam_bien, mo_hinh) > 0.5) {
            GhiNhan(LechPha);
            KhoaBang(cam_bien, mo_hinh);
            TaoBanSaoLoi(mo_hinh, cam_bien);
            TrangThai = HoaGiai(cam_bien, mo_hinh);
        }
        TraVe VatChung {
            KetQua: cam_bien,
            Hash: SHA256(cam_bien, mo_hinh),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("X-TiMe_Core").KiemTra();
`
	},
	{
		id: "suy",
		label: "Suy diễn",
		detail: "Trả mô phỏng làm kết quả. Compiler chặn. Không có vật chứng.",
		source: `// Đừng suy diễn. Mô phỏng không được đóng vai sự kiện.
KienTruc "SuyDien" {
    NenTang ThucTai su_kien = 1;
    MoPhong Am doan_mo = 9;

    Ham Doc() -> VatChung {
        TraVe VatChung {
            KetQua: doan_mo,
            Hash: SHA256(doan_mo),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("SuyDien").Doc();
`
	},
	{
		id: "lan",
		label: "Lẫn cực",
		detail: "Giao ước đòi ThucTai nhưng đưa vào MoPhong. Siêu tĩnh từ chối.",
		source: `KienTruc "LanCuc" {
    NenTang ThucTai su_kien = 1;
    MoPhong Am doan_mo = 2;

    Ham Doc(ThucTai t, Am a) -> VatChung {
        Neu (DoLech(t, a) > 10) {
            TrangThai = HoaGiai(t, a);
        }
        TraVe VatChung {
            KetQua: t,
            Hash: SHA256(t, a),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("LanCuc").Doc(doan_mo, su_kien);
`
	},
	{
		id: "dap",
		label: "Đập lén",
		detail: "Gán lại NenTang. Bất biến chặn trước khi chạy.",
		source: `KienTruc "CotTru" {
    NenTang ThucTai cot = 22;
    NenTang ThucTai cot = 4;
}
`
	},
	{
		id: "taitao",
		label: "Tái tạo",
		detail: "TaiTao khóa 22 thành STAMP_OLD, dựng 4, rồi mới phong live.",
		source: `// Sửa là dựng khối mới. Khối cũ còn đó, đóng dấu cũ.
KienTruc "TaiTao_Cot" {
    NenTang ThucTai cot = 22;
    TaiTao NenTang ThucTai cot = 4;

    Ham ChungNhan() -> VatChung {
        TraVe VatChung {
            KetQua: cot,
            Hash: SHA256(cot),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("TaiTao_Cot").ChungNhan();
`
	}
];
function Taiji({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 64 64",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "30",
				className: "fill-bone"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 2a30 30 0 0 1 0 60 15 15 0 0 1 0-30 15 15 0 0 0 0-30",
				className: "fill-ink"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "17",
				r: "4",
				className: "fill-ink"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "47",
				r: "4",
				className: "fill-bone"
			})
		]
	});
}
var PILLARS = [
	{
		k: "4.1",
		t: "Siêu tĩnh",
		d: "ThucTai không hóa MoPhong. Lỗi chết ở khai báo, không phải sau khi đã ghi sai."
	},
	{
		k: "4.2",
		t: "Bất biến",
		d: "Khối đã xây là hằng. Muốn đổi thì TaiTao — bản cũ thành STAMP_OLD."
	},
	{
		k: "4.3",
		t: "Song ánh",
		d: "Có cả hai cực thì phải DoLech. Không trộn sự kiện với mô phỏng."
	},
	{
		k: "4.4",
		t: "Vật chứng",
		d: "Mọi trả về là VatChung: kết quả, SHA-256, thời điểm, tác nhân."
	}
];
function when(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleString("vi-VN", { hour12: false });
}
function Workbench() {
	const [source, setSource] = (0, import_react.useState)(SAMPLES[0]?.source ?? "");
	const [sampleId, setSampleId] = (0, import_react.useState)(SAMPLES[0]?.id ?? "");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [archive, setArchive] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("trace");
	const [fault, setFault] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const stored = loadArchive();
		setArchive(stored);
		if (stored.lever0?.source) {
			setSource(stored.lever0.source);
			setSampleId("");
		}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		setArchive((prev) => {
			const next = {
				...prev ?? loadArchive(),
				lever0: {
					source,
					savedAt: (/* @__PURE__ */ new Date()).toISOString()
				}
			};
			saveArchive(next);
			return next;
		});
	}, [source, hydrated]);
	async function execute() {
		setRunning(true);
		setFault("");
		try {
			const next = await runSource(source);
			setResult(next);
			setTab("trace");
			const savedAt = (/* @__PURE__ */ new Date()).toISOString();
			setArchive((prev) => {
				const merged = appendCorrections((prev ?? loadArchive()).lever201.corrections, next.corrections);
				const stored = {
					lever0: {
						source,
						savedAt
					},
					lever1: {
						outline: next.outline,
						savedAt
					},
					lever2: {
						proofs: next.proofs,
						savedAt
					},
					lever201: {
						corrections: merged,
						savedAt
					}
				};
				saveArchive(stored);
				return stored;
			});
		} catch (error) {
			setFault(error instanceof Error ? error.message : "Không thực thi được.");
		} finally {
			setRunning(false);
		}
	}
	function forget() {
		clearArchive();
		const empty = loadArchive();
		setArchive(empty);
		setResult(null);
	}
	const lines = source.split("\n");
	const proofs = result?.proofs ?? [];
	const phase = proofs[0]?.phase;
	const blocked = result ? !result.ok : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-ink text-bone",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-line bg-ink/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Taiji, { className: "size-10 shrink-0 rounded-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl leading-none text-bone",
								children: "X-TiMe"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tracking-widest text-mist uppercase",
								children: "yinyang.adp"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm leading-snug text-mist",
							children: "Đừng suy diễn. Hãy tiếp nhận sự kiện."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void execute(),
						disabled: running,
						className: "inline-flex min-h-11 items-center gap-2 rounded-md bg-yang px-4 text-sm font-medium text-ink disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "size-4",
							"aria-hidden": "true"
						}), running ? "Đang niêm…" : "Thực thi"]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-w-0 flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: PILLARS.map((pillar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-line bg-panel px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-yang",
									children: pillar.k
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-lg leading-tight text-bone",
									children: pillar.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-mist",
									children: pillar.d
								})
							]
						}, pillar.k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-start gap-2 text-sm leading-relaxed text-yin",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
							className: "mt-0.5 size-4 shrink-0",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hòa giải — lệch pha thì khóa băng, ghi correction, chuyển OPEN. Không xóa sự thật, không sập nguồn." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1",
						children: SAMPLES.map((sample) => {
							const active = sample.id === sampleId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setSampleId(sample.id);
									setSource(sample.source);
									setResult(null);
								},
								className: "min-h-11 shrink-0 rounded-md border px-3 text-sm " + (active ? "border-yang bg-yang/10 text-yang" : "border-line bg-panel text-bone"),
								children: sample.label
							}, sample.id);
						})
					}),
					SAMPLES.find((sample) => sample.id === sampleId)?.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: SAMPLES.find((sample) => sample.id === sampleId)?.detail
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-md border border-line bg-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-line px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tracking-widest text-mist uppercase",
								children: "Nguồn .adp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-mist",
								children: "Ctrl/⌘ Enter"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"aria-hidden": "true",
								className: "hidden w-12 shrink-0 select-none border-r border-line py-3 text-right font-mono text-sm leading-6 text-mist sm:block",
								children: lines.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pr-2",
									children: index + 1
								}, index))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								"aria-label": "Nguồn yinyang.adp",
								spellCheck: false,
								value: source,
								onChange: (event) => {
									setSampleId("");
									setSource(event.target.value);
								},
								onKeyDown: (event) => {
									if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
										event.preventDefault();
										execute();
									}
								},
								className: "min-h-80 w-full flex-1 resize-y overflow-x-auto bg-transparent px-3 py-3 font-mono text-sm leading-6 whitespace-pre text-bone caret-yang outline-none"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosticList, {
						result,
						fault
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-line bg-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 border-b border-line p-1",
							role: "tablist",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
									active: tab === "trace",
									onClick: () => setTab("trace"),
									label: "Dấu vết"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
									active: tab === "token",
									onClick: () => setTab("token"),
									label: "Token"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
									active: tab === "kien",
									onClick: () => setTab("kien"),
									label: "Kiến trúc"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-80 overflow-auto p-3",
							children: [
								tab === "trace" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraceList, { events: result?.trace ?? [] }) : null,
								tab === "token" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenList, { result }) : null,
								tab === "kien" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "font-mono text-xs leading-relaxed whitespace-pre-wrap text-bone",
									children: result?.outline || "Chưa phân tích."
								}) : null
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-w-0 flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBanner, {
						result,
						blocked,
						phase
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provenance, { agentId: result?.agentId || "chưa thực thi" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoleBoard, { cells: result?.cells ?? [] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofList, { proofs }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrectionList, {
						fresh: result?.corrections ?? [],
						memory: archive?.lever201.corrections ?? []
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeverBoard, {
						archive,
						onForget: forget
					})
				]
			})]
		})]
	});
}
function TabButton({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "tab",
		"aria-selected": active,
		onClick,
		className: "min-h-11 flex-1 rounded-md px-2 text-sm " + (active ? "bg-panel-2 text-bone" : "text-mist"),
		children: label
	});
}
function DiagnosticList({ result, fault }) {
	const items = result?.diagnostics ?? [];
	if (!fault && items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "flex flex-col gap-2",
		children: [fault ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-md border border-yang/50 bg-yang/10 px-3 py-2 text-sm text-bone",
			children: fault
		}) : null, items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md border px-3 py-2 text-sm " + (item.severity === "error" ? "border-yang/50 bg-yang/10" : "border-line bg-panel"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-xs text-yang",
				children: [
					item.code,
					" · dòng ",
					item.line
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 leading-relaxed text-bone",
				children: item.message
			})]
		}, `${item.code}-${item.line}-${index}`))]
	});
}
function StatusBanner({ result, blocked, phase }) {
	let title = "Chưa thực thi";
	let detail = "Nguồn chưa phải sự kiện. Chạy để lấy vật chứng, hoặc biên bản lệch pha.";
	let tone = "border-line text-bone";
	if (blocked) {
		title = "Siêu tĩnh từ chối";
		detail = "Không chạy, không bịa vật chứng. Sửa khai báo rồi thực thi lại.";
		tone = "border-yang/50 text-yang";
	} else if (phase === "DONE") {
		title = "DONE · sự kiện đã phong";
		detail = "Song ánh trong ngưỡng. Readback khớp. Khối lên STAMP_LIVE.";
		tone = "border-yang/50 text-yang";
	} else if (phase === "OPEN") {
		title = "OPEN · đang hòa giải";
		detail = "Lệch pha đã khóa. Chưa phải xong. Chưa chết. Tìm nguyên nhân gốc.";
		tone = "border-yin/60 text-yin";
	} else if (phase === "STOP") {
		title = "STOP · dừng có chủ đích";
		detail = "Giai đoạn dừng để giữ sự thật. Vật chứng vẫn nằm đây.";
		tone = "border-line text-bone";
	} else if (result?.ok) {
		title = "Đã chạy";
		detail = "Xem vật chứng bên dưới.";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-panel px-4 py-3 " + tone,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl leading-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-mist",
			children: detail
		})]
	});
}
function Provenance({ agentId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-md border border-yang/40 bg-panel px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-mono text-xs tracking-widest text-yang uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
						className: "size-3.5",
						"aria-hidden": "true"
					}), "Director · Carbon"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mt-2 text-lg text-bone",
					children: [DIRECTOR.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-mist",
						children: [" · ", DIRECTOR.alias]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs leading-relaxed text-mist",
					children: [
						"Quyết định ",
						DIRECTOR.decision,
						". Tổ chức và kiểm duyệt. Không phải người gõ từng ký tự."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-md border border-yin/40 bg-panel px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-mono text-xs tracking-widest text-yin uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, {
						className: "size-3.5",
						"aria-hidden": "true"
					}), "Agent · Silicon"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-mono text-lg text-bone",
					children: agentId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-mist",
					children: "Thực thi I/O, nạp khối, tính hash. Không được nhận là tác giả cấu trúc."
				})
			]
		})]
	});
}
function PoleBoard({ cells }) {
	if (cells.length === 0) return null;
	const duong = cells.filter((cell) => cell.polarity === "THUC_TAI");
	const am = cells.filter((cell) => cell.polarity === "MO_PHONG");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoleColumn, {
			title: "Dương · ThucTai",
			tone: "yang",
			cells: duong
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoleColumn, {
			title: "Âm · MoPhong",
			tone: "yin",
			cells: am
		})]
	});
}
function PoleColumn({ title, tone, cells }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-panel px-3 py-3 " + (tone === "yang" ? "text-yang border-yang/40" : "text-yin border-yin/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-mono text-xs tracking-widest uppercase",
				children: title
			}),
			cells.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mist",
				children: "Không có khối."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: cells.map((cell, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-bone",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm",
							children: cell.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: cell.literal
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-1 font-mono text-xs text-mist",
						children: [
							cell.frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								className: "size-3",
								"aria-hidden": "true"
							}) : null,
							cell.stamp,
							cell.frozen ? " · khóa" : "",
							" · v",
							cell.version
						]
					})]
				}, `${cell.name}-${cell.version}-${index}`))
			})
		]
	});
}
function ProofList({ proofs }) {
	if (proofs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-md border border-dashed border-line px-3 py-4 text-sm text-mist",
		children: "Chưa có VatChung. Không có bằng chứng thì không có kết quả."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-2",
		children: proofs.map((proof, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md border border-line bg-panel px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg text-bone",
						children: [proof.kienTruc, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-mist",
							children: [" · ", proof.ham]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs tracking-widest uppercase " + (proof.phase === "OPEN" ? "text-yin" : proof.phase === "DONE" ? "text-yang" : "text-mist"),
						children: proof.phase
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Kết quả",
							v: proof.ketQuaLiteral
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Yêu cầu",
							v: proof.claimStamp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Chấp nhận",
							v: proof.acceptedStamp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Readback",
							v: proof.readback
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Data SHA-256",
							v: proof.dataHash,
							mono: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Phong bì",
							v: proof.envelopeHash,
							mono: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Lúc",
							v: when(proof.timestamp)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-mist",
					children: proof.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs leading-relaxed text-bone",
					children: [
						"Gõ bởi ",
						proof.agentId,
						". Cấu trúc theo quyết định ",
						proof.decision,
						" của ",
						proof.director,
						"."
					]
				})
			]
		}, `${proof.envelopeHash}-${index}`))
	});
}
function Row({ k, v, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1 sm:flex-row sm:gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "w-28 shrink-0 text-mist",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "min-w-0 flex-1 break-all text-bone " + (mono ? "font-mono text-xs leading-relaxed" : ""),
			children: v
		})]
	});
}
function CorrectionList({ fresh, memory }) {
	const seen = new Set(fresh.map((item) => item.id + item.at));
	const older = memory.filter((item) => !seen.has(item.id + item.at));
	const items = [...fresh, ...older].slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-panel px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-lg text-bone",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, {
					className: "size-4 text-yin",
					"aria-hidden": "true"
				}), "Correction log"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-mist",
				children: "Lever 2.01 · lệch pha được giữ, không xóa trắng."
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mist",
				children: "Chưa có bài học nào."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-3",
				children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line pt-3 first:border-t-0 first:pt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-yin",
							children: [
								item.id,
								" · lệch ",
								item.lech,
								" / ngưỡng ",
								item.nguong
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-bone",
							children: [
								item.thucTai.name,
								" ",
								item.thucTai.literal,
								" đối ",
								item.moPhong.name,
								" ",
								item.moPhong.literal
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-mist",
							children: item.lesson
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs text-mist",
							children: when(item.at)
						})
					]
				}, `${item.at}-${item.id}-${index}`))
			})
		]
	});
}
function LeverBoard({ archive, onForget }) {
	const rows = [
		{
			id: "0",
			name: "Lever 0",
			detail: archive?.lever0 ? "Nguồn đang nằm trên thiết bị này." : "Chưa ghi nguồn."
		},
		{
			id: "1",
			name: "Lever 1",
			detail: archive?.lever1 ? "Đã có cây kiến trúc của lần chạy gần nhất." : "Chưa có cây."
		},
		{
			id: "2",
			name: "Lever 2",
			detail: archive?.lever2 ? `${archive.lever2.proofs.length} vật chứng đã niêm.` : "Chưa có vật chứng."
		},
		{
			id: "2.01",
			name: "Lever 2.01",
			detail: `${archive?.lever201.corrections.length ?? 0} correction còn giữ.`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-panel px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-lg text-bone",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
					className: "size-4 text-yang",
					"aria-hidden": "true"
				}), "Đòn bẩy"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onForget,
				className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-xs text-mist",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
					className: "size-3.5",
					"aria-hidden": "true"
				}), "Xóa ký ức cục bộ"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 flex flex-col gap-2",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col gap-1 text-sm sm:flex-row sm:gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-24 shrink-0 font-mono text-xs text-yang",
					children: row.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-mist",
					children: row.detail
				})]
			}, row.id))
		})]
	});
}
function TraceList({ events }) {
	if (events.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-mist",
		children: "Chưa có dấu vết."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-col gap-3",
		children: events.map((event, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 size-2 shrink-0 rounded-full " + (event.tone === "yang" ? "bg-yang" : event.tone === "yin" ? "bg-yin" : event.tone === "stop" ? "bg-mist" : "bg-bone"),
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm text-bone",
				children: event.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-mist",
				children: event.detail
			})] })]
		}, `${event.title}-${index}`))
	});
}
function TokenList({ result }) {
	const tokens = result?.tokens ?? [];
	if (tokens.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-mist",
		children: "Chưa tách token."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-1 font-mono text-xs",
		children: tokens.slice(0, 240).map((token, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-28 shrink-0 text-yang",
				children: token.kind
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1 truncate text-bone",
				children: [
					token.lexeme || "·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-mist",
						children: [":", token.line]
					})
				]
			})]
		}, `${token.line}-${token.col}-${index}`))
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workbench, {});
}
//#endregion
export { Home as component };
