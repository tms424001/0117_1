A. 通用 DoD 子清单模板（所有 Spec 必须满足）

适用：除纯 README/术语表外，所有业务/页面类 Spec 必须至少包含以下条目。

A1 文档头（Meta）

 标题、版本、日期、所属模块、作者/Owner

 目标用户/角色（Personas）

 在整体作业流中的位置（1 张流程图/ASCII）

A2 范围与非范围

 本期覆盖（MVP Scope）

 明确不做（Out of Scope / 二期）

A3 IA 与路由

 页面列表 + 路由（Route）

 页面入口（从哪里进）、返回路径、面包屑规则

A4 黄金页母版/布局

 指定是否使用黄金页母版（左树/右表/抽屉/底部面板）

 线框图（至少 1 张核心页）

 三态：Loading/Empty/Error（每页至少列 1 条）

A5 关键组件

 组件清单（复用组件 + 本页新增组件）

 每个关键组件：Props（输入/输出回调）、交互要点

A6 字段表与数据结构（DTO）

 页面展示字段表（列/表单字段，含类型、必填、校验、示例）

 前端 DTO（列表 DTO / 详情 DTO / 编辑 DTO）

 关键枚举（状态、类型、标签等）

A7 交互流程（作业流）

 关键用户路径 3~5 条（从进入到完成）

 批量操作（如有）：勾选、批量应用、批量导出等

 可追溯入口（查看来源/样本/日志）位置说明

A8 校验与提示

 阻断错误 vs 警告（分级）

 就地提示（字段旁）+ 汇总面板（底部/侧边）的联动

A9 API 清单与示例

 本页 API 列表（GET/POST/PUT…）

 每个关键 API 至少 1 个请求/响应示例（含错误码）

 分页/筛选/排序规范（page/pageSize、query）

A10 权限与审计

 角色/权限（页面可见、按钮可点）

 操作日志（谁在何时做了什么，至少列 3 类关键操作）

A11 性能与体验

 关键性能指标（加载 <1s、计算 <3s…）

 大数据量策略（分页/虚拟滚动/后端聚合）

A12 验收用例（Given/When/Then）

 至少 5 条验收用例：成功、失败、边界、并发/锁定、回滚/撤销

B. 每个文件的 DoD 子清单模板（按 DocMap）

说明：下面每个条目都是“可直接填空”的 DoD。
如果你只想跑 MVP 主线：优先把 P0 文件全部打勾完成。

00_Doc_Map
1) specs/README.md

 模块地图（采集→加工→标签→指标→发布→匡算）

 文档目录索引（按模块/按主线）

 版本规则（IndexVersion、Snapshot、冻结）

 DoD 总入口链接（指向 00_Doc_Map/DoD_Checklist.md）

 “新同学 30 分钟上手指南”（读什么、先跑哪个链路）

2) specs/00_Doc_Map/Flow_Playbook.md

 主线作业流 1 张总流程图

 每一步：输入 → 操作 → 输出 → 常见失败 → 定位页面（链接）

 最小可演示 Demo（导入1个项目→标签化→算指标→发布→匡算）

 验收：按 Playbook 走一遍不需要额外口头解释

3) specs/00_Doc_Map/Glossary.md

 术语表（中英/缩写/禁止混用）

 “同义词归并”：比如“综价/综合单价/综合价”

 示例：每个核心术语给 1 个真实例子（门诊楼/住院楼）

4) specs/00_Doc_Map/DoD_Checklist.md

 上面 A. 通用 DoD 完整收录

 Page Spec / Data Spec / Engine Spec 的差异化条目

 交付物样例（线框、字段表、API 示例、验收用例模板）

01_Foundation
5) specs/01_Foundation/IA_Navigation_Spec.md

 表格：TopNav/SideNav 菜单树 + 路由表（path、title、权限）

 线框：全站布局骨架（顶栏+侧栏+内容区）

 交互：菜单折叠、面包屑规则、Tab 多开策略（如需要）

 验收用例：无权限用户看不到菜单；深链接能正确落到页面

