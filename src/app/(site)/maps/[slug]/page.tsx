import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMapBySlug } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

export default async function MapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getMapBySlug(slug);

  if (!data) {
    notFound();
  }

  const { map, records, history } = data;

  return (
    <div className="page-shell space-y-8">
      <section className="section-grid">
        <Card className="p-7">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{map.gameType}</Badge>
            <Badge>{map.status}</Badge>
            <Badge>{map.isTeamMap ? "team map" : "solo map"}</Badge>
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-slate-50">{map.name}</h1>
          <p className="mt-3 text-slate-400">{map.creators.join(", ")}</p>
          <p className="mt-6 max-w-3xl text-slate-300">{map.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {map.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={map.showcaseUrl} target="_blank">
                Watch showcase
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={map.robloxUrl} target="_blank">
                Roblox listing
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["List position", map.placement ?? "Legacy"],
              ["Difficulty", map.difficultyScore.toFixed(1)],
              ["Accepted records", map.acceptedRecordsCount],
              ["Verifier", map.verifierStatus],
              ["Date added", formatDate(map.dateAdded)],
              ["Last moved", formatDate(map.dateLastMoved)],
              ["Minimum record", `${map.minimumRecordPercent}%`],
              ["Requirements", map.recordRequirementText],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section-grid">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Accepted records
          </p>
          <div className="mt-5 space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-50">{record.playerName}</p>
                    <p className="text-sm text-slate-400">
                      {record.isCompletion ? "Completion" : `${record.percent}% progress`} •{" "}
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <p className="font-medium text-cyan-200">{record.pointsAwarded} pts</p>
                </div>
                {record.teammates.length ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Teammates: {record.teammates.join(", ")}
                  </p>
                ) : null}
                <div className="mt-3">
                  <Link
                    href={record.proofUrl}
                    target="_blank"
                    className="text-sm text-cyan-200 hover:text-cyan-100"
                  >
                    View proof
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Placement history
          </p>
          <div className="mt-5 space-y-4">
            {history.map((entry) => (
              <div
                key={`${entry.label}-${entry.capturedAt}`}
                className="rounded-3xl bg-white/[0.03] px-4 py-4"
              >
                <p className="font-medium text-slate-50">{entry.label}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Placement #{entry.placement} • {formatDate(entry.capturedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
