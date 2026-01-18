/**
 * 数据湖浏览页面
 * 对齐 specs/03_Data_Collection/Data_Lake_Browser_Spec.md
 */

import { useState, useMemo, Key } from 'react';
import { 
  Tag, Drawer, Descriptions, Timeline, Tooltip 
} from 'antd';
import { 
  FileTextOutlined, FolderOutlined, EyeOutlined,
  HistoryOutlined, CloudOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useNavigate } from 'react-router-dom';
import { GoldenPage, TreePanel, GridPanel } from '@/components/golden';
import dayjs from 'dayjs';

// Mock 数据湖对象
interface LakeObject {
  id: string;
  type: 'cost' | 'material_price' | 'composite_price';
  fileName: string;
  fileSize: number;
  mimeType: string;
  versionCount: number;
  currentVersionId: string;
  scope: 'personal' | 'enterprise';
  batchId: string;
  createdAt: string;
  updatedAt: string;
}

interface LakeVersion {
  id: string;
  version: number;
  fileSize: number;
  checksum: string;
  changelog?: string;
  createdAt: string;
  createdBy: string;
}

const mockObjects: LakeObject[] = [
  { id: '1', type: 'cost', fileName: '某医院门诊楼工程.gzb', fileSize: 2456000, mimeType: 'application/gzb', versionCount: 3, currentVersionId: 'v3', scope: 'enterprise', batchId: 'b1', createdAt: '2026-01-10', updatedAt: '2026-01-15' },
  { id: '2', type: 'cost', fileName: '某学校教学楼工程.gzb', fileSize: 1890000, mimeType: 'application/gzb', versionCount: 1, currentVersionId: 'v1', scope: 'personal', batchId: 'b2', createdAt: '2026-01-12', updatedAt: '2026-01-12' },
  { id: '3', type: 'material_price', fileName: '2025年12月北京材价.xlsx', fileSize: 456000, mimeType: 'application/xlsx', versionCount: 2, currentVersionId: 'v2', scope: 'enterprise', batchId: 'b3', createdAt: '2026-01-08', updatedAt: '2026-01-14' },
  { id: '4', type: 'cost', fileName: '某办公楼工程.gzb', fileSize: 3200000, mimeType: 'application/gzb', versionCount: 1, currentVersionId: 'v1', scope: 'personal', batchId: 'b4', createdAt: '2026-01-05', updatedAt: '2026-01-05' },
  { id: '5', type: 'composite_price', fileName: '2025年综合单价库.xlsx', fileSize: 890000, mimeType: 'application/xlsx', versionCount: 5, currentVersionId: 'v5', scope: 'enterprise', batchId: 'b5', createdAt: '2025-12-20', updatedAt: '2026-01-17' },
  { id: '6', type: 'cost', fileName: '某住宅小区工程.gzb', fileSize: 4500000, mimeType: 'application/gzb', versionCount: 2, currentVersionId: 'v2', scope: 'enterprise', batchId: 'b6', createdAt: '2026-01-03', updatedAt: '2026-01-16' },
];

const mockVersions: LakeVersion[] = [
  { id: 'v3', version: 3, fileSize: 2456000, checksum: 'abc123', changelog: '更新了门诊楼部分数据', createdAt: '2026-01-15 10:30:00', createdBy: '张三' },
  { id: 'v2', version: 2, fileSize: 2400000, checksum: 'def456', changelog: '修复了解析错误', createdAt: '2026-01-12 14:20:00', createdBy: '张三' },
  { id: 'v1', version: 1, fileSize: 2350000, checksum: 'ghi789', changelog: '初始导入', createdAt: '2026-01-10 09:00:00', createdBy: '张三' },
];

const TYPE_CONFIG = {
  cost: { label: '造价文件', color: 'blue', icon: <FileTextOutlined /> },
  material_price: { label: '材价文件', color: 'green', icon: <FileTextOutlined /> },
  composite_price: { label: '综价文件', color: 'purple', icon: <FileTextOutlined /> },
};

