# 指标计算规范 (Index Calculation Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：05_Index_System

---

## 1. 概述

### 1.1 目的
指标计算是将标签化后的造价数据转化为可复用估算指标的核心环节，通过：
- 按多维度聚合历史数据
- 统计分析生成指标值
- 识别和处理异常数据
- 输出标准化的造价指标

### 1.2 在整体流程中的位置

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ 数据采集  │ →  │ 标签化   │ →  │ 指标计算  │ →  │ 统计发布  │ →  │ 估算应用  │
│ (导入)   │    │ (处理)   │    │ (生成)   │    │ (审核)   │    │ (使用)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                    ▲
                                 当前模块
```

### 1.3 术语定义

| 术语 | 定义 |
|------|------|
| 造价指标 | 单位建筑面积的工程造价（元/m²） |
| 样本 | 参与指标计算的单条造价数据 |
| 聚合维度 | 指标分类的维度组合（功能标签×空间×专业×规模档） |
| 异常值 | 偏离正常范围的数据点 |
| 置信区间 | 指标值的可信范围 |

### 1.4 设计原则

- **科学性**：采用统计学方法，确保指标的代表性
- **可追溯**：每个指标可追溯到原始样本
- **动态更新**：支持增量计算和实时更新
- **质量可控**：提供指标质量评估机制

---

## 2. 指标体系结构

### 2.1 指标维度

```
指标 = f(功能标签, 空间, 专业, 规模档, 地区, 时间)

核心维度（必选）：
├── 功能标签：描述单体功能用途
├── 空间：地上/地下/室外
├── 专业：土建/安装各专业
└── 规模档：按面积或功能规模分档

扩展维度（可选）：
├── 地区：省/市/区
├── 时间：价格基准期
├── 结构类型：框架/框剪/剪力墙
└── 质量标准：普通/中档/高档
```

### 2.2 指标层级

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              指标层级体系                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Level 4（最细）: 功能标签 × 空间 × 专业 × 规模档                            │
│  示例：门诊-地上-土建-中大型 = 3850元/m²                                     │
│                                                                             │
│  Level 3: 功能标签 × 空间 × 专业（不分规模）                                 │
│  示例：门诊-地上-土建 = 3720元/m²                                            │
│                                                                             │
│  Level 2: 功能标签 × 专业（不分空间）                                        │
│  示例：门诊-土建 = 3500元/m²                                                 │
│                                                                             │
│  Level 1（最粗）: 功能标签（汇总）                                           │
│  示例：门诊 = 5200元/m²                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 指标类型

| 指标类型 | 说明 | 用途 |
|----------|------|------|
| 综合指标 | 单体总造价/总面积 | 快速估算 |
| 分部指标 | 按空间或专业的单方造价 | 分部估算 |
| 明细指标 | 空间×专业的单方造价 | 精细估算 |
| 比例指标 | 各部分占总造价的比例 | 结构分析 |

---

## 3. 计算流程

### 3.1 整体流程

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              指标计算流程                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Step1  │    │  Step2  │    │  Step3  │    │  Step4  │    │  Step5  │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  │ 样本筛选 │ →  │ 价格调整 │ →  │ 异常识别 │ →  │ 统计计算 │ →  │ 指标生成 │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  按维度筛选     调整到统一      箱线图法       计算统计量      生成指标    │
│  有效样本       价格基准期      识别异常       推荐值确定      质量评估    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Step 1: 样本筛选

**目的：** 筛选符合条件的有效样本

**筛选条件：**
```typescript
interface SampleFilter {
  // 必选条件
  functionTagCode: string;       // 功能标签
  spaceCode?: string;            // 空间（可选）
  professionCode?: string;       // 专业（可选）
  scaleRangeCode?: string;       // 规模档（可选）
  
  // 可选条件
  region?: {
    province?: string;
    city?: string;
  };
  priceBaseDateRange?: {         // 价格基准期范围
    start: Date;
    end: Date;
  };
  structureType?: string;        // 结构类型
  qualityStandard?: string;      // 质量标准
  
