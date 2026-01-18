# 指标聚合规范 (Index Aggregation Spec)

> 版本：V1.0  
> 更新日期：2026-01-18  
> 所属模块：05_Index_System（补充）

---

## 1. 概述

### 1.1 文档目的

本规范解决**核心流程断点**：个人指标（我的指标）如何转换为企业指标（企业指标库）。

### 1.2 指标流转全景

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   数据采集                    个人数据                     企业数据          │
│                                                                             │
│   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐        │
│   │  造价文件    │          │             │          │             │        │
│   │  ┌───────┐  │          │  我的项目    │          │  企业案例库  │        │
│   │  │ 解析  │──┼── 推送 ─▶│  (标签化)   │── PR ──▶│             │        │
│   │  └───────┘  │          │      │      │   审核   │             │        │
│   └─────────────┘          │      │      │          └─────────────┘        │
│                            │      ▼      │                                  │
│                            │ ┌─────────┐ │          ┌─────────────┐        │
│                            │ │指标计算 │ │          │             │        │
│                            │ └────┬────┘ │          │  企业指标库  │        │
│                            │      │      │          │  (聚合指标)  │        │
│                            │      ▼      │          │             │        │
│                            │  我的指标   │── PR ──▶│  ┌───────┐  │        │
│                            │  (原始指标) │   审核   │  │ 聚合  │  │        │
│                            │             │          │  └───────┘  │        │
│                            └─────────────┘          └─────────────┘        │
│                                                                             │
│   【关键问题】                                                               │
│   我的指标 ─────────────────────────────────────▶ 企业指标库               │
│            这一步是「直接入库」还是「聚合后入库」？                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 核心设计决策

**采用：原始入库 + 实时聚合 的混合模式**

| 存储层 | 说明 | 用途 |
|--------|------|------|
| **原始指标层** | 每个项目的原始指标数据 | 追溯、审计、明细查询 |
| **聚合指标层** | 按维度聚合的统计指标 | 估算匹配、统计分析 |

---

## 2. 指标层级定义

### 2.1 三层指标体系

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   Layer 1: 原始指标（Raw Index）                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  来源：单个项目的指标计算结果                                        │   │
│   │  粒度：项目级 / 单位工程级                                           │   │
│   │  特点：一个项目产生一条项目级指标 + N条单位工程指标                   │   │
│   │  示例：XX医院门诊楼，单方造价3,400元/m²，钢筋含量58.6kg/m²           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼ 聚合                                 │
│   Layer 2: 聚合指标（Aggregated Index）                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  来源：多个原始指标按维度聚合                                        │   │
│   │  维度：功能标签 × 规模档 × 地区 × 计价阶段                           │   │
│   │  特点：统计值（均值、中位数、分位数、标准差）                        │   │
│   │  示例：综合医院-大型-北京-招标控制价，样本数156，均值3,280元/m²      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼ 发布                                 │
│   Layer 3: 发布指标（Published Index）                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  来源：聚合指标经审核后发布                                          │   │
│   │  特点：版本化、带置信度、对外可用                                    │   │
│   │  示例：综合医院-大型-北京 v2026.01，推荐值3,250元/m²，置信度A        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 层级对应关系

| 层级 | 数据来源 | 存储位置 | 更新频率 |
|------|----------|----------|----------|
| 原始指标 | 我的指标 PR审核通过 | enterprise_index_raw | 实时 |
| 聚合指标 | 原始指标自动聚合 | enterprise_index_agg | 实时/定时 |
| 发布指标 | 聚合指标审核发布 | enterprise_index_pub | 人工触发 |

---

## 3. 原始指标入库

### 3.1 入库流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  我的指标 │ ─▶ │  提交PR  │ ─▶ │  PR审核  │ ─▶ │ 审核通过  │ ─▶ │ 原始入库  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                                     │
                                                                     ▼
                                                               ┌──────────┐
                                                               │ 触发聚合  │
                                                               └──────────┘
