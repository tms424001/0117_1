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
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface IssueItem {
  id: string;
  ruleId: string;
  ruleName: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  location: string;
  description: string;
  suggestion: string;
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  checkTime: '2026-01-18 15:30:25',
  checkDuration: '12秒',
  totalItems: 1256,
  checkedItems: 1256,
  passRate: 94.5,
  issueCount: {
    error: 8,
    warning: 23,
    info: 15,
  },
};

// 模拟Issue列表
const mockIssues: IssueItem[] = [
  {
    id: 'ISS001',
    ruleId: 'CMP-001',
    ruleName: '清单编码格式检查',
    category: '合规性',
    severity: 'error',
    location: '分部分项 > 土石方工程 > 第3项',
    description: '清单编码"010101003"格式不符合GB50500规范',
    suggestion: '请检查并修正清单编码格式',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'PRC-MAT-001',
    ruleName: '材料价格合理性检查',
    category: '价格检查',
    severity: 'error',
    location: '材料 > 商品混凝土C30',
    description: '材料单价￥680/m³超出信息价区间(￥450-￥520)',
    suggestion: '请核实材料价格是否正确',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'PRC-MAT-003',
    ruleName: '混凝土强度等级价格逻辑',
    category: '价格检查',
    severity: 'error',
    location: '材料 > 混凝土',
    description: 'C25混凝土单价(￥490)高于C30混凝土单价(￥480)',
    suggestion: '高强度等级混凝土单价应不低于低强度等级',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'BOQ-001',
    ruleName: '项目特征完整性检查',
    category: '清单缺陷',
    severity: 'warning',
    location: '分部分项 > 砌筑工程 > 第5项',
    description: '清单项缺少必填特征"砂浆强度等级"',
    suggestion: '请补充完整项目特征',
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'BOQ-002',
    ruleName: '工程量异常检查',
    category: '清单缺陷',
    severity: 'warning',
    location: '分部分项 > 钢筋工程 > 第12项',
    description: '工程量与建筑面积比值异常(含钢量=125kg/m²，参考区间50-80kg/m²)',
    suggestion: '请核实工程量是否正确',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'IDX-001',
    ruleName: '单方造价合理性检查',
    category: '指标检查',
    severity: 'warning',
    location: '项目级指标',
    description: '单方造价￥5,850/m²超出同类项目参考区间(￥4,200-￥5,200)',
    suggestion: '请核实造价是否合理',
    status: 'open',
  },
  {
    id: 'ISS007',
    ruleId: 'CMP-002',
    ruleName: '计量单位规范性检查',
    category: '合规性',
    severity: 'info',
    location: '分部分项 > 装饰工程 > 第8项',
    description: '计量单位"平方"建议使用标准单位"m²"',
    suggestion: '建议使用标准计量单位',
    status: 'open',
  },
];

const SingleFileCheckPage: React.FC = () => {
  const [hasFile, setHasFile] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: () => {
      setHasFile(true);
      setChecking(true);
      // 模拟检查过程
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

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      open: { color: 'red', text: '待处理' },
      confirmed: { color: 'orange', text: '已确认' },
      fixed: { color: 'green', text: '已修复' },
      ignored: { color: 'default', text: '已忽略' },
    };
    const s = map[status] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // Issue列定义
  const issueColumns: ColumnsType<IssueItem> = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 90,
      render: (v) => getSeverityTag(v),
    },
    {
      title: '规则',
      key: 'rule',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.ruleName}</div>
          <div className="text-xs text-gray-400">{record.ruleId}</div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      ellipsis: true,
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
      width: 280,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v) => getStatusTag(v),
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
    if (activeTab === 'all') return mockIssues;
    return mockIssues.filter(i => i.severity === activeTab);
  };

  // 渲染上传区域
  const renderUploadArea = () => (
    <Card className="text-center py-12">
      <Upload {...uploadProps}>
        <div className="space-y-4">
          <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
          <div className="text-lg">上传造价文件进行质控检查</div>
          <div className="text-gray-400">支持 XML、GCZ、GZB 格式</div>
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
        <div className="text-lg">正在检查...</div>
        <div className="text-gray-400">正在执行合规性检查、价格检查、清单缺陷检查...</div>
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

      {/* 检查概览 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="检查项"
              value={mockCheckResult.checkedItems}
              suffix={`/ ${mockCheckResult.totalItems}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="通过率"
              value={mockCheckResult.passRate}
              suffix="%"
              valueStyle={{ color: mockCheckResult.passRate >= 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <Statistic
                title="问题总数"
                value={mockCheckResult.issueCount.error + mockCheckResult.issueCount.warning + mockCheckResult.issueCount.info}
              />
              <div className="text-right">
                <Badge color="red" text={`严重 ${mockCheckResult.issueCount.error}`} />
                <br />
                <Badge color="orange" text={`一般 ${mockCheckResult.issueCount.warning}`} />
                <br />
                <Badge color="blue" text={`提示 ${mockCheckResult.issueCount.info}`} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="text-center">
              {mockCheckResult.issueCount.error > 0 ? (
                <>
                  <CloseCircleOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                  <div className="mt-2 text-red-500">存在严重问题</div>
                </>
              ) : (
                <>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div className="mt-2 text-green-500">检查通过</div>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 问题提示 */}
      {mockCheckResult.issueCount.error > 0 && (
        <Alert
          type="error"
          showIcon
          message={`发现 ${mockCheckResult.issueCount.error} 个严重问题，请优先处理`}
        />
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
              { key: 'error', label: <span className="text-red-500">严重 ({mockCheckResult.issueCount.error})</span> },
              { key: 'warning', label: <span className="text-orange-500">一般 ({mockCheckResult.issueCount.warning})</span> },
              { key: 'info', label: <span className="text-blue-500">提示 ({mockCheckResult.issueCount.info})</span> },
            ]}
          />
        }
      >
        <Table
          rowKey="id"
          columns={issueColumns}
          dataSource={getFilteredIssues()}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个问题`,
          }}
          size="small"
        />
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <span className="text-lg font-medium">单文件检查</span>
      </Card>

      {/* 内容区 */}
      {!hasFile && renderUploadArea()}
      {hasFile && checking && renderChecking()}
      {hasFile && checkComplete && renderCheckResult()}
    </div>
  );
};

export default SingleFileCheckPage;
