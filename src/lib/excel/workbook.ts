import type { WorkBook } from "xlsx";

export type Cell = string | number | boolean | null;

export type SheetTable = {
  name: string;
  headers: string[];
  rows: Cell[][];
};

export type WorkbookData = {
  fileName: string;
  fileSize: number;
  sheets: SheetTable[];
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export class ExcelParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelParseError";
  }
}

function isBlank(cell: Cell | undefined) {
  return cell === null || cell === undefined || String(cell).trim() === "";
}

function buildHeaders(rawHeader: Cell[], width: number): string[] {
  const used = new Map<string, number>();

  return Array.from({ length: width }, (_, index) => {
    const raw = rawHeader[index];
    const text = isBlank(raw) ? `第 ${index + 1} 列` : String(raw).trim();
    const count = (used.get(text) ?? 0) + 1;
    used.set(text, count);
    return count === 1 ? text : `${text} (${count})`;
  });
}

function toSheetTable(name: string, matrix: Cell[][]): SheetTable {
  const rows = matrix.filter((row) => row.some((cell) => !isBlank(cell)));
  if (rows.length === 0) {
    return { name, headers: [], rows: [] };
  }

  const headerRow = rows[0];
  let lastColumn = -1;
  headerRow.forEach((cell, index) => {
    if (!isBlank(cell)) lastColumn = index;
  });

  const width = lastColumn + 1;
  if (width === 0) {
    return { name, headers: [], rows: [] };
  }

  const headers = buildHeaders(headerRow, width);
  const dataRows = rows.slice(1).map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? null),
  );

  return { name, headers, rows: dataRows };
}

/**
 * 在浏览器本地把 Excel 文件解析为工作表数据，整个过程不会发起网络请求。
 */
export async function parseExcelFile(file: File): Promise<WorkbookData> {
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    throw new ExcelParseError("仅支持 .xlsx 或 .xls 格式的文件，请重新选择。");
  }

  if (file.size === 0) {
    throw new ExcelParseError("文件内容为空，请确认文件是否完整后再上传。");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ExcelParseError("文件大小超过 20 MB，请拆分后再上传。");
  }

  const XLSX = await import("xlsx");

  let workbook: WorkBook;
  try {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  } catch {
    throw new ExcelParseError(
      "无法解析该文件。请确认它是有效的 Excel 文件，而不是被重命名的其他格式。",
    );
  }

  if (!workbook.SheetNames.length) {
    throw new ExcelParseError("文件中没有找到任何工作表。");
  }

  const sheets: SheetTable[] = [];
  for (const name of workbook.SheetNames) {
    const worksheet = workbook.Sheets[name];
    if (!worksheet) continue;

    const matrix = XLSX.utils.sheet_to_json<Cell[]>(worksheet, {
      header: 1,
      defval: null,
      blankrows: false,
      raw: true,
    });

    sheets.push(toSheetTable(name, matrix));
  }

  const hasData = sheets.some((sheet) => sheet.headers.length > 0 && sheet.rows.length > 0);
  if (!hasData) {
    throw new ExcelParseError(
      "没有读取到可分析的数据行。请确认工作表第一行是表头，且下方存在订单数据。",
    );
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    sheets,
  };
}