```

### 3.2 入库数据结构

**原始指标表 (enterprise_index_raw)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 主键 |
| tenant_id | VARCHAR(36) | 租户ID |
| source_project_id | VARCHAR(36) | 来源项目ID（我的项目） |
| index_level | VARCHAR(20) | 指标层级(project/unit) |
| function_tag_code | VARCHAR(50) | 功能标签编码 |
| scale_level | VARCHAR(20) | 规模档 |
| province | VARCHAR(50) | 省份 |
| city | VARCHAR(50) | 城市 |
| pricing_stage | VARCHAR(20) | 计价阶段 |
| price_date | DATE | 材价基准期 |
| building_area | DECIMAL(18,2) | 建筑面积 |
| total_cost | DECIMAL(18,2) | 工程总造价 |
| unit_cost | DECIMAL(18,2) | 单方造价 |
| steel_content | DECIMAL(10,2) | 钢筋含量 |
| concrete_content | DECIMAL(10,4) | 混凝土含量 |
| ... | ... | 其他指标字段 |
| pr_id | VARCHAR(36) | PR记录ID |
| created_at | TIMESTAMP | 入库时间 |

### 3.3 入库规则

| 规则 | 说明 |
|------|------|
| 唯一性 | 同一来源项目的指标不重复入库 |
| 完整性 | 必填字段校验（功能标签、地区、面积、造价） |
| 有效性 | 指标值范围校验（单方造价>0，含量≥0） |

---

## 4. 指标聚合机制

### 4.1 聚合维度

**核心维度（4维）：**

| 维度 | 字段 | 说明 |
|------|------|------|
| 功能标签 | function_tag_code | 三级标签取最细粒度 |
| 规模档 | scale_level | 7种规模分档 |
| 地区 | province | 省级 |
| 计价阶段 | pricing_stage | 5种计价阶段 |

**聚合粒度示例：**
```
综合医院 × 大型 × 北京 × 招标控制价 = 一个聚合指标
```

### 4.2 聚合统计量

对每个聚合维度组合，计算以下统计量：

| 统计量 | 字段 | 计算方法 |
|--------|------|----------|
| 样本数 | sample_count | COUNT(*) |
| 最小值 | min_value | MIN(unit_cost) |
| 最大值 | max_value | MAX(unit_cost) |
| 平均值 | avg_value | AVG(unit_cost) |
| 中位数 | median_value | PERCENTILE_CONT(0.5) |
| P25分位 | p25_value | PERCENTILE_CONT(0.25) |
| P75分位 | p75_value | PERCENTILE_CONT(0.75) |
| 标准差 | std_value | STDDEV(unit_cost) |
| 变异系数 | cv_value | STDDEV/AVG |

### 4.3 聚合触发机制

| 触发方式 | 说明 | 适用场景 |
|----------|------|----------|
| **实时聚合** | 新指标入库后立即触发 | 数据量小，实时性要求高 |
| **定时聚合** | 每天凌晨全量重算 | 数据量大，一致性要求高 |
| **手动聚合** | 管理员手动触发 | 数据修正后 |

**推荐：增量实时 + 定时全量**

```
新指标入库 ──▶ 增量更新受影响的聚合维度
每日凌晨  ──▶ 全量重算所有聚合指标
```

### 4.4 聚合SQL示例

```sql
-- 聚合单方造价指标
INSERT INTO enterprise_index_agg (
  tenant_id, function_tag_code, scale_level, province, pricing_stage,
  index_type, sample_count, min_value, max_value, avg_value, 
  median_value, p25_value, p75_value, std_value, cv_value,
  updated_at
)
SELECT 
  tenant_id,
  function_tag_code,
  scale_level,
  province,
  pricing_stage,
  'unit_cost' as index_type,
  COUNT(*) as sample_count,
  MIN(unit_cost) as min_value,
  MAX(unit_cost) as max_value,
  AVG(unit_cost) as avg_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_cost) as median_value,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY unit_cost) as p25_value,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY unit_cost) as p75_value,
  STDDEV(unit_cost) as std_value,
  CASE WHEN AVG(unit_cost) > 0 THEN STDDEV(unit_cost) / AVG(unit_cost) ELSE 0 END as cv_value,
  NOW() as updated_at