  // 数据质量条件
  minConfidence?: number;        // 最小标签置信度
  excludeManualAdjusted?: boolean; // 排除手动调整的数据
}
```

**筛选逻辑：**
```typescript
function filterSamples(filter: SampleFilter): Sample[] {
  let query = db.unitCostDetail
    .join('buildingUnit')
    .where('buildingUnit.status', '=', 'completed');
  
  // 功能标签（必选）
  query = query.where('buildingUnit.functionTagCode', '=', filter.functionTagCode);
  
  // 空间（可选）
  if (filter.spaceCode) {
    query = query.where('spaceCode', '=', filter.spaceCode);
  }
  
  // 专业（可选）
  if (filter.professionCode) {
    query = query.where('professionCode', '=', filter.professionCode);
  }
  
  // 规模档（可选）
  if (filter.scaleRangeCode) {
    query = query.where('buildingUnit.scaleRangeCode', '=', filter.scaleRangeCode);
  }
  
  return query.select([
    'unitCostDetail.id',
    'unitCostDetail.cost',
    'unitCostDetail.area',
    'unitCostDetail.unitCost',
    'buildingUnit.projectId',
    'buildingUnit.priceBaseDate',
    'buildingUnit.totalArea',
    'buildingUnit.scaleRangeCode'
  ]).execute();
}
```

### 3.3 Step 2: 价格调整

**目的：** 将不同时点的造价数据调整到统一的价格基准期

**调整公式：**
```
调整后单方 = 原单方 × (目标期价格指数 / 原期价格指数)
```

**价格指数表 (price_index)：**
```typescript
interface PriceIndex {
  id: string;
  region: string;                // 地区
  yearMonth: string;             // 年月，如 "2026-01"
  indexValue: number;            // 指数值（基期=100）
  indexType: 'construction' | 'material' | 'labor';
  source: string;                // 数据来源
  createdAt: Date;
}
```

**调整逻辑：**
```typescript
function adjustPrice(
  samples: Sample[],
  targetPriceDate: Date
): AdjustedSample[] {
  const targetIndex = getPriceIndex(targetPriceDate);
  
  return samples.map(sample => {
    const originalIndex = getPriceIndex(sample.priceBaseDate);
    const adjustFactor = targetIndex.indexValue / originalIndex.indexValue;
    
    return {
      ...sample,
      originalUnitCost: sample.unitCost,
      adjustFactor: adjustFactor,
      adjustedUnitCost: sample.unitCost * adjustFactor
    };
  });
}
```

### 3.4 Step 3: 异常识别

**目的：** 识别并标记异常数据

**方法1：箱线图法（IQR）**
```
Q1 = 第25百分位数
Q3 = 第75百分位数
IQR = Q3 - Q1

下界 = Q1 - 1.5 × IQR
上界 = Q3 + 1.5 × IQR

超出[下界, 上界]的数据标记为异常
```

**方法2：Z-Score法**
```
Z = (X - μ) / σ
|Z| > 3 的数据标记为异常
```

**异常识别逻辑：**
```typescript
function identifyOutliers(
  samples: AdjustedSample[],
  method: 'iqr' | 'zscore' = 'iqr'
): OutlierResult {
  const unitCosts = samples.map(s => s.adjustedUnitCost);
  
  let outlierIds: string[] = [];
  let bounds: { lower: number; upper: number };
  
  if (method === 'iqr') {
    const q1 = percentile(unitCosts, 25);
    const q3 = percentile(unitCosts, 75);
    const iqr = q3 - q1;
    bounds = {
      lower: q1 - 1.5 * iqr,
      upper: q3 + 1.5 * iqr
    };
  } else if (method === 'zscore') {
    const mean = average(unitCosts);
    const std = standardDeviation(unitCosts);
    bounds = {
      lower: mean - 3 * std,
      upper: mean + 3 * std
    };
  }
  
  outlierIds = samples
    .filter(s => s.adjustedUnitCost < bounds.lower || s.adjustedUnitCost > bounds.upper)
    .map(s => s.id);
  
  return {
    outlierIds,
    bounds,
    outlierCount: outlierIds.length,
    outlierRatio: outlierIds.length / samples.length
  };
}
```

### 3.5 Step 4: 统计计算

**目的：** 计算各项统计指标

**计算指标：**
```typescript
interface StatisticsResult {
  // 基础统计量
  sampleCount: number;           // 样本数量
  sum: number;                   // 合计
  mean: number;                  // 平均值
  median: number;                // 中位数
  
  // 离散程度
  min: number;                   // 最小值
  max: number;                   // 最大值
  range: number;                 // 极差
  variance: number;              // 方差
  stdDeviation: number;          // 标准差
  coefficientOfVariation: number; // 变异系数
  
  // 分位数
  percentile25: number;          // 25%分位
  percentile50: number;          // 50%分位
  percentile75: number;          // 75%分位
  
