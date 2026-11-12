"use client";

import type { SheetTable } from "@/lib/excel/workbook";

type SheetPreviewProps = {
  sheets: SheetTable[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const PREVIEW_ROWS = 5;

function renderCell(value: string | number | boolean | null) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300">空</span>;
  }
  return String(value);
}

export function SheetPreview({ sheets, activeIndex, onChange }: SheetPreviewProps) {
  const sheet = sheets[activeIndex];
  if (!sheet) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">工作表</span>
        <div className="flex flex-wrap gap-2">
          {sheets.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() => onChange(index)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                index === activeIndex
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.name}
              <span className="ml-1.5 opacity-60">{item.rows.length} 行</span>
            </button>
          ))}
        </div>
      </div>

      {sheet.headers.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          当前工作表没有可读取的表头，请更换工作表。
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[560px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-12 border-b border-slate-200 px-3 py-2.5 font-medium text-slate-400">
                    #
                  </th>
                  {sheet.headers.map((header) => (
                    <th
                      key={header}
                      className="max-w-[220px] truncate border-b border-slate-200 px-3 py-2.5 font-medium text-slate-600"
                      title={header}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-slate-50/60">
                    <td className="border-b border-slate-100 px-3 py-2 text-slate-400">
                      {rowIndex + 1}
                    </td>
                    {sheet.headers.map((header, columnIndex) => (
                      <td
                        key={header}
                        className="max-w-[220px] truncate border-b border-slate-100 px-3 py-2 text-slate-700"
                        title={String(row[columnIndex] ?? "")}
                      >
                        {renderCell(row[columnIndex] ?? null)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400">
            共 {sheet.rows.length} 行数据，此处预览前 {Math.min(PREVIEW_ROWS, sheet.rows.length)} 行；
            默认将第一行作为表头。
            {sheet.rows.length === 0 && " 当前工作表没有数据行。"}
          </p>
        </>
      )}
    </div>
  );
}
