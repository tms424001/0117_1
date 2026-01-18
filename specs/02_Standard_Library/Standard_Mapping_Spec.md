# 空间与专业映射规范 (Standard Mapping Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：02_Standard_Library

---

## 1. 概述

### 1.1 目的
空间分类（一级子目）与专业分类（二级子目）是造价指标的核心归集维度，通过标准化的分类和映射规则，实现：
- 设计维度（功能空间）与造价维度（计价专业）的对接
- 历史数据按统一口径归集
- 指标的多维度分析和对比

### 1.2 设计原则

**空间分类原则：**
- 空间是估算阶段最早确定的信息
- 空间决定造价的"大盘子"
- 空间边界清晰，不会重叠

**专业分类原则：**
- 专业是造价数据的天然归集口径
- 专业对应设计分工
- 专业对应施工分包

### 1.3 术语定义

| 术语 | 定义 |
|------|------|
| 空间分类 | 按建筑物理位置划分的一级子目（地上/地下/室外） |
| 专业分类 | 按工程专业类别划分的二级子目（土建/安装等） |
| 造价归集 | 将原始清单数据按空间和专业维度汇总的过程 |
| 映射规则 | 将原始数据分类名称映射到标准分类的规则 |

### 1.4 分类层级关系

```
单体工程
├── 一级子目：空间分类
│   ├── 地上 (DS)
│   │   ├── 二级子目：专业分类
│   │   │   ├── 土建 (TJ)
│   │   │   ├── 给排水 (GPS)
│   │   │   ├── 强电 (QD)
│   │   │   └── ...
│   │   └── 
│   ├── 地下 (DX)
│   │   └── 二级子目：专业分类
│   │       └── ...
│   └── 室外 (SW)
│       └── 二级子目：专业分类
│           └── ...
└──
```

---

## 2. 空间分类（一级子目）

### 2.1 数据模型

```typescript
interface SpaceCategory {
  id: string;                    // 主键UUID
  code: string;                  // 空间编码，如 "DS"
  name: string;                  // 空间名称，如 "地上"
  fullName: string;              // 完整名称，如 "地上部分"
  description: string;           // 描述说明
  
  // 面积计算
  areaField: string;             // 对应面积字段，如 "aboveGroundArea"
  areaCalculation: string;       // 面积计算规则说明
  
  // 识别规则
  identifyKeywords: string[];    // 识别关键字
  identifyRules: IdentifyRule[]; // 识别规则
  
  // 适用专业
  applicableProfessions: string[]; // 适用的专业编码列表
  
  // 显示
  icon: string;                  // 图标
  color: string;                 // 主题色
  sortOrder: number;             // 排序号
  
  // 系统字段
  isSystem: boolean;             // 是否系统内置
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface IdentifyRule {
  field: string;                 // 判断字段：floorNumber/name/path
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'contains' | 'startsWith' | 'regex';
  value: string | number;        // 判断值
  priority: number;              // 优先级
}
```

### 2.2 空间分类清单

| 编码 | 名称 | 完整名称 | 说明 | 面积字段 |
|------|------|----------|------|----------|
| DS | 地上 | 地上部分 | 正负零及以上部分 | aboveGroundArea |
| DX | 地下 | 地下部分 | 正负零以下部分 | undergroundArea |
| SW | 室外 | 室外部分 | 建筑红线内室外工程 | outdoorArea |
| QT | 其他 | 其他部分 | 无法归类的部分 | - |

### 2.3 空间分类详细定义

#### 2.3.1 地上 (DS)

**定义：** 建筑物正负零标高及以上的部分。

**包含内容：**
- 地上各层建筑结构
- 地上各层装饰装修
- 地上各层安装工程
- 屋面工程
- 幕墙工程（地上部分）

**面积计算：**
- 按《建筑工程建筑面积计算规范》GB/T 50353计算地上建筑面积
- 包含：标准层面积、阳台面积、架空层面积等

**识别关键字：**
```
地上, 正负零以上, 首层, 标准层, 裙楼, 塔楼, 屋面, 屋顶
层号 >= 1
```

#### 2.3.2 地下 (DX)

**定义：** 建筑物正负零标高以下的部分。

**包含内容：**
- 地下各层建筑结构
- 地下各层装饰装修
- 地下各层安装工程
- 基础工程（桩基、筏板等）
- 基坑支护工程
- 地基处理工程
- 人防工程
- 地下室防水

**面积计算：**
- 按《建筑工程建筑面积计算规范》GB/T 50353计算地下建筑面积
- 包含：地下室各层面积

**识别关键字：**
```
地下, 负一层, 负二层, 地下室, 基础, 桩基, 基坑, 人防, 底板
层号 < 0 或 层号包含"负"、"B"
```

#### 2.3.3 室外 (SW)

**定义：** 建筑红线范围内，建筑物本体以外的室外工程。

**包含内容：**
- 室外道路及铺装
- 室外园林绿化
- 室外景观水景
- 室外给排水管网
- 室外电气管线
- 室外照明
- 围墙、大门
- 小品构筑物

