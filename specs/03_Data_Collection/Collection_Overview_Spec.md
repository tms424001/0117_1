# 采集模块总览 Spec（Product v0.9）

> 页面：`/collect`  
> 目标：导入向导+批次管理，形成数据湖对象与可预览解析结果

---

## 1 页面IA
- 导入向导（Wizard）：上传→解析→补录元数据→完成
- 导入批次列表：状态、文件类型、更新时间、操作（进入预览/重试/删除）

## 2 线框
```text
┌/collect─────────────────────────────────────────────┐
│ [导入造价文件] [导入材价/综价]                       │
│ 批次列表：batchName/type/status/progress/updatedAt   │
└─────────────────────────────────────────────────────┘
3 字段（批次）

batchId, type(cost/price), status(pending/parsing/ready/failed), fileName, size, createdAt, updatedAt, errorSummary?

4 关键交互

失败可重试（保留错误日志）

解析完成后“进入原样预览”按钮

5 API（概念）

POST /imports

GET /imports

GET /imports/{batchId}

POST /imports/{batchId}/retry

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/collect.ts` |
| **组件路径** | `src/pages/collect/ImportList.tsx`, `src/pages/collect/ImportWizard.tsx` |
| **DTO** | `src/types/import.ts` (ImportBatch) |
| **接口函数** | `src/api/import.ts` |

> Windsurf 实现时在此补充实际路径与命名