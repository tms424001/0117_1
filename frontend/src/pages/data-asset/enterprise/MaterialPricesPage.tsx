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
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  LineChartOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

// 材价数据类型
interface MaterialPriceRecord {
  priceId: string;
  materialName: string;
  specification: string;
  brand: string;
  unit: string;
  smlCode: string;
  categoryL1: string;
  categoryL2: string;
  unitPrice: number;
  taxInclusivePrice: number;
  priceType: string;
  pricePeriod: string;
  province: string;
  city: string;
  supplierName: string;
  sourceType: string;
  qualityFlag: string;
  momChange: number;
  status: string;
}

// 分类汇总数据类型
interface CategorySummary {
  categoryL1: string;
  categoryL2: string;
  materialCount: number;
  avgPrice: number;
  momChange: number;
}

// 比价数据类型
interface ComparePrice {
  supplierName: string;
  unitPrice: number;
  taxInclusivePrice: number;
  priceType: string;
  pricePeriod: string;
  sourceType: string;
}

// 模拟材价数据
const mockMaterialPrices: MaterialPriceRecord[] = [
  {
    priceId: 'EMP202510001',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400 Φ12',
    brand: '韶钢',
    unit: 't',
    smlCode: 'SML-ST-001',
    categoryL1: '钢材',
    categoryL2: '钢筋',
    unitPrice: 3850,
    taxInclusivePrice: 4350.5,
    priceType: 'market',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '深圳钢材贸易有限公司',
    sourceType: 'supplier',
    qualityFlag: 'normal',
    momChange: 2.5,
    status: 'active',
  },
  {
    priceId: 'EMP202510002',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400 Φ16',
    brand: '韶钢',
    unit: 't',
    smlCode: 'SML-ST-002',
    categoryL1: '钢材',
    categoryL2: '钢筋',
    unitPrice: 3820,
    taxInclusivePrice: 4316.6,
    priceType: 'market',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '深圳钢材贸易有限公司',
    sourceType: 'supplier',
    qualityFlag: 'normal',
    momChange: 1.8,
    status: 'active',
  },
  {
    priceId: 'EMP202510003',
    materialName: '商品混凝土',
    specification: 'C30',
    brand: '华润',
    unit: 'm³',
    smlCode: 'SML-HN-001',
    categoryL1: '混凝土',
    categoryL2: '商品混凝土',
    unitPrice: 485,
    taxInclusivePrice: 528.65,
    priceType: 'contract',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '华润混凝土有限公司',
    sourceType: 'contract',
    qualityFlag: 'normal',
    momChange: 0.8,
    status: 'active',
  },
  {
    priceId: 'EMP202510004',
    materialName: '商品混凝土',
    specification: 'C40',
    brand: '华润',
    unit: 'm³',
    smlCode: 'SML-HN-002',
    categoryL1: '混凝土',
    categoryL2: '商品混凝土',
    unitPrice: 525,
    taxInclusivePrice: 572.25,
    priceType: 'contract',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '华润混凝土有限公司',
    sourceType: 'contract',
    qualityFlag: 'normal',
    momChange: 1.2,
    status: 'active',
  },
  {
    priceId: 'EMP202510005',
    materialName: '普通硅酸盐水泥',
    specification: 'P.O 42.5',
    brand: '海螺',
    unit: 't',
    smlCode: 'SML-SN-001',
    categoryL1: '水泥',
    categoryL2: '硅酸盐水泥',
    unitPrice: 420,
    taxInclusivePrice: 457.8,
    priceType: 'market',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '海螺水泥经销商',
    sourceType: 'supplier',
    qualityFlag: 'normal',
    momChange: -0.5,
    status: 'active',
  },
  {
    priceId: 'EMP202510006',
    materialName: '中砂',
    specification: '细度模数2.3-3.0',
    brand: '',
    unit: 'm³',
    smlCode: 'SML-SS-001',
    categoryL1: '砂石',
    categoryL2: '砂',
    unitPrice: 135,
    taxInclusivePrice: 147.15,
    priceType: 'market',
    pricePeriod: '2025-12',
    province: '广东省',
    city: '深圳市',
    supplierName: '深圳砂石供应商',
    sourceType: 'supplier',
    qualityFlag: 'warning',
    momChange: 8.5,
    status: 'active',
  },
];

