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
  CopyOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

// 定额子目数据类型
interface QuotaDetail {
  detailId: string;
  quotaCode: string;
  quotaName: string;
  quotaUnit: string;
  quotaQuantity: number;
  laborCost: number;
  materialCost: number;
  machineCost: number;
  quotaPrice: number;
  totalPrice: number;
}

// 材料明细数据类型
interface MaterialDetail {
  detailId: string;
  materialName: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isMainMaterial: boolean;
}

// 机械明细数据类型
interface MachineDetail {
  detailId: string;
  machineName: string;
  specification: string;
  unit: string;
  shiftQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

// 模拟定额子目数据
const mockQuotaDetails: QuotaDetail[] = [
  {
    detailId: 'Q001',
    quotaCode: '1-1-15',
    quotaName: '挖基坑土方 普通土 深≤2m',
    quotaUnit: '100m³',
    quotaQuantity: 12.50,
    laborCost: 86.50,
    materialCost: 12.30,
    machineCost: 245.80,
    quotaPrice: 344.60,
    totalPrice: 4307.50,
  },
];

// 模拟材料明细数据
const mockMaterialDetails: MaterialDetail[] = [
  {
    detailId: 'M001',
    materialName: '其他材料费',
    specification: '-',
    unit: '元',
    quantity: 1,
    unitPrice: 4.62,
    totalPrice: 4.62,
    isMainMaterial: false,
  },
];

// 模拟机械明细数据
const mockMachineDetails: MachineDetail[] = [
  {
    detailId: 'MC001',
    machineName: '履带式液压挖掘机',
    specification: '1m³',
    unit: '台班',
    shiftQuantity: 0.085,
    unitPrice: 856.50,
    totalPrice: 72.80,
  },
  {
    detailId: 'MC002',
    machineName: '自卸汽车',
    specification: '8t',
    unit: '台班',
    shiftQuantity: 0.125,
    unitPrice: 458.20,
    totalPrice: 57.28,
  },
];

const CompositePriceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { compositeId } = useParams<{ compositeId: string }>();
  const [activeTab, setActiveTab] = useState('basic');

