import { SparklesIcon, TrendIcon } from "@/components/ui/icons";

const stats = [
  { label: "销售额", value: "¥128,640", tone: "text-slate-900" },
  { label: "净利润", value: "¥21,370", tone: "text-emerald-600" },
  { label: "净利率", value: "16.6%", tone: "text-slate-900" },
];

const bars = [38, 52, 44, 66, 58, 74, 30, 82, 68, 88, 62, 95];

const products = [
  {
    name: "轻薄防晒衣",
    sku: "SKU-1024",
    margin: "+18.6%",
    profit: "赚 ¥4,320",
    positive: true,
  },
  {
    name: "冰丝家居服",
    sku: "SKU-2087",
    margin: "-4.2%",
    profit: "亏 ¥860",
    positive: false,
  },
];

export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-linear-to-tr from-emerald-200/50 via-teal-100/40 to-transparent blur-2xl"
        aria-hidden
      />

      <div className="relative rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">本月经营概览</p>
            <p className="mt-1 text-xs text-slate-400">2026 年 11 月 · 抖音小店</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            示例数据
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/80 p-3.5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] text-slate-500">{stat.label}</p>
              <p className={`mt-1 text-base font-semibold tracking-tight ${stat.tone}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>近 12 天利润走势</span>
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <TrendIcon className="size-3.5" />
              +12.4%
            </span>
          </div>
          <div className="mt-3 flex h-24 items-end gap-1.5">
            {bars.map((height, index) => (
              <div
                key={index}
                style={{ height: `${height}%` }}
                className={
                  index === 6
                    ? "flex-1 rounded-t-md bg-amber-400/80"
                    : "flex-1 rounded-t-md bg-emerald-500/80"
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {products.map((product) => (
            <div
              key={product.sku}
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-3.5 py-2.5"
            >
              <div>
                <p className="text-xs font-medium text-slate-800">{product.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{product.sku}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-semibold ${
                    product.positive ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {product.margin}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{product.profit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-float absolute -bottom-7 -left-3 hidden w-56 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur sm:block">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <SparklesIcon className="size-3.5" />
          </span>
          <p className="text-[11px] font-semibold text-slate-900">AI 经营建议</p>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          3 个 SKU 处于亏损状态，建议优先调整「冰丝家居服」的达人佣金比例。
        </p>
      </div>
    </div>
  );
}
