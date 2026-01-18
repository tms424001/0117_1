# 指标审核发布 Spec（Product v0.9）

> 页面：`/publish/versions`、`/publish/review/:versionId`、`/publish/console/:versionId`  
> 目标：未审核不可用；发布形成 IndexVersion/STR；新版本不影响进行中估算（冻结）

---

## 1 页面IA
- 版本管理（列表+对比）
- 版本详情（变更明细/质量概览/提交审核）
- 审核工作台（自动检查+人工检查项+问题跳转）
- 发布控制台（precheck+影响评估+策略+发布说明）
- 发布执行进度（步骤1~5）+ 操作日志

## 2 关键交互（必须）
- 审核问题清单必须能跳到“指标详情/样本”
- 发布前必须显示“影响评估：进行中估算继续使用旧版本（冻结）”
- 发布策略：立即/定时/灰度/并行（v0.9可先实现立即+定时）

## 3 API（概念）
- POST `/index-versions`
- POST `/{id}/submit`
- POST `/{id}/review/check`
- POST `/{id}/review/approve`、`/{id}/review/reject`
- GET `/{id}/publish/precheck`
- POST `/{id}/publish`

## 4 验收
- draft→reviewing→approved→published 状态机正确
- 未approved不能publish
- 发布后 old version archived（或指针切换）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/publish.ts` |
| **组件路径** | `src/pages/publish/VersionList.tsx`, `src/pages/publish/ReviewWorkbench.tsx`, `src/pages/publish/PublishConsole.tsx` |
| **DTO** | `src/types/publish.ts` (IndexVersion, ReviewItem, PublishConfig) |
| **接口函数** | `src/api/publish.ts` |

> Windsurf 实现时在此补充实际路径与命名


# Index Publish Spec — V1.1 Patch Addendum（指数口径 + STR 写回 + 估算冻结）

> 适用文档：`specs/05_Index_System/Index_Publish_Spec.md`（V1.0）  
> 版本：V1.1（Patch）  
> 日期：2026-01-17  
> 目标：把“指数（价格基准期）口径”与“估算冻结承诺”在发布环节**钉死为工程契约**：  
> - 发布的版本必须固化 priceBaseDate（指标已统一到该基准期）  
> - 发布必须写回 STR（P25/P50/P75）供估算调用  
> - 发布不影响进行中估算（冻结机制在 UI 和数据上都可见）

---

## 1. 发布口径身份证（Release Context）（MUST）

### 1.1 新增：IndexVersion.releaseContext

在 `IndexVersion` 中新增/补齐以下字段（发布后冻结不可改）：

```ts
interface ReleaseContext {
  // 标准库/规则口径
  libraryVersionCode: string;          // e.g. V2026Q1
  mappingSnapshotVersion: number;      // 空间/专业映射快照
  scaleSnapshotVersion: number;        // 规模分档快照

  // 指标计算口径（必须可复算）
  stage: 'ESTIMATE' | 'TENDER' | 'SETTLEMENT';
  priceBaseDate: string;               // "YYYY-MM" e.g. "2026-01"
  indexType: 'construction' | 'material' | 'labor';  // 默认 construction
  outlierMethod: 'iqr' | 'zscore' | 'empirical';
  minSampleCount: number;

  // 区域口径
  regionLevel: 'province' | 'city' | 'district';
  defaultRegionKey?: string;           // 可选：版本主服务范围（如 四川-成都）

  // 数据窗（用于审计/复算）
  dataWindow: { start: string; end: string }; // "YYYY-MM" ~ "YYYY-MM"
}
1.2 UI 必须展示“口径身份证卡片”

在【版本详情页】与【发布控制台】顶部新增 ReleaseContext Card（只读）：

标准库版本：libraryVersionCode

映射快照：mappingSnapshotVersion / scaleSnapshotVersion

阶段：stage

价格基准期：priceBaseDate（必须显著展示）

指数类型：indexType

异常法/最小样本：outlierMethod / minSampleCount

区域层级：regionLevel（可选显示 defaultRegionKey）

数据窗：dataWindow

目的：审核人/发布人一眼能判断“变化来自口径还是来自新增样本”。

2. 发布前检查补充（PrePublishCheck）（MUST）
2.1 必要条件新增

在 PrePublishCheck.prerequisites 中新增两项：

hasPriceBaseDate: boolean（版本 priceBaseDate 是否存在且合法）

priceIndexCoverageOk: boolean（计算阶段调价所需指数覆盖是否满足最低要求）

并在 UI 中以 ✅/⚠️/✖ 展示。

