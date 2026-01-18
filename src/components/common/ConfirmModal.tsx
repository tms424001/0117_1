/**
 * 确认弹窗组件
 */

import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  danger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = '确认操作',
  content,
  onConfirm,
  onCancel,
  confirmText = '确认',
  cancelText = '取消',
  confirmLoading = false,
  danger = false,
}) => {
  return (
    <Modal
      open={open}
      title={
        <span className="flex items-center gap-2">
          <ExclamationCircleOutlined className={danger ? 'text-red-500' : 'text-orange-500'} />
          {title}
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      okButtonProps={{ danger }}
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;
