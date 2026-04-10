import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MapView } from "@/types/site";
import { formatDate, movementLabel } from "@/lib/utils";

function MovementIcon({ value }: { value: number }) {
  if (value > 0) {
    return <ArrowUpRight className="h-4 w-4 text-emerald-300" />;
  }

  if (value < 0) {
    return <ArrowDownRight className="h-4 w-4 text-amber-300" />;
  }

  return <Minus className="h-4 w-4 text-slate-500" />;
}

export function RankingTable({
  maps,
  showPlacement = true,
}: {
  maps: MapView[];
  showPlacement?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Map</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Difficulty</th>
              <th className="px-5 py-4">Records</th>
              <th className="px-5 py-4">Updated</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((map, index) => (
              <tr key={map.id} className="border-t border-white/6 align-top">
                <td className="px-5 py-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-slate-50">
                      {showPlacement ? map.placement ?? index + 1 : index + 1}
                    </span>
                    <MovementIcon value={map.listMovement} />
                  </div>
                </td>
                <td className="px-5 py-5">
                  <Link
                    href={`/maps/${map.slug}`}
                    className="block rounded-2xl transition hover:bg-white/[0.03]"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-14 w-20 items-center justify-center rounded-2xl border border-cyan-400/15 bg-[radial-gradient(circle_at_top,#155e75,transparent_60%),linear-gradient(135deg,#0f172a,#1e293b)] text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                        {map.gameType}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-50">{map.name}</p>
                        <p className="text-xs text-slate-400">
                          {map.creators.join(", ")}
                        </p>
                      </div>
                    </div>
                    <p className="max-w-xl text-sm text-slate-400">
                      {map.shortDescription}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {map.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-5">
                  <Badge className="text-cyan-100">{map.gameType}</Badge>
                </td>
                <td className="px-5 py-5 font-medium text-slate-50">
                  {map.difficultyScore.toFixed(1)}
                </td>
                <td className="px-5 py-5">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-50">{map.acceptedRecordsCount}</p>
                    <p className="text-xs text-slate-500">{map.verifierStatus}</p>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <div className="space-y-1">
                    <p className="text-slate-50">{formatDate(map.dateLastMoved)}</p>
                    <p className="text-xs text-slate-500">
                      {movementLabel(map.listMovement)}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
