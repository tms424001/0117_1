# DocMap（Spec 工程化目录表）— 主线闭环：采集→加工→标签→指标→匡算

> 版本：V1.0  
> 更新日期：2026-01-17  
> 使用方式：每行 = 1 份 Spec 的“交付清单”，Windsurf 按优先级+依赖排 Sprint。

---

## 00_Doc_Map（总纲与作业流）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 00_Doc_Map | `specs/README.md` | P0 | - | - | - | 术语总览、模块地图、版本规则 | - | 模块全景图 + 主线作业流 + 目录索引 + DoD 入口 |
| 00_Doc_Map | `specs/00_Doc_Map/Flow_Playbook.md` | P0 | README | - | - | “从导入到匡算”步骤表（含页面跳转） | - | 每一步：输入/操作/输出/失败处理 + 对应 Spec 链接 |
| 00_Doc_Map | `specs/00_Doc_Map/Glossary.md` | P0 | README | - | - | 单体/标签/规模档/空间专业/指标/版本/快照 | - | 统一名词、同义词、禁止用词（避免团队各说各话） |
| 00_Doc_Map | `specs/00_Doc_Map/DoD_Checklist.md` | P0 | README | - | - | 通用 DoD 清单模板 | - | 页面 Spec 必含：IA/线框/字段表/接口/校验/状态/权限/日志/验收用例 |

---

## 01_Foundation（前端母版与一致性）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 01_Foundation | `specs/01_Foundation/IA_Navigation_Spec.md` | P0 | - | 全站 | TopNav/SideNav/RouteGuard | 路由表、菜单树、Breadcrumb 规则 | - | 路由+菜单一一对应；权限可控；可扩展（模块可插拔） |
| 01_Foundation | `specs/01_Foundation/Golden_Page_Template_Spec.md` | P0 | IA | 全站黄金页 | SplitLayout / TreePanel / GridPanel / Drawer / BottomPanel | 通用列定义、筛选器 schema、三态规范 | - | 给出组件 props 约定 + 交互（搜索/筛选/批量/钻取） |
| 01_Foundation | `specs/01_Foundation/Interaction_Patterns_Spec.md` | P0 | Golden | 全站 | 批量选择/快捷键/定位/高亮 | 操作事件模型（Event） | - | Loading/Empty/Error 统一；抽屉/弹窗/底栏行为一致 |
| 01_Foundation | `specs/01_Foundation/Permission_RBAC_Spec.md` | P0 | IA | 全站 | PermissionGate / RoleTag | Role/Permission/Scope（个人/企业） | `GET /me/permissions`（或等价） | 角色矩阵 + 页面/按钮级权限 + 审计要求 |

---

## 02_Standard_Library（标准字典：估算&指标的口径底座）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 02_Standard_Library | `specs/02_Standard_Library/Tag_System_Spec.md` | P0 | Foundation | `/standard/tags`（管理）<br>`/tagging/workbench`（使用） | TagSelector / TagBadge / TagRecommendation | TagCategory / FunctionTag / TagMappingRule / BuildingTagBinding（如采用） | `GET /tags/categories`<br>`GET /tags`<br>`GET /tags/recommend`<br>`POST/PUT /tags` | 标签可搜索/可分组/可停用；推荐可解释；绑定可锁定不覆盖 |
| 02_Standard_Library | `specs/02_Standard_Library/Scale_Range_Spec.md` | P0 | Tag | `/standard/scales` | ScaleRangeSelector / ScaleInput / ScaleRangeTag | ScaleType / ScaleRange / TagScaleConfig / BuildingScaleBinding（如采用） | `GET /scale-types`<br>`GET /scale-types/{code}/ranges`<br>`POST /scale-ranges/match` | 分档可配置；校验连续/不重叠；手调锁定；结果可追溯 |
| 02_Standard_Library | `specs/02_Standard_Library/Standard_Mapping_Spec.md` | P0 | Foundation | `/standard/mappings`<br>`/tagging/workbench`（归集） | SpaceSelector / ProfessionSelector / MappingRuleEditor | SpaceCategory / ProfessionCategory / MappingRule / EntityBinding | `GET /spaces`<br>`GET /professions`<br>`POST /mappings/auto`<br>`GET/POST /mappings/rules` | 规则可维护；低置信进待确认；结果可锁定；空间×专业矩阵合法性校验 |

