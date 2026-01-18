/**
 * 标签化类型定义
 * 对齐 specs/04_Data_Tagging/Tagging_Process_Spec.md
 */

import type { BaseEntity, SpaceCode, ProfessionCode, QualityLevel } from './common';
import type { FunctionTag } from './tag';
import type { ScaleRange } from './scale';

/** 标签化任务状态 */
export type TaggingTaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/** 标签化任务 */
export interface TaggingTask extends BaseEntity {
  projectId: string;
  projectName: string;
  batchId: string;
  status: TaggingTaskStatus;
  totalUnits: number;
  completedUnits: number;
  currentStep: TaggingStep;
  assignee?: string;
}

/** 标签化步骤 */
export type TaggingStep = 'unit_identify' | 'tag_assign' | 'area_input' | 'cost_aggregate' | 'validation';

/** 单体状态 */
export type UnitStatus = 'pending' | 'in_progress' | 'completed' | 'error';

/** 建筑单体 */
export interface BuildingUnit extends BaseEntity {
  taskId: string;
  name: string;
  originalName?: string;
  status: UnitStatus;
  
  // 标签
  functionTag?: FunctionTag;
  tagConfidence?: number;
  tagLocked?: boolean;
  
  // 面积
  totalArea?: number;
  aboveGroundArea?: number;
  undergroundArea?: number;
  outdoorArea?: number;
  
  // 功能规模
  functionalScale?: number;
  functionalUnit?: string;
  scaleRange?: ScaleRange;
  
  // 校验
  validationErrors: ValidationIssue[];
  validationWarnings: ValidationIssue[];
}

/** 校验问题 */
export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  code: string;
  message: string;
  field?: string;
  rowId?: string;
  suggestion?: string;
}

/** 单体造价事实（核心） */
export interface UnitCostFact extends BaseEntity {
  unitId: string;
  space: SpaceCode;
  profession: ProfessionCode;
  totalCost: number;
  unitCost: number;        // 单方造价
  area: number;
  confidence: number;
  needsReview: boolean;
  bindingId?: string;      // 人工确认绑定
}

/** 单体造价明细（展示用） */
export interface UnitCostDetail extends BaseEntity {
  factId: string;
  itemName: string;
  feature?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
  totalPrice: number;
  originPath: string;
}

/** 空间专业绑定 */
export interface SpaceProfessionBinding extends BaseEntity {
  unitId: string;
  originalName: string;
  originalPath?: string;
  space: SpaceCode;
  profession: ProfessionCode;
  confidence: number;
  isManual: boolean;
  lockedAt?: string;
  lockedBy?: string;
}

/** 聚合请求 */
export interface AggregateRequest {
  unitId: string;
  forceRecalc?: boolean;
}

/** 聚合结果 */
export interface AggregateResult {
  unitId: string;
  facts: UnitCostFact[];
  reviewQueue: SpaceProfessionBinding[];
  warnings: string[];
}
