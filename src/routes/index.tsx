import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

// 估算模块页面
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProjectList = lazy(() => import('@/pages/project/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/project/ProjectDetail'));
const TagLibrary = lazy(() => import('@/pages/standard/TagLibrary'));
const ScaleRange = lazy(() => import('@/pages/standard/ScaleRange'));
const IndexList = lazy(() => import('@/pages/index/IndexList'));
const IndexAnalysis = lazy(() => import('@/pages/index/IndexAnalysis'));
const EstimationList = lazy(() => import('@/pages/estimation/EstimationList'));
const EstimationWorkbench = lazy(() => import('@/pages/estimation/EstimationWorkbench'));

// 占位页面组件
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
    <div className="text-6xl mb-4">🚧</div>
    <div className="text-xl font-medium">{title}</div>
    <div className="text-sm mt-2">功能开发中...</div>
  </div>
);

const Loading = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <Spin size="large" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 默认跳转到估算模块 */}
        <Route path="/" element={<Navigate to="/estimation/dashboard" replace />} />
        
        {/* ========== 数据采集模块 ========== */}
        <Route path="/collection" element={<Navigate to="/collection/cost-file" replace />} />
        <Route path="/collection/cost-file" element={<PlaceholderPage title="造价文件采集" />} />
        <Route path="/collection/material-price" element={<PlaceholderPage title="材价文件采集" />} />
        <Route path="/collection/composite-price" element={<PlaceholderPage title="综价文件采集" />} />
        <Route path="/collection/my-data" element={<PlaceholderPage title="我的数据" />} />
        
        {/* ========== 数据资产模块 ========== */}
        <Route path="/asset" element={<Navigate to="/asset/material-lib" replace />} />
        <Route path="/asset/material-lib" element={<PlaceholderPage title="材价库" />} />
        <Route path="/asset/composite-lib" element={<PlaceholderPage title="综价库" />} />
        <Route path="/asset/index-lib" element={<PlaceholderPage title="指标库" />} />
        <Route path="/asset/case-lib" element={<PlaceholderPage title="案例库" />} />
        <Route path="/asset/marketplace" element={<PlaceholderPage title="数据商城" />} />
        
        {/* ========== 质控模块 ========== */}
        <Route path="/qc" element={<Navigate to="/qc/single-check" replace />} />
        <Route path="/qc/single-check" element={<PlaceholderPage title="单文件检查" />} />
        <Route path="/qc/multi-compare" element={<PlaceholderPage title="多文件对比" />} />
        
        {/* ========== 计价模块 ========== */}
        <Route path="/pricing" element={<Navigate to="/pricing/smart-quota" replace />} />
        <Route path="/pricing/smart-quota" element={<PlaceholderPage title="智能套定额" />} />
        <Route path="/pricing/qc-service" element={<PlaceholderPage title="质控服务" />} />
        <Route path="/pricing/computing-base" element={<PlaceholderPage title="算力底座" />} />
        
        {/* ========== 估算模块（核心，已实现） ========== */}
        <Route path="/estimation" element={<Navigate to="/estimation/dashboard" replace />} />
        <Route path="/estimation/dashboard" element={<Dashboard />} />
        <Route path="/estimation/indexes" element={<IndexList />} />
        <Route path="/estimation/analysis" element={<IndexAnalysis />} />
        <Route path="/estimation/publish" element={<PlaceholderPage title="指标发布" />} />
        <Route path="/estimation/tags" element={<TagLibrary />} />
        <Route path="/estimation/scales" element={<ScaleRange />} />
        <Route path="/estimation/projects" element={<ProjectList />} />
        <Route path="/estimation/projects/:id" element={<ProjectDetail />} />
        <Route path="/estimation/tagging" element={<PlaceholderPage title="数据标签化" />} />
        <Route path="/estimation/estimate" element={<EstimationList />} />
        <Route path="/estimation/estimate/:id" element={<EstimationWorkbench />} />
        <Route path="/estimation/estimate/new" element={<EstimationWorkbench />} />
        
        {/* 兼容旧路由 */}
        <Route path="/dashboard" element={<Navigate to="/estimation/dashboard" replace />} />
        <Route path="/projects" element={<Navigate to="/estimation/projects" replace />} />
        <Route path="/indexes" element={<Navigate to="/estimation/indexes" replace />} />
        
        <Route path="*" element={<Navigate to="/estimation/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
