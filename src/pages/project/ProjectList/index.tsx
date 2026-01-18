import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Dropdown,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

interface Project {
  id: string;
  projectName: string;
  projectType: string;
  province: string;
  city: string;
  totalArea: number;
  totalCost: number;
  unitCost: number;
  status: string;
  taggingStatus: string;
  createdAt: string;
}

const mockData: Project[] = [
  {
    id: '1',
    projectName: 'XX市人民医院门诊综合楼',
    projectType: '医疗',
    province: '浙江省',
    city: '杭州市',
    totalArea: 25000,
    totalCost: 125000000,
    unitCost: 5000,
    status: 'completed',
    taggingStatus: 'completed',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    projectName: 'XX区实验小学教学楼',
    projectType: '教育',
    province: '浙江省',
    city: '杭州市',
    totalArea: 18000,
    totalCost: 54000000,
    unitCost: 3000,
    status: 'tagging',
    taggingStatus: 'in_progress',
    createdAt: '2026-01-14',
  },
  {
    id: '3',
    projectName: 'XX科技园办公大厦',
    projectType: '办公',
    province: '江苏省',
    city: '南京市',
    totalArea: 42000,
    totalCost: 168000000,
    unitCost: 4000,
    status: 'imported',
    taggingStatus: 'pending',
    createdAt: '2026-01-13',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  imported: { text: '已导入', color: 'blue' },
  tagging: { text: '标签化中', color: 'orange' },
  completed: { text: '已完成', color: 'green' },
};

const projectTypes = [
  { value: '', label: '全部类型' },
  { value: '医疗', label: '医疗' },
  { value: '教育', label: '教育' },
  { value: '办公', label: '办公' },
  { value: '住宅', label: '住宅' },
];

export default function ProjectList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [projectType, setProjectType] = useState('');

  const getActionItems = (record: Project): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => navigate(`/projects/${record.id}`),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
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

  const columns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 280,
      render: (text, record) => (
        <a onClick={() => navigate(`/projects/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'projectType',
      key: 'projectType',
      width: 80,
    },
    {
      title: '地区',
      key: 'region',
      width: 150,
      render: (_, record) => `${record.province} ${record.city}`,
    },
    {
      title: '建筑面积(m²)',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
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
        <h1>项目管理</h1>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            <Select
              value={projectType}
              onChange={setProjectType}
              options={projectTypes}
              style={{ width: 120 }}
            />
          </div>
          <div className="table-toolbar-right">
            <Space>
              <Button icon={<UploadOutlined />}>导入数据</Button>
              <Button type="primary" icon={<PlusOutlined />}>
                新建项目
              </Button>
            </Space>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: mockData.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
