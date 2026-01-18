空间&专业映射 Spec（Product v0.9）

> 页面：`/standard/mappings`  
> 目标：维护空间/专业字典与映射规则；支持自动映射+低置信待确认

---

## 1 页面IA
- Tab：空间字典 / 专业字典 / 映射规则
- 映射规则页：Space/Profession 切换，左树=目标分类，右表=规则列表
- 规则编辑抽屉：pattern、matchType、priority、confidence、适用空间

## 2 线框（规则库）
```text
┌/standard/mappings──────────────────────────────────────────┐
│ Tab: [空间] [专业] [规则]                                  │
│ 规则页：左=目标分类树 右=规则表  行点击→抽屉编辑 + 样本试跑   │
└────────────────────────────────────────────────────────────┘

3 必备交互

规则启停（inactive不参与）

样本试跑（输入名称/path → 输出空间/专业+置信度+命中规则）

低置信标记 needsReview（供标签化归集使用）

4 API（概念）

GET /spaces

GET /professions?spaceCode=&groupCode=

GET/POST /mappings/rules

POST /mappings/auto（批量映射）

5 验收

室外(SW) 仅允许 SW-* 专业组合；非法组合阻断或强提示

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/standard.ts` |
| **组件路径** | `src/pages/standard/mappings/MappingList.tsx`, `src/pages/standard/mappings/RuleDrawer.tsx` |
| **DTO** | `src/types/mapping.ts` (Space, Profession, MappingRule) |
| **接口函数** | `src/api/mapping.ts` |

> Windsurf 实现时在此补充实际路径与命名