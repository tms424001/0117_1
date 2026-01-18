/**
 * 标签化 API
 * 对齐 specs/04_Data_Tagging/Tagging_Process_Spec.md
 */

import { get, post, put } from './request';
import type { 
  TaggingTask,
  BuildingUnit,
  UnitCostFact,
  AggregateRequest,
  AggregateResult,
  ValidationIssue,
  PaginatedResponse 
} from '@/types';

/** 获取标签化任务列表 */
export function getTaggingTasks(params?: { status?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<TaggingTask>>('/tagging/tasks', { params });
}

/** 获取标签化任务详情 */
export function getTaggingTaskDetail(taskId: string) {
  return get<TaggingTask>(`/tagging/tasks/${taskId}`);
}

/** 获取项目单体列表 */
export function getProjectUnits(projectId: string) {
  return get<BuildingUnit[]>(`/projects/${projectId}/units`);
}

/** 获取单体详情 */
export function getUnitDetail(unitId: string) {
  return get<BuildingUnit>(`/units/${unitId}`);
}

/** 更新单体 */
export function updateUnit(unitId: string, data: Partial<BuildingUnit>) {
  return put<BuildingUnit>(`/units/${unitId}`, data);
}

/** 聚合单体造价 */
export function aggregateUnit(data: AggregateRequest) {
  return post<AggregateResult>(`/units/${data.unitId}/aggregate`, data);
}

/** 校验单体 */
export function validateUnit(unitId: string) {
  return post<{ errors: ValidationIssue[]; warnings: ValidationIssue[] }>(`/units/${unitId}/validate`);
}

/** 获取单体造价事实 */
export function getUnitCostFacts(unitId: string) {
  return get<UnitCostFact[]>(`/units/${unitId}/facts`);
}

/** 完成项目标签化 */
export function completeTagging(projectId: string) {
  return post<{ success: boolean; message?: string }>(`/projects/${projectId}/complete-tagging`);
}
