import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const moduleNames: Record<string, string> = {
  'data-asset': '数据资产',
  'quality-control': '质控',
  'pricing': '计价',
  'estimation': '估算',
};

const PlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modulePath = location.pathname.split('/')[1];
  const moduleName = moduleNames[modulePath] || '该模块';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      background: '#fff',
      borderRadius: 8
    }}>
      <Result
        status="info"
        title={`${moduleName}模块`}
        subTitle="该模块正在开发中，敬请期待..."
        extra={
          <Button type="primary" onClick={() => navigate('/data-collection/cost-files')}>
            返回数据采集
          </Button>
        }
      />
    </div>
  );
};

export default PlaceholderPage;
