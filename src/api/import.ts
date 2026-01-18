/**
 * 导入 API
 * 对齐 specs/03_Data_Collection/Collection_Overview_Spec.md
 * 对齐 specs/03_Data_Collection/Cost_File_Spec.md
 */

import { get, post, put } from './request';
import type { 
  ImportBatch, 
  ImportMetadata,
  CostTreeNode, 
  CostRow, 
  ParseLog,
  PriceFile,
  PriceRow,
  PaginatedResponse 
} from '@/types';

/** 创建导入任务 */
export function createImport(file: File, type: 'cost' | 'material_price' | 'composite_price') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return post<ImportBatch>('/imports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 获取导入批次列表 */
export function getImports(params?: { type?: string; status?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<ImportBatch>>('/imports', { params });
}

/** 获取导入批次详情 */
export function getImportDetail(batchId: string) {
  return get<ImportBatch>(`/imports/${batchId}`);
}

/** 重试导入 */
export function retryImport(batchId: string) {
  return post<ImportBatch>(`/imports/${batchId}/retry`);
}

/** 更新导入元数据 */
export function updateImportMetadata(batchId: string, metadata: ImportMetadata) {
  return put<ImportBatch>(`/imports/${batchId}/metadata`, metadata);
}

/** 获取造价文件树 */
export function getCostFileTree(fileId: string) {
  return get<CostTreeNode[]>(`/cost-files/${fileId}/tree`);
}

/** 获取造价文件预览 */
export function getCostFilePreview(fileId: string, nodeId?: string, page = 1, pageSize = 50) {
  return get<PaginatedResponse<CostRow>>(`/cost-files/${fileId}/preview`, {
    params: { nodeId, page, pageSize },
  });
}

/** 获取造价文件解析日志 */
export function getCostFileLogs(fileId: string) {
  return get<ParseLog[]>(`/cost-files/${fileId}/logs`);
}

/** 获取价文件列表 */
export function getPriceFiles(params?: { type?: string; page?: number; pageSize?: number }) {
  return get<PaginatedResponse<PriceFile>>('/price-files', { params });
}

/** 获取价文件详情 */
export function getPriceFileDetail(id: string) {
  return get<PriceFile>(`/price-files/${id}`);
}

/** 更新价文件元数据 */
export function updatePriceFileMetadata(id: string, metadata: Partial<PriceFile>) {
  return put<PriceFile>(`/price-files/${id}/metadata`, metadata);
}

/** 获取价文件预览 */
export function getPriceFilePreview(id: string, page = 1, pageSize = 50) {
  return get<PaginatedResponse<PriceRow>>(`/price-files/${id}/preview`, {
    params: { page, pageSize },
  });
}