// 模拟分类汇总数据
const mockCategorySummary: CategorySummary[] = [
  { categoryL1: '钢材', categoryL2: '钢筋', materialCount: 156, avgPrice: 3835, momChange: 2.1 },
  { categoryL1: '钢材', categoryL2: '型钢', materialCount: 89, avgPrice: 4250, momChange: 1.5 },
  { categoryL1: '混凝土', categoryL2: '商品混凝土', materialCount: 45, avgPrice: 505, momChange: 1.0 },
  { categoryL1: '水泥', categoryL2: '硅酸盐水泥', materialCount: 32, avgPrice: 425, momChange: -0.3 },
  { categoryL1: '砂石', categoryL2: '砂', materialCount: 28, avgPrice: 140, momChange: 5.2 },
  { categoryL1: '砂石', categoryL2: '碎石', materialCount: 35, avgPrice: 95, momChange: 3.8 },
];

// 模拟比价数据
const mockComparePrices: ComparePrice[] = [
  { supplierName: '深圳钢材贸易有限公司', unitPrice: 3850, taxInclusivePrice: 4350.5, priceType: 'market', pricePeriod: '2025-12', sourceType: 'supplier' },
  { supplierName: '广州钢铁集团', unitPrice: 3880, taxInclusivePrice: 4384.4, priceType: 'market', pricePeriod: '2025-12', sourceType: 'supplier' },
  { supplierName: '东莞钢材市场', unitPrice: 3820, taxInclusivePrice: 4316.6, priceType: 'market', pricePeriod: '2025-12', sourceType: 'website' },
  { supplierName: '佛山钢材批发', unitPrice: 3900, taxInclusivePrice: 4407, priceType: 'contract', pricePeriod: '2025-12', sourceType: 'contract' },
];

const MaterialPricesPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<string>('list');
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>(['market', 'contract']);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPriceRecord | null>(null);

  // 获取价格类型标签
  const getPriceTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      market: { color: 'blue', text: '市场价' },
      contract: { color: 'green', text: '合同价' },
      bid: { color: 'orange', text: '投标价' },
      info: { color: 'purple', text: '信息价' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取来源类型文本
  const getSourceTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      supplier: '供应商报价',
      website: '网站采集',
      contract: '合同价格',
      evaluation: '财评价格',
    };
    return typeMap[type] || type;
  };

  // 列表视图列定义
  const listColumns: ColumnsType<MaterialPriceRecord> = [
    {
      title: '材料名称/规格',
      key: 'material',
      width: 220,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.materialName}</div>
          <div className="text-xs text-gray-400">
            {record.specification} {record.brand && `| ${record.brand}`}
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      key: 'price',
      width: 140,
      align: 'right',
      render: (_, record) => (
        <div>
          <div className="font-medium">¥{record.unitPrice.toLocaleString()}/{record.unit}</div>
          <div
            className="text-xs"
            style={{ color: record.momChange > 0 ? '#f5222d' : record.momChange < 0 ? '#52c41a' : '#999' }}
          >
            {record.momChange > 0 ? '↑' : record.momChange < 0 ? '↓' : ''}
            {record.momChange !== 0 ? `${Math.abs(record.momChange)}%` : '-'}
          </div>
        </div>
      ),
    },
    {
      title: '价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      width: 90,
      render: (type) => getPriceTypeTag(type),
    },
    {
      title: '地区',
      key: 'location',
      width: 120,
      render: (_, record) => `${record.province}${record.city}`,
    },
    {
      title: '材价期',
      dataIndex: 'pricePeriod',
      key: 'pricePeriod',
      width: 100,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160,
      ellipsis: true,
    },
    {
      title: '质量',
      dataIndex: 'qualityFlag',
      key: 'qualityFlag',
      width: 70,
      render: (flag) => (
        <Tag color={flag === 'normal' ? 'green' : flag === 'warning' ? 'orange' : 'red'}>
          {flag === 'normal' ? '正常' : flag === 'warning' ? '异常' : '错误'}
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
            onClick={() => navigate(`/data-asset/enterprise/materials/${record.priceId}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<LineChartOutlined />}
            onClick={() => setSelectedMaterial(record)}
          >
            趋势
          </Button>
        </Space>
      ),
    },
  ];

  // 分类视图列定义
  const categoryColumns: ColumnsType<CategorySummary> = [
    {
      title: '材料大类',
      dataIndex: 'categoryL1',
      key: 'categoryL1',
      width: 120,
    },
    {
      title: '材料中类',
      dataIndex: 'categoryL2',
      key: 'categoryL2',
      width: 140,
    },
    {
      title: '材料数量',
      dataIndex: 'materialCount',
      key: 'materialCount',
      width: 100,
      align: 'center',
    },
    {
      title: '均价',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      align: 'right',
      render: (val) => <span className="font-medium">¥{val.toLocaleString()}</span>,
    },
    {
      title: '环比变化',
      dataIndex: 'momChange',
      key: 'momChange',
      width: 100,
      align: 'right',
      render: (val) => (
        <span style={{ color: val > 0 ? '#f5222d' : val < 0 ? '#52c41a' : '#999' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" size="small">
          查看明细
        </Button>
      ),
    },
  ];

  // 比价视图列定义
  const compareColumns: ColumnsType<ComparePrice> = [
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '不含税单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (val) => <span className="font-medium">¥{val.toLocaleString()}</span>,
    },
    {
      title: '含税单价',
      dataIndex: 'taxInclusivePrice',
      key: 'taxInclusivePrice',
      width: 120,
      align: 'right',
      render: (val) => `¥${val.toLocaleString()}`,
    },
    {
      title: '价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      width: 100,
      render: (type) => getPriceTypeTag(type),
    },
    {
      title: '来源类型',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 120,
      render: (type) => getSourceTypeText(type),
    },
    {
      title: '材价期',
      dataIndex: 'pricePeriod',
      key: 'pricePeriod',
      width: 100,
    },
  ];

  // 渲染列表视图
  const renderListView = () => (
    <Card size="small" title="材价列表">
      <Table
        rowKey="priceId"
        columns={listColumns}
        dataSource={mockMaterialPrices}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 1200 }}
        size="small"
        rowSelection={{ type: 'checkbox' }}
      />
    </Card>
  );

  // 渲染分类视图
  const renderCategoryView = () => (
    <Card size="small" title="分类汇总">
      <Table
        rowKey={(record) => `${record.categoryL1}-${record.categoryL2}`}
        columns={categoryColumns}
        dataSource={mockCategorySummary}
        pagination={false}
        size="small"
      />
    </Card>
  );

  // 渲染比价视图
  const renderCompareView = () => (
    <Card size="small">
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">选择材料：</span>
            <Select defaultValue="SML-ST-001" style={{ width: 300 }}>
              <Select.Option value="SML-ST-001">热轧带肋钢筋 HRB400 Φ12</Select.Option>
              <Select.Option value="SML-ST-002">热轧带肋钢筋 HRB400 Φ16</Select.Option>
              <Select.Option value="SML-HN-001">商品混凝土 C30</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">地区：</span>
            <Select defaultValue="440300" style={{ width: 120 }}>
              <Select.Option value="440300">深圳市</Select.Option>
              <Select.Option value="440100">广州市</Select.Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">材价期：</span>
            <Select defaultValue="2025-12" style={{ width: 120 }}>
              <Select.Option value="2025-12">2025-12</Select.Option>
              <Select.Option value="2025-11">2025-11</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary">比价查询</Button>
          </Col>
        </Row>
      </div>

      <div className="mb-4">
        <div className="font-medium mb-2">比价结果：热轧带肋钢筋 HRB400 Φ12 | 深圳市 | 2025-12</div>
        <Row gutter={16} className="mb-4">
          <Col span={6}>
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-sm text-gray-500">最低价</div>
              <div className="text-xl font-bold text-blue-600">¥3,820</div>
              <div className="text-xs text-gray-400">东莞钢材市场</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-gray-500">推荐价</div>
              <div className="text-xl font-bold text-green-600">¥3,850</div>
              <div className="text-xs text-gray-400">中位价</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-sm text-gray-500">最高价</div>
              <div className="text-xl font-bold text-orange-600">¥3,900</div>
              <div className="text-xs text-gray-400">佛山钢材批发</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-500">价差</div>
              <div className="text-xl font-bold">¥80</div>
              <div className="text-xs text-gray-400">2.1%</div>
            </div>
          </Col>
        </Row>
      </div>

      <Table
        rowKey="supplierName"
        columns={compareColumns}
        dataSource={mockComparePrices}
        pagination={false}
        size="small"
      />
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* 筛选区 */}
      <Card size="small" title="筛选条件">
        <Row gutter={[16, 12]}>
          <Col span={6}>
            <span className="mr-2">材料分类：</span>
            <Select defaultValue="" style={{ width: 140 }} placeholder="请选择">
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="钢材">钢材</Select.Option>
              <Select.Option value="混凝土">混凝土</Select.Option>
              <Select.Option value="水泥">水泥</Select.Option>
              <Select.Option value="砂石">砂石</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">规格型号：</span>
            <Input placeholder="请输入" style={{ width: 140 }} />
          </Col>
          <Col span={6}>
            <span className="mr-2">省份：</span>
            <Select defaultValue="广东省" style={{ width: 120 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="广东省">广东省</Select.Option>
              <Select.Option value="北京市">北京市</Select.Option>
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
          <Col span={10}>
            <span className="mr-2">价格类型：</span>
            <Checkbox.Group
              value={selectedPriceTypes}
              onChange={(vals) => setSelectedPriceTypes(vals as string[])}
              options={[
                { label: '市场价', value: 'market' },
                { label: '合同价', value: 'contract' },
                { label: '投标价', value: 'bid' },
                { label: '信息价', value: 'info' },
              ]}
            />
          </Col>
          <Col span={6}>
            <span className="mr-2">供应商：</span>
            <Input placeholder="请输入" style={{ width: 140 }} />
          </Col>
          <Col span={24} className="text-right">
            <Space>
              <Button>重置</Button>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<LineChartOutlined />} onClick={() => navigate('/data-asset/enterprise/materials/analysis')}>
                分析
              </Button>
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
            <Radio.Button value="compare">比价视图</Radio.Button>
          </Radio.Group>
          <Button onClick={() => navigate('/data-asset/enterprise/materials/benchmark')}>
            基准价管理
          </Button>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small" title="统计概览">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="材料总数" value={52680} />
          </Col>
          <Col span={4}>
            <Statistic title="本月新增" value={2150} suffix={<span className="text-green-500 text-sm">↑8.5%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="主材类" value={18560} suffix={<span className="text-gray-400 text-sm">35.2%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="辅材类" value={34120} suffix={<span className="text-gray-400 text-sm">64.8%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="已核实" value={35420} suffix={<span className="text-gray-400 text-sm">67.2%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="供应商数" value={1256} />
          </Col>
        </Row>
      </Card>

      {/* 视图内容 */}
      {viewType === 'list' && renderListView()}
      {viewType === 'category' && renderCategoryView()}
      {viewType === 'compare' && renderCompareView()}

      {/* 价格趋势弹窗（简化版） */}
      {selectedMaterial && (
        <Card
          size="small"
          title={`价格趋势：${selectedMaterial.materialName} ${selectedMaterial.specification}`}
          extra={<Button type="link" onClick={() => setSelectedMaterial(null)}>关闭</Button>}
        >
          <div className="h-48 flex items-end justify-between px-4 pb-8 bg-gray-50 rounded">
            {[3650, 3720, 3780, 3800, 3820, 3850].map((price, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-12 bg-blue-500 rounded-t"
                  style={{ height: `${((price - 3600) / 300) * 100}%`, minHeight: 20 }}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {['7月', '8月', '9月', '10月', '11月', '12月'][idx]}
                </div>
                <div className="text-xs font-medium">¥{price}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button type="primary" onClick={() => navigate('/data-asset/enterprise/materials/analysis')}>
              查看详细分析
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MaterialPricesPage;
