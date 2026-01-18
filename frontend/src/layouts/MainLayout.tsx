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
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

// 顶部模块配置
const topModules = [
  { key: 'data-collection', label: '数据采集', icon: <CloudUploadOutlined /> },
  { key: 'data-asset', label: '数据资产', icon: <DatabaseOutlined /> },
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

const menuItems: MenuItem[] = [
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
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentModule, setCurrentModule] = useState('data-collection');
  const navigate = useNavigate();
  const location = useLocation();

  const handleModuleChange = (moduleKey: string) => {
    setCurrentModule(moduleKey);
    // 切换模块时导航到对应模块的默认页面
    if (moduleKey === 'data-collection') {
      navigate('/data-collection/cost-files');
    } else {
      // 其他模块暂未实现，显示提示
      navigate(`/${moduleKey}`);
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
    return [];
  };

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
            items={menuItems}
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
