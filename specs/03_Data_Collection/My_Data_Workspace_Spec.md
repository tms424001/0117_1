# 我的数据工作区 Spec（Product v0.9）

> 页面：`/my-data`  
> 目标：个人空间可编辑、可生成入库包（DraftPackage）、可提交PR

---

## 1 页面IA
- 列表：数据对象（材料/清单/指标/案例/导入批次）
- 详情抽屉：可编辑字段、变更记录
- 操作：保存草稿、生成 DraftPackage、提交 PR

## 2 线框
```text
┌my-data───────────────────────────────────────────────┐
│ 搜索/筛选  表：记录列表   行点击→抽屉编辑             │
│ [生成入库包] [提交PR]                                 │
└──────────────────────────────────────────────────────┘
3 API（概念）

GET /my-data

PUT /my-data/{id}

POST /my-data/{id}/draft-package

POST /pr/submit

4 验收

编辑留痕；草稿可回放；提交PR前校验必填元数据

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/collect.ts` |
| **组件路径** | `src/pages/collect/MyData.tsx`, `src/components/MyDataDrawer.tsx` |
| **DTO** | `src/types/myData.ts` (MyDataRecord, DraftPackage) |
| **接口函数** | `src/api/myData.ts` |

> Windsurf 实现时在此补充实际路径与命名