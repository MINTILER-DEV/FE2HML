import { redirect } from "next/navigation";

import {
  removeManagedMapAction,
  reviewMapSubmissionAction,
  saveManagedMapAction,
} from "@/actions/submissions";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { getManagedMaps, getModeratorDashboardData } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{ message?: string }>;

function MapForm({
  map,
}: {
  map?: Awaited<ReturnType<typeof getManagedMaps>>[number];
}) {
  return (
    <form action={saveManagedMapAction} className="grid gap-4 lg:grid-cols-2">
      <input name="id" type="hidden" value={map?.id ?? ""} />
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`mapCode-${map?.id ?? "new"}`}>
          Map ID
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 uppercase"
          defaultValue={map?.mapCode ?? ""}
          id={`mapCode-${map?.id ?? "new"}`}
          name="mapCode"
          placeholder="FE2-0001"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`name-${map?.id ?? "new"}`}>
          Map name
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.name ?? ""}
          id={`name-${map?.id ?? "new"}`}
          name="name"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`gameType-${map?.id ?? "new"}`}>
          Game type
        </label>
        <select
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.gameType ?? "FE2"}
          id={`gameType-${map?.id ?? "new"}`}
          name="gameType"
        >
          <option value="FE2">FE2</option>
          <option value="TRIA">TRIA</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`status-${map?.id ?? "new"}`}>
          Status
        </label>
        <select
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.status ?? "PENDING"}
          id={`status-${map?.id ?? "new"}`}
          name="status"
        >
          <option value="MAIN">MAIN</option>
          <option value="LEGACY">LEGACY</option>
          <option value="PENDING">PENDING</option>
          <option value="REMOVED">REMOVED</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`placement-${map?.id ?? "new"}`}>
          Placement
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.placement ?? ""}
          id={`placement-${map?.id ?? "new"}`}
          name="placement"
          placeholder="Optional unless MAIN"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`difficulty-${map?.id ?? "new"}`}>
          Difficulty
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.difficultyScore ?? 6}
          id={`difficulty-${map?.id ?? "new"}`}
          max={9.99}
          min={6}
          name="difficultyScore"
          step="0.01"
          type="number"
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <label className="text-sm text-slate-300" htmlFor={`creatorText-${map?.id ?? "new"}`}>
          Creator(s)
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.creators.join(", ") ?? ""}
          id={`creatorText-${map?.id ?? "new"}`}
          name="creatorText"
          placeholder="Comma-separated"
          required
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <label className="text-sm text-slate-300" htmlFor={`shortDescription-${map?.id ?? "new"}`}>
          Short description
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.shortDescription ?? ""}
          id={`shortDescription-${map?.id ?? "new"}`}
          name="shortDescription"
          required
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <label className="text-sm text-slate-300" htmlFor={`description-${map?.id ?? "new"}`}>
          Description
        </label>
        <textarea
          className="min-h-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3"
          defaultValue={map?.description ?? ""}
          id={`description-${map?.id ?? "new"}`}
          name="description"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`thumbnailUrl-${map?.id ?? "new"}`}>
          Thumbnail URL
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.thumbnailUrl ?? ""}
          id={`thumbnailUrl-${map?.id ?? "new"}`}
          name="thumbnailUrl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`showcaseUrl-${map?.id ?? "new"}`}>
          Showcase URL
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.showcaseUrl ?? ""}
          id={`showcaseUrl-${map?.id ?? "new"}`}
          name="showcaseUrl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`robloxUrl-${map?.id ?? "new"}`}>
          Roblox URL
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.robloxUrl ?? ""}
          id={`robloxUrl-${map?.id ?? "new"}`}
          name="robloxUrl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`verifierStatus-${map?.id ?? "new"}`}>
          Verifier status
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.verifierStatus ?? ""}
          id={`verifierStatus-${map?.id ?? "new"}`}
          name="verifierStatus"
          placeholder="Open Verification"
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <label className="text-sm text-slate-300" htmlFor={`tagsText-${map?.id ?? "new"}`}>
          Tags
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.tags.join(", ") ?? ""}
          id={`tagsText-${map?.id ?? "new"}`}
          name="tagsText"
          placeholder="solo, precision, endurance"
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <label className="text-sm text-slate-300" htmlFor={`recordRequirementText-${map?.id ?? "new"}`}>
          Record requirements
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.recordRequirementText ?? "Raw footage preferred, visible username required."}
          id={`recordRequirementText-${map?.id ?? "new"}`}
          name="recordRequirementText"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor={`minimumRecordPercent-${map?.id ?? "new"}`}>
          Minimum record percent
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4"
          defaultValue={map?.minimumRecordPercent ?? 60}
          id={`minimumRecordPercent-${map?.id ?? "new"}`}
          max={100}
          min={1}
          name="minimumRecordPercent"
          type="number"
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-300 lg:col-span-2">
        <input defaultChecked={map?.isTeamMap} name="isTeamMap" type="checkbox" />
        This is a team map
      </label>
      <div className="lg:col-span-2">
        <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950" type="submit">
          {map ? "Save map" : "Add map"}
        </button>
      </div>
    </form>
  );
}

