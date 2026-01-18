import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Select,
  Table,
  DatePicker,
  Tag,
} from 'antd';
import {
  ArrowLeftOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

// 趋势数据类型
interface TrendRecord {
  period: string;
  avgPrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  momChange: number;
  yoyChange: number;
  sampleCount: number;
}

// 地区比价数据类型
interface RegionCompare {
  region: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  sampleCount: number;
  vsAvg: number;
}

// 供应商比价数据类型
interface SupplierCompare {
  supplierName: string;
  avgPrice: number;
  priceCount: number;
  reliability: string;
  vsAvg: number;
}

// 模拟趋势数据
const mockTrendData: TrendRecord[] = [
  { period: '2025-12', avgPrice: 3850, medianPrice: 3840, minPrice: 3780, maxPrice: 3920, momChange: 2.5, yoyChange: 8.2, sampleCount: 156 },
  { period: '2025-11', avgPrice: 3756, medianPrice: 3750, minPrice: 3680, maxPrice: 3820, momChange: 1.8, yoyChange: 7.5, sampleCount: 142 },
  { period: '2025-10', avgPrice: 3690, medianPrice: 3685, minPrice: 3620, maxPrice: 3760, momChange: 0.5, yoyChange: 6.8, sampleCount: 138 },
  { period: '2025-09', avgPrice: 3672, medianPrice: 3670, minPrice: 3600, maxPrice: 3740, momChange: -1.2, yoyChange: 5.2, sampleCount: 145 },
  { period: '2025-08', avgPrice: 3716, medianPrice: 3710, minPrice: 3650, maxPrice: 3780, momChange: 2.1, yoyChange: 6.5, sampleCount: 135 },
  { period: '2025-07', avgPrice: 3640, medianPrice: 3635, minPrice: 3580, maxPrice: 3700, momChange: 1.5, yoyChange: 5.8, sampleCount: 128 },
];

// 模拟地区比价数据
const mockRegionCompare: RegionCompare[] = [
  { region: '深圳市', avgPrice: 3850, minPrice: 3780, maxPrice: 3920, sampleCount: 156, vsAvg: 2.1 },
  { region: '广州市', avgPrice: 3820, minPrice: 3750, maxPrice: 3890, sampleCount: 142, vsAvg: 1.3 },
  { region: '东莞市', avgPrice: 3780, minPrice: 3720, maxPrice: 3850, sampleCount: 98, vsAvg: 0.3 },
  { region: '佛山市', avgPrice: 3760, minPrice: 3700, maxPrice: 3820, sampleCount: 85, vsAvg: -0.3 },
  { region: '惠州市', avgPrice: 3720, minPrice: 3660, maxPrice: 3780, sampleCount: 62, vsAvg: -1.3 },
];

// 模拟供应商比价数据
const mockSupplierCompare: SupplierCompare[] = [
  { supplierName: '深圳钢材贸易有限公司', avgPrice: 3850, priceCount: 45, reliability: 'high', vsAvg: 2.1 },
  { supplierName: '广州钢铁集团', avgPrice: 3880, priceCount: 38, reliability: 'high', vsAvg: 2.9 },
  { supplierName: '东莞钢材市场', avgPrice: 3780, priceCount: 28, reliability: 'medium', vsAvg: 0.3 },
  { supplierName: '佛山钢材批发', avgPrice: 3820, priceCount: 22, reliability: 'medium', vsAvg: 1.3 },
  { supplierName: '惠州建材供应商', avgPrice: 3750, priceCount: 15, reliability: 'low', vsAvg: -0.5 },
];

const MaterialPriceAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<string>('trend');
  const [materialCategory, setMaterialCategory] = useState<string>('钢材');
  const [specification, setSpecification] = useState<string>('HRB400 Φ12');

  // 趋势表格列定义
  const trendColumns: ColumnsType<TrendRecord> = [
    { title: '材价期', dataIndex: 'period', key: 'period', width: 100 },
    { title: '均价', dataIndex: 'avgPrice', key: 'avgPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '中位价', dataIndex: 'medianPrice', key: 'medianPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '最低价', dataIndex: 'minPrice', key: 'minPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '最高价', dataIndex: 'maxPrice', key: 'maxPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '环比', dataIndex: 'momChange', key: 'momChange', width: 80, align: 'right', render: (val) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>{val > 0 ? '+' : ''}{val}%</span> },
    { title: '同比', dataIndex: 'yoyChange', key: 'yoyChange', width: 80, align: 'right', render: (val) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>{val > 0 ? '+' : ''}{val}%</span> },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
  ];

  // 地区比价列定义
  const regionColumns: ColumnsType<RegionCompare> = [
    { title: '地区', dataIndex: 'region', key: 'region', width: 120 },
    { title: '均价', dataIndex: 'avgPrice', key: 'avgPrice', width: 100, align: 'right', render: (val) => <span className="font-medium">¥{val.toLocaleString()}</span> },
    { title: '最低价', dataIndex: 'minPrice', key: 'minPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '最高价', dataIndex: 'maxPrice', key: 'maxPrice', width: 100, align: 'right', render: (val) => `¥${val.toLocaleString()}` },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
    { title: '较均值', dataIndex: 'vsAvg', key: 'vsAvg', width: 100, align: 'right', render: (val) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>{val > 0 ? '+' : ''}{val}%</span> },
  ];

  // 供应商比价列定义
  const supplierColumns: ColumnsType<SupplierCompare> = [
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 200 },
    { title: '均价', dataIndex: 'avgPrice', key: 'avgPrice', width: 100, align: 'right', render: (val) => <span className="font-medium">¥{val.toLocaleString()}</span> },
    { title: '报价次数', dataIndex: 'priceCount', key: 'priceCount', width: 100, align: 'center' },
    { title: '可靠性', dataIndex: 'reliability', key: 'reliability', width: 100, render: (val) => <Tag color={val === 'high' ? 'green' : val === 'medium' ? 'orange' : 'red'}>{val === 'high' ? '高' : val === 'medium' ? '中' : '低'}</Tag> },
    { title: '较均值', dataIndex: 'vsAvg', key: 'vsAvg', width: 100, align: 'right', render: (val) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>{val > 0 ? '+' : ''}{val}%</span> },
  ];

  // 渲染趋势分析
  const renderTrendAnalysis = () => (
    <div className="space-y-4">
      <Card size="small" title="价格趋势图">
        <div className="h-56 flex items-end justify-between px-4 pb-8 bg-gray-50 rounded relative">
          <div className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
            <span>¥3,900</span>
            <span>¥3,750</span>
            <span>¥3,600</span>
          </div>
          <div className="flex-1 ml-12 flex items-end justify-between h-full">
            {[...mockTrendData].reverse().map((item) => (
              <div key={item.period} className="text-center flex-1">
                <div
                  className="mx-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${((item.avgPrice - 3550) / 400) * 100}%`, minHeight: 20 }}
                  title={`${item.period}: ¥${item.avgPrice}`}
                />
                <div className="text-xs text-gray-400 mt-2">{item.period.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card size="small" title="趋势统计">
        <Table rowKey="period" columns={trendColumns} dataSource={mockTrendData} pagination={false} size="small" />
      </Card>

      <Card size="small" title="趋势洞察">
        <Row gutter={16}>
          <Col span={6}>
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-sm text-gray-500">近6月均价</div>
              <div className="text-xl font-bold text-blue-600">¥3,721</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-red-50 rounded text-center">
              <div className="text-sm text-gray-500">累计涨幅</div>
              <div className="text-xl font-bold text-red-600">+5.8%</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-sm text-gray-500">波动率</div>
              <div className="text-xl font-bold text-orange-600">3.2%</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-gray-500">预测下月</div>
              <div className="text-xl font-bold text-green-600">¥3,920</div>
            </div>
          </Col>
        </Row>
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="font-medium mb-2">分析说明：</div>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>钢筋价格近6个月持续上涨，累计涨幅5.8%</li>
            <li>12月环比上涨2.5%，涨幅较大，主要受原材料价格影响</li>
            <li>预计1月价格将继续小幅上涨，建议关注采购时机</li>
          </ul>
        </div>
      </Card>
    </div>
  );

  // 渲染地区比价
  const renderRegionCompare = () => (
    <div className="space-y-4">
      <Card size="small" title="地区价格分布">
        <div className="space-y-3">
          {mockRegionCompare.map((item) => (
            <div key={item.region} className="flex items-center">
              <div className="w-20 text-sm">{item.region}</div>
              <div className="flex-1 mx-2 h-6 bg-gray-100 rounded relative">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${(item.avgPrice / 4000) * 100}%` }}
                />
                <span className="absolute right-2 top-1 text-xs text-gray-600">
                  ¥{item.avgPrice.toLocaleString()}
                </span>
              </div>
              <div className="w-16 text-right text-sm" style={{ color: item.vsAvg > 0 ? '#f5222d' : '#52c41a' }}>
                {item.vsAvg > 0 ? '+' : ''}{item.vsAvg}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card size="small" title="地区比价明细">
        <Table rowKey="region" columns={regionColumns} dataSource={mockRegionCompare} pagination={false} size="small" />
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card size="small" title="最低价地区">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">惠州市</div>
              <div className="text-xl">¥3,720</div>
              <div className="text-xs text-gray-400">较均值低1.3%</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="均价">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">广东省</div>
              <div className="text-xl">¥3,786</div>
              <div className="text-xs text-gray-400">样本数: 543</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="最高价地区">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">深圳市</div>
              <div className="text-xl">¥3,850</div>
              <div className="text-xs text-gray-400">较均值高2.1%</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染供应商比价
  const renderSupplierCompare = () => (
    <div className="space-y-4">
      <Card size="small" title="供应商价格对比">
        <Table rowKey="supplierName" columns={supplierColumns} dataSource={mockSupplierCompare} pagination={false} size="small" />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="推荐供应商">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium">东莞钢材市场</div>
                  <div className="text-xs text-gray-400">价格最优</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">¥3,780</div>
                  <div className="text-xs text-gray-400">较均值低0.3%</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">深圳钢材贸易有限公司</div>
                  <div className="text-xs text-gray-400">可靠性最高</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">¥3,850</div>
                  <div className="text-xs text-gray-400">报价45次</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="价格分布">
            <Row gutter={16}>
              <Col span={12}>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">价差</div>
                  <div className="text-xl font-bold">¥130</div>
                  <div className="text-xs text-gray-400">3.4%</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">供应商数</div>
                  <div className="text-xl font-bold">5</div>
                  <div className="text-xs text-gray-400">高可靠2家</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">价格分析</span>
          </Space>
          <Button icon={<ExportOutlined />}>导出报告</Button>
        </div>
      </Card>

      {/* 分析条件 */}
      <Card size="small" title="分析条件">
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">材料分类：</span>
            <Select value={materialCategory} onChange={setMaterialCategory} style={{ width: 120 }}>
              <Select.Option value="钢材">钢材</Select.Option>
              <Select.Option value="混凝土">混凝土</Select.Option>
              <Select.Option value="水泥">水泥</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">规格型号：</span>
            <Select value={specification} onChange={setSpecification} style={{ width: 160 }}>
              <Select.Option value="HRB400 Φ12">HRB400 Φ12</Select.Option>
              <Select.Option value="HRB400 Φ16">HRB400 Φ16</Select.Option>
              <Select.Option value="HRB400 Φ20">HRB400 Φ20</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">地区：</span>
            <Select defaultValue="广东省" style={{ width: 120 }}>
              <Select.Option value="广东省">广东省</Select.Option>
              <Select.Option value="全国">全国</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">时间：</span>
            <RangePicker picker="month" />
          </Col>
          <Col>
            <Button type="primary">分析</Button>
          </Col>
        </Row>
      </Card>

      {/* 分析类型切换 */}
      <Card size="small">
        <Space>
          <Button type={analysisType === 'trend' ? 'primary' : 'default'} onClick={() => setAnalysisType('trend')}>
            趋势分析
          </Button>
          <Button type={analysisType === 'region' ? 'primary' : 'default'} onClick={() => setAnalysisType('region')}>
            地区比价
          </Button>
          <Button type={analysisType === 'supplier' ? 'primary' : 'default'} onClick={() => setAnalysisType('supplier')}>
            供应商比价
          </Button>
        </Space>
      </Card>

      {/* 分析内容 */}
      {analysisType === 'trend' && renderTrendAnalysis()}
      {analysisType === 'region' && renderRegionCompare()}
      {analysisType === 'supplier' && renderSupplierCompare()}
    </div>
  );
};

export default MaterialPriceAnalysisPage;
