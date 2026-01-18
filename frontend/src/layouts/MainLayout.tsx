import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  ProjectOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudUploadOutlined,
  SafetyCertificateOutlined,
  CalculatorOutlined,
  FundOutlined,
  BankOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SlidersOutlined,
  ApartmentOutlined,
  AuditOutlined,
  SendOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

// 顶部模块配置
const topModules = [
  { key: 'data-collection', label: '数据采集', icon: <CloudUploadOutlined /> },
  { key: 'data-asset', label: '数据资产', icon: <DatabaseOutlined /> },
  { key: 'standard-library', label: '标准库', icon: <AppstoreOutlined /> },
  { key: 'index-system', label: '指标体系', icon: <BarChartOutlined /> },
  { key: 'quality-control', label: '质控', icon: <SafetyCertificateOutlined /> },
  { key: 'pricing', label: '计价', icon: <CalculatorOutlined /> },
  { key: 'estimation', label: '估算', icon: <FundOutlined /> },
];

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 数据采集模块菜单
const dataCollectionMenuItems: MenuItem[] = [
  getItem('数据采集', 'data-collection', <CloudUploadOutlined />, [
    getItem('造价文件', '/data-collection/cost-files', <FileTextOutlined />),
    getItem('材价文件', '/data-collection/material-prices', <DollarOutlined />),
    getItem('综价文件', '/data-collection/composite-prices', <BarChartOutlined />),
  ]),
  getItem('我的数据', 'my-data', <FolderOpenOutlined />, [
    getItem('我的项目', '/my-data/projects', <ProjectOutlined />),
    getItem('我的指标', '/my-data/indexes', <BarChartOutlined />),
    getItem('我的材价', '/my-data/material-prices', <DollarOutlined />),
    getItem('我的综价', '/my-data/composite-prices', <FileTextOutlined />),
  ]),
  getItem('PR审核', 'pr-review', <AuditOutlined />, [
    getItem('我提交的', '/pr-review/my-pr', <SendOutlined />),
    getItem('待我审核', '/pr-review/pending', <CheckSquareOutlined />),
  ]),
];

// 数据资产模块菜单
const dataAssetMenuItems: MenuItem[] = [
  getItem('企业库', 'enterprise', <BankOutlined />, [
    getItem('案例库', '/data-asset/enterprise/cases', <ProjectOutlined />),
    getItem('材价库', '/data-asset/enterprise/materials', <DollarOutlined />),
    getItem('综价库', '/data-asset/enterprise/composites', <BarChartOutlined />),
    getItem('指标库', '/data-asset/enterprise/indexes', <FundOutlined />),
  ]),
  getItem('数据商城', 'marketplace', <ShopOutlined />, [
    getItem('信息价', '/data-asset/marketplace/info-price', <DollarOutlined />),
    getItem('公共资源案例库', '/data-asset/marketplace/public-cases', <ProjectOutlined />),
    getItem('会员单位数据', '/data-asset/marketplace/member-data', <AppstoreOutlined />),
  ]),
];

// 标准库管理模块菜单
const standardLibraryMenuItems: MenuItem[] = [
  getItem('标准库管理', 'standard-library', <AppstoreOutlined />, [
    getItem('标签体系管理', '/standard-library/tag-system', <TagsOutlined />),
    getItem('规模分档配置', '/standard-library/scale-range', <SlidersOutlined />),
    getItem('标准映射管理', '/standard-library/standard-mapping', <ApartmentOutlined />),
  ]),
];

// 指标体系模块菜单
const indexSystemMenuItems: MenuItem[] = [
  getItem('指标统计', 'index-stats', <BarChartOutlined />, [
    getItem('统计概览', '/index-system/overview', <BarChartOutlined />),
    getItem('多维分析', '/index-system/analysis', <FundOutlined />),
    getItem('趋势分析', '/index-system/trend', <FundOutlined />),
  ]),
];

