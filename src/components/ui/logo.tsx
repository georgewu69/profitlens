import Link from "next/link";

type LogoProps = {
  /** 是否隐藏副标题，用于空间较小的场景 */
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="ProfitLens 首页"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:-rotate-6">
        <svg
          viewBox="0 0 24 24"
          className="size-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="10.5" cy="10.5" r="6.4" />
          <path d="M8.2 12.2v-1.6M10.5 13.2V9.2M12.8 12.2v-1" strokeWidth={1.6} />
          <path d="m15.4 15.4 4.1 4.1" strokeWidth={2} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-semibold tracking-tight text-slate-900">
          ProfitLens
        </span>
        {!compact && (
          <span className="mt-1 text-[11px] font-medium tracking-[0.08em] text-slate-400">
            抖音电商利润分析
          </span>
        )}
      </span>
    </Link>
  );
}
