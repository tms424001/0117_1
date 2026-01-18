/**
 * 右侧详情/编辑抽屉组件
 */

import React, { ReactNode } from 'react';
import { Drawer, Button, Space, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export interface DrawerAction {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface DetailDrawerProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: ReactNode;
  /** 宽度 */
  width?: number;
  /** 内容 */
  children: ReactNode;
  /** 底部操作按钮 */
  actions?: DrawerAction[];
  /** 加载状态 */
  loading?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 额外的头部内容 */
  extra?: ReactNode;
  /** 自定义类名 */
  className?: string;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  onClose,
  title,
  width = 400,
  children,
  actions = [],
  loading = false,
  closable = true,
  mask = false,
  maskClosable = true,
  extra,
  className = '',
}) => {
  const footer = actions.length > 0 ? (
    <div className="flex justify-end">
      <Space>
        {actions.map((action) => (
          <Button
            key={action.key}
            type={action.type || 'default'}
            danger={action.danger}
            onClick={action.onClick}
            loading={action.loading}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </div>
  ) : null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      closable={closable}
      closeIcon={<CloseOutlined />}
      mask={mask}
      maskClosable={maskClosable}
      footer={footer}
      extra={extra}
      className={className}
      styles={{
        body: { padding: 0 },
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Spin />
        </div>
      ) : (
        <div className="p-4">
          {children}
        </div>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
