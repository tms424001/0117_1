/**
 * 页面头部组件
 */

import React, { ReactNode } from 'react';
import { Breadcrumb, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface ActionButton {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 面包屑 */
  breadcrumbs?: BreadcrumbItem[];
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 返回路径 */
  backPath?: string;
  /** 操作按钮 */
  actions?: ActionButton[];
  /** 额外内容 */
  extra?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showBack = false,
  backPath,
  actions = [],
  extra,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb 
          className="mb-2"
          items={breadcrumbs.map((item, index) => ({
            title: item.path ? (
              <a onClick={() => navigate(item.path!)}>{item.title}</a>
            ) : (
              item.title
            ),
            key: index,
          }))}
        />
      )}
      
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 m-0">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1 m-0">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {extra}
          {actions.length > 0 && (
            <Space>
              {actions.map((action) => (
                <Button
                  key={action.key}
                  type={action.type || 'default'}
                  danger={action.danger}
                  icon={action.icon}
                  onClick={action.onClick}
                  loading={action.loading}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