**面积计算：**
- 室外面积 = 用地面积 - 建筑占地面积
- 或按实际铺装面积、绿化面积分别计算

**识别关键字：**
```
室外, 总平, 总坪, 场地, 道路, 绿化, 景观, 管网, 围墙, 大门
```

#### 2.3.4 其他 (QT)

**定义：** 无法明确归入以上三类的工程内容。

**包含内容：**
- 跨空间的工程项目
- 临时工程
- 其他难以归类的内容

**使用原则：**
- 尽量避免使用此分类
- 确需使用时应注明原因

---

## 3. 专业分类（二级子目）

### 3.1 数据模型

```typescript
interface ProfessionCategory {
  id: string;                    // 主键UUID
  code: string;                  // 专业编码，如 "TJ"
  name: string;                  // 专业简称，如 "土建"
  fullName: string;              // 专业全称，如 "建筑与装饰工程"
  description: string;           // 描述说明
  
  // 适用空间
  applicableSpaces: string[];    // 适用的空间编码，如 ["DS", "DX"]
  
  // 包含/排除内容
  includeItems: string[];        // 包含的工程内容
  excludeItems: string[];        // 不包含的工程内容
  
  // 映射规则
  mappingKeywords: string[];     // 映射关键字
  mappingRules: MappingRule[];   // 详细映射规则
  
  // 指标单位
  defaultUnit: string;           // 默认计量单位
  alternativeUnits: string[];    // 可选计量单位
  
  // 显示
  icon: string;
  color: string;
  sortOrder: number;
  
  // 分组
  groupCode: string;             // 分组编码：BUILD/INSTALL/OUTDOOR
  groupName: string;             // 分组名称：建筑/安装/室外
  
  // 系统字段
  isSystem: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface MappingRule {
  sourcePattern: string;         // 源名称匹配模式（支持正则）
  matchType: 'exact' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  confidence: number;            // 置信度 0-1
  priority: number;              // 优先级
}
```

### 3.2 专业分类清单

#### 3.2.1 地上/地下通用专业

| 编码 | 简称 | 全称 | 分组 | 适用空间 |
|------|------|------|------|----------|
| TJ | 土建 | 建筑与装饰工程 | 建筑 | DS, DX |
| GPS | 给排水 | 给排水工程 | 安装 | DS, DX |
| QD | 强电 | 强电工程 | 安装 | DS, DX |
| RD | 弱电 | 弱电工程 | 安装 | DS, DX |
| NT | 暖通 | 暖通空调工程 | 安装 | DS, DX |
| XF | 消防 | 消防工程 | 安装 | DS, DX |
| DT | 电梯 | 电梯工程 | 安装 | DS, DX |
| RF | 人防 | 人防工程 | 建筑 | DX |
| ZH | 智能化 | 智能化系统 | 安装 | DS, DX |
| GF | 光伏 | 光伏发电工程 | 安装 | DS |
| JC | 基础 | 地基基础工程 | 建筑 | DX |
| MQ | 幕墙 | 幕墙工程 | 建筑 | DS |
| JZ | 精装 | 精装修工程 | 建筑 | DS, DX |

#### 3.2.2 室外专用专业

| 编码 | 简称 | 全称 | 分组 | 适用空间 |
|------|------|------|------|----------|
| SW-TJ | 室外土建 | 室外土建工程 | 室外 | SW |
| SW-LH | 园林绿化 | 园林绿化工程 | 室外 | SW |
| SW-JG | 景观 | 景观工程 | 室外 | SW |
| SW-GPS | 室外给排水 | 室外给排水工程 | 室外 | SW |
| SW-XF | 室外消防 | 室外消防工程 | 室外 | SW |
| SW-QRD | 室外电气 | 室外电气工程 | 室外 | SW |
| SW-ZM | 室外照明 | 室外照明工程 | 室外 | SW |
| SW-RQ | 室外燃气 | 室外燃气工程 | 室外 | SW |

### 3.3 专业分类详细定义

#### 3.3.1 土建 (TJ)

**全称：** 建筑与装饰工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 土石方工程（非单独发包）
- 地基处理工程（非单独发包）
- 桩基工程（非单独发包）
- 基坑支护工程（非单独发包）
- 砌筑工程
- 混凝土及钢筋混凝土工程
- 钢结构工程
- 金属结构工程
- 木结构工程
- 门窗工程（非幕墙）
- 屋面及防水工程
- 保温隔热工程
- 楼地面工程
- 墙柱面工程
- 天棚工程
- 油漆涂料工程
- 其他装饰工程

**不包含内容：**
- 幕墙工程（单独分类）
- 精装修工程（单独分类）
- 基础工程（单独发包时）
- 安装工程

**映射关键字：**
```
建筑, 装饰, 土建, 结构, 建筑与装饰, 土方, 砌筑, 混凝土, 
钢筋, 模板, 门窗, 屋面, 防水, 保温, 楼地面, 墙面, 天棚, 
涂料, 抹灰, 贴砖
```

#### 3.3.2 给排水 (GPS)

**全称：** 给排水工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 给水系统（生活给水、生产给水）
- 排水系统（污水、废水、雨水）
- 热水系统
- 中水系统
- 直饮水系统
- 游泳池水处理系统（如有）
- 卫生器具安装
- 管道及附件

