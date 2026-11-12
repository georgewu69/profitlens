"use client";

import type { ReactNode } from "react";
import { CheckIcon } from "@/components/ui/icons";

type StepPanelProps = {
  step: number;
  title: string;
  description?: string;
  done?: boolean;
  children: ReactNode;
};

export function StepPanel({ step, title, description, done, children }: StepPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-7">
      <div className="flex items-start gap-4">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-semibold ${
            done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {done ? <CheckIcon className="size-4" /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {done && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                已完成
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
