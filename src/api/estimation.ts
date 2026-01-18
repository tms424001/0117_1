/**
 * 估算 API
 * 对齐 specs/06_Estimation_Pricing/Estimation_Spec.md
 */

import { get, post, put } from './request';
import type { 
  EstimationTask,
  EstimationScenario,
  EstimationUnitInput,
  EstimationSnapshot,
  IndexRecommend,
  QuickEstimationResult,
  FactorDefinition,
  ParamField,
  PaginatedResponse 
} from '@/types';

/** 获取估算任务列表 */
export function getEstimationTasks(params?: { status?: string; type?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<EstimationTask>>('/estimation/tasks', { params });
}

/** 创建估算任务 */
export function createEstimationTask(data: {
  name: string;
  projectName?: string;
  type: 'quick' | 'detailed';
  indexVersionId: string;
}) {
  return post<EstimationTask>('/estimation/tasks', data);
}

/** 获取估算任务详情 */
export function getEstimationTaskDetail(taskId: string) {
  return get<EstimationTask>(`/estimation/tasks/${taskId}`);
}

/** 获取方案列表 */
export function getScenarios(taskId: string) {
  return get<EstimationScenario[]>(`/estimation/tasks/${taskId}/scenarios`);
}

/** 创建方案 */
export function createScenario(taskId: string, data: Partial<EstimationScenario>) {
  return post<EstimationScenario>(`/estimation/tasks/${taskId}/scenarios`, data);
}

/** 更新方案 */
export function updateScenario(scenarioId: string, data: Partial<EstimationScenario>) {
  return put<EstimationScenario>(`/estimation/scenarios/${scenarioId}`, data);
}

/** 锁定方案 */
export function lockScenario(scenarioId: string) {
  return post<EstimationScenario>(`/estimation/scenarios/${scenarioId}/lock`);
}

/** 指标推荐 */
export function recommendIndexes(data: {
  tagCode: string;
  space?: string;
  profession?: string;
  scaleRangeCode?: string;
  regionCode?: string;
  maxCount?: number;
}) {
  return post<IndexRecommend[]>('/estimation/recommend', data);
}

/** 匡算计算 */
export function calculateQuick(data: {
  scenarioId: string;
  inputs: EstimationUnitInput[];
}) {
  return post<QuickEstimationResult>('/estimation/calc', data);
}

/** 详细估算计算 */
export function calculateDetailed(scenarioId: string) {
  return post<EstimationSnapshot>(`/estimation/scenarios/${scenarioId}/calculate`);
}

/** 获取快照 */
export function getSnapshot(snapshotId: string) {
  return get<EstimationSnapshot>(`/estimation/snapshots/${snapshotId}`);
}

/** 导出估算结果 */
export function exportEstimation(snapshotId: string, format: 'xlsx' | 'pdf') {
  return post<{ downloadUrl: string }>('/estimation/export', { snapshotId, format });
}

/** 获取系数定义列表 */
export function getFactorDefinitions(type?: string) {
  return get<FactorDefinition[]>('/estimation/dictionaries/factors', { params: { type } });
}

/** 获取参数字段列表 */
export function getParamFields() {
  return get<ParamField[]>('/estimation/dictionaries/params');
}
