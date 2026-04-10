import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPlayers } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <Badge>Score ladder</Badge>
        <h1 className="text-4xl font-semibold text-slate-50">Player Rankings</h1>
        <p className="max-w-2xl text-slate-400">
          Players earn points from accepted records using an original placement and
          completion-weighted scoring formula.
        </p>
      </div>

      <Card className="overflow-hidden">
        {players.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Player</th>
                  <th className="px-5 py-4">Points</th>
                  <th className="px-5 py-4">Hardest</th>
                  <th className="px-5 py-4">Records</th>
                  <th className="px-5 py-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-t border-white/6">
                    <td className="px-5 py-5 text-lg font-semibold text-slate-50">
                      {player.rank}
                    </td>
                    <td className="px-5 py-5">
                      <Link href={`/players/${player.slug}`} className="font-medium text-slate-50">
                        {player.username}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">{player.region ?? "Unknown"}</p>
                    </td>
                    <td className="px-5 py-5 font-medium text-cyan-200">
                      {player.totalPoints.toFixed(2)}
                    </td>
                    <td className="px-5 py-5">{player.hardestMapName}</td>
                    <td className="px-5 py-5">
                      {player.totalAcceptedRecords} ({player.fe2RecordCount} FE2 /{" "}
                      {player.triaRecordCount} TRIA)
                    </td>
                    <td className="px-5 py-5 text-slate-400">{formatDate(player.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400">
            No players have accepted records yet.
          </div>
        )}
      </Card>
    </div>
  );
}
