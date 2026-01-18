/**
 * 发布 API
 * 对齐 specs/05_Index_System/Index_Publish_Spec.md
 */

import { get, post } from './request';
import type { 
  IndexVersion,
  ReviewItem,
  PublishConfig,
  PublishPrecheck,
  PaginatedResponse 
} from '@/types';

/** 创建指标版本 */
export function createIndexVersion(data: {
  code: string;
  name: string;
  description?: string;
  priceBaseDate: string;
}) {
  return post<IndexVersion>('/index-versions', data);
}

/** 获取指标版本列表 */
export function getIndexVersions(params?: { status?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<IndexVersion>>('/index-versions', { params });
}

/** 获取指标版本详情 */
export function getIndexVersionDetail(versionId: string) {
  return get<IndexVersion>(`/index-versions/${versionId}`);
}

/** 提交审核 */
export function submitForReview(versionId: string) {
  return post<IndexVersion>(`/index-versions/${versionId}/submit`);
}

/** 执行审核检查 */
export function runReviewCheck(versionId: string) {
  return post<ReviewItem[]>(`/index-versions/${versionId}/review/check`);
}

/** 获取审核项列表 */
export function getReviewItems(versionId: string) {
  return get<ReviewItem[]>(`/index-versions/${versionId}/review/items`);
}

/** 审核通过 */
export function approveVersion(versionId: string, comment?: string) {
  return post<IndexVersion>(`/index-versions/${versionId}/review/approve`, { comment });
}

/** 审核驳回 */
export function rejectVersion(versionId: string, comment: string) {
  return post<IndexVersion>(`/index-versions/${versionId}/review/reject`, { comment });
}

/** 发布预检 */
export function publishPrecheck(versionId: string) {
  return get<PublishPrecheck>(`/index-versions/${versionId}/publish/precheck`);
}

/** 发布版本 */
export function publishVersion(versionId: string, config: PublishConfig) {
  return post<IndexVersion>(`/index-versions/${versionId}/publish`, config);
}
