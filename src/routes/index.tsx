/**
 * 路由配置
 * 对齐 specs/01_Foundation/IA_Navigation_Spec.md
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

// ========== 已实现页面 ==========
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProjectList = lazy(() => import('@/pages/project/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/project/ProjectDetail'));
const TagLibrary = lazy(() => import('@/pages/standard/TagLibrary'));
const ScaleRange = lazy(() => import('@/pages/standard/ScaleRange'));
const StandardMapping = lazy(() => import('@/pages/standard/StandardMapping'));
const IndexList = lazy(() => import('@/pages/index/IndexList'));
const IndexAnalysis = lazy(() => import('@/pages/index/IndexAnalysis'));
const EstimationList = lazy(() => import('@/pages/estimation/EstimationList'));
const EstimationWorkbench = lazy(() => import('@/pages/estimation/EstimationWorkbench'));

// ========== 采集模块页面 ==========
const ImportList = lazy(() => import('@/pages/collect/ImportList'));
const CostFilePreview = lazy(() => import('@/pages/collect/CostFilePreview'));
const DataLake = lazy(() => import('@/pages/collect/DataLake'));
const MyData = lazy(() => import('@/pages/collect/MyData'));

// ========== 标签化模块页面 ==========
const TaggingTaskList = lazy(() => import('@/pages/tagging/TaskList'));
const TaggingWorkbench = lazy(() => import('@/pages/tagging/Workbench'));

// ========== 指标计算模块页面 ==========
const CalcTaskList = lazy(() => import('@/pages/indexes/CalcTaskList'));
const CalcWorkbench = lazy(() => import('@/pages/indexes/CalcWorkbench'));

// ========== 发布模块页面 ==========
const VersionList = lazy(() => import('@/pages/publish/VersionList'));
const PublishConsole = lazy(() => import('@/pages/publish/PublishConsole'));

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
        
        {/* ========== 03 数据采集模块 (Collection_Overview_Spec) ========== */}
        <Route path="/collect" element={<Navigate to="/collect/imports" replace />} />
        <Route path="/collect/imports" element={<ImportList />} />
        <Route path="/collect/import/:batchId" element={<CostFilePreview />} />
        <Route path="/collect/price-files" element={<PlaceholderPage title="价文件列表" />} />
        <Route path="/collect/price-files/:id" element={<PlaceholderPage title="价文件详情" />} />
        <Route path="/data-lake" element={<DataLake />} />
        <Route path="/my-data" element={<MyData />} />
        
        {/* ========== 04 数据标签化模块 (Tagging_Process_Spec) ========== */}
        <Route path="/tagging" element={<Navigate to="/tagging/tasks" replace />} />
        <Route path="/tagging/tasks" element={<TaggingTaskList />} />
        <Route path="/tagging/workbench/:taskId" element={<TaggingWorkbench />} />
        
        {/* ========== 05 指标模块 (Index_Calculation_Spec / Index_Publish_Spec) ========== */}
        <Route path="/indexes" element={<Navigate to="/indexes/list" replace />} />
        <Route path="/indexes/list" element={<IndexList />} />
        <Route path="/indexes/calc/tasks" element={<CalcTaskList />} />
        <Route path="/indexes/calc/workbench/:taskId" element={<CalcWorkbench />} />
        <Route path="/indexes/:indexId" element={<PlaceholderPage title="指标详情" />} />
        <Route path="/indexes/analysis" element={<IndexAnalysis />} />
        
        {/* ========== 05 发布模块 (Index_Publish_Spec) ========== */}
        <Route path="/publish" element={<Navigate to="/publish/versions" replace />} />
        <Route path="/publish/versions" element={<VersionList />} />
        <Route path="/publish/versions/:versionId" element={<PlaceholderPage title="版本详情" />} />
        <Route path="/publish/review/:versionId" element={<PlaceholderPage title="审核工作台" />} />
        <Route path="/publish/console/:versionId" element={<PublishConsole />} />
        
        {/* ========== 06 估算模块 (Estimation_Spec / Detailed_Estimation_Spec) ========== */}
        <Route path="/estimation" element={<Navigate to="/estimation/dashboard" replace />} />
        <Route path="/estimation/dashboard" element={<Dashboard />} />
        <Route path="/estimation/tasks" element={<EstimationList />} />
        <Route path="/estimation/tasks/:taskId/quick" element={<EstimationWorkbench />} />
        <Route path="/estimation/tasks/:taskId/workbench" element={<PlaceholderPage title="详细估算工作台" />} />
        <Route path="/estimation/dictionaries" element={<PlaceholderPage title="参数字典与系数库" />} />
        
        {/* ========== 02 标准库模块 (Tag_System_Spec / Scale_Range_Spec / Standard_Mapping_Spec) ========== */}
        <Route path="/standard" element={<Navigate to="/standard/tags" replace />} />
        <Route path="/standard/tags" element={<TagLibrary />} />
        <Route path="/standard/scales" element={<ScaleRange />} />
        <Route path="/standard/mappings" element={<StandardMapping />} />
        
        {/* ========== 项目管理（辅助） ========== */}
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        
        {/* ========== 兼容旧路由 ========== */}
        <Route path="/dashboard" element={<Navigate to="/estimation/dashboard" replace />} />
        <Route path="/estimation/indexes" element={<Navigate to="/indexes/list" replace />} />
        <Route path="/estimation/analysis" element={<Navigate to="/indexes/analysis" replace />} />
        <Route path="/estimation/tags" element={<Navigate to="/standard/tags" replace />} />
        <Route path="/estimation/scales" element={<Navigate to="/standard/scales" replace />} />
        <Route path="/estimation/projects" element={<Navigate to="/projects" replace />} />
        <Route path="/estimation/estimate" element={<Navigate to="/estimation/tasks" replace />} />
        <Route path="/estimation/estimate/:id" element={<Navigate to="/estimation/tasks/:id/quick" replace />} />
        
        <Route path="*" element={<Navigate to="/estimation/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
