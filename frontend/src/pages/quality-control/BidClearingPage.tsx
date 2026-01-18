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
  Alert,
  Badge,
  Descriptions,
  Steps,
  List,
  Progress,
} from 'antd';
import {
  UploadOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// 投标人数据类型
interface Bidder {
  id: string;
  name: string;
  fileName: string;
  totalAmount: number;
  itemCount: number;
  deviation: number;
  complianceStatus: 'pass' | 'warning' | 'error';
  complianceIssues: number;
  priceDeviations: number;
  unbalancedIndex: number;
}

// 对比项数据类型
interface CompareItem {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  baselinePrice: number;
  baselineAmount: number;
  bidPrices: { bidderId: string; price: number; deviation: number }[];
}

// 问题数据类型
interface ClearingIssue {
  id: string;
  issueType: 'compliance' | 'price' | 'collusion';
  severity: 'error' | 'warning' | 'info';
  bidderName: string;
  title: string;
  description: string;
  riskLevel: string;
}

// 模拟基准文件
const mockBaseline = {
  fileName: '某住宅项目招标控制价.gcz',
  totalAmount: 56800000,
  itemCount: 186,
  uploadTime: '2026-01-18 10:00:00',
};

// 模拟投标人数据
const mockBidders: Bidder[] = [
  { id: '1', name: '戊工程集团', fileName: '戊工程集团投标文件.gcz', totalAmount: 54800000, itemCount: 186, deviation: -3.5, complianceStatus: 'pass', complianceIssues: 0, priceDeviations: 5, unbalancedIndex: 0.12 },
  { id: '2', name: '甲建设公司', fileName: '甲建设公司投标文件.gcz', totalAmount: 55200000, itemCount: 186, deviation: -2.8, complianceStatus: 'warning', complianceIssues: 3, priceDeviations: 8, unbalancedIndex: 0.32 },
  { id: '3', name: '丙施工单位', fileName: '丙施工单位投标文件.gcz', totalAmount: 55800000, itemCount: 186, deviation: -1.8, complianceStatus: 'pass', complianceIssues: 0, priceDeviations: 4, unbalancedIndex: 0.18 },
  { id: '4', name: '乙工程公司', fileName: '乙工程公司投标文件.gcz', totalAmount: 56500000, itemCount: 186, deviation: -0.5, complianceStatus: 'pass', complianceIssues: 0, priceDeviations: 6, unbalancedIndex: 0.15 },
  { id: '5', name: '丁建筑公司', fileName: '丁建筑公司投标文件.gcz', totalAmount: 57100000, itemCount: 185, deviation: 0.5, complianceStatus: 'error', complianceIssues: 1, priceDeviations: 3, unbalancedIndex: 0.08 },
];

// 模拟单价对比数据
const mockCompareItems: CompareItem[] = [
  { id: '1', itemCode: '010501004001', itemName: '现浇混凝土矩形柱C30', unit: 'm³', quantity: 125.6, baselinePrice: 580, baselineAmount: 72848, bidPrices: [{ bidderId: '1', price: 520, deviation: -10.3 }, { bidderId: '2', price: 535, deviation: -7.8 }, { bidderId: '3', price: 528, deviation: -9.0 }, { bidderId: '4', price: 560, deviation: -3.4 }, { bidderId: '5', price: 575, deviation: -0.9 }] },
  { id: '2', itemCode: '010503001001', itemName: '现浇混凝土板C30', unit: 'm³', quantity: 256.8, baselinePrice: 420, baselineAmount: 107856, bidPrices: [{ bidderId: '1', price: 380, deviation: -9.5 }, { bidderId: '2', price: 280, deviation: -33.3 }, { bidderId: '3', price: 415, deviation: -1.2 }, { bidderId: '4', price: 400, deviation: -4.8 }, { bidderId: '5', price: 430, deviation: 2.4 }] },
  { id: '3', itemCode: '010501003001', itemName: '现浇混凝土梁C30', unit: 'm³', quantity: 189.5, baselinePrice: 650, baselineAmount: 123175, bidPrices: [{ bidderId: '1', price: 620, deviation: -4.6 }, { bidderId: '2', price: 680, deviation: 4.6 }, { bidderId: '3', price: 645, deviation: -0.8 }, { bidderId: '4', price: 660, deviation: 1.5 }, { bidderId: '5', price: 655, deviation: 0.8 }] },
  { id: '4', itemCode: '010416001001', itemName: '钢筋制安HRB400', unit: 't', quantity: 85.2, baselinePrice: 4800, baselineAmount: 408960, bidPrices: [{ bidderId: '1', price: 5100, deviation: 6.3 }, { bidderId: '2', price: 5200, deviation: 8.3 }, { bidderId: '3', price: 5080, deviation: 5.8 }, { bidderId: '4', price: 4950, deviation: 3.1 }, { bidderId: '5', price: 4850, deviation: 1.0 }] },
];

// 模拟问题数据
const mockIssues: ClearingIssue[] = [
  { id: '1', issueType: 'compliance', severity: 'error', bidderName: '丁建筑公司', title: '清单项缺失', description: '缺少清单项【010416001 柱钢筋】', riskLevel: '废标风险' },
  { id: '2', issueType: 'compliance', severity: 'warning', bidderName: '甲建设公司', title: '工程量偏差', description: '清单项【010503001】工程量偏差5.2%', riskLevel: '需澄清' },
  { id: '3', issueType: 'price', severity: 'error', bidderName: '甲建设公司', title: '单价严重偏低', description: '清单项【现浇板C30】单价280元/m³，偏离-33.3%', riskLevel: '不平衡报价' },
  { id: '4', issueType: 'price', severity: 'warning', bidderName: '甲建设公司', title: '不平衡报价', description: '不平衡指数0.32，存在明显不平衡报价倾向', riskLevel: '需关注' },
];

const BidClearingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hasBaseline, setHasBaseline] = useState(false);
  const [hasBidFiles, setHasBidFiles] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: () => false,
  };

  // 获取符合性状态标签
  const getComplianceTag = (status: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      pass: { color: 'green', icon: <CheckCircleOutlined />, text: '通过' },
      warning: { color: 'orange', icon: <WarningOutlined />, text: '需澄清' },
      error: { color: 'red', icon: <CloseCircleOutlined />, text: '废标风险' },
    };
    const s = map[status] || { color: 'default', icon: null, text: status };
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

  // 获取偏离显示
  const getDeviationDisplay = (value: number) => {
    const color = Math.abs(value) > 30 ? 'text-red-500' : Math.abs(value) > 15 ? 'text-orange-500' : 'text-gray-500';
    const icon = value > 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <span className={color}>
        {icon} {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };

  // 投标人列定义
  const bidderColumns: ColumnsType<Bidder> = [
    { title: '投标人', dataIndex: 'name', key: 'name', width: 150, render: (v) => <span className="font-medium">{v}</span> },
    { title: '投标总价', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, align: 'right', render: (v) => `¥${(v / 10000).toFixed(0)}万` },
    { title: '与控制价偏离', dataIndex: 'deviation', key: 'deviation', width: 120, align: 'center', render: (v) => getDeviationDisplay(v) },
    { title: '符合性', dataIndex: 'complianceStatus', key: 'complianceStatus', width: 100, render: (v) => getComplianceTag(v) },
    { title: '符合性问题', dataIndex: 'complianceIssues', key: 'complianceIssues', width: 100, align: 'center', render: (v) => v > 0 ? <Badge count={v} /> : <span className="text-green-500">0</span> },
    { title: '单价异常', dataIndex: 'priceDeviations', key: 'priceDeviations', width: 100, align: 'center', render: (v) => v > 0 ? <Badge count={v} color="orange" /> : <span className="text-green-500">0</span> },
    { title: '不平衡指数', dataIndex: 'unbalancedIndex', key: 'unbalancedIndex', width: 100, align: 'center', render: (v) => <span className={v > 0.25 ? 'text-orange-500' : ''}>{v.toFixed(2)}</span> },
    { title: '操作', key: 'action', width: 100, render: () => <Button type="link" size="small">详情</Button> },
  ];

  // 单价对比列定义
  const priceColumns: ColumnsType<CompareItem> = [
    { title: '清单编码', dataIndex: 'itemCode', key: 'itemCode', width: 120, fixed: 'left' },
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 180 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60, align: 'center' },
    { title: '控制价', dataIndex: 'baselinePrice', key: 'baselinePrice', width: 100, align: 'right', render: (v) => `¥${v}` },
    ...mockBidders.map(bidder => ({
      title: bidder.name.substring(0, 2),
      key: bidder.id,
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: CompareItem) => {
        const bp = record.bidPrices.find(p => p.bidderId === bidder.id);
        if (!bp) return '-';
        const color = Math.abs(bp.deviation) > 30 ? 'text-red-500' : Math.abs(bp.deviation) > 15 ? 'text-orange-500' : '';
        return (
          <div className={color}>
            <div>¥{bp.price}</div>
            <div className="text-xs">{bp.deviation > 0 ? '+' : ''}{bp.deviation.toFixed(1)}%</div>
          </div>
        );
      },
    })),
  ];

  // 模拟上传基准文件
  const handleUploadBaseline = () => {
    setHasBaseline(true);
    setStep(1);
  };

  // 模拟上传投标文件
  const handleUploadBidFiles = () => {
    setHasBidFiles(true);
    setStep(2);
  };

  // 模拟执行清标
  const handleRunClearing = () => {
    setCheckComplete(true);
    setStep(3);
  };

  // 渲染步骤1：上传基准文件
  const renderStep1 = () => (
    <Card>
      <div className="text-center py-12">
        <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
        <div className="text-lg mt-4">上传招标控制价（基准文件）</div>
        <div className="text-gray-400 mb-4">支持 XML、GCZ、GZB 格式</div>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} size="large" onClick={handleUploadBaseline}>
            选择文件
          </Button>
        </Upload>
      </div>
    </Card>
  );

  // 渲染步骤2：上传投标文件
  const renderStep2 = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="基准文件" size="small">
          <div className="flex items-center gap-3">
            <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            <div>
              <div className="font-medium">{mockBaseline.fileName}</div>
              <div className="text-xs text-gray-400">
                控制价：¥{(mockBaseline.totalAmount / 10000).toFixed(0)}万 | {mockBaseline.itemCount}项
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={16}>
        <Card
          title="投标文件"
          size="small"
          extra={
            <Upload {...uploadProps}>
              <Button icon={<PlusOutlined />} onClick={handleUploadBidFiles}>添加投标文件</Button>
            </Upload>
          }
        >
          {!hasBidFiles ? (
            <div className="text-center py-8 text-gray-400">
              <TeamOutlined style={{ fontSize: 48 }} />
              <div className="mt-2">请上传投标文件（支持批量上传）</div>
            </div>
          ) : (
            <List
              size="small"
              dataSource={mockBidders}
              renderItem={item => (
                <List.Item>
                  <div className="flex items-center gap-2">
                    <FileTextOutlined />
                    <span>{item.name}</span>
                    <Tag>¥{(item.totalAmount / 10000).toFixed(0)}万</Tag>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Col>
    </Row>
  );

  // 渲染步骤3：执行清标
  const renderStep3 = () => (
    <Card>
      <div className="text-center py-8">
        <SwapOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        <div className="text-lg mt-4">准备就绪，开始清标</div>
        <div className="text-gray-400 mb-4">
          基准文件：{mockBaseline.fileName} | 投标人：{mockBidders.length}家
        </div>
        <Button type="primary" size="large" onClick={handleRunClearing}>
          开始清标分析
        </Button>
      </div>
    </Card>
  );

  // 渲染清标结果
  const renderResult = () => (
    <div className="space-y-4">
      {/* 项目信息 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <div>
              <div className="font-medium">某住宅项目清标 - 第1轮</div>
              <div className="text-xs text-gray-400">
                控制价：¥{(mockBaseline.totalAmount / 10000).toFixed(0)}万 | 投标人：{mockBidders.length}家 | 清单项：{mockBaseline.itemCount}项
              </div>
            </div>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />}>重新检查</Button>
            <Button icon={<DownloadOutlined />}>导出报告</Button>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="投标人数" value={mockBidders.length} suffix="家" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="符合性问题"
              value={mockIssues.filter(i => i.issueType === 'compliance').length}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="单价异常"
              value={mockIssues.filter(i => i.issueType === 'price').length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="围串标风险" value="未发现" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      {/* 问题提示 */}
      {mockIssues.filter(i => i.severity === 'error').length > 0 && (
        <Alert
          type="error"
          showIcon
          message={`发现 ${mockIssues.filter(i => i.severity === 'error').length} 个严重问题，包含废标风险`}
        />
      )}

      {/* 详细分析 */}
      <Card
        size="small"
        tabList={[
          { key: 'overview', tab: '投标人概览' },
          { key: 'compliance', tab: '符合性检查' },
          { key: 'price', tab: '单价对比' },
          { key: 'risk', tab: '风险分析' },
        ]}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'overview' && (
          <Table
            rowKey="id"
            columns={bidderColumns}
            dataSource={mockBidders}
            pagination={false}
            size="small"
          />
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Card size="small" className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <div>
                    <div className="text-sm text-gray-500">符合性通过</div>
                    <div className="text-lg font-bold">{mockBidders.filter(b => b.complianceStatus === 'pass').length}家</div>
                  </div>
                </div>
              </Card>
              <Card size="small" className="flex-1">
                <div className="flex items-center gap-2">
                  <WarningOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                  <div>
                    <div className="text-sm text-gray-500">需澄清</div>
                    <div className="text-lg font-bold">{mockBidders.filter(b => b.complianceStatus === 'warning').length}家</div>
                  </div>
                </div>
              </Card>
              <Card size="small" className="flex-1">
                <div className="flex items-center gap-2">
                  <CloseCircleOutlined style={{ fontSize: 24, color: '#f5222d' }} />
                  <div>
                    <div className="text-sm text-gray-500">废标风险</div>
                    <div className="text-lg font-bold">{mockBidders.filter(b => b.complianceStatus === 'error').length}家</div>
                  </div>
                </div>
              </Card>
            </div>
            <Table
              rowKey="id"
              columns={[
                { title: '严重程度', dataIndex: 'severity', key: 'severity', width: 90, render: (v) => <Tag color={v === 'error' ? 'red' : v === 'warning' ? 'orange' : 'blue'}>{v === 'error' ? '严重' : v === 'warning' ? '一般' : '提示'}</Tag> },
                { title: '投标人', dataIndex: 'bidderName', key: 'bidderName', width: 120 },
                { title: '问题类型', dataIndex: 'title', key: 'title', width: 120 },
                { title: '问题描述', dataIndex: 'description', key: 'description' },
                { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100, render: (v) => <Tag color={v === '废标风险' ? 'red' : 'orange'}>{v}</Tag> },
              ]}
              dataSource={mockIssues.filter(i => i.issueType === 'compliance')}
              pagination={false}
              size="small"
            />
          </div>
        )}

        {activeTab === 'price' && (
          <Table
            rowKey="id"
            columns={priceColumns}
            dataSource={mockCompareItems}
            pagination={{ pageSize: 10 }}
            size="small"
            scroll={{ x: 1200 }}
          />
        )}

        {activeTab === 'risk' && (
          <div className="space-y-4">
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="不平衡报价分析">
                  <Table
                    rowKey="id"
                    columns={[
                      { title: '投标人', dataIndex: 'name', key: 'name' },
                      { title: '不平衡指数', dataIndex: 'unbalancedIndex', key: 'unbalancedIndex', render: (v) => <span className={v > 0.25 ? 'text-orange-500 font-bold' : ''}>{v.toFixed(2)}</span> },
                      { title: '判定', key: 'judge', render: (_, r) => r.unbalancedIndex > 0.25 ? <Tag color="orange">中度不平衡</Tag> : <Tag color="green">正常</Tag> },
                    ]}
                    dataSource={mockBidders}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="围串标特征分析">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>单价高度一致</span>
                      <Tag color="green">未发现</Tag>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>总价梯度分布</span>
                      <Tag color="green">未发现</Tag>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>相同错误特征</span>
                      <Tag color="green">未发现</Tag>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>综合风险评估</span>
                      <Tag color="green">低风险</Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">清标</span>
            <span className="text-gray-400 ml-2">投标文件符合性审查 · 单价对比分析</span>
          </div>
          <Tag color="blue">多文件对比</Tag>
        </div>
      </Card>

      {/* 步骤条 */}
      {!checkComplete && (
        <Card size="small">
          <Steps
            current={step}
            items={[
              { title: '上传基准文件', description: '招标控制价' },
              { title: '上传投标文件', description: '多家投标人' },
              { title: '执行清标', description: '符合性+单价对比' },
              { title: '查看结果', description: '分析报告' },
            ]}
          />
        </Card>
      )}

      {/* 内容区 */}
      {!hasBaseline && renderStep1()}
      {hasBaseline && !hasBidFiles && renderStep2()}
      {hasBaseline && hasBidFiles && !checkComplete && renderStep3()}
      {checkComplete && renderResult()}
    </div>
  );
};

export default BidClearingPage;
