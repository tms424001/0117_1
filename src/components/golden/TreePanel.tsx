/**
 * 左侧树面板组件
 */

import React, { useState, Key } from 'react';
import { Tree, Input, Tabs, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';

export interface TreeTab {
  key: string;
  label: string;
  data: DataNode[];
}

export interface TreePanelProps {
  /** 标题 */
  title?: string;
  /** 树数据（单树模式） */
  data?: DataNode[];
  /** 多标签页模式 */
  tabs?: TreeTab[];
  /** 当前选中的 key */
  selectedKeys?: Key[];
  /** 展开的 key */
  expandedKeys?: Key[];
  /** 选中回调 */
  onSelect?: TreeProps['onSelect'];
  /** 展开回调 */
  onExpand?: TreeProps['onExpand'];
  /** 是否显示搜索 */
  showSearch?: boolean;
  /** 搜索占位符 */
  searchPlaceholder?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态文案 */
  emptyText?: string;
  /** 自定义类名 */
  className?: string;
}

const TreePanel: React.FC<TreePanelProps> = ({
  title,
  data = [],
  tabs,
  selectedKeys = [],
  expandedKeys,
  onSelect,
  onExpand,
  showSearch = true,
  searchPlaceholder = '搜索...',
  loading = false,
  emptyText = '暂无数据',
  className = '',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key);

  // 获取当前显示的树数据
  const currentData = tabs 
    ? tabs.find(t => t.key === activeTab)?.data || []
    : data;

  // 搜索过滤
  const filterTree = (nodes: DataNode[], search: string): DataNode[] => {
    if (!search) return nodes;
    
    return nodes.reduce<DataNode[]>((acc, node) => {
      const title = String(node.title || '');
      const children = node.children ? filterTree(node.children, search) : [];
      
      if (title.toLowerCase().includes(search.toLowerCase()) || children.length > 0) {
        acc.push({
          ...node,
          children: children.length > 0 ? children : node.children,
        });
      }
      return acc;
    }, []);
  };

  const filteredData = filterTree(currentData, searchValue);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Spin />
        </div>
      );
    }

    if (filteredData.length === 0) {
      return <Empty description={emptyText} className="mt-8" />;
    }

    return (
      <Tree
        treeData={filteredData}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        onExpand={onExpand}
        blockNode
        className="px-2"
      />
    );
  };

  return (
    <div className={`tree-panel h-full flex flex-col ${className}`}>
      {/* Header */}
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-700">
          {title}
        </div>
      )}
      
      {/* Search */}
      {showSearch && (
        <div className="px-3 py-2 border-b border-gray-100">
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            size="small"
          />
        </div>
      )}
      
      {/* Tabs or Tree */}
      <div className="flex-1 overflow-auto">
        {tabs ? (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabs.map(tab => ({
              key: tab.key,
              label: tab.label,
              children: renderContent(),
            }))}
            size="small"
            className="px-2"
          />
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default TreePanel;
