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
      // 其他模块（占位）
      {
        path: 'data-asset',
        element: <PlaceholderPage />,
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
