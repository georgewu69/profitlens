"use client";

import { FIELD_DEFINITIONS, type FieldKey, type FieldMapping } from "@/lib/excel/fields";

type FieldMappingPanelProps = {
  headers: string[];
  mapping: FieldMapping;
  onChange: (field: FieldKey, column: number | null) => void;
  onAutoMap: () => void;
};

export function FieldMappingPanel({
  headers,
  mapping,
  onChange,
  onAutoMap,
}: FieldMappingPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">字段映射</p>
          <p className="mt-1 text-xs text-slate-500">
            把表格中的列对应到分析字段，带「必填」的字段必须指定。
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoMap}
          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
        >
          重新自动匹配
        </button>
      </div>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
        {FIELD_DEFINITIONS.map((field) => {
          const value = mapping[field.key];
          return (
            <li
              key={field.key}
              className="flex flex-col gap-2.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{field.label}</span>
                  {field.required ? (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">
                      必填
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      选填
                    </span>
                  )}
                  {value !== undefined && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      已映射
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{field.hint}</p>
              </div>

              <select
                value={value === undefined ? "" : String(value)}
                onChange={(event) => {
                  const next = event.target.value;
                  onChange(field.key, next === "" ? null : Number(next));
                }}
                className="w-full shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 sm:w-64"
                aria-label={`${field.label}对应的列`}
              >
                <option value="">不映射</option>
                {headers.map((header, index) => (
                  <option key={`${field.key}-${index}`} value={index}>
                    {header}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
