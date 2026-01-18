# 估算应用规范 (Estimation Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：06_Estimation_Pricing

---

## 1. 概述

### 1.1 目的
估算应用是指标体系的核心应用场景，通过：
- 匹配合适的造价指标
- 快速生成投资估算
- 支持多方案比选
- 输出标准估算报告

### 1.2 在整体流程中的位置

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ 数据采集  │ →  │ 标签化   │ →  │ 指标计算  │ →  │ 统计发布  │ →  │ 估算应用  │
│ (导入)   │    │ (处理)   │    │ (生成)   │    │ (审核)   │    │ (当前)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                                    ▲
                                                                 当前模块
```

### 1.3 估算类型

| 估算类型 | 精度 | 适用阶段 | 说明 |
|----------|------|----------|------|
| 快速估算 | ±20% | 可研/决策 | 仅需面积，秒级出结果 |
| 标准估算 | ±15% | 方案设计 | 需功能分区，分部估算 |
| 精细估算 | ±10% | 初步设计 | 需详细配置，多维度估算 |

### 1.4 设计原则

- **简单易用**：最少输入，最快输出
- **灵活可调**：支持手动调整和修正
- **透明可查**：指标来源清晰可追溯
- **多维输出**：支持多种报告格式

---

## 2. 估算流程

### 2.1 整体流程

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              估算流程                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Step1  │    │  Step2  │    │  Step3  │    │  Step4  │    │  Step5  │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  │ 项目配置 │ →  │ 单体录入 │ →  │ 指标匹配 │ →  │ 估算调整 │ →  │ 报告输出 │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  基本信息        功能标签        自动匹配        费用构成        多格式    │
│  地区时间        面积规模        手动选择        调整系数        导出      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Step 1: 项目配置

**输入内容：**
```typescript
interface EstimationProject {
  // 基本信息
  projectName: string;           // 项目名称
  projectCode: string;           // 项目编号
  projectType: string;           // 项目类型（医疗/教育/办公等）
  
  // 地区信息
  province: string;              // 省份
  city: string;                  // 城市
  district: string;              // 区县
  
  // 时间信息
  estimationDate: Date;          // 估算基准日期
  targetPriceDate: Date;         // 目标价格基准期
  constructionPeriod: {          // 建设周期
    startDate: Date;
    endDate: Date;
    months: number;
  };
  
  // 估算配置
  estimationType: 'quick' | 'standard' | 'detailed';
  indexVersionId: string;        // 使用的指标版本
  
  // 其他
  description: string;           // 项目描述
  remarks: string;               // 备注
}
```

### 2.3 Step 2: 单体录入

**录入内容：**
```typescript
interface EstimationUnit {
  id: string;
  projectId: string;
  
  // 基本信息
  unitName: string;              // 单体名称
  unitCode: string;              // 单体编号
  
  // 功能标签
  functionTagId: string;         // 功能标签ID
  functionTagCode: string;       // 功能标签编码
  functionTagName: string;       // 功能标签名称
  
  // 面积信息
  totalArea: number;             // 总建筑面积
  aboveGroundArea: number;       // 地上面积
  undergroundArea: number;       // 地下面积
  aboveGroundFloors: number;     // 地上层数
  undergroundFloors: number;     // 地下层数
  
  // 功能规模（可选）
  functionalScale?: number;      // 功能规模数值
  functionalUnit?: string;       // 功能规模单位
  
  // 结构信息（可选）
  structureType?: string;        // 结构类型
  foundationType?: string;       // 基础类型
  
  // 规模分档（自动计算）
  scaleTypeCode: string;
  scaleRangeCode: string;
  scaleRangeName: string;
  
  // 排序
  sortOrder: number;
}
```

### 2.4 Step 3: 指标匹配

**匹配逻辑：**
```typescript
interface IndexMatchResult {
  unitId: string;
  
  // 匹配到的指标
  matchedIndexes: MatchedIndex[];
  
  // 匹配状态
  matchStatus: 'full' | 'partial' | 'none';
  matchMessage: string;
  
  // 缺失项
  missingDimensions: string[];
}

interface MatchedIndex {
  // 维度信息
  spaceCode: string;
  spaceName: string;
  professionCode: string;
  professionName: string;
  
  // 匹配的指标
  indexId: string;
  matchLevel: 1 | 2 | 3 | 4;     // 匹配层级
  matchConfidence: number;       // 匹配置信度
  
  // 指标值
  recommendedLow: number;
  recommendedMid: number;
  recommendedHigh: number;
  sampleCount: number;
  qualityLevel: string;
  
