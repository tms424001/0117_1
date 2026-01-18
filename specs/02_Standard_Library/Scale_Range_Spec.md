# 规模分档规范 (Scale Range Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：02_Standard_Library

---

## 1. 概述

### 1.1 目的
规模分档是指标生成和估算匹配的重要维度，通过将单体按建筑面积或功能规模划分为不同档位，实现：
- 同类单体按规模区间聚合，提高指标可比性
- 估算时按规模匹配更精准的指标
- 反映规模效应对单方造价的影响

### 1.2 设计原则
- **科学性**：分档区间基于行业规律和统计分析
- **实用性**：档位数量适中，便于使用和理解
- **灵活性**：支持按面积和功能规模两种分档方式
- **可配置**：支持分档规则的自定义和调整

### 1.3 术语定义

| 术语 | 定义 |
|------|------|
| 规模分档 | 按建筑面积或功能规模将单体划分为不同区间 |
| 面积分档 | 以建筑面积(m²)为依据的分档方式 |
| 功能分档 | 以功能规模(床位/班级/座位等)为依据的分档方式 |
| 规模效应 | 建筑规模增大带来的单方造价变化规律 |

### 1.4 规模效应说明

建筑规模与单方造价通常呈现以下规律：

```
单方造价
    │
    │  ●
    │    ●
    │      ● ● ● ● ● ●
    │
    └──────────────────────── 建筑面积
       小型   中型   大型
```

- **小型建筑**：规模小，固定成本分摊高，单方造价偏高
- **中型建筑**：规模适中，单方造价趋于稳定
- **大型建筑**：规模效应显现，单方造价略有下降或持平

---

## 2. 分档体系结构

### 2.1 分档类型

```
规模分档
├── 通用面积分档（适用于所有单体）
│   └── 按建筑面积划分
└── 功能规模分档（适用于特定类型）
    ├── 床位分档（医疗、养老）
    ├── 班级分档（教育）
    ├── 座位分档（体育、文化）
    ├── 客房分档（酒店）
    ├── 车位分档（停车）
    └── 户数分档（居住）
```

### 2.2 分档优先级

当单体同时具备面积和功能规模时，按以下优先级确定分档：

1. **功能规模分档**（如有）：更能反映业态特征
2. **面积分档**（兜底）：通用适用

---

## 3. 数据模型

### 3.1 分档类型表 (scale_type)

```typescript
interface ScaleType {
  id: string;                    // 主键UUID
  code: string;                  // 类型编码，如 "AREA", "BED", "CLASS"
  name: string;                  // 类型名称，如 "建筑面积", "床位数"
  unit: string;                  // 计量单位，如 "m²", "床", "班"
  description: string;           // 描述说明
  
  // 适用范围
  applicableTagCategories: string[]; // 适用的标签大类编码
  applicableTags: string[];      // 适用的功能标签编码（更精确）
  
  // 优先级
  priority: number;              // 优先级，数值越大优先级越高
  
  // 系统字段
  isSystem: boolean;             // 是否系统内置
  sortOrder: number;             // 排序号
  status: 'active' | 'inactive'; // 状态
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | UUID主键 |
| code | string | 是 | 类型编码，大写字母，唯一 |
| name | string | 是 | 类型名称 |
| unit | string | 是 | 计量单位 |
| description | string | 否 | 描述说明 |
| applicableTagCategories | array | 否 | 适用的标签大类，空表示通用 |
| applicableTags | array | 否 | 适用的具体标签，更精确的限定 |
| priority | number | 是 | 优先级，用于确定使用哪种分档 |
| isSystem | boolean | 是 | 系统内置类型不可删除 |
| sortOrder | number | 是 | 排序号 |
| status | enum | 是 | 状态 |

### 3.2 规模档位表 (scale_range)

```typescript
interface ScaleRange {
  id: string;                    // 主键UUID
  scaleTypeId: string;           // 所属分档类型ID
  scaleTypeCode: string;         // 分档类型编码（冗余）
  
