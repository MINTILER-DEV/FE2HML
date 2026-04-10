import { submitMapAction } from "@/actions/submissions";
import { Card } from "@/components/ui/card";

type SearchParams = Promise<{ status?: string; message?: string }>;

export default async function SubmitMapPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, message } = await searchParams;

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
          Authenticated submission
        </p>
        <h1 className="text-4xl font-semibold text-slate-50">Submit Map</h1>
      </div>
      <Card className="p-7">
        {message ? (
          <p
            className={`mb-6 rounded-3xl px-4 py-4 text-sm ${
              status === "error"
                ? "border border-rose-500/30 bg-rose-500/10 text-rose-200"
                : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
            }`}
          >
            {message}
          </p>
        ) : null}
        <form action={submitMapAction} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="name">
              Map name
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="gameType">
              Game type
            </label>
            <select className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="gameType" name="gameType">
              <option value="FE2">FE2</option>
              <option value="TRIA">TRIA</option>
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="creatorText">
              Creator(s)
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="creatorText" name="creatorText" placeholder="Comma-separated" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="robloxUrl">
              Roblox URL
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="robloxUrl" name="robloxUrl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="showcaseUrl">
              Showcase video
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="showcaseUrl" name="showcaseUrl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="thumbnailUrl">
              Thumbnail URL
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="thumbnailUrl" name="thumbnailUrl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="estimatedDifficulty">
              Estimated difficulty
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" defaultValue={75} id="estimatedDifficulty" name="estimatedDifficulty" step="0.1" type="number" />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="skillsetText">
              Skillset tags
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="skillsetText" name="skillsetText" placeholder="precision, endurance, timing" />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="description">
              Description
            </label>
            <textarea className="min-h-32 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3" id="description" name="description" required />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="notes">
              Notes for reviewers
            </label>
            <textarea className="min-h-24 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3" id="notes" name="notes" />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input name="isTeamMap" type="checkbox" />
            This is a team map
          </label>
          <div className="lg:col-span-2">
            <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950" type="submit">
              Submit map
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
