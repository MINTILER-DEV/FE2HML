import Link from "next/link";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { getManagedMaps, getModeratorDashboardData } from "@/lib/data/site";

export default async function AdminDashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  const [data, managedMaps] = await Promise.all([
    getModeratorDashboardData(),
    getManagedMaps(),
  ]);

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
          Moderation control room
        </p>
        <h1 className="text-4xl font-semibold text-slate-50">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Managed maps", managedMaps.length, "/admin/maps"],
          ["Pending records", data.pendingRecords.length, "/admin/records"],
          ["Pending maps", data.pendingMaps.length, "/admin/maps"],
          ["Snapshots", data.snapshots.length, "/history"],
        ].map(([label, value, href]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-50">{value}</p>
            <Link href={String(href)} className="mt-4 inline-flex text-sm text-cyan-200">
              Open
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