  // 档位信息
  code: string;                  // 档位编码，如 "XS", "ZX", "DX"
  name: string;                  // 档位名称，如 "小型", "中型", "大型"
  shortName: string;             // 简称，如 "小", "中", "大"
  
  // 区间范围
  minValue: number;              // 最小值（含）
  maxValue: number;              // 最大值（不含），-1表示无上限
  
  // 显示文本
  rangeText: string;             // 区间文本，如 "3000-10000m²"
  
  // 系统字段
  sortOrder: number;             // 排序号
  status: 'active' | 'inactive'; // 状态
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | UUID主键 |
| scaleTypeId | string | 是 | 外键，关联scale_type.id |
| scaleTypeCode | string | 是 | 分档类型编码，冗余便于查询 |
| code | string | 是 | 档位编码，同一类型内唯一 |
| name | string | 是 | 档位名称 |
| shortName | string | 是 | 简称，用于紧凑展示 |
| minValue | number | 是 | 区间下限（含） |
| maxValue | number | 是 | 区间上限（不含），-1表示无上限 |
| rangeText | string | 是 | 区间显示文本 |
| sortOrder | number | 是 | 排序号，按规模从小到大 |
| status | enum | 是 | 状态 |

### 3.3 标签分档配置表 (tag_scale_config)

配置特定功能标签使用的分档类型。

```typescript
interface TagScaleConfig {
  id: string;                    // 主键UUID
  tagId: string;                 // 功能标签ID
  tagCode: string;               // 功能标签编码（冗余）
  scaleTypeId: string;           // 分档类型ID
  scaleTypeCode: string;         // 分档类型编码（冗余）
  
  // 自定义档位（可选，覆盖默认）
  customRanges: CustomRange[];   // 自定义档位配置
  
  // 系统字段
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface CustomRange {
  code: string;                  // 档位编码
  name: string;                  // 档位名称
  minValue: number;              // 最小值
  maxValue: number;              // 最大值
}
```

---

## 4. 分档类型明细

### 4.1 通用面积分档 (AREA)

适用于所有单体的默认分档方式。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 |
|----------|----------|------|----------|----------|
| XS | 小型 | 小 | 0 - 3,000 | <3000m² |
| ZX | 中小型 | 中小 | 3,000 - 10,000 | 3000-10000m² |
| ZD | 中大型 | 中大 | 10,000 - 30,000 | 1-3万m² |
| DX | 大型 | 大 | 30,000 - 100,000 | 3-10万m² |
| TD | 特大型 | 特大 | 100,000 - ∞ | >10万m² |

**适用场景：**
- 所有单体的默认分档
- 无功能规模数据时的兜底方案

### 4.2 床位分档 (BED)

适用于医疗、养老类建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| BED-XS | 小型 | 小 | 0 - 100 | <100床 | YI-04~07, YI-10~11, YA-01~03 |
| BED-ZX | 中小型 | 中小 | 100 - 300 | 100-300床 | 同上 |
| BED-ZD | 中大型 | 中大 | 300 - 500 | 300-500床 | 同上 |
| BED-DX | 大型 | 大 | 500 - 1,000 | 500-1000床 | 同上 |
| BED-TD | 特大型 | 特大 | 1,000 - ∞ | >1000床 | 同上 |

**适用功能标签：**
- 医疗卫生：住院-普通(YI-04)、住院-重症(YI-05)、住院-产科(YI-06)、住院-儿科(YI-07)、感染-负压(YI-10)、康复(YI-11)
- 养老：居住-自理(YA-01)、居住-介护(YA-02)、居住-失智(YA-03)

### 4.3 班级分档 (CLASS)

适用于教育类建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| CLS-XS | 小型 | 小 | 0 - 12 | ≤12班 | JY-01, JY-18 |
| CLS-ZX | 中小型 | 中小 | 12 - 24 | 12-24班 | 同上 |
| CLS-ZD | 中大型 | 中大 | 24 - 36 | 24-36班 | 同上 |
| CLS-DX | 大型 | 大 | 36 - 60 | 36-60班 | 同上 |
| CLS-TD | 特大型 | 特大 | 60 - ∞ | >60班 | 同上 |

**适用功能标签：**
- 教育：教学-普通(JY-01)、活动-幼儿(JY-18)

**学校类型与班级规模对应：**
| 学校类型 | 常见规模 |
|----------|----------|
| 幼儿园 | 6班、9班、12班、15班、18班 |
| 小学 | 12班、18班、24班、30班、36班 |
| 初中 | 12班、18班、24班、30班、36班 |
| 高中 | 24班、30班、36班、48班、60班 |

### 4.4 座位分档 (SEAT)

适用于体育、文化类场馆建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| SEAT-XS | 小型 | 小 | 0 - 1,000 | <1000座 | TI-01~02, TI-08, WH-07~08, WH-12 |
| SEAT-ZX | 中小型 | 中小 | 1,000 - 5,000 | 1000-5000座 | 同上 |
| SEAT-ZD | 中大型 | 中大 | 5,000 - 15,000 | 5000-15000座 | 同上 |
| SEAT-DX | 大型 | 大 | 15,000 - 40,000 | 1.5-4万座 | 同上 |
| SEAT-TD | 特大型 | 特大 | 40,000 - ∞ | >4万座 | 同上 |

**适用功能标签：**
- 体育：比赛场-综合(TI-01)、比赛场-专项(TI-02)、看台(TI-08)
- 文化：演出-剧场(WH-07)、演出-小剧场(WH-08)、报告厅(WH-12)

### 4.5 客房分档 (ROOM)

适用于酒店类建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| ROOM-XS | 小型 | 小 | 0 - 100 | <100间 | JD-01~03 |
| ROOM-ZX | 中小型 | 中小 | 100 - 200 | 100-200间 | 同上 |
| ROOM-ZD | 中大型 | 中大 | 200 - 400 | 200-400间 | 同上 |
| ROOM-DX | 大型 | 大 | 400 - 800 | 400-800间 | 同上 |
| ROOM-TD | 特大型 | 特大 | 800 - ∞ | >800间 | 同上 |

**适用功能标签：**
- 酒店：客房-标准(JD-01)、客房-套房(JD-02)、客房-公寓(JD-03)

### 4.6 车位分档 (PARKING)

适用于停车类建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| PKG-XS | 小型 | 小 | 0 - 100 | <100车位 | TG-01, JT-05~07 |
| PKG-ZX | 中小型 | 中小 | 100 - 300 | 100-300车位 | 同上 |
| PKG-ZD | 中大型 | 中大 | 300 - 500 | 300-500车位 | 同上 |
| PKG-DX | 大型 | 大 | 500 - 1,000 | 500-1000车位 | 同上 |
| PKG-TD | 特大型 | 特大 | 1,000 - ∞ | >1000车位 | 同上 |

**适用功能标签：**
- 通用：地下车库(TG-01)
- 交通：停车-地面(JT-05)、停车-地下(JT-06)、停车-立体(JT-07)

### 4.7 户数分档 (HOUSEHOLD)

适用于居住类建筑。

| 档位编码 | 档位名称 | 简称 | 区间范围 | 区间文本 | 适用标签 |
|----------|----------|------|----------|----------|----------|
| HH-XS | 小型 | 小 | 0 - 100 | <100户 | JZ-01~06, JZ-10 |
| HH-ZX | 中小型 | 中小 | 100 - 300 | 100-300户 | 同上 |
| HH-ZD | 中大型 | 中大 | 300 - 500 | 300-500户 | 同上 |
| HH-DX | 大型 | 大 | 500 - 1,000 | 500-1000户 | 同上 |
| HH-TD | 特大型 | 特大 | 1,000 - ∞ | >1000户 | 同上 |

**适用功能标签：**
- 居住：住宅-多层(JZ-01)至住宅-洋房(JZ-06)、保障房(JZ-10)

---

## 5. 分档匹配逻辑

### 5.1 分档确定流程

```
输入：单体信息（功能标签、建筑面积、功能规模）
     │
     ▼
┌─────────────────────────────────────┐
│ 1. 查询功能标签的分档配置            │
│    tag_scale_config                 │
└─────────────────┬───────────────────┘
                  │
          有自定义配置？
         ╱            ╲
        是              否
        │               │
        ▼               ▼
┌───────────────┐ ┌───────────────────────┐
│使用自定义分档  │ │查询标签大类的默认分档    │
└───────┬───────┘ └───────────┬───────────┘
        │                     │
        │             有功能规模数据？
        │            ╱            ╲
        │           是              否
        │           │               │
        │           ▼               ▼
        │   ┌───────────────┐ ┌───────────────┐
        │   │使用功能规模分档 │ │使用面积分档    │
        │   └───────┬───────┘ └───────┬───────┘
        │           │               │
        └───────────┴───────┬───────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │ 2. 根据数值匹配档位          │
              │    minValue <= 值 < maxValue │
              └─────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │ 输出：规模档位               │
              │ {typeCode, rangeCode, name} │
              └─────────────────────────────┘
```

### 5.2 匹配算法

```typescript
/**
 * 确定单体的规模分档
 * @param unit 单体信息
 * @returns 规模分档信息
 */
function determineScaleRange(unit: BuildingUnit): ScaleRangeResult {
  const { functionTagCode, totalArea, functionalScale, functionalUnit } = unit;
  
  // 1. 查询标签的分档配置
  const tagConfig = getTagScaleConfig(functionTagCode);
  
  let scaleType: ScaleType;
  let value: number;
  
  if (tagConfig && tagConfig.customRanges?.length > 0) {
    // 使用自定义分档
    scaleType = getScaleType(tagConfig.scaleTypeCode);
    value = functionalScale || totalArea;
  } else {
    // 查询标签对应的分档类型
    const applicableTypes = getApplicableScaleTypes(functionTagCode);
    
    if (applicableTypes.length > 0 && functionalScale) {
      // 使用功能规模分档
      scaleType = applicableTypes[0]; // 取优先级最高的
      value = functionalScale;
    } else {
      // 使用通用面积分档
      scaleType = getScaleType('AREA');
      value = totalArea;
    }
  }
  
  // 2. 匹配档位
  const ranges = tagConfig?.customRanges || getScaleRanges(scaleType.id);
  const matchedRange = ranges.find(r => 
    value >= r.minValue && (r.maxValue === -1 || value < r.maxValue)
  );
  
  return {
    scaleTypeCode: scaleType.code,
    scaleTypeName: scaleType.name,
    scaleTypeUnit: scaleType.unit,
    rangeCode: matchedRange.code,
    rangeName: matchedRange.name,
    rangeText: matchedRange.rangeText,
    actualValue: value
  };
}
```

### 5.3 匹配结果示例

| 单体名称 | 功能标签 | 建筑面积 | 功能规模 | 匹配分档类型 | 匹配档位 |
|----------|----------|----------|----------|--------------|----------|
| 门诊楼 | YI-01门诊 | 25,000m² | - | 面积(AREA) | 中大型 |
| 住院楼 | YI-04住院-普通 | 35,000m² | 500床 | 床位(BED) | 大型 |
| 教学楼 | JY-01教学-普通 | 8,000m² | 24班 | 班级(CLASS) | 中大型 |
| 体育馆 | TI-01比赛场-综合 | 45,000m² | 8,000座 | 座位(SEAT) | 中大型 |
| 地下车库 | TG-01地下车库 | 20,000m² | 600车位 | 车位(PARKING) | 大型 |
| 办公楼 | BG-01办公-普通 | 15,000m² | - | 面积(AREA) | 中大型 |

---

## 6. UI组件规范

### 6.1 规模档位选择器 (ScaleRangeSelector)

#### 6.1.1 组件描述
用于手动选择或调整单体的规模档位。

#### 6.1.2 组件属性

```typescript
interface ScaleRangeSelectorProps {
  value?: string;                // 当前选中的档位编码
  scaleTypeCode?: string;        // 分档类型编码，不指定则显示所有
  onChange?: (rangeCode: string, range: ScaleRange) => void;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  showRangeText?: boolean;       // 是否显示区间文本，默认true
  style?: React.CSSProperties;
}
```

#### 6.1.3 视觉规范

**下拉选择模式：**
```
┌─────────────────────────────────┐
│ 中大型 (1-3万m²)            ▼  │
├─────────────────────────────────┤
│ ○ 小型 (<3000m²)               │
│ ○ 中小型 (3000-10000m²)        │
│ ● 中大型 (1-3万m²)             │
│ ○ 大型 (3-10万m²)              │
│ ○ 特大型 (>10万m²)             │
└─────────────────────────────────┘
```

**按钮组模式：**
```
┌────┬────┬────┬────┬────┐
│ 小 │中小│中大│ 大 │特大│
└────┴────┴────┴────┴────┘
           ▲
         选中态
```

### 6.2 规模输入组件 (ScaleInput)

#### 6.2.1 组件描述
录入功能规模数值，自动匹配档位。

#### 6.2.2 组件属性

```typescript
interface ScaleInputProps {
  scaleTypeCode: string;         // 分档类型编码
  value?: number;                // 当前数值
  onChange?: (value: number, matchedRange: ScaleRange) => void;
  placeholder?: string;
  disabled?: boolean;
  showMatchedRange?: boolean;    // 是否显示匹配的档位，默认true
  size?: 'small' | 'middle' | 'large';
}
```

#### 6.2.3 视觉规范

```
┌─────────────────────────────────────────┐
│ 功能规模：[  500  ] 床    → 匹配档位：大型 │
└─────────────────────────────────────────┘
```

### 6.3 规模档位标签 (ScaleRangeTag)

#### 6.3.1 组件描述
显示规模档位的标签组件。

#### 6.3.2 组件属性

```typescript
interface ScaleRangeTagProps {
  rangeCode: string;             // 档位编码
  rangeName: string;             // 档位名称
  scaleTypeName?: string;        // 分档类型名称
  showType?: boolean;            // 是否显示分档类型，默认false
  size?: 'small' | 'middle';
}
```

#### 6.3.3 视觉规范

```
┌────────────┐
│ 大型       │    // 简洁模式
└────────────┘

┌────────────────┐
│ 床位-大型      │    // 显示类型
└────────────────┘
```

**颜色规范：**
| 档位 | 背景色 | 文字色 |
|------|--------|--------|
| 小型 | #E6F7FF | #1890FF |
| 中小型 | #E6FFFB | #13C2C2 |
| 中大型 | #F6FFED | #52C41A |
| 大型 | #FFF7E6 | #FA8C16 |
| 特大型 | #FFF1F0 | #F5222D |

---

## 7. API接口

### 7.1 获取分档类型列表

```
GET /api/v1/scale-types
```

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tagCode | string | 否 | 按功能标签筛选适用的分档类型 |
| status | string | 否 | 状态筛选 |

**响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "st-001",
      "code": "AREA",
      "name": "建筑面积",
      "unit": "m²",
      "description": "通用面积分档",
      "applicableTagCategories": [],
      "priority": 0,
      "isSystem": true,
      "sortOrder": 1,
      "status": "active",
      "rangeCount": 5
    },
    {
      "id": "st-002",
      "code": "BED",
      "name": "床位数",
      "unit": "床",
      "description": "医疗、养老类建筑按床位分档",
      "applicableTagCategories": ["YI", "YA"],
      "priority": 10,
      "isSystem": true,
      "sortOrder": 2,
      "status": "active",
      "rangeCount": 5
    }
  ]
}
```

### 7.2 获取档位列表

```
GET /api/v1/scale-types/{typeCode}/ranges
```

**响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "sr-001",
      "scaleTypeId": "st-002",
      "scaleTypeCode": "BED",
      "code": "BED-XS",
      "name": "小型",
      "shortName": "小",
      "minValue": 0,
      "maxValue": 100,
      "rangeText": "<100床",
      "sortOrder": 1,
      "status": "active"
    },
    {
      "id": "sr-002",
      "scaleTypeId": "st-002",
      "scaleTypeCode": "BED",
      "code": "BED-ZX",
      "name": "中小型",
      "shortName": "中小",
      "minValue": 100,
      "maxValue": 300,
      "rangeText": "100-300床",
      "sortOrder": 2,
      "status": "active"
    }
  ]
}
```

