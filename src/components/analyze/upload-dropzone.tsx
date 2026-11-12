"use client";

import { useRef, useState } from "react";
import { formatFileSize } from "@/lib/format";
import { ReportIcon } from "@/components/ui/icons";

type UploadDropzoneProps = {
  file: { name: string; size: number } | null;
  loading: boolean;
  onSelect: (file: File) => void;
};

export function UploadDropzone({ file, loading, onSelect }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const next = files?.[0];
    if (next) onSelect(next);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {file ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <ReportIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatFileSize(file.size)} · 已在本地解析，未上传
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openPicker}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            重新选择文件
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging
              ? "border-emerald-400 bg-emerald-50/70"
              : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50/40"
          }`}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <ReportIcon className="size-6" />
          </span>
          <span className="text-sm font-medium text-slate-800">
            {loading ? "正在解析文件…" : "点击选择或拖拽 Excel 文件到这里"}
          </span>
          <span className="text-xs text-slate-500">支持 .xlsx / .xls，单个文件不超过 20 MB</span>
        </button>
      )}

      <p className="text-xs leading-5 text-slate-400">
        文件仅在当前浏览器中解析，不会上传到服务器。如需体验，可
        <a
          href="/sample-orders.xlsx"
          download
          className="mx-1 font-medium text-emerald-600 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-700"
        >
          下载示例 Excel
        </a>
        。
      </p>
    </div>
  );
}
