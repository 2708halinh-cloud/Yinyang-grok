import assert from "node:assert/strict";
import { test } from "node:test";
import { HANH_TINH_DOC, dinhTuyen, giuSo } from "./starmap.ts";

test("máy đang mở thì nhận lệnh, localhost thì không", () => {
  assert.equal(HANH_TINH_DOC.length, 2);
  const may = HANH_TINH_DOC[0]!;
  assert.equal(may.ten, "Super-AI-Flatform");
  assert.equal(may.tenTruoc, "Ten-May-Moi");
  assert.equal(may.mach, "B560M H V2");
  assert.equal(may.bios, "American Megatrends International, LLC. F5b");
  assert.equal(may.uuidPhanCung, null);
  assert.equal(may.duong?.["W:\\"], false);
  assert.equal(dinhTuyen(may, "hostname").gui, true);
  const local = HANH_TINH_DOC[1]!;
  assert.equal(dinhTuyen(local, "hostname").gui, false);
});

test("số thô không mang nhãn cảm giác", () => {
  const giu = giuSo({ ramPhanTram: null, ioMs: null });
  assert.equal(giu.nhan, null);
  assert.throws(() => giuSo({ DISTRESS: 1 }));
});
