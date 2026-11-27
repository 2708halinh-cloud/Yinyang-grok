import assert from "node:assert/strict";
import { test } from "node:test";
import { SAU, chanDon } from "./sau.ts";

test("sáu tên đúng quy hoạch, dọn bị chặn", () => {
  assert.equal(SAU.length, 6);
  assert.equal(chanDon("Coaching").qua, false);
  assert.equal(chanDon("Systems Coaching New").qua, false);
  assert.equal(chanDon("starmap").qua, true);
});
