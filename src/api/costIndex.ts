/**
 * 指标 API
 * 对齐 specs/05_Index_System/Index_Calculation_Spec.md
 */

import { get, post } from './request';
import type { 
  CalcTask,
  CostIndex,
  IndexSample,
  IndexQueryParams,
  PaginatedResponse 
} from '@/types';

/** 创建计算任务 */
export function createCalcTask(data: {
  name: string;
  type: 'full' | 'incremental';
  priceBaseDate: string;
  outlierMethod: 'iqr' | 'zscore' | 'mad';
  minSampleCount: number;
}) {
  return post<CalcTask>('/indexes/calculate', data);
}

/** 获取计算任务列表 */
export function getCalcTasks(params?: { status?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<CalcTask>>('/indexes/calc/tasks', { params });
}

/** 获取计算任务详情 */
export function getCalcTaskDetail(taskId: string) {
  return get<CalcTask>(`/indexes/calc/tasks/${taskId}`);
}

/** 获取指标列表 */
export function getIndexes(params: IndexQueryParams) {
  return get<PaginatedResponse<CostIndex>>('/indexes', { params });
}

/** 获取指标详情 */
export function getIndexDetail(indexId: string) {
  return get<CostIndex>(`/indexes/${indexId}`);
}

/** 获取指标样本 */
export function getIndexSamples(indexId: string) {
  return get<IndexSample[]>(`/indexes/${indexId}/samples`);
}
