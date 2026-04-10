import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomeData } from "@/lib/data/site";
import { compactNumber, formatDate, movementLabel } from "@/lib/utils";

export default async function HomePage() {
  const data = await getHomeData();
  const featuredMaps = [data.featuredMaps.fe2, data.featuredMaps.tria].filter(Boolean);

  return (
    <div className="page-shell space-y-10">
      <section className="overflow-hidden rounded-[36px] border border-cyan-400/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,47,73,0.85)),radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_35%)] p-8 md:p-12">
        <div className="max-w-3xl space-y-6">
          <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
            Competitive Roblox map rankings
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
              Launch a serious FE2CM and TRIA.os list with stable map IDs,
              staff-managed moderation, and production-ready workflows.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              The roster starts empty by design. Staff can add the first maps,
              publish placements, and grow the leaderboard without shipping fake
              starter data.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/rankings">View Rankings</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/submit-record">Submit Record</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/maps">Manage Maps</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["Total Ranked Maps", data.stats.totalRankedMaps],
          ["FE2 Maps", data.stats.fe2Maps],
          ["TRIA Maps", data.stats.triaMaps],
          ["Verified Records", data.stats.totalVerifiedRecords],
          ["Registered Players", data.stats.registeredPlayers],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {compactNumber(Number(value))}
            </p>
          </Card>
        ))}
      </section>

      <section className="section-grid">
        {featuredMaps.length ? (
          featuredMaps.map((map) => (
            <Card key={map.mapCode} className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <Badge>{map.gameType} #1</Badge>
                <span className="text-sm text-slate-400">
                  {map.mapCode} • {map.difficultyScore.toFixed(2)} {map.difficultyLabel}
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-slate-50">{map.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{map.creators.join(", ")}</p>
              <p className="mt-5 max-w-xl text-slate-300">{map.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {map.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <div className="mt-6">
                <Button asChild variant="ghost">
                  <Link href={`/maps/${map.mapCode}`}>Open map profile</Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 lg:col-span-2">
            <Badge>Launch state</Badge>
            <h2 className="mt-5 text-3xl font-semibold text-slate-50">
              The rankings open with an empty roster
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Moderators and admins can add the first FE2CM and TRIA.os maps
              from the admin dashboard. Featured placements and recent list
              movement will appear automatically once the roster is populated.
            </p>
            <div className="mt-6">
              <Button asChild variant="ghost">
                <Link href="/admin/maps">Open map management</Link>
              </Button>
            </div>
          </Card>
        )}
      </section>

      <section className="section-grid">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Latest accepted records
          </p>
          <div className="mt-5 space-y-4">
            {data.latestRecords.length ? (
              data.latestRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-slate-50">
                      {record.playerName} on {record.mapName}
                    </p>
                    <p className="text-sm text-slate-400">
                      {record.isCompletion ? "Completion" : `${record.percent}% progress`} •{" "}
                      {record.gameType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-cyan-200">{record.pointsAwarded} pts</p>
                    <p className="text-xs text-slate-500">{formatDate(record.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-slate-400">
                No accepted records yet.
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
              Recent list changes
            </p>
            <div className="mt-5 space-y-4">
              {data.latestChanges.length ? (
                data.latestChanges.map((change) => (
                  <div
                    key={`${change.mapCode}-${change.updatedAt}`}
                    className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4"
                  >
                    <p className="font-medium text-slate-50">{change.mapName}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {change.mapCode} • {movementLabel(change.movement)} •{" "}
                      {formatDate(change.updatedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-slate-400">
                  No map movement yet.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
              Announcements
            </p>
            <div className="mt-5 space-y-4">
              {data.announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-3xl bg-white/[0.03] p-4">
                  <p className="font-medium text-slate-50">{announcement.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{announcement.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
