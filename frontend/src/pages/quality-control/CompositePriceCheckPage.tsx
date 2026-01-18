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
  CalculatorOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface CompositePriceIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  checkType: string;
  severity: 'error' | 'warning' | 'info';
  itemCode: string;
  itemName: string;
  currentPrice: number;
  referencePrice: number;
  deviation: number;
  composition: {
    labor: number;
    material: number;
    machine: number;
    management: number;
    profit: number;
  };
  description: string;
  suggestion: string;
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  checkTime: '2026-01-18 15:40:35',
  checkDuration: '18秒',
  summary: {
    reasonability: { total: 1256, pass: 1218, fail: 38 },
    consistency: { total: 1256, pass: 1248, fail: 8 },
    completeness: { total: 1256, pass: 1235, fail: 21 },
  },
  issueCount: { error: 15, warning: 35, info: 17 },
};

// 模拟Issue列表
const mockIssues: CompositePriceIssue[] = [
  {
    id: 'ISS001',
    ruleId: 'PRC-CMP-001',
    ruleName: '综合单价合理性检查',
    checkType: 'reasonability',
    severity: 'error',
    itemCode: '010501004001',
    itemName: '现浇混凝土矩形柱C30',
    currentPrice: 1250,
    referencePrice: 680,
    deviation: 83.8,
    composition: { labor: 85, material: 1050, machine: 45, management: 35, profit: 35 },
    description: '综合单价￥1,250/m³超出综价库参考区间(￥620-￥740)',
    suggestion: '请核实单价组成，材料费占比84%异常偏高',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'PRC-CMP-002',
    ruleName: '材料费占比检查',
    checkType: 'completeness',
    severity: 'error',
    itemCode: '010501004001',
    itemName: '现浇混凝土矩形柱C30',
    currentPrice: 1250,
    referencePrice: 680,
    deviation: 0,
    composition: { labor: 85, material: 1050, machine: 45, management: 35, profit: 35 },
    description: '材料费占比84%超过阈值(70%)',
    suggestion: '材料费占比异常，请检查材料价格或工程量',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'PRC-CMP-003',
    ruleName: '人工费缺失检查',
    checkType: 'completeness',
    severity: 'error',
    itemCode: '010301001005',
    itemName: '土方回填',
    currentPrice: 28,
    referencePrice: 32,
    deviation: -12.5,
    composition: { labor: 0, material: 18, machine: 8, management: 1, profit: 1 },
    description: '综合单价中人工费为0，可能存在漏项',
    suggestion: '土方回填应包含人工费，请检查',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'PRC-CMP-001',
    ruleName: '综合单价合理性检查',
    checkType: 'reasonability',
    severity: 'warning',
    itemCode: '010601001003',
    itemName: '钢筋制安HRB400 Φ25',
    currentPrice: 5800,
    referencePrice: 4850,
    deviation: 19.6,
    composition: { labor: 650, material: 4800, machine: 120, management: 115, profit: 115 },
    description: '综合单价￥5,800/t高于综价库参考值19.6%',
    suggestion: '单价偏高，请核实材料价格',
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'PRC-CMP-004',
    ruleName: '综合单价一致性检查',
    checkType: 'consistency',
    severity: 'warning',
    itemCode: '010501003',
    itemName: '现浇混凝土梁C30',
    currentPrice: 720,
    referencePrice: 680,
    deviation: 5.9,
    composition: { labor: 95, material: 520, machine: 45, management: 30, profit: 30 },
    description: '同一清单项在文件中出现不同单价：￥720 和 ￥680',
    suggestion: '请统一相同清单项的综合单价',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'PRC-CMP-005',
    ruleName: '管理费利润占比检查',
    checkType: 'completeness',
    severity: 'info',
    itemCode: '010201001002',
    itemName: '砖基础',
    currentPrice: 485,
    referencePrice: 460,
    deviation: 5.4,
    composition: { labor: 120, material: 280, machine: 25, management: 45, profit: 15 },
    description: '管理费占比9.3%，利润占比3.1%，利润偏低',
    suggestion: '利润占比低于行业平均水平(5-8%)',
    status: 'open',
  },
];

