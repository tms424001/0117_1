import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Select,
  Checkbox,
  Statistic,
  Radio,
  Input,
  DatePicker,
  Tree,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  LineChartOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

// 综价数据类型
interface CompositePriceRecord {
  compositeId: string;
  itemCode: string;
  itemName: string;
  itemFeature: string;
  unit: string;
  sboqCode: string;
  sboqName: string;
  categoryL1: string;
  categoryL2: string;
  compositePrice: number;
  laborCost: number;
  materialCost: number;
  machineCost: number;
  laborRatio: number;
  materialRatio: number;
  machineRatio: number;
  pricePeriod: string;
  province: string;
  city: string;
  quotaVersion: string;
  functionTag: string;
  qualityFlag: string;
  isComplete: boolean;
  status: string;
}

// 分类汇总数据类型
interface CategorySummary {
  categoryL1: string;
  categoryL2: string;
  count: number;
  avgPrice: number;
  laborRatio: number;
  materialRatio: number;
  machineRatio: number;
}

// 模拟综价数据
const mockCompositePrices: CompositePriceRecord[] = [
  {
    compositeId: 'ECP202506001',
    itemCode: '010101001',
    itemName: '挖基坑土方',
    itemFeature: '土质:普通土 深度:≤2m',
    unit: 'm³',
    sboqCode: 'SBOQ-0101-001',
    sboqName: '挖基坑土方',
    categoryL1: '土石方工程',
    categoryL2: '挖土方',
    compositePrice: 38.50,
    laborCost: 6.93,
    materialCost: 4.62,
    machineCost: 26.95,
    laborRatio: 18,
    materialRatio: 12,
    machineRatio: 70,
    pricePeriod: '2025-06',
    province: '广东省',
    city: '深圳市',
    quotaVersion: '广东2018',
    functionTag: '办公建筑',
    qualityFlag: 'normal',
    isComplete: true,
    status: 'active',
  },
  {
    compositeId: 'ECP202506002',
    itemCode: '030103003',
    itemName: 'C30混凝土浇筑',
    itemFeature: '部位:基础 方式:泵送',
    unit: 'm³',
    sboqCode: 'SBOQ-0301-003',
    sboqName: 'C30混凝土浇筑',
    categoryL1: '混凝土工程',
    categoryL2: '现浇混凝土',
    compositePrice: 625.80,
    laborCost: 50.06,
    materialCost: 531.93,
    machineCost: 43.81,
    laborRatio: 8,
    materialRatio: 85,
    machineRatio: 7,
    pricePeriod: '2025-06',
    province: '广东省',
    city: '深圳市',
    quotaVersion: '广东2018',
    functionTag: '办公建筑',
    qualityFlag: 'normal',
    isComplete: true,
    status: 'active',
  },
  {
    compositeId: 'ECP202506003',
    itemCode: '040101001',
    itemName: '钢筋制安',
    itemFeature: '构件:现浇 牌号:HRB400',
    unit: 't',
    sboqCode: 'SBOQ-0401-001',
    sboqName: '钢筋制安',
    categoryL1: '钢筋工程',
    categoryL2: '现浇构件钢筋',
    compositePrice: 5280,
    laborCost: 1161.6,
    materialCost: 3801.6,
    machineCost: 316.8,
    laborRatio: 22,
    materialRatio: 72,
    machineRatio: 6,
    pricePeriod: '2025-06',
    province: '广东省',
    city: '深圳市',
    quotaVersion: '广东2018',
    functionTag: '办公建筑',
    qualityFlag: 'normal',
    isComplete: true,
    status: 'active',
  },
  {
    compositeId: 'ECP202506004',
    itemCode: '050101001',
    itemName: '模板制安拆',
    itemFeature: '部位:柱 材质:木模板',
    unit: 'm²',
    sboqCode: 'SBOQ-0501-001',
    sboqName: '柱模板',
    categoryL1: '模板工程',
    categoryL2: '现浇模板',
    compositePrice: 68.50,
    laborCost: 34.25,
    materialCost: 27.40,
    machineCost: 6.85,
    laborRatio: 50,
    materialRatio: 40,
    machineRatio: 10,
    pricePeriod: '2025-06',
    province: '广东省',
    city: '深圳市',
    quotaVersion: '广东2018',
    functionTag: '办公建筑',
    qualityFlag: 'normal',
    isComplete: true,
    status: 'active',
  },
  {
    compositeId: 'ECP202506005',
    itemCode: '020101001',
    itemName: '砂垫层',
    itemFeature: '厚度:100mm',
    unit: 'm³',
    sboqCode: 'SBOQ-0201-001',
    sboqName: '砂垫层',
    categoryL1: '地基处理',
    categoryL2: '换填垫层',
    compositePrice: 185.60,
    laborCost: 37.12,
    materialCost: 129.92,
    machineCost: 18.56,
    laborRatio: 20,
    materialRatio: 70,
    machineRatio: 10,
    pricePeriod: '2025-06',
    province: '广东省',
    city: '深圳市',
    quotaVersion: '广东2018',
    functionTag: '办公建筑',
    qualityFlag: 'normal',
    isComplete: true,
    status: 'active',
  },
];