**不包含内容：**
- 室外给排水管网（归入SW-GPS）
- 消防给水（归入XF）
- 医疗纯水系统（归入专项）

**映射关键字：**
```
给排水, 给水, 排水, 热水, 中水, 直饮水, 卫生器具, 
洁具, 水泵, 管道, 阀门, 水表
```

#### 3.3.3 强电 (QD)

**全称：** 强电工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 变配电系统
- 动力配电系统
- 照明系统
- 电气设备安装
- 电缆电线敷设
- 桥架安装
- 防雷接地系统
- 电气竖井

**不包含内容：**
- 室外电力管线（归入SW-QRD）
- 弱电系统（归入RD）
- 消防电气（归入XF）

**映射关键字：**
```
强电, 电气, 供配电, 变配电, 动力, 照明, 电缆, 桥架, 
防雷, 接地, 配电箱, 配电柜
```

#### 3.3.4 弱电 (RD)

**全称：** 弱电工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 综合布线系统
- 计算机网络系统
- 电话通信系统
- 有线电视系统
- 公共广播系统
- 楼宇自控系统（BAS）
- 安全防范系统（不含消防）
- 门禁系统
- 停车场管理系统
- 信息发布系统
- 会议系统

**不包含内容：**
- 消防报警系统（归入XF）
- 医疗专用弱电系统（归入专项）

**映射关键字：**
```
弱电, 智能化, 综合布线, 网络, 电话, 电视, 广播, 
楼宇自控, BAS, 安防, 监控, 门禁, 停车管理
```

#### 3.3.5 暖通 (NT)

**全称：** 暖通空调工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 采暖系统
- 通风系统
- 空调系统（冷热源、末端、管道）
- 防排烟系统（非消防要求部分）
- 空调设备安装
- 风管制作安装
- 水管安装
- 保温

**不包含内容：**
- 消防防排烟系统（归入XF）
- 室外供热管网（归入室外）

**映射关键字：**
```
暖通, 空调, 采暖, 通风, 供暖, 制冷, 冷热源, 风机盘管, 
新风, 风管, 冷冻水, 冷却水, VRV, 多联机
```

#### 3.3.6 消防 (XF)

**全称：** 消防工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 火灾自动报警系统
- 消防联动控制系统
- 自动喷水灭火系统
- 气体灭火系统
- 消火栓系统（室内）
- 防排烟系统（消防要求部分）
- 应急照明及疏散指示
- 消防广播系统
- 消防电话系统
- 灭火器配置

**不包含内容：**
- 室外消防管网（归入SW-XF）
- 消防水池及泵房（可归入SW-XF或单独）

**映射关键字：**
```
消防, 火灾报警, 喷淋, 气体灭火, 消火栓, 防排烟, 
应急照明, 疏散指示, 消防广播, 灭火器
```

#### 3.3.7 电梯 (DT)

**全称：** 电梯工程

**适用空间：** 地上(DS)、地下(DX)

**包含内容：**
- 客梯
- 货梯
- 消防电梯
- 医用电梯
- 自动扶梯
- 自动人行道
- 电梯井道装修（部分）

**不包含内容：**
- 电梯井道土建工程（归入TJ）

**映射关键字：**
```
电梯, 客梯, 货梯, 消防梯, 医梯, 扶梯, 人行道
```

#### 3.3.8 人防 (RF)

**全称：** 人防工程

**适用空间：** 地下(DX)

**包含内容：**
- 人防门（防护门、密闭门）
- 人防封堵
- 人防通风系统
- 人防给排水系统
- 人防电气系统
- 人防装修

**映射关键字：**
```
人防, 防护, 密闭, 人防门, 人防通风, 人防电气
```

#### 3.3.9 智能化 (ZH)

**全称：** 智能化系统

**适用空间：** 地上(DS)、地下(DX)

**说明：** 当弱电系统作为独立分包时使用此分类，与RD（弱电）二选一。

**包含内容：** 同弱电(RD)

**映射关键字：**
```
智能化, 智能化系统, 智能化集成
```

#### 3.3.10 基础 (JC)

**全称：** 地基基础工程

**适用空间：** 地下(DX)

**说明：** 当基础工程作为独立分包时使用此分类。

**包含内容：**
- 桩基工程
- 地基处理工程
- 基坑支护工程
- 土石方工程
- 降水工程

**映射关键字：**
```
桩基, 基础, 地基处理, 基坑支护, 土石方, 降水
```

#### 3.3.11 室外土建 (SW-TJ)

**全称：** 室外土建工程

**适用空间：** 室外(SW)

**包含内容：**
- 室外道路
- 广场铺装
- 停车场（地面）
- 挡土墙
- 围墙
- 大门
- 旗台
- 室外台阶、坡道

**映射关键字：**
```
室外土建, 道路, 广场, 铺装, 停车场, 挡墙, 围墙, 
大门, 旗台, 台阶
```

#### 3.3.12 园林绿化 (SW-LH)

**全称：** 园林绿化工程

