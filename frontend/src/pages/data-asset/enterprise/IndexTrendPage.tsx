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
} from 'antd';
import {
  ArrowLeftOutlined,
  ExportOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

// 趋势数据类型
interface TrendRecord {
  period: string;
  recommendValue: number;
  avgValue: number;
  qoqChange: number;
  yoyChange: number;
  sampleCount: number;
}

// 模拟趋势数据
const mockTrendData: TrendRecord[] = [
  { period: '2025Q3', recommendValue: 4150, avgValue: 4200, qoqChange: 3.8, yoyChange: 12.2, sampleCount: 42 },
  { period: '2025Q2', recommendValue: 4000, avgValue: 4050, qoqChange: 2.6, yoyChange: 10.5, sampleCount: 38 },
  { period: '2025Q1', recommendValue: 3900, avgValue: 3950, qoqChange: 2.9, yoyChange: 9.2, sampleCount: 35 },
  { period: '2024Q4', recommendValue: 3790, avgValue: 3840, qoqChange: 2.4, yoyChange: 8.0, sampleCount: 40 },
  { period: '2024Q3', recommendValue: 3700, avgValue: 3750, qoqChange: 2.8, yoyChange: 6.9, sampleCount: 36 },
  { period: '2024Q2', recommendValue: 3600, avgValue: 3650, qoqChange: 2.3, yoyChange: 5.8, sampleCount: 32 },
  { period: '2024Q1', recommendValue: 3520, avgValue: 3570, qoqChange: 2.0, yoyChange: 5.2, sampleCount: 30 },
  { period: '2023Q4', recommendValue: 3450, avgValue: 3500, qoqChange: 1.8, yoyChange: 4.5, sampleCount: 28 },
  { period: '2023Q3', recommendValue: 3390, avgValue: 3440, qoqChange: 1.5, yoyChange: 4.0, sampleCount: 25 },
  { period: '2023Q2', recommendValue: 3340, avgValue: 3390, qoqChange: 1.2, yoyChange: 3.5, sampleCount: 22 },
  { period: '2023Q1', recommendValue: 3300, avgValue: 3350, qoqChange: 1.0, yoyChange: 3.0, sampleCount: 20 },
];

const IndexTrendPage: React.FC = () => {
  const navigate = useNavigate();
  const [indexCode, setIndexCode] = useState<string>('IDX-EC-001');
  const [functionTag, setFunctionTag] = useState<string>('办公建筑');
  const [scaleLevel, setScaleLevel] = useState<string>('5K-1W');
  const [province, setProvince] = useState<string>('广东省');

  // 趋势表格列定义
  const trendColumns: ColumnsType<TrendRecord> = [
    {
      title: '时间段',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: '推荐值',
      dataIndex: 'recommendValue',
      key: 'recommendValue',
      width: 100,
      align: 'right',
      render: (val) => <span className="font-medium">{val.toLocaleString()}</span>,
    },
    {
      title: '环比变化',
      dataIndex: 'qoqChange',
      key: 'qoqChange',
      width: 100,
      align: 'right',
      render: (val) => (
        <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: '同比变化',
      dataIndex: 'yoyChange',
      key: 'yoyChange',
      width: 100,
      align: 'right',
      render: (val) => (
        <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: '样本数',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 80,
      align: 'center',
    },
  ];

  // 简单的趋势图渲染
  const renderTrendChart = () => {
    const maxValue = Math.max(...mockTrendData.map((d) => d.recommendValue));
    const minValue = Math.min(...mockTrendData.map((d) => d.recommendValue));
    const range = maxValue - minValue;

    return (
      <div className="h-64 flex items-end justify-between px-4 pb-8 pt-4 bg-gray-50 rounded relative">
        {/* Y轴标签 */}
        <div className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
          <span>{maxValue.toLocaleString()}</span>
          <span>{Math.round((maxValue + minValue) / 2).toLocaleString()}</span>
          <span>{minValue.toLocaleString()}</span>
        </div>

        {/* 数据点 */}
        <div className="flex-1 ml-12 flex items-end justify-between h-full">
          {[...mockTrendData].reverse().map((item, index) => {
            const height = ((item.recommendValue - minValue) / range) * 100 + 10;
            return (
              <div key={item.period} className="flex flex-col items-center">
                <div
                  className="w-8 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                  title={`${item.period}: ${item.recommendValue.toLocaleString()}`}
                />
                <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left w-12">
                  {item.period}
                </div>
              </div>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          ── 推荐值 &nbsp; ─ ─ 均值 &nbsp; ░░ 置信区间
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">指标趋势分析</span>
          </Space>
          <Space>
            <Button icon={<ExportOutlined />}>导出报告</Button>
            <Button type="primary" icon={<SaveOutlined />}>保存</Button>
          </Space>
        </div>
      </Card>

      {/* 分析条件 */}
      <Card size="small" title="分析条件">
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">指标：</span>
            <Select value={indexCode} onChange={setIndexCode} style={{ width: 160 }}>
              <Select.Option value="IDX-EC-001">综合单方造价</Select.Option>
              <Select.Option value="IDX-EC-002">土建单方造价</Select.Option>
              <Select.Option value="IDX-QT-001">钢筋含量</Select.Option>
              <Select.Option value="IDX-QT-002">混凝土含量</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">功能：</span>
            <Select value={functionTag} onChange={setFunctionTag} style={{ width: 120 }}>
              <Select.Option value="办公建筑">办公建筑</Select.Option>
              <Select.Option value="商业建筑">商业建筑</Select.Option>
              <Select.Option value="教学建筑">教学建筑</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">规模：</span>
            <Select value={scaleLevel} onChange={setScaleLevel} style={{ width: 140 }}>
              <Select.Option value="5K-1W">5000-10000㎡</Select.Option>
              <Select.Option value="1W-2W">10000-20000㎡</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">地区：</span>
            <Select value={province} onChange={setProvince} style={{ width: 100 }}>
              <Select.Option value="广东省">广东省</Select.Option>
              <Select.Option value="全国">全国</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">时间：</span>
            <RangePicker picker="quarter" />
          </Col>
          <Col>
            <Button type="primary">分析</Button>
          </Col>
        </Row>
      </Card>

      {/* 趋势图 */}
      <Card
        size="small"
        title={`趋势图：${functionTag} | ${scaleLevel} | ${province} | 综合单方造价`}
      >
        {renderTrendChart()}
      </Card>

      {/* 趋势统计 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card size="small" title="趋势统计">
            <Table
              rowKey="period"
              columns={trendColumns}
              dataSource={mockTrendData}
              pagination={false}
              scroll={{ y: 300 }}
              size="small"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="趋势洞察">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm text-gray-500">近3年年均增长率</div>
                <div className="text-2xl font-bold text-blue-600">8.5%</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="text-sm text-gray-500">2025年增速</div>
                <div className="text-2xl font-bold text-orange-600">10.8%</div>
                <div className="text-xs text-gray-400">高于历史平均</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm text-gray-500">预测2025Q4</div>
                <div className="text-2xl font-bold text-green-600">约4,280元/㎡</div>
                <div className="text-xs text-gray-400">±150</div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <div className="font-medium mb-2">分析说明：</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>综合单方造价持续上涨，主要受材料价格影响</li>
                  <li>2025年增速明显高于往年，需关注成本控制</li>
                  <li>预计Q4将继续保持上涨趋势</li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 对比分析 */}
      <Card size="small" title="跨维度对比">
        <Row gutter={16}>
          <Col span={12}>
            <div className="font-medium mb-2">跨地区对比（2025Q3）</div>
            <div className="space-y-2">
              {[
                { name: '广东省', value: 4150, ratio: 100 },
                { name: '北京市', value: 4580, ratio: 110 },
                { name: '上海市', value: 4420, ratio: 106 },
                { name: '浙江省', value: 3980, ratio: 96 },
                { name: '江苏省', value: 3850, ratio: 93 },
              ].map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-16 text-sm">{item.name}</div>
                  <div className="flex-1 mx-2">
                    <div
                      className="h-5 bg-blue-500 rounded"
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm">{item.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Col>
          <Col span={12}>
            <div className="font-medium mb-2">跨规模对比（2025Q3 | 广东省）</div>
            <div className="space-y-2">
              {[
                { name: '<3000㎡', value: 4350, ratio: 100 },
                { name: '3K-5K㎡', value: 4150, ratio: 95 },
                { name: '5K-1W㎡', value: 3950, ratio: 91 },
                { name: '1W-2W㎡', value: 3800, ratio: 87 },
                { name: '2W-5W㎡', value: 3650, ratio: 84 },
              ].map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-16 text-sm">{item.name}</div>
                  <div className="flex-1 mx-2">
                    <div
                      className="h-5 bg-green-500 rounded"
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm">{item.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default IndexTrendPage;
