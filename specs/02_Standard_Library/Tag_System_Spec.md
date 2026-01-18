# 功能标签体系 Spec（Product v0.9）

> 模块：02_Standard_Library  
> 页面：`/standard/tags`（管理）  
> 目标：标签可维护、可搜索、可推荐、可停用；并支持被标签化/估算复用

---

## 1 页面IA
- 标签大类列表（左树）
- 标签表（右表）
- 标签编辑抽屉（右抽屉）
- （可选P1）推荐规则页 `/standard/tags/rules`

## 2 线框
```text
┌/standard/tags──────────────────────────────────────────┐
│ 左：大类树(YI/JY/...) │ 右：标签表(code/name/默认空间/单位/状态) │
│ 行点击→右抽屉：标签详情+keywords+synonyms              │
└────────────────────────────────────────────────────────┘
3 字段表（核心）
TagCategory

code/name/color/icon/sortOrder/status

FunctionTag

categoryCode, code, name, fullName, defaultSpaces[], defaultUnit, functionalUnit?, keywords[], synonyms[], status, version

4 关键交互

code 不可修改（UI禁用）

停用提示：不影响历史，只影响新选择/新推荐

搜索：支持 code/name/keyword

5 API（概念清单）

GET /api/v1/tags/categories

GET /api/v1/tags?categoryCode=&keyword=&status=&page=&pageSize=

GET /api/v1/tags/recommend?keyword=&maxCount=

POST/PUT /api/v1/tags（管理员）

6 验收用例

Given 输入“门诊医技综合楼” When recommend Then 返回候选TopK+置信度

Given 停用标签 When 标签化选择器搜索 Then 不再显示（可开关“显示停用”）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/standard.ts` |
| **组件路径** | `src/pages/standard/tags/TagList.tsx`, `src/pages/standard/tags/TagDrawer.tsx` |
| **DTO** | `src/types/tag.ts` (TagCategory, FunctionTag) |
| **接口函数** | `src/api/tag.ts` |

> Windsurf 实现时在此补充实际路径与命名