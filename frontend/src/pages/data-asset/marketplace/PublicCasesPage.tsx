import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Statistic,
  Radio,
  Checkbox,
  DatePicker,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  BarChartOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { RangePicker } = DatePicker;

// 公共案例数据类型
interface PublicCase {
  id: string;
  projectTitle: string;
  projectLocation: string;
  provinceName: string;
  cityName: string;
  functionCategory: string;
  functionTag: string;
  functionTagCode: string;
  scaleLevel: string;
  buildingArea: number;
  structureType: string;
  pricingStage: string;
  unitCost: number;
  civilUnitCost: number;
  installUnitCost: number;
  laborRatio: number;
  materialRatio: number;
  machineRatio: number;
  sourceType: string;
  qualityLevel: string;
  dataCompleteness: number;
  publishTime: string;
  accessLevel: string;
  viewCount: number;
  collectCount: number;
  isCollected: boolean;
  industryAvg: number;
  deviation: number;
}

// 模拟公共案例数据
const mockPublicCases: PublicCase[] = [
  {
    id: 'PC202406001',
    projectTitle: '某市级办公楼项目',
    projectLocation: '广东省深圳市',
    provinceName: '广东省',
    cityName: '深圳市',
    functionCategory: '办公建筑',
    functionTag: '甲级办公',
    functionTagCode: 'BG-01',
    scaleLevel: '5000-10000㎡',
    buildingArea: 8500,
    structureType: '框架剪力墙',
    pricingStage: 'settlement',
    unitCost: 4250,
    civilUnitCost: 2550,
    installUnitCost: 850,
    laborRatio: 18,
    materialRatio: 62,
    machineRatio: 20,
    sourceType: 'platform',
    qualityLevel: 'A',
    dataCompleteness: 92.5,
    publishTime: '2024-06-15',
    accessLevel: 'public',
    viewCount: 1256,
    collectCount: 89,
    isCollected: false,
    industryAvg: 3918,
    deviation: 8.5,
  },
  {
    id: 'PC202406002',
    projectTitle: '某区行政中心项目',
    projectLocation: '广东省广州市',
    provinceName: '广东省',
    cityName: '广州市',
    functionCategory: '办公建筑',
    functionTag: '行政办公',
    functionTagCode: 'BG-02',
    scaleLevel: '10000-20000㎡',
    buildingArea: 15200,
    structureType: '框架剪力墙',
    pricingStage: 'settlement',
    unitCost: 3680,
    civilUnitCost: 2208,
    installUnitCost: 736,
    laborRatio: 16,
    materialRatio: 65,
    machineRatio: 19,
    sourceType: 'government',
    qualityLevel: 'A',
    dataCompleteness: 88.0,
    publishTime: '2024-05-20',
    accessLevel: 'public',
    viewCount: 2340,
    collectCount: 156,
    isCollected: true,
    industryAvg: 3918,
    deviation: -6.0,
  },
  {
    id: 'PC202406003',
    projectTitle: '某科技园办公楼',
    projectLocation: '广东省东莞市',
    provinceName: '广东省',
    cityName: '东莞市',
    functionCategory: '办公建筑',
    functionTag: '产业园办公',
    functionTagCode: 'BG-03',
    scaleLevel: '20000-50000㎡',
    buildingArea: 22800,
    structureType: '框架结构',
    pricingStage: 'budget',
    unitCost: 3950,
    civilUnitCost: 2370,
    installUnitCost: 790,
    laborRatio: 17,
    materialRatio: 63,
    machineRatio: 20,
    sourceType: 'platform',
    qualityLevel: 'B',
    dataCompleteness: 82.0,
    publishTime: '2024-06-01',
    accessLevel: 'vip',
    viewCount: 856,
    collectCount: 45,
    isCollected: false,
    industryAvg: 3918,
    deviation: 0.8,
  },
  {
    id: 'PC202406004',
    projectTitle: '某三甲医院门诊楼',
    projectLocation: '广东省深圳市',
    provinceName: '广东省',
    cityName: '深圳市',
    functionCategory: '医疗卫生',
    functionTag: '门诊',
    functionTagCode: 'YI-01',
    scaleLevel: '10000-20000㎡',
    buildingArea: 18500,
    structureType: '框架剪力墙',
    pricingStage: 'settlement',
    unitCost: 5680,
    civilUnitCost: 3408,
    installUnitCost: 1136,
    laborRatio: 15,
    materialRatio: 60,
    machineRatio: 25,
    sourceType: 'platform',
    qualityLevel: 'A',
    dataCompleteness: 95.0,
    publishTime: '2024-04-10',
    accessLevel: 'member',
    viewCount: 3200,
    collectCount: 280,
    isCollected: true,
    industryAvg: 5200,
    deviation: 9.2,
  },
  {
    id: 'PC202406005',
    projectTitle: '某区中学教学楼',
    projectLocation: '广东省广州市',
    provinceName: '广东省',
    cityName: '广州市',
    functionCategory: '教育',
    functionTag: '教学楼',
    functionTagCode: 'JY-01',
    scaleLevel: '5000-10000㎡',
    buildingArea: 6800,
    structureType: '框架结构',
    pricingStage: 'settlement',
    unitCost: 3250,
    civilUnitCost: 1950,
    installUnitCost: 650,
    laborRatio: 19,
    materialRatio: 61,
    machineRatio: 20,
    sourceType: 'government',
    qualityLevel: 'B',
    dataCompleteness: 85.0,
    publishTime: '2024-03-25',
    accessLevel: 'public',
    viewCount: 1580,
    collectCount: 98,
    isCollected: false,
    industryAvg: 3100,
    deviation: 4.8,
  },
  {
    id: 'PC202406006',
    projectTitle: '某商业综合体',
    projectLocation: '广东省佛山市',
    provinceName: '广东省',
    cityName: '佛山市',
    functionCategory: '商业',
    functionTag: '商场',
    functionTagCode: 'SY-01',
    scaleLevel: '50000-80000㎡',
    buildingArea: 65000,
    structureType: '框架剪力墙',
    pricingStage: 'budget',
    unitCost: 4850,
    civilUnitCost: 2910,
    installUnitCost: 970,
    laborRatio: 16,
    materialRatio: 64,
    machineRatio: 20,
    sourceType: 'platform',
    qualityLevel: 'A',
    dataCompleteness: 90.0,
    publishTime: '2024-05-15',
    accessLevel: 'vip',
    viewCount: 2100,
    collectCount: 165,
    isCollected: false,
    industryAvg: 4600,
    deviation: 5.4,
  },
];

