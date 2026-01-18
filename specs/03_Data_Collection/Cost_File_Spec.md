# 造价文件采集 Spec（Product v0.9）

> 页面：`/collect/import/:batchId`（预览与映射）  
> 目标：原样树+明细表可预览，解析日志可查，为标签化提供结构输入

---

## 1 核心页面布局（黄金页）
- 左：原始工程树（一级节点通常对应单体候选）
- 中：明细表（当前节点下行）
- 右：节点/字段信息（识别提示、映射建议）
- 底部：解析日志/错误

## 2 线框
```text
┌cost-file-preview────────────────────────────────────┐
│ 左：工程树        中：行表            右：节点详情/提示 │
│ 底：解析日志（错误/警告/统计）                         │
└──────────────────────────────────────────────────────┘
3 字段表（预览最小字段）

TreeNode：id,name,level,path,childrenCount

Row：rowId,itemName,feature,unit,qty,unitPrice,totalPrice,originPath

4 交互

点击树节点 → 表刷新

行点击 → 抽屉显示原始行（raw）+ 结构化字段

错误定位：点日志项 → 自动定位对应节点/行

5 API（概念）

GET /cost-files/{id}/preview?nodeId=&page=&pageSize=

GET /cost-files/{id}/tree

GET /cost-files/{id}/logs

6 验收

大表分页/虚拟滚动；错误可定位；预览不丢字段

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/collect.ts` |
| **组件路径** | `src/pages/collect/CostFilePreview.tsx`, `src/components/CostTree.tsx`, `src/components/CostGrid.tsx` |
| **DTO** | `src/types/costFile.ts` (TreeNode, CostRow) |
| **接口函数** | `src/api/costFile.ts` |

> Windsurf 实现时在此补充实际路径与命名
