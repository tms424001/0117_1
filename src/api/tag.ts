/**
 * 标签 API
 * 对齐 specs/02_Standard_Library/Tag_System_Spec.md
 */

import { get, post, put } from './request';
import type { 
  TagCategory, 
  FunctionTag, 
  TagRecommendation, 
  TagQueryParams,
  PaginatedResponse 
} from '@/types';

/** 获取标签大类列表 */
export function getTagCategories() {
  return get<TagCategory[]>('/tags/categories');
}

/** 获取标签列表 */
export function getTags(params: TagQueryParams) {
  return get<PaginatedResponse<FunctionTag>>('/tags', { params });
}

/** 获取标签详情 */
export function getTagDetail(code: string) {
  return get<FunctionTag>(`/tags/${code}`);
}

/** 标签推荐 */
export function recommendTags(keyword: string, maxCount = 5) {
  return get<TagRecommendation[]>('/tags/recommend', { 
    params: { keyword, maxCount } 
  });
}

/** 创建标签 */
export function createTag(data: Partial<FunctionTag>) {
  return post<FunctionTag>('/tags', data);
}

/** 更新标签 */
export function updateTag(code: string, data: Partial<FunctionTag>) {
  return put<FunctionTag>(`/tags/${code}`, data);
}
