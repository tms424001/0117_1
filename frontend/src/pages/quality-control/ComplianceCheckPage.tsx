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
  Progress,
  Tabs,
  Alert,
  Badge,
  Descriptions,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CodeOutlined,
  ColumnWidthOutlined,
  ProfileOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface ComplianceIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  checkType: string;
  severity: 'error' | 'warning' | 'info';
  location: string;
  currentValue: string;
  expectedValue: string;
  description: string;
  suggestion: string;
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  checkTime: '2026-01-18 15:30:25',
  checkDuration: '8秒',
  summary: {
    codeCheck: { total: 1256, pass: 1248, fail: 8 },
    unitCheck: { total: 1256, pass: 1250, fail: 6 },
    featureCheck: { total: 1256, pass: 1232, fail: 24 },
    structureCheck: { total: 1, pass: 1, fail: 0 },
  },
  issueCount: { error: 12, warning: 18, info: 8 },
};

// 模拟Issue列表
const mockIssues: ComplianceIssue[] = [
  {
    id: 'ISS001',
    ruleId: 'CMP-CODE-001',
    ruleName: '编码长度检查',
    checkType: 'code',
    severity: 'error',
    location: '分部分项 > 土石方工程 > 第3项',
    currentValue: '01010100',
    expectedValue: '12位数字编码',
    description: '清单编码"01010100"长度为8位，不符合12位规范',
    suggestion: '请补充完整的12位清单编码',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'CMP-CODE-002',
    ruleName: '专业编码有效性',
    checkType: 'code',
    severity: 'error',
    location: '分部分项 > 安装工程 > 第1项',
    currentValue: '99',
    expectedValue: '01-09',
    description: '专业编码"99"不在有效专业编码表中',
    suggestion: '请使用有效的专业编码（01-09）',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'CMP-CODE-103',
    ruleName: '编码与单位匹配',
    checkType: 'code',
    severity: 'error',
    location: '分部分项 > 混凝土工程 > 矩形柱',
    currentValue: 'm²',
    expectedValue: 'm³',
    description: '清单编码010501004对应的标准单位为m³，实际使用m²',
    suggestion: '请修正计量单位为m³',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'CMP-UNIT-001',
    ruleName: '单位标准化检查',
    checkType: 'unit',
    severity: 'warning',
    location: '分部分项 > 装饰工程 > 第8项',
    currentValue: '平方',
    expectedValue: 'm²',
    description: '计量单位"平方"不是标准写法',
    suggestion: '建议使用标准单位"m²"',
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'CMP-UNIT-002',
    ruleName: '单位与编码匹配',
    checkType: 'unit',
    severity: 'error',
    location: '分部分项 > 钢筋工程 > 第5项',
    currentValue: 'kg',
    expectedValue: 't',
    description: '该清单项规范要求使用"t"作为计量单位',
    suggestion: '请修正计量单位为"t"',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'CMP-FEAT-001',
    ruleName: '必填特征完整性',
    checkType: 'feature',
    severity: 'error',
    location: '分部分项 > 混凝土工程 > 矩形柱',
    currentValue: '缺失',
    expectedValue: '混凝土强度等级',
    description: '矩形柱缺少必填特征"混凝土强度等级"',
    suggestion: '请补充混凝土强度等级（如C30）',
    status: 'open',
  },
  {
    id: 'ISS007',
    ruleId: 'CMP-FEAT-001',
    ruleName: '必填特征完整性',
    checkType: 'feature',
    severity: 'error',
    location: '分部分项 > 砌筑工程 > 墙体砌筑',
    currentValue: '缺失',
    expectedValue: '砂浆强度等级',
    description: '墙体砌筑缺少必填特征"砂浆强度等级"',
    suggestion: '请补充砂浆强度等级（如M5）',
    status: 'open',
  },
  {
    id: 'ISS008',
    ruleId: 'CMP-FEAT-002',
    ruleName: '特征描述非空',
    checkType: 'feature',
    severity: 'warning',
    location: '分部分项 > 门窗工程 > 第3项',
    currentValue: '空',
    expectedValue: '非空描述',
    description: '项目特征字段为空',
    suggestion: '请填写项目特征描述',
    status: 'open',
  },
  {
    id: 'ISS009',
    ruleId: 'CMP-CODE-006',
    ruleName: '序号连续性检查',
    checkType: 'code',
    severity: 'info',
    location: '分部分项 > 土石方工程',
    currentValue: '0001,0002,0004',
    expectedValue: '0001,0002,0003,0004',
    description: '清单项序号不连续，缺少0003',
    suggestion: '建议保持序号连续',
    status: 'open',
  },
];

