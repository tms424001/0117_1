/**
 * 发布类型定义
 * 对齐 specs/05_Index_System/Index_Publish_Spec.md
 */

import type { BaseEntity, ReviewStatus, Quantile } from './common';

/** 指标版本 */
export interface IndexVersion extends BaseEntity {
  code: string;           // 2026.01
  name: string;
  description?: string;
  priceBaseDate: string;
  status: ReviewStatus;
  
  // 范围
  indexCount: number;
  tagCount: number;
  regionCount: number;
  
  // 质量
  avgQualityScore?: number;
  coverageRate?: number;
  
  // 审核
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComment?: string;
  
  // 发布
  publishedAt?: string;
  publishedBy?: string;
  publishStrategy?: PublishStrategy;
  publishNote?: string;
}

/** 发布策略 */
export type PublishStrategy = 'immediate' | 'scheduled' | 'grayscale' | 'parallel';

/** 发布配置 */
export interface PublishConfig {
  strategy: PublishStrategy;
  scheduledAt?: string;
  grayscalePercent?: number;
  parallelVersionId?: string;
  note?: string;
}

/** 审核项 */
export interface ReviewItem extends BaseEntity {
  versionId: string;
  type: 'auto' | 'manual';
  category: string;
  title: string;
  description?: string;
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  result?: string;
  indexId?: string;       // 可跳转到指标详情
}

/** 发布预检结果 */
export interface PublishPrecheck {
  canPublish: boolean;
  blockers: string[];
  warnings: string[];
  impactAssessment: {
    activeEstimations: number;
    affectedUsers: number;
    freezeNote: string;
  };
}

/** STR 标准值 */
export interface STRValue extends BaseEntity {
  versionId: string;
  indexId: string;
  quantile: Quantile;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

/** 版本指针 */
export interface VersionPointer extends BaseEntity {
  scope: 'GLOBAL' | 'ORG' | 'USER';
  scopeId?: string;
  currentVersionId: string;
  previousVersionId?: string;
  switchedAt: string;
  switchedBy: string;
}