// 模拟分类汇总数据
const mockCategorySummary: CategorySummary[] = [
  { categoryL1: '土石方工程', categoryL2: '挖土方', count: 3250, avgPrice: 42.50, laborRatio: 18, materialRatio: 12, machineRatio: 70 },
  { categoryL1: '土石方工程', categoryL2: '回填方', count: 2180, avgPrice: 28.60, laborRatio: 15, materialRatio: 65, machineRatio: 20 },
  { categoryL1: '混凝土工程', categoryL2: '现浇混凝土', count: 8560, avgPrice: 580.50, laborRatio: 8, materialRatio: 85, machineRatio: 7 },
  { categoryL1: '钢筋工程', categoryL2: '现浇构件钢筋', count: 6850, avgPrice: 5150, laborRatio: 22, materialRatio: 72, machineRatio: 6 },
  { categoryL1: '模板工程', categoryL2: '现浇模板', count: 5280, avgPrice: 65.80, laborRatio: 50, materialRatio: 40, machineRatio: 10 },
  { categoryL1: '地基处理', categoryL2: '换填垫层', count: 1850, avgPrice: 175.20, laborRatio: 20, materialRatio: 70, machineRatio: 10 },
];

// 分类树数据
const categoryTreeData = [
  {
    title: '土石方工程 (12,560)',
    key: '01',
    children: [
      { title: '挖土方 (3,250)', key: '0101' },
      { title: '回填方 (2,180)', key: '0102' },
      { title: '土石方运输 (3,850)', key: '0103' },
      { title: '余土外运 (3,280)', key: '0104' },
    ],
  },
  {
    title: '地基处理 (8,650)',
    key: '02',
    children: [
      { title: '换填垫层 (1,850)', key: '0201' },
      { title: '强夯 (2,560)', key: '0202' },
    ],
  },
  {
    title: '混凝土工程 (25,680)',
    key: '03',
    children: [
      { title: '现浇混凝土 (8,560)', key: '0301' },
      { title: '预制混凝土 (5,280)', key: '0302' },
    ],
  },
  {
    title: '钢筋工程 (22,350)',
    key: '04',
    children: [
      { title: '现浇构件钢筋 (6,850)', key: '0401' },
      { title: '预制构件钢筋 (4,280)', key: '0402' },
    ],
  },
  {
    title: '模板工程 (16,280)',
    key: '05',
    children: [
      { title: '现浇模板 (5,280)', key: '0501' },
      { title: '预制模板 (3,560)', key: '0502' },
    ],
  },
];

const CompositePricesPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<string>('list');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  // 渲染费用构成条
  const renderCompositionBar = (labor: number, material: number, machine: number) => (
    <div className="flex h-4 w-24 rounded overflow-hidden text-xs">
      <div className="bg-blue-500" style={{ width: `${labor}%` }} title={`人工${labor}%`} />
      <div className="bg-green-500" style={{ width: `${material}%` }} title={`材料${material}%`} />
      <div className="bg-orange-500" style={{ width: `${machine}%` }} title={`机械${machine}%`} />
    </div>
  );

  // 列表视图列定义
  const listColumns: ColumnsType<CompositePriceRecord> = [
    {
      title: '清单项目',
      key: 'item',
      width: 220,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.itemName}</div>
          <div className="text-xs text-gray-400">{record.itemFeature}</div>
          <div className="text-xs text-blue-400">{record.sboqCode}</div>
        </div>
      ),
    },
    {
      title: '综合单价',
      key: 'price',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div>
          <div className="font-medium">¥{record.compositePrice.toLocaleString()}</div>
          <div className="text-xs text-gray-400">/{record.unit}</div>
        </div>
      ),
    },
    {
      title: '费用构成',
      key: 'composition',
      width: 140,
      render: (_, record) => (
        <div>
          {renderCompositionBar(record.laborRatio, record.materialRatio, record.machineRatio)}
          <div className="text-xs text-gray-400 mt-1">
            人{record.laborRatio}% 材{record.materialRatio}% 机{record.machineRatio}%
          </div>
        </div>
      ),
    },
    {
      title: '材价期',
      dataIndex: 'pricePeriod',
      key: 'pricePeriod',
      width: 90,
    },
    {
      title: '地区',
      key: 'location',
      width: 100,
      render: (_, record) => `${record.city}`,
    },
    {
      title: '定额版本',
      dataIndex: 'quotaVersion',
      key: 'quotaVersion',
      width: 100,
    },
    {
      title: '质量',
      dataIndex: 'qualityFlag',
      key: 'qualityFlag',
      width: 70,
      render: (flag) => (
        <Tag color={flag === 'normal' ? 'green' : 'orange'}>
          {flag === 'normal' ? '正常' : '异常'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/data-asset/enterprise/composites/${record.compositeId}`)}
          >
            详情
          </Button>
          <Button type="link" size="small" icon={<CopyOutlined />}>
            套用
          </Button>
        </Space>
      ),
    },
  ];

  // 分类视图列定义
  const categoryColumns: ColumnsType<CategorySummary> = [
    { title: '清单大类', dataIndex: 'categoryL1', key: 'categoryL1', width: 140 },
    { title: '清单中类', dataIndex: 'categoryL2', key: 'categoryL2', width: 140 },
    { title: '综价数量', dataIndex: 'count', key: 'count', width: 100, align: 'center' },
    {
      title: '平均单价',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      align: 'right',
      render: (val) => <span className="font-medium">¥{val.toLocaleString()}</span>,
    },
    {
      title: '费用构成',
      key: 'composition',
      width: 160,
      render: (_, record) => (
        <div>
          {renderCompositionBar(record.laborRatio, record.materialRatio, record.machineRatio)}
          <div className="text-xs text-gray-400 mt-1">
            人{record.laborRatio}% 材{record.materialRatio}% 机{record.machineRatio}%
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => <Button type="link" size="small">查看明细</Button>,
    },
  ];

  // 渲染列表视图
  const renderListView = () => (
    <Card size="small" title="综价列表">
      <Table
        rowKey="compositeId"
        columns={listColumns}
        dataSource={mockCompositePrices}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 1100 }}
        size="small"
        rowSelection={{ type: 'checkbox' }}
      />
    </Card>
  );

  // 渲染分类视图
  const renderCategoryView = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card size="small" title="清单分类树" style={{ height: 500 }}>
          <Tree
            showLine
            defaultExpandedKeys={['01', '03']}
            treeData={categoryTreeData}
            onSelect={(keys) => setSelectedCategory(keys as string[])}
          />
        </Card>
      </Col>
      <Col span={18}>
        <Card size="small" title={`分类详情${selectedCategory.length > 0 ? `: ${selectedCategory[0]}` : ''}`}>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-sm text-gray-500">综价数</div>
                <div className="text-xl font-bold text-blue-600">3,250</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-sm text-gray-500">平均单价</div>
                <div className="text-xl font-bold text-green-600">¥42.50</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="p-3 bg-orange-50 rounded text-center">
                <div className="text-sm text-gray-500">环比变化</div>
                <div className="text-xl font-bold text-orange-600">+1.8%</div>
              </div>
            </Col>
          </Row>
          <Table
            rowKey={(r) => `${r.categoryL1}-${r.categoryL2}`}
            columns={categoryColumns}
            dataSource={mockCategorySummary}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );

  // 渲染对比视图
  const renderCompareView = () => (
    <Card size="small">
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">清单项目：</span>
            <Select defaultValue="SBOQ-0101-001" style={{ width: 280 }}>
              <Select.Option value="SBOQ-0101-001">挖基坑土方(普通土,深≤2m)</Select.Option>
              <Select.Option value="SBOQ-0301-003">C30混凝土浇筑(基础,泵送)</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">材价期：</span>
            <Select defaultValue="2025-06" style={{ width: 120 }}>
              <Select.Option value="2025-06">2025-06</Select.Option>
              <Select.Option value="2025-05">2025-05</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">对比维度：</span>
            <Radio.Group defaultValue="region">
              <Radio.Button value="region">跨地区</Radio.Button>
              <Radio.Button value="project">跨项目</Radio.Button>
              <Radio.Button value="history">历史对比</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Button type="primary">开始对比</Button>
          </Col>
        </Row>
      </div>

      <div className="mb-4">
        <div className="font-medium mb-2">跨地区对比：挖基坑土方(普通土,深≤2m) | 2025-06</div>
        <div className="text-gray-500 text-sm mb-4">基准价：¥38.50/m³（广东深圳）</div>
      </div>

      <Table
        rowKey="region"
        columns={[
          { title: '地区', dataIndex: 'region', key: 'region', width: 120 },
          { title: '推荐价', dataIndex: 'price', key: 'price', width: 100, align: 'right' as const, render: (val: number) => <span className="font-medium">¥{val.toFixed(2)}</span> },
          { title: '偏差', dataIndex: 'deviation', key: 'deviation', width: 80, align: 'right' as const, render: (val: string) => <span style={{ color: val.startsWith('-') ? '#52c41a' : val === '基准' ? '#999' : '#f5222d' }}>{val}</span> },
          { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' as const },
          {
            title: '费用构成',
            key: 'composition',
            width: 180,
            render: (_: unknown, record: { region: string; price: number; deviation: string; sampleCount: number; laborRatio: number; materialRatio: number; machineRatio: number }) => (
              <div className="text-xs">人{record.laborRatio}% 材{record.materialRatio}% 机{record.machineRatio}%</div>
            ),
          },
        ]}
        dataSource={[
          { region: '广东深圳', price: 38.50, deviation: '基准', sampleCount: 42, laborRatio: 18, materialRatio: 12, machineRatio: 70 },
          { region: '广东广州', price: 36.80, deviation: '-4.4%', sampleCount: 58, laborRatio: 17, materialRatio: 11, machineRatio: 72 },
          { region: '广东东莞', price: 35.20, deviation: '-8.6%', sampleCount: 35, laborRatio: 16, materialRatio: 12, machineRatio: 72 },
          { region: '广东佛山', price: 34.50, deviation: '-10.4%', sampleCount: 28, laborRatio: 17, materialRatio: 10, machineRatio: 73 },
          { region: '广东珠海', price: 37.80, deviation: '-1.8%', sampleCount: 22, laborRatio: 18, materialRatio: 11, machineRatio: 71 },
        ]}
        pagination={false}
        size="small"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <div className="font-medium mb-2">分析结论：</div>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>深圳单价高于省均值5.3%，处于合理偏高水平</li>
          <li>各地区机械费占比稳定在70-73%，为主要成本构成</li>
          <li>建议询价时参考东莞、佛山等地区价格</li>
        </ul>
      </div>

      <div className="mt-4 text-right">
        <Button icon={<ExportOutlined />}>导出对比报告</Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* 筛选区 */}
      <Card size="small" title="筛选条件">
        <Row gutter={[16, 12]}>
          <Col span={6}>
            <span className="mr-2">清单分类：</span>
            <Select defaultValue="" style={{ width: 140 }} placeholder="请选择">
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="土石方工程">土石方工程</Select.Option>
              <Select.Option value="混凝土工程">混凝土工程</Select.Option>
              <Select.Option value="钢筋工程">钢筋工程</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">清单名称：</span>
            <Input placeholder="请输入" style={{ width: 140 }} />
          </Col>
          <Col span={6}>
            <span className="mr-2">省份：</span>
            <Select defaultValue="广东省" style={{ width: 120 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="广东省">广东省</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">城市：</span>
            <Select defaultValue="深圳市" style={{ width: 120 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="深圳市">深圳市</Select.Option>
              <Select.Option value="广州市">广州市</Select.Option>
            </Select>
          </Col>
          <Col span={8}>
            <span className="mr-2">材价期：</span>
            <RangePicker picker="month" style={{ width: 220 }} />
          </Col>
          <Col span={6}>
            <span className="mr-2">定额版本：</span>
            <Select defaultValue="广东2018" style={{ width: 140 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="广东2018">广东2018</Select.Option>
              <Select.Option value="广东2010">广东2010</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">功能标签：</span>
            <Select defaultValue="" style={{ width: 120 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="办公建筑">办公建筑</Select.Option>
              <Select.Option value="商业建筑">商业建筑</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <span className="mr-2">计价阶段：</span>
            <Checkbox.Group
              defaultValue={['budget', 'settlement']}
              options={[
                { label: '概算', value: 'estimate' },
                { label: '预算', value: 'budget' },
                { label: '结算', value: 'settlement' },
                { label: '决算', value: 'final' },
              ]}
            />
          </Col>
          <Col span={24} className="text-right">
            <Space>
              <Button>重置</Button>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button icon={<LineChartOutlined />} onClick={() => navigate('/data-asset/enterprise/composites/analysis')}>分析</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 视图切换 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
            <Radio.Button value="list">列表视图</Radio.Button>
            <Radio.Button value="category">分类视图</Radio.Button>
            <Radio.Button value="compare">对比视图</Radio.Button>
          </Radio.Group>
          <Button onClick={() => navigate('/data-asset/enterprise/composites/templates')}>
            组价模板
          </Button>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small" title="统计概览">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="综价总数" value={186520} />
          </Col>
          <Col span={4}>
            <Statistic title="本月新增" value={8650} suffix={<span className="text-green-500 text-sm">↑12%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="清单覆盖" value={2850} suffix={<span className="text-gray-400 text-sm">项 68.5%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="完整组价" value="92.5" suffix="%" />
          </Col>
          <Col span={4}>
            <Statistic title="组价模板" value={580} />
          </Col>
          <Col span={4}>
            <Statistic title="本月套用" value={1256} suffix="次" />
          </Col>
        </Row>
      </Card>

      {/* 视图内容 */}
      {viewType === 'list' && renderListView()}
      {viewType === 'category' && renderCategoryView()}
      {viewType === 'compare' && renderCompareView()}
    </div>
  );
};

export default CompositePricesPage;
