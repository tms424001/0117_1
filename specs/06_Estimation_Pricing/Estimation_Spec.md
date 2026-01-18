# 指标匡算 Spec（Product v0.9）

> 页面：`/estimation/tasks/:taskId/quick`  
> 目标：用发布版指标快速估总价（可研/投资决策）

---

## 1 页面布局（简版黄金页）
- 左：单体列表（可多个）
- 中：输入区（功能标签、面积、规模档、地区、分位P25/50/75）
- 右：推荐指标卡（TopK，含质量/样本量/层级）
- 底：warnings（缺指标/低质量/兜底层级）

## 2 线框
```text
┌estimation-quick────────────────────────────────────────┐
│ 指标版本：2026.01（冻结） [升级版本]                   │
│ 输入：tag/area/scale/region  分位：P50                 │
│ 输出：总价/单方 + 结构占比（简版）                      │
└────────────────────────────────────────────────────────┘
3 规则

默认 P50

L4优先，缺则降级并提示

无L1则阻断并提示换标签/补样本

4 API（概念）

GET /index-versions?status=published

POST /estimation/recommend（候选TopK）

POST /estimation/calc（返回 quick result + snapshotId）

POST /estimation/export

5 验收

1个单体：能出总价+单方并生成快照

2个方案：复制后改分位，差异可见

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/estimation.ts` |
| **组件路径** | `src/pages/estimation/QuickEstimation.tsx`, `src/components/IndexRecommendCard.tsx`, `src/components/EstimationInput.tsx` |
| **DTO** | `src/types/estimation.ts` (QuickEstimationResult, IndexRecommend) |
| **接口函数** | `src/api/estimation.ts` |

> Windsurf 实现时在此补充实际路径与命名