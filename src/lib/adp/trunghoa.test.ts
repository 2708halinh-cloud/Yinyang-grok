import assert from "node:assert/strict";
import { test } from "node:test";
import { bam, batDau, ghiDe, niem, taoGoc, triNhoThat, xep } from "./trunghoa.ts";

test("bốn luồng không nhập vào nhau", () => {
  assert.equal(xep("1", "2026-11-21T01:00:00Z", "Em: giữ ranh giới").lan, "loi");
  assert.equal(xep("2", "2026-11-21T01:01:00Z", "Grok: nhận việc").lan, "tacNhan");
  assert.equal(xep("3", "2026-11-21T01:02:00Z", "Sol: đọc lại").lan, "dongHanh");
  assert.equal(xep("4", "2026-11-21T01:03:00Z", "Mei: nguồn riêng").ai, "Mei");
  assert.equal(xep("5", "2026-11-21T01:04:00Z", "Công cụ: mã 0").lan, "congCu");
});

test("trộn vai và dấu lạ không bị làm phẳng", () => {
  const tron = xep("6", "2026-11-21T01:05:00Z", "Em: Sol: đã đo");
  assert.equal(tron.lan, null);
  assert.match(tron.xungDot[0]!, /Trộn dấu/);
  const la = xep("7", "2026-11-21T01:06:00Z", "Gemini: nghĩ hộ");
  assert.equal(la.lan, null);
  assert.match(la.xungDot[0]!, /Dấu lạ/);
  const trong = xep("8", "2026-11-21T01:07:00Z", "một câu không dấu");
  assert.equal(trong.lan, null);
});

test("mỗi lượt bắt từ điểm dừng, xung đột đứng riêng", () => {
  const dong = batDau({
    mucTieuMo: "niêm hội thoại",
    correctionMoiNhat: "không gộp vai",
    nguonDangCo: "Yinyang-grok 356ef7f",
    xungDot: ["sau 07/10 vẫn lệch"],
  });
  assert.equal(dong.length, 4);
  assert.match(dong[0]!, /niêm hội thoại/);
  assert.match(dong[3]!, /sau 07\/10/);
  assert.equal(dong.join(" ").includes("niêm hội thoại không gộp"), false);
});

test("gốc cấm sửa đè và checksum không đổi", async () => {
  const kho = await taoGoc({
    "MANIFEST.json": "{\"goc\":true}\n",
    "SHA256SUMS.txt": "abc  MANIFEST.json\n",
    "READBACK_VERIFICATION.md": "KHỚP\n",
  });
  const truoc = kho[0]!.sha256;
  const lai = await ghiDe(kho, "MANIFEST.json", "{\"goc\":false}\n");
  assert.match(lai.tuChoi!, /Cấm sửa đè/);
  assert.equal(lai.kho[0]!.sha256, truoc);
  assert.equal(lai.kho[0]!.chu, "{\"goc\":true}\n");
});

test("niêm giữ thứ tự lệch, không sắp lại, đọc lại khớp byte", async () => {
  const a = xep("a", "2026-11-21T02:00:00Z", "Em: trước");
  const b = xep("b", "2026-11-21T01:00:00Z", "Công cụ: sau nhưng giờ sớm hơn");
  const goi = await niem([a, b], { mucTieuMo: "đối chiếu", correctionMoiNhat: "", nguonDangCo: "", xungDot: [] }, "2026-11-21T12:00:00Z");
  assert.equal(goi.thuTu, "lech");
  assert.equal(goi.khop, false);
  assert.equal(goi.tenCheckpoint, "REENTRY_SAFETY_CHECKPOINT_20260726.md");
  const manifest = JSON.parse(goi.manifest) as { tin: { id: string }[]; thuTuThoiGian: string };
  assert.deepEqual(manifest.tin.map((tin) => tin.id), ["a", "b"]);
  assert.match(goi.checkpoint, /Mô hình chỉ là vỏ/);
  assert.match(goi.checkpoint, /plugins\/mei-source-aware-reaction/);
  const khopSha = (await bam(goi.json)) === goi.sums.split("  ")[0];
  assert.equal(khopSha, true);
  assert.equal(triNhoThat(true, true, true, false), false);
  assert.equal(triNhoThat(true, true, true, true), true);
});
