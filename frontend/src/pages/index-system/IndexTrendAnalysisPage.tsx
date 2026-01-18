import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Table,
  Tag,
  Button,
  Statistic,
  DatePicker,
} from 'antd';
import {
  DownloadOutlined,
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

// 趋势数据类型
interface TrendData {
  period: string;
  avgUnitCost: number;
  medianUnitCost: number;
  sampleCount: number;
  momChange: number;
  yoyChange: number;
}

// 模拟趋势数据
const mockTrendData: TrendData[] = [
  { period: '2026-01', avgUnitCost: 4250, medianUnitCost: 4180, sampleCount: 156, momChange: 2.4, yoyChange: 5.8 },
  { period: '2025-12', avgUnitCost: 4150, medianUnitCost: 4080, sampleCount: 142, momChange: 1.5, yoyChange: 4.2 },
  { period: '2025-11', avgUnitCost: 4090, medianUnitCost: 4020, sampleCount: 138, momChange: 0.7, yoyChange: 3.8 },
  { period: '2025-10', avgUnitCost: 4060, medianUnitCost: 3990, sampleCount: 145, momChange: -0.5, yoyChange: 3.2 },
  { period: '2025-09', avgUnitCost: 4080, medianUnitCost: 4010, sampleCount: 152, momChange: 1.2, yoyChange: 3.5 },
  { period: '2025-08', avgUnitCost: 4030, medianUnitCost: 3960, sampleCount: 148, momChange: 0.8, yoyChange: 2.8 },
  { period: '2025-07', avgUnitCost: 4000, medianUnitCost: 3930, sampleCount: 135, momChange: -0.2, yoyChange: 2.5 },
  { period: '2025-06', avgUnitCost: 4008, medianUnitCost: 3940, sampleCount: 140, momChange: 0.5, yoyChange: 2.8 },
  { period: '2025-05', avgUnitCost: 3988, medianUnitCost: 3920, sampleCount: 132, momChange: 0.3, yoyChange: 2.2 },
  { period: '2025-04', avgUnitCost: 3976, medianUnitCost: 3910, sampleCount: 128, momChange: -0.8, yoyChange: 1.8 },
  { period: '2025-03', avgUnitCost: 4008, medianUnitCost: 3940, sampleCount: 136, momChange: 1.0, yoyChange: 2.5 },
  { period: '2025-02', avgUnitCost: 3968, medianUnitCost: 3900, sampleCount: 118, momChange: -1.2, yoyChange: 1.5 },
];

// 分类趋势对比数据
interface CategoryTrendData {
  categoryName: string;
  currentCost: number;
  lastYearCost: number;
  yoyChange: number;
  trend: 'up' | 'down' | 'stable';
}

const mockCategoryTrendData: CategoryTrendData[] = [
  { categoryName: '医疗卫生', currentCost: 5680, lastYearCost: 5320, yoyChange: 6.8, trend: 'up' },
  { categoryName: '教育', currentCost: 3450, lastYearCost: 3280, yoyChange: 5.2, trend: 'up' },
  { categoryName: '办公', currentCost: 3850, lastYearCost: 3720, yoyChange: 3.5, trend: 'up' },
  { categoryName: '商业', currentCost: 4200, lastYearCost: 4050, yoyChange: 3.7, trend: 'up' },
  { categoryName: '居住', currentCost: 2850, lastYearCost: 2780, yoyChange: 2.5, trend: 'up' },
  { categoryName: '酒店', currentCost: 4580, lastYearCost: 4620, yoyChange: -0.9, trend: 'down' },
  { categoryName: '文化', currentCost: 3980, lastYearCost: 3950, yoyChange: 0.8, trend: 'stable' },
  { categoryName: '体育', currentCost: 5200, lastYearCost: 4850, yoyChange: 7.2, trend: 'up' },
];

const IndexTrendAnalysisPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 趋势数据列定义
  const trendColumns: ColumnsType<TrendData> = [
    { title: '期间', dataIndex: 'period', key: 'period', width: 100 },
    {
      title: '平均单方(元/m²)',
      dataIndex: 'avgUnitCost',
      key: 'avgUnitCost',
      width: 130,
      align: 'right',
      render: (v) => <span className="font-medium text-blue-600">{v.toLocaleString()}</span>,
    },
    {
      title: '中位数(元/m²)',
      dataIndex: 'medianUnitCost',
      key: 'medianUnitCost',
      width: 130,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
    {
      title: '环比',
      dataIndex: 'momChange',
      key: 'momChange',
      width: 100,
      align: 'center',
      render: (v) => (
        <Tag color={v > 0 ? 'red' : v < 0 ? 'green' : 'default'} icon={v > 0 ? <RiseOutlined /> : v < 0 ? <FallOutlined /> : null}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: '同比',
      dataIndex: 'yoyChange',
      key: 'yoyChange',
      width: 100,
      align: 'center',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : v < 0 ? 'text-green-500' : ''}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </span>
      ),
    },
  ];

  // 分类趋势列定义
  const categoryTrendColumns: ColumnsType<CategoryTrendData> = [
    { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 100 },
    {
      title: '当前单方(元/m²)',
      dataIndex: 'currentCost',
      key: 'currentCost',
      width: 130,
      align: 'right',
      render: (v) => <span className="font-medium">{v.toLocaleString()}</span>,
    },
    {
      title: '去年同期(元/m²)',
      dataIndex: 'lastYearCost',
      key: 'lastYearCost',
      width: 130,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '同比变化',
      dataIndex: 'yoyChange',
      key: 'yoyChange',
      width: 100,
      align: 'center',
      render: (v) => (
        <Tag color={v > 0 ? 'red' : v < 0 ? 'green' : 'default'}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 80,
      align: 'center',
      render: (v) => (
        <span className={v === 'up' ? 'text-red-500' : v === 'down' ? 'text-green-500' : 'text-gray-500'}>
          {v === 'up' ? '↑ 上涨' : v === 'down' ? '↓ 下跌' : '— 平稳'}
        </span>
      ),
    },
  ];

  // 统计数据
  const latestData = mockTrendData[0];
  const lastYearData = mockTrendData[11];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">趋势分析</span>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </div>
      </Card>

      {/* 筛选条件 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">功能大类</div>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '医疗卫生', value: 'YL' },
                { label: '教育', value: 'JY' },
                { label: '办公', value: 'BG' },
                { label: '商业', value: 'SY' },
                { label: '居住', value: 'JZ' },
              ]}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">功能标签</div>
            <Select
              placeholder="全部"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '门诊', value: 'MZ' },
                { label: '住院-普通', value: 'ZY-PT' },
                { label: '教学-普通', value: 'JX-PT' },
              ]}
            />
          </Col>
          <Col span={8}>
            <div className="text-xs text-gray-500 mb-1">时间范围</div>
            <RangePicker picker="month" style={{ width: '100%' }} />
          </Col>
        </Row>
      </Card>

      {/* 核心指标 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="当前平均单方"
              value={latestData.avgUnitCost}
              suffix="元/m²"
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="text-xs text-gray-400 mt-1">{latestData.period}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="环比变化"
              value={latestData.momChange}
              precision={1}
              prefix={latestData.momChange > 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
              valueStyle={{ color: latestData.momChange > 0 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="同比变化"
              value={latestData.yoyChange}
              precision={1}
              prefix={latestData.yoyChange > 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
              valueStyle={{ color: latestData.yoyChange > 0 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="年度涨幅"
              value={((latestData.avgUnitCost - lastYearData.avgUnitCost) / lastYearData.avgUnitCost * 100)}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
            <div className="text-xs text-gray-400 mt-1">
              {lastYearData.period} → {latestData.period}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Card size="small" title="价格走势">
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center text-gray-400">
            <LineChartOutlined style={{ fontSize: 48 }} />
            <div className="mt-2">近12个月价格走势图</div>
            <div className="text-xs">最高: ¥{Math.max(...mockTrendData.map(d => d.avgUnitCost)).toLocaleString()} | 最低: ¥{Math.min(...mockTrendData.map(d => d.avgUnitCost)).toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* 趋势数据表 */}
      <Card size="small" title="历史数据">
        <Table
          rowKey="period"
          columns={trendColumns}
          dataSource={mockTrendData}
          pagination={false}
          size="small"
          scroll={{ y: 300 }}
        />
      </Card>

      {/* 分类趋势对比 */}
      <Card size="small" title="分类趋势对比（同比）">
        <Table
          rowKey="categoryName"
          columns={categoryTrendColumns}
          dataSource={mockCategoryTrendData}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default IndexTrendAnalysisPage;