const CompositePriceCheckPage: React.FC = () => {
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
      completeness: { color: 'orange', text: '完整性' },
    };
    const t = map[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
  };

  // 获取偏离显示
  const getDeviationDisplay = (value: number) => {
    if (value === 0) return <span className="text-gray-400">-</span>;
    const color = Math.abs(value) > 30 ? 'text-red-500' : Math.abs(value) > 15 ? 'text-orange-500' : 'text-gray-500';
    const icon = value > 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <span className={color}>
        {icon} {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };

  // 渲染单价组成
  const renderComposition = (comp: CompositePriceIssue['composition'], total: number) => {
    const items = [
      { label: '人', value: comp.labor, color: '#1890ff' },
      { label: '材', value: comp.material, color: '#52c41a' },
      { label: '机', value: comp.machine, color: '#fa8c16' },
      { label: '管', value: comp.management, color: '#722ed1' },
      { label: '利', value: comp.profit, color: '#eb2f96' },
    ];
    return (
      <div className="flex gap-1">
        {items.map(item => (
          <Tag key={item.label} color={item.color} className="text-xs">
            {item.label}:{((item.value / total) * 100).toFixed(0)}%
          </Tag>
        ))}
      </div>
    );
  };

  // Issue列定义
  const issueColumns: ColumnsType<CompositePriceIssue> = [
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
      title: '清单项',
      key: 'item',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.itemName}</div>
          <div className="text-xs text-gray-400">{record.itemCode}</div>
        </div>
      ),
    },
    {
      title: '当前单价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 100,
      align: 'right',
      render: (v) => <span className="font-medium">¥{v.toLocaleString()}</span>,
    },
    {
      title: '参考单价',
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
      width: 90,
      align: 'center',
      render: (v) => getDeviationDisplay(v),
    },
    {
      title: '单价组成',
      key: 'composition',
      width: 220,
      render: (_, record) => renderComposition(record.composition, record.currentPrice),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">定位</Button>
          <Button type="link" size="small">确认</Button>
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
          <CalculatorOutlined style={{ fontSize: 64, color: '#722ed1' }} />
          <div className="text-lg">上传造价文件进行综合单价检查</div>
          <div className="text-gray-400">检查综合单价的合理性、一致性、完整性</div>
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
        <div className="text-lg">正在进行综合单价检查...</div>
        <div className="text-gray-400">标准化归一 → 对比综价库 → 分析单价组成...</div>
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
            <FileTextOutlined style={{ fontSize: 24, color: '#722ed1' }} />
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
                <div className="text-sm text-gray-500">单价合理性检查</div>
                <div className="text-xs text-gray-400">与综价库历史数据对比</div>
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
                <div className="text-sm text-gray-500">单价一致性检查</div>
                <div className="text-xs text-gray-400">文件内相同清单项单价一致</div>
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
                <div className="text-sm text-gray-500">单价完整性检查</div>
                <div className="text-xs text-gray-400">人材机管利组成完整</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.completeness.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.completeness.total}</span>
                {mockCheckResult.summary.completeness.fail > 0 && (
                  <Badge count={mockCheckResult.summary.completeness.fail} className="ml-2" />
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
          message={`发现 ${mockCheckResult.issueCount.error} 个严重单价问题，请优先处理`}
        />
      )}

      {/* Issue列表 */}
      <Card
        size="small"
        title={
          <Space>
            <PieChartOutlined />
            <span>问题清单</span>
          </Space>
        }
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
                { key: 'completeness', label: '完整性' },
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
                <Descriptions.Item label="规则">{record.ruleId} - {record.ruleName}</Descriptions.Item>
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
            <span className="text-lg font-medium">综合单价检查</span>
            <span className="text-gray-400 ml-2">合理性 · 一致性 · 完整性</span>
          </div>
          <Space>
            <Tag color="purple">对比企业综价库</Tag>
            <Tag>人材机管利分析</Tag>
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

export default CompositePriceCheckPage;
