import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const { Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

const getModuleFromPath = (pathname: string): string => {
  if (pathname.startsWith('/collection')) return 'collection';
  if (pathname.startsWith('/asset')) return 'asset';
  if (pathname.startsWith('/qc')) return 'qc';
  if (pathname.startsWith('/pricing')) return 'pricing';
  return 'estimation';
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentModule, setCurrentModule] = useState(() => getModuleFromPath(location.pathname));

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
  };

  return (
    <Layout className="min-h-screen">
      <AppHeader currentModule={currentModule} onModuleChange={handleModuleChange} />
      <Layout>
        <AppSidebar 
          collapsed={collapsed} 
          onCollapse={setCollapsed} 
          currentModule={currentModule}
        />
        <Layout
          style={{
            marginLeft: collapsed ? 64 : 220,
            marginTop: 56,
            transition: 'margin-left 0.2s',
          }}
        >
          <Content className="page-container">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
