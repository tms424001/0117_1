/**
 * 规模分档 API
 * 对齐 specs/02_Standard_Library/Scale_Range_Spec.md
 */

import { get, post, put } from './request';
import type { 
  ScaleType, 
  ScaleRange, 
  ScaleMatchRequest, 
  ScaleMatchResult 
} from '@/types';

/** 获取分档类型列表 */
export function getScaleTypes() {
  return get<ScaleType[]>('/scale-types');
}

/** 获取分档类型下的档位 */
export function getScaleRanges(typeCode: string) {
  return get<ScaleRange[]>(`/scale-types/${typeCode}/ranges`);
}

/** 匹配规模档位 */
export function matchScaleRange(data: ScaleMatchRequest) {
  return post<ScaleMatchResult>('/scale-ranges/match', data);
}

/** 更新档位 */
export function updateScaleRange(id: string, data: Partial<ScaleRange>) {
  return put<ScaleRange>(`/scale-ranges/${id}`, data);
}
