import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// 数据采集模块页面
import CostFilesPage from '../pages/data-collection/CostFilesPage';
import MaterialPricesPage from '../pages/data-collection/MaterialPricesPage';
import CompositePricesPage from '../pages/data-collection/CompositePricesPage';

// 我的数据页面
import MyProjectsPage from '../pages/data-collection/my-data/MyProjectsPage';

// PR审核页面
import MyPRListPage from '../pages/data-collection/pr-review/MyPRListPage';
import PendingReviewPage from '../pages/data-collection/pr-review/PendingReviewPage';
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
import EnterpriseCompositePricesPage from '../pages/data-asset/enterprise/CompositePricesPage';
import CompositePriceDetailPage from '../pages/data-asset/enterprise/CompositePriceDetailPage';
import CompositeTemplatesPage from '../pages/data-asset/enterprise/CompositeTemplatesPage';

// 数据资产 - 数据商城
import PublicCasesPage from '../pages/data-asset/marketplace/PublicCasesPage';
import PublicCaseDetailPage from '../pages/data-asset/marketplace/PublicCaseDetailPage';
import CaseContributionPage from '../pages/data-asset/marketplace/CaseContributionPage';
import InfoPricePage from '../pages/data-asset/marketplace/InfoPricePage';
import InfoPriceDetailPage from '../pages/data-asset/marketplace/InfoPriceDetailPage';
import MemberDataPage from '../pages/data-asset/marketplace/MemberDataPage';
import MemberDataDetailPage from '../pages/data-asset/marketplace/MemberDataDetailPage';

// 质控模块
import SingleFileCheckPage from '../pages/quality-control/SingleFileCheckPage';
import MultiFileComparePage from '../pages/quality-control/MultiFileComparePage';
import RuleManagePage from '../pages/quality-control/RuleManagePage';
import ComplianceCheckPage from '../pages/quality-control/ComplianceCheckPage';
import MaterialPriceCheckPage from '../pages/quality-control/MaterialPriceCheckPage';
import CompositePriceCheckPage from '../pages/quality-control/CompositePriceCheckPage';
import BoQDefectCheckPage from '../pages/quality-control/BoQDefectCheckPage';
import IndexRationalityCheckPage from '../pages/quality-control/IndexRationalityCheckPage';
import BidClearingPage from '../pages/quality-control/BidClearingPage';
import QCWorkbenchPage from '../pages/quality-control/QCWorkbenchPage';
import SettlementReviewPage from '../pages/quality-control/SettlementReviewPage';

// 指标体系
import IndexOverviewPage from '../pages/index-system/IndexOverviewPage';
import IndexAnalysisPage from '../pages/index-system/IndexAnalysisPage';
import IndexTrendAnalysisPage from '../pages/index-system/IndexTrendAnalysisPage';

// 标准库管理
import TagSystemPage from '../pages/standard-library/TagSystemPage';
import ScaleRangePage from '../pages/standard-library/ScaleRangePage';
import StandardMappingPage from '../pages/standard-library/StandardMappingPage';

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
      // PR审核
      {
        path: 'pr-review',
        children: [
          {
            index: true,
            element: <Navigate to="/pr-review/my-pr" replace />,
          },
          {
            path: 'my-pr',
            element: <MyPRListPage />,
          },
          {
            path: 'pending',
            element: <PendingReviewPage />,
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
            element: <EnterpriseCompositePricesPage />,
          },
          {
            path: 'enterprise/composites/:compositeId',
            element: <CompositePriceDetailPage />,
          },
          {
            path: 'enterprise/composites/analysis',
            element: <PlaceholderPage />,
          },
          {
            path: 'enterprise/composites/templates',
            element: <CompositeTemplatesPage />,
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
            element: <InfoPricePage />,
          },
          {
            path: 'marketplace/info-price/:priceId',
            element: <InfoPriceDetailPage />,
          },
          {
            path: 'marketplace/public-cases',
            element: <PublicCasesPage />,
          },
          {
            path: 'marketplace/public-cases/:caseId',
            element: <PublicCaseDetailPage />,
          },
          {
            path: 'marketplace/public-cases/contribution',
            element: <CaseContributionPage />,
          },
          {
            path: 'marketplace/member-data',
            element: <MemberDataPage />,
          },
          {
            path: 'marketplace/member-data/:unitId',
            element: <MemberDataDetailPage />,
          },
        ],
      },
      // 标准库管理
      {
        path: 'standard-library',
        children: [
          {
            index: true,
            element: <Navigate to="/standard-library/tag-system" replace />,
          },
          {
            path: 'tag-system',
            element: <TagSystemPage />,
          },
          {
            path: 'scale-range',
            element: <ScaleRangePage />,
          },
          {
            path: 'standard-mapping',
            element: <StandardMappingPage />,
          },
        ],
      },
      // 指标体系
      {
        path: 'index-system',
        children: [
          {
            index: true,
            element: <Navigate to="/index-system/overview" replace />,
          },
          {
            path: 'overview',
            element: <IndexOverviewPage />,
          },
          {
            path: 'analysis',
            element: <IndexAnalysisPage />,
          },
          {
            path: 'trend',
            element: <IndexTrendAnalysisPage />,
          },
        ],
      },
      // 质控模块
      {
        path: 'quality-control',
        children: [
          {
            index: true,
            element: <Navigate to="/quality-control/workbench" replace />,
          },
          {
            path: 'workbench',
            element: <QCWorkbenchPage />,
          },
          {
            path: 'single-check',
            element: <Navigate to="/quality-control/workbench" replace />,
          },
          {
            path: 'compliance',
            element: <ComplianceCheckPage />,
          },
          {
            path: 'material-price',
            element: <MaterialPriceCheckPage />,
          },
          {
            path: 'composite-price',
            element: <CompositePriceCheckPage />,
          },
          {
            path: 'boq-defect',
            element: <BoQDefectCheckPage />,
          },
          {
            path: 'index-check',
            element: <IndexRationalityCheckPage />,
          },
          {
            path: 'bid-clearing',
            element: <BidClearingPage />,
          },
          {
            path: 'settlement',
            element: <SettlementReviewPage />,
          },
          {
            path: 'budget',
            element: <MultiFileComparePage />,
          },
          {
            path: 'benchmark',
            element: <MultiFileComparePage />,
          },
          {
            path: 'rules',
            element: <RuleManagePage />,
          },
        ],
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
