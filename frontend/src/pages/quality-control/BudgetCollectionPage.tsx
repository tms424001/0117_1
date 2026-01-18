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
  PlusOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// 单项工程概算数据类型
interface UnitBudget {
  id: string;
  unitName: string;
  unitType: string;
  buildingArea: number;
  totalAmount: number;
  unitCost: number;
  status: 'pending' | 'checked' | 'error';
  issues: number;
}

// 归集问题数据类型
interface CollectionIssue {
  id: string;
  issueType: 'consistency' | 'completeness' | 'calculation' | 'index';
  severity: 'error' | 'warning' | 'info';
  unitName: string;
  description: string;
  suggestion: string;
}

// 模拟单项工程概算
const mockUnitBudgets: UnitBudget[] = [
  { id: '1', unitName: '1#住宅楼', unitType: '住宅', buildingArea: 12500, totalAmount: 62500000, unitCost: 5000, status: 'checked', issues: 2 },
  { id: '2', unitName: '2#住宅楼', unitType: '住宅', buildingArea: 12500, totalAmount: 63750000, unitCost: 5100, status: 'checked', issues: 1 },
  { id: '3', unitName: '3#住宅楼', unitType: '住宅', buildingArea: 11800, totalAmount: 59000000, unitCost: 5000, status: 'checked', issues: 0 },
  { id: '4', unitName: '商业裙房', unitType: '商业', buildingArea: 8500, totalAmount: 51000000, unitCost: 6000, status: 'checked', issues: 3 },
  { id: '5', unitName: '地下车库', unitType: '车库', buildingArea: 25000, totalAmount: 75000000, unitCost: 3000, status: 'checked', issues: 1 },
];

// 模拟归集问题
const mockIssues: CollectionIssue[] = [
  { id: '1', issueType: 'consistency', severity: 'error', unitName: '商业裙房', description: '人工单价与其他单项工程不一致（85元/工日 vs 80元/工日）', suggestion: '统一人工单价标准' },
  { id: '2', issueType: 'consistency', severity: 'warning', unitName: '2#住宅楼', description: '措施费费率与1#住宅楼不一致（8.5% vs 8%）', suggestion: '核实费率差异原因' },
  { id: '3', issueType: 'index', severity: 'warning', unitName: '商业裙房', description: '单方造价6000元/m²高于同类项目参考值（5200-5800元/m²）', suggestion: '核实造价偏高原因' },
  { id: '4', issueType: 'calculation', severity: 'warning', unitName: '地下车库', description: '分部汇总与单项合计差异0.5万元', suggestion: '检查计算过程' },
  { id: '5', issueType: 'completeness', severity: 'info', unitName: '全局', description: '未发现室外工程概算', suggestion: '确认是否需要编制室外工程概算' },
];

const BudgetCollectionPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hasFiles, setHasFiles] = useState(false);
  const [collectionComplete, setCollectionComplete] = useState(false);

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    multiple: true,
    showUploadList: false,
    beforeUpload: () => false,
  };

  // 获取问题类型标签
  const getIssueTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      consistency: { color: 'red', text: '一致性' },
      completeness: { color: 'orange', text: '完整性' },
      calculation: { color: 'purple', text: '计算' },
      index: { color: 'blue', text: '指标' },
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

  // 模拟上传文件
  const handleUploadFiles = () => {
    setHasFiles(true);
    setStep(1);
  };

  // 模拟执行归集
  const handleRunCollection = () => {
    setCollectionComplete(true);
    setStep(2);
  };

  // 单项工程列定义
  const unitColumns: ColumnsType<UnitBudget> = [
    { title: '单项工程', dataIndex: 'unitName', key: 'unitName', render: (v, r) => (
      <div className="flex items-center gap-2">
        <FolderOutlined style={{ color: '#1890ff' }} />
        <div>
          <div className="font-medium">{v}</div>
          <div className="text-xs text-gray-400">{r.unitType}</div>
        </div>
      </div>
    )},
    { title: '建筑面积', dataIndex: 'buildingArea', key: 'buildingArea', width: 120, align: 'right', render: (v) => `${v.toLocaleString()} m²` },
    { title: '概算金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 140, align: 'right', render: (v) => `¥${(v/10000).toFixed(0)}万` },
    { title: '单方造价', dataIndex: 'unitCost', key: 'unitCost', width: 120, align: 'right', render: (v) => `¥${v}/m²` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => v === 'checked' ? <Tag color="green">已检查</Tag> : <Tag>待检查</Tag> },
    { title: '问题', dataIndex: 'issues', key: 'issues', width: 80, align: 'center', render: (v) => v > 0 ? <Badge count={v} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
    { title: '操作', key: 'action', width: 100, render: () => <Button type="link" size="small">详情</Button> },
  ];

  // 问题列定义
  const issueColumns: ColumnsType<CollectionIssue> = [
    { title: '严重程度', dataIndex: 'severity', key: 'severity', width: 90, render: (v) => getSeverityTag(v) },
    { title: '问题类型', dataIndex: 'issueType', key: 'issueType', width: 90, render: (v) => getIssueTypeTag(v) },
    { title: '单项工程', dataIndex: 'unitName', key: 'unitName', width: 120 },
    { title: '问题描述', dataIndex: 'description', key: 'description' },
    { title: '操作', key: 'action', width: 100, render: () => <Space><Button type="link" size="small">详情</Button><Button type="link" size="small">处理</Button></Space> },
  ];

  // 渲染步骤1：上传单项工程概算
  const renderStep1 = () => (
    <Card>
      <div className="text-center py-12">
        <FolderOutlined style={{ fontSize: 64, color: '#fa8c16' }} />
        <div className="text-lg mt-4">上传单项工程概算文件</div>
        <div className="text-gray-400 mb-4">支持批量上传多个单项工程概算文件</div>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} size="large" onClick={handleUploadFiles}>
            选择文件
          </Button>
        </Upload>
      </div>
    </Card>
  );

  // 渲染步骤2：确认文件列表
  const renderStep2 = () => (
    <div className="space-y-4">
      <Card
        size="small"
        title={`单项工程概算文件（${mockUnitBudgets.length}个）`}
        extra={
          <Upload {...uploadProps}>
            <Button icon={<PlusOutlined />}>添加文件</Button>
          </Upload>
        }
      >
        <Table
          rowKey="id"
          columns={unitColumns}
          dataSource={mockUnitBudgets}
          pagination={false}
          size="small"
          summary={() => {
            const totalArea = mockUnitBudgets.reduce((s, u) => s + u.buildingArea, 0);
            const totalAmount = mockUnitBudgets.reduce((s, u) => s + u.totalAmount, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right"><strong>{totalArea.toLocaleString()} m²</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right"><strong>¥{(totalAmount/10000).toFixed(0)}万</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right"><strong>¥{Math.round(totalAmount/totalArea)}/m²</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={3}></Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
      <div className="text-center">
        <Button type="primary" size="large" onClick={handleRunCollection}>
          开始归集分析
        </Button>
      </div>
    </div>
  );

  // 渲染归集结果
  const renderResult = () => {
    const totalArea = mockUnitBudgets.reduce((s, u) => s + u.buildingArea, 0);
    const totalAmount = mockUnitBudgets.reduce((s, u) => s + u.totalAmount, 0);
    const avgUnitCost = Math.round(totalAmount / totalArea);

    // 费用构成模拟数据
    const feeStructure = [
      { name: '建筑安装工程费', amount: totalAmount * 0.72, percent: 72 },
      { name: '设备及工器具购置费', amount: totalAmount * 0.12, percent: 12 },
      { name: '工程建设其他费', amount: totalAmount * 0.08, percent: 8 },
      { name: '预备费', amount: totalAmount * 0.05, percent: 5 },
      { name: '建设期利息', amount: totalAmount * 0.03, percent: 3 },
    ];

    return (
      <div className="space-y-4">
        {/* 项目信息 */}
        <Card size="small">
          <div className="flex items-center justify-between">
            <Space>
              <PieChartOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <div className="font-medium">某住宅小区项目概算归集</div>
                <div className="text-xs text-gray-400">
                  单项工程：{mockUnitBudgets.length}个 | 归集时间：2026-01-18
                </div>
              </div>
            </Space>
            <Space>
              <Button icon={<ReloadOutlined />}>重新归集</Button>
              <Button icon={<DownloadOutlined />}>导出报表</Button>
            </Space>
          </div>
        </Card>

        {/* 汇总统计 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="项目总投资" value={totalAmount / 10000} suffix="万元" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="总建筑面积" value={totalArea} suffix="m²" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="综合单方造价" value={avgUnitCost} suffix="元/m²" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="单项工程数" value={mockUnitBudgets.length} suffix="个" />
            </Card>
          </Col>
        </Row>

        {/* 费用构成和单项工程 */}
        <Row gutter={16}>
          <Col span={10}>
            <Card size="small" title="投资构成分析">
              <div className="space-y-3">
                {feeStructure.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span>¥{(item.amount / 10000).toFixed(0)}万 ({item.percent}%)</span>
                    </div>
                    <Progress percent={item.percent} showInfo={false} strokeColor="#fa8c16" />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={14}>
            <Card size="small" title="单项工程概算">
              <Table
                rowKey="id"
                columns={[
                  { title: '单项工程', dataIndex: 'unitName', key: 'unitName' },
                  { title: '面积(m²)', dataIndex: 'buildingArea', key: 'buildingArea', align: 'right', render: (v) => v.toLocaleString() },
                  { title: '金额(万)', key: 'amount', align: 'right', render: (_, r) => (r.totalAmount / 10000).toFixed(0) },
                  { title: '单方(元/m²)', dataIndex: 'unitCost', key: 'unitCost', align: 'right' },
                  { title: '占比', key: 'percent', align: 'center', render: (_, r) => `${(r.totalAmount / totalAmount * 100).toFixed(1)}%` },
                ]}
                dataSource={mockUnitBudgets}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 问题提示 */}
        {mockIssues.filter(i => i.severity === 'error').length > 0 && (
          <Alert
            type="warning"
            showIcon
            message={`发现 ${mockIssues.length} 个问题，其中 ${mockIssues.filter(i => i.severity === 'error').length} 个需要重点关注`}
          />
        )}

        {/* 问题清单 */}
        <Card size="small" title="一致性与完整性检查">
          <Table
            rowKey="id"
            columns={issueColumns}
            dataSource={mockIssues}
            pagination={false}
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
            <span className="text-lg font-medium">概算归集</span>
            <span className="text-gray-400 ml-2">多单项工程汇总 · 一致性检查 · 指标分析</span>
          </div>
          <Tag color="orange">多文件汇总</Tag>
        </div>
      </Card>

      {/* 步骤条 */}
      {!collectionComplete && (
        <Card size="small">
          <Steps
            current={step}
            items={[
              { title: '上传文件', description: '单项工程概算' },
              { title: '确认归集', description: '检查文件列表' },
              { title: '查看结果', description: '汇总报表' },
            ]}
          />
        </Card>
      )}

      {/* 内容区 */}
      {!hasFiles && renderStep1()}
      {hasFiles && !collectionComplete && renderStep2()}
      {collectionComplete && renderResult()}
    </div>
  );
};

export default BudgetCollectionPage;