### 7.3 匹配规模档位

```
POST /api/v1/scale-ranges/match
```

**请求体：**
```json
{
  "functionTagCode": "YI-04",
  "totalArea": 35000,
  "functionalScale": 500,
  "functionalUnit": "床"
}
```

**响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scaleTypeCode": "BED",
    "scaleTypeName": "床位数",
    "scaleTypeUnit": "床",
    "rangeCode": "BED-DX",
    "rangeName": "大型",
    "rangeText": "500-1000床",
    "actualValue": 500,
    "matchReason": "功能标签YI-04适用床位分档，按功能规模500床匹配"
  }
}
```

### 7.4 获取标签的分档配置

```
GET /api/v1/tags/{tagCode}/scale-config
```

**响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "tagCode": "YI-04",
    "tagName": "住院-普通",
    "scaleTypeCode": "BED",
    "scaleTypeName": "床位数",
    "ranges": [
      { "code": "BED-XS", "name": "小型", "minValue": 0, "maxValue": 100, "rangeText": "<100床" },
      { "code": "BED-ZX", "name": "中小型", "minValue": 100, "maxValue": 300, "rangeText": "100-300床" },
      { "code": "BED-ZD", "name": "中大型", "minValue": 300, "maxValue": 500, "rangeText": "300-500床" },
      { "code": "BED-DX", "name": "大型", "minValue": 500, "maxValue": 1000, "rangeText": "500-1000床" },
      { "code": "BED-TD", "name": "特大型", "minValue": 1000, "maxValue": -1, "rangeText": ">1000床" }
    ],
    "isCustom": false
  }
}
```

