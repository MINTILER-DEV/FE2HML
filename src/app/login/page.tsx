import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
            Staff and player access
          </p>
          <h1 className="text-4xl font-semibold text-slate-50">Sign in</h1>
          <p className="text-sm text-slate-400">
            Demo accounts all use `demo-pass-123`: `admin@fhml.local`,
            `moderator@fhml.local`, or `user@fhml.local`.
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </Card>
    </div>
  );
}
