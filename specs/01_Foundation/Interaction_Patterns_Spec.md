
# 交互模式 Spec（Interaction Patterns）

> v0.9 | 2026-01-17

---

## 1 搜索/筛选
- 搜索：默认 debounce 300ms，支持回车触发
- 筛选：多选筛选器必须显示“已选数量”
- URL 同步：关键筛选建议同步 query（便于分享链接）

## 2 批量操作
- 勾选列：支持全选/反选
- 跨页全选：必须出现提示 “已选择本页 N 条 / 全部 M 条”
- 批量动作：必须二次确认（危险操作）

## 3 Drawer/Modal
- Drawer：用于“同屏作业”
- Modal：用于“破坏性确认/复杂向导”
- Esc 关闭：允许（除强制流程）

## 4 定位与高亮（重要）
- 从问题面板点击 → 自动滚动到表格行并高亮 3s
- 从问题面板点击字段类错误 → 打开 Drawer 并聚焦字段

## 5 三态
- Loading：骨架屏/按钮loading
- Empty：带引导动作按钮（如“去导入”“去创建”）
- Error：显示错误码+重试+联系支持入口

## 6 验收
- 任意模块的“定位/批量/三态”体验一致

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | `src/components/SearchFilter.tsx`, `src/components/BatchActions.tsx`, `src/components/StateEmpty.tsx`, `src/components/StateLoading.tsx`, `src/components/StateError.tsx` |
| **DTO** | — |
| **接口函数** | — |

> Windsurf 实现时在此补充实际路径与命名
