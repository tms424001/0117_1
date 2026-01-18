/**
 * 数据湖类型定义
 * 对齐 specs/03_Data_Collection/Data_Lake_Browser_Spec.md
 */

import type { BaseEntity } from './common';
import type { ImportType } from './import';

/** 数据湖对象 */
export interface LakeObject extends BaseEntity {
  type: ImportType;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  versionCount: number;
  currentVersionId: string;
  scope: 'personal' | 'enterprise';
  batchId: string;
}

/** 数据湖版本 */
export interface LakeVersion extends BaseEntity {
  objectId: string;
  version: number;
  fileSize: number;
  checksum?: string;
  changelog?: string;
}

/** 我的数据记录 */
export interface MyDataRecord extends BaseEntity {
  type: 'material' | 'composite' | 'index' | 'case' | 'batch';
  name: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  changeCount: number;
  lastChangeAt?: string;
}

/** 草稿包 */
export interface DraftPackage extends BaseEntity {
  recordIds: string[];
  status: 'pending' | 'submitted';
  prId?: string;
}
