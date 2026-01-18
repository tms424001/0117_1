# 标签化处理流程 Spec（Product v0.9）

> 页面：`/tagging/workbench/:taskId`  
> 目标：把原始造价数据加工为“可计算指标”的结构化事实（单体+标签+面积+空间专业归集）

---

## 1 页面结构（黄金页三栏+Stepper）
- 顶部：进度条（完成/异常/用时）+ 操作（保存/校验/完成）
- Stepper：①单体识别②标签分配③面积录入④造价归集⑤校验确认
- 左栏：原始工程树
- 中栏：单体列表（作业清单）
- 右栏：单体配置面板（随 step 切换）
- 底部：问题面板（阻断/警告/待确认）

## 2 主线线框
```text
┌tagging-workbench─────────────────────────────────────────────────┐
│ Stepper + Progress                                                │
│ 左：原始树  中：单体列表  右：单体配置（标签/面积/归集/校验）        │
│ 底：问题面板（点击定位到字段/行）                                  │
└──────────────────────────────────────────────────────────────────┘
3 Step 关键能力

Step1：合并/拆分单体；室外总平单独单体提示

Step2：TagRecommendation + TagSelector（SW单体强制SW类标签）

Step3：面积一致性即时校验；功能规模→规模档自动匹配

Step4：空间×专业矩阵；低置信/未映射（QT）进入待确认

Step5：阻断/警告清单；一键定位修复；完成后状态 completed

4 API（概念）

GET /projects/{projectId}/units

PUT /units/{unitId}

POST /units/{unitId}/aggregate

POST /units/{unitId}/validate

POST /projects/{projectId}/complete-tagging

5 验收用例

完成一个单体从 pending→completed

QT/低置信可在问题面板中定位并修复

阻断问题未解决不能完成

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/tagging.ts` |
| **组件路径** | `src/pages/tagging/TaskList.tsx`, `src/pages/tagging/Workbench.tsx`, `src/components/TaggingStepper.tsx`, `src/components/UnitConfigPanel.tsx` |
| **DTO** | `src/types/tagging.ts` (BuildingUnit, TaggingTask, UnitCostFact) |
| **接口函数** | `src/api/tagging.ts` |

> Windsurf 实现时在此补充实际路径与命名