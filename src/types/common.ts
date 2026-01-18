/**
 * 通用类型定义
 */

/** 分页请求参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** API 错误响应 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

/** 通用状态枚举 */
export type Status = 'active' | 'inactive' | 'deleted';

/** 审核状态 */
export type ReviewStatus = 'draft' | 'reviewing' | 'approved' | 'rejected' | 'published' | 'archived';

/** 空间类型 */
export type SpaceCode = 'DS' | 'DX' | 'SW' | 'QT';

/** 空间定义 */
export interface Space {
  code: SpaceCode;
  name: string;
  description?: string;
}

/** 专业类型 */
export type ProfessionCode = 'TJ' | 'GPS' | 'QD' | 'RD' | 'NT' | 'XF' | 'DQ' | 'ZN' | 'OTHER';

/** 专业定义 */
export interface Profession {
  code: ProfessionCode;
  name: string;
  spaceCode: SpaceCode;
  groupCode?: string;
}

/** 地区 */
export interface Region {
  code: string;
  name: string;
  province?: string;
  city?: string;
  level: 'province' | 'city' | 'district';
}

/** 阶段 */
export type Stage = 'estimate' | 'budget' | 'settlement' | 'final';

/** 质量等级 */
export type QualityLevel = 'A' | 'B' | 'C' | 'D';

/** 分位数 */
export type Quantile = 'P25' | 'P50' | 'P75';

/** 基础实体 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
