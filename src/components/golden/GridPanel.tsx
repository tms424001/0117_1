/**
 * 中间表格/网格面板组件
 */

import React, { ReactNode } from 'react';
import { Table, Empty, Spin } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';

export interface GridPanelProps<T = any> {
  /** 列配置 */
  columns: ColumnsType<T>;
  /** 数据源 */
  dataSource: T[];
  /** 行 key */
  rowKey?: string | ((record: T) => string);
  /** 加载状态 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: TableProps<T>['pagination'];
  /** 行选择配置 */
  rowSelection?: TableProps<T>['rowSelection'];
  /** 行点击 */
  onRowClick?: (record: T) => void;
  /** 滚动配置 */
  scroll?: TableProps<T>['scroll'];
  /** 空状态 */
  empty?: {
    description?: string;
    action?: ReactNode;
  };
  /** 虚拟滚动（大数据量） */
  virtual?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 表格大小 */
  size?: 'small' | 'middle' | 'large';
}

function GridPanel<T extends object = any>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  pagination,
  rowSelection,
  onRowClick,
  scroll,
  empty,
  virtual = false,
  className = '',
  size = 'middle',
}: GridPanelProps<T>) {
  // 空状态
  const emptyRender = () => (
    <Empty 
      description={empty?.description || '暂无数据'}
      className="py-12"
    >
      {empty?.action}
    </Empty>
  );

  return (
    <div className={`grid-panel ${className}`}>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination === false ? false : {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          ...pagination,
        }}
        rowSelection={rowSelection}
        onRow={onRowClick ? (record) => ({
          onClick: () => onRowClick(record),
          className: 'cursor-pointer hover:bg-blue-50',
        }) : undefined}
        scroll={scroll || { x: 'max-content' }}
        locale={{ emptyText: emptyRender() }}
        size={size}
        virtual={virtual}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  );
}

export default GridPanel;
