import { redirect } from "next/navigation";

import { reviewRecordSubmissionAction } from "@/actions/submissions";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { getModeratorDashboardData } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{ message?: string }>;

export default async function AdminRecordsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/records");
  }

  if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  const { message } = await searchParams;
  const data = await getModeratorDashboardData();

  return (
    <div className="page-shell space-y-8">
      <h1 className="text-4xl font-semibold text-slate-50">Pending Record Review</h1>
      {message ? (
        <p className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100">
          {message}
        </p>
      ) : null}
      <div className="space-y-5">
        {data.pendingRecords.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-slate-50">
                  {submission.playerUsername} on {submission.mapName}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {submission.isCompletion ? "Completion" : `${submission.percent}% progress`} •{" "}
                  {submission.gameType} • {formatDate(submission.createdAt)}
                </p>
                {submission.notes ? (
                  <p className="mt-3 text-sm text-slate-300">{submission.notes}</p>
                ) : null}
              </div>
              <a
                href={submission.proofUrl}
                target="_blank"
                className="text-sm text-cyan-200"
              >
                View proof
              </a>
            </div>
            <form
              action={reviewRecordSubmissionAction}
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
        ))}
      </div>
    </div>
  );
}
