"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AuthControls({
  signedIn,
  role,
}: {
  signedIn: boolean;
  role?: string;
}) {
  if (!signedIn) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {role && (
        <span className="hidden rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100 sm:inline-flex">
          {role}
        </span>
      )}
      <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign Out
      </Button>
    </div>
  );
}