6) specs/01_Foundation/Golden_Page_Template_Spec.md

 线框：黄金页母版（左树/中表/右抽屉/底部面板）

 组件 Props：TreePanel/Grid/Drawer/BottomPanel 的统一接口

 三态：空树/空表/请求失败的统一占位

 验收：各模块黄金页外观一致；换数据源不改布局

7) specs/01_Foundation/Interaction_Patterns_Spec.md

 批量操作规范（勾选、全选、跨页选择策略）

 搜索/筛选（同步 URL 参数 or 本地状态）

 “定位”规范（从问题面板跳到字段/行并高亮）

 验收：所有页面一致遵守（抽屉/弹窗关闭、Esc 等）

8) specs/01_Foundation/Permission_RBAC_Spec.md

 表格：角色×权限矩阵（采集/审核/发布/估算）

 字段：PermissionCode、Scope（个人/企业）、Resource

 审计：关键操作必须记录（提交审核/发布/锁定方案）

 验收：按钮级权限生效 + 后端拒绝有一致错误码

02_Standard_Library
9) specs/02_Standard_Library/Tag_System_Spec.md

 目标页面：/standard/tags（管理）+ 被使用页面清单

 线框：标签库（左类目树+右表+抽屉）

 字段表：TagCategory、FunctionTag、TagMappingRule、Binding（如用）

 API 示例：GET /tags、GET /tags/recommend（含 candidates/conflicts）

 验收用例：推荐多候选冲突处理；SW/TG 规则提示；停用不影响历史

10) specs/02_Standard_Library/Scale_Range_Spec.md

 目标页面：/standard/scales

 线框：分档类型树 + 档位区间表 + 校验面板

 字段表：ScaleType/ScaleRange/TagScaleConfig

 API 示例：POST /scale-ranges/match（含 matchReason）

 验收：区间不重叠/连续校验；max=-1 表现为∞；手调锁定不覆盖

11) specs/02_Standard_Library/Standard_Mapping_Spec.md

 目标页面：/standard/mappings（规则库）+ 自动映射工作台（如有）

 线框：规则库（Space/Profession 切换）+ 样本试跑

 字段表：SpaceCategory/ProfessionCategory/MappingRule/Binding

 API 示例：POST /mappings/auto（needsReview、候选 TopK）

 验收：低置信进入待确认；空间×专业非法组合阻断；手动锁定不被重算覆盖

03_Data_Collection
12) specs/03_Data_Collection/Collection_Overview_Spec.md

 目标页面：/collect 总览 + 导入入口

 线框：导入向导（步骤条）+ 导入批次列表

 字段表：ImportBatch/FileMeta/ParseStatus

 API 示例：创建导入批次、查询批次、查看失败原因

 验收：导入失败可重试；批次状态机正确

13) specs/03_Data_Collection/Cost_File_Spec.md

 目标页面：/collect/cost-files、/collect/import/:batchId

 线框：原样预览（树+表）+ 解析日志面板

 字段表：ParsedTreeNode/RawRow/PreviewSchema

 API 示例：上传→解析→预览→保存映射

 验收：大文件分页/虚拟滚动；解析失败提示定位；字段映射可保存并回放

14) specs/03_Data_Collection/Price_File_Spec.md

 目标页面：/collect/price-files

 线框：元数据补录（地区/时点/来源）+ 预览表

 字段表：PriceRow（名称/规格/单位/价格/来源）

 API 示例：导入+校验（单位/时间缺失）

 验收：元数据必填阻断；重复导入策略明确（覆盖/新增）

15) specs/03_Data_Collection/Data_Lake_Browser_Spec.md

 目标页面：/data-lake

 线框：对象列表 + 版本历史 + 预览

 字段表：LakeObject/VersionInfo/AccessLog

 API 示例：列目录、读对象、读版本

 验收：权限隔离；版本可回看；预览与下载一致

