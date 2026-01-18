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

interface MyMaterialPriceRecord {
  id: string;
  materialName: string;
  specification: string;
  unit: string;
  price: number;
  province: string;
  priceDate: string;
  sourceType: 'cost_file' | 'material_file';
  sourceTypeName: string;
  smlCode: string;
  matchStatus: 'matched' | 'pending' | 'skipped';
  status: 'pending' | 'completed' | 'pushed';
  statusName: string;
}

const mockData: MyMaterialPriceRecord[] = [
  {
    id: '1',
    materialName: 'HRB400钢筋',
    specification: 'Φ12',
    unit: 't',
    price: 4250,
    province: '北京市',
    priceDate: '2026-01',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    smlCode: 'SML00123',
    matchStatus: 'matched',
    status: 'completed',
    statusName: '已补录',
  },
  {
    id: '2',
    materialName: 'HRB400钢筋',
    specification: 'Φ16',
    unit: 't',
    price: 4180,
    province: '北京市',
    priceDate: '2026-01',
    sourceType: 'material_file',
    sourceTypeName: '材价文件',
    smlCode: 'SML00124',
    matchStatus: 'matched',
    status: 'pending',
    statusName: '待补录',
  },
  {
    id: '3',
    materialName: 'C30商品混凝土',
    specification: '泵送',
    unit: 'm³',
    price: 485,
    province: '上海市',
    priceDate: '2026-01',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    smlCode: 'SML00256',
    matchStatus: 'matched',
    status: 'pushed',
    statusName: '已推送',
  },
  {
    id: '4',
    materialName: '普通硅酸盐水泥',
    specification: 'P.O42.5',
    unit: 't',
    price: 380,
    province: '广州市',
    priceDate: '2025-12',
    sourceType: 'material_file',
    sourceTypeName: '材价文件',
    smlCode: 'SML00301',
    matchStatus: 'matched',
    status: 'completed',
    statusName: '已补录',
  },
  {
    id: '5',
    materialName: '镀锌钢管',
    specification: 'DN100',
    unit: 'm',
    price: 125,
    province: '深圳市',
    priceDate: '2026-01',
    sourceType: 'cost_file',
    sourceTypeName: '造价文件',
    smlCode: '',
    matchStatus: 'pending',
    status: 'pending',
    statusName: '待补录',
  },
];

const MyMaterialPricesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<MyMaterialPriceRecord[]>(mockData);
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
    return source === 'cost_file' ? 'blue' : 'green';
  };

  const getMatchStatusTag = (status: string) => {
    if (status === 'matched') return <Tag color="success">已匹配</Tag>;
    if (status === 'pending') return <Tag color="warning">待确认</Tag>;
    return <Tag>已跳过</Tag>;
  };

  const handleDelete = (record: MyMaterialPriceRecord) => {
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
    materialFile: data.filter((d) => d.sourceType === 'material_file').length,
    pushed: data.filter((d) => d.status === 'pushed').length,
  };

  const columns: ColumnsType<MyMaterialPriceRecord> = [
    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 50,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
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
      <div className="text-lg font-medium">我的材价</div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="材料总数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="造价文件来源" value={stats.costFile} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="材价文件来源" value={stats.materialFile} valueStyle={{ color: '#52c41a' }} />
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
              title="确定要删除选中的材价吗？"
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
              placeholder="搜索材料名称"
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
                { value: 'material_file', label: '材价文件' },
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

export default MyMaterialPricesPage;
