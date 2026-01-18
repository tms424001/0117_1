# 参数字典与系数库 Spec（Product v0.9）

> 页面：`/estimation/dictionaries`  
> 目标：统一维护地区/品质/结构/自定义系数与单体参数字段，驱动详细估算输入

- 系数库：Region/Quality/Structure/Custom
- 参数字典：ParamField（type/unit/validation）
- 联动：工作台默认值来自字典；锁定方案不被字典变更漂移

（完整稿建议直接使用你上一轮我输出的 `Estimation_Dictionaries_Spec.md` 正文）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/estimation.ts` |
| **组件路径** | `src/pages/estimation/Dictionaries.tsx`, `src/components/FactorEditor.tsx`, `src/components/ParamFieldEditor.tsx` |
| **DTO** | `src/types/dictionary.ts` (Factor, ParamField) |
| **接口函数** | `src/api/dictionary.ts` |

> Windsurf 实现时在此补充实际路径与命名


## V1.1 Patch：地区系数与时点系数的“字典化”与兜底策略

---

### 1. 地区系数（RegionFactor）补充字段（SHOULD）

在 RegionFactor 记录中建议增加（便于解释与治理）：
- `sourceRegionKey`（指标来源地区）
- `targetRegionKey`（目标地区）
- `factor`
- `method`：'manual' | 'derived'（手录/推导）
- `confidence`：0~1（可选）

> V1 最简仍可只用 province/city→factor，但建议至少记录 method+confidence，方便后续治理。

---

### 2. 地区系数启用条件（MUST）

在字典页 UI 里增加提示说明（不可省略）：
- “地区系数仅在跨地区借用指标时启用，同地区默认 1.0”
- “手动修改地区系数必须填写原因，写入估算快照”

---

### 3. 时点系数（timeFactor）兜底策略（MUST）

估算工作台需要一个统一策略：
- 优先：自动从指数表计算 `timeFactor`
- 兜底：指数缺失时允许手动输入 `timeFactor`，但必须：
  - `manual=true`
  - `reason` 必填
  - 写入快照与结果行来源链

字典页（可选做成一个小卡片配置，简版也可写死在代码但必须在 spec 声明）：
- `allowManualTimeFactor: true/false`（默认 true）
- `manualTimeFactorRange: [0.8, 1.3]`（默认）
- `requireReasonOnManual: true`（必须）

---

### 4. 验收用例（Given/When/Then）

1) Given 估算目标期=版本基准期 When 计算 Then timeFactor=1 且结果不提示时点调整  
2) Given 目标期≠基准期且指数存在 When 计算 Then timeFactor自动计算并写入快照  
3) Given 指数缺失 When 用户手动填 timeFactor Then 必填原因且结果行标记 manual  
4) Given 指标来源地区≠目标地区 When 启用地区系数 Then regionFactor写入快照并在UI可见  
5) Given 来源地区=目标地区 When 计算 Then regionFactor强制为1（不允许随意启用）
