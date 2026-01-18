# 数据模型契约（Product v0.9）

> 目标：把“可追溯/可冻结/可复算”写死为数据契约（Windsurf后续对齐真实DB）

---

## 1 核心事实链（追溯链路）
RawCostFile → Tagging（Unit/Binding）→ UnitCostFact → CostIndex/IndexSample → IndexVersion/STR → EstimationSnapshot

## 2 必备表（概念级）
### 导入与原样
- import_batch
- lake_object (+ versions)

### 标签化（加工结果）
- building_unit
- building_function_tag_binding（可选但建议）
- building_scale_binding（建议）
- entity_space_profession_binding（建议）
- unit_cost_fact（核心事实） / unit_cost_detail（展示用）

### 指标
- cost_index（统计值 + 推荐值 + 质量）
- index_sample（样本关联）
- index_version（版本与发布状态）
- str_value（发布后的标准值集合）

### 估算
- estimation_task
- estimation_scenario
- estimation_snapshot（输入+口径+输出）
- estimation_pointer（可选：发布指针/灰度指针）

## 3 必备字段（必须存在）
- 所有“发布/估算”必须带：indexVersionId/indexVersionCode/priceBaseDate/region/stage
- snapshot 必须记录：inputs + factors + usedIndexIds + warnings

## 4 验收
- 任一估算结果行能追到：指标ID→样本→单体→原始导入批次（至少 queryKey）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | — |
| **DTO** | `src/types/*.ts` (所有核心实体) |
| **接口函数** | — |
| **数据库表** | 待对齐 Prisma/TypeORM schema |

> Windsurf 实现时在此补充实际路径与命名
