import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Record requirements",
    items: [
      "Proof links are mandatory for every submission.",
      "Top-level completions should include full HUD and visible username.",
      "Improvement submissions should clearly beat an existing accepted result.",
    ],
  },
  {
    title: "Video proof standards",
    items: [
      "No splices, cuts, or obscured overlays that hide gameplay state.",
      "Raw footage is preferred for high placements and team clears.",
      "Audio is optional, but the run timeline must remain traceable.",
    ],
  },
  {
    title: "Fair play policy",
    items: [
      "Tool assistance, slowdown, and macro abuse invalidate records.",
      "Moderators may request raw footage for suspicious clears.",
      "Repeated falsified submissions can result in account restrictions.",
    ],
  },
  {
    title: "Placement philosophy",
    items: [
      "List placement prioritizes consistency, routing strain, and recovery demand.",
      "Team maps are ranked by execution burden, not by lobby coordination alone.",
      "Moderators retain discretion when evidence is incomplete or contested.",
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <Badge>Guidelines</Badge>
        <h1 className="text-4xl font-semibold text-slate-50">
          Rules and Submission Guidelines
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="text-2xl font-semibold text-slate-50">{section.title}</h2>
            <div className="mt-5 space-y-3 text-slate-300">
              {section.items.map((item) => (
                <p key={item} className="rounded-3xl bg-white/[0.03] px-4 py-4">
                  {item}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
