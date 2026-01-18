/**
 * 映射规则 API
 * 对齐 specs/02_Standard_Library/Standard_Mapping_Spec.md
 */

import { get, post, put } from './request';
import type { 
  Space, 
  Profession, 
  MappingRule, 
  AutoMappingRequest, 
  AutoMappingResult,
  PaginatedResponse 
} from '@/types';

/** 获取空间列表 */
export function getSpaces() {
  return get<Space[]>('/spaces');
}

/** 获取专业列表 */
export function getProfessions(spaceCode?: string, groupCode?: string) {
  return get<Profession[]>('/professions', { 
    params: { spaceCode, groupCode } 
  });
}

/** 获取映射规则列表 */
export function getMappingRules(targetType?: 'space' | 'profession') {
  return get<PaginatedResponse<MappingRule>>('/mappings/rules', { 
    params: { targetType } 
  });
}

/** 创建映射规则 */
export function createMappingRule(data: Partial<MappingRule>) {
  return post<MappingRule>('/mappings/rules', data);
}

/** 更新映射规则 */
export function updateMappingRule(id: string, data: Partial<MappingRule>) {
  return put<MappingRule>(`/mappings/rules/${id}`, data);
}

/** 批量自动映射 */
export function autoMapping(data: AutoMappingRequest) {
  return post<AutoMappingResult[]>('/mappings/auto', data);
}
