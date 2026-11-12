# ProfitLens

面向抖音电商卖家的商品利润分析工具 —— 让每一笔生意的利润都清清楚楚。

当前版本包含首页与 Excel 本地利润分析（MVP）：上传 `.xlsx` / `.xls` 订单表，在浏览器本地用 SheetJS 解析，计算销售额、退款、各项成本、净利润与利润率，并识别亏损商品。订单数据不会上传到服务器。

尚未接入数据库、支付、AI 接口及电商平台 API。

## 技术栈

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS v4
- SheetJS（xlsx，仅浏览器端动态加载）

## 本地开发

```bash
npm install
npm run dev
```

启动后访问：

- 首页：http://localhost:3000
- Excel 利润分析：http://localhost:3000/analyze

页面内提供「下载示例 Excel」，也可以直接使用 `public/sample-orders.xlsx` 测试。

## 其他命令

```bash
npm run build   # 生产构建
npm run start   # 启动生产构建
npm run lint    # 代码检查
```

## 目录结构

```txt
src/
├── app/
│   ├── page.tsx            # 首页
│   └── analyze/page.tsx    # Excel 利润分析页
├── components/
│   ├── analyze/            # 上传、工作表预览、字段映射、结果展示
│   ├── home/               # 首页各区块（Hero、功能、流程、CTA）
│   ├── layout/             # 全站头部、页脚
│   └── ui/                 # 通用组件（Logo、图标、按钮、区块标题）
└── lib/
    ├── excel/              # Excel 解析（workbook）与字段映射（fields）
    ├── profit/analyze.ts   # 利润计算
    └── format.ts           # 金额 / 百分比格式化
```

## 计算口径

- 销售额 = 订单金额合计
- 退款金额 = 退款列合计（取绝对值）
- 总成本 = 商品成本 + 平台费用 + 广告费用 + 物流费用
- 净利润 = 销售额 − 退款金额 − 总成本
- 利润率 = 净利润 ÷ 销售额

未映射的字段会明确提示，不会按 0 元计入，计算前需要用户确认结果不完整。
