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
  Steps,
  List,
  Badge,
  Alert,
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
  SwapOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  AuditOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// 变更签证数据类型
interface ChangeVisa {
  id: string;
  changeNo: string;
  changeType: 'design_change' | 'visa' | 'claim';
  changeDate: string;
  changeAmount: number;
  status: 'approved' | 'pending' | 'rejected';
}

// 复核问题数据类型
interface ReviewIssue {
  id: string;
  issueType: 'item' | 'quantity' | 'price' | 'change' | 'fee';
  severity: 'error' | 'warning' | 'info';
  itemCode: string;
  itemName: string;
  description: string;
  contractValue: string;
  settlementValue: string;
  deduction: number;
  suggestion: string;
}

// 模拟合同文件
const mockContract = {
  fileName: '某住宅项目施工合同.gcz',
  contractNo: 'HT-2024-001',
  contractDate: '2024-03-15',
  contractAmount: 56800000,
  itemCount: 186,
};

// 模拟结算文件
const mockSettlement = {
  fileName: '某住宅项目结算送审.gcz',
  submitDate: '2026-01-05',
  settlementAmount: 63500000,
  itemCount: 201,
};

// 模拟变更签证
const mockChanges: ChangeVisa[] = [
  { id: '1', changeNo: 'DG-001', changeType: 'design_change', changeDate: '2024-06-15', changeAmount: 1250000, status: 'approved' },
  { id: '2', changeNo: 'DG-002', changeType: 'design_change', changeDate: '2024-08-20', changeAmount: 850000, status: 'approved' },
  { id: '3', changeNo: 'QZ-001', changeType: 'visa', changeDate: '2024-09-10', changeAmount: 320000, status: 'approved' },
  { id: '4', changeNo: 'QZ-002', changeType: 'visa', changeDate: '2024-11-05', changeAmount: 180000, status: 'pending' },
  { id: '5', changeNo: 'DG-003', changeType: 'design_change', changeDate: '2025-01-20', changeAmount: -520000, status: 'approved' },
];

// 模拟复核问题
const mockIssues: ReviewIssue[] = [
  { id: '1', issueType: 'item', severity: 'error', itemCode: '010101005001', itemName: '基坑支护', description: '新增项无变更依据', contractValue: '无此项', settlementValue: '185,000元', deduction: 185000, suggestion: '请提供变更签证' },
  { id: '2', issueType: 'quantity', severity: 'error', itemCode: '010501004001', itemName: '矩形柱C30', description: '工程量偏差+4.4%', contractValue: '132.7m³', settlementValue: '138.5m³', deduction: 32000, suggestion: '请核实工程量' },
  { id: '3', issueType: 'price', severity: 'error', itemCode: '010501003001', itemName: '矩形梁C30', description: '固定单价被修改', contractValue: '650元/m³', settlementValue: '720元/m³', deduction: 63000, suggestion: '按合同单价结算' },
  { id: '4', issueType: 'change', severity: 'warning', itemCode: '-', itemName: '现场签证QZ-015', description: '签证金额不一致', contractValue: '签证：28万', settlementValue: '结算：30.5万', deduction: 25000, suggestion: '按签证金额结算' },
  { id: '5', issueType: 'fee', severity: 'warning', itemCode: '-', itemName: '措施费', description: '费率计算错误', contractValue: '费率8%', settlementValue: '费率8.5%', deduction: 150000, suggestion: '按合同费率计算' },
];

const SettlementReviewPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hasContract, setHasContract] = useState(false);
  const [hasSettlement, setHasSettlement] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: () => false,
  };

  // 获取变更类型标签
  const getChangeTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      design_change: { color: 'blue', text: '设计变更' },
      visa: { color: 'green', text: '现场签证' },
      claim: { color: 'orange', text: '工程索赔' },
    };
    const t = map[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
  };

  // 获取问题类型标签
  const getIssueTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      item: { color: 'red', text: '清单项' },
      quantity: { color: 'orange', text: '工程量' },
      price: { color: 'purple', text: '单价' },
      change: { color: 'blue', text: '变更签证' },
      fee: { color: 'cyan', text: '费用' },
    };
    const t = map[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
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

  // 模拟上传合同文件
  const handleUploadContract = () => {
    setHasContract(true);
    setStep(1);
  };

  // 模拟上传结算文件
  const handleUploadSettlement = () => {
    setHasSettlement(true);
    setStep(2);
  };

  // 模拟执行复核
  const handleRunReview = () => {
    setReviewComplete(true);
    setStep(3);
  };

  // 问题列定义
  const issueColumns: ColumnsType<ReviewIssue> = [
    { title: '严重程度', dataIndex: 'severity', key: 'severity', width: 90, render: (v) => getSeverityTag(v) },
    { title: '问题类型', dataIndex: 'issueType', key: 'issueType', width: 90, render: (v) => getIssueTypeTag(v) },
    { title: '清单项', key: 'item', width: 180, render: (_, r) => (
      <div>
        <div className="font-medium">{r.itemName}</div>
        {r.itemCode !== '-' && <div className="text-xs text-gray-400">{r.itemCode}</div>}
      </div>
    )},
    { title: '问题描述', dataIndex: 'description', key: 'description', width: 150 },
    { title: '合同值', dataIndex: 'contractValue', key: 'contractValue', width: 100 },
    { title: '结算值', dataIndex: 'settlementValue', key: 'settlementValue', width: 100 },
    { title: '核减金额', dataIndex: 'deduction', key: 'deduction', width: 100, align: 'right', render: (v) => <span className="text-red-500">-¥{(v/10000).toFixed(1)}万</span> },
    { title: '操作', key: 'action', width: 100, render: () => <Space><Button type="link" size="small">详情</Button><Button type="link" size="small">处理</Button></Space> },
  ];

  // 渲染步骤1：上传合同文件
  const renderStep1 = () => (
    <Card>
      <div className="text-center py-12">
        <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
        <div className="text-lg mt-4">上传合同文件（基准）</div>
        <div className="text-gray-400 mb-4">施工合同及清单，作为结算复核的基准</div>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} size="large" onClick={handleUploadContract}>
            选择文件
          </Button>
        </Upload>
      </div>
    </Card>
  );

  // 渲染步骤2：上传结算文件和变更签证
  const renderStep2 = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="合同文件（基准）" size="small">
          <div className="flex items-center gap-3">
            <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            <div>
              <div className="font-medium">{mockContract.fileName}</div>
              <div className="text-xs text-gray-400">
                合同金额：¥{(mockContract.contractAmount / 10000).toFixed(0)}万 | {mockContract.itemCount}项
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="变更签证"
          size="small"
          extra={<Upload {...uploadProps}><Button size="small" icon={<PlusOutlined />}>添加</Button></Upload>}
        >
          <List
            size="small"
            dataSource={mockChanges.slice(0, 3)}
            renderItem={item => (
              <List.Item>
                <Space>
                  {getChangeTypeTag(item.changeType)}
                  <span>{item.changeNo}</span>
                  <span className={item.changeAmount > 0 ? 'text-red-500' : 'text-green-500'}>
                    {item.changeAmount > 0 ? '+' : ''}{(item.changeAmount / 10000).toFixed(0)}万
                  </span>
                </Space>
              </List.Item>
            )}
          />
          <div className="text-center text-gray-400 text-xs mt-2">共{mockChanges.length}份变更签证</div>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="结算文件" size="small">
          {!hasSettlement ? (
            <div className="text-center py-4">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} onClick={handleUploadSettlement}>上传结算送审文件</Button>
              </Upload>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div>
                <div className="font-medium">{mockSettlement.fileName}</div>
                <div className="text-xs text-gray-400">
                  送审金额：¥{(mockSettlement.settlementAmount / 10000).toFixed(0)}万 | {mockSettlement.itemCount}项
                </div>
              </div>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );

  // 渲染步骤3：执行复核
  const renderStep3 = () => (
    <Card>
      <div className="text-center py-8">
        <AuditOutlined style={{ fontSize: 48, color: '#722ed1' }} />
        <div className="text-lg mt-4">准备就绪，开始结算复核</div>
        <div className="text-gray-400 mb-4">
          合同金额：¥{(mockContract.contractAmount / 10000).toFixed(0)}万 → 
          结算送审：¥{(mockSettlement.settlementAmount / 10000).toFixed(0)}万 
          <span className="text-red-500 ml-2">
            (+{((mockSettlement.settlementAmount - mockContract.contractAmount) / 10000).toFixed(0)}万, +{((mockSettlement.settlementAmount - mockContract.contractAmount) / mockContract.contractAmount * 100).toFixed(1)}%)
          </span>
        </div>
        <Button type="primary" size="large" onClick={handleRunReview}>
          开始复核分析
        </Button>
      </div>
    </Card>
  );

  // 渲染复核结果
  const renderResult = () => {
    const suggestedAmount = 60600000;
    const deductionAmount = mockSettlement.settlementAmount - suggestedAmount;

    return (
      <div className="space-y-4">
        {/* 项目信息 */}
        <Card size="small">
          <div className="flex items-center justify-between">
            <Space>
              <AuditOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              <div>
                <div className="font-medium">某住宅项目结算复核 - 第1轮</div>
                <div className="text-xs text-gray-400">
                  合同编号：{mockContract.contractNo} | 复核时间：2026-01-18
                </div>
              </div>
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />}>重新复核</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </div>
        </Card>

        {/* 金额对比 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="合同金额" value={mockContract.contractAmount / 10000} suffix="万元" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="结算送审" value={mockSettlement.settlementAmount / 10000} suffix="万元" valueStyle={{ color: '#f5222d' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="建议审定" value={suggestedAmount / 10000} suffix="万元" valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="核减金额" value={deductionAmount / 10000} prefix="-" suffix="万元" valueStyle={{ color: '#f5222d' }} />
              <div className="text-xs text-gray-400">核减率：{(deductionAmount / mockSettlement.settlementAmount * 100).toFixed(1)}%</div>
            </Card>
          </Col>
        </Row>

        {/* 复核统计 */}
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="复核维度统计">
              <Table
                size="small"
                pagination={false}
                dataSource={[
                  { key: '1', type: '清单项复核', checked: 201, issues: 3, deduction: 85 },
                  { key: '2', type: '工程量复核', checked: 201, issues: 12, deduction: 120 },
                  { key: '3', type: '单价复核', checked: 201, issues: 5, deduction: 45 },
                  { key: '4', type: '变更签证复核', checked: 28, issues: 2, deduction: 25 },
                  { key: '5', type: '费用复核', checked: 5, issues: 3, deduction: 15 },
                ]}
                columns={[
                  { title: '复核维度', dataIndex: 'type', key: 'type' },
                  { title: '检查数', dataIndex: 'checked', key: 'checked', align: 'center' },
                  { title: '问题数', dataIndex: 'issues', key: 'issues', align: 'center', render: (v) => v > 0 ? <Badge count={v} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
                  { title: '核减(万)', dataIndex: 'deduction', key: 'deduction', align: 'right', render: (v) => <span className="text-red-500">-{v}</span> },
                ]}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="变更签证汇总">
              <Descriptions size="small" column={2}>
                <Descriptions.Item label="变更签证数">{mockChanges.length}份</Descriptions.Item>
                <Descriptions.Item label="已审批">{mockChanges.filter(c => c.status === 'approved').length}份</Descriptions.Item>
                <Descriptions.Item label="变更增加">
                  <span className="text-red-500">+{(mockChanges.filter(c => c.changeAmount > 0).reduce((s, c) => s + c.changeAmount, 0) / 10000).toFixed(0)}万</span>
                </Descriptions.Item>
                <Descriptions.Item label="变更减少">
                  <span className="text-green-500">{(mockChanges.filter(c => c.changeAmount < 0).reduce((s, c) => s + c.changeAmount, 0) / 10000).toFixed(0)}万</span>
                </Descriptions.Item>
                <Descriptions.Item label="变更净额" span={2}>
                  <span className="font-bold text-red-500">+{(mockChanges.reduce((s, c) => s + c.changeAmount, 0) / 10000).toFixed(0)}万</span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* 问题提示 */}
        <Alert
          type="warning"
          showIcon
          message={`发现 ${mockIssues.length} 个问题，建议核减 ¥${(deductionAmount / 10000).toFixed(0)}万`}
        />

        {/* 问题清单 */}
        <Card size="small" title="问题清单">
          <Table
            rowKey="id"
            columns={issueColumns}
            dataSource={mockIssues}
            pagination={{ pageSize: 10 }}
            size="small"
            expandable={{
              expandedRowRender: (record) => (
                <div className="text-gray-500">
                  <strong>处理建议：</strong>{record.suggestion}
                </div>
              ),
            }}
          />
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">结算复核</span>
            <span className="text-gray-400 ml-2">合同价 vs 结算送审价 · 多维度复核</span>
          </div>
          <Tag color="purple">多文件对比</Tag>
        </div>
      </Card>

      {/* 步骤条 */}
      {!reviewComplete && (
        <Card size="small">
          <Steps
            current={step}
            items={[
              { title: '上传合同', description: '基准文件' },
              { title: '上传结算', description: '送审文件+变更' },
              { title: '执行复核', description: '多维度分析' },
              { title: '查看结果', description: '审定报告' },
            ]}
          />
        </Card>
      )}

      {/* 内容区 */}
      {!hasContract && renderStep1()}
      {hasContract && !hasSettlement && renderStep2()}
      {hasContract && hasSettlement && !reviewComplete && renderStep3()}
      {reviewComplete && renderResult()}
    </div>
  );
};

export default SettlementReviewPage;
