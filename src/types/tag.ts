/**
 * 功能标签类型定义
 * 对齐 specs/02_Standard_Library/Tag_System_Spec.md
 */

import type { BaseEntity, Status, SpaceCode } from './common';

/** 标签大类 */
export interface TagCategory extends BaseEntity {
  code: string;           // YI/JY/BG...
  name: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  status: Status;
}

/** 功能标签 */
export interface FunctionTag extends BaseEntity {
  categoryCode: string;
  code: string;           // YI-01
  name: string;           // 门诊
  fullName: string;       // 医疗-门诊
  defaultSpaces: SpaceCode[];
  defaultUnit?: string;   // 床/班/m²
  functionalUnit?: string;
  keywords: string[];
  synonyms: string[];
  status: Status;
  version: number;
}

/** 标签推荐结果 */
export interface TagRecommendation {
  tag: FunctionTag;
  confidence: number;     // 0-1
  matchedKeyword?: string;
}

/** 标签列表查询参数 */
export interface TagQueryParams {
  categoryCode?: string;
  keyword?: string;
  status?: Status;
  page?: number;
  pageSize?: number;
}
