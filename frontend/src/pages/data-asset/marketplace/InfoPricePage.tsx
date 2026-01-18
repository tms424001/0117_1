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
  DatePicker,
  Tabs,
  Tree,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  BellOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// 信息价数据类型
interface InfoPrice {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  unit: string;
  categoryL1: string;
  categoryL2: string;
  infoPrice: number;
  taxRate: number;
  taxInclusivePrice: number;
  provinceName: string;
  cityName: string;
  pricePeriod: string;
  publishDate: string;
  sourceOrg: string;
  momChange: number;
  yoyChange: number;
  changeFlag: string;
  isCollected: boolean;
}

// 模拟信息价数据
const mockInfoPrices: InfoPrice[] = [
  {
    id: 'IP001',
    materialCode: 'C30',
    materialName: '商品混凝土',
    specification: 'C30，塌落度120-160mm',
    unit: 'm³',
    categoryL1: '混凝土',
    categoryL2: '商品混凝土',
    infoPrice: 485,
    taxRate: 9,
    taxInclusivePrice: 528.65,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: 3.2,
    yoyChange: 5.8,
    changeFlag: 'up',
    isCollected: false,
  },
  {
    id: 'IP002',
    materialCode: 'HRB400-12',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400，Φ12',
    unit: 't',
    categoryL1: '钢材',
    categoryL2: '钢筋',
    infoPrice: 3850,
    taxRate: 13,
    taxInclusivePrice: 4350.50,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: -3.0,
    yoyChange: -8.5,
    changeFlag: 'down',
    isCollected: true,
  },
  {
    id: 'IP003',
    materialCode: 'HRB400-25',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400，Φ25',
    unit: 't',
    categoryL1: '钢材',
    categoryL2: '钢筋',
    infoPrice: 3780,
    taxRate: 13,
    taxInclusivePrice: 4271.40,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: -3.8,
    yoyChange: -9.2,
    changeFlag: 'down',
    isCollected: false,
  },
  {
    id: 'IP004',
    materialCode: 'SN-P32.5',
    materialName: '普通硅酸盐水泥',
    specification: 'P.O 32.5',
    unit: 't',
    categoryL1: '水泥',
    categoryL2: '硅酸盐水泥',
    infoPrice: 420,
    taxRate: 13,
    taxInclusivePrice: 474.60,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: 0,
    yoyChange: 2.4,
    changeFlag: 'unchanged',
    isCollected: false,
  },
  {
    id: 'IP005',
    materialCode: 'ZS-001',
    materialName: '中砂',
    specification: '细度模数2.3-3.0',
    unit: 'm³',
    categoryL1: '砂石',
    categoryL2: '砂',
    infoPrice: 125,
    taxRate: 9,
    taxInclusivePrice: 136.25,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: 8.7,
    yoyChange: 15.2,
    changeFlag: 'up',
    isCollected: true,
  },
  {
    id: 'IP006',
    materialCode: 'SS-001',
    materialName: '碎石',
    specification: '5-25mm连续级配',
    unit: 'm³',
    categoryL1: '砂石',
    categoryL2: '石子',
    infoPrice: 98,
    taxRate: 9,
    taxInclusivePrice: 106.82,
    provinceName: '广东省',
    cityName: '深圳市',
    pricePeriod: '2024-06',
    publishDate: '2024-06-15',
    sourceOrg: '深圳市住建局',
    momChange: 5.4,
    yoyChange: 12.6,
    changeFlag: 'up',
    isCollected: false,
  },
];

// 材料分类树数据
const categoryTreeData = [
  {
    title: '全部材料 (2,856)',
    key: 'all',
    children: [
      {
        title: '混凝土 (156)',
        key: 'HNT',
        children: [
          { title: '商品混凝土 (48)', key: 'HNT-01' },
          { title: '预拌砂浆 (32)', key: 'HNT-02' },
          { title: '特种混凝土 (28)', key: 'HNT-03' },
        ],
      },
      {
        title: '钢材 (428)',
        key: 'GC',
        children: [
          { title: '钢筋 (186)', key: 'GC-01' },
          { title: '型钢 (124)', key: 'GC-02' },
          { title: '钢板 (68)', key: 'GC-03' },
          { title: '钢管 (50)', key: 'GC-04' },
        ],
      },
      {
        title: '水泥 (86)',
        key: 'SN',
        children: [
          { title: '硅酸盐水泥 (42)', key: 'SN-01' },
          { title: '普通水泥 (28)', key: 'SN-02' },
          { title: '特种水泥 (16)', key: 'SN-03' },
        ],
      },
      {
        title: '砂石 (124)',
        key: 'SS',
        children: [
          { title: '砂 (56)', key: 'SS-01' },
          { title: '石子 (48)', key: 'SS-02' },
          { title: '机制砂 (20)', key: 'SS-03' },
        ],
      },
      {
        title: '木材 (256)',
        key: 'MC',
      },
      {
        title: '防水材料 (186)',
        key: 'FS',
      },
      {
        title: '管材管件 (342)',
        key: 'GJ',
      },
      {
        title: '电气材料 (486)',
        key: 'DQ',
      },
    ],
  },
];