FROM enterprise_index_raw
WHERE tenant_id = :tenantId
  AND index_level = 'project'  -- 仅聚合项目级指标
GROUP BY tenant_id, function_tag_code, scale_level, province, pricing_stage
ON CONFLICT (tenant_id, function_tag_code, scale_level, province, pricing_stage, index_type)
DO UPDATE SET
  sample_count = EXCLUDED.sample_count,
  min_value = EXCLUDED.min_value,
  max_value = EXCLUDED.max_value,
  avg_value = EXCLUDED.avg_value,
  median_value = EXCLUDED.median_value,
  p25_value = EXCLUDED.p25_value,
  p75_value = EXCLUDED.p75_value,
  std_value = EXCLUDED.std_value,
  cv_value = EXCLUDED.cv_value,
  updated_at = EXCLUDED.updated_at;
```

---

## 5. 聚合指标数据模型

### 5.1 聚合指标表 (enterprise_index_agg)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 主键 |
| tenant_id | VARCHAR(36) | 租户ID |
| function_tag_code | VARCHAR(50) | 功能标签编码 |
| function_tag_name | VARCHAR(100) | 功能标签名称 |
| scale_level | VARCHAR(20) | 规模档 |
| province | VARCHAR(50) | 省份 |
| pricing_stage | VARCHAR(20) | 计价阶段 |
| index_type | VARCHAR(50) | 指标类型（unit_cost/steel_content等） |
| sample_count | INT | 样本数量 |
| min_value | DECIMAL(18,4) | 最小值 |
| max_value | DECIMAL(18,4) | 最大值 |
| avg_value | DECIMAL(18,4) | 平均值 |
| median_value | DECIMAL(18,4) | 中位数 |
| p25_value | DECIMAL(18,4) | P25分位数 |
| p75_value | DECIMAL(18,4) | P75分位数 |
| std_value | DECIMAL(18,4) | 标准差 |
| cv_value | DECIMAL(10,4) | 变异系数 |
| confidence_level | VARCHAR(10) | 置信等级（A/B/C） |
| updated_at | TIMESTAMP | 更新时间 |

### 5.2 置信等级计算

| 等级 | 样本数 | 变异系数 | 说明 |
|------|--------|----------|------|
| **A** | ≥30 | ≤0.15 | 高置信度，可直接使用 |
| **B** | ≥10 | ≤0.25 | 中置信度，建议参考 |
| **C** | ≥3 | ≤0.35 | 低置信度，仅供参考 |
| **D** | <3 | >0.35 | 不可信，样本不足 |

```sql
-- 置信等级计算
confidence_level = CASE
  WHEN sample_count >= 30 AND cv_value <= 0.15 THEN 'A'
  WHEN sample_count >= 10 AND cv_value <= 0.25 THEN 'B'
  WHEN sample_count >= 3 AND cv_value <= 0.35 THEN 'C'
  ELSE 'D'
