import type { Metadata } from "next";
import Link from "next/link";
import { ExcelAnalyzer } from "@/components/analyze/excel-analyzer";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Excel 利润分析",
  description:
    "上传 Excel 订单表，在浏览器本地计算销售额、退款、各项成本、净利润与利润率，并识别亏损商品。",
};

const highlights = ["支持 .xlsx / .xls", "浏览器本地解析，不上传", "字段可自行映射", "无需登录"];

export default function AnalyzePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/60">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl"
        />

        <div className="mx-auto w-full max-w-5xl px-6 pt-8 pb-9">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <span aria-hidden>←</span> 返回首页
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Excel 利润分析
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            上传抖音小店的订单导出表，ProfitLens 会在浏览器本地解析并计算利润，
            订单数据不会离开你的电脑。
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <CheckIcon className="size-3.5 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-6 py-8 pb-20">
        <ExcelAnalyzer />
      </div>
    </>
  );
}
