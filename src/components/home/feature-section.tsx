import { SectionHeading } from "@/components/ui/section-heading";
import { AlertIcon, ChartIcon, CheckIcon, SparklesIcon } from "@/components/ui/icons";
import type { ReactElement, SVGProps } from "react";

type Feature = {
  title: string;
  description: string;
  points: string[];
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  iconClassName: string;
};

const features: Feature[] = [
  {
    title: "商品利润分析",
    description:
      "按 SKU 拆解售价、采购成本、平台佣金与运费，实时算清每一件商品的真实毛利与净利。",
    points: ["全链路成本自动分摊", "SKU 级利润明细", "一键导出利润报表"],
    icon: ChartIcon,
    iconClassName: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
  },
  {
    title: "亏损商品识别",
    description:
      "自动标记负毛利与低毛利商品，快速定位是定价、达人佣金还是退货率拖累了整体利润。",
    points: ["亏损商品排行榜", "利润异常预警", "退款退货归因分析"],
    icon: AlertIcon,
    iconClassName: "from-amber-500 to-orange-600 shadow-amber-500/25",
  },
  {
    title: "AI 经营建议",
    description:
      "基于利润结构生成可执行的调价、控费与选品建议，并预估调整后的利润变化。",
    points: ["调价区间建议", "费用结构优化", "每周经营复盘"],
    icon: SparklesIcon,
    iconClassName: "from-indigo-500 to-violet-600 shadow-indigo-500/25",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="border-t border-slate-200/60 bg-slate-50/60 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="核心功能"
          title="从「感觉在赚钱」到「算得清每一分钱」"
          description="不用再对着多张表格手动核对，ProfitLens 把订单、成本与费用拼成一张完整的利润地图。"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <span
                  className={`grid size-11 place-items-center rounded-2xl bg-linear-to-br text-white shadow-lg ${feature.iconClassName}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-slate-500">{feature.description}</p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-[13px] text-slate-600">
                      <CheckIcon className="size-3.5 shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
