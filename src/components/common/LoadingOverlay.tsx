/**
 * 加载遮罩组件
 */

import React from 'react';
import { Spin } from 'antd';

export interface LoadingOverlayProps {
  loading: boolean;
  tip?: string;
  children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  tip = '加载中...',
  children,
}) => {
  return (
    <Spin spinning={loading} tip={tip}>
      {children}
    </Spin>
  );
};

export default LoadingOverlay;
