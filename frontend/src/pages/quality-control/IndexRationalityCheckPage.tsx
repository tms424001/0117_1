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
  Progress,
  Tabs,
  Alert,
  Badge,
  Descriptions,
  Statistic,
} from 'antd';
import {
  UploadOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface IndexIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  indexType: string;
  severity: 'error' | 'warning' | 'info';
  indexName: string;
  currentValue: number;
  referenceValue: number;
  referenceRange: string;
  deviation: number;
  unit: string;
  description: string;
  suggestion: string;
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  functionTag: '门诊',
  buildingArea: 25000,
  totalCost: 142500000,
  unitCost: 5700,
  checkTime: '2026-01-18 15:50:15',
  checkDuration: '10秒',
  summary: {
    economicIndex: { total: 8, pass: 5, fail: 3 },
    contentIndex: { total: 12, pass: 10, fail: 2 },
    ratioIndex: { total: 15, pass: 12, fail: 3 },
  },
  issueCount: { error: 3, warning: 4, info: 1 },
};

// 模拟Issue列表
const mockIssues: IndexIssue[] = [
  {
    id: 'ISS001',
    ruleId: 'IDX-ECO-001',
    ruleName: '单方造价合理性检查',
    indexType: 'economic',
    severity: 'error',
    indexName: '单方造价',
    currentValue: 5700,
    referenceValue: 4800,
    referenceRange: '4200-5200',
    deviation: 18.8,
    unit: '元/m²',
    description: '单方造价￥5,700/m²超出门诊类项目参考区间(￥4,200-￥5,200)',
    suggestion: '单方造价偏高，请核实各分部造价',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'IDX-CON-001',
    ruleName: '含钢量合理性检查',
    indexType: 'content',
    severity: 'error',
    indexName: '含钢量',
    currentValue: 125,
    referenceValue: 65,
    referenceRange: '50-80',
    deviation: 92.3,
    unit: 'kg/m²',
    description: '含钢量125kg/m²超出门诊类项目参考区间(50-80kg/m²)',
    suggestion: '含钢量严重偏高，请核实钢筋工程量',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'IDX-RAT-001',
    ruleName: '土建占比合理性检查',
    indexType: 'ratio',
    severity: 'error',
    indexName: '土建占比',
    currentValue: 72,
    referenceValue: 58,
    referenceRange: '52-62',
    deviation: 24.1,
    unit: '%',
    description: '土建占比72%超出门诊类项目参考区间(52%-62%)',
    suggestion: '土建占比偏高，请核实土建造价或安装造价',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'IDX-CON-002',
    ruleName: '含混凝土量合理性检查',
    indexType: 'content',
    severity: 'warning',
    indexName: '含混凝土量',
    currentValue: 0.58,
    referenceValue: 0.45,
    referenceRange: '0.38-0.52',
    deviation: 28.9,
    unit: 'm³/m²',
    description: '含混凝土量0.58m³/m²高于参考区间上限',
    suggestion: '含混凝土量偏高，请核实混凝土工程量',
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'IDX-RAT-002',
    ruleName: '安装占比合理性检查',
    indexType: 'ratio',
    severity: 'warning',
    indexName: '安装占比',
    currentValue: 18,
    referenceValue: 28,
    referenceRange: '25-35',
    deviation: -35.7,
    unit: '%',
    description: '安装占比18%低于门诊类项目参考区间(25%-35%)',
    suggestion: '安装占比偏低，医疗建筑安装工程占比通常较高',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'IDX-RAT-003',
    ruleName: '人材机占比检查',
    indexType: 'ratio',
    severity: 'warning',
    indexName: '材料费占比',
    currentValue: 68,
    referenceValue: 58,
    referenceRange: '52-62',
    deviation: 17.2,
    unit: '%',
    description: '材料费占比68%高于参考区间',
    suggestion: '材料费占比偏高，请核实材料价格',
    status: 'open',
  },
  {
    id: 'ISS007',
    ruleId: 'IDX-ECO-002',
    ruleName: '地下室单方造价检查',
    indexType: 'economic',
    severity: 'warning',
    indexName: '地下室单方造价',
    currentValue: 4200,
    referenceValue: 3500,
    referenceRange: '3000-3800',
    deviation: 20.0,
    unit: '元/m²',
    description: '地下室单方造价￥4,200/m²高于参考区间',
    suggestion: '地下室造价偏高，请核实',
    status: 'open',
  },
  {
    id: 'ISS008',
    ruleId: 'IDX-CON-003',
    ruleName: '模板含量检查',
    indexType: 'content',
    severity: 'info',
    indexName: '模板含量',
    currentValue: 2.8,
    referenceValue: 2.5,
    referenceRange: '2.2-2.8',
    deviation: 12.0,
    unit: 'm²/m²',
    description: '模板含量2.8m²/m²处于参考区间上限',
    suggestion: '模板含量正常偏高，建议关注',
    status: 'open',
  },
];

