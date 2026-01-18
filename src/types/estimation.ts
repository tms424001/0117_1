/**
 * 估算类型定义
 * 对齐 specs/06_Estimation_Pricing/Estimation_Spec.md
 * 对齐 specs/06_Estimation_Pricing/Detailed_Estimation_Spec.md
 */

import type { BaseEntity, SpaceCode, ProfessionCode, Quantile, Region, Stage } from './common';
import type { FunctionTag } from './tag';
import type { ScaleRange } from './scale';
import type { CostIndex, IndexLevel } from './costIndex';

/** 估算任务状态 */
export type EstimationTaskStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

/** 估算任务 */
export interface EstimationTask extends BaseEntity {
  name: string;
  projectName?: string;
  status: EstimationTaskStatus;
  type: 'quick' | 'detailed';
  
  // 冻结的版本
  indexVersionId: string;
  indexVersionCode: string;
  
  // 统计
  scenarioCount: number;
  unitCount: number;
}

/** 估算方案 */
export interface EstimationScenario extends BaseEntity {
  taskId: string;
  name: string;           // 方案A/B/C
  description?: string;
  isLocked: boolean;
  lockedAt?: string;
  
  // 冻结口径
  indexVersionId: string;
  quantile: Quantile;
  
  // 结果
  totalCost?: number;
  unitCost?: number;
  lastCalcAt?: string;
}

/** 估算单体输入 */
export interface EstimationUnitInput extends BaseEntity {
  scenarioId: string;
  name: string;
  
  // 输入
  functionTag: FunctionTag;
  region: Region;
  totalArea: number;
  aboveGroundArea?: number;
  undergroundArea?: number;
  functionalScale?: number;
  scaleRange?: ScaleRange;
  
  // 系数
  factors: EstimationFactor[];
}

/** 估算系数 */
export interface EstimationFactor {
  type: 'region' | 'quality' | 'structure' | 'custom';
  code: string;
  name: string;
  value: number;
  isManual: boolean;
}

/** 估算结果行 */
export interface EstimationResultRow {
  id: string;
  unitInputId: string;
  space: SpaceCode;
  profession: ProfessionCode;
  
  // 来源
  indexId?: string;
  indexLevel: IndexLevel;
  fallbackPath?: IndexLevel[];
  
  // 值
  baseValue: number;
  adjustedValue: number;
  area: number;
  totalCost: number;
  
  // 系数链
  factorChain: FactorChainItem[];
  
  // 人工调整
  manualAdjustment?: number;
  manualNote?: string;
  
  // 警告
  warnings: string[];
}

/** 系数链项 */
export interface FactorChainItem {
  type: string;
  name: string;
  value: number;
  source: 'dict' | 'manual';
}

/** 估算快照 */
export interface EstimationSnapshot extends BaseEntity {
  scenarioId: string;
  
  // 输入快照
  inputs: EstimationUnitInput[];
  
  // 口径快照
  indexVersionId: string;
  indexVersionCode: string;
  quantile: Quantile;
  priceBaseDate: string;
  
  // 输出快照
  results: EstimationResultRow[];
  totalCost: number;
  unitCost: number;
  
  // 使用的指标
  usedIndexIds: string[];
  
  // 警告
  warnings: string[];
}

/** 指标推荐 */
export interface IndexRecommend {
  index: CostIndex;
  level: IndexLevel;
  confidence: number;
  qualityNote?: string;
}

/** 匡算结果 */
export interface QuickEstimationResult {
  totalCost: number;
  unitCost: number;
  structureBreakdown: {
    space: SpaceCode;
    profession: ProfessionCode;
    cost: number;
    ratio: number;
  }[];
  usedIndexes: IndexRecommend[];
  warnings: string[];
  snapshotId: string;
}

/** 参数字典 */
export interface ParamField extends BaseEntity {
  code: string;
  name: string;
  type: 'number' | 'string' | 'enum' | 'date';
  unit?: string;
  required: boolean;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: { value: string; label: string }[];
  };
}

/** 系数定义 */
export interface FactorDefinition extends BaseEntity {
  type: 'region' | 'quality' | 'structure' | 'custom';
  code: string;
  name: string;
  description?: string;
  defaultValue: number;
  minValue?: number;
  maxValue?: number;
  conditions?: Record<string, unknown>;
}
