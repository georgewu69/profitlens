import { StartAnalysisButton } from "@/components/ui/start-analysis-button";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-14 text-center sm:px-12 lg:py-16">
          <div
            aria-hidden
            className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"
          />

          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              现在开始，看清你的真实利润
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              先了解你的商品里哪些在赚钱、哪些在悄悄亏钱，再决定下一步该怎么调整。
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <StartAnalysisButton variant="inverse" size="lg" />
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-slate-200 transition-colors hover:border-white/30 hover:text-white sm:h-13"
              >
                了解功能
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              内测阶段免费使用 · 暂不需要绑定支付方式
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
