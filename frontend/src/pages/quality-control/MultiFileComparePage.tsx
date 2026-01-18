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
  Tabs,
  Select,
  Descriptions,
} from 'antd';
import {
  UploadOutlined,
  SwapOutlined,
  FileTextOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// 对比类型
type CompareType = 'bidClearing' | 'settlement' | 'budget' | 'benchmark';

// 对比项数据类型
interface CompareItem {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  baseQty: number;
  basePrice: number;
  baseAmount: number;
  compareQty: number;
  comparePrice: number;
  compareAmount: number;
  qtyDeviation: number;
  priceDeviation: number;
  amountDeviation: number;
  riskLevel: 'high' | 'medium' | 'low' | 'normal';
}

// 模拟对比数据
const mockCompareItems: CompareItem[] = [
  { id: '1', itemCode: '010101001', itemName: '挖一般土方', unit: 'm³', baseQty: 5000, basePrice: 28.5, baseAmount: 142500, compareQty: 5200, comparePrice: 26.8, compareAmount: 139360, qtyDeviation: 4.0, priceDeviation: -6.0, amountDeviation: -2.2, riskLevel: 'low' },
  { id: '2', itemCode: '010301001', itemName: '土方回填', unit: 'm³', baseQty: 3500, basePrice: 18.2, baseAmount: 63700, compareQty: 3500, comparePrice: 12.5, compareAmount: 43750, qtyDeviation: 0, priceDeviation: -31.3, amountDeviation: -31.3, riskLevel: 'high' },
  { id: '3', itemCode: '020101001', itemName: '砖基础', unit: 'm³', baseQty: 280, basePrice: 485, baseAmount: 135800, compareQty: 280, comparePrice: 520, compareAmount: 145600, qtyDeviation: 0, priceDeviation: 7.2, amountDeviation: 7.2, riskLevel: 'medium' },
  { id: '4', itemCode: '030101001', itemName: '现浇混凝土基础', unit: 'm³', baseQty: 1200, basePrice: 680, baseAmount: 816000, compareQty: 1180, comparePrice: 695, compareAmount: 820100, qtyDeviation: -1.7, priceDeviation: 2.2, amountDeviation: 0.5, riskLevel: 'normal' },
  { id: '5', itemCode: '030201001', itemName: '现浇混凝土柱', unit: 'm³', baseQty: 450, basePrice: 720, baseAmount: 324000, compareQty: 450, comparePrice: 580, compareAmount: 261000, qtyDeviation: 0, priceDeviation: -19.4, amountDeviation: -19.4, riskLevel: 'high' },
  { id: '6', itemCode: '030301001', itemName: '现浇混凝土梁', unit: 'm³', baseQty: 680, basePrice: 750, baseAmount: 510000, compareQty: 700, comparePrice: 820, compareAmount: 574000, qtyDeviation: 2.9, priceDeviation: 9.3, amountDeviation: 12.5, riskLevel: 'medium' },
  { id: '7', itemCode: '040101001', itemName: '钢筋制安', unit: 't', baseQty: 850, basePrice: 5200, baseAmount: 4420000, compareQty: 820, comparePrice: 4800, compareAmount: 3936000, qtyDeviation: -3.5, priceDeviation: -7.7, amountDeviation: -11.0, riskLevel: 'high' },
];

// 对比汇总数据
const mockCompareSummary = {
  baseFile: '某医院门诊楼招标控制价.xml',
  compareFile: '某医院门诊楼投标报价-A公司.xml',
  baseTotal: 85000000,
  compareTotal: 82500000,
  deviation: -2.94,
  itemCount: 1256,
  deviationItems: 186,
  highRiskItems: 12,
  mediumRiskItems: 35,
};

const MultiFileComparePage: React.FC = () => {
  const [compareType, setCompareType] = useState<CompareType>('bidClearing');
  const [hasFiles, setHasFiles] = useState(false);
  const [compareComplete, setCompareComplete] = useState(false);

  // 获取风险等级标签
  const getRiskTag = (level: string) => {
    const map: Record<string, { color: string; text: string }> = {
      high: { color: 'red', text: '高风险' },
      medium: { color: 'orange', text: '中风险' },
      low: { color: 'blue', text: '低风险' },
      normal: { color: 'green', text: '正常' },
    };
    const r = map[level] || { color: 'default', text: level };
    return <Tag color={r.color}>{r.text}</Tag>;
  };

  // 获取偏离率显示
  const getDeviationDisplay = (value: number) => {
    if (value === 0) return <span>0%</span>;
    const color = Math.abs(value) > 10 ? 'text-red-500' : Math.abs(value) > 5 ? 'text-orange-500' : '';
    const icon = value > 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <span className={color}>
        {icon} {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };

  // 对比项列定义
  const compareColumns: ColumnsType<CompareItem> = [
    { title: '清单编码', dataIndex: 'itemCode', key: 'itemCode', width: 100, fixed: 'left' },
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60, align: 'center' },
    {
      title: '基准文件',
      children: [
        { title: '数量', dataIndex: 'baseQty', key: 'baseQty', width: 80, align: 'right', render: (v) => v.toLocaleString() },
        { title: '单价', dataIndex: 'basePrice', key: 'basePrice', width: 80, align: 'right', render: (v) => v.toLocaleString() },
        { title: '合价', dataIndex: 'baseAmount', key: 'baseAmount', width: 100, align: 'right', render: (v) => v.toLocaleString() },
      ],
    },
    {
      title: '对比文件',
      children: [
        { title: '数量', dataIndex: 'compareQty', key: 'compareQty', width: 80, align: 'right', render: (v) => v.toLocaleString() },
        { title: '单价', dataIndex: 'comparePrice', key: 'comparePrice', width: 80, align: 'right', render: (v) => v.toLocaleString() },
        { title: '合价', dataIndex: 'compareAmount', key: 'compareAmount', width: 100, align: 'right', render: (v) => v.toLocaleString() },
      ],
    },
    {
      title: '偏离分析',
      children: [
        { title: '数量偏离', dataIndex: 'qtyDeviation', key: 'qtyDeviation', width: 90, align: 'center', render: (v) => getDeviationDisplay(v) },
        { title: '单价偏离', dataIndex: 'priceDeviation', key: 'priceDeviation', width: 90, align: 'center', render: (v) => getDeviationDisplay(v) },
        { title: '合价偏离', dataIndex: 'amountDeviation', key: 'amountDeviation', width: 90, align: 'center', render: (v) => getDeviationDisplay(v) },
      ],
    },
    {
      title: '风险',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 80,
      fixed: 'right',
      render: (v) => getRiskTag(v),
    },
  ];

  // 模拟上传文件
  const handleUpload = () => {
    setHasFiles(true);
    setTimeout(() => {
      setCompareComplete(true);
    }, 1500);
  };

  // 对比类型选项
  const compareTypeOptions = [
    { label: '清标（投标 vs 控制价）', value: 'bidClearing' },
    { label: '结算复核（结算 vs 合同价）', value: 'settlement' },
    { label: '概算归集（各阶段 vs 概算）', value: 'budget' },
    { label: '对标分析（项目 vs 同类均值）', value: 'benchmark' },
  ];

  // 渲染上传区域
  const renderUploadArea = () => (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-lg font-medium mb-4">选择对比类型</div>
          <Select
            value={compareType}
            onChange={setCompareType}
            options={compareTypeOptions}
            style={{ width: 300 }}
            size="large"
          />
        </div>

        <Row gutter={24}>
          <Col span={11}>
            <Card className="text-center bg-gray-50">
              <div className="py-8">
                <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <div className="mt-4 text-lg">基准文件</div>
                <div className="text-gray-400 mb-4">
                  {compareType === 'bidClearing' && '招标控制价'}
                  {compareType === 'settlement' && '合同价'}
                  {compareType === 'budget' && '批复概算'}
                  {compareType === 'benchmark' && '当前项目'}
                </div>
                <Upload showUploadList={false}>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </div>
            </Card>
          </Col>
          <Col span={2} className="flex items-center justify-center">
            <SwapOutlined style={{ fontSize: 32, color: '#1890ff' }} />
          </Col>
          <Col span={11}>
            <Card className="text-center bg-gray-50">
              <div className="py-8">
                <FileTextOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                <div className="mt-4 text-lg">对比文件</div>
                <div className="text-gray-400 mb-4">
                  {compareType === 'bidClearing' && '投标报价'}
                  {compareType === 'settlement' && '结算文件'}
                  {compareType === 'budget' && '各阶段造价'}
                  {compareType === 'benchmark' && '同类项目均值'}
                </div>
                <Upload showUploadList={false}>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <Button type="primary" size="large" icon={<SwapOutlined />} onClick={handleUpload}>
            开始对比
          </Button>
        </div>
      </div>
    </Card>
  );

  // 渲染对比结果
  const renderCompareResult = () => (
    <div className="space-y-4">
      {/* 文件信息 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="基准文件">
                <Tag color="blue">{mockCompareSummary.baseFile}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={4} className="text-center">
            <SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          </Col>
          <Col span={10}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="对比文件">
                <Tag color="green">{mockCompareSummary.compareFile}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* 对比概览 */}
      <Row gutter={16}>
        <Col span={5}>
          <Card size="small">
            <Statistic
              title="基准总价"
              value={mockCompareSummary.baseTotal}
              prefix="¥"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small">
            <Statistic
              title="对比总价"
              value={mockCompareSummary.compareTotal}
              prefix="¥"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="总价偏离"
              value={mockCompareSummary.deviation}
              precision={2}
              suffix="%"
              prefix={mockCompareSummary.deviation < 0 ? <FallOutlined /> : <RiseOutlined />}
              valueStyle={{ color: mockCompareSummary.deviation < 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small">
            <Statistic
              title="偏离项"
              value={mockCompareSummary.deviationItems}
              suffix={`/ ${mockCompareSummary.itemCount}`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small">
            <div className="flex justify-between items-center">
              <Statistic title="风险项" value={mockCompareSummary.highRiskItems + mockCompareSummary.mediumRiskItems} />
              <div className="text-xs text-right">
                <div className="text-red-500">高风险 {mockCompareSummary.highRiskItems}</div>
                <div className="text-orange-500">中风险 {mockCompareSummary.mediumRiskItems}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Space>
            <span className="text-gray-500">筛选：</span>
            <Select
              placeholder="风险等级"
              style={{ width: 120 }}
              allowClear
              options={[
                { label: '高风险', value: 'high' },
                { label: '中风险', value: 'medium' },
                { label: '低风险', value: 'low' },
                { label: '正常', value: 'normal' },
              ]}
            />
            <Select
              placeholder="分部分项"
              style={{ width: 150 }}
              allowClear
              options={[
                { label: '土石方工程', value: 'earth' },
                { label: '砌筑工程', value: 'masonry' },
                { label: '混凝土工程', value: 'concrete' },
                { label: '钢筋工程', value: 'rebar' },
              ]}
            />
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />}>导出报告</Button>
            <Button type="primary" onClick={() => { setHasFiles(false); setCompareComplete(false); }}>
              新建对比
            </Button>
          </Space>
        </div>
      </Card>

      {/* 对比明细 */}
      <Card size="small" title="对比明细">
        <Table
          rowKey="id"
          columns={compareColumns}
          dataSource={mockCompareItems}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 项`,
          }}
          size="small"
          scroll={{ x: 1400 }}
          bordered
        />
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">多文件对比</span>
          <Tabs
            activeKey={compareType}
            onChange={(v) => setCompareType(v as CompareType)}
            size="small"
            items={compareTypeOptions.map(o => ({ key: o.value, label: o.label.split('（')[0] }))}
          />
        </div>
      </Card>

      {/* 内容区 */}
      {!compareComplete ? renderUploadArea() : renderCompareResult()}
    </div>
  );
};

export default MultiFileComparePage;