16) specs/03_Data_Collection/My_Data_Workspace_Spec.md

 目标页面：/my-data

 线框：我的数据列表（可编辑）+ DraftPackage 生成

 字段表：MyDataRecord/DraftPackage/ChangeSet

 API 示例：保存草稿、提交 PR

 验收：编辑留痕；草稿可回滚；生成入库包成功

17) specs/03_Data_Collection/PR_Review_Publish_Spec.md

 目标页面：/pr

 线框：PR 列表 + Diff Viewer + 审核抽屉

 字段表：PR/Review/PublishLog

 API 示例：submit/approve/reject

 验收：审核意见必填；驳回可重提；合并后产生版本与变更日志

04_Data_Processing
18) specs/04_Data_Processing/Data_Cleaning_Spec.md

 目标页面：/processing/rules

 线框：规则库 + 规则编辑器 + 执行记录

 字段表：CleaningRule（范围/启停/阈值/版本）

 API 示例：run cleaning → 命中结果列表

 验收：规则可回溯；命中可定位到数据行；启停即时生效

19) specs/04_Data_Processing/Metadata_Enrichment_Spec.md

 目标页面：/processing/metadata

 线框：批次元数据表单 + 校验提示

 字段表：项目概况、阶段、价格基准期、地区

 API 示例：保存元数据、读取元数据

 验收：缺关键元数据阻断进入后续（标签/指标/估算）

20) specs/04_Data_Processing/Processing_Review_Queue_Spec.md

 目标页面：/processing/review-queue

 线框：问题类型树 + 问题表 + 修复抽屉

 字段表：ReviewIssue/ResolutionLog

 API 示例：resolve、批量 resolve

 验收：修复后影响范围提示；修复留痕；可一键跳回来源页面

04_Data_Tagging
21) specs/04_Data_Tagging/Tagging_Process_Spec.md

 目标页面：/tagging/tasks、/tagging/workbench/:taskId

 线框：三栏工作台 + Stepper + 底部问题面板

 字段表：BuildingUnit、UnitArea、UnitCostDetail、TaggingTask

 API 示例：aggregate、validate、complete-tagging

 验收：Step1~5 全链路走通；阻断/警告分层；完成后可进入指标计算

22) specs/04_Data_Tagging/Unit_Identify_Spec.md

 线框：合并/拆分对话框 + 边界勾选

 规则：同名多栋合并建议、室外单体识别

 API 示例：merge/split

 验收：边界调整后成本重算；撤销策略明确

23) specs/04_Data_Tagging/Space_Profession_Aggregation_Spec.md

 线框：空间×专业矩阵 + 行点击追溯到原始条目

 字段表：Binding/Fact（至少能追溯条目数与 queryKey）

 API 示例：自动映射、手动改映射、锁定

 验收：每格可追溯；非法组合阻断；低置信进入待确认

24) specs/04_Data_Tagging/Tagging_Validation_Spec.md

 线框：阻断/警告清单 + 定位按钮

 字段表：ValidationIssue（severity/field/message/actionHint）

 API 示例：validate

 验收：阻断未解决不能完成；定位跳转准确

05_Index_System
25) specs/05_Index_System/Index_Calculation_Spec.md

 目标页面：任务列表 + 计算工作台

 线框：维度树 + 预览卡 + 样本抽屉 + 失败队列

 字段表：CostIndex、IndexSample、CalculationTask、OutlierResult

 API 示例：calculate、get task status、get samples

 验收：筛选→调价→异常→统计→生成；样本可追溯；样本不足不生成

26) specs/05_Index_System/Index_Analysis_Spec.md

 目标页面：overview/pivot/trend/compare/quality

 线框：Pivot 页必须带 Drill Drawer

 字段表：IndexOverview、AnalysisConfig、AnalysisSnapshot

 API 示例：multidim + drill 到 indexes + drill 到 samples

 验收：图表联动；钻取链路完整；配置可保存；快照可导出

