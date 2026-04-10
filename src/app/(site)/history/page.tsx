import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getModeratorDashboardData } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

export default async function HistoryPage() {
  const data = await getModeratorDashboardData();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <Badge>Historical snapshots</Badge>
        <h1 className="text-4xl font-semibold text-slate-50">List Snapshots</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {data.snapshots.map((snapshot) => (
          <Card key={snapshot.id} className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
              {formatDate(snapshot.capturedAt)}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-50">
              {snapshot.title}
            </h2>
            <p className="mt-3 text-sm text-slate-400">{snapshot.summary}</p>
            <div className="mt-5 space-y-3">
              {snapshot.leaders.map((leader) => (
                <div
                  key={`${snapshot.id}-${leader.mapCode}`}
                  className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                >
                  #{leader.placement} {leader.mapName} [{leader.mapCode}] ({leader.gameType})
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