### 7.5 更新标签的分档配置（管理员）

```
PUT /api/v1/tags/{tagCode}/scale-config
```

**请求体：**
```json
{
  "scaleTypeCode": "BED",
  "customRanges": [
    { "code": "CUSTOM-S", "name": "小型", "minValue": 0, "maxValue": 200 },
    { "code": "CUSTOM-M", "name": "中型", "minValue": 200, "maxValue": 500 },
    { "code": "CUSTOM-L", "name": "大型", "minValue": 500, "maxValue": -1 }
  ]
}
```

---

## 8. 业务规则

### 8.1 分档边界规则

- 区间采用**左闭右开**原则：`minValue <= 值 < maxValue`
- 最大档位的 maxValue 设为 **-1** 表示无上限
- 最小档位的 minValue 从 **0** 开始

### 8.2 分档优先级规则

1. 自定义分档配置 > 功能规模分档 > 通用面积分档
2. 同一标签只能配置一种分档类型
3. 功能规模分档优先级由 scale_type.priority 决定

### 8.3 数据完整性规则

1. 功能规模数据为空时，自动降级使用面积分档
2. 面积数据为空时，不进行分档，返回"未分档"
3. 同一分档类型的档位区间必须连续，不能有空隙

### 8.4 分档调整规则

1. 自动匹配的档位可以手动调整
2. 手动调整需记录调整原因
3. 手动调整的档位在重新计算时不会被覆盖