// 质控模块菜单
const qualityControlMenuItems: MenuItem[] = [
  getItem('质控工作台', '/quality-control/workbench', <SafetyCertificateOutlined />),
  getItem('单文件检查', 'single-check', <FileTextOutlined />, [
    getItem('合规性检查', '/quality-control/compliance', <FileTextOutlined />),
    getItem('材料价格检查', '/quality-control/material-price', <DollarOutlined />),
    getItem('综合单价检查', '/quality-control/composite-price', <DollarOutlined />),
    getItem('清单缺陷检查', '/quality-control/boq-defect', <FileTextOutlined />),
    getItem('指标合理性检查', '/quality-control/index-check', <BarChartOutlined />),
  ]),
  getItem('多文件对比', 'multi-compare', <FileTextOutlined />, [
    getItem('清标', '/quality-control/bid-clearing', <FileTextOutlined />),
    getItem('结算复核', '/quality-control/settlement', <FileTextOutlined />),
    getItem('概算归集', '/quality-control/budget', <FileTextOutlined />),
    getItem('对标分析', '/quality-control/benchmark', <BarChartOutlined />),
  ]),
  getItem('规则管理', '/quality-control/rules', <SettingOutlined />),
];

// 估算模块菜单
const estimationMenuItems: MenuItem[] = [
  getItem('估算项目', '/estimation/projects', <ProjectOutlined />),
  getItem('快速估算', '/estimation/quick', <CalculatorOutlined />),
  getItem('估算设置', '/estimation/settings', <SettingOutlined />),
];

// 其他模块菜单（占位）
const placeholderMenuItems: MenuItem[] = [
  getItem('功能开发中', 'placeholder', <AppstoreOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentModule, setCurrentModule] = useState('data-collection');
  const navigate = useNavigate();
  const location = useLocation();

  const handleModuleChange = (moduleKey: string) => {
    setCurrentModule(moduleKey);
    // 切换模块时导航到对应模块的默认页面
    const defaultRoutes: Record<string, string> = {
      'data-collection': '/data-collection/cost-files',
      'data-asset': '/data-asset/enterprise/cases',
      'standard-library': '/standard-library/tag-system',
      'index-system': '/index-system/overview',
      'quality-control': '/quality-control/workbench',
      'pricing': '/pricing',
      'estimation': '/estimation/projects',
    };
    navigate(defaultRoutes[moduleKey] || `/${moduleKey}`);
  };

  // 根据当前模块获取菜单项
  const getMenuItems = () => {
    switch (currentModule) {
      case 'data-collection':
        return dataCollectionMenuItems;
      case 'data-asset':
        return dataAssetMenuItems;
      case 'standard-library':
        return standardLibraryMenuItems;
      case 'index-system':
        return indexSystemMenuItems;
      case 'quality-control':
        return qualityControlMenuItems;
      case 'estimation':
        return estimationMenuItems;
      default:
        return placeholderMenuItems;
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key.startsWith('/')) {
      navigate(e.key);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };

  // 获取展开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.includes('/my-data')) {
      return ['my-data'];
    }
    if (path.includes('/data-collection')) {
      return ['data-collection'];
    }
    if (path.includes('/data-asset/enterprise')) {
      return ['enterprise'];
    }
    if (path.includes('/data-asset/marketplace')) {
      return ['marketplace'];
    }
    if (path.includes('/standard-library')) {
      return ['standard-library'];
    }
    return [];
  };

  // 根据路径自动设置当前模块
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/data-collection') || path.includes('/my-data')) {
      setCurrentModule('data-collection');
    } else if (path.includes('/data-asset')) {
      setCurrentModule('data-asset');
    } else if (path.includes('/standard-library')) {
      setCurrentModule('standard-library');
    } else if (path.includes('/quality-control')) {
      setCurrentModule('quality-control');
    } else if (path.includes('/pricing')) {
      setCurrentModule('pricing');
    } else if (path.includes('/estimation')) {
      setCurrentModule('estimation');
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#001529',
        height: 56,
        lineHeight: '56px'
      }}>
        {/* 左侧：Logo + 模块菜单 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 40 }}>
            造价指标平台
          </div>
          {/* 模块切换菜单 */}
          <div style={{ display: 'flex', gap: 4 }}>
            {topModules.map((module) => (
              <div
                key={module.key}
                onClick={() => handleModuleChange(module.key)}
                style={{
                  padding: '0 16px',
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  color: currentModule === module.key ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: currentModule === module.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderBottom: currentModule === module.key ? '2px solid #1890ff' : '2px solid transparent',
                  transition: 'all 0.3s',
                }}
              >
                {module.icon}
                <span>{module.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 右侧：用户信息 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: '#fff' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <span>管理员</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* 左侧菜单 */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={220}
          style={{ 
            background: '#fff',
            borderRight: '1px solid #f0f0f0'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0'
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            items={getMenuItems()}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>

        {/* 内容区 */}
        <Content style={{ padding: 24, background: '#f5f5f5', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