END
```

---

## 6. 估算模块的指标匹配

### 6.1 匹配流程

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   估算输入                      指标匹配                    匹配结果      │
│   ┌────────────┐             ┌────────────┐            ┌────────────┐   │
│   │ 功能标签    │             │            │            │ 推荐指标值  │   │
│   │ 规模档      │ ──────────▶│  匹配引擎   │──────────▶│ 置信等级   │   │
│   │ 地区       │             │            │            │ 样本数量   │   │
│   │ 计价阶段    │             └────────────┘            │ 参考范围   │   │
│   └────────────┘                   │                   └────────────┘   │
│                                    │                                     │
│                    ┌───────────────┼───────────────┐                    │
│                    ▼               ▼               ▼                    │
│              ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│              │ 精确匹配  │   │ 降级匹配  │   │ 模糊匹配  │                │
│              │ (4维全匹配)│   │ (逐维降级)│   │ (仅功能标签)│               │
│              └──────────┘   └──────────┘   └──────────┘                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.2 匹配优先级

| 优先级 | 匹配策略 | 匹配条件 | 置信度调整 |
|--------|----------|----------|------------|
| 1 | 精确匹配 | 功能标签 + 规模档 + 地区 + 计价阶段 | 原始置信度 |
| 2 | 降级匹配1 | 功能标签 + 规模档 + 地区 | 置信度-1级 |
| 3 | 降级匹配2 | 功能标签 + 规模档 | 置信度-2级 |
| 4 | 降级匹配3 | 功能标签 + 地区 | 置信度-2级 |
| 5 | 模糊匹配 | 仅功能标签 | 固定为C级 |
| 6 | 无匹配 | - | 返回空，提示无数据 |

### 6.3 匹配接口

**请求：**
```json
POST /api/v1/enterprise/indexes/match
{
  "functionTagCode": "A0101",
  "scaleLevel": "large",
  "province": "北京",
  "pricingStage": "bidControl",
  "indexTypes": ["unit_cost", "steel_content", "concrete_content"]
}
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "matchLevel": 1,
    "matchStrategy": "精确匹配",
    "indexes": [
      {
        "indexType": "unit_cost",
        "indexName": "单方造价",
        "unit": "元/m²",
        "recommendValue": 3280,
        "minValue": 2650,
        "maxValue": 4200,
        "avgValue": 3280,
        "medianValue": 3250,
        "sampleCount": 156,
        "confidenceLevel": "A",
        "confidenceName": "高置信度"
      },
      {
        "indexType": "steel_content",
        "indexName": "钢筋含量",
        "unit": "kg/m²",
        "recommendValue": 54.6,
        "minValue": 42.5,
        "maxValue": 68.3,
        "avgValue": 54.6,
        "medianValue": 53.8,
        "sampleCount": 156,
        "confidenceLevel": "A",
        "confidenceName": "高置信度"
      }
    ],
    "matchCondition": {
      "functionTagCode": "A0101",
      "functionTagName": "综合医院",
      "scaleLevel": "large",
      "scaleLevelName": "大型",
      "province": "北京",
      "pricingStage": "bidControl",
      "pricingStageName": "招标控制价"
    }
  }
}
```

### 6.4 无匹配时的Fallback策略

| 策略 | 说明 | 实现 |
|------|------|------|
| 向上归类 | 使用父级功能标签 | 综合医院→医院→医疗建筑 |
| 相邻规模 | 使用相邻规模档 | 大型无数据→尝试中型或特大型 |
| 全国均值 | 不限地区 | 去掉地区条件重新匹配 |
| 人工干预 | 提示用户手动输入 | 返回空，UI提示"暂无数据" |

---

## 7. 数据一致性保障

### 7.1 一致性问题

| 问题 | 场景 | 解决方案 |
|------|------|----------|
| 延迟不一致 | 新指标入库但聚合未更新 | 异步聚合+最终一致性 |
| 并发冲突 | 多个指标同时入库 | 数据库行锁+事务 |
| 历史变更 | 原始指标被修改/删除 | 全量重算+版本号 |

### 7.2 聚合更新策略

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   原始指标入库                                                   │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  1. 写入 enterprise_index_raw                           │   │
│   │  2. 发送消息到聚合队列                                   │   │
│   │  3. 返回成功                                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                        │
│        ▼ 异步                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  聚合Worker消费消息                                      │   │
│   │  1. 获取受影响的聚合维度                                 │   │
│   │  2. 重算该维度的聚合指标                                 │   │
│   │  3. 更新 enterprise_index_agg                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   每日凌晨                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  定时任务全量重算                                        │   │
│   │  1. 清理过期聚合数据                                     │   │
│   │  2. 全量重算所有聚合指标                                 │   │
│   │  3. 校验一致性                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-18 | 初版，解决个人指标→企业指标的转换断点 | - |