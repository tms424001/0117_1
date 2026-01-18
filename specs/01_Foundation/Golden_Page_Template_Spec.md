# 黄金页母版 Spec（Golden Page Template）

> v0.9 | 2026-01-17  
> 目标：全平台核心页面一致（左树右表+抽屉+底部面板）

---

## 1 布局结构
- Header：标题、面包屑、主操作按钮（保存/校验/完成/导出）
- Toolbar：搜索、筛选、批量操作
- Body：
  - Left TreePanel（多层级、可Tab）
  - Center GridPanel（列表/矩阵/透视表）
  - Right Drawer（详情/编辑/推荐）
- BottomPanel：问题/待确认/日志（可折叠）

## 2 线框
```text
┌Header: Title + Actions────────────────────────────────────────┐
│ Toolbar: Search | Filters | Batch Actions                      │
├───────────────┬───────────────────────┬──────────────────────┤
│ TreePanel      │ GridPanel             │ Drawer (Detail/Edit) │
│ (tabs optional)│                       │                      │
├───────────────┴───────────────────────┴──────────────────────┤
│ BottomPanel: Issues / ReviewQueue / Logs (collapsible)         │
└───────────────────────────────────────────────────────────────┘
3 交互约定（必须遵守）

Tree 选中 → Grid 刷新（可保留筛选）

Grid 行点击 → Drawer 打开（详情/编辑）

BottomPanel 点击问题 → 定位到 Grid 行或 Drawer 字段并高亮

三态：Loading/Empty/Error 统一组件

4 必备能力

虚拟滚动（大表）

列配置（冻结列、隐藏列）

批量操作（跨页策略：仅当前页/跨页全选需明确提示）

5 验收

任意模块黄金页外观/交互一致；只换数据源不换模式

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | `src/layouts/GoldenPage.tsx`, `src/components/TreePanel.tsx`, `src/components/GridPanel.tsx`, `src/components/Drawer.tsx`, `src/components/BottomPanel.tsx` |
| **DTO** | — |
| **接口函数** | — |

> Windsurf 实现时在此补充实际路径与命名
