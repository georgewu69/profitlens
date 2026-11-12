export type FieldKey =
  | "productName"
  | "orderAmount"
  | "productCost"
  | "refundAmount"
  | "platformFee"
  | "adSpend"
  | "shippingFee";

export type FieldMapping = Partial<Record<FieldKey, number>>;

export type FieldDefinition = {
  key: FieldKey;
  label: string;
  required: boolean;
  hint: string;
  keywords: string[];
  exclude?: string[];
};

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: "productName",
    label: "商品名称",
    required: true,
    hint: "用于按商品汇总利润，通常对应「商品名称」「商品标题」等列。",
    keywords: ["商品名称", "商品标题", "货品名称", "产品名称", "品名", "商品", "名称", "sku"],
    exclude: ["成本", "费用", "金额", "数量", "编号", "id"],
  },
  {
    key: "orderAmount",
    label: "订单金额",
    required: true,
    hint: "买家实付金额，用于计算销售额。",
    keywords: ["订单金额", "实付金额", "支付金额", "成交金额", "买家实付", "应付金额", "订单总额", "金额"],
    exclude: ["退款", "成本", "运费", "物流", "广告", "佣金", "平台"],
  },
  {
    key: "productCost",
    label: "商品成本",
    required: false,
    hint: "商品采购或生产成本。未映射时不会计入成本，也不会按 0 元当作真实成本。",
    keywords: ["商品成本", "采购成本", "进货成本", "成本价", "成本"],
  },
  {
    key: "refundAmount",
    label: "退款金额",
    required: false,
    hint: "退款、退货退款产生的金额，用于从销售额中扣除。",
    keywords: ["退款金额", "退货退款", "退款总额", "售后退款", "退款", "退单金额"],
  },
  {
    key: "platformFee",
    label: "平台费用",
    required: false,
    hint: "平台佣金、技术服务费等平台收取的费用。",
    keywords: ["平台费用", "平台服务费", "技术服务费", "平台佣金", "佣金", "服务费", "手续费"],
  },
  {
    key: "adSpend",
    label: "广告费用",
    required: false,
    hint: "千川或其他推广渠道的广告消耗。",
    keywords: ["广告费用", "推广费用", "广告消耗", "投放费用", "推广费", "广告费", "千川"],
  },
  {
    key: "shippingFee",
    label: "物流费用",
    required: false,
    hint: "快递费、运费险等物流相关支出。",
    keywords: ["物流费用", "物流费", "快递费", "运费险", "运费", "邮费"],
  },
];

export const FIELD_MAP: Record<FieldKey, FieldDefinition> = FIELD_DEFINITIONS.reduce(
  (acc, field) => {
    acc[field.key] = field;
    return acc;
  },
  {} as Record<FieldKey, FieldDefinition>,
);

export const REQUIRED_FIELDS = FIELD_DEFINITIONS.filter((field) => field.required);
export const OPTIONAL_FIELDS = FIELD_DEFINITIONS.filter((field) => !field.required);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s\u3000()（）【】\[\]_\-—:：/\\.,，、]/g, "")
    .trim();
}

function scoreHeader(header: string, field: FieldDefinition): number {
  const target = normalize(header);
  if (!target) return 0;

  const excluded = field.exclude?.some((word) => target.includes(normalize(word)));
  if (excluded) return 0;

  let best = 0;
  for (const keyword of field.keywords) {
    const word = normalize(keyword);
    if (!word) continue;

    if (target === word) {
      best = Math.max(best, 100 + word.length);
    } else if (target.includes(word)) {
      best = Math.max(best, 50 + word.length);
    } else if (word.includes(target) && target.length >= 2) {
      best = Math.max(best, 20 + target.length);
    }
  }

  return best;
}

/**
 * 根据表头名称自动匹配字段：优先精确匹配，其次包含匹配，且一列只能对应一个字段。
 */
export function autoMapFields(headers: string[]): FieldMapping {
  const candidates: { field: FieldKey; column: number; score: number }[] = [];

  FIELD_DEFINITIONS.forEach((field) => {
    headers.forEach((header, column) => {
      const score = scoreHeader(header, field);
      if (score > 0) candidates.push({ field: field.key, column, score });
    });
  });

  candidates.sort((a, b) => b.score - a.score);

  const mapping: FieldMapping = {};
  const usedColumns = new Set<number>();

  for (const candidate of candidates) {
    if (mapping[candidate.field] !== undefined) continue;
    if (usedColumns.has(candidate.column)) continue;
    mapping[candidate.field] = candidate.column;
    usedColumns.add(candidate.column);
  }

  return mapping;
}

/** 解析单元格中的金额，无法识别时返回 null，避免把空值当作 0。 */
export function parseAmount(cell: unknown): number | null {
  if (typeof cell === "number") {
    return Number.isFinite(cell) ? cell : null;
  }

  if (typeof cell === "boolean") {
    return cell ? 1 : 0;
  }

  if (cell === null || cell === undefined) return null;

  const text = String(cell).trim();
  if (!text) return null;

  const negative = /^\(.*\)$/.test(text);
  const cleaned = text.replace(/[￥¥$,，\s]/g, "").replace(/[()]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "—" || cleaned === "无") return null;

  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;

  return negative ? -value : value;
}