---

## 9. 初始化数据

系统初始化时需导入以下数据：
- 7种分档类型
- 35个档位（每种类型5个档位）
- 约50条标签分档配置

数据文件位置：`/data/init/scale_ranges.json`

---

## 10. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |



这份《规模分档规范》整体质量：**8.8/10（很能打，已经是“可直接开发+可直接用于指标计算”的级别）**。你把“分档类型—档位—标签配置—匹配逻辑—UI/API”一条链都打通了，特别适合接到 14 指标计算里做“同类可比”的关键维度。

下面我只挑**会在后续指标/估算/治理里踩坑的点**，并给你一段可直接贴进 V1.1 的补丁（和你之前 Tag Spec 补丁风格一致）。

---

## 你这版最强的点（保留不动）

* **分档优先级**：功能规模 > 面积分档，这个非常对（床位/班级/座位比面积更“业态可比”）。
* **数据模型三表**：`scale_type / scale_range / tag_scale_config` 组合合理，配置灵活且可治理。
* **区间定义明确**：左闭右开、max=-1 无上限，这些是后续统计必须的“硬口径”。
* **把“规模效应”写出来了**：这让后面指标解释（为什么单方会随规模变化）有理论锚点。

---

## 关键风险点（建议尽快修）

### 1) `customRanges` 放在 `tag_scale_config` 里会很难治理版本与审计

