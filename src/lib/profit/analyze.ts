import {
  OPTIONAL_FIELDS,
  parseAmount,
  type FieldDefinition,
  type FieldMapping,
} from "@/lib/excel/fields";
import type { SheetTable } from "@/lib/excel/workbook";

export type ProductProfit = {
  name: string;
  rows: number;
  sales: number;
  refunds: number;
  productCost: number;
  platformFee: number;
  adSpend: number;
  shippingFee: number;
  totalCost: number;
  netProfit: number;
  margin: number | null;
};

export type AnalysisResult = {
  totalRows: number;
  validRows: number;
  skippedRows: number;
  unnamedRows: number;
  sales: number;
  refunds: number;
  productCost: number;
  platformFee: number;
  adSpend: number;
  shippingFee: number;
  totalCost: number;
  netProfit: number;
  margin: number | null;
  products: ProductProfit[];
  lossProducts: ProductProfit[];
  unmappedFields: FieldDefinition[];
};

export class AnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisError";
  }
}

function readCell(row: (string | number | boolean | null)[], column: number | undefined) {
  if (column === undefined) return null;
  return row[column] ?? null;
}

export function analyzeSheet(sheet: SheetTable, mapping: FieldMapping): AnalysisResult {
  const productColumn = mapping.productName;
  const amountColumn = mapping.orderAmount;

  if (productColumn === undefined || amountColumn === undefined) {
    throw new AnalysisError("请先为「商品名称」和「订单金额」选择对应的列。");
  }

  const productMap = new Map<string, ProductProfit>();
  const totals = {
    sales: 0,
    refunds: 0,
    productCost: 0,
    platformFee: 0,
    adSpend: 0,
    shippingFee: 0,
  };

  let skippedRows = 0;
  let validRows = 0;
  let unnamedRows = 0;

  for (const row of sheet.rows) {
    const sales = parseAmount(readCell(row, amountColumn));
    if (sales === null) {
      skippedRows += 1;
      continue;
    }

    const rawName = readCell(row, productColumn);
    const name = String(rawName ?? "").trim();
    if (!name) unnamedRows += 1;

    const productName = name || "未命名商品";
    const refunds = mapping.refundAmount !== undefined
      ? Math.abs(parseAmount(readCell(row, mapping.refundAmount)) ?? 0)
      : 0;
    const productCost = mapping.productCost !== undefined
      ? parseAmount(readCell(row, mapping.productCost)) ?? 0
      : 0;
    const platformFee = mapping.platformFee !== undefined
      ? parseAmount(readCell(row, mapping.platformFee)) ?? 0
      : 0;
    const adSpend = mapping.adSpend !== undefined
      ? parseAmount(readCell(row, mapping.adSpend)) ?? 0
      : 0;
    const shippingFee = mapping.shippingFee !== undefined
      ? parseAmount(readCell(row, mapping.shippingFee)) ?? 0
      : 0;

    const current = productMap.get(productName) ?? {
      name: productName,
      rows: 0,
      sales: 0,
      refunds: 0,
      productCost: 0,
      platformFee: 0,
      adSpend: 0,
      shippingFee: 0,
      totalCost: 0,
      netProfit: 0,
      margin: null,
    };

    current.rows += 1;
    current.sales += sales;
    current.refunds += refunds;
    current.productCost += productCost;
    current.platformFee += platformFee;
    current.adSpend += adSpend;
    current.shippingFee += shippingFee;
    productMap.set(productName, current);

    totals.sales += sales;
    totals.refunds += refunds;
    totals.productCost += productCost;
    totals.platformFee += platformFee;
    totals.adSpend += adSpend;
    totals.shippingFee += shippingFee;

    validRows += 1;
  }

  if (validRows === 0) {
    throw new AnalysisError(
      "没有可分析的有效数据行。请确认「订单金额」列中填写的是数字，且表头下方存在订单数据。",
    );
  }

  const products = Array.from(productMap.values())
    .map((product) => {
      const totalCost =
        product.productCost +
        product.platformFee +
        product.adSpend +
        product.shippingFee;
      const netProfit = product.sales - product.refunds - totalCost;
      return {
        ...product,
        totalCost,
        netProfit,
        margin: product.sales > 0 ? netProfit / product.sales : null,
      };
    })
    .filter((product) => product.sales > 0)
    .sort((a, b) => b.netProfit - a.netProfit);

  if (products.length === 0) {
    throw new AnalysisError(
      "所有数据行的订单金额都为 0，暂时无法计算利润，请检查「订单金额」字段映射。",
    );
  }

  const totalCost =
    totals.productCost + totals.platformFee + totals.adSpend + totals.shippingFee;
  const netProfit = totals.sales - totals.refunds - totalCost;

  return {
    ...totals,
    totalCost,
    netProfit,
    margin: totals.sales > 0 ? netProfit / totals.sales : null,
    totalRows: sheet.rows.length,
    validRows,
    skippedRows,
    unnamedRows,
    products,
    lossProducts: products.filter((product) => product.netProfit < 0),
    unmappedFields: OPTIONAL_FIELDS.filter((field) => mapping[field.key] === undefined),
  };
}
