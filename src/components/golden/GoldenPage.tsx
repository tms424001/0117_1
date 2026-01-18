/**
 * 黄金页母版布局
 * 对齐 specs/01_Foundation/Golden_Page_Template_Spec.md
 * 
 * 布局结构：
 * ┌Header: Title + Actions────────────────────────────────────────┐
 * │ Toolbar: Search | Filters | Batch Actions                      │
 * ├───────────────┬───────────────────────┬──────────────────────┤
 * │ TreePanel      │ GridPanel             │ Drawer (Detail/Edit) │
 * │ (tabs optional)│                       │                      │
 * ├───────────────┴───────────────────────┴──────────────────────┤
 * │ BottomPanel: Issues / ReviewQueue / Logs (collapsible)         │
 * └───────────────────────────────────────────────────────────────┘
 */

import React, { useState, ReactNode } from 'react';
import { Layout } from 'antd';
import PageHeader, { PageHeaderProps } from './PageHeader';
import Toolbar, { ToolbarProps } from './Toolbar';
import BottomPanel, { BottomPanelProps } from './BottomPanel';

const { Content } = Layout;

export interface GoldenPageProps {
  /** 页面标题配置 */
  header?: PageHeaderProps;
  /** 工具栏配置 */
  toolbar?: ToolbarProps;
  /** 左侧树面板 */
  treePanel?: ReactNode;
  /** 左侧面板宽度 */
  treePanelWidth?: number;
  /** 是否显示左侧面板 */
  showTreePanel?: boolean;
  /** 中间内容区 */
  children: ReactNode;
  /** 右侧抽屉 */
  drawer?: ReactNode;
  /** 抽屉是否打开 */
  drawerOpen?: boolean;
  /** 抽屉宽度 */
  drawerWidth?: number;
  /** 底部面板配置 */
  bottomPanel?: BottomPanelProps;
  /** 是否显示底部面板 */
  showBottomPanel?: boolean;
  /** 底部面板高度 */
  bottomPanelHeight?: number;
  /** 加载状态 */
  loading?: boolean;
  /** 自定义类名 */
  className?: string;
}

const GoldenPage: React.FC<GoldenPageProps> = ({
  header,
  toolbar,
  treePanel,
  treePanelWidth = 280,
  showTreePanel = true,
  children,
  drawer,
  drawerOpen = false,
  drawerWidth = 400,
  bottomPanel,
  showBottomPanel = false,
  bottomPanelHeight = 200,
  loading = false,
  className = '',
}) => {
  const [bottomCollapsed, setBottomCollapsed] = useState(false);

  return (
    <Layout className={`golden-page h-full flex flex-col ${className}`}>
      {/* Header */}
      {header && <PageHeader {...header} />}
      
      {/* Toolbar */}
      {toolbar && <Toolbar {...toolbar} />}
      
      {/* Main Content Area */}
      <Content className="flex-1 flex overflow-hidden">
        {/* Left Tree Panel */}
        {showTreePanel && treePanel && (
          <div 
            className="border-r border-gray-200 overflow-auto bg-white"
            style={{ width: treePanelWidth, minWidth: treePanelWidth }}
          >
            {treePanel}
          </div>
        )}
        
        {/* Center Grid Panel */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">加载中...</div>
            </div>
          ) : (
            children
          )}
        </div>
        
        {/* Right Drawer */}
        {drawerOpen && drawer && (
          <div 
            className="border-l border-gray-200 overflow-auto bg-white"
            style={{ width: drawerWidth, minWidth: drawerWidth }}
          >
            {drawer}
          </div>
        )}
      </Content>
      
      {/* Bottom Panel */}
      {showBottomPanel && bottomPanel && (
        <div 
          className="border-t border-gray-200 bg-white transition-all duration-200"
          style={{ 
            height: bottomCollapsed ? 40 : bottomPanelHeight,
            minHeight: bottomCollapsed ? 40 : bottomPanelHeight,
          }}
        >
          <BottomPanel 
            {...bottomPanel} 
            collapsed={bottomCollapsed}
            onCollapse={setBottomCollapsed}
          />
        </div>
      )}
    </Layout>
  );
};

export default GoldenPage;
