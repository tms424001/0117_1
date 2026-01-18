import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  FolderOutlined,
  DatabaseOutlined,
  ShopOutlined,
  FileSearchOutlined,
  DiffOutlined,
  CalculatorOutlined,
  AuditOutlined,
  CloudServerOutlined,
  LineChartOutlined,
  BarChartOutlined,
  ProjectOutlined,
  TagsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  currentModule: string;
}

type MenuItem = Required<MenuProps>['items'][number];

const moduleMenus: Record<string, MenuItem[]> = {
  collection: [
    { key: '/collection/cost-file', icon: <UploadOutlined />, label: '造价文件' },
    { key: '/collection/material-price', icon: <FileTextOutlined />, label: '材价文件' },
    { key: '/collection/composite-price', icon: <FileTextOutlined />, label: '综价文件' },
    { type: 'divider' },
    { key: '/collection/my-data', icon: <FolderOutlined />, label: '我的数据' },
  ],
  asset: [
    {
      key: 'enterprise',
      icon: <DatabaseOutlined />,
      label: '企业库',
      children: [
        { key: '/asset/material-lib', label: '材价库' },
        { key: '/asset/composite-lib', label: '综价库' },
        { key: '/asset/index-lib', label: '指标库' },
        { key: '/asset/case-lib', label: '案例库' },
      ],
    },
    { type: 'divider' },
    { key: '/asset/marketplace', icon: <ShopOutlined />, label: '数据商城' },
  ],
  qc: [
    { key: '/qc/single-check', icon: <FileSearchOutlined />, label: '单文件检查' },
    { key: '/qc/multi-compare', icon: <DiffOutlined />, label: '多文件对比' },
  ],
  pricing: [
    { key: '/pricing/smart-quota', icon: <CalculatorOutlined />, label: '智能套定额' },
    { key: '/pricing/qc-service', icon: <AuditOutlined />, label: '质控服务' },
    { type: 'divider' },
    { key: '/pricing/computing-base', icon: <CloudServerOutlined />, label: '算力底座' },
  ],
  estimation: [
    { key: '/estimation/dashboard', icon: <BarChartOutlined />, label: '工作台' },
    { type: 'divider' },
    {
      key: 'index-system',
      icon: <LineChartOutlined />,
      label: '指标系统',
      children: [
        { key: '/estimation/indexes', label: '指标列表' },
        { key: '/estimation/analysis', label: '指标分析' },
        { key: '/estimation/publish', label: '指标发布' },
      ],
    },
    {
      key: 'standard-lib',
      icon: <TagsOutlined />,
      label: '标准库',
      children: [
        { key: '/estimation/tags', label: '功能标签' },
        { key: '/estimation/scales', label: '规模分档' },
      ],
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
      children: [
        { key: '/estimation/projects', label: '项目列表' },
        { key: '/estimation/tagging', label: '数据标签化' },
      ],
    },
    { type: 'divider' },
    { key: '/estimation/estimate', icon: <CalculatorOutlined />, label: '投资估算' },
  ],
};

export default function AppSidebar({ collapsed, onCollapse, currentModule }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = moduleMenus[currentModule] || moduleMenus.estimation;

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    const openKeys: string[] = [];
    if (path.includes('/asset/')) openKeys.push('enterprise');
    if (path.includes('/indexes') || path.includes('/analysis') || path.includes('/publish')) openKeys.push('index-system');
    if (path.includes('/tags') || path.includes('/scales')) openKeys.push('standard-lib');
    if (path.includes('/projects') || path.includes('/tagging')) openKeys.push('projects');
    return openKeys;
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      width={220}
      collapsedWidth={64}
      collapsed={collapsed}
      className="fixed left-0 top-14 bottom-0 z-40 overflow-auto"
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={collapsed ? [] : getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, height: 'calc(100% - 48px)', paddingTop: 8 }}
      />
      
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center border-t border-gray-100 cursor-pointer hover:bg-gray-50"
        onClick={() => onCollapse(!collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  );
}
