"use client";

import { useState } from "react";
import {
  autoMapFields,
  OPTIONAL_FIELDS,
  REQUIRED_FIELDS,
  type FieldKey,
  type FieldMapping,
} from "@/lib/excel/fields";
import { ExcelParseError, parseExcelFile, type WorkbookData } from "@/lib/excel/workbook";
import { AnalysisError, analyzeSheet, type AnalysisResult } from "@/lib/profit/analyze";
import { StepPanel } from "@/components/analyze/step-panel";
import { UploadDropzone } from "@/components/analyze/upload-dropzone";
import { SheetPreview } from "@/components/analyze/sheet-preview";
import { FieldMappingPanel } from "@/components/analyze/field-mapping-panel";
import { AnalysisResultView } from "@/components/analyze/analysis-result";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800"
      role="alert"
    >
      <AlertIcon className="mt-0.5 size-4 shrink-0 text-rose-500" />
      <span>{message}</span>
    </div>
  );
}

export function ExcelAnalyzer() {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [workbook, setWorkbook] = useState<WorkbookData | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const sheet = workbook?.sheets[sheetIndex];

  const missingRequired = REQUIRED_FIELDS.filter(
    (field) => mapping[field.key] === undefined,
  );
  const missingOptional = OPTIONAL_FIELDS.filter(
    (field) => mapping[field.key] === undefined,
  );
  const canAnalyze =
    !!sheet &&
    sheet.rows.length > 0 &&
    missingRequired.length === 0 &&
    (missingOptional.length === 0 || confirmed);

  async function handleSelectFile(file: File) {
    setLoading(true);
    setParseError(null);
    setAnalysisError(null);
    setResult(null);
    setWorkbook(null);
    setFileInfo(null);
    setConfirmed(false);
    setMapping({});

    try {
      const data = await parseExcelFile(file);
      const firstUsable = data.sheets.findIndex(
        (item) => item.headers.length > 0 && item.rows.length > 0,
      );
      const index = firstUsable >= 0 ? firstUsable : 0;

      setWorkbook(data);
      setFileInfo({ name: file.name, size: file.size });
      setSheetIndex(index);
      setMapping(autoMapFields(data.sheets[index]?.headers ?? []));
    } catch (error) {
      setParseError(
        error instanceof ExcelParseError
          ? error.message
          : "解析文件时发生未知错误，请确认文件格式后重试。",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSheetChange(index: number) {
    setSheetIndex(index);
    setResult(null);
    setAnalysisError(null);
    setConfirmed(false);
    setMapping(autoMapFields(workbook?.sheets[index]?.headers ?? []));
  }

  function handleMappingChange(field: FieldKey, column: number | null) {
    setMapping((prev) => {
      const next = { ...prev };
      if (column === null) {
        delete next[field];
      } else {
        next[field] = column;
      }
      return next;
    });
    setResult(null);
    setAnalysisError(null);
    setConfirmed(false);
  }

  function handleAnalyze() {
    if (!sheet) return;
    setAnalysisError(null);

    try {
      setResult(analyzeSheet(sheet, mapping));
    } catch (error) {
      setResult(null);
      setAnalysisError(
        error instanceof AnalysisError ? error.message : "计算利润时发生未知错误，请重试。",
      );
    }
  }

  return (
    <div className="space-y-5">
      <StepPanel
        step={1}
        title="上传 Excel 文件"
        description="支持 .xlsx / .xls 订单表，文件在你的浏览器本地解析，不会上传到服务器。"
        done={!!workbook}
      >
        <UploadDropzone
          file={fileInfo}
          loading={loading}
          onSelect={handleSelectFile}
        />
        {parseError && <ErrorBox message={parseError} />}
      </StepPanel>

      {workbook && sheet && (
        <StepPanel
          step={2}
          title="确认工作表与字段映射"
          description="选择要分析的工作表，并核对每一列对应的含义。"
          done={!!result}
        >
          <div className="space-y-6">
            <SheetPreview
              sheets={workbook.sheets}
              activeIndex={sheetIndex}
              onChange={handleSheetChange}
            />

            <FieldMappingPanel
              headers={sheet.headers}
              mapping={mapping}
              onChange={handleMappingChange}
              onAutoMap={() => {
                setMapping(autoMapFields(sheet.headers));
                setResult(null);
                setAnalysisError(null);
                setConfirmed(false);
              }}
            />

            {missingRequired.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
                <AlertIcon className="mt-0.5 size-4 shrink-0 text-rose-500" />
                <span>
                  请先为必填字段选择对应的列：
                  {missingRequired.map((field) => field.label).join("、")}。
                </span>
              </div>
            )}

            {missingRequired.length === 0 && missingOptional.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-900">
                <div className="flex items-start gap-2.5">
                  <AlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-medium">
                      以下字段未映射：
                      {missingOptional.map((field) => field.label).join("、")}
                    </p>
                    <p className="mt-1 text-amber-800">
                      未映射的字段不会参与计算，也不会被当作 0 元成本，因此利润可能偏高。
                    </p>
                  </div>
                </div>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-lg bg-white/70 px-3 py-2.5 text-xs text-amber-900">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-amber-600"
                  />
                  <span>我确认以上字段不参与本次计算，并理解结果标注为不完整。</span>
                </label>
              </div>
            )}

            {missingRequired.length === 0 && missingOptional.length === 0 && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckIcon className="size-4 shrink-0 text-emerald-500" />
                所有字段均已完成映射，成本计算相对完整。
              </div>
            )}

            {sheet.rows.length === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                当前工作表没有数据行，请切换其他工作表。
              </div>
            )}

            {analysisError && <ErrorBox message={analysisError} />}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-400">
                销售额 = 订单金额合计；净利润 = 销售额 − 退款 − 各项已映射成本。
              </p>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-6 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                开始分析
              </button>
            </div>
          </div>
        </StepPanel>
      )}

      {result && sheet && (
        <StepPanel
          step={3}
          title="分析结果"
          description="以下结果仅基于你当前映射的字段计算，请结合缺失字段提示一起判断。"
          done
        >
          <AnalysisResultView result={result} sheetName={sheet.name} />
        </StepPanel>
      )}
    </div>
  );
}
