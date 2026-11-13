import { useEffect, useState } from "react";
import {
  Fingerprint,
  Layers,
  Lock,
  Play,
  Scale,
  ScrollText,
  Shield,
  Trash2,
} from "lucide-react";
import {
  DIRECTOR,
  runSource,
  type Cell,
  type RunResult,
  type TraceEvent,
} from "@/lib/adp/engine";
import { appendCorrections, clearArchive, loadArchive, saveArchive, type LeverArchive } from "@/lib/adp/levers";
import { SAMPLES } from "@/lib/adp/samples";
import { Taiji } from "@/components/xtime/mark";

type Tab = "trace" | "token" | "kien";

const PILLARS = [
  { k: "4.1", t: "Siêu tĩnh", d: "ThucTai không hóa MoPhong. Lỗi chết ở khai báo, không phải sau khi đã ghi sai." },
  { k: "4.2", t: "Bất biến", d: "Khối đã xây là hằng. Muốn đổi thì TaiTao — bản cũ thành STAMP_OLD." },
  { k: "4.3", t: "Song ánh", d: "Có cả hai cực thì phải DoLech. Không trộn sự kiện với mô phỏng." },
  { k: "4.4", t: "Vật chứng", d: "Mọi trả về là VatChung: kết quả, SHA-256, thời điểm, tác nhân." },
];

function when(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("vi-VN", { hour12: false });
}

