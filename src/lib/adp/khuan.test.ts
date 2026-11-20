import assert from "node:assert/strict";
import { test } from "node:test";
import { DO_THI, LUAT, docLenh } from "./khuan.ts";

test("mười hai luật có tên và không giết phiên", () => {
  assert.equal(LUAT.length, 12);
  const apt = docLenh("apt-get install vim", "alpine", true);
  assert.equal(apt.ma, 1);
  assert.equal(apt.giet, false);
  assert.equal(apt.luat, "Nhất thể");
});

test("tương đối, rung động, hấp dẫn, hành động", () => {
  assert.equal(docLenh("ls", "cmd", true).luat, "Tương đối");
  assert.equal(docLenh("ls l", "linux", true).luat, "Rung động");
  assert.equal(docLenh("foo", "linux", true).luat, "Hấp dẫn");
  assert.equal(docLenh("ls", "linux", false).luat, "Hành động");
});

test("âm nằm trong dương: bí danh, sao, ống, biến thiếu được bù", () => {
  assert.equal(docLenh("ll", "linux", true).ma, 0);
  assert.match(docLenh("rm *.txt", "linux", true).loi, /khoảng trống Âm/);
  assert.equal(docLenh('cat a.txt | grep "error" | sort', "linux", true).ma, 0);
  const missing = docLenh("echo $TEN", "linux", true);
  assert.equal(missing.luat, "Bù trừ");
  assert.equal(missing.giet, false);
  assert.equal(docLenh("echo $TEN", "linux", true, { TEN: "Đạt" }).ma, 0);
});

test("lệch một ký tự được trả về cho âm sửa, không chạy hộ", () => {
  const near = docLenh("lss", "linux", true);
  assert.equal(near.ma, 1);
  assert.match(near.goiY, /ls/);
  assert.equal(near.giet, false);
});

test("đồ thị là số đã đưa, không phải đo", () => {
  assert.equal(DO_THI.duongDoi, "22/4");
  assert.match(DO_THI.nguon, /không đo/);
  assert.equal(DO_THI.nguyen + DO_THI.tien + DO_THI.dat, 15);
});