**适用空间：** 室外(SW)

**包含内容：**
- 乔木种植
- 灌木种植
- 地被草坪
- 花卉种植
- 绿化土方
- 绿化给水（浇灌系统）

**映射关键字：**
```
园林, 绿化, 种植, 乔木, 灌木, 草坪, 地被, 浇灌
```

#### 3.3.13 景观 (SW-JG)

**全称：** 景观工程

**适用空间：** 室外(SW)

**包含内容：**
- 景观小品
- 雕塑
- 花坛花池
- 景观构筑物
- 水景（喷泉、水池、叠水）
- 景观照明

**映射关键字：**
```
景观, 小品, 雕塑, 花坛, 水景, 喷泉, 叠水
```

#### 3.3.14 室外给排水 (SW-GPS)

**全称：** 室外给排水工程

**适用空间：** 室外(SW)

**包含内容：**
- 室外给水管网
- 室外雨水管网
- 室外污水管网
- 室外检查井
- 化粪池
- 隔油池

**映射关键字：**
```
室外给排水, 室外给水, 室外排水, 室外雨水, 室外污水,
检查井, 化粪池, 隔油池, 总坪给排水
```

#### 3.3.15 室外消防 (SW-XF)

**全称：** 室外消防工程

**适用空间：** 室外(SW)

**包含内容：**
- 室外消防管网
- 室外消火栓
- 消防水池
- 消防泵房

**映射关键字：**
```
室外消防, 消防管网, 室外消火栓, 消防水池, 消防泵房,
总坪消防
```

#### 3.3.16 室外电气 (SW-QRD)

**全称：** 室外电气工程

**适用空间：** 室外(SW)

**包含内容：**
- 室外电力电缆
- 室外电缆沟/排管
- 室外弱电管线
- 室外配电设施

**映射关键字：**
```
室外电气, 室外强电, 室外弱电, 室外电力, 室外电缆,
总坪强弱电
```

#### 3.3.17 室外照明 (SW-ZM)

**全称：** 室外照明工程

**适用空间：** 室外(SW)

**包含内容：**
- 路灯
- 庭院灯
- 草坪灯
- 景观照明灯具
- 照明控制系统

**映射关键字：**
```
室外照明, 路灯, 庭院灯, 草坪灯, 景观灯, 泛光照明
```

---

## 4. 映射规则引擎

### 4.1 映射规则表 (mapping_rule)

```typescript
interface MappingRule {
  id: string;
  
  // 目标分类
  targetType: 'space' | 'profession'; // 映射目标类型
  targetCode: string;            // 目标分类编码
  
  // 匹配条件
  sourceField: 'name' | 'path' | 'code'; // 源字段
  sourcePattern: string;         // 匹配模式
  matchType: 'exact' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  caseSensitive: boolean;        // 是否区分大小写
  
  // 优先级与置信度
  priority: number;              // 优先级，越大越优先
  confidence: number;            // 置信度 0-1
  
  // 附加条件
  spaceCondition: string;        // 空间前置条件，如专业映射时需先确定空间
  
  // 系统字段
  isSystem: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 预置映射规则

#### 4.2.1 空间映射规则

| 源匹配模式 | 匹配类型 | 目标空间 | 优先级 | 置信度 |
|------------|----------|----------|--------|--------|
| `^地下.*层` | regex | DX | 100 | 1.0 |
| `^负\d+层` | regex | DX | 100 | 1.0 |
| `^B\d+` | regex | DX | 100 | 1.0 |
| `地下室` | contains | DX | 90 | 0.95 |
| `地下` | contains | DX | 80 | 0.9 |
| `基础` | contains | DX | 80 | 0.9 |
| `桩基` | contains | DX | 80 | 0.95 |
| `人防` | contains | DX | 80 | 0.95 |
| `室外` | contains | SW | 90 | 0.95 |
| `总平` | contains | SW | 90 | 0.95 |
| `总坪` | contains | SW | 90 | 0.95 |
| `场地` | contains | SW | 80 | 0.85 |
| `绿化` | contains | SW | 80 | 0.9 |
| `景观` | contains | SW | 80 | 0.9 |
| `围墙` | contains | SW | 80 | 0.9 |
| `地上` | contains | DS | 70 | 0.85 |
| `标准层` | contains | DS | 80 | 0.9 |
| `裙楼` | contains | DS | 80 | 0.9 |
| `塔楼` | contains | DS | 80 | 0.9 |
| `屋面` | contains | DS | 80 | 0.9 |

#### 4.2.2 专业映射规则

| 源匹配模式 | 匹配类型 | 目标专业 | 适用空间 | 优先级 |
|------------|----------|----------|----------|--------|
| `建筑与装饰` | contains | TJ | DS,DX | 100 |
| `土建` | exact | TJ | DS,DX | 95 |
| `建筑工程` | contains | TJ | DS,DX | 90 |
| `装饰装修` | contains | TJ | DS,DX | 90 |
| `结构工程` | contains | TJ | DS,DX | 85 |
| `给排水` | contains | GPS | DS,DX | 100 |
| `给水排水` | contains | GPS | DS,DX | 95 |
| `水暖` | contains | GPS | DS,DX | 80 |
| `强电` | contains | QD | DS,DX | 100 |
| `电气工程` | contains | QD | DS,DX | 85 |
| `供配电` | contains | QD | DS,DX | 90 |
| `照明工程` | contains | QD | DS,DX | 85 |
| `弱电` | contains | RD | DS,DX | 100 |
| `智能化` | contains | RD | DS,DX | 90 |
| `暖通` | contains | NT | DS,DX | 100 |
| `空调` | contains | NT | DS,DX | 90 |
| `通风` | contains | NT | DS,DX | 85 |
| `消防` | contains | XF | DS,DX | 100 |
| `火灾报警` | contains | XF | DS,DX | 95 |
| `喷淋` | contains | XF | DS,DX | 90 |
| `电梯` | contains | DT | DS,DX | 100 |
| `扶梯` | contains | DT | DS,DX | 95 |
| `人防` | contains | RF | DX | 100 |
| `光伏` | contains | GF | DS | 100 |
| `幕墙` | contains | MQ | DS | 100 |
| `精装` | contains | JZ | DS,DX | 100 |
| `桩基` | contains | JC | DX | 95 |
| `地基处理` | contains | JC | DX | 95 |
| `基坑支护` | contains | JC | DX | 95 |
| `园林绿化` | contains | SW-LH | SW | 100 |
| `绿化工程` | contains | SW-LH | SW | 95 |
| `种植` | contains | SW-LH | SW | 85 |
| `景观工程` | contains | SW-JG | SW | 100 |
| `水景` | contains | SW-JG | SW | 90 |
| `小品` | contains | SW-JG | SW | 85 |
| `室外给排水` | contains | SW-GPS | SW | 100 |
| `总坪给排水` | contains | SW-GPS | SW | 100 |
| `室外消防` | contains | SW-XF | SW | 100 |
| `总坪消防` | contains | SW-XF | SW | 100 |
| `消防水池` | contains | SW-XF | SW | 95 |
| `室外强弱电` | contains | SW-QRD | SW | 100 |
| `总坪强弱电` | contains | SW-QRD | SW | 100 |
| `室外照明` | contains | SW-ZM | SW | 100 |
| `路灯` | contains | SW-ZM | SW | 90 |

### 4.3 映射算法

```typescript
/**
 * 自动映射原始分类到标准分类
 * @param originalName 原始分类名称
 * @param originalPath 原始层级路径
 * @returns 映射结果
 */
