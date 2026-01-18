/**
 * 工具栏组件
 * 对齐 specs/01_Foundation/Interaction_Patterns_Spec.md
 */

import React, { ReactNode } from 'react';
import { Input, Button, Space, Dropdown, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

export interface FilterItem {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string[];
  onChange?: (values: string[]) => void;
}

export interface BatchAction {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ToolbarProps {
  /** 搜索配置 */
  search?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
  };
  /** 筛选器 */
  filters?: FilterItem[];
  /** 已选筛选数量 */
  activeFilterCount?: number;
  /** 批量操作 */
  batchActions?: BatchAction[];
  /** 已选择数量 */
  selectedCount?: number;
  /** 总数量 */
  totalCount?: number;
  /** 刷新 */
  onRefresh?: () => void;
  /** 额外内容 */
  extra?: ReactNode;
  /** 自定义类名 */
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  search,
  filters = [],
  activeFilterCount = 0,
  batchActions = [],
  selectedCount = 0,
  totalCount,
  onRefresh,
  extra,
  className = '',
}) => {
  const batchMenuItems: MenuProps['items'] = batchActions.map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    disabled: action.disabled,
    onClick: action.onClick,
  }));

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {/* Search */}
        {search && (
          <Input
            placeholder={search.placeholder || '搜索...'}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={search.value}
            onChange={(e) => search.onChange?.(e.target.value)}
            onPressEnter={(e) => search.onSearch?.((e.target as HTMLInputElement).value)}
            style={{ width: 240 }}
            allowClear
          />
        )}
        
        {/* Filters */}
        {filters.length > 0 && (
          <Badge count={activeFilterCount} size="small">
            <Button icon={<FilterOutlined />}>
              筛选
            </Button>
          </Badge>
        )}
        
        {/* Batch Actions */}
        {batchActions.length > 0 && selectedCount > 0 && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <span className="text-sm text-gray-500">
              已选择 <span className="text-blue-600 font-medium">{selectedCount}</span> 项
              {totalCount && ` / 共 ${totalCount} 项`}
            </span>
            <Dropdown menu={{ items: batchMenuItems }} trigger={['click']}>
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {extra}
        {onRefresh && (
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            title="刷新"
          />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
