# API Contracts（Product v0.9）

> 目标：约束接口风格，字段口径与页面字段表一致（Windsurf后续补全 OpenAPI）

---

## 1 通用规范
- 分页：page/pageSize，响应含 total/list
- 错误码：{code,message,details,traceId}
- 筛选：用 query 参数；复杂用 POST body
- 幂等：导入/发布/计算类接口需幂等键（可选）

## 2 P0 接口目录（最小闭环）
### Collect
- POST /imports
- GET /imports, GET /imports/{id}
- GET /cost-files/{id}/tree, /preview, /logs
- PUT /price-files/{id}/metadata

### Tagging
- GET /projects/{id}/units
- PUT /units/{id}
- POST /units/{id}/aggregate
- POST /units/{id}/validate
- POST /projects/{id}/complete-tagging

### Index
- POST /indexes/calculate
- GET /indexes/calc/tasks/{id}
- GET /indexes
- GET /indexes/{id}/samples

### Publish
- POST /index-versions
- POST /index-versions/{id}/submit
- POST /index-versions/{id}/review/check
- POST /index-versions/{id}/review/approve
- POST /index-versions/{id}/publish

### Estimation
- GET /index-versions?status=published
- POST /estimation/recommend
- POST /estimation/calc
- POST /estimation/scenarios/{id}/calculate

## 3 验收
- 页面字段表中的字段能在响应 DTO 找到对应字段

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | — |
| **DTO** | `src/types/*.ts` |
| **接口函数** | `src/api/*.ts` |
| **OpenAPI** | 待生成 `openapi.yaml` |

> Windsurf 实现时在此补充实际路径与命名