const IndexRationalityCheckPage: React.FC = () => {
  const [hasFile, setHasFile] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [indexTypeFilter, setIndexTypeFilter] = useState('all');

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: () => {
      setHasFile(true);
      setChecking(true);
      setTimeout(() => {
        setChecking(false);
        setCheckComplete(true);
      }, 2000);
      return false;
    },
  };

  // 获取严重程度标签
  const getSeverityTag = (severity: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      error: { color: 'red', icon: <CloseCircleOutlined />, text: '严重' },
      warning: { color: 'orange', icon: <WarningOutlined />, text: '一般' },
      info: { color: 'blue', icon: <InfoCircleOutlined />, text: '提示' },
    };
    const s = map[severity] || { color: 'default', icon: null, text: severity };
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

  // 获取指标类型标签
  const getIndexTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      economic: { color: 'blue', text: '经济指标' },
      content: { color: 'green', text: '含量指标' },
      ratio: { color: 'orange', text: '占比指标' },
    };
    const t = map[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
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

  // Issue列定义
  const issueColumns: ColumnsType<IndexIssue> = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 90,
      render: (v) => getSeverityTag(v),
    },
    {
      title: '指标类型',
      dataIndex: 'indexType',
      key: 'indexType',
      width: 100,
      render: (v) => getIndexTypeTag(v),
    },
    {
      title: '指标名称',
      dataIndex: 'indexName',
      key: 'indexName',
      width: 120,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: '当前值',
      key: 'currentValue',
      width: 100,
      align: 'right',
      render: (_, record) => (
        <span className="font-medium">{record.currentValue.toLocaleString()} {record.unit}</span>
      ),
    },
    {
      title: '参考区间',
      dataIndex: 'referenceRange',
      key: 'referenceRange',
      width: 100,
      align: 'center',
      render: (v, record) => <span className="text-gray-500">{v} {record.unit}</span>,
    },
    {
      title: '偏离率',
      dataIndex: 'deviation',
      key: 'deviation',
      width: 90,
      align: 'center',
      render: (v) => getDeviationDisplay(v),
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
      width: 280,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">确认</Button>
        </Space>
      ),
    },
  ];

  // 过滤Issue
  const getFilteredIssues = () => {
    return mockIssues.filter(i => {
      if (activeTab !== 'all' && i.severity !== activeTab) return false;
      if (indexTypeFilter !== 'all' && i.indexType !== indexTypeFilter) return false;
      return true;
    });
  };

  // 渲染上传区域
  const renderUploadArea = () => (
    <Card className="text-center py-12">
      <Upload {...uploadProps}>
        <div className="space-y-4">
          <BarChartOutlined style={{ fontSize: 64, color: '#52c41a' }} />
          <div className="text-lg">上传造价文件进行指标合理性检查</div>
          <div className="text-gray-400">检查经济指标、含量指标、占比指标的合理性</div>
          <Button type="primary" icon={<UploadOutlined />} size="large">
            选择文件
          </Button>
        </div>
      </Upload>
    </Card>
  );

  // 渲染检查中状态
  const renderChecking = () => (
    <Card className="text-center py-12">
      <div className="space-y-4">
        <Progress type="circle" percent={75} status="active" />
        <div className="text-lg">正在进行指标合理性检查...</div>
        <div className="text-gray-400">识别功能标签 → 匹配指标库 → 对比分析...</div>
      </div>
    </Card>
  );

  // 渲染检查结果
  const renderCheckResult = () => (
    <div className="space-y-4">
      {/* 文件信息 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            <div>
              <div className="font-medium">{mockCheckResult.fileName}</div>
              <div className="text-xs text-gray-400">
                {mockCheckResult.fileType} | 功能标签: {mockCheckResult.functionTag} | 检查时间: {mockCheckResult.checkTime}
              </div>
            </div>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />}>重新检查</Button>
            <Button icon={<DownloadOutlined />}>导出报告</Button>
            <Upload {...uploadProps}>
              <Button type="primary" icon={<UploadOutlined />}>上传新文件</Button>
            </Upload>
          </Space>
        </div>
      </Card>

      {/* 项目概况 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="建筑面积" value={mockCheckResult.buildingArea} suffix="m²" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="工程总造价" value={mockCheckResult.totalCost} prefix="¥" precision={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="单方造价"
              value={mockCheckResult.unitCost}
              suffix="元/m²"
              valueStyle={{ color: mockCheckResult.unitCost > 5200 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="功能标签" value={mockCheckResult.functionTag} />
            <div className="text-xs text-gray-400 mt-1">参考区间: 4,200-5,200 元/m²</div>
          </Card>
        </Col>
      </Row>

      {/* 分项检查结果 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">经济指标检查</div>
                <div className="text-xs text-gray-400">单方造价、分部造价</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.economicIndex.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.economicIndex.total}</span>
                {mockCheckResult.summary.economicIndex.fail > 0 && (
                  <Badge count={mockCheckResult.summary.economicIndex.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">含量指标检查</div>
                <div className="text-xs text-gray-400">含钢量、含混凝土量</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.contentIndex.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.contentIndex.total}</span>
                {mockCheckResult.summary.contentIndex.fail > 0 && (
                  <Badge count={mockCheckResult.summary.contentIndex.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">占比指标检查</div>
                <div className="text-xs text-gray-400">土建/安装占比、人材机占比</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.ratioIndex.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.ratioIndex.total}</span>
                {mockCheckResult.summary.ratioIndex.fail > 0 && (
                  <Badge count={mockCheckResult.summary.ratioIndex.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 问题提示 */}
      {mockCheckResult.issueCount.error > 0 && (
        <Alert
          type="error"
          showIcon
          message={`发现 ${mockCheckResult.issueCount.error} 个严重指标异常，请优先处理`}
        />
      )}

      {/* Issue列表 */}
      <Card
        size="small"
        title="问题清单"
        extra={
          <Space>
            <Tabs
              activeKey={indexTypeFilter}
              onChange={setIndexTypeFilter}
              size="small"
              items={[
                { key: 'all', label: '全部' },
                { key: 'economic', label: '经济指标' },
                { key: 'content', label: '含量指标' },
                { key: 'ratio', label: '占比指标' },
              ]}
            />
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="small"
              items={[
                { key: 'all', label: `全部 (${mockIssues.length})` },
                { key: 'error', label: <span className="text-red-500">严重 ({mockCheckResult.issueCount.error})</span> },
                { key: 'warning', label: <span className="text-orange-500">一般 ({mockCheckResult.issueCount.warning})</span> },
                { key: 'info', label: <span className="text-blue-500">提示 ({mockCheckResult.issueCount.info})</span> },
              ]}
            />
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={issueColumns}
          dataSource={getFilteredIssues()}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个问题` }}
          size="small"
          expandable={{
            expandedRowRender: (record) => (
              <Descriptions size="small" column={2}>
                <Descriptions.Item label="修改建议">{record.suggestion}</Descriptions.Item>
                <Descriptions.Item label="规则">{record.ruleId} - {record.ruleName}</Descriptions.Item>
                <Descriptions.Item label="参考值">{record.referenceValue} {record.unit}</Descriptions.Item>
              </Descriptions>
            ),
          }}
        />
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">指标合理性检查</span>
            <span className="text-gray-400 ml-2">经济指标 · 含量指标 · 占比指标</span>
          </div>
          <Space>
            <Tag color="green">对比企业指标库</Tag>
            <Tag>按功能标签匹配</Tag>
          </Space>
        </div>
      </Card>

      {/* 内容区 */}
      {!hasFile && renderUploadArea()}
      {hasFile && checking && renderChecking()}
      {hasFile && checkComplete && renderCheckResult()}
    </div>
  );
};

export default IndexRationalityCheckPage;