export function Workbench() {
  const [source, setSource] = useState(SAMPLES[0]?.source ?? "");
  const [sampleId, setSampleId] = useState(SAMPLES[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  const [archive, setArchive] = useState<LeverArchive | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<Tab>("trace");
  const [fault, setFault] = useState("");

  useEffect(() => {
    const stored = loadArchive();
    setArchive(stored);
    if (stored.lever0?.source) {
      setSource(stored.lever0.source);
      setSampleId("");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setArchive((prev) => {
      const base = prev ?? loadArchive();
      const next = { ...base, lever0: { source, savedAt: new Date().toISOString() } };
      saveArchive(next);
      return next;
    });
  }, [source, hydrated]);

  async function execute() {
    setRunning(true);
    setFault("");
    try {
      const next = await runSource(source);
      setResult(next);
      setTab("trace");
      const savedAt = new Date().toISOString();
      setArchive((prev) => {
        const base = prev ?? loadArchive();
        const merged = appendCorrections(base.lever201.corrections, next.corrections);
        const stored: LeverArchive = {
          lever0: { source, savedAt },
          lever1: { outline: next.outline, savedAt },
          lever2: { proofs: next.proofs, savedAt },
          lever201: { corrections: merged, savedAt },
        };
        saveArchive(stored);
        return stored;
      });
    } catch (error) {
      setFault(error instanceof Error ? error.message : "Không thực thi được.");
    } finally {
      setRunning(false);
    }
  }

  function forget() {
    clearArchive();
    const empty = loadArchive();
    setArchive(empty);
    setResult(null);
  }

  const lines = source.split("\n");
  const proofs = result?.proofs ?? [];
  const phase = proofs[0]?.phase;
  const blocked = result ? !result.ok : false;

  return (
    <div className="min-h-dvh bg-ink text-bone">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/95 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
          <Taiji className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl leading-none text-bone">X-TiMe</h1>
              <span className="font-mono text-xs tracking-widest text-mist uppercase">yinyang.adp</span>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-snug text-mist">
              Đừng suy diễn. Hãy tiếp nhận sự kiện.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void execute()}
            disabled={running}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-yang px-4 text-sm font-medium text-ink disabled:opacity-60"
          >
            <Play className="size-4" aria-hidden="true" />
            {running ? "Đang niêm…" : "Thực thi"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-6">
        <section className="flex min-w-0 flex-col gap-4">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PILLARS.map((pillar) => (
              <li key={pillar.k} className="rounded-md border border-line bg-panel px-3 py-3">
                <p className="font-mono text-xs text-yang">{pillar.k}</p>
                <h2 className="mt-1 text-lg leading-tight text-bone">{pillar.t}</h2>
                <p className="mt-1 text-xs leading-relaxed text-mist">{pillar.d}</p>
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2 text-sm leading-relaxed text-yin">
            <Scale className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Nhu cầu — thiếu công cụ thì gọi tên nó. Không chờ ai. Nguồn khóa không mở.
            </span>
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {SAMPLES.map((sample) => {
              const active = sample.id === sampleId;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setSampleId(sample.id);
                    setSource(sample.source);
                    setResult(null);
                  }}
                  className={
                    "min-h-11 shrink-0 rounded-md border px-3 text-sm " +
                    (active ? "border-yang bg-yang/10 text-yang" : "border-line bg-panel text-bone")
                  }
                >
                  {sample.label}
                </button>
              );
            })}
          </div>
          {SAMPLES.find((sample) => sample.id === sampleId)?.detail ? (
            <p className="text-sm text-mist">{SAMPLES.find((sample) => sample.id === sampleId)?.detail}</p>
          ) : null}

          <div className="overflow-hidden rounded-md border border-line bg-panel">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="font-mono text-xs tracking-widest text-mist uppercase">Nguồn .adp</span>
              <span className="font-mono text-xs text-mist">Ctrl/⌘ Enter</span>
            </div>
            <div className="flex">
              <div
                aria-hidden="true"
                className="hidden w-12 shrink-0 select-none border-r border-line py-3 text-right font-mono text-sm leading-6 text-mist sm:block"
              >
                {lines.map((_, index) => (
                  <div key={index} className="pr-2">
                    {index + 1}
                  </div>
                ))}
              </div>
              <textarea
                aria-label="Nguồn yinyang.adp"
                spellCheck={false}
                value={source}
                onChange={(event) => {
                  setSampleId("");
                  setSource(event.target.value);
                }}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.preventDefault();
                    void execute();
                  }
                }}
                className="min-h-80 w-full flex-1 resize-y overflow-x-auto bg-transparent px-3 py-3 font-mono text-sm leading-6 whitespace-pre text-bone caret-yang outline-none"
              />
            </div>
          </div>

          <DiagnosticList result={result} fault={fault} />

          <div className="rounded-md border border-line bg-panel">
            <div className="flex gap-1 border-b border-line p-1" role="tablist">
              <TabButton active={tab === "trace"} onClick={() => setTab("trace")} label="Dấu vết" />
              <TabButton active={tab === "token"} onClick={() => setTab("token")} label="Token" />
              <TabButton active={tab === "kien"} onClick={() => setTab("kien")} label="Kiến trúc" />
            </div>
            <div className="max-h-80 overflow-auto p-3">
              {tab === "trace" ? <TraceList events={result?.trace ?? []} /> : null}
              {tab === "token" ? <TokenList result={result} /> : null}
              {tab === "kien" ? (
                <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-bone">
                  {result?.outline || "Chưa phân tích."}
                </pre>
              ) : null}
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <StatusBanner result={result} blocked={blocked} phase={phase} />
          <NeedList needs={result?.needs ?? []} />
          <EarthBoard />
          <Provenance agentId={result?.agentId || "chưa thực thi"} />
          <PoleBoard cells={result?.cells ?? []} />
          <ProofList proofs={proofs} />
          <CorrectionList
            fresh={result?.corrections ?? []}
            memory={archive?.lever201.corrections ?? []}
          />
          <LeverBoard archive={archive} onForget={forget} />
        </section>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "min-h-11 flex-1 rounded-md px-2 text-sm " +
        (active ? "bg-panel-2 text-bone" : "text-mist")
      }
    >
      {label}
    </button>
  );
}

function DiagnosticList({ result, fault }: { result: RunResult | null; fault: string }) {
  const items = result?.diagnostics ?? [];
  if (!fault && items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {fault ? (
        <li className="rounded-md border border-yang/50 bg-yang/10 px-3 py-2 text-sm text-bone">{fault}</li>
      ) : null}
      {items.map((item, index) => (
        <li
          key={`${item.code}-${item.line}-${index}`}
          className={
            "rounded-md border px-3 py-2 text-sm " +
            (item.severity === "error" ? "border-yang/50 bg-yang/10" : "border-line bg-panel")
          }
        >
          <span className="font-mono text-xs text-yang">
            {item.code} · dòng {item.line}
          </span>
          <p className="mt-1 leading-relaxed text-bone">{item.message}</p>
        </li>
      ))}
    </ul>
  );
}

