import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPlayerBySlug } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPlayerBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8">
      <section className="section-grid">
        <Card className="p-7">
          <Badge>Player profile</Badge>
          <h1 className="mt-5 text-4xl font-semibold text-slate-50">
            {data.player.username}
          </h1>
          <p className="mt-3 text-slate-400">
            Rank #{data.player.rank} • {data.player.region ?? "Region unset"}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Total points", data.player.totalPoints.toFixed(2)],
              ["Hardest map", data.player.hardestMapName],
              ["Accepted records", data.player.totalAcceptedRecords],
              ["Joined", formatDate(data.player.joinedAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Split overview
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">FE2 records</p>
              <p className="mt-2 text-3xl font-semibold text-slate-50">
                {data.player.fe2RecordCount}
              </p>
            </div>
            <div className="rounded-3xl bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">TRIA records</p>
              <p className="mt-2 text-3xl font-semibold text-slate-50">
                {data.player.triaRecordCount}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
          Recent accepted records
        </p>
        <div className="mt-5 space-y-4">
          {data.records.map((record) => (
            <div
              key={record.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/[0.03] p-4"
            >
              <div>
                <p className="font-medium text-slate-50">{record.mapName}</p>
                <p className="text-sm text-slate-400">
                  {record.isCompletion ? "Completion" : `${record.percent}% progress`} •{" "}
                  {formatDate(record.createdAt)}
                </p>
              </div>
              <p className="font-medium text-cyan-200">{record.pointsAwarded} pts</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
