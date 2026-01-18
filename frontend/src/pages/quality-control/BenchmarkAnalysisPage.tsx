import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Table,
  Upload,
  Statistic,
  Steps,
  Select,
  Badge,
  Alert,
  Progress,
  Descriptions,
} from 'antd';
import {
  UploadOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  DatabaseOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// 标杆项目数据类型
interface BenchmarkCase {
  id: string;
  caseName: string;
  projectType: string;
  structureType: string;
  buildingArea: number;
  totalCost: number;
  unitCost: number;
  location: string;
  completionYear: number;
  matchScore: number;
}

// 指标对比数据类型
interface IndexComparison {
  id: string;
  indexName: string;
  indexType: string;
  targetValue: number;
  benchmarkAvg: number;
  benchmarkMin: number;
  benchmarkMax: number;
  deviation: number;
  unit: string;
  status: 'normal' | 'warning' | 'error';
}

// 模拟目标项目
const mockTargetProject = {
  projectName: '某住宅项目',
  projectType: '高层住宅',
  structureType: '剪力墙',
  buildingArea: 28400,
  totalCost: 66740000,
  unitCost: 2350,
  location: '浙江省杭州市',
  priceYear: 2025,
};

// 模拟标杆项目
const mockBenchmarks: BenchmarkCase[] = [
  { id: '1', caseName: '阳光花园住宅', projectType: '高层住宅', structureType: '剪力墙', buildingArea: 25600, totalCost: 47360000, unitCost: 1850, location: '浙江省杭州市', completionYear: 2024, matchScore: 95 },
  { id: '2', caseName: '翠苑小区', projectType: '高层住宅', structureType: '剪力墙', buildingArea: 31200, totalCost: 59904000, unitCost: 1920, location: '浙江省杭州市', completionYear: 2024, matchScore: 92 },
  { id: '3', caseName: '滨江府邸', projectType: '高层住宅', structureType: '剪力墙', buildingArea: 28800, totalCost: 64800000, unitCost: 2250, location: '浙江省杭州市', completionYear: 2025, matchScore: 98 },
  { id: '4', caseName: '钱塘新城', projectType: '高层住宅', structureType: '剪力墙', buildingArea: 32500, totalCost: 78000000, unitCost: 2400, location: '浙江省宁波市', completionYear: 2024, matchScore: 85 },
  { id: '5', caseName: '西溪雅苑', projectType: '高层住宅', structureType: '框剪', buildingArea: 26800, totalCost: 61640000, unitCost: 2300, location: '浙江省杭州市', completionYear: 2025, matchScore: 88 },
];

// 模拟指标对比
const mockComparisons: IndexComparison[] = [
  { id: '1', indexName: '单方造价', indexType: 'economic', targetValue: 2350, benchmarkAvg: 2280, benchmarkMin: 1850, benchmarkMax: 2780, deviation: 3.1, unit: '元/m²', status: 'warning' },
  { id: '2', indexName: '土建单方', indexType: 'economic', targetValue: 1450, benchmarkAvg: 1340, benchmarkMin: 1120, benchmarkMax: 1580, deviation: 8.2, unit: '元/m²', status: 'warning' },
  { id: '3', indexName: '安装单方', indexType: 'economic', targetValue: 420, benchmarkAvg: 502, benchmarkMin: 380, benchmarkMax: 620, deviation: -16.3, unit: '元/m²', status: 'warning' },
  { id: '4', indexName: '含钢量', indexType: 'technical', targetValue: 58, benchmarkAvg: 52, benchmarkMin: 45, benchmarkMax: 68, deviation: 11.5, unit: 'kg/m²', status: 'warning' },
  { id: '5', indexName: '含混凝土量', indexType: 'technical', targetValue: 0.52, benchmarkAvg: 0.48, benchmarkMin: 0.40, benchmarkMax: 0.55, deviation: 8.3, unit: 'm³/m²', status: 'normal' },
  { id: '6', indexName: '土建占比', indexType: 'structural', targetValue: 62, benchmarkAvg: 58, benchmarkMin: 52, benchmarkMax: 65, deviation: 4.0, unit: '%', status: 'normal' },
  { id: '7', indexName: '安装占比', indexType: 'structural', targetValue: 18, benchmarkAvg: 22, benchmarkMin: 18, benchmarkMax: 28, deviation: -4.0, unit: '%', status: 'warning' },
];

const BenchmarkAnalysisPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hasTarget, setHasTarget] = useState(false);
  const [hasBenchmarks, setHasBenchmarks] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('economic');

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: () => false,
  };

  // 获取偏离状态标签
  const getDeviationTag = (deviation: number, status: string) => {
    const icon = deviation > 0 ? <RiseOutlined /> : <FallOutlined />;
    const color = status === 'error' ? 'red' : status === 'warning' ? 'orange' : 'green';
    return (
      <Tag color={color} icon={icon}>
        {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
      </Tag>
    );
  };

  // 模拟上传目标项目
  const handleUploadTarget = () => {
    setHasTarget(true);
    setStep(1);
  };

  // 模拟匹配标杆
  const handleMatchBenchmarks = () => {
    setHasBenchmarks(true);
    setStep(2);
  };

  // 模拟执行分析
  const handleRunAnalysis = () => {
    setAnalysisComplete(true);
    setStep(3);
  };

  // 标杆项目列定义
  const benchmarkColumns: ColumnsType<BenchmarkCase> = [
    { title: '项目名称', dataIndex: 'caseName', key: 'caseName', render: (v) => <span className="font-medium">{v}</span> },
    { title: '类型', dataIndex: 'projectType', key: 'projectType', width: 100 },
    { title: '结构', dataIndex: 'structureType', key: 'structureType', width: 80 },
    { title: '面积(m²)', dataIndex: 'buildingArea', key: 'buildingArea', width: 100, align: 'right', render: (v) => v.toLocaleString() },
    { title: '单方(元/m²)', dataIndex: 'unitCost', key: 'unitCost', width: 110, align: 'right', render: (v) => v.toLocaleString() },
    { title: '地区', dataIndex: 'location', key: 'location', width: 120 },
    { title: '年份', dataIndex: 'completionYear', key: 'completionYear', width: 60 },
    { title: '匹配度', dataIndex: 'matchScore', key: 'matchScore', width: 80, render: (v) => <Progress percent={v} size="small" showInfo={false} /> },
  ];

  // 指标对比列定义
  const comparisonColumns: ColumnsType<IndexComparison> = [
    { title: '指标', dataIndex: 'indexName', key: 'indexName', width: 100, render: (v) => <span className="font-medium">{v}</span> },
    { title: '目标值', key: 'targetValue', width: 100, align: 'right', render: (_, r) => `${r.targetValue}${r.unit}` },
    { title: '标杆均值', key: 'benchmarkAvg', width: 100, align: 'right', render: (_, r) => `${r.benchmarkAvg}${r.unit}` },
    { title: '标杆范围', key: 'range', width: 120, align: 'center', render: (_, r) => <span className="text-gray-400">{r.benchmarkMin}~{r.benchmarkMax}</span> },
    { title: '偏离', dataIndex: 'deviation', key: 'deviation', width: 100, align: 'center', render: (v, r) => getDeviationTag(v, r.status) },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === 'normal' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <WarningOutlined style={{ color: '#fa8c16' }} /> },
  ];

  // 渲染步骤1：上传目标项目
  const renderStep1 = () => (
    <Card>
      <div className="text-center py-12">
        <FileTextOutlined style={{ fontSize: 64, color: '#13c2c2' }} />
        <div className="text-lg mt-4">上传目标项目文件</div>
        <div className="text-gray-400 mb-4">待对标分析的造价文件</div>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} size="large" onClick={handleUploadTarget}>
            选择文件
          </Button>
        </Upload>
      </div>
    </Card>
  );

  // 渲染步骤2：匹配标杆
  const renderStep2 = () => (
    <div className="space-y-4">
      <Card size="small" title="目标项目">
        <Descriptions size="small" column={4}>
          <Descriptions.Item label="项目名称">{mockTargetProject.projectName}</Descriptions.Item>
          <Descriptions.Item label="项目类型">{mockTargetProject.projectType}</Descriptions.Item>
          <Descriptions.Item label="结构形式">{mockTargetProject.structureType}</Descriptions.Item>
          <Descriptions.Item label="建筑面积">{mockTargetProject.buildingArea.toLocaleString()} m²</Descriptions.Item>
          <Descriptions.Item label="总造价">¥{(mockTargetProject.totalCost / 10000).toFixed(0)}万</Descriptions.Item>
          <Descriptions.Item label="单方造价">{mockTargetProject.unitCost} 元/m²</Descriptions.Item>
          <Descriptions.Item label="地区">{mockTargetProject.location}</Descriptions.Item>
          <Descriptions.Item label="价格年份">{mockTargetProject.priceYear}年</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="标杆筛选条件">
        <Row gutter={16}>
          <Col span={4}>
            <div className="text-xs text-gray-400 mb-1">项目类型</div>
            <Select defaultValue="高层住宅" style={{ width: '100%' }} size="small" />
          </Col>
          <Col span={4}>
            <div className="text-xs text-gray-400 mb-1">结构形式</div>
            <Select defaultValue="剪力墙" style={{ width: '100%' }} size="small" />
          </Col>
          <Col span={4}>
            <div className="text-xs text-gray-400 mb-1">面积范围</div>
            <Select defaultValue="2-4万m²" style={{ width: '100%' }} size="small" />
          </Col>
          <Col span={4}>
            <div className="text-xs text-gray-400 mb-1">地区</div>
            <Select defaultValue="浙江省" style={{ width: '100%' }} size="small" />
          </Col>
          <Col span={4}>
            <div className="text-xs text-gray-400 mb-1">年份范围</div>
            <Select defaultValue="近3年" style={{ width: '100%' }} size="small" />
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleMatchBenchmarks}>匹配标杆</Button>
          </Col>
        </Row>
      </Card>

      {hasBenchmarks && (
        <>
          <Card size="small" title={`匹配到 ${mockBenchmarks.length} 个标杆项目`}>
            <Table
              rowKey="id"
              columns={benchmarkColumns}
              dataSource={mockBenchmarks}
              pagination={false}
              size="small"
              rowSelection={{ type: 'checkbox', defaultSelectedRowKeys: mockBenchmarks.map(b => b.id) }}
            />
          </Card>
          <div className="text-center">
            <Button type="primary" size="large" onClick={handleRunAnalysis}>
              开始对标分析
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // 渲染分析结果
  const renderResult = () => {
    const ranking = 3;
    const totalBenchmarks = mockBenchmarks.length;

    return (
      <div className="space-y-4">
        {/* 项目信息 */}
        <Card size="small">
          <div className="flex items-center justify-between">
            <Space>
              <BarChartOutlined style={{ fontSize: 24, color: '#13c2c2' }} />
              <div>
                <div className="font-medium">{mockTargetProject.projectName} - 对标分析</div>
                <div className="text-xs text-gray-400">
                  对标项目：{totalBenchmarks}个 | 分析时间：2026-01-18
                </div>
              </div>
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />}>重新分析</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </div>
        </Card>

        {/* 核心指标概览 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="单方造价" value={mockTargetProject.unitCost} suffix="元/m²" />
              <div className="text-xs mt-1">
                <span className="text-orange-500">+3.1%</span> vs 标杆均值
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="含钢量" value={58} suffix="kg/m²" />
              <div className="text-xs mt-1">
                <span className="text-orange-500">+11.5%</span> vs 标杆均值
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="土建占比" value={62} suffix="%" />
              <div className="text-xs mt-1">
                <span className="text-orange-500">+4%</span> vs 标杆均值
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="排名" value={`${ranking}/${totalBenchmarks}`} />
              <div className="text-xs mt-1 text-gray-400">
                前{((ranking / totalBenchmarks) * 100).toFixed(0)}%
              </div>
            </Card>
          </Col>
        </Row>

        {/* 问题提示 */}
        <Alert
          type="warning"
          showIcon
          message="单方造价略高于标杆均值3.1%，主要原因：土建单方偏高8.2%，含钢量偏高11.5%"
        />

        {/* 指标对比详情 */}
        <Card
          size="small"
          tabList={[
            { key: 'economic', tab: '经济指标' },
            { key: 'technical', tab: '技术指标' },
            { key: 'structural', tab: '结构指标' },
          ]}
          activeTabKey={activeTab}
          onTabChange={setActiveTab}
        >
          <Table
            rowKey="id"
            columns={comparisonColumns}
            dataSource={mockComparisons.filter(c => c.indexType === activeTab)}
            pagination={false}
            size="small"
          />
        </Card>

        {/* 单方造价分布 */}
        <Card size="small" title="单方造价分布">
          <div className="space-y-2">
            {mockBenchmarks.map((b, idx) => (
              <div key={b.id} className="flex items-center gap-2">
                <span className="w-24 text-sm truncate">{b.caseName}</span>
                <Progress
                  percent={(b.unitCost / 2800) * 100}
                  showInfo={false}
                  strokeColor={b.id === '3' ? '#13c2c2' : '#1890ff'}
                  className="flex-1"
                />
                <span className="w-20 text-right text-sm">{b.unitCost}元/m²</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-cyan-50 p-1 rounded">
              <span className="w-24 text-sm font-medium">★ 目标项目</span>
              <Progress
                percent={(mockTargetProject.unitCost / 2800) * 100}
                showInfo={false}
                strokeColor="#13c2c2"
                className="flex-1"
              />
              <span className="w-20 text-right text-sm font-medium">{mockTargetProject.unitCost}元/m²</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            标杆范围：1,850~2,400元/m² | 均值：2,144元/m² | 目标项目排名：第3位
          </div>
        </Card>

        {/* 结论与建议 */}
        <Card size="small" title="分析结论与优化建议">
          <Row gutter={16}>
            <Col span={12}>
              <div className="font-medium mb-2">📊 分析结论</div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>单方造价2,350元/m²，高于标杆均值3.1%</li>
                <li>土建单方偏高8.2%是造价偏高的主要原因</li>
                <li>含钢量58kg/m²偏高11.5%，影响约77万元</li>
                <li>安装占比18%偏低，需核实是否有漏项</li>
              </ul>
            </Col>
            <Col span={12}>
              <div className="font-medium mb-2">💡 优化建议</div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>与结构设计沟通，优化结构方案降低含钢量</li>
                <li>核实安装工程内容完整性，特别是暖通空调</li>
                <li>检查混凝土工程单价是否偏高</li>
                <li>对比标杆项目的组价方式，寻找优化空间</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">对标分析</span>
            <span className="text-gray-400 ml-2">多项目横向对比 · 指标分析 · 优化建议</span>
          </div>
          <Space>
            <Tag icon={<DatabaseOutlined />} color="cyan">企业案例库</Tag>
          </Space>
        </div>
      </Card>

      {/* 步骤条 */}
      {!analysisComplete && (
        <Card size="small">
          <Steps
            current={step}
            items={[
              { title: '上传目标项目', description: '待分析文件' },
              { title: '匹配标杆', description: '筛选对标项目' },
              { title: '执行分析', description: '多维度对标' },
              { title: '查看结果', description: '结论建议' },
            ]}
          />
        </Card>
      )}

      {/* 内容区 */}
      {!hasTarget && renderStep1()}
      {hasTarget && !analysisComplete && renderStep2()}
      {analysisComplete && renderResult()}
    </div>
  );
};

export default BenchmarkAnalysisPage;
