/**
 * 导入批次类型定义
 * 对齐 specs/03_Data_Collection/Collection_Overview_Spec.md
 */

import type { BaseEntity, Region, Stage } from './common';

/** 导入类型 */
export type ImportType = 'cost' | 'material_price' | 'composite_price';

/** 导入状态 */
export type ImportStatus = 'pending' | 'uploading' | 'parsing' | 'ready' | 'failed';

/** 导入批次 */
export interface ImportBatch extends BaseEntity {
  type: ImportType;
  fileName: string;
  fileSize: number;
  status: ImportStatus;
  progress?: number;      // 0-100
  errorSummary?: string;
  metadata?: ImportMetadata;
}

/** 导入元数据 */
export interface ImportMetadata {
  region?: Region;
  province?: string;
  city?: string;
  stage?: Stage;
  priceBaseDate?: string; // YYYY-MM
  projectName?: string;
  projectOverview?: string;
}

/** 造价文件树节点 */
export interface CostTreeNode {
  id: string;
  name: string;
  level: number;
  path: string;
  childrenCount: number;
  children?: CostTreeNode[];
}

/** 造价文件行 */
export interface CostRow {
  rowId: string;
  itemName: string;
  feature?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
  totalPrice?: number;
  originPath: string;
}

/** 解析日志 */
export interface ParseLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  nodeId?: string;
  rowId?: string;
  timestamp: string;
}

/** 价文件 */
export interface PriceFile extends BaseEntity {
  type: 'material' | 'composite';
  fileName: string;
  region?: Region;
  yearMonth?: string;     // YYYY-MM
  source?: string;
  currency?: string;
  unitStandard?: string;
  status: ImportStatus;
}

/** 价文件行 */
export interface PriceRow {
  id: string;
  name: string;
  spec?: string;
  unit: string;
  price: number;
  source?: string;
}