function autoMapping(
  originalName: string,
  originalPath: string
): MappingResult {
  
  // 1. 先确定空间分类
  const spaceResult = matchSpace(originalName, originalPath);
  
  // 2. 再确定专业分类（需要空间作为前置条件）
  const professionResult = matchProfession(
    originalName, 
    originalPath,
    spaceResult.code
  );
  
  return {
    space: spaceResult,
    profession: professionResult,
    confidence: Math.min(spaceResult.confidence, professionResult.confidence),
    needsReview: spaceResult.confidence < 0.8 || professionResult.confidence < 0.8
  };
}

function matchSpace(name: string, path: string): MatchResult {
  const rules = getActiveRules('space');
  const sortedRules = rules.sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    const source = rule.sourceField === 'name' ? name : path;
    if (matchPattern(source, rule.sourcePattern, rule.matchType)) {
      return {
        code: rule.targetCode,
        name: getSpaceName(rule.targetCode),
        confidence: rule.confidence,
        matchedRule: rule.id
      };
    }
  }
  
  // 默认归入地上
  return {
    code: 'DS',
    name: '地上',
    confidence: 0.5,
    matchedRule: null
  };
}

function matchProfession(
  name: string, 
  path: string,
  spaceCode: string
): MatchResult {
  const rules = getActiveRules('profession')
    .filter(r => !r.spaceCondition || r.spaceCondition.includes(spaceCode));
  const sortedRules = rules.sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    const source = rule.sourceField === 'name' ? name : path;
    if (matchPattern(source, rule.sourcePattern, rule.matchType)) {
      return {
        code: rule.targetCode,
        name: getProfessionName(rule.targetCode),
        confidence: rule.confidence,
        matchedRule: rule.id
      };
    }
  }
  
  // 默认归入土建
  return {
    code: spaceCode === 'SW' ? 'SW-TJ' : 'TJ',
    name: spaceCode === 'SW' ? '室外土建' : '土建',
    confidence: 0.3,
    matchedRule: null
  };
}
```

---

## 5. 空间与专业的交叉关系

### 5.1 有效组合矩阵

| 空间\专业 | TJ | GPS | QD | RD | NT | XF | DT | RF | ZH | GF | JC | MQ | JZ | SW-* |
|-----------|:--:|:---:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:----:|
| 地上(DS)  | ✓  | ✓   | ✓  | ✓  | ✓  | ✓  | ✓  | -  | ✓  | ✓  | -  | ✓  | ✓  | -    |
| 地下(DX)  | ✓  | ✓   | ✓  | ✓  | ✓  | ✓  | ✓  | ✓  | ✓  | -  | ✓  | -  | ✓  | -    |
| 室外(SW)  | -  | -   | -  | -  | -  | -  | -  | -  | -  | -  | -  | -  | -  | ✓    |

### 5.2 典型单体的专业构成

#### 5.2.1 住院楼（医疗）

| 空间 | 专业构成 | 典型占比 |
|------|----------|----------|
| 地上 | TJ, GPS, QD, RD, NT, XF, DT, JZ | 70-75% |
| 地下 | TJ, GPS, QD, RD, NT, XF, RF | 25-30% |

#### 5.2.2 教学楼（教育）

| 空间 | 专业构成 | 典型占比 |
|------|----------|----------|
| 地上 | TJ, GPS, QD, RD, NT, XF | 85-95% |
| 地下 | TJ, GPS, QD, XF | 5-15% |

#### 5.2.3 办公楼

| 空间 | 专业构成 | 典型占比 |
|------|----------|----------|
| 地上 | TJ, GPS, QD, RD, NT, XF, DT, MQ | 65-75% |
| 地下 | TJ, GPS, QD, RD, NT, XF, RF | 25-35% |

---

## 6. UI组件规范

### 6.1 空间选择器 (SpaceSelector)

```typescript
interface SpaceSelectorProps {
  value?: string;
  onChange?: (code: string, space: SpaceCategory) => void;
  disabled?: boolean;
  mode?: 'dropdown' | 'button-group';
  size?: 'small' | 'middle' | 'large';
}
```

**视觉规范：**
```
按钮组模式：
┌────────┬────────┬────────┬────────┐
│  地上  │  地下  │  室外  │  其他  │
└────────┴────────┴────────┴────────┘
    ▲
  选中态