27) specs/05_Index_System/Index_Publish_Spec.md

 目标页面：版本列表/版本详情/审核工作台/发布控制台/发布进度

 线框：审核清单 + 问题跳转到指标详情/样本

 字段表：IndexVersion、ReviewRecord、PublishExecution、OperationLog

 API 示例：submit/review-check/approve/publish/precheck

 验收：未审核不可发布；发布生成版本；发布不影响进行中估算（冻结机制落库）

28) specs/05_Index_System/Price_Index_Spec.md

 目标页面：价格指数管理

 字段表：PriceIndex（region/yearMonth/indexValue/source）

 API 示例：导入、查询、编辑

 验收：调价可复现；缺指数的处理策略明确（阻断/提示）

06_Estimation_Pricing
29) specs/06_Estimation_Pricing/Estimation_Overview.md

 写清“只用 published 指标版本”

 写清“冻结/升级版本”的产品行为

 写清“可解释/可追溯”最低要求（每行来源证据）

30) specs/06_Estimation_Pricing/Estimation_Spec.md（指标匡算）

 目标页面：任务列表 + 匡算页

 线框：匡算输入（单体维度）+ 推荐值（P50）+ 输出卡

 字段表：Task/Scenario/QuickResult/Snapshot

 API 示例：recommend、calculate、export

 验收：能在已发布版本下快速出总价；冻结版本显示；导出可用

31) specs/06_Estimation_Pricing/Detailed_Estimation_Spec.md

 目标页面：详细估算工作台（黄金页）

 线框：左树/中矩阵/右候选/底部问题（必须）

 字段表：UnitInput、IndexCandidate、ResultBreakdown（含来源链）

 API 示例：recommend-indexes（TopK）+ calculate（返回 breakdown+warnings）

 验收：L4→L1兜底可见；P25/50/75切换；每行可追溯（指标+分位+系数链）

32) specs/06_Estimation_Pricing/Estimation_Dictionaries_Spec.md

 目标页面：/estimation/dictionaries

 线框：系数库（地区/品质/结构/自定义）+ 参数字典表

 字段表：Factor（level/province/city/factor）+ ParamField（type/unit/validation）

 API 示例：GET/PUT dictionaries、导入导出

 验收：工作台默认值来自字典；字典变更留痕；锁定方案不漂移

33) specs/06_Estimation_Pricing/Estimation_Compare_Spec.md

 目标页面：/estimation/tasks/:id/compare

 线框：方案A/B选择 + 差异矩阵 + 归因面板

 字段表：CompareResult（量差/价差/系数差）

 API 示例：compare（按快照对比）

 验收：差异可解释；能回链到快照/指标来源；导出对比报告

07_Technical
34) specs/07_Technical/Data_Model_Contracts.md

 ER 图（事实表/绑定表/指标表/版本表/快照表）

 字段字典（每表关键字段、索引、唯一约束）

 追溯链路：Index → Sample → UnitCostDetail → 原始清单（最少一条链路图）

 验收：任何指标/估算结果都能追到原始条目或 queryKey

35) specs/07_Technical/API_Contracts.md

 API 总表（path/method/用途/权限/分页/错误码）

 通用规范：分页、筛选、排序、幂等、错误码格式

 每模块至少列 3 个关键接口的完整示例

 验收：前端字段表能在 API 响应里找到对应字段

36) specs/07_Technical/Snapshot_Versioning_Spec.md

 快照类型：TaggingSnapshot / IndexVersion / EstimationSnapshot

 冻结规则：估算会话绑定版本；升级生成新方案/新快照

 指针规则：发布切换=切 pointer（不改历史）

 验收：回放快照结果一致；新发布不影响旧会话；可追溯审计完整