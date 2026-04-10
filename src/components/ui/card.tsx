import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-slate-950/75 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_18px_40px_rgba(2,6,23,0.55)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
