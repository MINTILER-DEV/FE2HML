import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: Date | string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function movementLabel(value: number) {
  if (value > 0) {
    return `Up ${value}`;
  }

  if (value < 0) {
    return `Down ${Math.abs(value)}`;
  }

  return "Steady";
}

export function parseCsv(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildProofDomainSet() {
  return new Set(
    parseCsv(process.env.ALLOWED_PROOF_DOMAINS).map((domain) =>
      domain.replace(/^www\./, "").toLowerCase(),
    ),
  );
}
