/**
 * 底部面板组件（问题/待确认/日志）
 * 对齐 specs/01_Foundation/Golden_Page_Template_Spec.md
 */

import React, { ReactNode } from 'react';
import { Tabs, Badge, Button, Empty } from 'antd';
import { 
  UpOutlined, 
  DownOutlined, 
  ExclamationCircleOutlined,
  WarningOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

export interface IssueItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  rowId?: string;
  onClick?: () => void;
}

export interface BottomPanelTab {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  content: ReactNode;
}

export interface BottomPanelProps {
  /** 标签页配置 */
  tabs?: BottomPanelTab[];
  /** 问题列表（快捷模式） */
  issues?: IssueItem[];
  /** 是否折叠 */
  collapsed?: boolean;
  /** 折叠回调 */
  onCollapse?: (collapsed: boolean) => void;
  /** 当前激活的标签 */
  activeKey?: string;
  /** 标签切换回调 */
  onTabChange?: (key: string) => void;
  /** 自定义类名 */
  className?: string;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  tabs,
  issues = [],
  collapsed = false,
  onCollapse,
  activeKey,
  onTabChange,
  className = '',
}) => {
  // 统计问题数量
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  // 默认标签页（问题列表）
  const defaultTabs: BottomPanelTab[] = [
    {
      key: 'issues',
      label: '问题',
      icon: <ExclamationCircleOutlined />,
      badge: errorCount + warningCount,
      content: (
        <IssueList issues={issues} />
      ),
    },
  ];

  const finalTabs = tabs || defaultTabs;

  return (
    <div className={`bottom-panel h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <ExclamationCircleOutlined />
              {errorCount} 个错误
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-orange-500 text-sm">
              <WarningOutlined />
              {warningCount} 个警告
            </span>
          )}
          {errorCount === 0 && warningCount === 0 && (
            <span className="text-green-500 text-sm">无问题</span>
          )}
        </div>
        <Button
          type="text"
          size="small"
          icon={collapsed ? <UpOutlined /> : <DownOutlined />}
          onClick={() => onCollapse?.(!collapsed)}
        />
      </div>
      
      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-auto">
          <Tabs
            activeKey={activeKey || finalTabs[0]?.key}
            onChange={onTabChange}
            size="small"
            className="px-4"
            items={finalTabs.map(tab => ({
              key: tab.key,
              label: (
                <span className="flex items-center gap-1">
                  {tab.icon}
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <Badge count={tab.badge} size="small" />
                  )}
                </span>
              ),
              children: tab.content,
            }))}
          />
        </div>
      )}
    </div>
  );
};

/** 问题列表组件 */
const IssueList: React.FC<{ issues: IssueItem[] }> = ({ issues }) => {
  if (issues.length === 0) {
    return <Empty description="暂无问题" className="py-4" />;
  }

  return (
    <div className="space-y-1 py-2">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={`
            flex items-start gap-2 px-3 py-2 rounded cursor-pointer
            hover:bg-gray-50 transition-colors
            ${issue.type === 'error' ? 'text-red-600' : ''}
            ${issue.type === 'warning' ? 'text-orange-500' : ''}
            ${issue.type === 'info' ? 'text-blue-500' : ''}
          `}
          onClick={issue.onClick}
        >
          {issue.type === 'error' && <ExclamationCircleOutlined className="mt-0.5" />}
          {issue.type === 'warning' && <WarningOutlined className="mt-0.5" />}
          {issue.type === 'info' && <FileTextOutlined className="mt-0.5" />}
          <div className="flex-1 min-w-0">
            <div className="text-sm">{issue.message}</div>
            {issue.field && (
              <div className="text-xs text-gray-400 mt-0.5">
                字段: {issue.field}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BottomPanel;
