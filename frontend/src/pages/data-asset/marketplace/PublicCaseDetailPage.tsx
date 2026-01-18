import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Tabs,
  Table,
  Progress,
  Statistic,
} from 'antd';
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  BarChartOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

// 案例详情数据
const mockCaseDetail = {
  id: 'PC202406001',
  projectTitle: '某市级办公楼项目',
  projectLocation: '广东省深圳市',
  provinceName: '广东省',
  cityName: '深圳市',
  buildYear: 2022,
  completionYear: 2024,
  functionCategory: '办公建筑',
  functionTag: '甲级办公',
  functionTagCode: 'BG-01-001',
  scaleLevel: '5000-10000㎡',
  scaleLevelCode: 'A-04',
  buildingArea: 8500,
  floorAbove: 12,
  floorBelow: 2,
  structureType: '框架剪力墙',
  structureForm: '现浇混凝土',
  foundationType: '桩基础',
  pricingStage: 'settlement',
  priceBasisDate: '2024-03-01',
  pricePeriod: '2024年3月',
  quotaVersion: '广东2018',
  totalCost: 3612.5,
  unitCost: 4250,
  civilUnitCost: 2550,
  installUnitCost: 850,
  decorUnitCost: 850,
  laborRatio: 18,
  materialRatio: 62,
  machineRatio: 20,
  sourceType: 'platform',
  qualityLevel: 'A',
  dataCompleteness: 92.5,
  qualityScore: 88,
  publishTime: '2024-06-15',
  accessLevel: 'public',
  viewCount: 1256,
  collectCount: 89,
};

// 指标数据
const mockIndexes = [
  { indexCode: 'IDX-EC-001', indexName: '综合单方造价', indexValue: 4250, indexUnit: '元/㎡', industryAvg: 3918, deviation: 8.5, percentileRank: 25 },
  { indexCode: 'IDX-EC-002', indexName: '土建单方造价', indexValue: 2550, indexUnit: '元/㎡', industryAvg: 2428, deviation: 5.0, percentileRank: 30 },
  { indexCode: 'IDX-EC-003', indexName: '安装单方造价', indexValue: 850, indexUnit: '元/㎡', industryAvg: 862, deviation: -1.4, percentileRank: 55 },
  { indexCode: 'IDX-QT-001', indexName: '钢筋含量', indexValue: 62.5, indexUnit: 'kg/㎡', industryAvg: 58.2, deviation: 7.4, percentileRank: 20 },
  { indexCode: 'IDX-QT-002', indexName: '混凝土含量', indexValue: 0.45, indexUnit: 'm³/㎡', industryAvg: 0.42, deviation: 7.1, percentileRank: 25 },
  { indexCode: 'IDX-RS-001', indexName: '人工费占比', indexValue: 18, indexUnit: '%', industryAvg: 17.5, deviation: 0.5, percentileRank: 40 },
  { indexCode: 'IDX-RS-002', indexName: '材料费占比', indexValue: 62, indexUnit: '%', industryAvg: 63.2, deviation: -1.2, percentileRank: 45 },
];

// 费用构成数据
const mockCostBreakdown = [
  { costType: 'civil', costName: '土建工程', costAmount: 2167.5, unitCost: 2550, costRatio: 60, laborAmount: 390.15, materialAmount: 1343.85, machineAmount: 433.5 },
  { costType: 'install', costName: '安装工程', costAmount: 722.5, unitCost: 850, costRatio: 20, laborAmount: 130.05, materialAmount: 447.95, machineAmount: 144.5 },
  { costType: 'decor', costName: '装饰工程', costAmount: 722.5, unitCost: 850, costRatio: 20, laborAmount: 130.05, materialAmount: 447.95, machineAmount: 144.5 },
];

const PublicCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [isCollected, setIsCollected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const detail = mockCaseDetail;

  // 获取来源类型标签
  const getSourceTag = (sourceType: string) => {
    const sourceMap: Record<string, { color: string; text: string }> = {
      platform: { color: 'blue', text: '平台案例' },
      government: { color: 'green', text: '政府公开' },
      industry: { color: 'orange', text: '行业数据' },
    };
    const source = sourceMap[sourceType] || { color: 'default', text: sourceType };
    return <Tag color={source.color}>{source.text}</Tag>;
  };

  // 获取计价阶段文本
  const getPricingStageText = (stage: string) => {
    const stageMap: Record<string, string> = {
      estimate: '概算',
      budget: '预算',
      settlement: '结算',
      final: '决算',
    };
    return stageMap[stage] || stage;
  };

  // 指标对比列定义
  const indexColumns: ColumnsType<typeof mockIndexes[0]> = [
    { title: '指标名称', dataIndex: 'indexName', key: 'indexName', width: 140 },
    {
      title: '本案例',
      dataIndex: 'indexValue',
      key: 'indexValue',
      width: 100,
      align: 'right',
      render: (v, record) => <span className="font-medium">{v}{record.indexUnit === '%' ? '%' : ''}</span>,
    },
    {
      title: '行业均值',
      dataIndex: 'industryAvg',
      key: 'industryAvg',
      width: 100,
      align: 'right',
    },
    {
      title: '偏离度',
      dataIndex: 'deviation',
      key: 'deviation',
      width: 80,
      align: 'center',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : 'text-green-500'}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '分位排名',
      dataIndex: 'percentileRank',
      key: 'percentileRank',
      width: 120,
      render: (v) => (
        <div className="flex items-center gap-2">
          <Progress percent={100 - v} size="small" showInfo={false} style={{ width: 60 }} />
          <span className="text-xs">前{v}%</span>
        </div>
      ),
    },
  ];

  // 费用构成列定义
  const costColumns: ColumnsType<typeof mockCostBreakdown[0]> = [
    { title: '费用项目', dataIndex: 'costName', key: 'costName', width: 120 },
    {
      title: '金额(万元)',
      dataIndex: 'costAmount',
      key: 'costAmount',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '单方(元/㎡)',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '占比',
      dataIndex: 'costRatio',
      key: 'costRatio',
      width: 100,
      render: (v) => (
        <div className="flex items-center gap-2">
          <Progress percent={v} size="small" showInfo={false} style={{ width: 60 }} />
          <span>{v}%</span>
        </div>
      ),
    },
    {
      title: '人工费',
      dataIndex: 'laborAmount',
      key: 'laborAmount',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '材料费',
      dataIndex: 'materialAmount',
      key: 'materialAmount',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '机械费',
      dataIndex: 'machineAmount',
      key: 'machineAmount',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
  ];

  // 项目概况Tab
  const OverviewTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="基本信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="项目名称">{detail.projectTitle}</Descriptions.Item>
              <Descriptions.Item label="项目地点">
                <Space>
                  <EnvironmentOutlined />
                  {detail.projectLocation}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="建设年份">{detail.buildYear}年</Descriptions.Item>
              <Descriptions.Item label="竣工年份">{detail.completionYear}年</Descriptions.Item>
              <Descriptions.Item label="建筑面积">{detail.buildingArea.toLocaleString()} ㎡</Descriptions.Item>
              <Descriptions.Item label="地上/地下">{detail.floorAbove}层 / {detail.floorBelow}层</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="标签分类">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="功能标签">
                <Tag color="cyan">{detail.functionCategory}-{detail.functionTag}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="标签编码">{detail.functionTagCode}</Descriptions.Item>
              <Descriptions.Item label="规模档">{detail.scaleLevel}</Descriptions.Item>
              <Descriptions.Item label="规模编码">{detail.scaleLevelCode}</Descriptions.Item>
              <Descriptions.Item label="结构类型">{detail.structureType}</Descriptions.Item>
              <Descriptions.Item label="基础类型">{detail.foundationType}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="计价信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="计价阶段">
                <Tag color="blue">{getPricingStageText(detail.pricingStage)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="计价基准日">
                <Space>
                  <CalendarOutlined />
                  {detail.priceBasisDate}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="材价期">{detail.pricePeriod}</Descriptions.Item>
              <Descriptions.Item label="定额版本">{detail.quotaVersion}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="数据来源">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="来源类型">{getSourceTag(detail.sourceType)}</Descriptions.Item>
              <Descriptions.Item label="数据质量">
                <Tag color="green">{detail.qualityLevel}级</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="完整度">
                <Progress percent={detail.dataCompleteness} size="small" style={{ width: 120 }} />
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">{detail.publishTime}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 造价信息Tab
  const CostTab = () => (
    <div className="space-y-4">
      <Card size="small" title="造价汇总">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总造价"
              value={detail.totalCost}
              precision={2}
              suffix="万元"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="综合单方造价"
              value={detail.unitCost}
              prefix="¥"
              suffix="元/㎡"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic title="土建单方" value={detail.civilUnitCost} suffix="元/㎡" />
          </Col>
          <Col span={4}>
            <Statistic title="安装单方" value={detail.installUnitCost} suffix="元/㎡" />
          </Col>
          <Col span={4}>
            <Statistic title="装饰单方" value={detail.decorUnitCost} suffix="元/㎡" />
          </Col>
        </Row>
      </Card>

      <Card size="small" title="费用构成">
        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500">人工费占比</div>
              <Progress type="circle" percent={detail.laborRatio} size={80} strokeColor="#1890ff" />
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500">材料费占比</div>
              <Progress type="circle" percent={detail.materialRatio} size={80} strokeColor="#52c41a" />
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-sm text-gray-500">机械费占比</div>
              <Progress type="circle" percent={detail.machineRatio} size={80} strokeColor="#faad14" />
            </div>
          </Col>
        </Row>
        <Table
          rowKey="costType"
          columns={costColumns}
          dataSource={mockCostBreakdown}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // 指标数据Tab
  const IndexTab = () => (
    <div className="space-y-4">
      <Card size="small" title="主要指标">
        <Table
          rowKey="indexCode"
          columns={indexColumns}
          dataSource={mockIndexes}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // 行业对比Tab
  const CompareTab = () => (
    <div className="space-y-4">
      <Card size="small" title="对标维度">
        <Descriptions size="small" column={4}>
          <Descriptions.Item label="功能标签">{detail.functionCategory}-{detail.functionTag}</Descriptions.Item>
          <Descriptions.Item label="规模档">{detail.scaleLevel}</Descriptions.Item>
          <Descriptions.Item label="地区">{detail.provinceName}</Descriptions.Item>
          <Descriptions.Item label="年份">2024年</Descriptions.Item>
        </Descriptions>
        <div className="mt-2 text-sm text-gray-500">行业样本：156个案例</div>
      </Card>

      <Card size="small" title="指标对比">
        <Table
          rowKey="indexCode"
          columns={indexColumns}
          dataSource={mockIndexes}
          pagination={false}
          size="small"
        />
      </Card>

      <Card size="small" title="对标结论">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>本案例综合单方高于行业均值8.5%，主要由于装饰标准较高</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>钢筋含量偏高7.4%，可能与结构设计相关</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>费用构成基本合理，人材机占比与行业水平接近</span>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Button type="primary" icon={<DownloadOutlined />}>导出对标报告</Button>
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    { key: 'overview', label: '项目概况', children: <OverviewTab /> },
    { key: 'cost', label: '造价信息', children: <CostTab /> },
    { key: 'index', label: '指标数据', children: <IndexTab /> },
    { key: 'compare', label: '行业对比', children: <CompareTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span className="text-lg font-medium">{detail.projectTitle}</span>
            <Tag color="green">{detail.qualityLevel}级</Tag>
            {isCollected ? (
              <StarFilled style={{ color: '#faad14', fontSize: 18 }} onClick={() => setIsCollected(false)} />
            ) : (
              <StarOutlined style={{ fontSize: 18 }} onClick={() => setIsCollected(true)} />
            )}
          </Space>
          <Space>
            <Button icon={<BarChartOutlined />}>对比分析</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <Space split={<span className="text-gray-300">|</span>}>
            <span><EnvironmentOutlined /> {detail.projectLocation}</span>
            <span>{detail.functionCategory}-{detail.functionTag}</span>
            <span>{detail.buildingArea.toLocaleString()}㎡</span>
            <span>{getPricingStageText(detail.pricingStage)}</span>
            <span>{getSourceTag(detail.sourceType)}</span>
          </Space>
        </div>
      </Card>

      {/* 造价概览 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">综合单方造价</div>
              <div className="text-2xl font-bold text-blue-600">¥{detail.unitCost.toLocaleString()}</div>
              <div className="text-xs text-gray-400">元/㎡</div>
              <div className="text-xs text-red-500">↑行业+8.5%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="text-center">
              <div className="text-sm text-gray-500">土建单方</div>
              <div className="text-lg font-medium">¥{detail.civilUnitCost}</div>
              <div className="text-xs text-gray-400">60%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="text-center">
              <div className="text-sm text-gray-500">安装单方</div>
              <div className="text-lg font-medium">¥{detail.installUnitCost}</div>
              <div className="text-xs text-gray-400">20%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="text-center">
              <div className="text-sm text-gray-500">装饰单方</div>
              <div className="text-lg font-medium">¥{detail.decorUnitCost}</div>
              <div className="text-xs text-gray-400">20%</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <SafetyCertificateOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div className="text-sm text-gray-500 mt-1">数据完整度</div>
              <Progress percent={detail.dataCompleteness} size="small" style={{ width: 100 }} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 详情内容 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </div>
  );
};

export default PublicCaseDetailPage;
