import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Descriptions,
  Table,
  Tabs,
} from 'antd';
import {
  ArrowLeftOutlined,
  ExportOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

// 价格历史数据类型
interface PriceHistory {
  historyId: string;
  pricePeriod: string;
  unitPrice: number;
  taxInclusivePrice: number;
  changeRatio: number;
  supplierName: string;
  priceType: string;
}

// 模拟价格历史数据
const mockPriceHistory: PriceHistory[] = [
  { historyId: 'H001', pricePeriod: '2025-12', unitPrice: 3850, taxInclusivePrice: 4350.5, changeRatio: 2.5, supplierName: '深圳钢材贸易有限公司', priceType: 'market' },
  { historyId: 'H002', pricePeriod: '2025-11', unitPrice: 3756, taxInclusivePrice: 4244.28, changeRatio: 1.8, supplierName: '深圳钢材贸易有限公司', priceType: 'market' },
  { historyId: 'H003', pricePeriod: '2025-10', unitPrice: 3690, taxInclusivePrice: 4169.7, changeRatio: 0.5, supplierName: '深圳钢材贸易有限公司', priceType: 'market' },
  { historyId: 'H004', pricePeriod: '2025-09', unitPrice: 3672, taxInclusivePrice: 4149.36, changeRatio: -1.2, supplierName: '广州钢铁集团', priceType: 'market' },
  { historyId: 'H005', pricePeriod: '2025-08', unitPrice: 3716, taxInclusivePrice: 4199.08, changeRatio: 2.1, supplierName: '深圳钢材贸易有限公司', priceType: 'market' },
  { historyId: 'H006', pricePeriod: '2025-07', unitPrice: 3640, taxInclusivePrice: 4113.2, changeRatio: 1.5, supplierName: '深圳钢材贸易有限公司', priceType: 'market' },
];

const MaterialPriceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { priceId } = useParams<{ priceId: string }>();
  const [activeTab, setActiveTab] = useState('basic');

  // 价格历史列定义
  const historyColumns: ColumnsType<PriceHistory> = [
    {
      title: '材价期',
      dataIndex: 'pricePeriod',
      key: 'pricePeriod',
      width: 100,
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
      title: '环比变化',
      dataIndex: 'changeRatio',
      key: 'changeRatio',
      width: 100,
      align: 'right',
      render: (val) => (
        <span style={{ color: val > 0 ? '#f5222d' : val < 0 ? '#52c41a' : '#999' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      width: 100,
      render: (type) => (
        <Tag color={type === 'market' ? 'blue' : 'green'}>
          {type === 'market' ? '市场价' : '合同价'}
        </Tag>
      ),
    },
  ];

  // 基本信息Tab
  const BasicInfoTab = () => (
    <div className="space-y-4">
      <Card size="small" title="材料基本信息">
        <Descriptions column={3} size="small">
          <Descriptions.Item label="材料名称">热轧带肋钢筋</Descriptions.Item>
          <Descriptions.Item label="规格型号">HRB400 Φ12</Descriptions.Item>
          <Descriptions.Item label="品牌">韶钢</Descriptions.Item>
          <Descriptions.Item label="单位">t</Descriptions.Item>
          <Descriptions.Item label="材料大类">钢材</Descriptions.Item>
          <Descriptions.Item label="材料中类">钢筋</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="标准化信息">
        <Descriptions column={3} size="small">
          <Descriptions.Item label="SML编码">SML-ST-001</Descriptions.Item>
          <Descriptions.Item label="标准名称">热轧带肋钢筋</Descriptions.Item>
          <Descriptions.Item label="标准规格">HRB400 Φ12</Descriptions.Item>
        </Descriptions>
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-1">属性映射（ParamMap）</div>
          <div className="flex gap-4 text-sm">
            <span>牌号: HRB400</span>
            <span>直径: 12mm</span>
            <span>长度: 9m/12m</span>
          </div>
        </div>
      </Card>

      <Card size="small" title="价格信息">
        <Row gutter={24}>
          <Col span={8}>
            <div className="p-4 bg-blue-50 rounded text-center">
              <div className="text-sm text-gray-500">不含税单价</div>
              <div className="text-2xl font-bold text-blue-600">¥3,850</div>
              <div className="text-xs text-gray-400">元/t</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-gray-500">含税单价</div>
              <div className="text-2xl font-bold text-green-600">¥4,350.50</div>
              <div className="text-xs text-gray-400">税率: 13%</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="p-4 bg-orange-50 rounded text-center">
              <div className="text-sm text-gray-500">环比变化</div>
              <div className="text-2xl font-bold text-orange-600">+2.5%</div>
              <div className="text-xs text-gray-400">较上月</div>
            </div>
          </Col>
        </Row>
        <Descriptions column={3} size="small" className="mt-4">
          <Descriptions.Item label="价格类型">
            <Tag color="blue">市场价</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="材价期">2025-12</Descriptions.Item>
          <Descriptions.Item label="生效日期">2025-12-01</Descriptions.Item>
          <Descriptions.Item label="质量标识">
            <Tag color="green">正常</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="是否核实">
            <Tag color="blue">已核实</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="核实时间">2025-12-05</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="来源信息">
        <Descriptions column={3} size="small">
          <Descriptions.Item label="数据来源">材价文件上传</Descriptions.Item>
          <Descriptions.Item label="来源类型">供应商报价</Descriptions.Item>
          <Descriptions.Item label="供应商">深圳钢材贸易有限公司</Descriptions.Item>
          <Descriptions.Item label="联系方式">0755-12345678</Descriptions.Item>
          <Descriptions.Item label="来源文件">钢材报价单_202512.xlsx</Descriptions.Item>
          <Descriptions.Item label="入库时间">2025-12-10 14:30:00</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

  // 价格历史Tab
  const PriceHistoryTab = () => (
    <div className="space-y-4">
      <Card size="small" title="价格趋势图">
        <div className="h-48 flex items-end justify-between px-4 pb-8 bg-gray-50 rounded">
          {mockPriceHistory.slice().reverse().map((item) => (
            <div key={item.historyId} className="text-center">
              <div
                className="w-12 bg-blue-500 rounded-t"
                style={{ height: `${((item.unitPrice - 3500) / 500) * 100}%`, minHeight: 20 }}
              />
              <div className="text-xs text-gray-400 mt-1">{item.pricePeriod.slice(5)}</div>
              <div className="text-xs font-medium">¥{item.unitPrice}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card size="small" title="历史价格记录">
        <Table
          rowKey="historyId"
          columns={historyColumns}
          dataSource={mockPriceHistory}
          pagination={false}
          size="small"
        />
      </Card>

      <Card size="small" title="价格统计">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">近6月均价</div>
              <div className="text-xl font-bold">¥3,721</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">最高价</div>
              <div className="text-xl font-bold text-red-500">¥3,850</div>
              <div className="text-xs text-gray-400">2025-12</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">最低价</div>
              <div className="text-xl font-bold text-green-500">¥3,640</div>
              <div className="text-xs text-gray-400">2025-07</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">波动幅度</div>
              <div className="text-xl font-bold">5.8%</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  // 同类比价Tab
  const ComparePriceTab = () => (
    <div className="space-y-4">
      <Card size="small" title="同类材料比价（同规格、同地区、同材价期）">
        <Table
          rowKey="supplierName"
          columns={[
            { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 200 },
            { title: '不含税单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 120, align: 'right' as const, render: (val: number) => `¥${val.toLocaleString()}` },
            { title: '含税单价', dataIndex: 'taxInclusivePrice', key: 'taxInclusivePrice', width: 120, align: 'right' as const, render: (val: number) => `¥${val.toLocaleString()}` },
            { title: '价格类型', dataIndex: 'priceType', key: 'priceType', width: 100, render: (type: string) => <Tag color={type === 'market' ? 'blue' : 'green'}>{type === 'market' ? '市场价' : '合同价'}</Tag> },
            { title: '来源类型', dataIndex: 'sourceType', key: 'sourceType', width: 120 },
          ]}
          dataSource={[
            { supplierName: '深圳钢材贸易有限公司', unitPrice: 3850, taxInclusivePrice: 4350.5, priceType: 'market', sourceType: '供应商报价' },
            { supplierName: '广州钢铁集团', unitPrice: 3880, taxInclusivePrice: 4384.4, priceType: 'market', sourceType: '供应商报价' },
            { supplierName: '东莞钢材市场', unitPrice: 3820, taxInclusivePrice: 4316.6, priceType: 'market', sourceType: '网站采集' },
            { supplierName: '佛山钢材批发', unitPrice: 3900, taxInclusivePrice: 4407, priceType: 'contract', sourceType: '合同价格' },
          ]}
          pagination={false}
          size="small"
        />
      </Card>

      <Card size="small" title="价格分布">
        <Row gutter={16}>
          <Col span={6}>
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-sm text-gray-500">最低价</div>
              <div className="text-xl font-bold text-blue-600">¥3,820</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-gray-500">中位价</div>
              <div className="text-xl font-bold text-green-600">¥3,865</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-sm text-gray-500">最高价</div>
              <div className="text-xl font-bold text-orange-600">¥3,900</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-3 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-500">当前排名</div>
              <div className="text-xl font-bold">2/4</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const tabItems = [
    { key: 'basic', label: '基本信息', children: <BasicInfoTab /> },
    { key: 'history', label: '价格历史', children: <PriceHistoryTab /> },
    { key: 'compare', label: '同类比价', children: <ComparePriceTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">材价详情</span>
            <Tag color="blue">{priceId || 'EMP202510001'}</Tag>
          </Space>
          <Space>
            <Button icon={<LineChartOutlined />}>价格趋势</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
      </Card>

      {/* 材料概要 */}
      <Card size="small">
        <Row gutter={24} align="middle">
          <Col span={12}>
            <div className="text-xl font-bold">热轧带肋钢筋</div>
            <div className="text-gray-500">HRB400 Φ12 | 韶钢 | t</div>
            <div className="mt-2">
              <Tag>钢材</Tag>
              <Tag>钢筋</Tag>
              <Tag color="blue">SML-ST-001</Tag>
            </div>
          </Col>
          <Col span={12} className="text-right">
            <div className="text-3xl font-bold text-blue-600">¥3,850<span className="text-sm text-gray-400">/t</span></div>
            <div className="text-sm">
              <span className="text-gray-500">含税: </span>
              <span className="font-medium">¥4,350.50</span>
              <span className="ml-4 text-red-500">↑2.5%</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">深圳市 | 2025-12 | 市场价</div>
          </Col>
        </Row>
      </Card>

      {/* 详情标签页 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </div>
  );
};

export default MaterialPriceDetailPage;
