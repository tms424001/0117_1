/**
 * 指标类型定义
 * 对齐 specs/05_Index_System/Index_Calculation_Spec.md
 */

import type { BaseEntity, SpaceCode, ProfessionCode, QualityLevel, Quantile, Region, Stage } from './common';
import type { ScaleRange } from './scale';

/** 计算任务状态 */
export type CalcTaskStatus = 'pending' | 'running' | 'completed' | 'failed';

/** 指标计算任务 */
export interface CalcTask extends BaseEntity {
  name: string;
  type: 'full' | 'incremental';
  status: CalcTaskStatus;
  progress?: number;
  
  // 参数
  priceBaseDate: string;
  outlierMethod: 'iqr' | 'zscore' | 'mad';
  minSampleCount: number;
  
  // 结果统计
  totalCombinations?: number;
  generatedCount?: number;
  skippedCount?: number;
  failedCount?: number;
}

/** 指标状态 */
export type IndexStatus = 'draft' | 'published' | 'archived';

/** 造价指标 */
export interface CostIndex extends BaseEntity {
  // 维度
  tagCode: string;
  tagName: string;
  space: SpaceCode;
  profession: ProfessionCode;
  scaleRangeCode?: string;
  region?: Region;
  stage?: Stage;
  priceBaseDate: string;
  
  // 统计值
  sampleCount: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  outlierCount: number;
  outlierRatio: number;
  
  // 推荐值（发布用）
  p25: number;
  p50: number;
  p75: number;
  recommendedValue: number;
  
  // 质量
  qualityLevel: QualityLevel;
  qualityScore: number;
  
  // 状态
  status: IndexStatus;
  versionId?: string;
  calcTaskId: string;
}

/** 指标样本 */
export interface IndexSample extends BaseEntity {
  indexId: string;
  unitId: string;
  unitName: string;
  projectName?: string;
  value: number;
  isOutlier: boolean;
  outlierReason?: string;
  weight?: number;
}

/** 指标查询参数 */
export interface IndexQueryParams {
  tagCode?: string;
  space?: SpaceCode;
  profession?: ProfessionCode;
  scaleRangeCode?: string;
  regionCode?: string;
  priceBaseDate?: string;
  status?: IndexStatus;
  qualityLevel?: QualityLevel;
  page?: number;
  pageSize?: number;
}

/** 指标层级（用于降级） */
export type IndexLevel = 'L4' | 'L3' | 'L2' | 'L1';

/** 指标匹配结果 */
export interface IndexMatchResult {
  index?: CostIndex;
  level: IndexLevel;
  fallbackPath?: IndexLevel[];
  warnings: string[];
}
