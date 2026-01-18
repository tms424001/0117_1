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
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MaterialPriceRecord {
  id: string;
  fileName: string;
  priceSource: string;
  priceSourceName: string;
  priceDate: string;
  province: string;
  city: string;
  status: 'pending' | 'completed' | 'pushed';
  statusName: string;
  materialCount: number;
  matchedCount: number;
  createdAt: string;
}

const mockData: MaterialPriceRecord[] = [
  {
    id: '1',
    fileName: '2026年1月钢材报价.xlsx',
    priceSource: 'supplier',
    priceSourceName: '供应商报价',
    priceDate: '2026-01',
    province: '北京市',
    city: '海淀区',
    status: 'completed',
    statusName: '已补录',
    materialCount: 156,
    matchedCount: 149,
    createdAt: '2026-01-18 10:30:00',
  },
  {
    id: '2',
    fileName: '混凝土询价单.xlsx',
    priceSource: 'website',
    priceSourceName: '网站询价',
    priceDate: '2026-01',
    province: '上海市',
    city: '浦东新区',
    status: 'pending',
    statusName: '待补录',
    materialCount: 45,
    matchedCount: 42,
    createdAt: '2026-01-17 14:20:00',
  },
  {
    id: '3',
    fileName: 'XX项目合同材料价.xlsx',
    priceSource: 'contract',
    priceSourceName: '合同价',
    priceDate: '2025-12',
    province: '广州市',
    city: '天河区',
    status: 'pushed',
    statusName: '已推送',
    materialCount: 89,
    matchedCount: 85,
    createdAt: '2026-01-16 09:15:00',
  },
];

const MaterialPricesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<MaterialPriceRecord[]>(mockData);
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
    const colorMap: Record<string, string> = {
      supplier: 'blue',
      website: 'green',
      contract: 'orange',
      review: 'cyan',
    };
    return colorMap[source] || 'default';
  };

  const handleDelete = (record: MaterialPriceRecord) => {
    setData(data.filter((item) => item.id !== record.id));
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('批量删除成功');
  };

  const columns: ColumnsType<MaterialPriceRecord> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: '材价时间',
      dataIndex: 'priceDate',
      key: 'priceDate',
      width: 80,
    },
    {
      title: '地点',
      dataIndex: 'province',
      key: 'province',
      width: 70,
    },
    {
      title: '材价来源',
      dataIndex: 'priceSourceName',
      key: 'priceSourceName',
      width: 90,
      render: (_, record) => (
        <Tag color={getSourceColor(record.priceSource)}>{record.priceSourceName}</Tag>
      ),
    },
    {
      title: '材料数',
      key: 'materialCount',
      width: 70,
      render: (_, record) => `${record.matchedCount}/${record.materialCount}`,
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small">查看</Button>
          {record.status !== 'pushed' && (
            <>
              <Button type="link" size="small">补录</Button>
              <Button type="link" size="small">推送</Button>
            </>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">材价文件采集</div>

      <Card size="small">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />}>
              上传文件
            </Button>
            <Popconfirm
              title="确定要删除选中的文件吗？"
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
              placeholder="搜索文件名"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="材价来源"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'supplier', label: '供应商报价' },
                { value: 'website', label: '网站询价' },
                { value: 'contract', label: '合同价' },
                { value: 'review', label: '财评价' },
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

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          scroll={{ x: 900 }}
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

export default MaterialPricesPage;