你现在是“每个标签都能自定义一套档位”。会导致：

* 同一分档类型在不同标签下被“改出 10 套”，指标不可比；
* 没有版本快照，历史指标复算会漂移；
* UI 很难做“全局模板 vs 标签覆写”的清晰层级。

✅ 建议：把自定义档位抽成独立表 `scale_range_override`（可选），并加版本/生效时间/审批字段。标签配置只“引用”某个 override set。

### 2) “同一分档类型区间必须连续不能有空隙”——你还需要补“不可重叠”

连续之外更致命的是**重叠**：两个档位都满足 `min <= v < max` 就会出现双匹配。

✅ 补一条 MUST：同一 `scaleType` 下，所有 range 的区间必须**不重叠**且**严格递增**。

### 3) `functionalUnit` 与 `scaleType.unit` 需要强一致校验

你在 match 接口里传了 `functionalUnit:"床"`，但系统里 scaleType(BED).unit="床"。这必须校验，否则用户传“人/床位/张”会乱。

✅ 建议：匹配时做单位规范化（同义词映射），或强制以 scaleType.unit 为准并返回提示。

### 4) “适用标签”写了区间表达（如 YI-04~07）但数据上是数组

Spec 里写区间很直观，但落库需要展开，否则后端很难判断 tagCode 是否在范围内。

