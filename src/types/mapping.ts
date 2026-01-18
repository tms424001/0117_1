/**
 * 空间专业映射类型定义
 * 对齐 specs/02_Standard_Library/Standard_Mapping_Spec.md
 */

import type { BaseEntity, Status, SpaceCode, ProfessionCode } from './common';

/** 匹配类型 */
export type MatchType = 'exact' | 'contains' | 'regex' | 'path';

/** 映射规则 */
export interface MappingRule extends BaseEntity {
  targetType: 'space' | 'profession';
  targetCode: SpaceCode | ProfessionCode;
  pattern: string;
  matchType: MatchType;
  priority: number;       // 越大优先级越高
  confidence: number;     // 0-1
  applicableSpaces?: SpaceCode[];  // 仅profession规则使用
  status: Status;
}

/** 自动映射请求 */
export interface AutoMappingRequest {
  items: {
    name: string;
    path?: string;
  }[];
}

/** 自动映射结果 */
export interface AutoMappingResult {
  name: string;
  space?: {
    code: SpaceCode;
    confidence: number;
    ruleId?: string;
  };
  profession?: {
    code: ProfessionCode;
    confidence: number;
    ruleId?: string;
  };
  needsReview: boolean;
}
