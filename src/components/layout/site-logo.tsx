import Link from "next/link";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/15 text-sm font-bold tracking-[0.2em] text-cyan-200">
        FH
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-100">
          Flood Hardest Mapas List
        </span>
        <span className="text-xs text-slate-400">
          Community-ranked FE2CM and TRIA.os maps
        </span>
      </span>
    </Link>
  );
}