  // 选用值
  selectedValue: number;         // 选用的单方
  selectedLevel: 'low' | 'mid' | 'high' | 'custom';
  
  // 计算结果
  area: number;                  // 计算面积
  estimatedCost: number;         // 估算造价
}
```

**匹配算法：**
```typescript
function matchIndexes(unit: EstimationUnit): IndexMatchResult {
  const results: MatchedIndex[] = [];
  
  // 获取空间列表
  const spaces = unit.undergroundArea > 0 
    ? ['DS', 'DX'] 
    : ['DS'];
  
  // 获取适用的专业列表
  const professions = getApplicableProfessions(unit.functionTagCode, spaces);
  
  // 逐个匹配
  for (const space of spaces) {
    for (const profession of professions) {
      const index = findBestMatchIndex({
        functionTagCode: unit.functionTagCode,
        spaceCode: space,
        professionCode: profession,
        scaleRangeCode: unit.scaleRangeCode
      });
      
      if (index) {
        results.push({
          spaceCode: space,
          spaceName: getSpaceName(space),
          professionCode: profession,
          professionName: getProfessionName(profession),
          indexId: index.id,
          matchLevel: index.matchLevel,
          matchConfidence: index.confidence,
          recommendedLow: index.recommendedLow,
          recommendedMid: index.recommendedMid,
          recommendedHigh: index.recommendedHigh,
          sampleCount: index.sampleCount,
          qualityLevel: index.qualityLevel,
          selectedValue: index.recommendedMid,
          selectedLevel: 'mid',
          area: space === 'DS' ? unit.aboveGroundArea : unit.undergroundArea,
          estimatedCost: 0 // 后续计算
        });
      }
    }
  }
  
  // 计算估算造价
  results.forEach(r => {
    r.estimatedCost = r.selectedValue * r.area;
  });
  
  return {
    unitId: unit.id,
    matchedIndexes: results,
    matchStatus: determineMatchStatus(results),
    matchMessage: generateMatchMessage(results),
    missingDimensions: findMissingDimensions(results, spaces, professions)
  };
}
```

### 2.5 Step 4: 估算调整

**调整类型：**

| 调整类型 | 说明 | 适用场景 |
|----------|------|----------|
| 指标选择 | 选择低/中/高值 | 风险偏好调整 |
| 自定义单方 | 手动输入单方 | 已知参考价 |
| 调整系数 | 整体乘以系数 | 特殊情况调整 |
| 费用增减 | 增加/扣除费用 | 专项费用调整 |

**调整记录：**
```typescript
interface EstimationAdjustment {
  id: string;
  estimationId: string;
  unitId?: string;               // 单体ID（单体级调整）
  indexId?: string;              // 指标ID（指标级调整）
  
  // 调整类型
  adjustType: 'select_level' | 'custom_value' | 'coefficient' | 'amount';
  
  // 调整内容
  beforeValue: number;
  afterValue: number;
  adjustFactor?: number;         // 调整系数
  adjustAmount?: number;         // 调整金额
  
  // 原因
  adjustReason: string;
  
  // 操作人
  adjustedBy: string;
  adjustedAt: Date;
}
```

### 2.6 Step 5: 报告输出

**报告类型：**

| 报告类型 | 格式 | 说明 |
|----------|------|------|
| 估算汇总表 | Excel/PDF | 单体汇总 |
| 分部估算表 | Excel/PDF | 空间×专业明细 |
| 指标对比表 | Excel | 使用的指标明细 |
| 估算报告 | Word/PDF | 完整估算报告 |

---

## 3. 数据模型

### 3.1 估算项目表 (estimation_project)

```typescript
interface EstimationProjectEntity {
  id: string;
  
  // 基本信息
  projectName: string;
  projectCode: string;
  projectType: string;
  
  // 地区
  province: string;
  city: string;
  district: string;
  
  // 时间
  estimationDate: Date;
  targetPriceDate: Date;
  constructionStartDate: Date;
  constructionEndDate: Date;
  constructionMonths: number;
  
  // 配置
  estimationType: 'quick' | 'standard' | 'detailed';
  indexVersionId: string;
  indexVersionCode: string;
  
  // 汇总数据
  totalArea: number;             // 总建筑面积
  totalCost: number;             // 总估算造价
  unitCost: number;              // 综合单方
  unitCount: number;             // 单体数量
  
  // 状态
  status: 'draft' | 'calculating' | 'completed' | 'archived';
  
  // 备注
  description: string;
  remarks: string;
  
  // 系统字段
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
```

### 3.2 估算单体表 (estimation_unit)

```typescript
interface EstimationUnitEntity {
  id: string;
  projectId: string;
  