---

## 03_Data_Collection（采集：导入→原样预览→补录→入“我的数据”）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 03_Data_Collection | `specs/03_Data_Collection/Collection_Overview_Spec.md` | P0 | Foundation | `/collect` | ImportWizard / BatchList | ImportBatch / FileMeta / ParseStatus | `POST /imports`<br>`GET /imports` | 明确支持格式、导入步骤、失败重试、批次可追溯 |
| 03_Data_Collection | `specs/03_Data_Collection/Cost_File_Spec.md` | P0 | Overview | `/collect/cost-files`<br>`/collect/import/:batchId` | FilePreview / RawTree / FieldMapper | RawCostFile / ParsedTreeNode / RawRow / PreviewSchema | `POST /cost-files/import`<br>`GET /cost-files/{id}`<br>`GET /cost-files/{id}/preview` | 原样预览可用；层级树可浏览；解析日志明确；字段映射可保存 |
| 03_Data_Collection | `specs/03_Data_Collection/Price_File_Spec.md` | P0 | Overview | `/collect/price-files` | MetaForm（时点/地区）/ UnitNormalize | PriceFileMeta / PriceRow / PriceSource | `POST /price-files/import`<br>`GET /price-files/{id}` | 元数据必填校验；单位归一；重复导入处理策略 |
| 03_Data_Collection | `specs/03_Data_Collection/Data_Lake_Browser_Spec.md` | P0 | Cost/Price | `/data-lake` | LakeExplorer / PreviewPanel | LakeObject / VersionInfo / AccessLog | `GET /lake/objects`<br>`GET /lake/objects/{id}` | 原样存储可查；版本可见；权限隔离；下载/预览一致 |
| 03_Data_Collection | `specs/03_Data_Collection/My_Data_Workspace_Spec.md` | P0 | Lake | `/my-data` | SnapshotTable / EditPanel | MyDataRecord / DraftPackage / ChangeSet | `GET /my-data`<br>`PUT /my-data/{id}` | 可编辑可保存草稿；变更记录；可生成入库包（Draft） |
| 03_Data_Collection | `specs/03_Data_Collection/PR_Review_Publish_Spec.md` | P1 | MyData | `/pr` | PRList / DiffViewer / ApproveFlow | PR / PRReview / PublishLog | `POST /pr/submit`<br>`POST /pr/{id}/approve`<br>`POST /pr/{id}/reject` | 审核意见必填；差异可视化；通过后生成企业库版本/日志 |

---

## 04_Data_Processing（加工：清洗规则集中化 + 待确认池）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 04_Data_Processing | `specs/04_Data_Processing/Data_Cleaning_Spec.md` | P1 | Collection/Tagging | `/processing/rules` | RuleTable / RuleEditor / RunHistory | CleaningRule / RuleScope / RunRecord | `GET/POST/PUT /cleaning/rules`<br>`POST /cleaning/run` | 规则可启停；范围明确；执行记录可追溯；命中结果可定位到数据 |
| 04_Data_Processing | `specs/04_Data_Processing/Metadata_Enrichment_Spec.md` | P1 | Collection | `/processing/metadata` | BatchMetaForm / ValidationTips | ProjectMeta / StageMeta / PriceBaseMeta | `PUT /imports/{id}/metadata` | 元数据补录必填项；校验提示；与后续指标/估算口径对齐 |
| 04_Data_Processing | `specs/04_Data_Processing/Processing_Review_Queue_Spec.md` | P1 | Cleaning/Mapping | `/processing/review-queue` | QueueTree / IssueTable / FixDrawer | ReviewIssue / ResolutionLog | `GET /review-queue`<br>`POST /review-queue/{id}/resolve` | 低置信/冲突统一入口；修复可回写；修复留痕 |

---