✅ 建议：初始化 JSON 里必须是“展开后的数组”，Spec 里可以保留区间写法但注明“仅文档展示”。

### 5) 你缺一个“输出字段”用于指标归集：`rangeIndex`/`rank`

你目前只有 code/name。后续做排序、分组、回归趋势线时，最好有一个数值序号，例如 XS=1, ZX=2...

✅ 建议：在 `scale_range` 增加 `rank:number` 或复用 sortOrder 但明确“sortOrder=从小到大且不可随意改”。

### 6) 手动调整“不覆盖”需要落库字段（否则只是口头规则）

你写了“手动调整需记录原因，不会被覆盖”，但没有实体字段支撑。

✅ 建议：新增 `building_scale_binding`（单体 ↔ 分档结果快照），并带 `source / locked / reason / snapshotVersion`，和你 Tag 的绑定表一致风格。

---

# V1.1 补丁章节（建议你直接贴进本 Spec）

## 11. V1.1 Patch：分档结果落库、区间校验、单位一致性、自定义档位治理

### 11.1 新增：单体规模分档绑定表（building_scale_binding）

> 目的：把“自动匹配结果 + 手动调整 + 不覆盖”变成可追溯数据资产，供 14 指标计算直接引用。

```typescript
interface BuildingScaleBinding {
  id: string;                      // UUID
  buildingId: string;              // 单体ID
  functionTagCode: string;         // 单体主功能标签（冗余，便于查询）
  
  scaleTypeId: string;             // 分档类型ID
  scaleTypeCode: string;           // AREA/BED/CLASS...
  scaleTypeUnit: string;           // m²/床/班...

  rangeId: string;                 // 档位ID
  rangeCode: string;               // XS/BED-DX...
  rangeName: string;               // 小型/大型...
  rangeText: string;               // 3000-10000m²...

  actualValue: number;             // 用于匹配的实际值（面积或功能规模）
  valueSource: 'AREA' | 'FUNCTION';// 值来源：面积/功能规模

  source: 'AUTO' | 'MANUAL';       // 自动/人工
  locked: boolean;                 // 手动锁定后，重算不覆盖
  reason?: string;                 // 手动调整原因（MANUAL必填）

  snapshotVersion: number;         // 分档规则快照版本（见 11.2）
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
```

