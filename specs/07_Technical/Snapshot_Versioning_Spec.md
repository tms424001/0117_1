# Snapshot & Versioning Spec（Product v0.9）

> 目标：发布与估算的“冻结/升级/回放”规则一锤定音

---

## 1 快照类型
- TaggingSnapshot：标签化完成的一次加工快照（可选P1）
- IndexVersion：发布版本（2026.01）
- EstimationSnapshot：一次估算计算快照（必须）

## 2 冻结规则（必须）
- EstimationScenario 计算时绑定 indexVersionId
- 新版本发布后：
  - 已有 scenario 不变
  - 新建 scenario 默认用新版本
  - 升级版本=显式动作（生成新 scenario 或副本）

## 3 回放规则
- 任一 snapshot 必须可回放（查看 inputs + outputs + warnings）
- 回放不依赖“当前版本”，只依赖 snapshot 内冻结口径

## 4 版本切换（指针）
- 发布的“生效版本”通过 pointer 指向（GLOBAL/ORG/USER，可P1）
- 回滚=切 pointer，不改历史发布记录

## 5 验收
- 发布新版本后，旧方案重算（回放）结果一致
- 升级版本后，新方案结果与旧方案可对比且有差异归因入口

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | — |
| **组件路径** | `src/components/SnapshotViewer.tsx`, `src/components/VersionCompare.tsx` |
| **DTO** | `src/types/snapshot.ts` (Snapshot, VersionPointer) |
| **接口函数** | `src/api/snapshot.ts` |

> Windsurf 实现时在此补充实际路径与命名
