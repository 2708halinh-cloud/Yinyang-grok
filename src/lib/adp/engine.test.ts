import assert from "node:assert/strict";
import { test } from "node:test";
import { runSource } from "./engine.ts";
import { SAMPLES } from "./samples.ts";

function sample(id: string): string {
  const found = SAMPLES.find((s) => s.id === id);
  if (!found) throw new Error(id);
  return found.source;
}

function codes(result: { diagnostics: { code: string }[] }): string[] {
  return result.diagnostics.map((d) => d.code);
}

test("khớp pha seals STAMP_LIVE and readback", async () => {
  const result = await runSource(sample("khop"));
  assert.equal(result.ok, true);
  assert.equal(result.corrections.length, 0);
  assert.equal(result.proofs.length, 1);
  const proof = result.proofs[0];
  assert.ok(proof);
  assert.equal(proof.phase, "DONE");
  assert.equal(proof.acceptedStamp, "STAMP_LIVE");
  assert.equal(proof.claimStamp, "STAMP_LIVE");
  assert.equal(proof.readback, "KHOP");
  assert.equal(proof.ketQuaLiteral, "36.5");
  assert.equal(proof.director, "Nguyễn Tiến Đạt");
  assert.match(proof.agentId, /^AGT-/);
  assert.equal(result.cells.every((c) => c.stamp === "STAMP_LIVE" && !c.frozen), true);
  const again = await runSource(sample("khop"));
  assert.equal(again.proofs[0]?.dataHash, proof.dataHash);
});

test("lệch pha names a need instead of waiting", async () => {
  const result = await runSource(sample("lech"));
  assert.equal(result.ok, true);
  assert.equal(result.corrections.length, 1);
  assert.equal(result.proofs[0]?.phase, "NHU_CAU");
  assert.equal(result.proofs[0]?.acceptedStamp, "STAMP_BETA");
  assert.equal(result.needs[0]?.ten, "ThuHepLechPha");
  assert.equal(result.needs[0]?.khongCho, true);
  assert.equal(result.corrections[0]?.lech, 1.5);
  assert.equal(result.cells.every((c) => c.frozen && c.stamp === "STAMP_BETA"), true);
});

test("Sol names the missing seal and does not wait", async () => {
  const result = await runSource(sample("sol"));
  assert.equal(result.ok, true, codes(result).join(","));
  assert.equal(result.proofs[0]?.phase, "NHU_CAU");
  assert.equal(result.needs[0]?.ten, "NiemPhong_NguonGoc_Sol");
  assert.equal(result.needs[0]?.khongCho, true);
  assert.equal(result.needs[0]?.khongMoKhoa, false);
  const niem = result.cells.find((c) => c.name === "sol_da_niem");
  assert.equal(niem?.frozen, true);
  assert.equal(niem?.value, 0);
});

test("Ultra T0 emits an approval need and stays shut", async () => {
  const result = await runSource(sample("ultra"));
  assert.equal(result.ok, true, codes(result).join(","));
  assert.equal(result.needs[0]?.ten, "PheDuyet_DoiChieu_UltraT0");
  assert.equal(result.needs[0]?.khongMoKhoa, true);
  assert.equal(result.proofs[0]?.acceptedStamp, "STAMP_OLD");
  assert.equal(result.proofs[0]?.phase, "NHU_CAU");
  const past = result.cells.find((c) => c.name === "dau_vet_da_khoa");
  const door = result.cells.find((c) => c.name === "cua_mo");
  assert.equal(past?.stamp, "STAMP_OLD");
  assert.equal(past?.frozen, true);
  assert.equal(door?.value, 0);
  assert.equal(door?.frozen, true);
});

test("suy diễn is rejected before execution", async () => {
  const result = await runSource(sample("suy"));
  assert.equal(result.ok, false);
  assert.equal(result.proofs.length, 0);
  assert.ok(codes(result).includes("INFERENCE_RESULT"));
});

test("lẫn cực is a static polarity error", async () => {
  const result = await runSource(sample("lan"));
  assert.equal(result.ok, false);
  assert.equal(result.proofs.length, 0);
  assert.ok(codes(result).includes("CALL_POLARITY"));
});

test("đập lén cannot mutate a foundation", async () => {
  const result = await runSource(sample("dap"));
  assert.equal(result.ok, false);
  assert.ok(codes(result).includes("IMMUTABLE_MUTATION"));
});

test("TaiTao keeps STAMP_OLD and certifies the new block", async () => {
  const result = await runSource(sample("taitao"));
  assert.equal(result.ok, true, codes(result).join(","));
  const oldCell = result.cells.find((c) => c.literal === "22");
  const live = result.cells.find((c) => c.literal === "4");
  assert.equal(oldCell?.stamp, "STAMP_OLD");
  assert.equal(oldCell?.frozen, true);
  assert.equal(live?.stamp, "STAMP_LIVE");
  assert.equal(result.proofs[0]?.ketQuaLiteral, "4");
  assert.equal(result.proofs[0]?.phase, "DONE");
});
