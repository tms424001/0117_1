import { useState } from 'react';
import { Card, Table, Input, Select, Button, Tag, Space, Tooltip } from 'antd';
import { SearchOutlined, BarChartOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface CostIndex {
  id: string;
  functionTagCode: string;
  functionTagName: string;
  spaceCode: string;
  spaceName: string;
  professionCode: string;
  professionName: string;
  scaleRangeName: string;
  sampleCount: number;
  avgUnitCost: number;
  medianUnitCost: number;
  recommendedLow: number;
  recommendedMid: number;
  recommendedHigh: number;
  qualityLevel: string;
  versionCode: string;
}

const mockData: CostIndex[] = [
  {
    id: '1',
    functionTagCode: 'YI-MZ-01',
    functionTagName: '综合门诊',
    spaceCode: 'DS',
    spaceName: '地上',
    professionCode: 'TJ',
    professionName: '土建',
    scaleRangeName: '中型',
    sampleCount: 45,
    avgUnitCost: 4500,
    medianUnitCost: 4380,
    recommendedLow: 3800,
    recommendedMid: 4500,
    recommendedHigh: 5200,
    qualityLevel: 'A',
    versionCode: 'V2026.01',
  },
  {
    id: '2',
    functionTagCode: 'YI-MZ-01',
    functionTagName: '综合门诊',
    spaceCode: 'DS',
    spaceName: '地上',
    professionCode: 'AZ',
    professionName: '安装',
    scaleRangeName: '中型',
    sampleCount: 42,
    avgUnitCost: 1800,
    medianUnitCost: 1750,
    recommendedLow: 1500,
    recommendedMid: 1800,
    recommendedHigh: 2100,
    qualityLevel: 'A',
    versionCode: 'V2026.01',
  },
  {
    id: '3',
    functionTagCode: 'YI-ZY-01',
    functionTagName: '普通病房',
    spaceCode: 'DS',
    spaceName: '地上',
    professionCode: 'TJ',
    professionName: '土建',
    scaleRangeName: '大型',
    sampleCount: 28,
    avgUnitCost: 5200,
    medianUnitCost: 5100,
    recommendedLow: 4500,
    recommendedMid: 5200,
    recommendedHigh: 6000,
    qualityLevel: 'B',
    versionCode: 'V2026.01',
  },
  {
    id: '4',
    functionTagCode: 'JY-JX-01',
    functionTagName: '普通教室',
    spaceCode: 'DS',
    spaceName: '地上',
    professionCode: 'TJ',
    professionName: '土建',
    scaleRangeName: '中型',
    sampleCount: 15,
    avgUnitCost: 2800,
    medianUnitCost: 2750,
    recommendedLow: 2400,
    recommendedMid: 2800,
    recommendedHigh: 3200,
    qualityLevel: 'C',
    versionCode: 'V2026.01',
  },
];

const qualityColors: Record<string, string> = {
  A: 'green',
  B: 'blue',
  C: 'orange',
  D: 'red',
};

export default function IndexList() {
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<CostIndex> = [
    {
      title: '功能标签',
      key: 'functionTag',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.functionTagName}</div>
          <div className="text-xs text-gray-400">{record.functionTagCode}</div>
        </div>
      ),
    },
    { title: '空间', dataIndex: 'spaceName', key: 'spaceName', width: 80 },
    { title: '专业', dataIndex: 'professionName', key: 'professionName', width: 80 },
    { title: '规模', dataIndex: 'scaleRangeName', key: 'scaleRangeName', width: 80 },
    {
      title: '样本数',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 80,
      align: 'right',
    },
    {
      title: '平均值',
      dataIndex: 'avgUnitCost',
      key: 'avgUnitCost',
      width: 100,
      align: 'right',
      render: (v) => `¥${v?.toLocaleString()}`,
    },
    {
      title: '中位数',
      dataIndex: 'medianUnitCost',
      key: 'medianUnitCost',
      width: 100,
      align: 'right',
      render: (v) => `¥${v?.toLocaleString()}`,
    },
    {
      title: '推荐区间',
      key: 'recommended',
      width: 180,
      render: (_, record) => (
        <Tooltip title={`低: ¥${record.recommendedLow} | 中: ¥${record.recommendedMid} | 高: ¥${record.recommendedHigh}`}>
          <span>
            ¥{record.recommendedLow?.toLocaleString()} - ¥{record.recommendedHigh?.toLocaleString()}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '质量',
      dataIndex: 'qualityLevel',
      key: 'qualityLevel',
      width: 80,
      render: (level) => (
        <Tag color={qualityColors[level] || 'default'}>{level}级</Tag>
      ),
    },
    {
      title: '版本',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>指标列表</h1>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <Input
              placeholder="搜索功能标签"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            <Select
              placeholder="专业"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'TJ', label: '土建' },
                { value: 'AZ', label: '安装' },
              ]}
            />
            <Select
              placeholder="质量等级"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'A', label: 'A级' },
                { value: 'B', label: 'B级' },
                { value: 'C', label: 'C级' },
                { value: 'D', label: 'D级' },
              ]}
            />
          </div>
          <div className="table-toolbar-right">
            <Space>
              <Button icon={<BarChartOutlined />}>指标分析</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
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
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