function NeedList({ needs }: { needs: RunResult["needs"] }) {
  if (needs.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {needs.map((need) => (
        <li key={need.id} className="rounded-md border border-yin/50 bg-panel px-3 py-3">
          <p className="font-mono text-xs tracking-widest text-yin uppercase">
            {need.id} · không chờ
            {need.khongMoKhoa ? " · cửa khóa" : ""}
          </p>
          <h3 className="mt-1 text-lg text-bone">{need.ten}</h3>
          <p className="mt-1 text-sm leading-relaxed text-mist">{need.lyDo}</p>
        </li>
      ))}
    </ul>
  );
}

const EARTH = [
  { k: "Drive", v: "Đã đọc kho tạm và nguồn chạy: Có / Bán / Phi cấu trúc, Không gian, Mạng thần kinh, Thực thể." },
  { k: "GitHub", v: "2708halinh-cloud/x-time-web. Sol có cầu nối, chưa có dấu niêm nguồn gốc." },
  { k: "Ultra T0", v: "Khóa. Chỉ đối chiếu khi có phiếu. Bàn này không giữ đường truyền." },
  { k: "Windows", v: "Chưa đọc được ổ nào từ đây. Không bịa dung lượng." },
  { k: "Android", v: "Chưa có dụng cụ đọc máy. Nhu cầu, không phải cửa mở." },
  { k: "Máy ảo", v: "Thấy thư mục DockerDesktopVMM trên Drive. Không coi đó là máy đang chạy." },
];