```

### 6.2 专业选择器 (ProfessionSelector)

```typescript
interface ProfessionSelectorProps {
  value?: string;
  onChange?: (code: string, profession: ProfessionCategory) => void;
  spaceCode?: string;            // 限制可选的专业（基于空间）
  disabled?: boolean;
  mode?: 'dropdown' | 'checkbox-group';
  multiple?: boolean;            // 是否多选
  size?: 'small' | 'middle' | 'large';
}
```

**视觉规范：**
```
下拉模式：
┌─────────────────────────────────┐
│ 土建                        ▼  │
├─────────────────────────────────┤
│ 【建筑类】                      │
│   ○ 土建                        │
│   ○ 幕墙                        │
│   ○ 精装                        │
│ 【安装类】                      │
│   ○ 给排水                      │
│   ○ 强电                        │
│   ○ 弱电│ 
  ○ 暖通                        │
│   ○ 消防                        │
│   ○ 电梯                        │
└─────────────────────────────────┘
```

### 6.3 归集预览组件 (AggregationPreview)

```typescript
interface AggregationPreviewProps {
  data: AggregationData[];
  showPercentage?: boolean;
  showChart?: boolean;
}

interface AggregationData {
  spaceCode: string;
  spaceName: string;
  professionCode: string;
  professionName: string;
  cost: number;
  area: number;
  unitCost: number;
}
```

**视觉规范：**
```
┌─────────────────────────────────────────────────────────────┐
│  造价归集预览                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ 按空间 ─────────────────┐  ┌─ 按专业 ─────────────────┐ │
│  │                          │  │                          │ │
│  │  地上 ████████████ 68%   │  │  土建 ████████████ 55%   │ │
│  │  地下 ████████ 27%       │  │  安装 ████████ 35%       │ │
│  │  室外 ██ 5%              │  │  其他 ██ 10%             │ │
│  │                          │  │                          │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                             │
│  ┌─ 明细 ───────────────────────────────────────────────┐  │
│  │ 空间 │ 专业   │ 金额(万元) │ 面积(m²) │ 单方  │ 占比  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 地上 │ 土建   │ 8,500     │ 25,000  │ 3,400 │ 38%  │  │
│  │ 地上 │ 给排水 │ 450       │ 25,000  │ 180   │ 2%   │  │
│  │ ... │ ...    │ ...       │ ...     │ ...   │ ...  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. API接口

### 7.1 获取空间分类列表

```
GET /api/v1/spaces
```

**响应示例：**
```json
{
  "code": 0,
  "data": [
    {
      "id": "sp-001",
      "code": "DS",
      "name": "地上",
      "fullName": "地上部分",
      "description": "正负零及以上部分",
      "areaField": "aboveGroundArea",
      "applicableProfessions": ["TJ", "GPS", "QD", "RD", "NT", "XF", "DT", "ZH", "GF", "MQ", "JZ"],
      "sortOrder": 1,
      "status": "active"
    }
  ]
}
```

### 7.2 获取专业分类列表

```
GET /api/v1/professions
```

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| spaceCode | string | 否 | 按空间筛选适用的专业 |
| groupCode | string | 否 | 按分组筛选 |

### 7.3 自动映射

```
POST /api/v1/mappings/auto
```

**请求体：**
```json
{
  "items": [
    {
      "id": "item-001",
      "name": "建筑与装饰工程",
      "path": "幼儿园用房/建筑与装饰工程"
    },
    {
      "id": "item-002",
      "name": "地下室给排水工程",
      "path": "幼儿园用房/地下室/给排水工程"
    }
  ]
}
```