  // 定额子目列定义
  const quotaColumns: ColumnsType<QuotaDetail> = [
    { title: '定额编号', dataIndex: 'quotaCode', key: 'quotaCode', width: 100 },
    {
      title: '定额名称',
      dataIndex: 'quotaName',
      key: 'quotaName',
      width: 200,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="text-xs text-gray-400">
            人工: ¥{record.laborCost} | 材料: ¥{record.materialCost} | 机械: ¥{record.machineCost}
          </div>
        </div>
      ),
    },
    { title: '单位', dataIndex: 'quotaUnit', key: 'quotaUnit', width: 80 },
    { title: '工程量', dataIndex: 'quotaQuantity', key: 'quotaQuantity', width: 80, align: 'right' },
    { title: '定额单价', dataIndex: 'quotaPrice', key: 'quotaPrice', width: 100, align: 'right', render: (val) => `¥${val.toFixed(2)}` },
    { title: '合价', dataIndex: 'totalPrice', key: 'totalPrice', width: 100, align: 'right', render: (val) => <span className="font-medium">¥{val.toFixed(2)}</span> },
  ];

  // 材料明细列定义
  const materialColumns: ColumnsType<MaterialDetail> = [
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName', width: 160 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '用量', dataIndex: 'quantity', key: 'quantity', width: 80, align: 'right' },
    { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 80, align: 'right', render: (val) => `¥${val.toFixed(2)}` },
    { title: '合价', dataIndex: 'totalPrice', key: 'totalPrice', width: 80, align: 'right', render: (val) => `¥${val.toFixed(2)}` },
    {
      title: '主材',
      dataIndex: 'isMainMaterial',
      key: 'isMainMaterial',
      width: 60,
      render: (val) => val ? <Tag color="blue">是</Tag> : <Tag>否</Tag>,
    },
  ];

  // 机械明细列定义
  const machineColumns: ColumnsType<MachineDetail> = [
    { title: '机械名称', dataIndex: 'machineName', key: 'machineName', width: 160 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '台班', dataIndex: 'shiftQuantity', key: 'shiftQuantity', width: 80, align: 'right' },
    { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 100, align: 'right', render: (val) => `¥${val.toFixed(2)}` },
    { title: '合价', dataIndex: 'totalPrice', key: 'totalPrice', width: 100, align: 'right', render: (val) => `¥${val.toFixed(2)}` },
  ];

  // 基本信息Tab
  const BasicInfoTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="清单信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="项目编码">010101001</Descriptions.Item>
              <Descriptions.Item label="项目名称">挖基坑土方</Descriptions.Item>
              <Descriptions.Item label="项目特征">
                <div>土质：普通土</div>
                <div>深度：≤2m</div>
              </Descriptions.Item>
              <Descriptions.Item label="计量单位">m³</Descriptions.Item>
              <Descriptions.Item label="工程量">1,250.00</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="标准化信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="SBOQ编码">SBOQ-0101-001</Descriptions.Item>
              <Descriptions.Item label="清单大类">土石方工程</Descriptions.Item>
              <Descriptions.Item label="清单中类">挖土方</Descriptions.Item>
              <Descriptions.Item label="清单小类">挖基坑土方</Descriptions.Item>
              <Descriptions.Item label="特征映射">
                <Tag>土质=普通土</Tag>
                <Tag>深度=2m</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card size="small" title="综合单价构成">
        <Row gutter={24}>
          <Col span={4}>
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-sm text-gray-500">人工费</div>
              <div className="text-xl font-bold text-blue-600">¥6.93</div>
              <div className="text-xs text-gray-400">18%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-gray-500">材料费</div>
              <div className="text-xl font-bold text-green-600">¥4.62</div>
              <div className="text-xs text-gray-400">12%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-sm text-gray-500">机械费</div>
              <div className="text-xl font-bold text-orange-600">¥26.95</div>
              <div className="text-xs text-gray-400">70%</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="p-3 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-500">管理费</div>
              <div className="text-xl font-bold">¥0.00</div>
              <div className="text-xs text-gray-400">-</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="p-3 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-500">利润</div>
              <div className="text-xl font-bold">¥0.00</div>
              <div className="text-xs text-gray-400">-</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="p-3 bg-purple-50 rounded text-center">
              <div className="text-sm text-gray-500">综合单价</div>
              <div className="text-xl font-bold text-purple-600">¥38.50</div>
              <div className="text-xs text-gray-400">100%</div>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">费用构成图</div>
          <div className="flex h-6 rounded overflow-hidden">
            <div className="bg-blue-500 flex items-center justify-center text-white text-xs" style={{ width: '18%' }}>人工18%</div>
            <div className="bg-green-500 flex items-center justify-center text-white text-xs" style={{ width: '12%' }}>材12%</div>
            <div className="bg-orange-500 flex items-center justify-center text-white text-xs" style={{ width: '70%' }}>机械70%</div>
          </div>
        </div>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="时空维度">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="材价期">2025-06</Descriptions.Item>
              <Descriptions.Item label="定额版本">广东2018</Descriptions.Item>
              <Descriptions.Item label="省份">广东省</Descriptions.Item>
              <Descriptions.Item label="城市">深圳市</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="来源信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="来源项目">深圳某办公楼项目</Descriptions.Item>
              <Descriptions.Item label="计价阶段">预算</Descriptions.Item>
              <Descriptions.Item label="功能标签">办公建筑</Descriptions.Item>
              <Descriptions.Item label="来源文件">xxx预算.gcz</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 组价明细Tab
  const QuotaDetailTab = () => (
    <div className="space-y-4">
      <Card size="small" title="定额子目">
        <Table
          rowKey="detailId"
          columns={quotaColumns}
          dataSource={mockQuotaDetails}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} className="text-right font-medium">
                定额小计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="text-right font-medium">
                ¥4,307.50
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card size="small" title="材料明细">
        <Table
          rowKey="detailId"
          columns={materialColumns}
          dataSource={mockMaterialDetails}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} className="text-right font-medium">
                材料费小计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="text-right font-medium">
                ¥4.62
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card size="small" title="机械明细">
        <Table
          rowKey="detailId"
          columns={machineColumns}
          dataSource={mockMachineDetails}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} className="text-right font-medium">
                机械费小计（含机上人工）
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="text-right font-medium">
                ¥26.95
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );

  // 费用构成Tab
  const CompositionTab = () => (
    <div className="space-y-4">
      <Card size="small" title="费用构成分析">
        <Row gutter={16}>
          <Col span={12}>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="45.24 108.58" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="20" strokeDasharray="30.16 123.66" strokeDashoffset="-45.24" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="20" strokeDasharray="75.4 78.42" strokeDashoffset="-75.4" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">¥38.50</div>
                    <div className="text-xs text-gray-400">综合单价</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded mr-1" />人工费 18%</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded mr-1" />材料费 12%</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-orange-500 rounded mr-1" />机械费 70%</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>人工费</span>
                  <span>¥6.93 (18%)</span>
                </div>
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '18%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>材料费</span>
                  <span>¥4.62 (12%)</span>
                </div>
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '12%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>机械费</span>
                  <span>¥26.95 (70%)</span>
                </div>
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card size="small" title="与同类对比">
        <Table
          rowKey="item"
          columns={[
            { title: '对比项', dataIndex: 'item', key: 'item', width: 120 },
            { title: '当前值', dataIndex: 'current', key: 'current', width: 100, align: 'right' as const },
            { title: '同类均值', dataIndex: 'avg', key: 'avg', width: 100, align: 'right' as const },
            { title: '偏差', dataIndex: 'deviation', key: 'deviation', width: 80, align: 'right' as const, render: (val: string) => <span style={{ color: val.startsWith('-') ? '#52c41a' : val === '0%' ? '#999' : '#f5222d' }}>{val}</span> },
          ]}
          dataSource={[
            { item: '综合单价', current: '¥38.50', avg: '¥36.80', deviation: '+4.6%' },
            { item: '人工费占比', current: '18%', avg: '17%', deviation: '+1%' },
            { item: '材料费占比', current: '12%', avg: '11%', deviation: '+1%' },
            { item: '机械费占比', current: '70%', avg: '72%', deviation: '-2%' },
          ]}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // 价格趋势Tab
  const TrendTab = () => (
    <div className="space-y-4">
      <Card size="small" title="价格趋势">
        <div className="h-48 flex items-end justify-between px-4 pb-8 bg-gray-50 rounded">
          {[35.20, 36.50, 37.80, 38.20, 38.50, 38.50].map((price, idx) => (
            <div key={idx} className="text-center">
              <div
                className="w-12 bg-blue-500 rounded-t"
                style={{ height: `${((price - 34) / 6) * 100}%`, minHeight: 20 }}
              />
              <div className="text-xs text-gray-400 mt-1">
                {['1月', '2月', '3月', '4月', '5月', '6月'][idx]}
              </div>
              <div className="text-xs font-medium">¥{price}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card size="small" title="趋势统计">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">近6月均价</div>
              <div className="text-xl font-bold">¥37.45</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">累计涨幅</div>
              <div className="text-xl font-bold text-red-500">+9.4%</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">环比变化</div>
              <div className="text-xl font-bold">0%</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">同比变化</div>
              <div className="text-xl font-bold text-red-500">+8.2%</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  // 同类对比Tab
  const CompareTab = () => (
    <Card size="small" title="同类综价对比（同清单、同特征、同地区、同材价期）">
      <Table
        rowKey="project"
        columns={[
          { title: '来源项目', dataIndex: 'project', key: 'project', width: 180 },
          { title: '综合单价', dataIndex: 'price', key: 'price', width: 100, align: 'right' as const, render: (val: number) => <span className="font-medium">¥{val.toFixed(2)}</span> },
          { title: '人工费', dataIndex: 'labor', key: 'labor', width: 80, align: 'right' as const, render: (val: number) => `¥${val.toFixed(2)}` },
          { title: '材料费', dataIndex: 'material', key: 'material', width: 80, align: 'right' as const, render: (val: number) => `¥${val.toFixed(2)}` },
          { title: '机械费', dataIndex: 'machine', key: 'machine', width: 80, align: 'right' as const, render: (val: number) => `¥${val.toFixed(2)}` },
          { title: '计价阶段', dataIndex: 'stage', key: 'stage', width: 80 },
        ]}
        dataSource={[
          { project: '深圳某办公楼项目', price: 38.50, labor: 6.93, material: 4.62, machine: 26.95, stage: '预算' },
          { project: '深圳某商业项目', price: 37.80, labor: 6.80, material: 4.50, machine: 26.50, stage: '预算' },
          { project: '深圳某住宅项目', price: 39.20, labor: 7.06, material: 4.70, machine: 27.44, stage: '结算' },
          { project: '深圳某学校项目', price: 36.50, labor: 6.57, material: 4.38, machine: 25.55, stage: '预算' },
        ]}
        pagination={false}
        size="small"
      />
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">最低价</div>
              <div className="text-lg font-bold text-green-600">¥36.50</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">中位价</div>
              <div className="text-lg font-bold text-blue-600">¥38.15</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">最高价</div>
              <div className="text-lg font-bold text-red-600">¥39.20</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">当前排名</div>
              <div className="text-lg font-bold">2/4</div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  const tabItems = [
    { key: 'basic', label: '基本信息', children: <BasicInfoTab /> },
    { key: 'quota', label: '组价明细', children: <QuotaDetailTab /> },
    { key: 'composition', label: '费用构成', children: <CompositionTab /> },
    { key: 'trend', label: '价格趋势', children: <TrendTab /> },
    { key: 'compare', label: '同类对比', children: <CompareTab /> },
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
            <span className="text-lg font-medium">综价详情</span>
            <Tag color="blue">{compositeId || 'ECP202506001'}</Tag>
            <Tag color="green">组价完整</Tag>
          </Space>
          <Space>
            <Button icon={<SaveOutlined />}>保存为模板</Button>
            <Button type="primary" icon={<CopyOutlined />}>套用组价</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
      </Card>

      {/* 综价概要 */}
      <Card size="small">
        <Row gutter={24} align="middle">
          <Col span={14}>
            <div className="text-xl font-bold">挖基坑土方</div>
            <div className="text-gray-500">土质:普通土 深度:≤2m | m³</div>
            <div className="mt-2">
              <Tag>土石方工程</Tag>
              <Tag>挖土方</Tag>
              <Tag color="blue">SBOQ-0101-001</Tag>
              <Tag color="purple">广东2018</Tag>
            </div>
          </Col>
          <Col span={10} className="text-right">
            <div className="text-3xl font-bold text-blue-600">¥38.50<span className="text-sm text-gray-400">/m³</span></div>
            <div className="text-sm mt-1">
              <span className="text-blue-500">人工¥6.93</span>
              <span className="mx-2">|</span>
              <span className="text-green-500">材料¥4.62</span>
              <span className="mx-2">|</span>
              <span className="text-orange-500">机械¥26.95</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">深圳市 | 2025-06</div>
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

export default CompositePriceDetailPage;
