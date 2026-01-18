/**
 * 状态标签组件
 */

import React from 'react';
import { Tag } from 'antd';

export type StatusType = 
  | 'draft' | 'pending' | 'in_progress' | 'completed' | 'failed'
  | 'reviewing' | 'approved' | 'rejected' | 'published' | 'archived'
  | 'active' | 'inactive';

export interface StatusTagProps {
  status: StatusType | string;
  text?: string;
  size?: 'small' | 'default';
}

const statusConfig: Record<string, { color: string; text: string }> = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'default', text: '待处理' },
  in_progress: { color: 'processing', text: '进行中' },
  completed: { color: 'success', text: '已完成' },
  failed: { color: 'error', text: '失败' },
  reviewing: { color: 'processing', text: '审核中' },
  approved: { color: 'success', text: '已通过' },
  rejected: { color: 'error', text: '已驳回' },
  published: { color: 'success', text: '已发布' },
  archived: { color: 'default', text: '已归档' },
  active: { color: 'success', text: '启用' },
  inactive: { color: 'default', text: '停用' },
  // 导入状态
  uploading: { color: 'processing', text: '上传中' },
  parsing: { color: 'processing', text: '解析中' },
  ready: { color: 'success', text: '就绪' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, text, size = 'default' }) => {
  const config = statusConfig[status] || { color: 'default', text: status };
  
  return (
    <Tag 
      color={config.color}
      className={size === 'small' ? 'text-xs' : ''}
    >
      {text || config.text}
    </Tag>
  );
};

export default StatusTag;
