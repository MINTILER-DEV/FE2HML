import Link from "next/link";

import { AuthControls } from "@/components/layout/auth-controls";
import { SiteLogo } from "@/components/layout/site-logo";
import { getAuthSession } from "@/lib/auth";

const links = [
  { href: "/rankings", label: "Rankings" },
  { href: "/legacy", label: "Legacy" },
  { href: "/players", label: "Players" },
  { href: "/history", label: "Snapshots" },
  { href: "/rules", label: "Rules" },
  { href: "/admin", label: "Admin" },
];

export async function SiteHeader() {
  const session = await getAuthSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4">
        <SiteLogo />
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/submit-record"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              Submit Record
            </Link>
            <Link
              href="/submit-map"
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Submit Map
            </Link>
          </div>
          <AuthControls
            signedIn={Boolean(session?.user)}
            role={session?.user?.role}
          />
        </div>
      </div>
    </header>
  );
}
