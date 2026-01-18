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
} from 'antd';
import {
  UploadOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface PriceIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  checkType: string;
  severity: 'error' | 'warning' | 'info';
  materialName: string;
  specification: string;
  currentPrice: number;
  referencePrice: number;
  deviation: number;
  description: string;
  suggestion: string;
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  checkTime: '2026-01-18 15:35:12',
  checkDuration: '15秒',
  summary: {
    reasonability: { total: 856, pass: 832, fail: 24 },
    consistency: { total: 856, pass: 850, fail: 6 },
    logic: { total: 45, pass: 42, fail: 3 },
  },
  issueCount: { error: 8, warning: 18, info: 7 },
};

// 模拟Issue列表
const mockIssues: PriceIssue[] = [
  {
    id: 'ISS001',
    ruleId: 'PRC-MAT-001',
    ruleName: '材料价格合理性检查',
    checkType: 'reasonability',
    severity: 'error',
    materialName: '商品混凝土C30',
    specification: 'C30，塌落度120-160mm',
    currentPrice: 680,
    referencePrice: 485,
    deviation: 40.2,
    description: '材料单价￥680/m³超出信息价区间(￥450-￥520)',
    suggestion: '请核实材料价格是否正确，或提供价格依据',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'PRC-MAT-001',
    ruleName: '材料价格合理性检查',
    checkType: 'reasonability',
    severity: 'error',
    materialName: '热轧带肋钢筋HRB400',
    specification: 'Φ25',
    currentPrice: 5200,
    referencePrice: 3850,
    deviation: 35.1,
    description: '材料单价￥5,200/t超出企业材价库区间(￥3,600-￥4,100)',
    suggestion: '请核实材料价格是否正确',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'PRC-MAT-003',
    ruleName: '混凝土强度等级价格逻辑',
    checkType: 'logic',
    severity: 'error',
    materialName: '商品混凝土',
    specification: 'C25 vs C30',
    currentPrice: 490,
    referencePrice: 480,
    deviation: -2.1,
    description: 'C25混凝土单价(￥490)高于C30混凝土单价(￥480)',
    suggestion: '高强度等级混凝土单价应不低于低强度等级',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'PRC-MAT-003',
    ruleName: '钢筋规格价格逻辑',
    checkType: 'logic',
    severity: 'error',
    materialName: '热轧带肋钢筋HRB400',
    specification: 'Φ12 vs Φ25',
    currentPrice: 4200,
    referencePrice: 3850,
    deviation: 9.1,
    description: 'Φ12钢筋单价(￥4,200)高于Φ25钢筋单价(￥3,850)，不符合规格价格递减规律',
    suggestion: '小规格钢筋单价通常略高于大规格，但差异不应过大',
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'PRC-MAT-002',
    ruleName: '材料价格一致性检查',
    checkType: 'consistency',
    severity: 'warning',
    materialName: '普通硅酸盐水泥P.O42.5',
    specification: 'P.O 42.5',
    currentPrice: 450,
    referencePrice: 420,
    deviation: 7.1,
    description: '同一材料在文件中出现不同价格：￥450 和 ￥420',
    suggestion: '请统一材料价格',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'PRC-MAT-001',
    ruleName: '材料价格合理性检查',
    checkType: 'reasonability',
    severity: 'warning',
    materialName: '中砂',
    specification: '细度模数2.3-3.0',
    currentPrice: 165,
    referencePrice: 125,
    deviation: 32.0,
    description: '材料单价￥165/m³高于信息价￥125/m³约32%',
    suggestion: '价格偏高，请核实或提供依据',
    status: 'open',
  },
  {
    id: 'ISS007',
    ruleId: 'PRC-MAT-004',
    ruleName: '材料价格波动检查',
    checkType: 'reasonability',
    severity: 'info',
    materialName: '碎石',
    specification: '5-25mm连续级配',
    currentPrice: 108,
    referencePrice: 98,
    deviation: 10.2,
    description: '材料价格较上期上涨10.2%',
    suggestion: '价格波动在合理范围内，建议关注',
    status: 'open',
  },
];

