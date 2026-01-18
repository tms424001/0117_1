/**
 * 规模分档类型定义
 * 对齐 specs/02_Standard_Library/Scale_Range_Spec.md
 */

import type { BaseEntity, Status } from './common';

/** 分档类型 */
export type ScaleTypeCode = 'AREA' | 'BED' | 'CLASS' | 'PARKING' | 'CUSTOM';

/** 分档类型定义 */
export interface ScaleType extends BaseEntity {
  code: ScaleTypeCode;
  name: string;           // 面积/床位/班级...
  unit: string;           // m²/床/班
  description?: string;
  isSystem: boolean;      // 系统内置不可删除
  status: Status;
}

/** 规模档位 */
export interface ScaleRange extends BaseEntity {
  typeCode: ScaleTypeCode;
  code: string;           // XS/S/M/L/XL
  name: string;           // 小型/中小型/中型/大型/特大型
  min: number;            // 左闭
  max: number;            // 右开，-1表示无穷大
  rangeText: string;      // <5000 / 5000-10000 / ≥50000
  sortOrder: number;
  status: Status;
}

/** 规模匹配请求 */
export interface ScaleMatchRequest {
  typeCode: ScaleTypeCode;
  value: number;
}

/** 规模匹配结果 */
export interface ScaleMatchResult {
  matched: boolean;
  range?: ScaleRange;
  message?: string;
}
