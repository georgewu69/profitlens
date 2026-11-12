import { SectionHeading } from "@/components/ui/section-heading";

const metrics = [
  { value: "SKU 级", label: "利润核算粒度" },
  { value: "9 项", label: "成本与费用维度" },
  { value: "1 分钟", label: "生成月度利润报表" },
  { value: "0 张", label: "需要手动维护的表格" },
];

const reasons = [
  {
    title: "成本口径统一",
    description: "把采购、包材、快递、佣金、退货损耗放进同一个口径，避免各算各的。",
  },
  {
    title: "亏损及时暴露",
    description: "利润低于设定阈值时自动提示，不用等月底才发现有商品在亏钱。",
  },
  {
    title: "建议可直接执行",
    description: "AI 结合利润结构给出调价与控费动作，并标注预期影响，方便快速验证。",
  },
];

export function WhySection() {
  return (
    <section id="why" className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="为什么选择我们"
              title="利润不是「销售额减去货款」这么简单"
              description="达人佣金、平台服务费、运费险、退款与退货损耗，每一项都会悄悄吃掉利润。ProfitLens 帮你把这些变量放回同一张表里。"
            />

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {metric.value}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-500">{metric.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="space-y-4">
            {reasons.map((reason, index) => (
              <li
                key={reason.title}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition-colors hover:border-emerald-200"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{reason.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