// 数据源选项
const sourceOptions = [
  { label: '深圳市', value: 'shenzhen', count: 2856 },
  { label: '广州市', value: 'guangzhou', count: 3124 },
  { label: '东莞市', value: 'dongguan', count: 2456 },
  { label: '佛山市', value: 'foshan', count: 2234 },
  { label: '广东省（省级）', value: 'guangdong', count: 1856 },
];

// 材价期选项
const periodOptions = [
  { label: '2024年6月', value: '2024-06' },
  { label: '2024年5月', value: '2024-05' },
  { label: '2024年4月', value: '2024-04' },
  { label: '2024年3月', value: '2024-03' },
  { label: '2024年2月', value: '2024-02' },
  { label: '2024年1月', value: '2024-01' },
];

const InfoPricePage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'category' | 'trend'>('list');
  const [selectedSource, setSelectedSource] = useState('shenzhen');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-06');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [collectedItems, setCollectedItems] = useState<string[]>(['IP002', 'IP005']);

  // 切换收藏
  const toggleCollect = (id: string) => {
    if (collectedItems.includes(id)) {
      setCollectedItems(collectedItems.filter(i => i !== id));
    } else {
      setCollectedItems([...collectedItems, id]);
    }
  };

  // 获取变动标签
  const getChangeTag = (flag: string, mom: number) => {
    if (flag === 'up') {
      return (
        <Tag color="red" icon={<RiseOutlined />}>
          +{mom.toFixed(1)}%
        </Tag>
      );
    } else if (flag === 'down') {
      return (
        <Tag color="green" icon={<FallOutlined />}>
          {mom.toFixed(1)}%
        </Tag>
      );
    }
    return <Tag>持平</Tag>;
  };

  // 列表视图列定义
  const columns: ColumnsType<InfoPrice> = [
    {
      title: '材料名称',
      key: 'material',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.materialName}</div>
          <div className="text-xs text-gray-400">{record.specification}</div>
        </div>
      ),
    },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.categoryL1}</Tag>
          <div className="text-xs text-gray-400 mt-1">{record.categoryL2}</div>
        </div>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60,
      align: 'center',
    },
    {
      title: '信息价(不含税)',
      dataIndex: 'infoPrice',
      key: 'infoPrice',
      width: 120,
      align: 'right',
      render: (v) => <span className="font-medium text-blue-600">¥{v.toLocaleString()}</span>,
    },
    {
      title: '含税价',
      key: 'taxPrice',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div>
          <div>¥{record.taxInclusivePrice.toLocaleString()}</div>
          <div className="text-xs text-gray-400">税率{record.taxRate}%</div>
        </div>
      ),
    },
    {
      title: '环比',
      key: 'mom',
      width: 100,
      align: 'center',
      render: (_, record) => getChangeTag(record.changeFlag, record.momChange),
    },
    {
      title: '同比',
      dataIndex: 'yoyChange',
      key: 'yoy',
      width: 80,
      align: 'center',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : v < 0 ? 'text-green-500' : ''}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '材价期',
      dataIndex: 'pricePeriod',
      key: 'period',
      width: 100,
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
            icon={<LineChartOutlined />}
            onClick={() => navigate(`/data-asset/marketplace/info-price/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            icon={collectedItems.includes(record.id) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
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
      dataSource={mockInfoPrices}
      pagination={{
        total: 2856,
        pageSize: 20,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
      }}
      size="small"
    />
  );

  // 渲染分类视图
  const renderCategoryView = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card size="small" title="材料分类" style={{ height: 600 }}>
          <Tree
            showLine
            defaultExpandedKeys={['all', 'GC']}
            treeData={categoryTreeData}
            onSelect={(keys) => setSelectedCategory(keys as string[])}
          />
        </Card>
      </Col>
      <Col span={18}>
        <Card size="small" title={`材料列表${selectedCategory.length > 0 ? ` - ${selectedCategory[0]}` : ''}`}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={mockInfoPrices}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );

  // 渲染趋势视图
  const renderTrendView = () => (
    <div className="space-y-4">
      <Card size="small" title="价格涨跌排行">
        <Row gutter={16}>
          <Col span={12}>
            <div className="font-medium text-red-500 mb-2">
              <RiseOutlined /> 涨幅TOP5
            </div>
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={mockInfoPrices.filter(p => p.changeFlag === 'up').slice(0, 5)}
              columns={[
                { title: '材料', dataIndex: 'materialName', key: 'name', width: 150 },
                { title: '规格', dataIndex: 'specification', key: 'spec', width: 150, ellipsis: true },
                { title: '价格', dataIndex: 'infoPrice', key: 'price', width: 80, align: 'right' as const, render: (v: number) => `¥${v}` },
                { title: '涨幅', dataIndex: 'momChange', key: 'change', width: 80, align: 'center' as const, render: (v: number) => <span className="text-red-500">+{v.toFixed(1)}%</span> },
              ]}
            />
          </Col>
          <Col span={12}>
            <div className="font-medium text-green-500 mb-2">
              <FallOutlined /> 跌幅TOP5
            </div>
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={mockInfoPrices.filter(p => p.changeFlag === 'down').slice(0, 5)}
              columns={[
                { title: '材料', dataIndex: 'materialName', key: 'name', width: 150 },
                { title: '规格', dataIndex: 'specification', key: 'spec', width: 150, ellipsis: true },
                { title: '价格', dataIndex: 'infoPrice', key: 'price', width: 80, align: 'right' as const, render: (v: number) => `¥${v}` },
                { title: '跌幅', dataIndex: 'momChange', key: 'change', width: 80, align: 'center' as const, render: (v: number) => <span className="text-green-500">{v.toFixed(1)}%</span> },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card size="small" title="价格趋势图（示意）">
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center text-gray-400">
            <LineChartOutlined style={{ fontSize: 48 }} />
            <div className="mt-2">价格趋势图</div>
            <div className="text-xs">展示主要材料近12个月价格走势</div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">信息价</span>
          <Space>
            <Button icon={<BellOutlined />}>订阅管理</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
      </Card>

      {/* 筛选区 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">数据源</div>
            <Select
              value={selectedSource}
              onChange={setSelectedSource}
              style={{ width: '100%' }}
              options={sourceOptions.map(s => ({
                label: `${s.label} (${s.count}条)`,
                value: s.value,
              }))}
            />
          </Col>
          <Col span={4}>
            <div className="text-xs text-gray-500 mb-1">材价期</div>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: '100%' }}
              options={periodOptions}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">材料分类</div>
            <Select
              placeholder="全部分类"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '混凝土', value: 'HNT' },
                { label: '钢材', value: 'GC' },
                { label: '水泥', value: 'SN' },
                { label: '砂石', value: 'SS' },
                { label: '木材', value: 'MC' },
                { label: '防水材料', value: 'FS' },
              ]}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">关键词搜索</div>
            <Search placeholder="材料名称/规格/编码" allowClear />
          </Col>
          <Col span={2} className="text-right">
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          </Col>
        </Row>
      </Card>

      {/* 视图切换 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="list">列表视图</Radio.Button>
            <Radio.Button value="category">分类视图</Radio.Button>
            <Radio.Button value="trend">趋势视图</Radio.Button>
          </Radio.Group>
          <span className="text-gray-400">
            {sourceOptions.find(s => s.value === selectedSource)?.label} · {selectedPeriod} · 共 2,856 条
          </span>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="材料总数" value={2856} suffix="条" />
          </Col>
          <Col span={4}>
            <Statistic
              title="本期新增"
              value={48}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="价格上涨"
              value={386}
              valueStyle={{ color: '#f5222d' }}
              prefix={<RiseOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="价格下跌"
              value={245}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FallOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic title="价格持平" value={2177} />
          </Col>
          <Col span={4}>
            <div className="text-center">
              <div className="text-sm text-gray-500">发布单位</div>
              <div className="text-sm font-medium mt-2">深圳市住建局</div>
              <div className="text-xs text-gray-400">2024-06-15发布</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 内容区 */}
      <Card size="small">
        {viewMode === 'list' && renderListView()}
        {viewMode === 'category' && renderCategoryView()}
        {viewMode === 'trend' && renderTrendView()}
      </Card>
    </div>
  );
};

export default InfoPricePage;