export default function DataLakePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<LakeObject | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 构建筛选树
  const treeData: DataNode[] = useMemo(() => {
    return [
      {
        key: '',
        title: `全部文件 (${mockObjects.length})`,
        icon: <FolderOutlined />,
      },
      {
        key: 'type',
        title: '按类型',
        icon: <FolderOutlined />,
        children: [
          { key: 'type:cost', title: `造价文件 (${mockObjects.filter(o => o.type === 'cost').length})` },
          { key: 'type:material_price', title: `材价文件 (${mockObjects.filter(o => o.type === 'material_price').length})` },
          { key: 'type:composite_price', title: `综价文件 (${mockObjects.filter(o => o.type === 'composite_price').length})` },
        ],
      },
      {
        key: 'scope',
        title: '按归属',
        icon: <FolderOutlined />,
        children: [
          { key: 'scope:enterprise', title: `企业数据 (${mockObjects.filter(o => o.scope === 'enterprise').length})` },
          { key: 'scope:personal', title: `个人数据 (${mockObjects.filter(o => o.scope === 'personal').length})` },
        ],
      },
    ];
  }, []);

  // 过滤对象列表
  const filteredObjects = useMemo(() => {
    return mockObjects.filter(obj => {
      if (selectedType && obj.type !== selectedType) return false;
      if (selectedScope && obj.scope !== selectedScope) return false;
      return true;
    });
  }, [selectedType, selectedScope]);

  // 表格列定义
  const columns: ColumnsType<LakeObject> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 280,
      render: (name, record) => {
        const config = TYPE_CONFIG[record.type];
        return (
          <div className="flex items-center gap-2">
            <span className="text-blue-500">{config.icon}</span>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-gray-400">
                {(record.fileSize / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type) => {
        const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '归属',
      dataIndex: 'scope',
      width: 100,
      render: (scope) => (
        <Tag color={scope === 'enterprise' ? 'blue' : 'default'}>
          {scope === 'enterprise' ? '企业' : '个人'}
        </Tag>
      ),
    },
    {
      title: '版本',
      dataIndex: 'versionCount',
      width: 80,
      render: (count) => (
        <Tooltip title={`共 ${count} 个版本`}>
          <span className="text-blue-600 cursor-pointer">v{count}</span>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      render: (time) => dayjs(time).format('YYYY-MM-DD'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 120,
      render: (time) => dayjs(time).format('YYYY-MM-DD'),
    },
  ];

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    const key = keys[0] as string || '';
    if (key.startsWith('type:')) {
      setSelectedType(key.replace('type:', ''));
      setSelectedScope('');
    } else if (key.startsWith('scope:')) {
      setSelectedScope(key.replace('scope:', ''));
      setSelectedType('');
    } else {
      setSelectedType('');
      setSelectedScope('');
    }
  };

  // 行点击
  const handleRowClick = (obj: LakeObject) => {
    setSelectedObject(obj);
    setDrawerOpen(true);
  };

  // 预览
  const handlePreview = (obj: LakeObject) => {
    if (obj.type === 'cost') {
      navigate(`/collect/import/${obj.batchId}`);
    } else {
      navigate(`/collect/price-files/${obj.id}`);
    }
  };

  return (
    <GoldenPage
      header={{
        title: '数据湖浏览',
        subtitle: '查看所有导入文件的原样数据和版本历史',
        breadcrumbs: [
          { title: '数据采集' },
          { title: '数据湖' },
        ],
        extra: (
          <div className="flex items-center gap-2 text-gray-500">
            <CloudOutlined />
            <span>共 {mockObjects.length} 个对象</span>
          </div>
        ),
      }}
      toolbar={{
        search: {
          placeholder: '搜索文件名...',
        },
      }}
      treePanel={
        <TreePanel
          title="筛选"
          data={treeData}
          selectedKeys={[
            selectedType ? `type:${selectedType}` : 
            selectedScope ? `scope:${selectedScope}` : ''
          ]}
          expandedKeys={['type', 'scope']}
          onSelect={handleTreeSelect}
          showSearch={false}
        />
      }
      treePanelWidth={220}
      drawerOpen={drawerOpen}
      drawer={
        selectedObject && (
          <ObjectDetailDrawer
            object={selectedObject}
            versions={mockVersions}
            onClose={() => setDrawerOpen(false)}
            onPreview={() => handlePreview(selectedObject)}
          />
        )
      }
      drawerWidth={420}
    >
      <GridPanel
        columns={columns}
        dataSource={filteredObjects}
        rowKey="id"
        onRowClick={handleRowClick}
        pagination={{
          total: filteredObjects.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无数据湖对象',
        }}
      />
    </GoldenPage>
  );
}

// 对象详情抽屉
interface ObjectDetailDrawerProps {
  object: LakeObject;
  versions: LakeVersion[];
  onClose: () => void;
  onPreview: () => void;
}

function ObjectDetailDrawer({ object, versions, onClose, onPreview }: ObjectDetailDrawerProps) {
  const config = TYPE_CONFIG[object.type];

  return (
    <Drawer
      title="对象详情"
      open={true}
      onClose={onClose}
      width={420}
      extra={
        <a onClick={onPreview} className="text-blue-600 cursor-pointer">
          <EyeOutlined /> 预览
        </a>
      }
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="文件名">{object.fileName}</Descriptions.Item>
        <Descriptions.Item label="类型">
          <Tag color={config.color}>{config.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="大小">
          {(object.fileSize / 1024 / 1024).toFixed(2)} MB
        </Descriptions.Item>
        <Descriptions.Item label="归属">
          <Tag color={object.scope === 'enterprise' ? 'blue' : 'default'}>
            {object.scope === 'enterprise' ? '企业' : '个人'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="当前版本">v{object.versionCount}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{object.createdAt}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{object.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="批次ID">{object.batchId}</Descriptions.Item>
      </Descriptions>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <HistoryOutlined />
          <span className="font-medium">版本历史</span>
        </div>
        <Timeline
          items={versions.map(v => ({
            color: v.version === object.versionCount ? 'blue' : 'gray',
            children: (
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">v{v.version}</span>
                  <span className="text-xs text-gray-400">
                    {dayjs(v.createdAt).format('MM-DD HH:mm')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{v.changelog || '无说明'}</div>
                <div className="text-xs text-gray-400">
                  {v.createdBy} · {(v.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </Drawer>
  );
}