// 功能标签选项
const functionTagOptions = [
  { label: '办公建筑', value: 'BG', children: ['甲级办公', '行政办公', '产业园办公'] },
  { label: '医疗卫生', value: 'YI', children: ['门诊', '住院', '医技'] },
  { label: '教育', value: 'JY', children: ['教学楼', '实验楼', '图书馆'] },
  { label: '商业', value: 'SY', children: ['商场', '超市', '专卖店'] },
];

// 规模档选项
const scaleLevelOptions = [
  { label: '<3000㎡', value: 'XS' },
  { label: '3000-5000㎡', value: 'S' },
  { label: '5000-10000㎡', value: 'M' },
  { label: '10000-20000㎡', value: 'L' },
  { label: '20000-50000㎡', value: 'XL' },
  { label: '≥50000㎡', value: 'XXL' },
];

// 省份选项
const provinceOptions = [
  { label: '广东省', value: '440000' },
  { label: '北京市', value: '110000' },
  { label: '上海市', value: '310000' },
  { label: '浙江省', value: '330000' },
  { label: '江苏省', value: '320000' },
];

const PublicCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'map'>('list');
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [collectedCases, setCollectedCases] = useState<string[]>(['PC202406002', 'PC202406004']);

  // 切换收藏
  const toggleCollect = (caseId: string) => {
    if (collectedCases.includes(caseId)) {
      setCollectedCases(collectedCases.filter(id => id !== caseId));
    } else {
      setCollectedCases([...collectedCases, caseId]);
    }
  };

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

  // 获取质量等级标签
  const getQualityTag = (level: string) => {
    const levelMap: Record<string, { color: string }> = {
      A: { color: 'green' },
      B: { color: 'blue' },
      C: { color: 'orange' },
      D: { color: 'default' },
    };
    return <Tag color={levelMap[level]?.color || 'default'}>{level}级</Tag>;
  };

  // 获取访问级别标签
  const getAccessTag = (level: string) => {
    const levelMap: Record<string, { color: string; text: string }> = {
      public: { color: 'green', text: '公开' },
      member: { color: 'blue', text: '会员' },
      vip: { color: 'gold', text: 'VIP' },
    };
    const access = levelMap[level] || { color: 'default', text: level };
    return <Tag color={access.color}>{access.text}</Tag>;
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

  // 列表视图列定义
  const columns: ColumnsType<PublicCase> = [
    {
      title: '质量',
      key: 'quality',
      width: 60,
      align: 'center',
      render: (_, record) => getQualityTag(record.qualityLevel),
    },
    {
      title: '项目名称/标签',
      key: 'project',
      width: 220,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.projectTitle}</div>
          <div className="text-xs text-gray-400 mt-1">
            <Tag color="cyan">{record.functionCategory}</Tag>
            <span>{record.functionTag}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {getSourceTag(record.sourceType)}
          </div>
        </div>
      ),
    },
    {
      title: '单方造价',
      key: 'unitCost',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div>
          <div className="font-medium text-blue-600">¥{record.unitCost.toLocaleString()}</div>
          <div className="text-xs text-gray-400">元/㎡</div>
          <div className={`text-xs ${record.deviation > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {record.deviation > 0 ? '↑' : '↓'}行业{Math.abs(record.deviation).toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      title: '规模',
      key: 'scale',
      width: 100,
      render: (_, record) => (
        <div>
          <div>{record.buildingArea.toLocaleString()}㎡</div>
          <div className="text-xs text-gray-400">{record.scaleLevel}</div>
        </div>
      ),
    },
    {
      title: '地区',
      key: 'location',
      width: 100,
      render: (_, record) => (
        <div>
          <div>{record.cityName}</div>
          <div className="text-xs text-gray-400">{getPricingStageText(record.pricingStage)}</div>
        </div>
      ),
    },
    {
      title: '访问',
      key: 'access',
      width: 60,
      align: 'center',
      render: (_, record) => getAccessTag(record.accessLevel),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/data-asset/marketplace/public-cases/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
          >
            对比
          </Button>
          <Button
            type="text"
            size="small"
            icon={collectedCases.includes(record.id) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
            onClick={() => toggleCollect(record.id)}
          />
        </Space>
      ),
    },
  ];

  // 渲染列表视图
  const renderListView = () => (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={mockPublicCases}
      pagination={{
        total: 28650,
        pageSize: 20,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
      }}
      size="small"
      rowSelection={{
        selectedRowKeys: selectedCases,
        onChange: (keys) => setSelectedCases(keys as string[]),
      }}
    />
  );

  // 渲染卡片视图
  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {mockPublicCases.map((item) => (
        <Col span={8} key={item.id}>
          <Card
            size="small"
            hoverable
            onClick={() => navigate(`/data-asset/marketplace/public-cases/${item.id}`)}
            extra={
              <Button
                type="text"
                size="small"
                icon={collectedCases.includes(item.id) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollect(item.id);
                }}
              />
            }
            title={
              <div className="flex items-center gap-2">
                <BankOutlined />
                <span className="truncate">{item.projectTitle}</span>
              </div>
            }
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <EnvironmentOutlined />
                <span>{item.projectLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag color="cyan">{item.functionCategory}-{item.functionTag}</Tag>
              </div>
              <div className="text-sm text-gray-500">
                📐 {item.buildingArea.toLocaleString()}㎡
              </div>

              <div className="p-2 bg-gray-50 rounded text-center">
                <div className="text-lg font-bold text-blue-600">¥{item.unitCost.toLocaleString()}/㎡</div>
                <div className={`text-xs ${item.deviation > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {item.deviation > 0 ? '↑' : '↓'}行业{Math.abs(item.deviation).toFixed(1)}%
                </div>
              </div>

              <div className="text-xs text-gray-400">
                人{item.laborRatio}% 材{item.materialRatio}% 机{item.machineRatio}%
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>{getSourceTag(item.sourceType)} {getQualityTag(item.qualityLevel)}</span>
                <span>{item.publishTime.slice(0, 7)}{getPricingStageText(item.pricingStage)}</span>
              </div>

              {item.accessLevel !== 'public' && (
                <div className="text-right">
                  {getAccessTag(item.accessLevel)}
                </div>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 渲染地图视图（简化版）
  const renderMapView = () => (
    <Card size="small">
      <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
        <div className="text-center text-gray-400">
          <EnvironmentOutlined style={{ fontSize: 48 }} />
          <div className="mt-2">地图视图开发中</div>
          <div className="text-xs mt-1">将展示案例的地理分布</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">公共资源案例库</span>
          <Space>
            <Button icon={<TeamOutlined />} onClick={() => navigate('/data-asset/marketplace/public-cases/contribution')}>
              我的贡献
            </Button>
          </Space>
        </div>
      </Card>

      {/* 筛选区 */}
      <Card
        size="small"
        title={
          <span>
            <FilterOutlined className="mr-2" />
            筛选条件
          </span>
        }
        extra={
          <Space>
            <Button size="small" onClick={() => setFilterExpanded(!filterExpanded)}>
              {filterExpanded ? '收起' : '展开'}
            </Button>
            <Button size="small">重置</Button>
          </Space>
        }
      >
        {filterExpanded && (
          <div className="space-y-3">
            <Row gutter={16}>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">功能标签</div>
                <Select
                  placeholder="选择功能标签"
                  style={{ width: '100%' }}
                  allowClear
                  options={functionTagOptions.map(f => ({ label: f.label, value: f.value }))}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">规模档</div>
                <Select
                  placeholder="选择规模档"
                  style={{ width: '100%' }}
                  allowClear
                  options={scaleLevelOptions}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">省份</div>
                <Select
                  placeholder="选择省份"
                  style={{ width: '100%' }}
                  allowClear
                  options={provinceOptions}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">城市</div>
                <Select placeholder="选择城市" style={{ width: '100%' }} allowClear disabled />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">建设年份</div>
                <RangePicker picker="year" style={{ width: '100%' }} />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">计价阶段</div>
                <Checkbox.Group
                  options={[
                    { label: '概算', value: 'estimate' },
                    { label: '预算', value: 'budget' },
                    { label: '结算', value: 'settlement' },
                    { label: '决算', value: 'final' },
                  ]}
                  defaultValue={['budget', 'settlement']}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">数据来源</div>
                <Checkbox.Group
                  options={[
                    { label: '平台案例', value: 'platform' },
                    { label: '政府公开', value: 'government' },
                    { label: '行业数据', value: 'industry' },
                  ]}
                  defaultValue={['platform', 'government']}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">数据质量</div>
                <Checkbox.Group
                  options={[
                    { label: 'A级', value: 'A' },
                    { label: 'B级', value: 'B' },
                    { label: 'C级', value: 'C' },
                  ]}
                  defaultValue={['A', 'B']}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="text-xs text-gray-500 mb-1">单方造价范围</div>
                <Space>
                  <Input placeholder="最低" style={{ width: 100 }} suffix="元/㎡" />
                  <span>至</span>
                  <Input placeholder="最高" style={{ width: 100 }} suffix="元/㎡" />
                </Space>
              </Col>
              <Col span={12} className="text-right">
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button icon={<BarChartOutlined />}>分析</Button>
                  <Button icon={<DownloadOutlined />}>导出</Button>
                </Space>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* 视图切换 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="list">列表视图</Radio.Button>
            <Radio.Button value="card">卡片视图</Radio.Button>
            <Radio.Button value="map">地图视图</Radio.Button>
          </Radio.Group>
          <span className="text-gray-400">符合条件 28,650 条</span>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="案例总数" value={28650} suffix="条" />
          </Col>
          <Col span={4}>
            <Statistic
              title="本月新增"
              value={860}
              suffix={<span className="text-green-500 text-xs">↑15%</span>}
            />
          </Col>
          <Col span={4}>
            <Statistic title="平均单方" value={3850} prefix="¥" suffix="元/㎡" />
          </Col>
          <Col span={4}>
            <Statistic title="数据来源" value={156} suffix="个" />
          </Col>
          <Col span={4}>
            <Statistic title="覆盖地区" value={31} suffix="省" />
          </Col>
          <Col span={4}>
            <div className="text-center">
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div className="text-xs text-gray-400 mt-1">数据已审核</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 案例列表/卡片/地图 */}
      <Card size="small">
        {viewMode === 'list' && renderListView()}
        {viewMode === 'card' && renderCardView()}
        {viewMode === 'map' && renderMapView()}
      </Card>
    </div>
  );
};

export default PublicCasesPage;
