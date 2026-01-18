/**
 * 空状态组件
 * 对齐 specs/01_Foundation/Interaction_Patterns_Spec.md - 三态
 */

import React, { ReactNode } from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined, SearchOutlined, InboxOutlined } from '@ant-design/icons';

export type EmptyType = 'no-data' | 'no-result' | 'no-permission' | 'error';

export interface StateEmptyProps {
  type?: EmptyType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

const defaultConfig: Record<EmptyType, { icon: ReactNode; title: string; description: string }> = {
  'no-data': {
    icon: <InboxOutlined className="text-4xl text-gray-300" />,
    title: '暂无数据',
    description: '当前没有任何数据，请先创建',
  },
  'no-result': {
    icon: <SearchOutlined className="text-4xl text-gray-300" />,
    title: '未找到结果',
    description: '没有匹配的搜索结果，请尝试其他关键词',
  },
  'no-permission': {
    icon: <InboxOutlined className="text-4xl text-gray-300" />,
    title: '无权限访问',
    description: '您没有权限查看此内容',
  },
  'error': {
    icon: <InboxOutlined className="text-4xl text-gray-300" />,
    title: '加载失败',
    description: '数据加载失败，请稍后重试',
  },
};

const StateEmpty: React.FC<StateEmptyProps> = ({
  type = 'no-data',
  title,
  description,
  action,
  className = '',
}) => {
  const config = defaultConfig[type];

  return (
    <Empty
      image={config.icon}
      description={
        <div className="text-center">
          <div className="text-gray-600 font-medium mb-1">
            {title || config.title}
          </div>
          <div className="text-gray-400 text-sm">
            {description || config.description}
          </div>
        </div>
      }
      className={`py-12 ${className}`}
    >
      {action && (
        <Button 
          type="primary" 
          icon={action.icon || <PlusOutlined />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Empty>
  );
};

export default StateEmpty;
