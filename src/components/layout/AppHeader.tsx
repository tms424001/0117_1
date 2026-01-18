import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Space, Avatar, Dropdown, Badge } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

export interface ModuleConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const modules: ModuleConfig[] = [
  { key: 'collection', label: '数据采集', icon: <CloudUploadOutlined />, path: '/collection', color: '#1677ff' },
  { key: 'asset', label: '数据资产', icon: <DatabaseOutlined />, path: '/asset', color: '#52c41a' },
  { key: 'qc', label: '质控', icon: <SafetyCertificateOutlined />, path: '/qc', color: '#faad14' },
  { key: 'pricing', label: '计价', icon: <DollarOutlined />, path: '/pricing', color: '#eb2f96' },
  { key: 'estimation', label: '估算', icon: <LineChartOutlined />, path: '/estimation', color: '#722ed1' },
];

const userMenuItems: MenuProps['items'] = [
  { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
  { key: 'settings', icon: <SettingOutlined />, label: '账户设置' },
  { type: 'divider' },
  { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
];

interface AppHeaderProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

export default function AppHeader({ currentModule, onModuleChange }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleModuleClick = (mod: ModuleConfig) => {
    onModuleChange(mod.key);
    navigate(mod.path);
  };

  const activeModule = modules.find(m => location.pathname.startsWith(m.path)) || modules[4];

  return (
    <Header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4"
      style={{
        height: 56,
        background: '#001529',
        padding: '0 16px',
      }}
    >
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer mr-8"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">造</span>
        </div>
        <span className="text-white font-semibold text-base">工程造价数字化平台</span>
      </div>

      {/* 模块导航 */}
      <div className="flex items-center gap-1">
        {modules.map((mod) => {
          const isActive = activeModule.key === mod.key;
          return (
            <div
              key={mod.key}
              onClick={() => handleModuleClick(mod)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all
                ${isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="text-base">{mod.icon}</span>
              <span className="text-sm font-medium">{mod.label}</span>
            </div>
          );
        })}
      </div>

      {/* 右侧工具栏 */}
      <div className="flex-1" />
      <Space size={20}>
        <Badge count={3} size="small">
          <BellOutlined className="text-lg text-white/80 cursor-pointer hover:text-white" />
        </Badge>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar size={28} style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
            <span className="text-sm text-white/90">管理员</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
