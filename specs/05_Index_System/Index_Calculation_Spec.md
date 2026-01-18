# 指标计算 Spec（Product v0.9）

> 页面：`/indexes/calc/tasks`、`/indexes/calc/workbench/:taskId`  
> 目标：从已完成标签化的事实数据生成可追溯指标（draft）

---

## 1 页面IA
- 计算任务列表：创建/运行/查看进度
- 计算工作台：维度树→预览→样本→异常→生成
- 指标详情（可从工作台 drill）：统计卡+样本表（只读）

## 2 工作台线框
```text
┌index-calc-workbench──────────────────────────────────────────────┐
│ 左：维度树（tag/space/prof/scale） 中：预览卡（样本→异常→统计→推荐）│
│ 右：参数（基准期/异常法/minSample） 底：失败/低质量队列            │
└──────────────────────────────────────────────────────────────────┘

3 关键规则（UI必须呈现）

minSampleCount<3：不生成（skipped）

outlierRatio>20%：warning

推荐值：P25/P50/P75（用于发布写STR）

4 API（概念）

POST /indexes/calculate

GET /indexes/calc/tasks/{taskId}

GET /indexes?filters...

GET /indexes/{indexId}/samples

5 验收

任一指标可追溯到样本列表；异常样本可标识；样本不足有明确提示

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/index.ts` |
| **组件路径** | `src/pages/indexes/CalcTaskList.tsx`, `src/pages/indexes/CalcWorkbench.tsx`, `src/components/IndexDimensionTree.tsx`, `src/components/SampleTable.tsx` |
| **DTO** | `src/types/index.ts` (CostIndex, IndexSample, CalcTask) |
| **接口函数** | `src/api/index.ts` |

> Windsurf 实现时在此补充实际路径与命名

## V1.1 Patch：指数（价格基准期）口径统一（必选）

> 目标：所有指标在“同一价格基准期”下可比。避免不同年份样本混算导致系统性偏差。  
> 结论：**指数调整必须在“指标沉淀阶段”完成**，估算端默认使用已统一基准期的指标。

---

### 1. 新增：样本必须具备的时间与地区元数据（MUST）

指标计算样本（Sample）必须包含：
- `priceBaseDate`（原始价格基准期，精确到 year-month）
- `regionKey`（城市优先，其次省；用于取指数）
- `unitCost`（原单方）

若缺少 `priceBaseDate` 或 `regionKey`：
- 默认标记样本 `excluded`，原因 `MISSING_META`  
- 并在任务报告中计入“元数据缺失样本数”

---

### 2. 指数表（price_index）要求（MUST）

指数表最小字段：
- `regionKey`：如 `四川-成都` / `四川`（建议统一编码）
- `yearMonth`：如 `2026-01`
- `indexValue`：基期=100
- `indexType`：默认 `construction`
- `source`：来源说明

缺省策略（V1 最小可用）：
- **精确匹配** `regionKey + yearMonth`
- 若找不到精确月份：允许向前找最近可用月份（<=1个月）并给 `warning: INDEX_APPROX`
- 若仍缺失：该样本 `excluded`，原因 `MISSING_PRICE_INDEX`

---

### 3. 计算口径：统一调整到任务目标基准期（MUST）

任务参数新增（若已有则明确为必填）：
- `targetPriceDate`（目标价格基准期，精确到 year-month）

对每个样本：
- `factor = index(target) / index(sample.priceBaseDate)`
- `adjustedUnitCost = originalUnitCost * factor`

样本表（index_sample）必须落库：
- `originalUnitCost`
- `originalPriceDate`
- `priceAdjustFactor`
- `adjustedUnitCost`
- `included`
- `excludeReason`（MISSING_META / MISSING_PRICE_INDEX / MANUAL_EXCLUDE 等）

> 说明：最终用于统计的是 `adjustedUnitCost`（剔除异常与 excluded）

---

### 4. UI 增强（计算工作台必须显示）

在“指标计算工作台”中：
- 参数区显示：`目标基准期 targetPriceDate`
- 预览卡必须显示：
  - `样本数：原始N → 可调价N → 有效N`
  - `缺指数样本数`
  - `调价因子 factor 的 min/median/max（用于快速排查指数异常）`

在“样本列表”中新增列：
- 原基准期 `originalPriceDate`
- 原指数 `originalIndexValue`
- 目标指数 `targetIndexValue`
- 调价系数 `priceAdjustFactor`
- 调整后单方 `adjustedUnitCost`
- included / excludeReason

---

### 5. 质量评估补充（SHOULD，但强烈建议）

新增两条质量提示：
- `INDEX_MISSING_RATIO`：缺指数导致排除样本比例 > 20% → warning
- `INDEX_FACTOR_OUTLIER`：调价系数极端（>1.3 或 <0.7）→ warning（提示核对指数表/原基准期）

---

### 6. 验收用例（Given/When/Then）

1) Given 两个年份样本（2024-01 与 2026-01）When 计算到 target=2026-01 Then adjustedUnitCost 在同一基准期可比，P50 不被时间混合污染  
2) Given 样本缺 priceBaseDate When 计算 Then 样本 excluded 且出现在报告“元数据缺失”  
3) Given 指数表缺某月 When 计算 Then 允许向前1个月近似并给 warning；超过范围则 excluded  
4) Given targetPriceDate 变更 When 重算 Then cost_index 的 priceBaseDate 更新且样本 factor 重算  
5) Given 缺指数样本过多 When 计算 Then 指标质量提示 INDEX_MISSING_RATIO 出现