  // 置信区间（95%）
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}
```

**计算逻辑：**
```typescript
function calculateStatistics(samples: AdjustedSample[]): StatisticsResult {
  const validSamples = samples.filter(s => !s.isOutlier);
  const values = validSamples.map(s => s.adjustedUnitCost);
  
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1);
  const stdDeviation = Math.sqrt(variance);
  const coefficientOfVariation = stdDeviation / mean;
  
  const percentile = (p: number) => {
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };
  
  const standardError = stdDeviation / Math.sqrt(n);
  const tValue = 1.96;
  const confidenceInterval = {
    lower: mean - tValue * standardError,
    upper: mean + tValue * standardError
  };
  
  return {
    sampleCount: n,
    sum,
    mean,
    median,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    variance,
    stdDeviation,
    coefficientOfVariation,
    percentile25: percentile(25),
    percentile50: percentile(50),
    percentile75: percentile(75),
    confidenceInterval
  };
}
```

### 3.6 Step 5: 指标生成

**目的：** 生成最终的造价指标

**推荐值确定：**
```typescript
// 推荐值采用分位数法
recommendedLow = Q1 (25%分位)
recommendedMid = Q2 (50%分位，中位数)
recommendedHigh = Q3 (75%分位)
```

**指标生成逻辑：**
```typescript
function generateIndex(
  filter: SampleFilter,
  statistics: StatisticsResult,
  outlierResult: OutlierResult,
  targetPriceDate: Date
): CostIndex {
  const quality = evaluateIndexQuality(statistics, outlierResult);
  
  return {
    id: generateUUID(),
    functionTagCode: filter.functionTagCode,
    spaceCode: filter.spaceCode || 'ALL',
    professionCode: filter.professionCode || 'ALL',
    scaleRangeCode: filter.scaleRangeCode || 'ALL',
    
    sampleCount: statistics.sampleCount,
    avgUnitCost: statistics.mean,
    medianUnitCost: statistics.median,
    minUnitCost: statistics.min,
    maxUnitCost: statistics.max,
    stdDeviation: statistics.stdDeviation,
    coefficientOfVariation: statistics.coefficientOfVariation,
    
    percentile25: statistics.percentile25,
    percentile75: statistics.percentile75,
    
    recommendedLow: statistics.percentile25,
    recommendedMid: statistics.median,
    recommendedHigh: statistics.percentile75,
    
    priceBaseDate: targetPriceDate,
    qualityScore: quality.totalScore,
    qualityLevel: quality.qualityLevel,
    
    calculatedAt: new Date(),
    status: 'draft'
  };
}
```

---

## 4. 数据模型

### 4.1 指标结果表 (cost_index)

```typescript
interface CostIndex {
  id: string;
  
  // 维度信息
  functionTagId: string;
  functionTagCode: string;
  functionTagName: string;
  functionCategory: string;
  
  spaceCode: string;             // ALL表示汇总
  spaceName: string;
  
  professionCode: string;        // ALL表示汇总
  professionName: string;
  
  scaleRangeCode: string;        // ALL表示汇总
  scaleRangeName: string;
  scaleMin: number;
  scaleMax: number;
  scaleUnit: string;
  
  // 统计值
  sampleCount: number;
  avgUnitCost: number;
  medianUnitCost: number;
  minUnitCost: number;
  maxUnitCost: number;
  stdDeviation: number;
  coefficientOfVariation: number;
  
  // 分位数
  percentile25: number;
  percentile75: number;
  
  // 推荐值
  recommendedLow: number;
  recommendedMid: number;
  recommendedHigh: number;
  
  // 价格基准
  priceBaseDate: Date;
  priceIndexValue: number;
  
  // 质量评估
  qualityScore: number;
  qualityLevel: 'A' | 'B' | 'C' | 'D';
  
  // 版本信息
  versionId: string;
  versionCode: string;
  
