import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

type Variant = "primary" | "inverse";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30",
  inverse:
    "bg-white text-slate-900 shadow-lg shadow-slate-950/30 hover:bg-emerald-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-6 text-[15px] sm:h-13 sm:px-7",
};

type StartAnalysisButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
  withArrow?: boolean;
  href?: string;
};

export function StartAnalysisButton({
  variant = "primary",
  size = "md",
  className = "",
  children = "立即开始分析",
  withArrow = true,
  href = "/analyze",
}: StartAnalysisButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {withArrow && <ArrowRightIcon className="size-4" />}
    </Link>
  );
}
