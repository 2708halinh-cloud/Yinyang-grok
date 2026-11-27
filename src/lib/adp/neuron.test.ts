import assert from "node:assert/strict";
import { test } from "node:test";
import { chuTuDocx, dong, ghiDai, mo } from "./neuron.ts";

test("docx chỉ lấy chữ, macro không vào lớp dương", async () => {
  const xml = "<w:t>Kinh</w:t><w:macro>x</w:macro></w:macros><w:t> thanh</w:t>";
  const tep = await dong(chuTuDocx(xml) + "<script>alert(1)</script>", 64, 1);
  const ra = await mo(tep, 128);
  assert.equal(ra.ly, "Khop");
  assert.equal(ra.duong, "Kinh thanh");
  assert.equal(ra.tomTat.startsWith("10 "), true);
});

test("sửa chữ thì không trả nội dung, quá ram thì chỉ còn tóm tắt", async () => {
  const tep = await dong("that", 256, 1);
  const hong = tep.replace("that", "gia");
  assert.equal((await mo(hong, 512)).duong, null);
  const nang = await mo(tep, 64);
  assert.equal(nang.duong, null);
  assert.equal(nang.ly, "Qua ram");
  assert.equal(nang.tomTat.length > 0, true);
});

test("ký ức dài không ghi đè", () => {
  const mot = ghiDai({}, "a", "cu", true);
  const hai = ghiDai(mot, "a", "moi", true);
  assert.equal(hai.a, "cu");
  assert.equal(ghiDai(mot, "b", "rac", false).b, undefined);
});
