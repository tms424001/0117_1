# 工程造价数字化平台 Specs（总入口）

> Spec Pack：Product Spec v0.9（页面级可开发）  
> 更新日期：2026-01-17  
> Owner：Windsurf / 产品&架构共用

---

## 1. 平台目标一句话
让造价数据从“电子文档给人看”进化为“数字资产给机器用”：  
**采集 → 加工 → 标签化 → 指标沉淀 → 发布 → 估算调用**形成闭环。

---

## 2. 主线作业流（MVP闭环）
1) 采集导入造价文件（数据湖原样存储）  
2) 补录元数据（地区/阶段/价格基准期/项目概况）  
3) 标签化工作台：单体识别→功能标签→面积规模→空间×专业归集→校验完成  
4) 指标计算：样本筛选→调价→异常识别→统计→生成指标  
5) 指标审核发布：版本管理→审核→发布（生成 IndexVersion/STR）  
6) 指标匡算：调用已发布版本（冻结口径）输出估算结果

> 详细步骤见 `00_Doc_Map/Flow_Playbook.md`

---

## 3. 文档分层
- **Product Spec（本包）**：页面IA、线框、字段口径、交互与验收（防跑偏）
- **Implementation Notes（Windsurf补充）**：路由文件、组件路径、DTO/DB对齐、接口实现

---

## 4. DoD（完成定义）
所有页面类 Spec 必须满足 `00_Doc_Map/DoD_Checklist.md`。

---

## 5. P0 目录索引（闭环必做）
- 00_Doc_Map：Flow_Playbook / Glossary / DoD
- 01_Foundation：IA / 黄金页母版 / 交互模式 / 权限
- 02_Standard_Library：标签体系 / 规模分档 / 空间专业映射
- 03_Data_Collection：采集总览 / 造价文件 / 价文件 / 数据湖 / 我的数据
- 04_Data_Tagging：标签化工作台
- 05_Index_System：指标计算 / 审核发布
- 06_Estimation_Pricing：估算总纲 / 指标匡算 / 详细估算 / 参数字典
- 07_Technical：数据模型契约 / API契约 / 快照与版本冻结

---