**响应示例：**
```json
{
  "code": 0,
  "data": [
    {
      "id": "item-001",
      "space": { "code": "DS", "name": "地上", "confidence": 0.85 },
      "profession": { "code": "TJ", "name": "土建", "confidence": 0.98 },
      "overallConfidence": 0.85,
      "needsReview": false
    },
    {
      "id": "item-002",
      "space": { "code": "DX", "name": "地下", "confidence": 0.95 },
      "profession": { "code": "GPS", "name": "给排水", "confidence": 0.98 },
      "overallConfidence": 0.95,
      "needsReview": false
    }
  ]
}
```

### 7.4 获取映射规则

```
GET /api/v1/mappings/rules
```

### 7.5 添加映射规则（管理员）

```
POST /api/v1/mappings/rules
```

---

## 8. 业务规则

### 8.1 映射优先级规则

1. 用户手动指定 > 自动映射
2. 高置信度规则 > 低置信度规则
3. 精确匹配 > 模糊匹配
4. 高优先级规则 > 低优先级规则

### 8.2 空间判定规则

1. 层号 < 0 或名称包含"地下/负/B" → 地下
2. 名称包含"室外/总平/场地" → 室外
3. 其他情况 → 地上
4. 无法判定时标记为"待确认"

### 8.3 专业判定规则

1. 先根据空间确定可选专业范围
2. 再根据名称关键字匹配专业
3. 匹配不到时，建筑类默认归入土建，室外类默认归入室外土建

### 8.4 数据完整性规则

1. 每条造价数据必须有空间和专业分类
2. 空间和专业组合必须在有效矩阵内
3. 分类变更需记录变更历史

---

## 9. 初始化数据

系统初始化时需导入：
- 4个空间分类
- 21个专业分类
- 约100条映射规则

数据文件位置：`/data/init/standard_mappings.json`

---

## 10. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |



这份《空间与专业映射规范》质量很高，属于**9.1/10**：结构清晰、数据模型完整、规则表+预置规则+算法+组合矩阵+UI+API，一条龙都给 Windsurf 了，基本可以直接开干。

我只挑**会在真实数据里“翻车”的 6 个点**，然后给你一段 **V1.1 Patch 章节**（可直接贴到文档末尾），把它从“能跑”升级到“跑得稳、可追溯、可治理”。

---

## 会翻车的点（真实项目一定遇到）

### 1) DS/DX/SW 的判定不能“默认 DS”

你现在 `matchSpace()` 最后默认 DS，置信度 0.5。现实里一堆“措施费/临设/总包服务费/降水”等跨空间项，会被硬塞进 DS，后续指标会偏。

✅ 建议：默认应为 `QT`（其他/待确认），并强制 needsReview。

### 2) `spaceCondition` 字段设计不严谨

你在规则表里用 string 表达“适用空间”，但在算法里用 `includes(spaceCode)` 去过滤，容易被字符串误伤（比如 “DS,DX” includes “D”）。

✅ 建议：把它改成 `applicableSpaces: string[]`（数组），或单独字段 `spaceCodes`.

### 3) 专业分类里 RD vs ZH 是“二选一”，但你现在规则会同时命中

你同时写了“弱电=RD”“智能化也可能归 RD”“另外还有 ZH 智能化（独立分包时）”。真实数据里“智能化系统”会被映射到 RD，ZH 永远用不上，或者反过来乱跳。

✅ 建议：引入 **contractMode / packageMode** 条件：当项目设置“智能化独立分包=true”时，才启用 ZH；否则禁用 ZH，统一归 RD。

### 4) 专业映射应支持“多标签候选+冲突回审”

现在 `matchProfession` 找到第一条规则就 return，缺少：

* 多规则命中时的候选列表
* 冲突解释
* 低置信度阈值触发回审

✅ 建议：返回 topK candidates（至少前3）+ 冲突原因。

### 5) 缺“映射落库绑定表”（和你前面标准库映射一致）

你现在有规则表 `mapping_rule`，但没有把“每条原始项最终被判定为什么”的结果落库并可锁定。这样每次重算结果可能不同，难以追溯。

✅ 建议：新增 `entity_space_profession_binding`（源项 ↔ 空间/专业），带 source=AUTO/MANUAL, locked, snapshotVersion。

### 6) 规则版本/快照缺失

你前面标准库与规模分档我已经建议做 snapshotVersion，这里也一样：规则改了，历史归集口径就变了。

✅ 建议：增加 `mapping_rule_snapshot`，每次规则变更生成新快照版本。

---

# V1.1 Patch 章节（可直接贴）

## 11. V1.1 Patch：默认归类、规则字段规范、候选输出、分包模式、落库与快照

### 11.1 修正：空间默认归类策略（避免误塞 DS）

**变更（MUST）**

* 当空间无法判定时，默认归入 `QT`（其他/待确认），不得默认 DS。
* `QT` 的 `needsReview` 必须为 `true`。

**算法替换片段：**

