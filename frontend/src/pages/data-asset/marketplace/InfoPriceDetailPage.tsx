import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Table,
  Statistic,
  Tabs,
} from 'antd';
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

// 信息价详情数据
const mockDetail = {
  id: 'IP001',
  materialCode: 'C30',
  materialName: '商品混凝土',
  specification: 'C30，塌落度120-160mm',
  brand: '',
  unit: 'm³',
  categoryL1: '混凝土',
  categoryL2: '商品混凝土',
  categoryL3: '普通混凝土',
  categoryPath: '混凝土 > 商品混凝土 > 普通混凝土',
  infoPrice: 485,
  taxRate: 9,
  taxInclusivePrice: 528.65,
  priceType: 'guide',
  provinceName: '广东省',
  cityName: '深圳市',
  pricePeriod: '2024-06',
  effectiveDate: '2024-06-01',
  expireDate: '2024-06-30',
  publishDate: '2024-06-15',
  sourceOrg: '深圳市住房和建设局',
  sourceDoc: '深建价〔2024〕6号',
  momChange: 3.2,
  yoyChange: 5.8,
  lastPeriodPrice: 470,
  smlCode: 'SML-HNT-C30-001',
  mappingConfidence: 0.95,
};

// 历史价格数据
const mockPriceHistory = [
  { period: '2024-06', price: 485, momChange: 3.2, yoyChange: 5.8 },
  { period: '2024-05', price: 470, momChange: 2.2, yoyChange: 4.5 },
  { period: '2024-04', price: 460, momChange: 0, yoyChange: 3.8 },
  { period: '2024-03', price: 460, momChange: 1.1, yoyChange: 4.1 },
  { period: '2024-02', price: 455, momChange: -1.1, yoyChange: 3.2 },
  { period: '2024-01', price: 460, momChange: 0, yoyChange: 2.8 },
  { period: '2023-12', price: 460, momChange: 2.2, yoyChange: 3.5 },
  { period: '2023-11', price: 450, momChange: 0, yoyChange: 2.3 },
  { period: '2023-10', price: 450, momChange: -2.2, yoyChange: 1.8 },
  { period: '2023-09', price: 460, momChange: 0, yoyChange: 2.2 },
  { period: '2023-08', price: 460, momChange: 0.4, yoyChange: 2.5 },
  { period: '2023-07', price: 458, momChange: -0.4, yoyChange: 2.0 },
];

// 跨地区对比数据
const mockRegionCompare = [
  { region: '深圳市', price: 485, diff: 0, diffRatio: 0 },
  { region: '广州市', price: 478, diff: -7, diffRatio: -1.4 },
  { region: '东莞市', price: 465, diff: -20, diffRatio: -4.1 },
  { region: '佛山市', price: 470, diff: -15, diffRatio: -3.1 },
  { region: '惠州市', price: 455, diff: -30, diffRatio: -6.2 },
  { region: '珠海市', price: 480, diff: -5, diffRatio: -1.0 },
];

const InfoPriceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { priceId } = useParams();
  const [isCollected, setIsCollected] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const detail = mockDetail;

  // 获取变动标签
  const getChangeTag = (value: number) => {
    if (value > 0) {
      return <Tag color="red" icon={<RiseOutlined />}>+{value.toFixed(1)}%</Tag>;
    } else if (value < 0) {
      return <Tag color="green" icon={<FallOutlined />}>{value.toFixed(1)}%</Tag>;
    }
    return <Tag>持平</Tag>;
  };

  // 历史价格列定义
  const historyColumns: ColumnsType<typeof mockPriceHistory[0]> = [
    { title: '材价期', dataIndex: 'period', key: 'period', width: 100 },
    {
      title: '信息价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (v) => <span className="font-medium">¥{v}</span>,
    },
    {
      title: '环比',
      dataIndex: 'momChange',
      key: 'mom',
      width: 100,
      align: 'center',
      render: (v) => getChangeTag(v),
    },
    {
      title: '同比',
      dataIndex: 'yoyChange',
      key: 'yoy',
      width: 100,
      align: 'center',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : v < 0 ? 'text-green-500' : ''}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </span>
      ),
    },
  ];

  // 地区对比列定义
  const regionColumns: ColumnsType<typeof mockRegionCompare[0]> = [
    { title: '地区', dataIndex: 'region', key: 'region', width: 100 },
    {
      title: '信息价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (v) => <span className="font-medium">¥{v}</span>,
    },
    {
      title: '价差',
      dataIndex: 'diff',
      key: 'diff',
      width: 100,
      align: 'right',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : v < 0 ? 'text-green-500' : ''}>
          {v > 0 ? '+' : ''}{v}
        </span>
      ),
    },
    {
      title: '差异率',
      dataIndex: 'diffRatio',
      key: 'diffRatio',
      width: 100,
      align: 'center',
      render: (v) => (
        <span className={v > 0 ? 'text-red-500' : v < 0 ? 'text-green-500' : ''}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}%
        </span>
      ),
    },
  ];

  // 基本信息Tab
  const BasicTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="材料信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="材料名称">{detail.materialName}</Descriptions.Item>
              <Descriptions.Item label="规格型号">{detail.specification}</Descriptions.Item>
              <Descriptions.Item label="计量单位">{detail.unit}</Descriptions.Item>
              <Descriptions.Item label="材料编码">{detail.materialCode}</Descriptions.Item>
              <Descriptions.Item label="品牌">{detail.brand || '不限'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="分类信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="大类">
                <Tag color="blue">{detail.categoryL1}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="中类">{detail.categoryL2}</Descriptions.Item>
              <Descriptions.Item label="小类">{detail.categoryL3}</Descriptions.Item>
              <Descriptions.Item label="分类路径">{detail.categoryPath}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="价格信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="信息价(不含税)">
                <span className="text-xl font-bold text-blue-600">¥{detail.infoPrice}</span>
                <span className="text-gray-400 ml-1">/{detail.unit}</span>
              </Descriptions.Item>
              <Descriptions.Item label="税率">{detail.taxRate}%</Descriptions.Item>
              <Descriptions.Item label="含税价">¥{detail.taxInclusivePrice}</Descriptions.Item>
              <Descriptions.Item label="价格类型">
                <Tag color="cyan">指导价</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="发布信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="发布单位">{detail.sourceOrg}</Descriptions.Item>
              <Descriptions.Item label="发布文号">{detail.sourceDoc}</Descriptions.Item>
              <Descriptions.Item label="材价期">{detail.pricePeriod}</Descriptions.Item>
              <Descriptions.Item label="有效期">
                {detail.effectiveDate} 至 {detail.expireDate}
              </Descriptions.Item>
              <Descriptions.Item label="发布日期">{detail.publishDate}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Card size="small" title="标准化映射">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="标准材料编码">{detail.smlCode}</Descriptions.Item>
          <Descriptions.Item label="映射置信度">
            <Tag color={detail.mappingConfidence >= 0.9 ? 'green' : 'orange'}>
              {(detail.mappingConfidence * 100).toFixed(0)}%
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

  // 价格趋势Tab
  const TrendTab = () => (
    <div className="space-y-4">
      <Card size="small" title="价格走势图（示意）">
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center text-gray-400">
            <LineChartOutlined style={{ fontSize: 48 }} />
            <div className="mt-2">近12个月价格走势</div>
            <div className="text-xs">最高: ¥485 | 最低: ¥450 | 平均: ¥462</div>
          </div>
        </div>
      </Card>

      <Card size="small" title="历史价格记录">
        <Table
          rowKey="period"
          columns={historyColumns}
          dataSource={mockPriceHistory}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // 地区对比Tab
  const RegionTab = () => (
    <div className="space-y-4">
      <Card size="small" title="跨地区价格对比">
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <div className="text-sm">
            对比基准：<Tag color="blue">{detail.cityName}</Tag>
            <span className="ml-2">信息价：¥{detail.infoPrice}/{detail.unit}</span>
          </div>
        </div>
        <Table
          rowKey="region"
          columns={regionColumns}
          dataSource={mockRegionCompare}
          pagination={false}
          size="small"
        />
      </Card>

      <Card size="small" title="地区价格分布（示意）">
        <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-lg">地区价格热力图</div>
            <div className="text-xs mt-2">展示不同地区的价格差异分布</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    { key: 'basic', label: '基本信息', children: <BasicTab /> },
    { key: 'trend', label: '价格趋势', children: <TrendTab /> },
    { key: 'region', label: '地区对比', children: <RegionTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span className="text-lg font-medium">{detail.materialName}</span>
            <Tag color="blue">{detail.categoryL1}</Tag>
            {isCollected ? (
              <StarFilled style={{ color: '#faad14', fontSize: 18 }} onClick={() => setIsCollected(false)} />
            ) : (
              <StarOutlined style={{ fontSize: 18 }} onClick={() => setIsCollected(true)} />
            )}
          </Space>
          <Space>
            <Button icon={<BellOutlined />}>订阅价格变动</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <Space split={<span className="text-gray-300">|</span>}>
            <span>{detail.specification}</span>
            <span>{detail.cityName}</span>
            <span>{detail.pricePeriod}</span>
            <span>{detail.sourceOrg}</span>
          </Space>
        </div>
      </Card>

      {/* 价格概览 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">信息价(不含税)</div>
              <div className="text-2xl font-bold text-blue-600">¥{detail.infoPrice}</div>
              <div className="text-xs text-gray-400">/{detail.unit}</div>
            </div>
          </Col>
          <Col span={4}>
            <Statistic
              title="含税价"
              value={detail.taxInclusivePrice}
              prefix="¥"
              precision={2}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="上期价格"
              value={detail.lastPeriodPrice}
              prefix="¥"
            />
          </Col>
          <Col span={5}>
            <div className="text-center">
              <div className="text-sm text-gray-500">环比变化</div>
              <div className="mt-1">{getChangeTag(detail.momChange)}</div>
            </div>
          </Col>
          <Col span={5}>
            <div className="text-center">
              <div className="text-sm text-gray-500">同比变化</div>
              <div className="mt-1">{getChangeTag(detail.yoyChange)}</div>
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

export default InfoPriceDetailPage;
