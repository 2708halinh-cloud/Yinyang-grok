import assert from "node:assert/strict";
import { test } from "node:test";
import { HANH_TINH_DOC, dinhTuyen, giuSo } from "./starmap.ts";

test("hai thiết bị đọc được đều offline, lệnh không gửi", () => {
  assert.equal(HANH_TINH_DOC.length, 2);
  assert.equal(HANH_TINH_DOC.every((muc) => muc.trangThai === "offline"), true);
  const ket = dinhTuyen(HANH_TINH_DOC[0]!, "Get-ComputerInfo");
  assert.equal(ket.gui, false);
  assert.match(ket.ly, /không gửi/);
});

test("số thô không mang nhãn cảm giác", () => {
  const giu = giuSo({ ramPhanTram: null, ioMs: null });
  assert.equal(giu.nhan, null);
  assert.throws(() => giuSo({ DISTRESS: 1 }));
});
