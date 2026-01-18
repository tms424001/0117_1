import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Table,
  Tag,
  Button,
  Space,
  Radio,
} from 'antd';
import {
  DownloadOutlined,
  BarChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// 分析维度选项
const rowDimensionOptions = [
  { label: '功能标签', value: 'functionTag' },
  { label: '功能大类', value: 'functionCategory' },
  { label: '空间类型', value: 'space' },
  { label: '专业类型', value: 'profession' },
  { label: '规模档', value: 'scaleRange' },
];

const columnDimensionOptions = [
  { label: '无', value: 'none' },
  { label: '空间类型', value: 'space' },
  { label: '专业类型', value: 'profession' },
  { label: '规模档', value: 'scaleRange' },
  { label: '质量等级', value: 'qualityLevel' },
];

// 功能标签 × 空间 分析数据
interface TagSpaceData {
  tagCode: string;
  tagName: string;
  aboveGroundCost: number;
  undergroundCost: number;
  aboveGroundRatio: number;
  sampleCount: number;
}

const mockTagSpaceData: TagSpaceData[] = [
  { tagCode: 'MZ', tagName: '门诊', aboveGroundCost: 3850, undergroundCost: 2650, aboveGroundRatio: 68, sampleCount: 28 },
  { tagCode: 'ZY-PT', tagName: '住院-普通', aboveGroundCost: 4120, undergroundCost: 2800, aboveGroundRatio: 72, sampleCount: 35 },
  { tagCode: 'YJ', tagName: '医技', aboveGroundCost: 4580, undergroundCost: 3100, aboveGroundRatio: 65, sampleCount: 22 },
  { tagCode: 'JX-PT', tagName: '教学-普通', aboveGroundCost: 2850, undergroundCost: 2200, aboveGroundRatio: 85, sampleCount: 45 },
  { tagCode: 'BG-PT', tagName: '办公-普通', aboveGroundCost: 3200, undergroundCost: 2400, aboveGroundRatio: 70, sampleCount: 38 },
  { tagCode: 'SC', tagName: '商场', aboveGroundCost: 3500, undergroundCost: 2600, aboveGroundRatio: 62, sampleCount: 25 },
  { tagCode: 'JD-SX', tagName: '酒店-商务型', aboveGroundCost: 4200, undergroundCost: 2900, aboveGroundRatio: 68, sampleCount: 18 },
  { tagCode: 'TYG', tagName: '体育馆', aboveGroundCost: 5200, undergroundCost: 3500, aboveGroundRatio: 75, sampleCount: 12 },
];

// 功能标签 × 专业 分析数据
interface TagProfessionData {
  tagCode: string;
  tagName: string;
  civilCost: number;
  plumbingCost: number;
  electricCost: number;
  weakCurrentCost: number;
  hvacCost: number;
  fireCost: number;
  totalCost: number;
}

const mockTagProfessionData: TagProfessionData[] = [
  { tagCode: 'MZ', tagName: '门诊', civilCost: 2850, plumbingCost: 180, electricCost: 220, weakCurrentCost: 150, hvacCost: 380, fireCost: 180, totalCost: 5200 },
  { tagCode: 'ZY-PT', tagName: '住院-普通', civilCost: 3100, plumbingCost: 200, electricCost: 250, weakCurrentCost: 180, hvacCost: 420, fireCost: 200, totalCost: 5800 },
  { tagCode: 'SS', tagName: '手术中心', civilCost: 3500, plumbingCost: 350, electricCost: 380, weakCurrentCost: 280, hvacCost: 850, fireCost: 320, totalCost: 8200 },
  { tagCode: 'JX-PT', tagName: '教学-普通', civilCost: 2200, plumbingCost: 120, electricCost: 150, weakCurrentCost: 100, hvacCost: 180, fireCost: 120, totalCost: 3500 },
  { tagCode: 'BG-PT', tagName: '办公-普通', civilCost: 2400, plumbingCost: 130, electricCost: 160, weakCurrentCost: 120, hvacCost: 200, fireCost: 130, totalCost: 3800 },
];

// 功能标签 × 规模档 分析数据
interface TagScaleData {
  tagCode: string;
  tagName: string;
  smallCost: number;
  mediumSmallCost: number;
  mediumLargeCost: number;
  largeCost: number;
  extraLargeCost: number;
  trend: 'up' | 'down' | 'stable';
}

const mockTagScaleData: TagScaleData[] = [
  { tagCode: 'MZ', tagName: '门诊', smallCost: 5800, mediumSmallCost: 5400, mediumLargeCost: 5200, largeCost: 5000, extraLargeCost: 4800, trend: 'down' },
  { tagCode: 'ZY-PT', tagName: '住院-普通', smallCost: 6200, mediumSmallCost: 5900, mediumLargeCost: 5800, largeCost: 5600, extraLargeCost: 5400, trend: 'down' },
  { tagCode: 'JX-PT', tagName: '教学-普通', smallCost: 3800, mediumSmallCost: 3600, mediumLargeCost: 3500, largeCost: 3400, extraLargeCost: 3300, trend: 'down' },
  { tagCode: 'TYG', tagName: '体育馆', smallCost: 4500, mediumSmallCost: 5200, mediumLargeCost: 5800, largeCost: 6500, extraLargeCost: 7200, trend: 'up' },
  { tagCode: 'BG-PT', tagName: '办公-普通', smallCost: 4200, mediumSmallCost: 3900, mediumLargeCost: 3700, largeCost: 3500, extraLargeCost: 3400, trend: 'down' },
];

const IndexAnalysisPage: React.FC = () => {
  const [rowDimension, setRowDimension] = useState('functionTag');
  const [columnDimension, setColumnDimension] = useState('space');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // 功能标签 × 空间 列定义
  const tagSpaceColumns: ColumnsType<TagSpaceData> = [
    { title: '功能标签', dataIndex: 'tagName', key: 'tagName', width: 120, fixed: 'left' },
    { title: '地上(元/m²)', dataIndex: 'aboveGroundCost', key: 'aboveGroundCost', width: 120, align: 'right', render: (v) => <span className="text-blue-600">{v.toLocaleString()}</span> },
    { title: '地下(元/m²)', dataIndex: 'undergroundCost', key: 'undergroundCost', width: 120, align: 'right', render: (v) => v.toLocaleString() },
    { title: '地上占比', dataIndex: 'aboveGroundRatio', key: 'aboveGroundRatio', width: 100, align: 'center', render: (v) => <Tag color="cyan">{v}%</Tag> },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
  ];

  // 功能标签 × 专业 列定义
  const tagProfessionColumns: ColumnsType<TagProfessionData> = [
    { title: '功能标签', dataIndex: 'tagName', key: 'tagName', width: 100, fixed: 'left' },
    { title: '土建', dataIndex: 'civilCost', key: 'civilCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '给排水', dataIndex: 'plumbingCost', key: 'plumbingCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '强电', dataIndex: 'electricCost', key: 'electricCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '弱电', dataIndex: 'weakCurrentCost', key: 'weakCurrentCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '暖通', dataIndex: 'hvacCost', key: 'hvacCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '消防', dataIndex: 'fireCost', key: 'fireCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '合计', dataIndex: 'totalCost', key: 'totalCost', width: 100, align: 'right', render: (v) => <span className="font-bold text-blue-600">{v.toLocaleString()}</span> },
  ];

  // 功能标签 × 规模档 列定义
  const tagScaleColumns: ColumnsType<TagScaleData> = [
    { title: '功能标签', dataIndex: 'tagName', key: 'tagName', width: 100, fixed: 'left' },
    { title: '小型', dataIndex: 'smallCost', key: 'smallCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '中小型', dataIndex: 'mediumSmallCost', key: 'mediumSmallCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '中大型', dataIndex: 'mediumLargeCost', key: 'mediumLargeCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '大型', dataIndex: 'largeCost', key: 'largeCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    { title: '特大型', dataIndex: 'extraLargeCost', key: 'extraLargeCost', width: 80, align: 'right', render: (v) => v.toLocaleString() },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 80,
      align: 'center',
      render: (v) => (
        <Tag color={v === 'down' ? 'green' : v === 'up' ? 'red' : 'default'}>
          {v === 'down' ? '↓ 递减' : v === 'up' ? '↑ 递增' : '— 稳定'}
        </Tag>
      ),
    },
  ];

  // 根据列维度选择渲染不同表格
  const renderAnalysisTable = () => {
    if (columnDimension === 'space') {
      return (
        <Table
          rowKey="tagCode"
          columns={tagSpaceColumns}
          dataSource={mockTagSpaceData}
          pagination={false}
          size="small"
          scroll={{ x: 600 }}
        />
      );
    }
    if (columnDimension === 'profession') {
      return (
        <Table
          rowKey="tagCode"
          columns={tagProfessionColumns}
          dataSource={mockTagProfessionData}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
        />
      );
    }
    if (columnDimension === 'scaleRange') {
      return (
        <Table
          rowKey="tagCode"
          columns={tagScaleColumns}
          dataSource={mockTagScaleData}
          pagination={false}
          size="small"
          scroll={{ x: 700 }}
        />
      );
    }
    return (
      <Table
        rowKey="tagCode"
        columns={tagSpaceColumns}
        dataSource={mockTagSpaceData}
        pagination={false}
        size="small"
      />
    );
  };

  // 渲染图表视图（示意）
  const renderChartView = () => (
    <div className="h-80 bg-gray-50 rounded flex items-center justify-center">
      <div className="text-center text-gray-400">
        <BarChartOutlined style={{ fontSize: 48 }} />
        <div className="mt-2">多维分析图表</div>
        <div className="text-xs">行维度: {rowDimensionOptions.find(o => o.value === rowDimension)?.label}</div>
        <div className="text-xs">列维度: {columnDimensionOptions.find(o => o.value === columnDimension)?.label}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">多维分析</span>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </div>
      </Card>

      {/* 维度选择 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">行维度</div>
            <Select
              value={rowDimension}
              onChange={setRowDimension}
              style={{ width: '100%' }}
              options={rowDimensionOptions}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">列维度</div>
            <Select
              value={columnDimension}
              onChange={setColumnDimension}
              style={{ width: '100%' }}
              options={columnDimensionOptions}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">功能大类筛选</div>
            <Select
              placeholder="全部"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '医疗卫生', value: 'YL' },
                { label: '教育', value: 'JY' },
                { label: '办公', value: 'BG' },
                { label: '商业', value: 'SY' },
              ]}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">视图模式</div>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value="table">
                <TableOutlined /> 表格
              </Radio.Button>
              <Radio.Button value="chart">
                <BarChartOutlined /> 图表
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* 分析结果 */}
      <Card
        size="small"
        title={
          <Space>
            <span>
              {rowDimensionOptions.find(o => o.value === rowDimension)?.label} ×{' '}
              {columnDimensionOptions.find(o => o.value === columnDimension)?.label} 分析
            </span>
            <Tag color="blue">单位：元/m²</Tag>
          </Space>
        }
      >
        {viewMode === 'table' ? renderAnalysisTable() : renderChartView()}
      </Card>

      {/* 分析洞察 */}
      <Card size="small" title="分析洞察">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-yellow-500">💡</span>
            <span>大多数类型呈现规模越大、单方越低的规律（规模效应）</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-500">💡</span>
            <span>体育馆等特殊类型呈现相反趋势（大型设施复杂度高）</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-500">💡</span>
            <span>医疗类建筑暖通费用占比明显高于其他类型</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IndexAnalysisPage;
