import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Table,
  Statistic,
  Badge,
  Modal,
  Descriptions,
  Progress,
  Tabs,
  Alert,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  CodeOutlined,
  ColumnWidthOutlined,
  ProfileOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

// 检查记录数据类型
interface CheckRecord {
  id: string;
  fileName: string;
  fileType: string;
  checkTime: string;
  status: 'completed' | 'failed';
  issueCount: { error: number; warning: number; info: number };
  passRate: number;
}

// Issue数据类型
interface ComplianceIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  checkType: string;
  severity: 'error' | 'warning' | 'info';
  location: string;
  description: string;
  suggestion: string;
}

// 模拟检查历史记录
const mockCheckRecords: CheckRecord[] = [
  { id: '1', fileName: '某医院门诊楼招标控制价.xml', fileType: '招标控制价', checkTime: '2026-01-18 15:30:25', status: 'completed', issueCount: { error: 12, warning: 18, info: 8 }, passRate: 97.0 },
  { id: '2', fileName: '某住宅项目投标报价.gcz', fileType: '投标报价', checkTime: '2026-01-18 14:20:00', status: 'completed', issueCount: { error: 3, warning: 8, info: 5 }, passRate: 99.2 },
  { id: '3', fileName: '某商业综合体概算.gzb', fileType: '概算', checkTime: '2026-01-17 16:45:00', status: 'completed', issueCount: { error: 0, warning: 5, info: 12 }, passRate: 100 },
  { id: '4', fileName: '某学校项目结算.xml', fileType: '结算', checkTime: '2026-01-17 10:30:00', status: 'completed', issueCount: { error: 8, warning: 15, info: 6 }, passRate: 96.5 },
  { id: '5', fileName: '某工厂项目招标.gcz', fileType: '招标控制价', checkTime: '2026-01-16 09:15:00', status: 'failed', issueCount: { error: 0, warning: 0, info: 0 }, passRate: 0 },
];

// 模拟检查详情
const mockCheckDetail = {
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
  { id: 'ISS001', ruleId: 'CMP-CODE-001', ruleName: '编码长度检查', checkType: 'code', severity: 'error', location: '分部分项 > 土石方工程 > 第3项', description: '清单编码长度不符合12位规范', suggestion: '请补充完整的12位清单编码' },
  { id: 'ISS002', ruleId: 'CMP-CODE-002', ruleName: '专业编码有效性', checkType: 'code', severity: 'error', location: '分部分项 > 安装工程 > 第1项', description: '专业编码不在有效专业编码表中', suggestion: '请使用有效的专业编码（01-09）' },
  { id: 'ISS003', ruleId: 'CMP-CODE-103', ruleName: '编码与单位匹配', checkType: 'code', severity: 'error', location: '分部分项 > 混凝土工程 > 矩形柱', description: '清单编码对应的标准单位为m³，实际使用m²', suggestion: '请修正计量单位为m³' },
  { id: 'ISS004', ruleId: 'CMP-UNIT-001', ruleName: '单位标准化检查', checkType: 'unit', severity: 'warning', location: '分部分项 > 装饰工程 > 第8项', description: '计量单位不是标准写法', suggestion: '建议使用标准单位m²' },
  { id: 'ISS005', ruleId: 'CMP-UNIT-002', ruleName: '单位与编码匹配', checkType: 'unit', severity: 'error', location: '分部分项 > 钢筋工程 > 第5项', description: '该清单项规范要求使用t作为计量单位', suggestion: '请修正计量单位为t' },
  { id: 'ISS006', ruleId: 'CMP-FEAT-001', ruleName: '必填特征完整性', checkType: 'feature', severity: 'error', location: '分部分项 > 混凝土工程 > 矩形柱', description: '矩形柱缺少必填特征混凝土强度等级', suggestion: '请补充混凝土强度等级（如C30）' },
  { id: 'ISS007', ruleId: 'CMP-FEAT-001', ruleName: '必填特征完整性', checkType: 'feature', severity: 'error', location: '分部分项 > 砌筑工程 > 墙体砌筑', description: '墙体砌筑缺少必填特征砂浆强度等级', suggestion: '请补充砂浆强度等级（如M5）' },
  { id: 'ISS008', ruleId: 'CMP-FEAT-002', ruleName: '特征描述非空', checkType: 'feature', severity: 'warning', location: '分部分项 > 门窗工程 > 第3项', description: '项目特征字段为空', suggestion: '请填写项目特征描述' },
  { id: 'ISS009', ruleId: 'CMP-CODE-006', ruleName: '序号连续性检查', checkType: 'code', severity: 'info', location: '分部分项 > 土石方工程', description: '清单项序号不连续，缺少0003', suggestion: '建议保持序号连续' },
];

const ComplianceCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [checkTypeFilter, setCheckTypeFilter] = useState('all');

  // 查看详情
  const handleViewDetail = (record: CheckRecord) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 跳转到工作台发起新检查
  const handleNewCheck = () => {
    navigate('/quality-control/workbench');
  };

  // 获取问题数显示
  const getIssueDisplay = (issues: { error: number; warning: number; info: number }) => {
    const total = issues.error + issues.warning + issues.info;
    if (total === 0) return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    return (
      <Space size="small">
        {issues.error > 0 && <Badge count={issues.error} style={{ backgroundColor: '#f5222d' }} />}
        {issues.warning > 0 && <Badge count={issues.warning} style={{ backgroundColor: '#fa8c16' }} />}
        {issues.info > 0 && <Badge count={issues.info} style={{ backgroundColor: '#1890ff' }} />}
      </Space>
    );
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

  // 检查记录列定义
  const recordColumns: ColumnsType<CheckRecord> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (v, r) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <div>
            <div className="font-medium">{v}</div>
            <div className="text-xs text-gray-400">{r.fileType}</div>
          </div>
        </div>
      ),
    },
    { title: '检查时间', dataIndex: 'checkTime', key: 'checkTime', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v) => v === 'completed' ? <Tag color="green">已完成</Tag> : <Tag color="red">失败</Tag>,
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      width: 120,
      render: (v) => v > 0 ? <Progress percent={v} size="small" /> : '-',
    },
    {
      title: '问题数',
      key: 'issues',
      width: 120,
      render: (_, r) => getIssueDisplay(r.issueCount),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="link" size="small" icon={<ReloadOutlined />}>重检</Button>
        </Space>
      ),
    },
  ];

  // Issue列定义
  const issueColumns: ColumnsType<ComplianceIssue> = [
    { title: '严重程度', dataIndex: 'severity', key: 'severity', width: 90, render: (v) => getSeverityTag(v) },
    { title: '检查类型', dataIndex: 'checkType', key: 'checkType', width: 100, render: (v) => getCheckTypeTag(v) },
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
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '问题描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">定位</Button>
          <Button type="link" size="small">处理</Button>
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

  // 统计数据
  const stats = {
    total: mockCheckRecords.length,
    completed: mockCheckRecords.filter(r => r.status === 'completed').length,
    totalIssues: mockCheckRecords.reduce((sum, r) => sum + r.issueCount.error + r.issueCount.warning, 0),
    avgPassRate: Math.round(mockCheckRecords.filter(r => r.passRate > 0).reduce((sum, r) => sum + r.passRate, 0) / mockCheckRecords.filter(r => r.passRate > 0).length * 10) / 10,
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">合规性检查</span>
            <span className="text-gray-400 ml-2">清单编码 · 计量单位 · 项目特征 · 费用结构</span>
          </div>
          <Space>
            <Tag color="blue">依据 GB 50500-2013</Tag>
            <Button type="primary" icon={<SafetyCertificateOutlined />} onClick={handleNewCheck}>发起新检查</Button>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="检查总数" value={stats.total} suffix="次" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="检查完成" value={stats.completed} valueStyle={{ color: '#52c41a' }} suffix="次" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待处理问题" value={stats.totalIssues} valueStyle={{ color: '#f5222d' }} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="平均通过率" value={stats.avgPassRate} suffix="%" />
          </Card>
        </Col>
      </Row>

      {/* 检查历史列表 */}
      <Card size="small" title="检查历史">
        <Table
          rowKey="id"
          columns={recordColumns}
          dataSource={mockCheckRecords}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条记录` }}
          size="small"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={`检查详情 - ${selectedRecord?.fileName}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="export" icon={<DownloadOutlined />}>导出报告</Button>,
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
        ]}
      >
        {selectedRecord && (
          <div className="space-y-4">
            {/* 检查概要 */}
            <Descriptions size="small" bordered column={4}>
              <Descriptions.Item label="文件名">{mockCheckDetail.fileName}</Descriptions.Item>
              <Descriptions.Item label="文件类型">{mockCheckDetail.fileType}</Descriptions.Item>
              <Descriptions.Item label="检查时间">{mockCheckDetail.checkTime}</Descriptions.Item>
              <Descriptions.Item label="耗时">{mockCheckDetail.checkDuration}</Descriptions.Item>
            </Descriptions>

            {/* 分项统计 */}
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small">
                  <div className="flex items-center gap-2">
                    <CodeOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    <div>
                      <div className="text-xs text-gray-400">编码检查</div>
                      <div>{mockCheckDetail.summary.codeCheck.pass}/{mockCheckDetail.summary.codeCheck.total}</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div className="flex items-center gap-2">
                    <ColumnWidthOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                    <div>
                      <div className="text-xs text-gray-400">单位检查</div>
                      <div>{mockCheckDetail.summary.unitCheck.pass}/{mockCheckDetail.summary.unitCheck.total}</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div className="flex items-center gap-2">
                    <ProfileOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                    <div>
                      <div className="text-xs text-gray-400">特征检查</div>
                      <div>{mockCheckDetail.summary.featureCheck.pass}/{mockCheckDetail.summary.featureCheck.total}</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div className="flex items-center gap-2">
                    <ApartmentOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                    <div>
                      <div className="text-xs text-gray-400">结构检查</div>
                      <div>{mockCheckDetail.summary.structureCheck.pass}/{mockCheckDetail.summary.structureCheck.total}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 问题提示 */}
            {mockCheckDetail.issueCount.error > 0 && (
              <Alert type="error" showIcon message={`发现 ${mockCheckDetail.issueCount.error} 个严重问题`} />
            )}

            {/* Issue列表 */}
            <Card
              size="small"
              title="问题清单"
              extra={
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="small"
                  items={[
                    { key: 'all', label: `全部 (${mockIssues.length})` },
                    { key: 'error', label: <span className="text-red-500">严重 ({mockCheckDetail.issueCount.error})</span> },
                    { key: 'warning', label: <span className="text-orange-500">一般 ({mockCheckDetail.issueCount.warning})</span> },
                    { key: 'info', label: <span className="text-blue-500">提示 ({mockCheckDetail.issueCount.info})</span> },
                  ]}
                />
              }
            >
              <Table
                rowKey="id"
                columns={issueColumns}
                dataSource={getFilteredIssues()}
                pagination={{ pageSize: 5 }}
                size="small"
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="text-gray-500"><strong>建议：</strong>{record.suggestion}</div>
                  ),
                }}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplianceCheckPage;
