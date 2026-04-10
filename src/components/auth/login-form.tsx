"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl,
      });

      if (!response || response.error) {
        setError("Incorrect email or password.");
        return;
      }

      router.push(response.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-300" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error ? (
        <p className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
