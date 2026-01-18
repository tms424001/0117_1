# Glossary（术语表）

> v0.9  
> 目标：统一词汇，禁止同义乱用

---

## 核心对象
- Project（项目）：一组相关工程数据的容器
- BuildingUnit（单体）：可独立核算的建筑物/构筑物
- FunctionTag（功能标签）：描述单体用途（YI-01门诊等）
- TagCategory（标签大类）：YI/JY/BG...
- ScaleType（分档类型）：AREA/BED/CLASS/...
- ScaleRange（规模档位）：XS/ZX/...
- Space（空间）：DS地上 / DX地下 / SW室外 / QT其他
- Profession（专业）：TJ/GPS/QD/RD/NT/XF/...
- MappingRule（映射规则）：原始名称/path → 标准空间/专业
- Binding（绑定）：人工确认后的“锁定结果”（标签/分档/映射）

## 数据层
- Data Lake（数据湖）：原样存储、可预览
- My Data（我的数据）：个人可编辑空间（草稿/快照）
- PR（推送审核）：个人→企业库的合并流程

## 指标体系
- CostIndex（指标）：按维度聚合后的统计结果
- IndexSample（指标样本）：参与计算的样本明细（可追溯）
- IndexVersion（指标版本）：发布快照集合（2026.01）
- STR（标准值库）：发布后沉淀的 P25/P50/P75 标准值集合
- QualityLevel（质量等级）：A/B/C/D（样本量+离散度+时效）

## 估算
- EstimationTask（估算任务）：估算容器
- Scenario（方案）：A/B/C 多方案输入
- Snapshot（快照）：一次计算的证据包（输入+口径+输出）
- Freeze（冻结）：进行中方案绑定指标版本，不随发布变化

## 禁止混用（示例）
- “综价/综合单价/综合价”必须统一成：Composite Unit Price（综价）
- "概算回归/阶段对比/多文件对比"在本包主线中统一称：Multi-file Compare（非P0）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | — |
| **DTO** | `src/types/*.ts` |
| **接口函数** | — |

> Windsurf 实现时在此补充实际路径与命名