2.2 指数缺失影响提示（强提示）

在发布控制台的【发布前检查】区域增加一条提示：

缺指数导致排除样本比例（来自计算任务汇总/或版本统计）

若 >20%：显示 ⚠️ “指数覆盖不足可能导致指标质量下降，建议补齐指数表或缩小数据窗”

3. 发布=写回 STR（Standard Target Range）（MUST）
3.1 发布步骤中插入 STR 写回步骤

在 Publish Steps（1~5）中，Step3 执行发布必须包含以下子步骤（UI 进度可见）：

3.1 固化版本状态：approved → published
3.2 写回 STR（核心）
3.3 刷新缓存/更新版本指针
3.4 归档旧版本（或切指针）
3.5 通知与日志

3.2 STR 写回映射规则（必须写死）

发布成功后，系统必须将该版本下的指标写入 STR：

STR.p25 = cost_index.percentile25

STR.p50 = cost_index.percentile50

STR.p75 = cost_index.percentile75

STR.sampleCount = cost_index.sampleCount

STR.qualityLevel = cost_index.qualityLevel

STR.priceBaseDate = releaseContext.priceBaseDate

STR.stage = releaseContext.stage

STR.libraryVersionCode = releaseContext.libraryVersionCode

STR.mappingSnapshotVersion / scaleSnapshotVersion 同步写入

并在 UI 的【发布执行进度】里显示：

写回条数（应=totalIndexes 或=满足条件的 published 指标数）

失败条数与失败原因列表（可下载）

4. “发布不影响进行中估算”冻结机制（MUST）
4.1 发布控制台必须展示影响评估与冻结说明

在发布控制台【影响评估】区域必须包含：

进行中的估算数量：activeEstimations

影响用户数：affectedUsers

关键提示（固定文案，必须出现）：

“进行中的估算将继续使用其已绑定的指标版本，不随本次发布自动切换。”

“新建估算默认使用新发布版本；如需升级，必须在估算侧显式执行‘升级版本’。”

4.2 版本切换的最小策略（V1）

V1 最小实现允许保持你原规则“同一时刻只有一个已发布版本”，但必须在实现层满足冻结：

旧版本发布记录可以被归档（archived）

估算会话/快照必须记录 indexVersionId/indexVersionCode，用于回放与审计

估算回放不依赖“当前 published”，只依赖快照中的冻结版本信息

若你们愿意增强（P1）：引入 global pointer（指针切换=生效版本），回滚=切指针不撤销历史发布。

5. 版本列表/详情 UI 增强（MUST）
5.1 版本列表新增列（建议必须）

在【版本管理列表】增加两列（减少口径误用）：

价格基准期 priceBaseDate（YYYY-MM）

阶段 stage（ESTIMATE/TENDER/SETTLEMENT）

5.2 版本对比增强：区分“口径变化 vs 数据变化”

在【版本对比】区域增加 contextDiff 展示：

priceBaseDate 是否变化

stage 是否变化

libraryVersionCode 是否变化

snapshotVersion 是否变化

UI 文案示例：

“本次差异包含口径变更：priceBaseDate 2025-12 → 2026-01（注意解读变化率）”

6. API 补充（前端必须依赖的返回字段）
6.1 发布前检查（precheck）响应必须包含

GET /api/v1/index-versions/{versionId}/publish/precheck 响应 data 中必须包含：

prerequisites.hasPriceBaseDate

prerequisites.priceIndexCoverageOk

impactAssessment.activeEstimations

impactAssessment.affectedUsers

impactAssessment.majorChanges（摘要）

recommendation（proceed/delay/abort）

releaseContext（整包回传，供 UI 展示）

6.2 发布执行状态（publish/status）建议包含

GET /api/v1/index-versions/{versionId}/publish/status 建议返回：

当前步骤 steps[]（含 stepName/status/errorMessage）

strWriteback: { total: number; success: number; failed: number }

7. 验收用例（Given/When/Then）

Given 版本缺 priceBaseDate When 点击发布 Then precheck 显示 ✖ 且阻断发布

Given 指数缺失导致排除样本比例>20% When precheck Then 显示 ⚠️ 并要求确认后才能继续（或建议 delay）

Given 版本发布成功 When 查看发布进度 Then 包含 “写回 STR” 步骤且写回条数=预期

Given 存在进行中估算 When 发布新版本 Then 影响评估显示 activeEstimations>0 且明确冻结提示

Given 已存在估算快照绑定旧版本 When 新版本发布后回放旧快照 Then 结果不依赖当前 published，仍可查看旧版本口径与结果