import { submitRecordAction } from "@/actions/submissions";
import { Card } from "@/components/ui/card";
import { getRankingMaps } from "@/lib/data/site";

type SearchParams = Promise<{ status?: string; message?: string }>;

export default async function SubmitRecordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, message } = await searchParams;
  const maps = await getRankingMaps({ mode: "combined" });

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
          Authenticated submission
        </p>
        <h1 className="text-4xl font-semibold text-slate-50">Submit Record</h1>
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
        <form action={submitRecordAction} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="playerUsername">
              Player username
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="playerUsername" name="playerUsername" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="mapId">
              Map
            </label>
            <select className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="mapId" name="mapId" required>
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name} ({map.gameType})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="gameType">
              Game type
            </label>
            <select className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="gameType" name="gameType" required>
              <option value="FE2">FE2</option>
              <option value="TRIA">TRIA</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="percent">
              Percent
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" defaultValue={100} id="percent" max={100} min={1} name="percent" type="number" required />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="proofUrl">
              Video URL
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="proofUrl" name="proofUrl" placeholder="https://youtu.be/..." required />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="rawFootageUrl">
              Raw footage URL
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="rawFootageUrl" name="rawFootageUrl" placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="platform">
              Platform/device
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="platform" name="platform" placeholder="PC, mobile, etc." />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="teammates">
              Teammates
            </label>
            <input className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4" id="teammates" name="teammates" placeholder="Comma-separated if needed" />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm text-slate-300" htmlFor="notes">
              Notes
            </label>
            <textarea className="min-h-32 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3" id="notes" name="notes" />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input defaultChecked name="isCompletion" type="checkbox" />
            This is a full completion
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input name="compliance" type="checkbox" required />
            I confirm the run follows record requirements and proof rules.
          </label>
          <div className="lg:col-span-2">
            <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950" type="submit">
              Submit record
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