## 04_Data_Tagging（标签化：单体识别→标签→面积→归集→校验）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 04_Data_Tagging | `specs/04_Data_Tagging/Tagging_Process_Spec.md` | P0 | 标准库+采集 | `/tagging/tasks`<br>`/tagging/workbench/:taskId` | Stepper / OriginalBillTree / UnitList / UnitConfigPanel / BottomIssues | TaggingTask / BuildingUnit / UnitArea / UnitCostDetail / TaggingLog | `GET /projects/{id}/units`<br>`PUT /units/{id}`<br>`POST /units/{id}/aggregate`<br>`POST /units/{id}/validate` | Step1~5 可跑通；可批量；低置信待确认；可定位修复；完成后进入“可计算指标”状态 |
| 04_Data_Tagging | `specs/04_Data_Tagging/Unit_Identify_Spec.md` | P1 | Tagging | Workbench- Step1 | Merge/Split Dialog / Boundary Picker | UnitIdentifyRule / UnitLinkage | `POST /units/merge`<br>`POST /units/split` | 合并/拆分可追溯；边界调整后成本重算；撤销策略 |
| 04_Data_Tagging | `specs/04_Data_Tagging/Space_Profession_Aggregation_Spec.md` | P1 | Mapping | Workbench- Step4 | MatrixGrid / TraceDrawer / QuickFix | EntitySpaceProfessionBinding / AggregationFact | `POST /mappings/auto`<br>`PUT /bindings/{id}` | 任一格可追溯到原始条目；手工改映射可锁定；合法组合校验 |
| 04_Data_Tagging | `specs/04_Data_Tagging/Tagging_Validation_Spec.md` | P1 | Tagging | Workbench- Step5 | ValidationPanel / JumpToFix | ValidationRule / ValidationIssue | `POST /units/{id}/validate` | 阻断/警告分层；一键定位字段；完成前强制通过阻断规则 |

---

## 05_Index_System（指标沉淀：计算→分析→审核发布→可用版本）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 05_Index_System | `specs/05_Index_System/Index_Calculation_Spec.md` | P0 | Tagging完成 | `/indexes/calc/tasks`<br>`/indexes/calc/workbench/:taskId` | CalcTaskList / DimensionTree / PreviewCard / SamplesDrawer | CostIndex / IndexSample / CalculationTask / OutlierResult | `POST /indexes/calculate`<br>`GET /indexes/calc/tasks/{id}`<br>`GET /indexes/{id}/samples` | 计算链路可解释（筛选/调价/异常/统计）；结果可追溯到样本；失败队列可处理 |
| 05_Index_System | `specs/05_Index_System/Index_Analysis_Spec.md` | P1 | Calculation | `/analysis/overview`<br>`/analysis/pivot`<br>`/analysis/trend`… | KPIBoard / PivotGrid / DrillDrawer / Charts | IndexOverview / AnalysisConfig / AnalysisSnapshot | `GET /analysis/overview`<br>`POST /analysis/multidim`<br>`POST /analysis/trend`<br>`POST /analysis/compare` | 图表可钻取到指标/样本；配置可保存；快照可导出；口径一致 |
| 05_Index_System | `specs/05_Index_System/Index_Publish_Spec.md` | P0 | Calculation | `/publish/versions`<br>`/publish/review/:versionId`<br>`/publish/console/:versionId` | VersionList / DiffViewer / ReviewChecklist / PublishSteps | IndexVersion / ReviewRecord / PublishExecution / OperationLog | `POST /index-versions`<br>`POST /{id}/submit`<br>`POST /{id}/review/approve`<br>`POST /{id}/publish` | 未审核不可发布；发布生成版本快照；发布不影响进行中估算（冻结规则必须落地） |
| 05_Index_System | `specs/05_Index_System/Price_Index_Spec.md` | P1 | Calculation | `/price-index` | Importer / QueryGrid | PriceIndex | `GET/POST /price-index` | 调价数据可维护；时点/地区查询稳定；导入校验 |

---

