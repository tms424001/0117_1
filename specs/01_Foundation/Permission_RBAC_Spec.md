# 权限 RBAC Spec（简版）

> v0.9 | 2026-01-17  
> 目标：页面/按钮级权限 + 审计留痕

---

## 1 角色（Roles）
- Viewer：只读
- Operator：可采集/标签化/计算
- Reviewer：可审核（PR/指标版本）
- Publisher/Admin：可发布、归档、回滚指针
- Estimator：可创建估算任务/方案、导出报告

## 2 权限码（示例）
- COLLECT_IMPORT
- TAGGING_EDIT
- INDEX_CALC_RUN
- INDEX_PUBLISH_APPROVE
- INDEX_PUBLISH_RELEASE
- ESTIMATION_RUN
- DICT_EDIT

## 3 页面/按钮矩阵（必须）
- `/publish/versions`：Reviewer 可见；发布按钮仅 Publisher
- `/estimation/dictionaries`：仅 Admin/DICT_EDIT
- 标签化完成按钮：TAGGING_EDIT

## 4 审计（必须记录）
- 提交审核/审核通过/驳回
- 发布/切指针回滚
- 方案锁定/解锁/升级版本

## 5 验收
- 未授权：菜单隐藏 + 403 + 后端拒绝一致错误码

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/guards.ts` |
| **组件路径** | `src/components/PermissionGuard.tsx` |
| **DTO** | `src/types/auth.ts` |
| **接口函数** | `src/api/auth.ts` |

> Windsurf 实现时在此补充实际路径与命名
