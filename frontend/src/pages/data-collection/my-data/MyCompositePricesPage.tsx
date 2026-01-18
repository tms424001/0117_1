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
  EditOutlined,
  SendOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MyCompositePriceRecord {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  compositePrice: number;
  province: string;
  priceDate: string;
  pricingStage: string;
  pricingStageName: string;
  sourceType: 'cost_file' | 'composite_file';
  sourceTypeName: string;
  sboqCode: string;
  matchStatus: 'matched' | 'pending' | 'skipped';
  status: 'pending' | 'completed' | 'pushed';
  statusName: string;
}

const mockData: MyCompositePriceRecord[] = [
  {
    id: '1',
    itemCode: '010101001',
    itemName: '土方开挖',
    unit: 'm³',
    compositePrice: 28.5,
    province: '北京市',
    priceDate: '2026-01',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    sboqCode: 'SBQ0101',
    matchStatus: 'matched',
    status: 'completed',
    statusName: '已补录',
  },
  {
    id: '2',
    itemCode: '010201001',
    itemName: 'C30混凝土',
    unit: 'm³',
    compositePrice: 685,
    province: '北京市',
    priceDate: '2026-01',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    sourceType: 'composite_file',
    sourceTypeName: '综价文件',
    sboqCode: 'SBQ0201',
    matchStatus: 'matched',
    status: 'pending',
    statusName: '待补录',
  },
  {
    id: '3',
    itemCode: '010301001',
    itemName: 'HRB400钢筋',
    unit: 't',
    compositePrice: 5850,
    province: '上海市',
    priceDate: '2026-01',
    pricingStage: 'settlement',
    pricingStageName: '结算',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    sboqCode: 'SBQ0301',
    matchStatus: 'matched',
    status: 'pushed',
    statusName: '已推送',
  },
  {
    id: '4',
    itemCode: '010401001',
    itemName: '模板工程',
    unit: 'm²',
    compositePrice: 65,
    province: '广州市',
    priceDate: '2025-12',
    pricingStage: 'bidQuote',
    pricingStageName: '投标报价',
    sourceType: 'composite_file',
    sourceTypeName: '综价文件',
    sboqCode: 'SBQ0401',
    matchStatus: 'matched',
    status: 'completed',
    statusName: '已补录',
  },
  {
    id: '5',
    itemCode: '020101001',
    itemName: '内墙涂料',
    unit: 'm²',
    compositePrice: 32.5,
    province: '深圳市',
    priceDate: '2026-01',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    sboqCode: '',
    matchStatus: 'pending',
    status: 'pending',
    statusName: '待补录',
  },
];

const MyCompositePricesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<MyCompositePriceRecord[]>(mockData);
  const [searchText, setSearchText] = useState('');

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'default',
      completed: 'success',
      pushed: 'purple',
    };
    return colorMap[status] || 'default';
  };

  const getSourceColor = (source: string) => {
    return source === 'cost_file' ? 'blue' : 'orange';
  };

  const getMatchStatusTag = (status: string) => {
    if (status === 'matched') return <Tag color="success">已匹配</Tag>;
    if (status === 'pending') return <Tag color="warning">待确认</Tag>;
    return <Tag>已跳过</Tag>;
  };

  const handleDelete = (record: MyCompositePriceRecord) => {
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
    costFile: data.filter((d) => d.sourceType === 'cost_file').length,
    compositeFile: data.filter((d) => d.sourceType === 'composite_file').length,
    pushed: data.filter((d) => d.status === 'pushed').length,
  };

  const columns: ColumnsType<MyCompositePriceRecord> = [
    {
      title: '项目编码',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 90,
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 50,
    },
    {
      title: '综合单价',
      dataIndex: 'compositePrice',
      key: 'compositePrice',
      width: 80,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '地点',
      dataIndex: 'province',
      key: 'province',
      width: 70,
    },
    {
      title: '材价时间',
      dataIndex: 'priceDate',
      key: 'priceDate',
      width: 80,
    },
    {
      title: '来源',
      dataIndex: 'sourceTypeName',
      key: 'sourceTypeName',
      width: 80,
      render: (_, record) => (
        <Tag color={getSourceColor(record.sourceType)}>{record.sourceTypeName}</Tag>
      ),
    },
    {
      title: '标准化',
      key: 'matchStatus',
      width: 70,
      render: (_, record) => getMatchStatusTag(record.matchStatus),
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small" disabled={record.status === 'pushed'}>补录</Button>
          <Button type="link" size="small" disabled={record.status === 'pushed'}>推送</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">我的综价</div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="清单总数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="造价文件来源" value={stats.costFile} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="综价文件来源" value={stats.compositeFile} valueStyle={{ color: '#fa8c16' }} />
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
            <Button icon={<SendOutlined />} disabled={selectedRowKeys.length === 0}>
              批量推送
            </Button>
            <Popconfirm
              title="确定要删除选中的综价吗？"
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
            <Button icon={<ExportOutlined />}>导出Excel</Button>
          </Space>

          <Space wrap>
            <Input
              placeholder="搜索清单名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="数据来源"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'cost_file', label: '造价文件' },
                { value: 'composite_file', label: '综价文件' },
              ]}
            />
            <Select
              placeholder="计价阶段"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'estimate', label: '概算' },
                { value: 'budget', label: '预算' },
                { value: 'bidControl', label: '招标控制价' },
                { value: 'bidQuote', label: '投标报价' },
                { value: 'settlement', label: '结算' },
              ]}
            />
            <Select
              placeholder="状态"
              style={{ width: 100 }}
              allowClear
              options={[
                { value: 'pending', label: '待补录' },
                { value: 'completed', label: '已补录' },
                { value: 'pushed', label: '已推送' },
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

export default MyCompositePricesPage;