## 06_Estimation_Pricing（指标匡算→详细估算：版本冻结、多方案对比）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 06_Estimation_Pricing | `specs/06_Estimation_Pricing/Estimation_Overview.md` | P0 | Index发布 | - | - | 任务/方案/快照/冻结规则 | - | 明确“只用 published 版本”；冻结/升级规则；可解释原则 |
| 06_Estimation_Pricing | `specs/06_Estimation_Pricing/Estimation_Spec.md`（指标匡算） | P0 | Index发布 | `/estimation/tasks`<br>`/estimation/tasks/:id/quick` | QuickInput / IndexPicker / ResultCard | EstTask / Scenario / QuickResult / Snapshot | `GET/POST /estimation/tasks`<br>`POST /estimation/recommend`<br>`POST /estimation/calc` | 匡算可跑通；版本冻结可见；导出可用 |
| 06_Estimation_Pricing | `specs/06_Estimation_Pricing/Detailed_Estimation_Spec.md` | P0 | Index发布+字典 | `/estimation/tasks/:id/workbench` | GoldenWorkbench / CandidateCards / BreakdownMatrix / IssuesPanel | EstScenario / UnitInput / IndexCandidate / EstimationResult / Snapshot | `POST /estimation/recommend-indexes`<br>`POST /scenarios/{id}/calculate`<br>`GET /snapshots/{id}` | L4→L1兜底可视化；P25/50/75切换；每行可追溯（指标+系数链） |
| 06_Estimation_Pricing | `specs/06_Estimation_Pricing/Estimation_Dictionaries_Spec.md` | P0 | Foundation | `/estimation/dictionaries` | FactorGrid / ParamFieldGrid / ImportExport | RegionFactor / QualityFactor / StructureFactor / CustomFactor / ParamField | `GET/PUT /estimation/dictionaries/*` | 工作台默认值来自字典；字典变更留痕；锁定方案不被漂移 |
| 06_Estimation_Pricing | `specs/06_Estimation_Pricing/Estimation_Compare_Spec.md`（建议单独） | P1 | Detailed | `/estimation/tasks/:id/compare` | CompareHeader / DiffMatrix / AttributionPanel | CompareResult / DiffLine / ReasonTags | `POST /estimation/compare` | 差异归因：量差/价差/系数差；可导出对比报告；可回链到快照 |

---

## 07_Technical（跨模块契约：事实表/绑定表/快照/版本指针）

| 模块 | 文件（path） | 优先级 | 依赖 | 目标页面/路由 | 关键组件 | 字段表/DTO（必须给出） | API 接口清单（关键） | DoD（完成定义） |
|---|---|---|---|---|---|---|---|---|
| 07_Technical | `specs/07_Technical/Data_Model_Contracts.md` | P0 | 全链路 | - | - | 事实表：unit_cost_fact<br>绑定表：tag/scale/mapping binding<br>指标：cost_index/index_sample<br>版本：index_version | - | 主键/外键/索引策略；字段定义；可追溯链路图 |
| 07_Technical | `specs/07_Technical/API_Contracts.md` | P0 | 全链路 | - | - | 统一分页/筛选/错误码/鉴权 | OpenAPI 目录或接口总表 | 每个接口：请求/响应/错误码/幂等/分页；与页面字段一一对应 |
| 07_Technical | `specs/07_Technical/Snapshot_Versioning_Spec.md` | P0 | Publish+Est | - | - | TaggingSnapshot / IndexVersion / EstimationSnapshot / Pointer | `GET /versions`（概念） | 冻结/升级/回放规则；快照存储；回滚=切指针（不改历史） |

---

# Sprint 建议（Windsurf 可直接照排）

- **Sprint 0（P0 基建）**：00_Doc_Map + 01_Foundation + 02_Standard_Library（3份）  
- **Sprint 1（采集闭环）**：03_Data_Collection（导入→数据湖→我的数据）  
- **Sprint 2（标签化闭环）**：04_Data_Tagging（工作台跑通 Step1~5）  
- **Sprint 3（指标沉淀）**：05_Index_Calculation + 05_Index_Publish（版本可发布）  
- **Sprint 4（匡算落地）**：06_Estimation（任务/匡算/字典/冻结）  
- **Sprint 5（增强稳定性）**：04_Data_Processing（清洗规则中心+待确认池） + 05_Index_Analysis（统计分析） + 06_Compare

---