export default async function AdminMapsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/maps");
  }

  if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  const { message } = await searchParams;
  const [dashboard, managedMaps] = await Promise.all([
    getModeratorDashboardData(),
    getManagedMaps(),
  ]);

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-slate-50">Map Management</h1>
        <p className="max-w-2xl text-slate-400">
          Add maps directly, edit placements and difficulty, move entries between
          active and removed states, and review community submissions.
        </p>
      </div>
      {message ? (
        <p className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100">
          {message}
        </p>
      ) : null}

      <Card className="p-6">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-cyan-300">
          Add new map
        </p>
        <MapForm />
      </Card>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Managed roster
          </p>
          <p className="text-sm text-slate-400">{managedMaps.length} total maps</p>
        </div>
        <div className="space-y-4">
          {managedMaps.length ? (
            managedMaps.map((map) => (
              <details key={map.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-50">
                        {map.mapCode} • {map.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {map.gameType} • {map.status} • {map.difficultyScore.toFixed(2)}{" "}
                        {map.difficultyLabel}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {map.placement ? `#${map.placement}` : "Unplaced"}
                    </p>
                  </div>
                </summary>
                <div className="mt-5 space-y-4">
                  <MapForm map={map} />
                  <form action={removeManagedMapAction}>
                    <input name="id" type="hidden" value={map.id} />
                    <button className="rounded-full border border-rose-400/30 bg-rose-400/15 px-5 py-3 text-sm font-semibold text-rose-100" type="submit">
                      Remove map
                    </button>
                  </form>
                </div>
              </details>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
              No maps have been created yet.
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-50">Pending map submissions</h2>
        {dashboard.pendingMaps.length ? (
          dashboard.pendingMaps.map((submission) => (
            <Card key={submission.id} className="p-6">
              <p className="text-xl font-semibold text-slate-50">{submission.name}</p>
              <p className="mt-2 text-sm text-slate-400">
                {(submission.proposedMapCode ?? "ID pending")} • {submission.gameType} •{" "}
                {submission.creatorText} • {formatDate(submission.createdAt)}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Estimated difficulty {submission.estimatedDifficulty.toFixed(2)}
              </p>
              <form
                action={reviewMapSubmissionAction}
                className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto]"
              >
                <input name="submissionId" type="hidden" value={submission.id} />
                <textarea
                  className="min-h-24 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3"
                  name="moderatorMessage"
                  placeholder="Moderator notes"
                />
                <button
                  className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-5 py-3 text-sm font-semibold text-emerald-100"
                  name="decision"
                  type="submit"
                  value="ACCEPT"
                >
                  Accept
                </button>
                <button
                  className="rounded-full border border-rose-400/30 bg-rose-400/15 px-5 py-3 text-sm font-semibold text-rose-100"
                  name="decision"
                  type="submit"
                  value="REJECT"
                >
                  Reject
                </button>
              </form>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-slate-400">
            No pending map submissions.
          </Card>
        )}
      </div>
    </div>
  );
}
