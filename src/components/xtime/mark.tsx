export function Taiji({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" className="fill-bone" />
      <path
        d="M32 2a30 30 0 0 1 0 60 15 15 0 0 1 0-30 15 15 0 0 0 0-30"
        className="fill-ink"
      />
      <circle cx="32" cy="17" r="4" className="fill-ink" />
      <circle cx="32" cy="47" r="4" className="fill-bone" />
    </svg>
  );
}
