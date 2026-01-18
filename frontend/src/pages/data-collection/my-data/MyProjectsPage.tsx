import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  message,
  Popconfirm,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  TagOutlined,
  BarChartOutlined,
  EditOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MyProjectRecord {
  id: string;
  projectName: string;
  functionTagName: string;
  scaleLevel: string;
  scaleLevelName: string;
  province: string;
  pricingStage: string;
  pricingStageName: string;
  status: 'pending' | 'tagging' | 'indexed' | 'completed' | 'pushed';
  statusName: string;
  totalArea: number;
  unitCost: number;
  createdAt: string;
}

const mockData: MyProjectRecord[] = [
  {
    id: '1',
    projectName: 'XX医院门诊楼项目',
    functionTagName: '综合医院',
    scaleLevel: 'large',
    scaleLevelName: '大型',
    province: '北京市',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    status: 'indexed',
    statusName: '已生成指标',
    totalArea: 25000,
    unitCost: 3400,
    createdAt: '2026-01-18 10:30:00',
  },
  {
    id: '2',
    projectName: 'XX学校教学楼工程',
    functionTagName: '中学-教学楼',
    scaleLevel: 'medium',
    scaleLevelName: '中型',
    province: '上海市',
    pricingStage: 'settlement',
    pricingStageName: '结算',
    status: 'completed',
    statusName: '已补录',
    totalArea: 12000,
    unitCost: 2800,
    createdAt: '2026-01-17 14:20:00',
  },
  {
    id: '3',
    projectName: 'XX办公楼项目',
    functionTagName: '商务办公',
    scaleLevel: 'large',
    scaleLevelName: '大型',
    province: '广州市',
    pricingStage: 'bidQuote',
    pricingStageName: '投标报价',
    status: 'pending',
    statusName: '待标签化',
    totalArea: 35000,
    unitCost: 0,
    createdAt: '2026-01-16 09:15:00',
  },
  {
    id: '4',
    projectName: 'XX住宅小区一期',
    functionTagName: '住宅-高层',
    scaleLevel: 'xlarge',
    scaleLevelName: '特大型',
    province: '深圳市',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    status: 'pushed',
    statusName: '已推送',
    totalArea: 85000,
    unitCost: 3100,
    createdAt: '2026-01-15 16:45:00',
  },
  {
    id: '5',
    projectName: 'XX商业综合体',
    functionTagName: '商业综合体',
    scaleLevel: 'large',
    scaleLevelName: '大型',
    province: '杭州市',
    pricingStage: 'estimate',
    pricingStageName: '概算',
    status: 'tagging',
    statusName: '待计算指标',
    totalArea: 45000,
    unitCost: 0,
    createdAt: '2026-01-14 11:30:00',
  },
];

const MyProjectsPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<MyProjectRecord[]>(mockData);
  const [searchText, setSearchText] = useState('');

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'default',
      tagging: 'processing',
      indexed: 'success',
      completed: 'cyan',
      pushed: 'purple',
    };
    return colorMap[status] || 'default';
  };

  const handleDelete = (record: MyProjectRecord) => {
    setData(data.filter((item) => item.id !== record.id));
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('批量删除成功');
  };

  // 统计数据
  const stats = {
    total: data.length,
    pending: data.filter((d) => d.status === 'pending').length,
    indexed: data.filter((d) => d.status === 'indexed' || d.status === 'completed').length,
    pushed: data.filter((d) => d.status === 'pushed').length,
  };

  const columns: ColumnsType<MyProjectRecord> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 300,
      ellipsis: true,
    },
    {
      title: '功能标签',
      dataIndex: 'functionTagName',
      key: 'functionTagName',
      width: 90,
    },
    {
      title: '规模档',
      dataIndex: 'scaleLevelName',
      key: 'scaleLevelName',
      width: 70,
    },
    {
      title: '地点',
      dataIndex: 'province',
      key: 'province',
      width: 70,
    },
    {
      title: '计价阶段',
      dataIndex: 'pricingStageName',
      key: 'pricingStageName',
      width: 90,
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 90,
      align: 'right',
      render: (val) => (val ? `${val.toLocaleString()} 元/m²` : '-'),
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 70,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>{record.statusName}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small" disabled={record.status !== 'pending'}>标签化</Button>
          <Button type="link" size="small" disabled={record.status !== 'tagging'}>计算指标</Button>
          <Button type="link" size="small" disabled={record.status !== 'indexed' && record.status !== 'completed'}>PR补录</Button>
          <Button type="link" size="small" disabled={record.status !== 'indexed' && record.status !== 'completed'}>推送</Button>
          {record.status !== 'pushed' && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">我的项目</div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="项目总数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待处理" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已生成指标" value={stats.indexed} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已推送" value={stats.pushed} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card size="small">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap>
            <Button icon={<TagOutlined />} disabled={selectedRowKeys.length === 0}>
              批量标签化
            </Button>
            <Button icon={<BarChartOutlined />} disabled={selectedRowKeys.length === 0}>
              批量计算指标
            </Button>
            <Popconfirm
              title="确定要删除选中的项目吗？"
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
          </Space>

          <Space wrap>
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'pending', label: '待标签化' },
                { value: 'tagging', label: '待计算指标' },
                { value: 'indexed', label: '已生成指标' },
                { value: 'completed', label: '已补录' },
                { value: 'pushed', label: '已推送' },
              ]}
            />
            <Select
              placeholder="功能标签"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'hospital', label: '医疗建筑' },
                { value: 'school', label: '教育建筑' },
                { value: 'office', label: '办公建筑' },
                { value: 'residential', label: '住宅建筑' },
                { value: 'commercial', label: '商业建筑' },
              ]}
            />
          </Space>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          scroll={{ x: 1000 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default MyProjectsPage;
