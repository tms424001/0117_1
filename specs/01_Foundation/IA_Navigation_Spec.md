# IA & Navigation Spec（全站导航与路由）

> v0.9 | 2026-01-17

---

## 1 顶栏（TopNav）
- 采集 Collect：`/collect`
- 标签化 Tagging：`/tagging`
- 指标 Index：`/indexes`、`/analysis`、`/publish`
- 估算 Estimation：`/estimation`
- 标准库 Standard：`/standard`
- （可选）设置 Admin：`/admin`

## 2 侧边栏（SideNav）按模块
### Collect
- 导入任务：`/collect`
- 造价文件：`/collect/cost-files`
- 价文件（材价/综价）：`/collect/price-files`
- 数据湖：`/data-lake`
- 我的数据：`/my-data`

### Tagging
- 标签化任务：`/tagging/tasks`
- 标签化工作台：`/tagging/workbench/:taskId`

### Index
- 计算任务：`/indexes/calc/tasks`
- 计算工作台：`/indexes/calc/workbench/:taskId`
- 指标库：`/indexes`
- 统计分析：`/analysis/*`
- 审核发布：`/publish/versions`

### Estimation
- 估算任务：`/estimation/tasks`
- 指标匡算：`/estimation/tasks/:taskId/quick`
- 详细估算：`/estimation/tasks/:taskId/workbench`
- 参数字典：`/estimation/dictionaries`

### Standard
- 功能标签：`/standard/tags`
- 规模分档：`/standard/scales`
- 空间专业映射：`/standard/mappings`

## 3 路由守卫（RouteGuard）
- 未登录：跳 `/login`
- 无权限：显示 403（页面+按钮级）
- 深链接：必须可直接打开并加载所需数据

## 4 验收用例
- Given 无权限用户 When 打开 `/publish/versions` Then 菜单隐藏且 403
- Given 合法用户 When 刷新 `/tagging/workbench/xxx` Then 页面可恢复状态（至少可重载）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/index.ts` |
| **组件路径** | `src/layouts/TopNav.tsx`, `src/layouts/SideNav.tsx` |
| **DTO** | — |
| **接口函数** | — |

> Windsurf 实现时在此补充实际路径与命名
