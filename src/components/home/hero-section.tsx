import { DashboardPreview } from "@/components/home/dashboard-preview";
import { CheckIcon } from "@/components/ui/icons";
import { StartAnalysisButton } from "@/components/ui/start-analysis-button";

const highlights = ["无需安装，浏览器直接用", "支持 Excel 批量导入", "数据仅用于你自己的分析"];

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pt-14 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-20 lg:pb-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            面向抖音电商卖家的利润分析工具
          </span>

          <h1 className="mt-6 text-4xl leading-[1.18] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.35rem]">
            看清每一单的
            <span className="relative whitespace-nowrap text-emerald-600">
              真实利润
              <svg
                viewBox="0 0 200 12"
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-emerald-300"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8c40-6 92-7 196-3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 text-lg font-medium text-slate-700 sm:text-xl">
            让每一笔生意的利润都清清楚楚
          </p>

          <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-500">
            ProfitLens 自动汇总商品售价、平台佣金、达人佣金、运费与退货成本，输出
            SKU 级利润报表，识别亏损商品，并给出可执行的经营建议。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <StartAnalysisButton size="lg" />
            <a
              href="#steps"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-[15px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:h-13"
            >
              查看使用流程
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
            {highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <CheckIcon className="size-4 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}
