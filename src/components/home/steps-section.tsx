import { SectionHeading } from "@/components/ui/section-heading";
import {
  CalculatorIcon,
  LinkIcon,
  ReportIcon,
  TrendIcon,
} from "@/components/ui/icons";
import type { ReactElement, SVGProps } from "react";

type Step = {
  title: string;
  description: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
};

const steps: Step[] = [
  {
    title: "导入订单数据",
    description: "上传抖音小店的订单导出文件，系统自动识别商品、金额与费用字段。",
    icon: LinkIcon,
  },
  {
    title: "补全商品成本",
    description: "录入采购成本、包装与物流费用，支持 Excel 批量导入，一次配置长期复用。",
    icon: CalculatorIcon,
  },
  {
    title: "生成利润报表",
    description: "按商品、订单或时间维度查看利润与亏损情况，异常商品自动标红。",
    icon: ReportIcon,
  },
  {
    title: "按建议优化经营",
    description: "参考 AI 给出的调价与控费建议进行调整，持续跟踪利润变化。",
    icon: TrendIcon,
  },
];

export function StepsSection() {
  return (
    <section id="steps" className="border-y border-slate-200/60 bg-slate-900 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="[&_h2]:text-white [&_p]:text-slate-400">
          <SectionHeading
            eyebrow="使用流程"
            title="四步，跑通第一次利润复盘"
            description="不需要调整现有的经营方式，把数据导入进来就能看到结果。"
          />
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-colors hover:border-emerald-400/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-slate-500">
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-400">{step.description}</p>
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-center text-xs text-slate-500">
          当前版本为演示页面，数据导入与分析能力将在内测版本开放。
        </p>
      </div>
    </section>
  );
}