**约束（MUST）**

1. 同一 `buildingId` 同一时间仅允许 1 条 `active` 分档记录（如需多版本，走快照机制）。
2. `locked=true` 时，任何自动重算不得覆盖 `rangeId/rangeCode`。
3. `MANUAL` 时 `reason` 必填。

---

### 11.2 新增：分档规则快照版本（scale_rule_snapshot）

> 目的：解决“分档区间调整后，历史指标复算漂移”。

```typescript
interface ScaleRuleSnapshot {
  id: string;                // UUID
  version: number;           // 快照版本号（全局递增或按type递增）
  description: string;       // 变更说明
  createdAt: Date;
  createdBy: string;
}
```

**规则（MUST）**

* 每次对 `scale_range / tag_scale_config / 自定义档位` 的有效区间做变更，必须生成新快照版本。
* `building_scale_binding.snapshotVersion` 固化当时规则版本，保证可追溯与可复算。

---

### 11.3 强化：区间合法性校验（Range Validation）

**新增规则（MUST）**

1. 同一 `scaleTypeId` 下所有区间必须满足：

   * **不重叠**：任意两个区间不得同时满足同一数值
   * **严格递增**：按 `minValue` 从小到大排序
2. 若 `maxValue=-1`（无上限），必须为该类型最后一个档位。
3. 区间边界采用左闭右开：`minValue <= v < maxValue`（保持不变）。

---

### 11.4 强化：单位一致性与同义词归一（Unit Normalization）

**新增规则（MUST）**

1. 当选择 `scaleTypeCode=BED` 时，`functionalUnit` 必须归一到 `scale_type.unit="床"`；
2. 若输入单位无法归一（例如“张/位”未配置映射），匹配接口返回错误码并提示可接受单位。

**可选实现（SHOULD）**

* 增加单位同义词映射表 `unit_alias`：如 `床位 -> 床`，`座 -> 座位`。

---

### 11.5 治理：自定义档位的推荐做法（Override Set）

> 目的：避免每个标签自定义一套档位导致不可比。

**建议（SHOULD）**

* 将 `tag_scale_config.customRanges` 迁移为“引用某个 OverrideSet”，例如：

  * `overrideSetId` 指向 `scale_range_override_set`
  * OverrideSet 可配置审批、版本、生效时间
* 若暂不迁移，至少要求 `customRanges` 变更同样触发 `scale_rule_snapshot` 升级。

---

## 总结一句

你这份已经很接近“可直接进 14 指标计算”的形态了。**只要补上两个绑定表思路**（功能标签绑定你已经有补丁；规模分档绑定我在上面给了），再加上**规则快照版本**，你后面的“指标可追溯、可复算、可对齐”就稳了。

如果你下一步要写《14_Index_Calculation_Spec》，我建议第一章就把这三件事作为“前置依赖”列出来：

* 单体主/辅功能标签绑定（含权重、快照）
* 单体规模分档绑定（含锁定、快照）
* 分档规则快照（可复算）