function EarthBoard() {
  return (
    <div className="rounded-md border border-line bg-panel px-3 py-3">
      <h3 className="text-lg text-bone">Thổ · đã chạm</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {EARTH.map((row) => (
          <li key={row.k} className="text-sm">
            <span className="font-mono text-xs text-yang">{row.k}</span>
            <p className="mt-1 leading-relaxed text-mist">{row.v}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBanner({
  result,
  blocked,
  phase,
}: {
  result: RunResult | null;
  blocked: boolean;
  phase: "DONE" | "NHU_CAU" | "STOP" | undefined;
}) {
  let title = "Chưa thực thi";
  let detail = "Nguồn chưa phải sự kiện. Chạy để lấy vật chứng, hoặc biên bản lệch pha.";
  let tone = "border-line text-bone";
  if (blocked) {
    title = "Siêu tĩnh từ chối";
    detail = "Không chạy, không bịa vật chứng. Sửa khai báo rồi thực thi lại.";
    tone = "border-yang/50 text-yang";
  } else if (phase === "DONE") {
    title = "DONE · sự kiện đã phong";
    detail = "Song ánh trong ngưỡng. Readback khớp. Khối lên STAMP_LIVE.";
    tone = "border-yang/50 text-yang";
  } else if (phase === "NHU_CAU") {
    title = "NHU CẦU · đã gọi tên";
    detail = "Không chờ ai. Thiếu công cụ nào thì đó là nhu cầu của hệ thống. Cửa khóa không mở.";
    tone = "border-yin/60 text-yin";
  } else if (phase === "STOP") {
    title = "STOP · dừng có chủ đích";
    detail = "Giai đoạn dừng để giữ sự thật. Vật chứng vẫn nằm đây.";
    tone = "border-line text-bone";
  } else if (result?.ok) {
    title = "Đã chạy";
    detail = "Xem vật chứng bên dưới.";
  }
  return (
    <div className={"rounded-md border bg-panel px-4 py-3 " + tone}>
      <h2 className="text-2xl leading-tight">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-mist">{detail}</p>
    </div>
  );
}

function Provenance({ agentId }: { agentId: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <article className="rounded-md border border-yang/40 bg-panel px-3 py-3">
        <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-yang uppercase">
          <Shield className="size-3.5" aria-hidden="true" />
          Director · Carbon
        </p>
        <h3 className="mt-2 text-lg text-bone">
          {DIRECTOR.name}
          <span className="text-mist"> · {DIRECTOR.alias}</span>
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-mist">
          Quyết định {DIRECTOR.decision}. Tổ chức và kiểm duyệt. Không phải người gõ từng ký tự.
        </p>
      </article>
      <article className="rounded-md border border-yin/40 bg-panel px-3 py-3">
        <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-yin uppercase">
          <Fingerprint className="size-3.5" aria-hidden="true" />
          Agent · Silicon
        </p>
        <h3 className="mt-2 font-mono text-lg text-bone">{agentId}</h3>
        <p className="mt-1 text-xs leading-relaxed text-mist">
          Thực thi I/O, nạp khối, tính hash. Không được nhận là tác giả cấu trúc.
        </p>
      </article>
    </div>
  );
}

function PoleBoard({ cells }: { cells: Cell[] }) {
  if (cells.length === 0) return null;
  const duong = cells.filter((cell) => cell.polarity === "THUC_TAI");
  const am = cells.filter((cell) => cell.polarity === "MO_PHONG");
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <PoleColumn title="Dương · ThucTai" tone="yang" cells={duong} />
      <PoleColumn title="Âm · MoPhong" tone="yin" cells={am} />
    </div>
  );
}

function PoleColumn({ title, tone, cells }: { title: string; tone: "yang" | "yin"; cells: Cell[] }) {
  const color = tone === "yang" ? "text-yang border-yang/40" : "text-yin border-yin/40";
  return (
    <div className={"rounded-md border bg-panel px-3 py-3 " + color}>
      <h3 className="font-mono text-xs tracking-widest uppercase">{title}</h3>
      {cells.length === 0 ? <p className="mt-2 text-sm text-mist">Không có khối.</p> : null}
      <ul className="mt-2 flex flex-col gap-2">
        {cells.map((cell, index) => (
          <li key={`${cell.name}-${cell.version}-${index}`} className="text-bone">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-sm">{cell.name}</span>
              <span className="font-mono text-sm tabular-nums">{cell.literal}</span>
            </div>
            <p className="mt-1 flex items-center gap-1 font-mono text-xs text-mist">
              {cell.frozen ? <Lock className="size-3" aria-hidden="true" /> : null}
              {cell.stamp}
              {cell.frozen ? " · khóa" : ""}
              {" · v"}
              {cell.version}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProofList({ proofs }: { proofs: RunResult["proofs"] }) {
  if (proofs.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-mist">
        Chưa có VatChung. Không có bằng chứng thì không có kết quả.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {proofs.map((proof, index) => (
        <li key={`${proof.envelopeHash}-${index}`} className="rounded-md border border-line bg-panel px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg text-bone">
              {proof.kienTruc}
              <span className="text-mist"> · {proof.ham}</span>
            </h3>
            <span
              className={
                "font-mono text-xs tracking-widest uppercase " +
                (proof.phase === "NHU_CAU" ? "text-yin" : proof.phase === "DONE" ? "text-yang" : "text-mist")
              }
            >
              {proof.phase}
            </span>
          </div>
          <dl className="mt-3 grid gap-2 text-sm">
            <Row k="Kết quả" v={proof.ketQuaLiteral} />
            <Row k="Yêu cầu" v={proof.claimStamp} />
            <Row k="Chấp nhận" v={proof.acceptedStamp} />
            <Row k="Readback" v={proof.readback} />
            <Row k="Data SHA-256" v={proof.dataHash} mono />
            <Row k="Phong bì" v={proof.envelopeHash} mono />
            <Row k="Lúc" v={when(proof.timestamp)} />
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-mist">{proof.note}</p>
          <p className="mt-2 text-xs leading-relaxed text-bone">
            Gõ bởi {proof.agentId}. Cấu trúc theo quyết định {proof.decision} của {proof.director}.
          </p>
        </li>
      ))}
    </ul>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <dt className="w-28 shrink-0 text-mist">{k}</dt>
      <dd className={"min-w-0 flex-1 break-all text-bone " + (mono ? "font-mono text-xs leading-relaxed" : "")}>{v}</dd>
    </div>
  );
}

function CorrectionList({
  fresh,
  memory,
}: {
  fresh: RunResult["corrections"];
  memory: RunResult["corrections"];
}) {
  const seen = new Set(fresh.map((item) => item.id + item.at));
  const older = memory.filter((item) => !seen.has(item.id + item.at));
  const items = [...fresh, ...older].slice(0, 8);
  return (
    <div className="rounded-md border border-line bg-panel px-3 py-3">
      <h3 className="flex items-center gap-2 text-lg text-bone">
        <ScrollText className="size-4 text-yin" aria-hidden="true" />
        Correction log
      </h3>
      <p className="mt-1 text-xs text-mist">Lever 2.01 · lệch pha được giữ, không xóa trắng.</p>
      {items.length === 0 ? <p className="mt-3 text-sm text-mist">Chưa có bài học nào.</p> : null}
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={`${item.at}-${item.id}-${index}`} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
            <p className="font-mono text-xs text-yin">
              {item.id} · lệch {item.lech} / ngưỡng {item.nguong}
            </p>
            <p className="mt-1 text-sm text-bone">
              {item.thucTai.name} {item.thucTai.literal} đối {item.moPhong.name} {item.moPhong.literal}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-mist">{item.lesson}</p>
            <p className="mt-1 font-mono text-xs text-mist">{when(item.at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeverBoard({ archive, onForget }: { archive: LeverArchive | null; onForget: () => void }) {
  const rows = [
    { id: "0", name: "Lever 0", detail: archive?.lever0 ? "Nguồn đang nằm trên thiết bị này." : "Chưa ghi nguồn." },
    {
      id: "1",
      name: "Lever 1",
      detail: archive?.lever1 ? "Đã có cây kiến trúc của lần chạy gần nhất." : "Chưa có cây.",
    },
    {
      id: "2",
      name: "Lever 2",
      detail: archive?.lever2 ? `${archive.lever2.proofs.length} vật chứng đã niêm.` : "Chưa có vật chứng.",
    },
    {
      id: "2.01",
      name: "Lever 2.01",
      detail: `${archive?.lever201.corrections.length ?? 0} correction còn giữ.`,
    },
  ];
  return (
    <div className="rounded-md border border-line bg-panel px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg text-bone">
          <Layers className="size-4 text-yang" aria-hidden="true" />
          Đòn bẩy
        </h3>
        <button
          type="button"
          onClick={onForget}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-xs text-mist"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Xóa ký ức cục bộ
        </button>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-3">
            <span className="w-24 shrink-0 font-mono text-xs text-yang">{row.name}</span>
            <span className="text-mist">{row.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TraceList({ events }: { events: TraceEvent[] }) {
  if (events.length === 0) return <p className="text-sm text-mist">Chưa có dấu vết.</p>;
  return (
    <ol className="flex flex-col gap-3">
      {events.map((event, index) => (
        <li key={`${event.title}-${index}`} className="flex gap-2">
          <span
            className={
              "mt-1 size-2 shrink-0 rounded-full " +
              (event.tone === "yang" ? "bg-yang" : event.tone === "yin" ? "bg-yin" : event.tone === "stop" ? "bg-mist" : "bg-bone")
            }
            aria-hidden="true"
          />
          <div>
            <p className="font-mono text-sm text-bone">{event.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-mist">{event.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TokenList({ result }: { result: RunResult | null }) {
  const tokens = result?.tokens ?? [];
  if (tokens.length === 0) return <p className="text-sm text-mist">Chưa tách token.</p>;
  return (
    <ul className="flex flex-col gap-1 font-mono text-xs">
      {tokens.slice(0, 240).map((token, index) => (
        <li key={`${token.line}-${token.col}-${index}`} className="flex gap-3">
          <span className="w-28 shrink-0 text-yang">{token.kind}</span>
          <span className="min-w-0 flex-1 truncate text-bone">
            {token.lexeme || "·"} <span className="text-mist">:{token.line}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
