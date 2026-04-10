import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
