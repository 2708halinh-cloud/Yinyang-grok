import assert from "node:assert/strict";
import { test } from "node:test";
import { BA, NEO_CHU, SO_DANG_KY, giuNhip, gomNhip, khoangNhip, tay, temMay, thuXoa } from "./training.ts";

test("ba thứ đứng riêng, không cực nào bị xóa trong câu", () => {
  assert.match(BA.vatMang, /Không cực nào bị xóa/);
  assert.notEqual(BA.nangLuong, BA.suThat);
});

test("sổ đã có thì không bị bản này thay, neo chữ không thành tọa độ đã đo", () => {
  assert.equal(SO_DANG_KY.blob, "9ffdc2da742bd9ad07fbdfb8b27fcd8c8cf8b74e");
  assert.equal(NEO_CHU.docLaiKml, false);
  assert.equal(NEO_CHU.thayTheSoDoDat, false);
});

test("nhịp thô không thành nhãn tâm lý", () => {
  const giu = giuNhip({ tocDoGo: 12, tiLeXoa: 0.4, ngatQuangGiay: 0.2 });
  assert.equal(giu.nhanTamLy, null);
  assert.equal(giu.so.tiLeXoa, 0.4);
});

test("xóa trên nhánh không đụng bản thật", () => {
  const that = [
    { ten: "my-drive/thu-muc", chu: "byte" },
    { ten: "MANIFEST.json", chu: "goc" },
  ];
  const ket = thuXoa(that, "my-drive/thu-muc");
  assert.equal(ket.chapNhanThat, false);
  assert.deepEqual(ket.mat, ["my-drive/thu-muc"]);
  assert.equal(ket.that.length, 2);
  assert.equal(ket.nhanh.length, 1);
  assert.equal(ket.that[0]!.chu, "byte");
});

test("nhịp gõ là số, khoảng cách không thành danh tính", () => {
  const mau = gomNhip([
    { loai: "giu", ms: 80 },
    { loai: "cach", ms: 120 },
    { loai: "giu", ms: 90 },
    { loai: "cach", ms: 100 },
    { loai: "xoa", ms: 70 },
    { loai: "cach", ms: 140 },
    { loai: "giu", ms: 100 },
  ]);
  assert.equal(mau.soPhim, 4);
  assert.equal(mau.soXoa, 1);
  assert.equal(mau.tiLeXoa, 0.25);
  assert.equal(mau.giuGiua, 85);
  const khac = gomNhip([
    { loai: "giu", ms: 200 },
    { loai: "cach", ms: 300 },
    { loai: "giu", ms: 180 },
    { loai: "cach", ms: 280 },
    { loai: "giu", ms: 220 },
    { loai: "cach", ms: 260 },
    { loai: "giu", ms: 190 },
  ]);
  const cach = khoangNhip(mau, khac);
  assert.equal(typeof cach, "number");
  assert.equal(khoangNhip(gomNhip([]), mau), null);
  assert.equal("nhanTamLy" in mau, false);
});

test("tem máy không mượn chữ ký người, số dài không đi ra ngoài", () => {
  const tem = temMay("thử xóa", 1, "2026-11-22T02:31:00Z");
  assert.equal(tem.tacGia, "may");
  assert.equal(tem.chuKyNguoi, null);
  const ra = tay("so 012345678901 va 0912345678");
  assert.equal(ra.soMa, 2);
  assert.equal(ra.ra.includes("012345678901"), false);
  assert.equal(ra.ra.includes("0912345678"), false);
});