const MaterialPriceCheckPage: React.FC = () => {
  const [hasFile, setHasFile] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [checkTypeFilter, setCheckTypeFilter] = useState('all');

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

  // 获取检查类型标签
  const getCheckTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      reasonability: { color: 'blue', text: '合理性' },
      consistency: { color: 'green', text: '一致性' },
      logic: { color: 'orange', text: '逻辑性' },
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
  const issueColumns: ColumnsType<PriceIssue> = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 90,
      render: (v) => getSeverityTag(v),
    },
    {
      title: '检查类型',
      dataIndex: 'checkType',
      key: 'checkType',
      width: 90,
      render: (v) => getCheckTypeTag(v),
    },
    {
      title: '材料名称',
      key: 'material',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.materialName}</div>
          <div className="text-xs text-gray-400">{record.specification}</div>
        </div>
      ),
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 100,
      align: 'right',
      render: (v) => <span className="font-medium">¥{v.toLocaleString()}</span>,
    },
    {
      title: '参考价格',
      dataIndex: 'referencePrice',
      key: 'referencePrice',
      width: 100,
      align: 'right',
      render: (v) => <span className="text-gray-500">¥{v.toLocaleString()}</span>,
    },
    {
      title: '偏离率',
      dataIndex: 'deviation',
      key: 'deviation',
      width: 100,
      align: 'center',
      render: (v) => getDeviationDisplay(v),
    },
    {
      title: '规则',
      dataIndex: 'ruleId',
      key: 'ruleId',
      width: 120,
      render: (v, record) => (
        <div>
          <div className="text-xs text-gray-400">{v}</div>
          <div className="text-xs">{record.ruleName}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">定位</Button>
          <Button type="link" size="small">确认</Button>
          <Button type="link" size="small">忽略</Button>
        </Space>
      ),
    },
  ];

  // 过滤Issue
  const getFilteredIssues = () => {
    return mockIssues.filter(i => {
      if (activeTab !== 'all' && i.severity !== activeTab) return false;
      if (checkTypeFilter !== 'all' && i.checkType !== checkTypeFilter) return false;
      return true;
    });
  };

  // 渲染上传区域
  const renderUploadArea = () => (
    <Card className="text-center py-12">
      <Upload {...uploadProps}>
        <div className="space-y-4">
          <DollarOutlined style={{ fontSize: 64, color: '#fa8c16' }} />
          <div className="text-lg">上传造价文件进行材料价格检查</div>
          <div className="text-gray-400">检查材料价格的合理性、一致性、逻辑性</div>
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
        <div className="text-lg">正在进行材料价格检查...</div>
        <div className="text-gray-400">对比信息价、企业材价库，检查价格合理性...</div>
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
            <FileTextOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
            <div>
              <div className="font-medium">{mockCheckResult.fileName}</div>
              <div className="text-xs text-gray-400">
                {mockCheckResult.fileType} | 检查时间: {mockCheckResult.checkTime} | 耗时: {mockCheckResult.checkDuration}
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

      {/* 分项检查结果 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">价格合理性检查</div>
                <div className="text-xs text-gray-400">与信息价/企业材价库对比</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.reasonability.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.reasonability.total}</span>
                {mockCheckResult.summary.reasonability.fail > 0 && (
                  <Badge count={mockCheckResult.summary.reasonability.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">价格一致性检查</div>
                <div className="text-xs text-gray-400">同一材料价格一致</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.consistency.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.consistency.total}</span>
                {mockCheckResult.summary.consistency.fail > 0 && (
                  <Badge count={mockCheckResult.summary.consistency.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">价格逻辑性检查</div>
                <div className="text-xs text-gray-400">规格等级与价格关系</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.logic.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.logic.total}</span>
                {mockCheckResult.summary.logic.fail > 0 && (
                  <Badge count={mockCheckResult.summary.logic.fail} className="ml-2" />
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
          message={`发现 ${mockCheckResult.issueCount.error} 个严重价格问题，请优先处理`}
        />
      )}

      {/* Issue列表 */}
      <Card
        size="small"
        title="问题清单"
        extra={
          <Space>
            <Tabs
              activeKey={checkTypeFilter}
              onChange={setCheckTypeFilter}
              size="small"
              items={[
                { key: 'all', label: '全部' },
                { key: 'reasonability', label: '合理性' },
                { key: 'consistency', label: '一致性' },
                { key: 'logic', label: '逻辑性' },
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
                <Descriptions.Item label="问题描述">{record.description}</Descriptions.Item>
                <Descriptions.Item label="修改建议">{record.suggestion}</Descriptions.Item>
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
            <span className="text-lg font-medium">材料价格检查</span>
            <span className="text-gray-400 ml-2">合理性 · 一致性 · 逻辑性</span>
          </div>
          <Space>
            <Tag color="blue">对比信息价</Tag>
            <Tag color="green">对比企业材价库</Tag>
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

export default MaterialPriceCheckPage;