  // 基本信息
  unitName: string;
  unitCode: string;
  sortOrder: number;
  
  // 功能标签
  functionTagId: string;
  functionTagCode: string;
  functionTagName: string;
  functionCategory: string;
  
  // 面积
  totalArea: number;
  aboveGroundArea: number;
  undergroundArea: number;
  aboveGroundFloors: number;
  undergroundFloors: number;
  
  // 功能规模
  functionalScale: number;
  functionalUnit: string;
  
  // 规模分档
  scaleTypeCode: string;
  scaleRangeCode: string;
  scaleRangeName: string;
  
  // 结构信息
  structureType: string;
  foundationType: string;
  
  // 估算结果
  totalCost: number;             // 总估算造价
  unitCost: number;              // 综合单方
  aboveGroundCost: number;       // 地上造价
  undergroundCost: number;       // 地下造价
  
  // 匹配状态
  matchStatus: 'full' | 'partial' | 'none';
  matchMessage: string;
  
  // 系统字段
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 估算明细表 (estimation_detail)

```typescript
interface EstimationDetailEntity {
  id: string;
  projectId: string;
  unitId: string;
  
  // 维度
  spaceCode: string;
  spaceName: string;
  professionCode: string;
  professionName: string;
  
  // 匹配指标
  indexId: string;
  matchLevel: number;
  matchConfidence: number;
  
  // 指标值
  recommendedLow: number;
  recommendedMid: number;
  recommendedHigh: number;
  sampleCount: number;
  qualityLevel: string;
  
  // 选用值
  selectedValue: number;
  selectedLevel: 'low' | 'mid' | 'high' | 'custom';
  
  // 调整
  adjustFactor: number;          // 调整系数，默认1
  adjustedValue: number;         // 调整后单方
  
  // 计算结果
  area: number;
  estimatedCost: number;
  costRatio: number;             // 占单体总造价比例
  
  // 系统字段
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.4 估算方案表 (estimation_scheme)

```typescript
interface EstimationScheme {
  id: string;
  projectId: string;
  
  // 方案信息
  schemeName: string;            // 方案名称
  schemeCode: string;            // 方案编号
  isBaseline: boolean;           // 是否基准方案
  
  // 方案配置
  valueLevel: 'low' | 'mid' | 'high'; // 整体取值水平
  globalAdjustFactor: number;    // 整体调整系数
  
  // 方案结果
  totalArea: number;
  totalCost: number;
  unitCost: number;
  
  // 与基准对比
  costDiffFromBaseline: number;  // 与基准差额
  costDiffRatio: number;         // 与基准差异率
  
  // 说明
  description: string;
  
  // 系统字段
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. 界面规范

### 4.1 估算主界面

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  投资估算 > XX市人民医院项目                    [保存] [计算] [导出报告 ▼]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ 项目信息 ────────────────────────────────────────────────────────────┐ │
│  │  项目名称：XX市人民医院  |  地区：四川省成都市  |  价格基准：2026年1月  │ │
│  │  估算类型：标准估算      |  指标版本：2026.01   |  状态：已完成        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ 估算汇总 ────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │  总建筑面积  │  │  总估算造价  │  │  综合单方   │  │  单体数量   │   │ │
│  │  │  85,000 m²  │  │  4.52 亿元  │  │  5,318 元  │  │    6 个    │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ 单体列表 ──────────────────────────────────────────────────────────┐   │
│  │                                                      [+ 添加单体]    │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ 序号│ 单体名称  │ 功能标签  │ 面积(m²) │ 估算造价(万元)│ 单方  │ │   │
│  │  │ ───┼──────────┼──────────┼─────────┼─────────────┼──────│ │   │
│  │  │  1 │ 门诊楼    │ 门诊      │ 25,000  │   13,250    │ 5,300│ │   │
│  │  │  2 │ 住院楼    │ 住院-普通  │ 35,000  │   20,300    │ 5,800│ │   │
│  │  │  3 │ 医技楼    │ 医技      │ 12,000  │    7,440    │ 6,200│ │   │
│  │  │  4 │ 行政楼    │ 办公-普通  │  5,000  │    1,750    │ 3,500│ │   │
│  │  │  5 │ 地下车库  │ 地下车库   │  6,000  │    1,680    │ 2,800│ │   │
│  │  │  6 │ 室外工程  │ 室外      │  2,000  │      780    │ 3,900│ │   │
│  │  │ ───┼──────────┼──────────┼─────────┼─────────────┼──────│ │   │
│  │  │ 合计│          │          │ 85,000  │   45,200    │ 5,318│ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  选中单体：门诊楼                                                            │
│                                                                             │
│  ┌─ 单体估算明细 ────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  功能标签：门诊 (YI-01)  |  规模档：中大型 (1-3万m²)  |  匹配状态：完全  │ │
│  │                                                                        │ │
│  │  空间 │ 专业   │ 面积    │ 低值  │ 中值  │ 高值  │ 选用  │ 造价(万) │  │ │
│  │  ────┼───────┼────────┼──────┼──────┼──────┼──────┼─────────│  │ │
│  │  地上 │ 土建   │ 20,000 │ 3,200│ 3,720│ 4,100│ 3,720│  7,440  │  │ │
│  │  地上 │ 给排水 │ 20,000 │  150 │  180 │  220 │  180 │    360  │  │ │
│  │  地上 │ 强电   │ 20,000 │  180 │  220 │  280 │  220 │    440  │  │ │
│  │  地上 │ 暖通   │ 20,000 │  320 │  380 │  450 │  380 │    760  │  │ │
│  │  地上 │ 消防   │ 20,000 │  150 │  180 │  220 │  180 │    360  │  │ │
│  │  地下 │ 土建   │  5,000 │ 2,200│ 2,650│ 3,000│ 2,650│  1,325  │  │ │
│  │  地下 │ 安装   │  5,000 │  450 │  520 │  600 │  520 │    260  │  │ │
│  │  ────┼───────┼────────┼──────┼──────┼──────┼──────┼─────────│  │ │
│  │  合计 │       │ 25,000 │      │      │      │ 5,300│ 13,250  │  │ │
│  │                                                                        │ │
│  │  💡 点击单方可切换低/中/高值或自定义输入                                 │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 快速估算界面

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  快速估算                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ 输入 ────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  功能类型：[医疗卫生 ▼] - [门诊 ▼]                                      │ │
│  │                                                                        │ │
│  │  建筑面积：[25,000    ] m²                                             │ │
│  │                                                                        │ │
│  │  地下室：  ☑ 有地下室    地下面积：[5,000     ] m²                      │ │
│  │                                                                        │ │
│  │                                              [估算]                    │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ 估算结果 ────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │                    低值          中值          高值                     │ │
│  │                ┌─────────┐  ┌─────────┐  ┌─────────┐                  │ │
│  │  估算造价      │ 1.18亿  │  │ 1.33亿  │  │ 1.50亿  │                  │ │
│  │                └─────────┘  └─────────┘  └─────────┘                  │ │
│  │                                                                        │ │
│  │  综合单方      4,720元/m²    5,300元/m²    6,000元/m²                  │ │
│  │                                                                        │ │
│  │  ───────────────────────────────────────────────────────────────────  │ │
│  │                                                                        │ │
│  │  参考指标：门诊-中大型  |  样本数：28个  |  质量等级：A级               │ │
│  │  价格基准：2026年1月    |  指标版本：2026.01                           │ │
│  │                                                                        │ │
│  │                              [查看指标详情]  [创建详细估算]             │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 方案对比界面

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  方案对比 > XX市人民医院项目                                    [新增方案]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ 方案列表 ────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  方案名称      │ 取值水平 │ 总面积   │ 总造价   │ 综合单方 │ 与基准差异 │ │
│  │  ─────────────┼─────────┼─────────┼─────────┼─────────┼───────────│ │
│  │  ★ 基准方案   │  中值   │ 85,000  │ 4.52亿  │  5,318  │     -     │ │
│  │     保守方案   │  低值   │ 85,000  │ 4.01亿  │  4,718  │  -11.3%   │ │
│  │     乐观方案   │  高值   │ 85,000  │ 5.10亿  │  6,000  │  +12.8%   │ │
│  │     调整方案   │  自定义 │ 85,000  │ 4.75亿  │  5,588  │   +5.1%   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ 对比图表 ────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │   亿元                                                                 │ │
│  │   5.5 │                              ████                              │ │
│  │       │              ████            ████                              │ │
│  │   5.0 │              ████            ████  ████                        │ │
│  │       │  ████        ████            ████  ████                        │ │
│  │   4.5 │  ████        ████            ████  ████                        │ │
│  │       │  ████        ████            ████  ████                        │ │
│  │   4.0 │  ████        ████            ████  ████                        │ │
│  │       └────────────────────────────────────────────                    │ │
│  │         基准方案    保守方案        乐观方案  调整方案                   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ 单体对比 ────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  单体名称 │ 基准方案  │ 保守方案  │ 乐观方案  │ 调整方案  │              │ │
│  │  ────────┼──────────┼──────────┼──────────┼──────────│              │ │
│  │  门诊楼   │  13,250  │  11,800  │  15,000  │  14,000  │              │ │
│  │  住院楼   │  20,300  │  18,060  │  22,900  │  21,000  │              │ │
│  │  医技楼   │   7,440  │   6,600  │   8,400  │   7,800  │              │ │
│  │  ...     │   ...    │   ...    │   ...    │   ...    │              │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 指标匹配策略

### 5.1 匹配优先级

```
Level 4（精确匹配）：功能标签 + 空间 + 专业 + 规模档
   ↓ 未找到
Level 3（忽略规模）：功能标签 + 空间 + 专业 + ALL规模
   ↓ 未找到
Level 2（忽略专业）：功能标签 + 空间 + ALL专业 + ALL规模
   ↓ 未找到
Level 1（仅标签）：功能标签 + ALL + ALL + ALL
   ↓ 未找到
同类平均：功能大类的平均指标
```

### 5.2 匹配回退规则

```typescript
function findBestMatchIndex(criteria: MatchCriteria): CostIndex | null {
  // Level 4: 精确匹配
  let index = findIndex({
    functionTagCode: criteria.functionTagCode,
    spaceCode: criteria.spaceCode,
    professionCode: criteria.professionCode,
    scaleRangeCode: criteria.scaleRangeCode
  });
  if (index) return { ...index, matchLevel: 4, confidence: 1.0 };
  
  // Level 3: 忽略规模
  index = findIndex({
    functionTagCode: criteria.functionTagCode,
    spaceCode: criteria.spaceCode,
    professionCode: criteria.professionCode,
    scaleRangeCode: 'ALL'
  });
  if (index) return { ...index, matchLevel: 3, confidence: 0.85 };
  
  // Level 2: 忽略专业
  index = findIndex({
    functionTagCode: criteria.functionTagCode,
    spaceCode: criteria.spaceCode,
    professionCode: 'ALL',
    scaleRangeCode: 'ALL'
  });
  if (index) return { ...index, matchLevel: 2, confidence: 0.7 };
  
  // Level 1: 仅标签
  index = findIndex({
    functionTagCode: criteria.functionTagCode,
    spaceCode: 'ALL',
    professionCode: 'ALL',
    scaleRangeCode: 'ALL'
  });
  if (index) return { ...index, matchLevel: 1, confidence: 0.5 };
  
  // 未找到
  return null;
}
```

### 5.3 缺失指标处理

| 情况 | 处理策略 |
|------|----------|
| 某专业无指标 | 显示警告，允许手动输入 |
| 某空间无指标 | 使用其他空间的比例推算 |
| 功能标签无指标 | 使用同类平均或提示无法估算 |

---

## 6. API接口

### 6.1 估算项目管理

#### 6.1.1 创建估算项目

```
POST /api/v1/estimations
```

**请求体：**
```json
{
  "projectName": "XX市人民医院",
  "projectType": "YI",
  "province": "四川省",
  "city": "成都市",
  "estimationDate": "2026-01-17",
  "targetPriceDate": "2026-01-01",
  "estimationType": "standard",
  "indexVersionId": "ver-2026-01"
}
```

#### 6.1.2 获取估算项目列表

```
GET /api/v1/estimations
```

#### 6.1.3 获取估算项目详情

```
GET /api/v1/estimations/{projectId}
```

### 6.2 估算单体管理

#### 6.2.1 添加单体

```
POST /api/v1/estimations/{projectId}/units
```

**请求体：**
```json
{
  "unitName": "门诊楼",
  "functionTagCode": "YI-01",
  "totalArea": 25000,
  "aboveGroundArea": 20000,
  "undergroundArea": 5000,
  "aboveGroundFloors": 5,
  "undergroundFloors": 1
}
```

#### 6.2.2 批量添加单体

```
POST /api/v1/estimations/{projectId}/units/batch
```

#### 6.2.3 更新单体

```
PUT /api/v1/estimations/{projectId}/units/{unitId}
```

### 6.3 估算计算

#### 6.3.1 执行指标匹配

```
POST /api/v1/estimations/{projectId}/match
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "projectId": "est-001",
    "matchResults": [
      {
        "unitId": "unit-001",
        "unitName": "门诊楼",
        "matchStatus": "full",
        "matchedCount": 12,
        "missingCount": 0
      }
    ],
    "overallStatus": "complete"
  }
}
```

#### 6.3.2 计算估算结果

```
POST /api/v1/estimations/{projectId}/calculate
```

#### 6.3.3 调整估算值

```
PUT /api/v1/estimations/{projectId}/units/{unitId}/details/{detailId}
```

**请求体：**
```json
{
  "selectedLevel": "high",
  "selectedValue": 4100,
  "adjustFactor": 1.0,
  "adjustReason": "参考类似项目，选用高值"
}
```

### 6.4 快速估算

```
POST /api/v1/estimations/quick
```

**请求体：**
```json
{
  "functionTagCode": "YI-01",
  "totalArea": 25000,
  "aboveGroundArea": 20000,
  "undergroundArea": 5000,
  "targetPriceDate": "2026-01-01"
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "functionTagName": "门诊",
    "scaleRangeName": "中大型",
    "totalArea": 25000,
    "results": {
      "low": { "unitCost": 4720, "totalCost": 118000000 },
      "mid": { "unitCost": 5300, "totalCost": 132500000 },
      "high": { "unitCost": 6000, "totalCost": 150000000 }
    },
    "indexInfo": {
      "indexId": "idx-001",
      "sampleCount": 28,
      "qualityLevel": "A",
      "priceBaseDate": "2026-01-01"
    }
  }
}
```

### 6.5 方案管理

#### 6.5.1 创建方案

```
POST /api/v1/estimations/{projectId}/schemes
```

#### 6.5.2 方案对比

```
GET /api/v1/estimations/{projectId}/schemes/compare
```

### 6.6 报告导出

```
POST /api/v1/estimations/{projectId}/export
```

**请求体：**
```json
{
  "reportType": "summary",
  "format": "excel",
  "schemeIds": ["scheme-001", "scheme-002"]
}
```

---

## 7. 报告模板

### 7.1 估算汇总表

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           投资估算汇总表                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  项目名称：XX市人民医院                                                      │
│  估算日期：2026年1月17日                                                     │
│  价格基准：2026年1月                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  序号 │ 单体名称  │ 功能类型 │ 建筑面积(m²) │ 单方(元/m²) │ 估算造价(万元) │
│  ────┼──────────┼─────────┼─────────────┼────────────┼───────────────│
│   1  │ 门诊楼    │ 门诊     │    25,000   │   5,300    │    13,250     │
│   2  │ 住院楼    │ 住院     │    35,000   │   5,800    │    20,300     │
│   3  │ 医技楼    │ 医技     │    12,000   │   6,200    │     7,440     │
│   4  │ 行政楼    │ 办公     │     5,000   │   3,500    │     1,750     │
│   5  │ 地下车库  │ 车库     │     6,000   │   2,800    │     1,680     │
│   6  │ 室外工程  │ 室外     │     2,000   │   3,900    │       780     │
│  ────┼──────────┼─────────┼─────────────┼────────────┼───────────────│
│  合计│          │         │    85,000   │   5,318    │    45,200     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  编制人：              审核人：              批准人：                        │
│  日  期：              日  期：              日  期：                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 分部估算表

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           分部估算表 - 门诊楼                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  单体名称：门诊楼          功能类型：门诊           规模档：中大型           │
│  建筑面积：25,000m²        地上：20,000m²          地下：5,000m²            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  空间 │ 专业   │ 面积(m²) │ 参考指标(元/m²)  │ 选用单方 │ 估算造价(万元) │
│       │        │          │ 低    中    高   │          │                │
│  ────┼───────┼─────────┼─────────────────┼─────────┼────────────────│
│  地上 │ 土建   │ 20,000  │ 3,200 3,720 4,100│  3,720  │     7,440      │
│  地上 │ 给排水 │ 20,000  │  150   180   220 │   180   │       360      │
│  地上 │ 强电   │ 20,000  │  180   220   280 │   220   │       440      │
│  地上 │ 弱电   │ 20,000  │   80   100   130 │   100   │       200      │
│  地上 │ 暖通   │ 20,000  │  320   380   450 │   380   │       760      │
│  地上 │ 消防   │ 20,000  │  150   180   220 │   180   │       360      │
│  地上 │ 电梯   │ 20,000  │   80   100   120 │   100   │       200      │
│  ────┼───────┼─────────┼─────────────────┼─────────┼────────────────│
│  地上小计     │ 20,000  │                  │  4,880  │     9,760      │
│  ────┼───────┼─────────┼─────────────────┼─────────┼────────────────│
│  地下 │ 土建   │  5,000  │ 2,200 2,650 3,000│  2,650  │     1,325      │
│  地下 │ 给排水 │  5,000  │  100   120   150 │   120   │        60      │
│  地下 │ 强电   │  5,000  │  120   150   180 │   150   │        75      │
│  地下 │ 暖通   │  5,000  │  180   220   260 │   220   │       110      │
│  地下 │ 消防   │  5,000  │  100   120   150 │   120   │        60      │
│  ────┼───────┼─────────┼─────────────────┼─────────┼────────────────│
│  地下小计     │  5,000  │                  │  3,260  │     1,630      │
│  ────┼───────┼─────────┼─────────────────┼─────────┼────────────────│
│  单体合计     │ 25,000  │                  │  4,556  │    11,390      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. 业务规则

### 8.1 项目配置规则

| 规则 | 描述 |
|------|------|
| EP-01 | 项目名称不可为空 |
| EP-02 | 价格基准期不能早于指标版本基准期 |
| EP-03 | 估算类型确定后不可更改 |
| EP-04 | 必须选择有效的指标版本 |

### 8.2 单体录入规则

| 规则 | 描述 |
|------|------|
| EU-01 | 单体必须选择功能标签 |
| EU-02 | 总面积 = 地上面积 + 地下面积 |
| EU-03 | 面积精度保留两位小数 |
| EU-04 | 单体名称在项目内唯一 |

### 8.3 估算计算规则

| 规则 | 描述 |
|------|------|
| EC-01 | 估算造价 = 面积 × 单方 × 调整系数 |
| EC-02 | 调整系数默认为1，范围0.5-2.0 |
| EC-03 | 自定义单方需填写调整原因 |
| EC-04 | 匹配置信度低于0.7时显示警告 |

### 8.4 方案规则

| 规则 | 描述 |
|------|------|
| ES-01 | 每个项目至少有一个基准方案 |
| ES-02 | 基准方案不可删除 |
| ES-03 | 方案最多10个 |
| ES-04 | 方案名称在项目内唯一 |

---

## 9. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |


这份 **Estimation Spec V1.0** 已经非常能落地（**9.2/10**）：流程、数据模型、匹配回退、方案对比、报表模板、API 都齐了，基本可以直接开工做“估算工作台”。

要补的关键，是把它跟你前面 **Index Publish / ReleaseContext / STR 标准值库**真正打通：

* 估算不是直接去查 `cost_index`，而应该查 **已发布的 STR（P25/P50/P75）**，否则“发布”就失去意义；
* 估算会话必须冻结版本口径（你已经有 indexVersionId，但还缺 `libraryVersionCode/priceBaseDate/stage/regionLevel` 的冻结字段）；
* 缺失指标时的“用比例推算/同类平均”要有明确的 **Fallback 规则与可解释来源**，否则就会被质疑“凭感觉”。

我给你一段 **V1.1 Patch 章节**（可直接贴到本 Spec 末尾），把这些硬约束钉死。

---

# V1.1 Patch：用 STR 作为唯一指标源、冻结口径、可解释匹配、缺失推算规则

> **目标**：让估算模块成为“发布后的指标消费端”，并保证估算结果可追溯、可复现、可审计。

---

## 10. 指标数据源统一（MUST）：估算只消费 STR（Standard Target Range）

### 10.1 规则

* 估算匹配**默认只查询 `STR` 中 `status=ACTIVE` 的记录**（即已发布版本写回的标准值）。
* `cost_index` 仅用于内部计算过程与审核，不作为估算直接数据源（除非用户显式选择“使用草稿指标”调试模式）。

### 10.2 STR 查询维度（必须一致）

估算匹配条件必须包含：

* `functionTagCode`（主标签）
* `spaceCode`
* `professionCode`
* `scaleTypeCode + scaleRangeCode`
* `regionCode`（按 regionLevel 取省/市/区）
* `stage`
* `priceBaseDate`
* `libraryVersionCode`（来自发布口径身份证）

---

## 11. 估算会话冻结口径（MUST）

你已有 `indexVersionId/indexVersionCode`，需要补齐发布口径身份证字段，保证“进行中估算不受发布影响”。

### 11.1 EstimationProjectEntity 增补字段

```typescript
interface EstimationProjectEntity {
  // ... existing fields

  // 冻结的发布口径（来自 IndexVersion.releaseContext）
  libraryVersionCode: string;
  stage: 'ESTIMATE' | 'TENDER' | 'SETTLEMENT';
  priceBaseDate: string;                // "2026-01"
  regionLevel: 'province' | 'city' | 'district';

  // 规则快照（可选但推荐，用于审计）
  mappingSnapshotVersion?: number;
  scaleSnapshotVersion?: number;
}
```

**规则（MUST）**

* 创建估算项目时，从所选 `indexVersionId` 读取 `releaseContext`，写入上述冻结字段。
* 估算项目 `status=completed` 后，冻结字段不可更改；升级版本必须走“新方案/新项目”或“版本迁移记录”。

---

## 12. 匹配算法升级：Level 回退 + 可解释 Reason（MUST）

你现在的 `findBestMatchIndex()` 返回 index + matchLevel/confidence，但缺少“为什么回退”。补齐：

```typescript
interface MatchExplain {
  triedLevels: { level: number; hit: boolean; reason?: string }[];
  finalLevel: 1 | 2 | 3 | 4;
  reason: string;                 // 例如：L4缺失规模档，回退到L3
  usedDimensions: Record<string, string>; // 最终使用的维度值（含ALL）
  source: 'STR_ACTIVE' | 'DRAFT_INDEX' | 'MANUAL_INPUT' | 'DERIVED';
}
```

并要求每条 `EstimationDetailEntity` 增加：

* `matchExplain: MatchExplain`（或拆字段存）

这样用户点“匹配层级 3”就能看到解释，不会被质疑。

---

## 13. 缺失指标处理：推算规则写死（MUST）

你在 5.3 写了“使用其他空间比例推算/同类平均”，但需要明确推算的数学口径与来源。

### 13.1 空间缺失推算（DS ↔ DX）

当 `DX` 指标缺失但 `DS` 存在（或反之）：

* 首选：使用同功能标签同专业的 **空间比例基准**（来自已发布 STR 的 ratio 指标）

  * 例如：`DX_TJ_cost_per_m2 = DS_TJ_cost_per_m2 × k_dx_ds`
* `k_dx_ds` 的来源优先级：

  1. 同功能标签 + 同规模档 + 同地区 的历史比例（published STR 中专门存一个 `SPACE_RATIO` 指标）
  2. 同功能大类的比例
  3. 全库通用比例（最后兜底）

**必须记录 source=DERIVED + 推算链路**（在 matchExplain 里）。

### 13.2 专业缺失推算（按“专业占比”拆分）

当某专业缺失但“合计”存在：

* 首选：用同功能标签的 **专业占比基准**（published STR 中存 `PROFESSION_RATIO`）拆分：

  * `cost_prof = total_cost × ratio_prof`
  * `unitCost_prof = cost_prof / area(spaceDenominator)`
* 仍缺：回退到功能大类占比，再回退全库通用占比。

> 这两条一旦落库，估算就从“凭经验”变成“有基准的推算”。

---

## 14. 选用值策略：low/mid/high 不只是数值，还要绑定风险偏好（SHOULD）

建议在项目级或方案级增加：

* `riskPreference: 'conservative' | 'neutral' | 'aggressive'`

默认映射：

* conservative → 选 `recommendedHigh`
* neutral → 选 `recommendedMid`
* aggressive → 选 `recommendedLow`

并在报告里明确：本方案的风险口径是什么。

---

## 15. 估算结果的可追溯性（MUST）

每条 `EstimationDetailEntity` 必须保存：

* `strId`（匹配到的 STR 记录ID）
* `indexVersionId/indexVersionCode`
* `libraryVersionCode/priceBaseDate/stage/regionLevel`
* 若为推算：保存 `derivedFromStrIds[]` 与推算公式摘要

这样导出报告可以把“依据哪些指标”写得非常清楚。

---

## 16. API 补齐：按 STR 匹配（推荐新增）

### 16.1 匹配接口回参增强

`POST /estimations/{projectId}/match` 响应中补充：

* 每个明细的 `strId`、`matchExplain`、`source`（STR_ACTIVE/DERIVED/MANUAL）

### 16.2 快速估算接口：明确来源

`POST /estimations/quick` 响应中的 `indexInfo` 改为：

* `strId`
* `indexVersionCode`
* `libraryVersionCode`
* `stage`
* `priceBaseDate`
* `regionLevel`

---

## 17. V1.1 Changelog

| 版本   | 日期         | 修订内容                                                                                           |
| ---- | ---------- | ---------------------------------------------------------------------------------------------- |
| V1.1 | 2026-01-17 | 估算默认消费已发布 STR；估算会话冻结 ReleaseContext；匹配回退增加可解释 matchExplain；缺失指标推算规则写死并记录推算链路；明细保存 strId 与口径身份证 |

---

## 你这份 V1.0 我建议立刻改的两处“小但致命”

1. **指标匹配数据源**：把 `findIndex()` 的表从 `cost_index` 切换为 `STR(active)`
2. **估算项目字段**：补上 `libraryVersionCode/priceBaseDate/stage/regionLevel`，否则“新版本发布不影响进行中估算”无法保证

---

如果你愿意，我还能给你把“专业占比/空间比例”这两类 **推算用基准指标**在 STR 里怎么存（metricCode 设计 + 计算方式）也补一页 Spec，这样估算端的 “DERIVED” 就完全闭环了。
