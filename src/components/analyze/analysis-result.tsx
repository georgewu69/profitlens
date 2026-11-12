import type { AnalysisResult } from "@/lib/profit/analyze";
import type { FieldKey } from "@/lib/excel/fields";
import { formatCurrency, formatPercent } from "@/lib/format";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";

type AnalysisResultViewProps = {
  result: AnalysisResult;
  sheetName: string;
};

const costItems: { key: FieldKey; label: string; read: (result: AnalysisResult) => number }[] = [
  { key: "productCost", label: "商品成本", read: (result) => result.productCost },
  { key: "platformFee", label: "平台费用", read: (result) => result.platformFee },
  { key: "adSpend", label: "广告费用", read: (result) => result.adSpend },
  { key: "shippingFee", label: "物流费用", read: (result) => result.shippingFee },
];

export function AnalysisResultView({ result, sheetName }: AnalysisResultViewProps) {
  const unmappedKeys = new Set(result.unmappedFields.map((field) => field.key));
  const refundIncluded = !unmappedKeys.has("refundAmount");

  const summary = [
    {
      label: "销售额",
      value: formatCurrency(result.sales),
      tone: "text-slate-900",
      hint: `${result.validRows} 行有效数据`,
    },
    {
      label: "退款金额",
      value: refundIncluded ? formatCurrency(result.refunds) : "未纳入",
      tone: refundIncluded ? "text-slate-900" : "text-slate-400",
      hint: refundIncluded ? "已从销售额扣除" : "未映射退款字段，利润可能偏高",
    },
    {
      label: "总成本",
      value: formatCurrency(result.totalCost),
      tone: "text-slate-900",
      hint: unmappedKeys.size > 0 ? "部分费用未纳入" : "费用字段已全部纳入",
    },
    {
      label: "净利润",
      value: formatCurrency(result.netProfit),
      tone: result.netProfit >= 0 ? "text-emerald-600" : "text-rose-600",
      hint: "销售额 − 退款 − 成本",
    },
    {
      label: "利润率",
      value: formatPercent(result.margin),
      tone:
        result.margin === null
          ? "text-slate-900"
          : result.margin >= 0
            ? "text-emerald-600"
            : "text-rose-600",
      hint: "净利润 ÷ 销售额",
    },
  ];

  const losses = result.lossProducts;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
          工作表：{sheetName}
        </span>
        <span>
          共 {result.totalRows} 行，有效 {result.validRows} 行
          {result.skippedRows > 0 && `，跳过 ${result.skippedRows} 行（订单金额无法识别）`}
          {result.unnamedRows > 0 && `，${result.unnamedRows} 行商品名称为空`}
        </span>
      </div>

      {unmappedKeys.size > 0 && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5" role="alert">
          <AlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="text-sm leading-6 text-amber-900">
            <p className="font-medium">以下字段未纳入本次计算</p>
            <p className="mt-1 text-amber-800">
              {result.unmappedFields.map((field) => field.label).join("、")}
              。这些费用未被当作 0 元真实值，而是未参与计算，因此成本可能被低估、利润可能被高估。
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className={`mt-1.5 text-lg font-semibold tracking-tight ${item.tone}`}>
              {item.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
        <p className="text-xs font-medium text-slate-500">成本构成</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {costItems.map((item) => {
            const included = !unmappedKeys.has(item.key);
            return (
              <div key={item.key} className="rounded-xl bg-slate-50/80 px-3 py-2.5">
                <dt className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  {item.label}
                  {!included && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      未纳入
                    </span>
                  )}
                </dt>
                <dd className={`mt-1 text-sm font-semibold ${included ? "text-slate-900" : "text-slate-400"}`}>
                  {included ? formatCurrency(item.read(result)) : "—"}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {losses.length > 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 sm:p-5" role="alert">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
              <AlertIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-rose-900">
                发现 {losses.length} 个亏损商品
              </h3>
              <p className="mt-1 text-xs leading-5 text-rose-700">
                这些商品的净利润为负，建议优先检查定价、平台佣金、广告投放与退款情况。
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {losses.slice(0, 10).map((product) => (
                  <li
                    key={product.name}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs text-slate-700"
                  >
                    <span className="max-w-[12rem] truncate">{product.name}</span>
                    <span className="font-semibold text-rose-600">
                      {formatCurrency(product.netProfit)}
                    </span>
                  </li>
                ))}
                {losses.length > 10 && (
                  <li className="px-1 text-xs text-rose-700">还有 {losses.length - 10} 个…</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckIcon className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900">暂未发现亏损商品</h3>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              在当前已映射的字段口径下，所有商品净利润均为正。
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">商品利润排行</h3>
          <span className="text-xs text-slate-400">按净利润从高到低</span>
        </div>
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="text-xs text-slate-500">
                <th className="px-4 py-2.5 font-medium">排名</th>
                <th className="px-4 py-2.5 font-medium">商品</th>
                <th className="px-4 py-2.5 text-right font-medium">订单数</th>
                <th className="px-4 py-2.5 text-right font-medium">销售额</th>
                <th className="px-4 py-2.5 text-right font-medium">退款</th>
                <th className="px-4 py-2.5 text-right font-medium">成本合计</th>
                <th className="px-4 py-2.5 text-right font-medium">净利润</th>
                <th className="px-4 py-2.5 text-right font-medium">利润率</th>
              </tr>
            </thead>
            <tbody>
              {result.products.map((product, index) => (
                <tr
                  key={product.name}
                  className={`border-t border-slate-100 ${
                    product.netProfit < 0 ? "bg-rose-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-xs text-slate-400">{index + 1}</td>
                  <td className="max-w-[16rem] truncate px-4 py-2.5 font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{product.rows}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">
                    {formatCurrency(product.sales)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right ${
                      refundIncluded ? "text-slate-600" : "text-slate-400"
                    }`}
                    title={refundIncluded ? undefined : "退款金额字段未纳入本次计算"}
                  >
                    {refundIncluded ? formatCurrency(product.refunds) : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-600">
                    {formatCurrency(product.totalCost)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-semibold ${
                      product.netProfit < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(product.netProfit)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right ${
                      product.margin === null
                        ? "text-slate-400"
                        : product.margin < 0
                          ? "text-rose-600"
                          : "text-slate-700"
                    }`}
                  >
                    {formatPercent(product.margin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-400">
        计算口径：净利润 = 销售额 − 退款金额 −（商品成本 + 平台费用 + 广告费用 + 物流费用）。
        未映射的字段不参与计算，也不会按 0 元计入。
      </p>
    </div>
  );
}
