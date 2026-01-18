# 详细估算 Spec（Product v0.9）

> 页面：`/estimation/tasks/:taskId/workbench`  
> 目标：在发布版指标上做空间×专业拆解、系数链解释、多方案对比

---

## 核心
- L4→L1 兜底可见化
- P25/P50/P75 一键切换
- 结果每行带来源证据（indexId/level/quantile/factors/manual）
- 方案锁定（locked）防漂移；升级版本生成新方案/副本

（完整稿建议直接使用你上一轮我输出的 `Detailed_Estimation_Spec.md` 正文）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/estimation.ts` |
| **组件路径** | `src/pages/estimation/DetailedWorkbench.tsx`, `src/components/SpaceProfessionMatrix.tsx`, `src/components/FactorChain.tsx` |
| **DTO** | `src/types/estimation.ts` (DetailedEstimationResult, FactorChainItem) |
| **接口函数** | `src/api/estimation.ts` |

> Windsurf 实现时在此补充实际路径与命名