import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Input, Tag, Space, Dropdown, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

interface Estimation {
  id: string;
  estimationName: string;
  estimationType: string;
  projectName: string;
  totalArea: number;
  totalCost: number;
  unitCost: number;
  indexVersionCode: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

const mockData: Estimation[] = [
  {
    id: '1',
    estimationName: 'XX医院项目估算-方案一',
    estimationType: 'standard',
    projectName: 'XX市人民医院新院区',
    totalArea: 85000,
    totalCost: 425000000,
    unitCost: 5000,
    indexVersionCode: 'V2026.01',
    status: 'completed',
    createdAt: '2026-01-17',
    createdBy: '张三',
  },
  {
    id: '2',
    estimationName: 'XX学校项目估算',
    estimationType: 'quick',
    projectName: 'XX区实验中学',
    totalArea: 32000,
    totalCost: 96000000,
    unitCost: 3000,
    indexVersionCode: 'V2026.01',
    status: 'draft',
    createdAt: '2026-01-16',
    createdBy: '李四',
  },
  {
    id: '3',
    estimationName: 'XX办公楼估算',
    estimationType: 'standard',
    projectName: 'XX科技园B栋',
    totalArea: 28000,
    totalCost: 112000000,
    unitCost: 4000,
    indexVersionCode: 'V2026.01',
    status: 'completed',
    createdAt: '2026-01-15',
    createdBy: '张三',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  completed: { text: '已完成', color: 'green' },
};

const typeMap: Record<string, string> = {
  quick: '快速估算',
  standard: '标准估算',
  detailed: '详细估算',
};

export default function EstimationList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const getActionItems = (record: Estimation): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看',
      onClick: () => navigate(`/estimations/${record.id}`),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => navigate(`/estimations/${record.id}`),
    },
    {
      key: 'copy',
      icon: <CopyOutlined />,
      label: '复制',
      onClick: () => message.info('复制功能待实现'),
    },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => message.info('删除功能待实现'),
    },
  ];

  const columns: ColumnsType<Estimation> = [
    {
      title: '估算名称',
      dataIndex: 'estimationName',
      key: 'estimationName',
      width: 250,
      render: (text, record) => (
        <a onClick={() => navigate(`/estimations/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'estimationType',
      key: 'estimationType',
      width: 100,
      render: (type) => typeMap[type] || type,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
    },
    {
      title: '总面积(m²)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 120,
      align: 'right',
      render: (v) => v?.toLocaleString(),
    },
    {
      title: '总造价(万元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      align: 'right',
      render: (v) => (v / 10000).toLocaleString(),
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (v) => `¥${v?.toLocaleString()}`,
    },
    {
      title: '指标版本',
      dataIndex: 'indexVersionCode',
      key: 'indexVersionCode',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => {
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>估算列表</h1>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <Input
              placeholder="搜索估算名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
          </div>
          <div className="table-toolbar-right">
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/estimations/new')}>
                新建估算
              </Button>
            </Space>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            total: mockData.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
