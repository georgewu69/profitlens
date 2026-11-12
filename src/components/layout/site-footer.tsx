import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "产品",
    links: [
      { label: "商品利润分析", href: "/#features" },
      { label: "亏损商品识别", href: "/#features" },
      { label: "AI 经营建议", href: "/#features" },
    ],
  },
  {
    title: "了解",
    links: [
      { label: "使用流程", href: "/#steps" },
      { label: "为什么选择我们", href: "/#why" },
      { label: "Excel 利润分析", href: "/analyze" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-slate-500">
            面向抖音电商卖家的商品利润分析工具，把售价、成本、佣金与退货都算清楚。
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            产品内测中
          </span>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ProfitLens. 保留所有权利。</p>
          <p>本页面为演示版本，页面中的数据均为示例数据。</p>
        </div>
      </div>
    </footer>
  );
}
