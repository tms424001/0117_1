# 材价/综价采集 Spec（Product v0.9）

> 页面：`/collect/price-files`、`/collect/price-files/:id`  
> 目标：价文件导入后必须补齐时点/地区/来源；支持单位归一与重复处理

---

## 1 页面
- 导入列表页：文件、类型（材价/综价）、基准期、地区、状态
- 详情页：元数据表单 + 预览表

## 2 线框（详情）
```text
┌price-file-detail─────────────────────────────────────┐
│ 元数据：地区/年月/来源/币种/单位口径  [保存]          │
│ 预览表：name/spec/unit/price/source                  │
└──────────────────────────────────────────────────────┘
3 必填校验

region + yearMonth 必填，否则阻断入库/指标调价

4 API（概念）

POST /price-files/import

PUT /price-files/{id}/metadata

GET /price-files/{id}/preview

5 验收

元数据缺失时明显阻断；单位归一策略有提示（如“床位/床”）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/collect.ts` |
| **组件路径** | `src/pages/collect/PriceFileList.tsx`, `src/pages/collect/PriceFileDetail.tsx` |
| **DTO** | `src/types/priceFile.ts` (PriceFile, PriceRow) |
| **接口函数** | `src/api/priceFile.ts` |

> Windsurf 实现时在此补充实际路径与命名
