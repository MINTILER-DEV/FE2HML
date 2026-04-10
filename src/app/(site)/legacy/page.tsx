import Link from "next/link";

import { RankingTable } from "@/components/rankings/ranking-table";
import { Badge } from "@/components/ui/badge";
import { getRankingMaps } from "@/lib/data/site";

type SearchParams = Promise<{
  mode?: string;
}>;

export default async function LegacyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { mode = "combined" } = await searchParams;
  const maps = await getRankingMaps({
    mode: mode as "combined" | "fe2" | "tria",
    status: "LEGACY",
  });

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <Badge>Legacy archive</Badge>
        <h1 className="text-4xl font-semibold text-slate-50">Legacy List</h1>
        <p className="max-w-2xl text-slate-400">
          Fallen-off maps remain searchable with their metadata, tags, and historical
          context intact.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {[
          ["combined", "Combined"],
          ["fe2", "FE2"],
          ["tria", "TRIA"],
        ].map(([key, label]) => (
          <Link
            key={key}
            href={`/legacy?mode=${key}`}
            className={`rounded-full px-4 py-2 text-sm ${
              mode === key
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <RankingTable maps={maps} showPlacement={false} />
    </div>
  );
}