  // 系统字段
  calculatedAt: Date;
  calculatedBy: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 指标样本关联表 (index_sample)

```typescript
interface IndexSample {
  id: string;
  costIndexId: string;
  unitCostDetailId: string;
  buildingUnitId: string;
  projectId: string;
  
  originalArea: number;
  originalCost: number;
  originalUnitCost: number;
  
  originalPriceDate: Date;
  priceAdjustFactor: number;
  adjustedUnitCost: number;
  
  isOutlier: boolean;
  outlierReason: string;
  outlierMethod: string;
  
  weight: number;
  included: boolean;
  excludeReason: string;
  
  createdAt: Date;
}
```

### 4.3 计算任务表 (calculation_task)

```typescript
interface CalculationTask {
  id: string;
  taskName: string;
  taskType: 'full' | 'incremental' | 'single';
  
  targetPriceDate: Date;
  outlierMethod: 'iqr' | 'zscore' | 'empirical';
  minSampleCount: number;
  
  functionTagCodes: string[];
  recalculateExisting: boolean;
  
  totalIndexes: number;
  completedIndexes: number;
  errorIndexes: number;
  progress: number;
  
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  
  startedAt: Date;
  completedAt: Date;
  
  resultSummary: {
    newIndexes: number;
    updatedIndexes: number;
    skippedIndexes: number;
    avgQualityScore: number;
  };
  
  errorMessage: string;
  
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}
```

---

## 5. 质量评估

### 5.1 评估维度

| 维度 | 权重 | 评估方法 |
|------|------|----------|
| 样本量 | 40% | 按数量分档评分 |
| 离散度 | 40% | 按变异系数评分 |
| 时效性 | 20% | 按数据年限评分 |

### 5.2 评分规则

**样本数量评分：**
| 样本数 | 得分 | 等级 |
|--------|------|------|
| ≥ 20 | 100 | sufficient |
| 10-19 | 80 | adequate |
| 5-9 | 60 | adequate |
| 3-4 | 40 | insufficient |
| < 3 | 0 | insufficient |

**变异系数评分：**
| CV值 | 得分 | 等级 |
|------|------|------|
| < 0.15 | 100 | low |
| 0.15-0.25 | 80 | low |
| 0.25-0.35 | 60 | medium |
| 0.35-0.50 | 40 | high |
| > 0.50 | 20 | high |

**时效性评分：**
| 平均数据年限 | 得分 | 等级 |
|--------------|------|------|
| < 12个月 | 100 | current |
| 12-24个月 | 80 | current |
| 24-36个月 | 60 | acceptable |
| 36-48个月 | 40 | acceptable |
| > 48个月 | 20 | outdated |

**综合评分：**
```
总分 = 样本量得分 × 0.4 + 离散度得分 × 0.4 + 时效性得分 × 0.2

等级划分：
A级：≥ 80分
B级：60-79分
C级：40-59分
D级：< 40分
```

---

## 6. 计算策略

### 6.1 全量计算

**触发场景：** 系统初始化、标准库变更、手动触发

```typescript
async function calculateAllIndexes(params: CalculationParams): Promise<void> {
  const tags = await getAllFunctionTags();
  const spaces = await getAllSpaces();
  const professions = await getAllProfessions();
  const scaleRanges = await getAllScaleRanges();
  
  const combinations = generateCombinations(tags, spaces, professions, scaleRanges);
  
  for (const combo of combinations) {
    await calculateSingleIndex(combo, params);
  }
}
```

### 6.2 增量计算

**触发场景：** 新数据导入、定时任务

```typescript
async function calculateIncrementalIndexes(
  params: CalculationParams,
  sinceDate: Date
): Promise<void> {
  const newSamples = await getNewSamples(sinceDate);
  const affectedDimensions = extractDimensions(newSamples);
  
  for (const dimension of affectedDimensions) {
    await calculateSingleIndex(dimension, params);
  }
}
```

---

## 7. API接口

### 7.1 触发指标计算

```
POST /api/v1/indexes/calculate
```

**请求体：**
```json
{
  "taskType": "full",
  "targetPriceDate": "2026-01-01",
  "outlierMethod": "iqr",
  "minSampleCount": 3,
  "functionTagCodes": ["YI-01", "YI-04"],
  "recalculateExisting": true
}
```

### 7.2 获取计算任务状态

```
GET /api/v1/indexes/calculate/tasks/{taskId}
```

### 7.3 查询指标

```
GET /api/v1/indexes
```

**请求参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| functionTagCode | string | 功能标签 |
| spaceCode | string | 空间 |
| professionCode | string | 专业 |
| scaleRangeCode | string | 规模档 |
| qualityLevel | string | 质量等级 |
| page | number | 页码 |
| pageSize | number | 每页数量 |

### 7.4 获取指标详情

```
GET /api/v1/indexes/{indexId}
```

### 7.5 获取指标样本

```
GET /api/v1/indexes/{indexId}/samples
```

### 7.6 手动调整指标

```
PUT /api/v1/indexes/{indexId}/adjust
```

### 7.7 重算单个指标

```
POST /api/v1/indexes/{indexId}/recalculate
```

---

## 8. 业务规则

### 8.1 样本筛选规则

| 规则 | 描述 |
|------|------|
| SF-01 | 仅使用状态为"已完成"的单体数据 |
| SF-02 | 标签置信度低于0.7需人工确认 |
| SF-03 | 价格基准期超过5年降低权重或排除 |
| SF-04 | 手动标记为"不参与计算"的排除 |

### 8.2 异常识别规则

| 规则 | 描述 |
|------|------|
| OR-01 | 默认使用IQR方法 |
| OR-02 | 异常值比例超过20%发出警告 |
| OR-03 | 样本量小于10时使用2倍IQR |
| OR-04 | 异常数据默认不参与计算 |

### 8.3 指标生成规则

| 规则 | 描述 |
|------|------|
| IG-01 | 样本量少于3个不生成指标 |
| IG-02 | 推荐值采用分位数法 |
| IG-03 | 变异系数超过0.5标记为低质量 |
| IG-04 | 新计算覆盖旧值 |

---

## 9. 性能要求

| 指标 | 要求 |
|------|------|
| 单个指标计算 | < 1秒 |
| 增量计算（100个） | < 30秒 |
| 全量计算（1000个） | < 10分钟 |
| 指标查询 | < 500ms |

---

## 10. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |

