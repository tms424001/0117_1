# 标签化处理流程规范 (Tagging Process Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：04_Data_Tagging

---

## 1. 概述

### 1.1 目的
标签化处理是将导入的原始造价数据转化为结构化指标数据的关键环节，通过：
- 识别和创建单体
- 为单体分配功能标签
- 将造价数据按空间和专业归集
- 为后续指标计算提供标准化数据

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
| 单体 | 具有独立功能、独立核算的建筑物或构筑物 |
| 标签化 | 为单体分配功能标签的过程 |
| 造价归集 | 将原始清单数据按空间和专业维度汇总 |
| 智能识别 | 系统自动识别单体边界和推荐标签 |

### 1.4 设计原则

- **准确性**：确保标签分配和数据归集的准确性
- **高效性**：智能推荐减少人工操作
- **可追溯**：记录完整的处理过程
- **可校验**：支持数据校验和异常提示

---

## 2. 处理流程

### 2.1 整体流程图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            标签化处理流程                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Step1  │    │  Step2  │    │  Step3  │    │  Step4  │    │  Step5  │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  │ 单体识别 │ →  │ 标签分配 │ →  │ 面积录入 │ →  │ 造价归集 │ →  │ 校验确认 │  │
│  │         │    │         │    │         │    │         │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │自动识别  │    │智能推荐  │    │自动提取  │    │自动映射  │    │规则校验  │  │
│  │手动调整  │    │手动选择  │    │手动输入  │    │手动调整  │    │人工确认  │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 详细流程说明

#### Step 1: 单体识别

**输入：** 已导入的原始造价数据（工程列表树）

**处理：**
1. 解析原始数据的层级结构
2. 识别一级节点作为候选单体
3. 智能判断是否需要拆分或合并
4. 生成单体列表供用户确认

**输出：** 单体列表（待确认）

**自动识别规则：**
```typescript
// 单体识别规则
const unitIdentifyRules = [
  // 规则1：一级节点通常是单体
  { level: 1, action: 'create_unit' },
  
  // 规则2：包含"楼"、"房"、"馆"等关键字的节点
  { keywords: ['楼', '房', '馆', '中心', '用房'], action: 'create_unit' },
  
  // 规则3：室外/总平单独作为一个单体
  { keywords: ['室外', '总平', '总坪', '场地'], action: 'create_unit', tag: 'SW' },
  
  // 规则4：多个同类节点可能需要合并
  { pattern: /(\d+)#/, action: 'suggest_merge' }
];
```

#### Step 2: 标签分配

**输入：** 已识别的单体列表

**处理：**
1. 根据单体名称智能推荐功能标签
2. 用户确认或手动选择标签
3. 记录标签分配结果

**输出：** 带功能标签的单体列表

**智能推荐逻辑：**
```typescript
function recommendTags(unitName: string): TagRecommendation[] {
  const recommendations: TagRecommendation[] = [];
  
  // 1. 关键字匹配
  const keywordMatches = matchByKeywords(unitName);
  recommendations.push(...keywordMatches);
  
  // 2. 历史数据学习（同名单体曾用标签）
  const historyMatches = matchByHistory(unitName);
  recommendations.push(...historyMatches);
  
  // 3. 项目类型推断（根据项目类型推荐常见标签）
  const projectTypeMatches = matchByProjectType(projectType, unitName);
  recommendations.push(...projectTypeMatches);
  
  // 4. 按置信度排序
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}
```

#### Step 3: 面积录入

**输入：** 带标签的单体列表

**处理：**
1. 尝试从原始数据提取面积信息
2. 用户补充或修正面积数据
3. 校验面积数据的合理性

**输出：** 带面积信息的单体列表

**面积数据结构：**
```typescript
interface UnitArea {
  totalArea: number;           // 总建筑面积
  aboveGroundArea: number;     // 地上面积
  undergroundArea: number;     // 地下面积
  aboveGroundFloors: number;   // 地上层数
  undergroundFloors: number;   // 地下层数
  
  // 功能规模（可选）
  functionalScale?: number;    // 功能规模数值
  functionalUnit?: string;     // 功能规模单位
}
```

#### Step 4: 造价归集

**输入：** 带面积的单体列表 + 原始造价数据

**处理：**
1. 识别原始数据的空间属性（地上/地下/室外）
2. 识别原始数据的专业属性
3. 按空间×专业维度汇总造价
4. 计算单方指标

**输出：** 单体造价明细（空间×专业矩阵）

**归集算法：**
```typescript
function aggregateCost(unit: BuildingUnit, originalData: OriginalBill[]): UnitCostDetail[] {
  const details: UnitCostDetail[] = [];
  
  // 筛选属于该单体的原始数据
  const unitBills = originalData.filter(bill => 
    bill.level1 === unit.originalLevel1
  );
  
  // 按专业分组
  const professionGroups = groupBy(unitBills, bill => {
    // 自动映射专业
    const mapping = autoMapProfession(bill.level2);
    return mapping.professionCode;
  });
  
  // 按空间分组并汇总
  for (const [profCode, bills] of Object.entries(professionGroups)) {
    // 识别空间
    const spaceGroups = groupBy(bills, bill => {
      const spaceMapping = autoMapSpace(bill.level2, bill.path);
      return spaceMapping.spaceCode;
    });
    
    for (const [spaceCode, spaceBills] of Object.entries(spaceGroups)) {
      const totalCost = sum(spaceBills, 'totalPrice');
      const area = getAreaBySpace(unit, spaceCode);
      
      details.push({
        spaceCode,
        professionCode: profCode,
        cost: totalCost,
        area: area,
        unitCost: area > 0 ? totalCost / area : 0
      });
    }
  }
  
  return details;
}
```

#### Step 5: 校验确认

**输入：** 完成归集的单体数据

**处理：**
1. 执行数据完整性校验
2. 执行数据合理性校验
3. 标记异常数据
4. 用户确认或修正

**输出：** 已确认的标签化数据

**校验规则：**
```typescript
const validationRules = [
  // 完整性校验
  { rule: 'required_tag', message: '单体必须分配功能标签' },
  { rule: 'required_area', message: '单体必须录入建筑面积' },
  { rule: 'required_cost', message: '单体必须有造价数据' },
  
  // 合理性校验
  { rule: 'area_range', min: 10, max: 500000, message: '面积超出合理范围' },
  { rule: 'unit_cost_range', min: 500, max: 50000, message: '单方造价超出合理范围' },
  { rule: 'cost_sum_match', tolerance: 0.01, message: '造价汇总与原始数据不符' },
  
  // 逻辑校验
  { rule: 'space_area_match', message: '地上+地下面积应等于总面积' },
  { rule: 'profession_space_valid', message: '专业与空间组合无效' }
];
```

---

## 3. 数据模型

### 3.1 单体表 (building_unit)

```typescript
interface BuildingUnit {
  id: string;                    // 主键UUID
  projectId: string;             // 所属项目ID
  
  // 基本信息
  unitCode: string;              // 单体编码（项目内唯一）
  unitName: string;              // 单体名称（原始）
  standardName: string;          // 标准名称（规范化后）
  
  // 功能标签
  functionTagId: string;         // 功能标签ID
  functionTagCode: string;       // 功能标签编码
  functionTagName: string;       // 功能标签名称
  functionCategory: string;      // 功能大类
  
  // 规模信息
  totalArea: number;             // 总建筑面积（m²）
  aboveGroundArea: number;       // 地上面积（m²）
  undergroundArea: number;       // 地下面积（m²）
  aboveGroundFloors: number;     // 地上层数
  undergroundFloors: number;     // 地下层数
  buildingHeight: number;        // 建筑高度（m）
  
  // 功能规模
  functionalScale: number;       // 功能规模数值
  functionalUnit: string;        // 功能规模单位
  
  // 规模分档
  scaleTypeCode: string;         // 分档类型编码
  scaleRangeCode: string;        // 规模档位编码
  scaleRangeName: string;        // 规模档位名称
  
  // 结构信息
  structureType: string;         // 结构类型
  foundationType: string;        // 基础类型
  
  // 造价汇总
  totalCost: number;             // 总造价（元）
  unitCost: number;              // 综合单方造价（元/m²）
  
  // 原始数据关联
  originalLevel1: string;        // 对应原始一级节点
  originalBillIds: string[];     // 关联的原始清单ID列表
  
  // 处理状态
  status: 'pending' | 'tagging' | 'aggregating' | 'validating' | 'completed' | 'error';
  
  // 标签化信息
  taggedBy: string;              // 标签操作人
  taggedAt: Date;                // 标签时间
  tagMethod: 'auto' | 'manual';  // 标签方式
  tagConfidence: number;         // 标签置信度（自动时）
  
  // 审计字段
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  
  // 备注
  remarks: string;
}
```

### 3.2 单体造价明细表 (unit_cost_detail)

```typescript
interface UnitCostDetail {
  id: string;                    // 主键UUID
  buildingUnitId: string;        // 所属单体ID
  projectId: string;             // 所属项目ID
  
  // 空间分类（一级子目）
  spaceCode: string;             // 空间编码：DS/DX/SW/QT
  spaceName: string;             // 空间名称
  
  // 专业分类（二级子目）
  professionCode: string;        // 专业编码
  professionName: string;        // 专业名称
  professionGroup: string;       // 专业分组：BUILD/INSTALL/OUTDOOR
  
  // 造价数据
  cost: number;                  // 造价金额（元）
  area: number;                  // 计算面积（m²）
  unitCost: number;              // 单方造价（元/m²）
  
  // 费用构成（可选）
  laborCost: number;             // 人工费
  materialCost: number;          // 材料费
  machineryCost: number;         // 机械费
  managementCost: number;        // 管理费
  profit: number;                // 利润
  
  // 占比
  costRatio: number;             // 占单体总造价比例（%）
  
  // 映射信息
  mappingConfidence: number;     // 映射置信度
  mappingMethod: 'auto' | 'manual'; // 映射方式
  originalProfession: string;    // 原始专业名称
  
  // 关联原始数据
  originalBillIds: string[];     // 关联的原始清单ID
  
  // 审计字段
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 标签化任务表 (tagging_task)

```typescript
interface TaggingTask {
  id: string;                    // 主键UUID
  projectId: string;             // 项目ID
  
  // 任务信息
  taskName: string;              // 任务名称
  taskType: 'full' | 'partial'; // 任务类型：全量/部分
  
  // 进度
  totalUnits: number;            // 总单体数
  completedUnits: number;        // 已完成数
  errorUnits: number;            // 异常数
  progress: number;              // 进度百分比
  
  // 状态
  status: 'pending' | 'processing' | 'paused' | 'completed' | 'error';
  
  // 时间
  startedAt: Date;
  completedAt: Date;
  
  // 操作人
  assignedTo: string;
  
  // 审计
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}
```

### 3.4 标签化日志表 (tagging_log)

```typescript
interface TaggingLog {
  id: string;
  taskId: string;                // 任务ID
  buildingUnitId: string;        // 单体ID
  
  // 操作信息
  action: 'create_unit' | 'assign_tag' | 'input_area' | 'aggregate' | 'validate' | 'confirm';
  actionName: string;            // 操作名称
  
  // 变更内容
  beforeValue: any;              // 变更前值
  afterValue: any;               // 变更后值
  
  // 操作结果
  success: boolean;
  errorMessage: string;
  
  // 操作人
  operatedBy: string;
  operatedAt: Date;
}
```

---

## 4. 状态机

### 4.1 单体状态流转

```
                    ┌──────────────┐
                    │   pending    │ 待处理
                    └──────┬───────┘
                           │ 开始标签化
                           ▼
                    ┌──────────────┐
         ┌─────────│   tagging    │ 标签中
         │         └──────┬───────┘
         │                │ 完成标签分配
         │                ▼
         │         ┌──────────────┐
         │         │ aggregating  │ 归集中
         │         └──────┬───────┘
         │                │ 完成造价归集
         │                ▼
         │         ┌──────────────┐
         │         │  validating  │ 校验中
         │         └──────┬───────┘
         │                │
         │       ┌────────┴────────┐
         │       │                 │
         │  校验通过           校验失败
         │       │                 │
         │       ▼                 ▼
         │ ┌──────────────┐ ┌──────────────┐
         │ │  completed   │ │    error     │
         │ │    已完成    │ │    异常      │
         │ └──────────────┘ └──────┬───────┘
         │                         │
         │                    修正后重试
         └─────────────────────────┘
```

### 4.2 项目状态流转

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  draft   │ →  │  tagged  │ →  │calculated│ →  │ published│
│  已导入  │    │ 已标签化  │    │ 已计算   │    │  已发布  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 5. UI界面规范

### 5.1 标签化主界面布局

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  标签化处理 > [项目名称]                              [保存] [校验] [完成]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  进度：████████████████░░░░ 80% (8/10)    异常：1    用时：00:15:30         │
│                                                                             │
├───────────────────────────────┬─────────────────────────────────────────────┤
│                               │                                             │
│  ┌─ 原始工程列表 ───────────┐ │  ┌─ 单体配置 ─────────────────────────────┐ │
│  │                          │ │  │                                        │ │
│  │ ☑ 幼儿园用房         ★  │ │  │  单体名称：幼儿园用房                   │ │
│  │   ├─ 建筑与装饰工程     │ │  │                                        │ │
│  │   ├─ 给排水工程         │ │  │  功能标签：                             │ │
│  │   ├─ 强电工程           │ │  │  [教育 ▼] - [活动-幼儿 ▼]              │ │
│  │   ├─ 弱电工程           │ │  │  💡 推荐：活动-幼儿(98%)                │ │
│  │   ├─ 暖通工程           │ │  │                                        │ │
│  │   ├─ 消防工程           │ │  │  ┌─ 面积信息 ─────────────────────┐    │ │
│  │   ├─ 电梯工程           │ │  │  │ 总面积：[6452.77  ] m²         │    │ │
│  │   ├─ 光伏发电工程       │ │  │  │ 地上：  [5452.77  ] m² 层数：[3]│    │ │
│  │   └─ 土石方及地基处理   │ │  │  │ 地下：  [1000.00  ] m² 层数：[1]│    │ │
│  │                          │ │  │  │ 功能规模：[12] 班              │    │ │
│  │ ☑ 门房              ★  │ │  │  └─────────────────────────────────┘    │ │
│  │   ├─ 建筑与装饰工程     │ │  │                                        │ │
│  │   └─ 消防工程           │ │  │  ┌─ 造价归集 ─────────────────────┐    │ │
│  │                          │ │  │  │空间│专业    │金额(万)│单方 │% │    │ │
│  │ ☑ 室外总平          ○  │ │  │  │地上│土建    │2430.32│4459│70│    │ │
│  │   ├─ 土建工程           │ │  │  │地上│给排水  │ 120.50│ 221│ 3│    │ │
│  │   ├─ 园林绿化工程       │ │  │  │地上│强电    │ 150.80│ 277│ 4│    │ │
│  │   ├─ 总坪给排水工程     │ │  │  │地上│暖通    │  95.00│ 174│ 3│    │ │
│  │   ├─ 总坪消防水工程     │ │  │  │地上│消防    │ 180.20│ 330│ 5│    │ │
│  │   ├─ 总坪强弱电工程     │ │  │  │地下│土建    │ 280.00│ 280│ 8│    │ │
│  │   └─ 总坪景观水电工程   │ │  │  │... │...     │...    │... │..│    │ │
│  │                          │ │  │  │合计│        │3490.69│5409│  │    │ │
│  └──────────────────────────┘ │  │  └─────────────────────────────────┘    │ │
│                               │  │                                        │ │
│  图例：★ 已完成 ○ 处理中 ✕ 异常 │  │  ⚠ 提示：总面积与分项面积不符          │ │
│                               │  └────────────────────────────────────────┘ │
│                               │                                             │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

### 5.2 组件说明

#### 5.2.1 原始工程列表 (OriginalBillTree)

**功能：**
- 展示导入的原始数据树结构
- 支持勾选单体边界
- 显示处理状态图标

**属性：**
```typescript
interface OriginalBillTreeProps {
  projectId: string;
  data: TreeNode[];
  selectedUnitId?: string;
  onSelectUnit?: (unitId: string) => void;
  onCheckChange?: (checkedKeys: string[]) => void;
}
```

#### 5.2.2 单体配置面板 (UnitConfigPanel)

**功能：**
- 编辑单体基本信息
- 分配功能标签
- 录入面积信息
- 查看/调整造价归集

**属性：**
```typescript
interface UnitConfigPanelProps {
  unit: BuildingUnit;
  costDetails: UnitCostDetail[];
  onChange?: (unit: BuildingUnit) => void;
  onCostDetailChange?: (details: UnitCostDetail[]) => void;
  readOnly?: boolean;
}
```

#### 5.2.3 造价归集表格 (CostAggregationTable)

**功能：**
- 展示空间×专业的造价矩阵
- 支持手动调整映射
- 显示单方指标和占比

**属性：**
```typescript
interface CostAggregationTableProps {
  unitId: string;
  details: UnitCostDetail[];
  totalArea: number;
  aboveGroundArea: number;
  undergroundArea: number;
  editable?: boolean;
  onChange?: (details: UnitCostDetail[]) => void;
}
```

#### 5.2.4 标签推荐组件 (TagRecommendation)

**功能：**
- 显示智能推荐的标签列表
- 显示置信度
- 一键应用推荐

**属性：**
```typescript
interface TagRecommendationProps {
  unitName: string;
  projectType?: string;
  onSelect?: (tag: FunctionTag) => void;
  maxCount?: number;
}
```

### 5.3 交互流程

#### 5.3.1 单体识别交互

```
用户操作                          系统响应
─────────────────────────────────────────────────────
1. 进入标签化页面           →    加载原始数据树
                                 自动识别单体边界
                                 生成单体列表

2. 查看自动识别结果         →    高亮显示识别的单体
                                 显示推荐的功能标签

3. 调整单体边界             →    支持勾选/取消一级节点
   (可选)                        重新计算单体造价

4. 合并/拆分单体            →    提供合并/拆分操作
   (可选)                        更新单体列表
```

#### 5.3.2 标签分配交互

```
用户操作                          系统响应
─────────────────────────────────────────────────────
1. 选择一个单体             →    显示单体配置面板
                                 显示推荐标签列表

2. 查看推荐标签             →    显示标签名称+置信度
                                 高亮最佳推荐

3. 选择标签                 →    更新单体标签
   (推荐或手动)                  自动填充默认空间
                                 触发规模分档计算

4. 确认标签                 →    保存标签分配
                                 更新处理进度
```

#### 5.3.3 造价归集交互

```
用户操作                          系统响应
─────────────────────────────────────────────────────
1. 完成标签分配后           →    自动执行造价归集
                                 显示归集结果表格

2. 查看归集结果             →    显示空间×专业矩阵
                                 显示映射置信度

3. 调整映射                 →    支持修改空间/专业
   (可选)                        重新计算单方指标

4. 确认归集结果             →    保存归集数据
                                 执行数据校验
```

---

## 6. API接口

### 6.1 获取项目单体列表

```
GET /api/v1/projects/{projectId}/units
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "projectId": "proj-001",
    "projectName": "新津区某幼儿园项目",
    "totalUnits": 3,
    "completedUnits": 2,
    "units": [
      {
        "id": "unit-001",
        "unitCode": "U001",
        "unitName": "幼儿园用房",
        "functionTagCode": "JY-18",
        "functionTagName": "活动-幼儿",
        "totalArea": 6452.77,
        "totalCost": 34906889.81,
        "unitCost": 5409.60,
        "status": "completed"
      }
    ]
  }
}
```

### 6.2 创建单体

```
POST /api/v1/projects/{projectId}/units
```

**请求体：**
```json
{
  "unitName": "幼儿园用房",
  "originalLevel1": "幼儿园用房",
  "functionTagId": "tag-jy-18",
  "totalArea": 6452.77,
  "aboveGroundArea": 5452.77,
  "undergroundArea": 1000
}
```

### 6.3 更新单体

```
PUT /api/v1/projects/{projectId}/units/{unitId}
```

### 6.4 获取单体造价明细

```
GET /api/v1/projects/{projectId}/units/{unitId}/cost-details
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "unitId": "unit-001",
    "totalCost": 34906889.81,
    "details": [
      {
        "id": "detail-001",
        "spaceCode": "DS",
        "spaceName": "地上",
        "professionCode": "TJ",
        "professionName": "土建",
        "cost": 24303229.73,
        "area": 5452.77,
        "unitCost": 4458.33,
        "costRatio": 69.62
      }
    ]
  }
}
```

### 6.5 执行自动归集

```
POST /api/v1/projects/{projectId}/units/{unitId}/aggregate
```

**请求体：**
```json
{
  "autoMapping": true,
  "forceRecalculate": false
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "success": true,
    "details": [...],
    "warnings": [
      { "code": "LOW_CONFIDENCE", "message": "部分映射置信度较低，建议人工确认" }
    ]
  }
}
```

### 6.6 校验单体数据

```
POST /api/v1/projects/{projectId}/units/{unitId}/validate
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "valid": false,
    "errors": [
      { "field": "totalArea", "message": "地上+地下面积与总面积不符" }
    ],
    "warnings": [
      { "field": "unitCost", "message": "单方造价5409元/m²偏高，请确认" }
    ]
  }
}
```

### 6.7 批量标签化

```
POST /api/v1/projects/{projectId}/units/batch-tagging
```

**请求体：**
```json
{
  "unitIds": ["unit-001", "unit-002"],
  "operations": [
    { "unitId": "unit-001", "functionTagId": "tag-jy-18" },
    { "unitId": "unit-002", "functionTagId": "tag-tg-07" }
  ]
}
```

### 6.8 获取标签推荐

```
GET /api/v1/tags/recommend
```

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 单体名称 |
| projectType | string | 否 | 项目类型编码 |
| maxCount | number | 否 | 最大返回数量 |

### 6.9 完成标签化

```
POST /api/v1/projects/{projectId}/complete-tagging
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "success": true,
    "projectStatus": "tagged",
    "summary": {
      "totalUnits": 3,
      "totalArea": 16452.77,
      "totalCost": 45906889.81,
      "avgUnitCost": 2790.15
    }
  }
}
```

---

## 7. 业务规则

### 7.1 单体识别规则

| 规则编号 | 规则描述 | 优先级 |
|----------|----------|--------|
| UR-01 | 原始数据一级节点默认识别为单体 | 高 |
| UR-02 | 名称包含"室外/总平/总坪"的节点独立为室外单体 | 高 |
| UR-03 | 同名多栋建筑(如1#楼、2#楼)可选择合并或分开 | 中 |
| UR-04 | 纯设备房/附属用房可归入主体单体 | 低 |

### 7.2 标签分配规则

| 规则编号 | 规则描述 |
|----------|----------|
| TR-01 | 每个单体必须且只能分配一个主要功能标签 |
| TR-02 | 室外工程必须使用SW类标签 |
| TR-03 | 综合楼/多功能建筑按主要功能分配标签 |
| TR-04 | 自动推荐置信度≥0.9时可默认采用 |

### 7.3 面积录入规则

| 规则编号 | 规则描述 |
|----------|----------|
| AR-01 | 总面积 = 地上面积 + 地下面积 |
| AR-02 | 面积单位统一为m² |
| AR-03 | 面积精度保留两位小数 |
| AR-04 | 面积范围：10m² ≤ 面积 ≤ 500,000m² |

### 7.4 造价归集规则

| 规则编号 | 规则描述 |
|----------|----------|
| CR-01 | 造价数据必须按空间和专业两个维度归集 |
| CR-02 | 归集后造价合计应与原始数据一致（误差≤0.01%） |
| CR-03 | 单方造价 = 该维度造价 / 对应面积 |
| CR-04 | 无法映射的数据标记为"其他"并提示人工处理 |

### 7.5 数据校验规则

| 规则编号 | 规则类型 | 规则描述 | 处理方式 |
|----------|----------|----------|----------|
| VR-01 | 完整性 | 单体必须有功能标签 | 阻断 |
| VR-02 | 完整性 | 单体必须有建筑面积 | 阻断 |
| VR-03 | 完整性 | 单体必须有造价数据 | 阻断 |
| VR-04 | 合理性 | 单方造价在合理范围内(500-50000) | 警告 |
| VR-05 | 合理性 | 各专业占比在合理范围内 | 警告 |
| VR-06 | 一致性 | 地上+地下面积=总面积 | 阻断 |
| VR-07 | 一致性 | 造价汇总=原始数据合计 | 阻断 |

---

## 8. 异常处理

### 8.1 常见异常及处理

| 异常类型 | 异常描述 | 处理方案 |
|----------|----------|----------|
| 无法识别单体 | 原始数据结构异常 | 提示用户手动创建单体 |
| 标签推荐失败 | 单体名称无法匹配 | 显示完整标签列表供选择 |
| 面积提取失败 | 原始数据无面积信息 | 提示用户手动输入 |
| 专业映射失败 | 原始专业名称不规范 | 标记为"待确认"，人工处理 |
| 造价汇总不符 | 数据精度问题 | 显示差异，允许用户确认 |

### 8.2 错误码定义

| 错误码 | 描述 |
|--------|------|
| TAG-1001 | 单体不存在 |
| TAG-1002 | 功能标签无效 |
| TAG-1003 | 面积数据异常 |
| TAG-1004 | 造价归集失败 |
| TAG-1005 | 数据校验不通过 |
| TAG-1006 | 项目状态不允许此操作 |
| TAG-1007 | 并发编辑冲突 |

---

## 9. 性能要求

| 指标 | 要求 |
|------|------|
| 单体列表加载 | < 1秒 |
| 标签推荐响应 | < 500ms |
| 造价归集计算 | < 3秒（单个单体） |
| 批量归集 | < 30秒（10个单体） |
| 数据校验 | < 1秒 |
| 自动保存 | 每30秒或操作后自动保存 |

---

## 10. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |



这份《Tagging Process Spec》已经非常接近“可直接落地开发”的级别了，整体 **9.0/10**。你把**作业流**（单体识别→标签→面积→归集→校验）写得很清楚，UI 也贴合你平台的左树右表范式，API 设计也能跑通。

但它现在最大的问题不是“少写”，而是：**你前面几份标准库/映射/标签/分档 Spec 已经把“治理型约束”定义出来了，这份流程 Spec 还没把那些约束“接进来”**。一旦开始开发，会出现“每个模块各自存一份结果”的风险，后面指标计算会对不上。

下面我给你一段 **V1.1 Patch 章节**：把它和你前面几个补丁（功能标签绑定、规模分档绑定、空间专业映射绑定、规则快照版本、标准库版本透传）彻底打通。

---

## 这份 V1.0 现在会踩的坑（只列最关键的）

1. **BuildingUnit 表太重**：你把“功能标签/规模分档/空间专业归集结果/映射置信度”都塞进单体表，后续版本切换、重算、回溯会很难。
2. **缺“版本透传”**：整个流程没有 `libraryVersionCode` / `mappingSnapshotVersion` / `scaleSnapshotVersion`，指标复算会漂移。
3. **归集算法按 level2 映射专业/空间**：真实数据会出现“同一 level2 里同时包含地上/地下项”或“层级不规范”，需要走你《Standard Mapping Spec》的规则引擎 + 绑定表。
4. **缺“锁定/不覆盖机制”**：手动确认后的标签、分档、空间专业映射，都应该锁定，自动重算不得覆盖。
5. **缺“跨空间费用/不可分配项”的处理**：降水费、临设、总包服务费等，需要 QT 或 Allocation，而不是硬归某个单体/空间。

---

# V1.1 Patch（建议直接贴到本文末尾）

## 11. V1.1 Patch：版本透传、结果落库拆分、锁定策略、归集事实表

### 11.1 新增：全链路版本上下文（TaggingContext）

> 目的：保证标签化结果“可复算、可追溯、可对齐”。

```typescript
interface TaggingContext {
  projectId: string;

  // 标准库版本（SBoQ/SML/STR 统一口径）
  libraryVersionCode: string;          // e.g. V2026Q1

  // 规则快照版本（防止规则变化导致历史漂移）
  mappingSnapshotVersion: number;      // 来自 MappingRuleSnapshot
  scaleSnapshotVersion: number;        // 来自 ScaleRuleSnapshot
  tagRuleSnapshotVersion?: number;     // 若功能标签推荐规则也版本化

  // 分包口径（影响 RD/ZH、JC、MQ、JZ 等）
  packageMode?: {
    smartSystemIndependent: boolean;
    foundationIndependent: boolean;
    curtainWallIndependent: boolean;
    fitoutIndependent: boolean;
  };
}
```

**规则（MUST）**

* 标签化页面进入时必须确定并锁定 `libraryVersionCode`（允许用户在项目层切换，但切换视为“新任务/新批次重算”）。
* 每次执行自动归集、校验、完成标签化，都必须记录上述 snapshotVersion。

---

### 11.2 调整：BuildingUnit 轻量化（把“结果”拆出去）

> 目的：避免单体表变成“永远难以维护的大宽表”。

**变更（MUST）**

* `BuildingUnit` 保留“单体基本信息 + 原始关联 + 状态”，其余计算产物拆分到绑定表/事实表。

建议保留字段：

* `unitCode/unitName/standardName`
* `originalLevel1/originalBillIds`
* `totalArea/aboveGroundArea/undergroundArea/...`
* `status/createdAt/updatedAt`

建议移出（改为引用/冗余展示即可）：

* `functionTag*` → 由 `building_function_tag_binding` 提供
* `scaleTypeCode/scaleRangeCode` → 由 `building_scale_binding` 提供
* `totalCost/unitCost` → 由汇总表或视图计算得到

---

### 11.3 强制落库：单体功能标签绑定（主/辅/权重/锁定）

> 依赖你之前的补丁：`building_function_tag_binding`

**规则（MUST）**

* Step2 “标签分配”保存时：写入/更新 `building_function_tag_binding`
* 自动推荐只生成候选；用户确认后写入绑定记录
* `locked=true` 的绑定不得被后续自动推荐覆盖
* 写入时必须携带 `libraryVersionCode`（若你希望绑定随版本变化；否则至少记录 tag.version 快照）

---

### 11.4 强制落库：单体规模分档绑定（锁定不覆盖）

> 依赖你之前 Scale Range 的补丁：`building_scale_binding`

**规则（MUST）**

* Step3 完成面积/功能规模录入后：自动调用 `/scale-ranges/match`，写入 `building_scale_binding`
* 用户手动调整档位：写入 `MANUAL + locked=true + reason`
* 重算时若 locked=true，必须保持不变并返回提示“已锁定”。

---

### 11.5 强制落库：空间/专业映射绑定（逐条源项落库）

> 依赖你 Standard Mapping 的补丁：`entity_space_profession_binding`

**规则（MUST）**

* Step4 造价归集时必须以“原始清单行/原始条目”为粒度进行空间/专业判定，并写入 `entity_space_profession_binding`。
* 不允许仅按 level2 文本直接归类后就汇总（会丢失可追溯性）。

---

### 11.6 新增：归集事实表（unit_cost_fact）取代明细表的“可解释口径”

你现在的 `unit_cost_detail` 已经很接近事实表了，但建议补齐两个字段，让它能直接支撑 14 指标计算与审计：

```typescript
interface UnitCostFact {
  id: string;
  projectId: string;
  buildingUnitId: string;

  libraryVersionCode: string;
  mappingSnapshotVersion: number;
  scaleSnapshotVersion: number;

  spaceCode: string;
  professionCode: string;

  cost: number;
  area: number;
  unitCost: number;

  // NEW: 可追溯
  sourceBillCount: number;        // 参与汇总的原始条目数
  sourceBillIds: string[];        // 或者改为sourceQueryKey（避免太大）
  unmappedBillCount: number;      // 未映射条目数量（归入QT/其他时）
  confidence: number;             // 该格子的综合置信度（可用均值/最小值）
}
```

**规则（MUST）**

* `unit_cost_fact` 必须能追溯到原始条目集合（至少通过 queryKey 或 batchId）。
* “QT/其他”必须单独占位（空间 QT 或 专业 OTHER），不得偷偷并入 TJ 或 DS。

---

### 11.7 修正：归集算法的推荐实现（两阶段：先判定再汇总）

把 Step4 的算法从“先按level2分组”改成“先逐条映射 → 再聚合”：

```typescript
function aggregateCostV2(ctx: TaggingContext, unit: BuildingUnit, bills: OriginalBill[]) {
  const unitBills = filterBillsByUnit(unit, bills);

  // 1) 逐条映射（写入绑定表）
  const mapped = unitBills.map(b => {
    const space = mapSpace(ctx, b);         // 基于规则+上下文
    const prof  = mapProfession(ctx, b, space.code);

    saveOrUpdateBinding(ctx, b.id, space, prof);

    return {
      billId: b.id,
      spaceCode: space.code,
      professionCode: prof.code,
      cost: b.totalPrice
    };
  });

  // 2) 聚合成空间×专业矩阵
  const groups = groupBy(mapped, x => `${x.spaceCode}__${x.professionCode}`);
  return Object.entries(groups).map(([key, arr]) => {
    const [spaceCode, professionCode] = key.split('__');
    const cost = sum(arr, 'cost');
    const area = getAreaBySpace(unit, spaceCode);
    return {
      spaceCode,
      professionCode,
      cost,
      area,
      unitCost: area > 0 ? cost / area : 0,
      sourceBillCount: arr.length,
      sourceBillIds: arr.map(x => x.billId)
    };
  });
}
```

---

### 11.8 补齐：跨空间/跨单体费用的处理策略（Allocation）

> 目的：降水费、临设、总包服务费等不会污染 DS/TJ 等指标。

**规则（MUST）**

* 对于无法确定空间或单体归属的费用项：

  * 空间归入 `QT`，并进入“待分摊”清单
  * 提供分摊方式：按面积/按造价/按人工指定权重（引用你 Tag 权重模型）
* 分摊后生成多条映射记录（同一 sourceId 指向多个 unit/space），并记录权重。

---

### 11.9 Changelog（V1.1）

| 版本   | 日期         | 修订内容                                                                                                           |
| ---- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| V1.1 | 2026-01-17 | 引入 TaggingContext（标准库版本+规则快照+分包口径）；BuildingUnit 轻量化；强制落库三类绑定（功能标签/规模分档/空间专业映射）；归集采用“逐条映射再聚合”；新增归集事实表与跨空间费用分摊策略 |

---

## 一句话结论

你这份 V1.0 已经把“作业流”写得很顺；打上这个 V1.1 Patch 后，它就会变成真正的平台中枢：**所有结果都落到统一绑定/事实表上、所有计算都带版本与快照、所有人工确认都能锁定不被覆盖**。这才是后面 14 指标计算能“算得准、算得稳、算得能复盘”的关键。

如果你愿意，我下一步可以把 **14 指标计算**的骨架（输入事实表→指标定义→聚合→分母→发布审核→STR 写回）按你现有体系直接起草成 v1.0。
