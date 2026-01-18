# 数据湖浏览 Spec（Product v0.9）

> 页面：`/data-lake`  
> 目标：所有导入文件原样可查、可预览、可回看版本

---

## 1 页面IA（黄金页简化）
- 左：目录/筛选（类型：造价/价文件）
- 中：对象表（文件名、类型、大小、创建、版本数）
- 右：预览/元数据/版本列表

## 2 线框
```text
┌data-lake─────────────────────────────────────────────┐
│ 左：筛选     中：对象表           右：预览+版本列表    │
└──────────────────────────────────────────────────────┘

3 API（概念）

GET /lake/objects?type=&page=&pageSize=

GET /lake/objects/{id}

GET /lake/objects/{id}/versions

4 验收

能按批次追溯；能打开原样预览；权限隔离（企业/个人）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/collect.ts` |
| **组件路径** | `src/pages/collect/DataLake.tsx`, `src/components/LakeObjectDrawer.tsx` |
| **DTO** | `src/types/lake.ts` (LakeObject, LakeVersion) |
| **接口函数** | `src/api/lake.ts` |

> Windsurf 实现时在此补充实际路径与命名