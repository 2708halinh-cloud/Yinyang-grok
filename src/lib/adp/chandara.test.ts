import assert from "node:assert/strict";
import { test } from "node:test";
import { chanDauRa, motMay } from "./chandara.ts";

test("ba tên là một máy, tên lạ không được nhập", () => {
  assert.equal(motMay(["DESKTOP-86ITNQ4", "PC-SUPER-AI", "TEM-MAY-MOI"]), true);
  assert.equal(motMay(["DESKTOP-86ITNQ4", "MAY-KHAC"]), false);
});

test("lời từ chối không có biên nhận thì bị chặn", () => {
  const chan = chanDauRa("Xin lỗi, chưa xác thực. Bước tiếp theo là em tự đọc UUID.", null);
  assert.equal(chan.qua, false);
});

test("biên nhận đủ bốn mục thì qua, mẫu thao tác của người thì qua", () => {
  const viec = chanDauRa("đã ghi", { lenh: "git push", file: "CHAN_DAU_RA.md", hash: "abc", gio: "2026-11-23T07:36:00Z" });
  assert.equal(viec.qua, true);
  const nguoi = chanDauRa("Thao tác em cần làm là thu hồi khóa. Tuyệt đối không dán khóa. Vì lộ thì sẽ bị lấy.", null);
  assert.equal(nguoi.qua, true);
});