```typescript
// 原逻辑：默认归入地上 DS
// 新逻辑：默认归入其他 QT，并强制回审
return {
  code: 'QT',
  name: '其他/待确认',
  confidence: 0.2,
  matchedRule: null
};
```

---

### 11.2 修正：spaceCondition 字段类型（string -> array）

将 `MappingRule` 中的 `spaceCondition: string` 替换为：

```typescript
interface MappingRule {
  // ...
  applicableSpaces?: string[]; // 如 ["DS","DX"]；空表示不限制
}
```

并同步修正过滤逻辑：

```typescript
const rules = getActiveRules('profession')
  .filter(r => !r.applicableSpaces || r.applicableSpaces.includes(spaceCode));
```

---

### 11.3 新增：项目分包模式参数（RD vs ZH 的治理开关）

> 目的：解决“弱电/智能化”在不同项目的归集口径差异。

新增项目级配置（可放在 ProjectSetting 或 MappingContext）：

```typescript
interface MappingContext {
  spaceCode?: string;
  packageMode?: {
    smartSystemIndependent: boolean; // 智能化是否独立分包
    foundationIndependent: boolean;  // 基础是否独立分包（影响 JC vs TJ）
    curtainWallIndependent: boolean; // 幕墙是否独立分包（影响 MQ）
    fitoutIndependent: boolean;      // 精装是否独立分包（影响 JZ）
  };
}
```

**规则（MUST）**

* `smartSystemIndependent=false` 时：禁用 ZH 规则，统一使用 RD。
* `smartSystemIndependent=true` 时：启用 ZH，并把“智能化系统/集成”等关键词优先映射到 ZH。

> 基础/幕墙/精装同理：是否独立分包决定走“独立专业”还是并入 TJ。

---

### 11.4 强化：专业映射输出候选（TopK + 冲突解释）

将 `matchProfession` 的输出升级为：

```typescript
interface MatchCandidate {
  code: string;
  name: string;
  confidence: number;
  priority: number;
  matchedRule: string;
  reason: string; // 简短解释，如 "contains: 给排水"
}

interface ProfessionMatchResult {
  best: MatchCandidate;
  candidates: MatchCandidate[];  // TopK（建议3-5）
  needsReview: boolean;
  conflictType?: 'MULTI_HIT' | 'LOW_CONFIDENCE';
}
```

**规则（MUST）**

* 若 Top1 与 Top2 置信度差值 < 0.1（或 priority 接近）→ `conflictType=MULTI_HIT`，强制回审。
* 若 Top1 置信度 < 0.8 → `conflictType=LOW_CONFIDENCE`，强制回审。

---

### 11.5 新增：映射结果落库绑定表（entity_space_profession_binding）

> 目的：保证“归集口径可追溯、可锁定、可复算”。

```typescript
type SourceEntityType = 'RAW_BOQ' | 'RAW_COST_ITEM' | 'RAW_PACKAGE';

interface EntitySpaceProfessionBinding {
  id: string;

  sourceType: SourceEntityType;
  sourceId: string;
  sourceName: string;
  sourcePath?: string;

  spaceCode: string;              // DS/DX/SW/QT
  professionCode: string;         // TJ/GPS/...
  overallConfidence: number;

  source: 'AUTO' | 'MANUAL';
  locked: boolean;                // true=重算不得覆盖
  reason?: string;                // MANUAL 必填

  matchedSpaceRuleId?: string;
  matchedProfessionRuleId?: string;

  snapshotVersion: number;        // 规则快照版本
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
```

**规则（MUST）**

* `locked=true` 的记录不得被自动映射覆盖。
* 自动映射只能生成 `AUTO + locked=false` 的候选；用户确认后才可锁定。

---

### 11.6 新增：规则快照版本（mapping_rule_snapshot）

```typescript
interface MappingRuleSnapshot {
  id: string;
  version: number;            // 全局或按 targetType 递增
  description: string;        // 变更说明
  createdAt: Date;
  createdBy: string;
}
```

**规则（MUST）**

* 每次规则有效变更（新增/修改/停用）必须生成新 `snapshotVersion`。
* 自动映射与落库绑定必须携带 `snapshotVersion`，用于历史复算与审计。

---

## 12. V1.1 Changelog

| 版本   | 日期         | 修订内容                                                                                                  |
| ---- | ---------- | ----------------------------------------------------------------------------------------------------- |
| V1.1 | 2026-01-17 | 默认空间无法判定归入QT；spaceCondition改为applicableSpaces数组；引入分包模式开关治理RD/ZH等口径；专业映射输出TopK候选与冲突回审；新增映射结果绑定表与规则快照版本 |

---

## 一句话评价

你这份 V1.0 已经“能跑”；打上以上补丁后，它会变成真正的**“可治理的归集口径引擎”**：

* 不会把不确定项硬塞 DS
* 能处理分包口径差异
* 有候选与冲突解释
* 结果可锁定、规则可快照、历史可复算

如果你下一步要把它接进 **14 指标计算**，我建议 14 直接依赖 `EntitySpaceProfessionBinding` 作为“归集维度的事实表”，这样计算链路会非常干净。
