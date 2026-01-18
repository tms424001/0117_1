import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// 数据采集模块页面
import CostFilesPage from '../pages/data-collection/CostFilesPage';
import MaterialPricesPage from '../pages/data-collection/MaterialPricesPage';
import CompositePricesPage from '../pages/data-collection/CompositePricesPage';

// 我的数据页面
import MyProjectsPage from '../pages/data-collection/my-data/MyProjectsPage';
import MyIndexesPage from '../pages/data-collection/my-data/MyIndexesPage';
import MyMaterialPricesPage from '../pages/data-collection/my-data/MyMaterialPricesPage';
import MyCompositePricesPage from '../pages/data-collection/my-data/MyCompositePricesPage';

// 数据资产 - 企业库
import EnterpriseCasesPage from '../pages/data-asset/enterprise/CasesPage';
import EnterpriseCaseDetailPage from '../pages/data-asset/enterprise/CaseDetailPage';
import CaseComparePage from '../pages/data-asset/enterprise/CaseComparePage';
import EnterpriseIndexesPage from '../pages/data-asset/enterprise/IndexesPage';
import IndexTrendPage from '../pages/data-asset/enterprise/IndexTrendPage';
import IndexPublishPage from '../pages/data-asset/enterprise/IndexPublishPage';
import EnterpriseMaterialPricesPage from '../pages/data-asset/enterprise/MaterialPricesPage';
import MaterialPriceDetailPage from '../pages/data-asset/enterprise/MaterialPriceDetailPage';
import MaterialPriceAnalysisPage from '../pages/data-asset/enterprise/MaterialPriceAnalysisPage';

// 占位页面
import PlaceholderPage from '../pages/PlaceholderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/data-collection/cost-files" replace />,
      },
      // 数据采集
      {
        path: 'data-collection',
        children: [
          {
            index: true,
            element: <Navigate to="/data-collection/cost-files" replace />,
          },
          {
            path: 'cost-files',
            element: <CostFilesPage />,
          },
          {
            path: 'material-prices',
            element: <MaterialPricesPage />,
          },
          {
            path: 'composite-prices',
            element: <CompositePricesPage />,
          },
        ],
      },
      // 我的数据（与数据采集平级）
      {
        path: 'my-data',
        children: [
          {
            index: true,
            element: <Navigate to="/my-data/projects" replace />,
          },
          {
            path: 'projects',
            element: <MyProjectsPage />,
          },
          {
            path: 'indexes',
            element: <MyIndexesPage />,
          },
          {
            path: 'material-prices',
            element: <MyMaterialPricesPage />,
          },
          {
            path: 'composite-prices',
            element: <MyCompositePricesPage />,
          },
        ],
      },
      // 数据资产模块
      {
        path: 'data-asset',
        children: [
          {
            index: true,
            element: <Navigate to="/data-asset/enterprise/cases" replace />,
          },
          {
            path: 'enterprise/cases',
            element: <EnterpriseCasesPage />,
          },
          {
            path: 'enterprise/cases/:caseId',
            element: <EnterpriseCaseDetailPage />,
          },
          {
            path: 'enterprise/cases/compare',
            element: <CaseComparePage />,
          },
          {
            path: 'enterprise/materials',
            element: <EnterpriseMaterialPricesPage />,
          },
          {
            path: 'enterprise/materials/:priceId',
            element: <MaterialPriceDetailPage />,
          },
          {
            path: 'enterprise/materials/analysis',
            element: <MaterialPriceAnalysisPage />,
          },
          {
            path: 'enterprise/materials/benchmark',
            element: <PlaceholderPage />,
          },
          {
            path: 'enterprise/composites',
            element: <PlaceholderPage />,
          },
          {
            path: 'enterprise/indexes',
            element: <EnterpriseIndexesPage />,
          },
          {
            path: 'enterprise/indexes/trend',
            element: <IndexTrendPage />,
          },
          {
            path: 'enterprise/indexes/publish',
            element: <IndexPublishPage />,
          },
          {
            path: 'marketplace/info-price',
            element: <PlaceholderPage />,
          },
          {
            path: 'marketplace/public-cases',
            element: <PlaceholderPage />,
          },
          {
            path: 'marketplace/member-data',
            element: <PlaceholderPage />,
          },
        ],
      },
      {
        path: 'quality-control',
        element: <PlaceholderPage />,
      },
      {
        path: 'pricing',
        element: <PlaceholderPage />,
      },
      {
        path: 'estimation',
        element: <PlaceholderPage />,
      },
    ],
  },
]);

export default router;
