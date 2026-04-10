import Link from "next/link";

import { RankingTable } from "@/components/rankings/ranking-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRankingMaps } from "@/lib/data/site";

type SearchParams = Promise<{
  mode?: string;
  q?: string;
  sort?: string;
}>;

const modes = [
  { key: "combined", label: "Combined List" },
  { key: "fe2", label: "FE2 List" },
  { key: "tria", label: "TRIA List" },
];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { mode = "combined", q = "", sort = "placement" } = await searchParams;
  const maps = await getRankingMaps({
    mode: mode as "combined" | "fe2" | "tria",
    search: q,
    sort: sort as "placement" | "difficulty" | "records" | "newest",
  });

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <Badge>Main rankings</Badge>
        <h1 className="text-4xl font-semibold text-slate-50">Main Rankings</h1>
        <p className="max-w-2xl text-slate-400">
          Switch between combined, FE2, and TRIA views, then sort by placement,
          difficulty, newest additions, or record volume.
        </p>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {modes.map((entry) => (
              <Link
                key={entry.key}
                href={`/rankings?mode=${entry.key}&sort=${sort}&q=${encodeURIComponent(q)}`}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  mode === entry.key
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {entry.label}
              </Link>
            ))}
          </div>
          <form className="flex flex-col gap-3 md:flex-row">
            <Input
              className="md:w-72"
              defaultValue={q}
              name="q"
              placeholder="Search by map, creator, or tag"
            />
            <input name="mode" type="hidden" value={mode} />
            <select
              className="h-11 rounded-2xl border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100"
              defaultValue={sort}
              name="sort"
            >
              <option value="placement">Sort by placement</option>
              <option value="difficulty">Sort by difficulty</option>
              <option value="records">Sort by records</option>
              <option value="newest">Sort by newest</option>
            </select>
            <button
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
              type="submit"
            >
              Apply
            </button>
          </form>
        </div>
      </Card>

      <RankingTable maps={maps} showPlacement={mode !== "combined"} />
    </div>
  );
}
