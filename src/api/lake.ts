/**
 * 数据湖 API
 * 对齐 specs/03_Data_Collection/Data_Lake_Browser_Spec.md
 */

import { get, post, put } from './request';
import type { 
  LakeObject, 
  LakeVersion, 
  MyDataRecord,
  DraftPackage,
  PaginatedResponse 
} from '@/types';

/** 获取数据湖对象列表 */
export function getLakeObjects(params?: { type?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<LakeObject>>('/lake/objects', { params });
}

/** 获取数据湖对象详情 */
export function getLakeObjectDetail(id: string) {
  return get<LakeObject>(`/lake/objects/${id}`);
}

/** 获取数据湖对象版本列表 */
export function getLakeObjectVersions(id: string) {
  return get<LakeVersion[]>(`/lake/objects/${id}/versions`);
}

/** 获取我的数据列表 */
export function getMyData(params?: { type?: string; status?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<MyDataRecord>>('/my-data', { params });
}

/** 更新我的数据 */
export function updateMyData(id: string, data: Partial<MyDataRecord>) {
  return put<MyDataRecord>(`/my-data/${id}`, data);
}

/** 生成草稿包 */
export function createDraftPackage(recordIds: string[]) {
  return post<DraftPackage>('/my-data/draft-package', { recordIds });
}

/** 提交 PR */
export function submitPR(packageId: string) {
  return post<{ prId: string }>('/pr/submit', { packageId });
}