const ComplianceCheckPage: React.FC = () => {
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
    const map: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      code: { color: 'blue', text: '编码检查', icon: <CodeOutlined /> },
      unit: { color: 'green', text: '单位检查', icon: <ColumnWidthOutlined /> },
      feature: { color: 'orange', text: '特征检查', icon: <ProfileOutlined /> },
      structure: { color: 'purple', text: '结构检查', icon: <ApartmentOutlined /> },
    };
    const t = map[type] || { color: 'default', text: type, icon: null };
    return <Tag color={t.color} icon={t.icon}>{t.text}</Tag>;
  };

  // Issue列定义
  const issueColumns: ColumnsType<ComplianceIssue> = [
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
      width: 100,
      render: (v) => getCheckTypeTag(v),
    },
    {
      title: '规则',
      key: 'rule',
      width: 160,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.ruleName}</div>
          <div className="text-xs text-gray-400">{record.ruleId}</div>
        </div>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      ellipsis: true,
    },
    {
      title: '当前值',
      dataIndex: 'currentValue',
      key: 'currentValue',
      width: 100,
      render: (v) => <Tag color="red">{v}</Tag>,
    },
    {
      title: '期望值',
      dataIndex: 'expectedValue',
      key: 'expectedValue',
      width: 120,
      render: (v) => <Tag color="green">{v}</Tag>,
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
          <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
          <div className="text-lg">上传造价文件进行合规性检查</div>
          <div className="text-gray-400">检查清单编码、计量单位、项目特征、费用结构的规范性</div>
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
        <div className="text-lg">正在进行合规性检查...</div>
        <div className="text-gray-400">检查编码格式、计量单位、项目特征、费用结构...</div>
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
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
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
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <CodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <div className="text-sm text-gray-500">清单编码检查</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{mockCheckResult.summary.codeCheck.pass}</span>
                  <span className="text-gray-400">/ {mockCheckResult.summary.codeCheck.total}</span>
                  {mockCheckResult.summary.codeCheck.fail > 0 && (
                    <Badge count={mockCheckResult.summary.codeCheck.fail} />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <ColumnWidthOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <div className="text-sm text-gray-500">计量单位检查</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{mockCheckResult.summary.unitCheck.pass}</span>
                  <span className="text-gray-400">/ {mockCheckResult.summary.unitCheck.total}</span>
                  {mockCheckResult.summary.unitCheck.fail > 0 && (
                    <Badge count={mockCheckResult.summary.unitCheck.fail} />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <ProfileOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <div className="text-sm text-gray-500">项目特征检查</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{mockCheckResult.summary.featureCheck.pass}</span>
                  <span className="text-gray-400">/ {mockCheckResult.summary.featureCheck.total}</span>
                  {mockCheckResult.summary.featureCheck.fail > 0 && (
                    <Badge count={mockCheckResult.summary.featureCheck.fail} />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <ApartmentOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              <div>
                <div className="text-sm text-gray-500">费用结构检查</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{mockCheckResult.summary.structureCheck.pass}</span>
                  <span className="text-gray-400">/ {mockCheckResult.summary.structureCheck.total}</span>
                  {mockCheckResult.summary.structureCheck.fail > 0 && (
                    <Badge count={mockCheckResult.summary.structureCheck.fail} />
                  )}
                </div>
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
          message={`发现 ${mockCheckResult.issueCount.error} 个严重合规性问题，请优先处理`}
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
                { key: 'code', label: '编码' },
                { key: 'unit', label: '单位' },
                { key: 'feature', label: '特征' },
                { key: 'structure', label: '结构' },
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
            <span className="text-lg font-medium">合规性检查</span>
            <span className="text-gray-400 ml-2">清单编码 · 计量单位 · 项目特征 · 费用结构</span>
          </div>
          <Tag color="blue">依据 GB 50500-2013</Tag>
        </div>
      </Card>

      {/* 内容区 */}
      {!hasFile && renderUploadArea()}
      {hasFile && checking && renderChecking()}
      {hasFile && checkComplete && renderCheckResult()}
    </div>
  );
};

export default ComplianceCheckPage;
