import type { CorrectionEntry, VatChung } from "./engine.ts";

const KEY = "xtime.levers.v2";
const CORRECTION_CAP = 40;

export interface LeverArchive {
  lever0: { source: string; savedAt: string } | null;
  lever1: { outline: string; savedAt: string } | null;
  lever2: { proofs: VatChung[]; savedAt: string } | null;
  lever201: { corrections: CorrectionEntry[]; savedAt: string };
}

export const EMPTY_ARCHIVE: LeverArchive = {
  lever0: null,
  lever1: null,
  lever2: null,
  lever201: { corrections: [], savedAt: "" },
};

function storage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export function loadArchive(): LeverArchive {
  const raw = storage()?.getItem(KEY);
  if (!raw) return EMPTY_ARCHIVE;
  try {
    const parsed = JSON.parse(raw) as Partial<LeverArchive>;
    return {
      lever0: parsed.lever0 ?? null,
      lever1: parsed.lever1 ?? null,
      lever2: parsed.lever2 ?? null,
      lever201: parsed.lever201 ?? { corrections: [], savedAt: "" },
    };
  } catch {
    return EMPTY_ARCHIVE;
  }
}

export function saveArchive(archive: LeverArchive): void {
  storage()?.setItem(KEY, JSON.stringify(archive));
}

export function clearArchive(): void {
  storage()?.removeItem(KEY);
}

export function appendCorrections(prev: CorrectionEntry[], next: CorrectionEntry[]): CorrectionEntry[] {
  if (next.length === 0) return prev;
  const room = Math.max(0, CORRECTION_CAP - prev.length);
  if (room === 0) return prev;
  return [...prev, ...next.slice(0, room)];
}
