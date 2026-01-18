# 估算模块 Overview（Product v0.9）

> 目标：调用已发布指标（IndexVersion/STR），在冻结口径下输出可解释估算结果

---

## 核心原则
- 冻结：进行中估算不随发布自动变化
- 可解释：每行结果可追溯（指标ID/层级/分位/系数链/人工调整）
- 兜底：L4→L1 降级必须可见化

## 页面（P0）
- `/estimation/tasks`（任务列表）
- `/estimation/tasks/:taskId/quick`（指标匡算）
- `/estimation/tasks/:taskId/workbench`（详细估算）
- `/estimation/dictionaries`（参数字典与系数库）

## 输出
- 总价/单方
- 空间×专业拆分（详细估算）
- 快照（输入+口径+输出）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/estimation.ts` |
| **组件路径** | `src/pages/estimation/TaskList.tsx` |
| **DTO** | `src/types/estimation.ts` (EstimationTask, Scenario, Snapshot) |
| **接口函数** | `src/api/estimation.ts` |

> Windsurf 实现时在此补充实际路径与命名
