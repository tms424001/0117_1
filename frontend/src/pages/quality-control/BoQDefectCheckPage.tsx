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
  UnorderedListOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

// Issue数据类型
interface BoQDefectIssue {
  id: string;
  ruleId: string;
  ruleName: string;
  defectType: string;
  severity: 'error' | 'warning' | 'info';
  itemCode: string;
  itemName: string;
  location: string;
  description: string;
  suggestion: string;
  relatedItems?: string[];
  status: 'open' | 'confirmed' | 'fixed' | 'ignored';
}

// 模拟检查结果
const mockCheckResult = {
  fileName: '某医院门诊楼招标控制价.xml',
  fileType: '招标控制价',
  checkTime: '2026-01-18 15:45:20',
  checkDuration: '12秒',
  summary: {
    featureMissing: { total: 1256, pass: 1198, fail: 58 },
    featureConflict: { total: 1256, pass: 1248, fail: 8 },
    itemMissing: { total: 45, pass: 42, fail: 3 },
    quantityAbnormal: { total: 1256, pass: 1232, fail: 24 },
  },
  issueCount: { error: 12, warning: 52, info: 29 },
};

// 模拟Issue列表
const mockIssues: BoQDefectIssue[] = [
  {
    id: 'ISS001',
    ruleId: 'BOQ-FEAT-001',
    ruleName: '必填特征缺失检查',
    defectType: 'featureMissing',
    severity: 'error',
    itemCode: '010501004001',
    itemName: '现浇混凝土矩形柱',
    location: '分部分项 > 混凝土工程 > 第15项',
    description: '缺少必填特征"混凝土强度等级"',
    suggestion: '请补充混凝土强度等级（如C30、C35等）',
    status: 'open',
  },
  {
    id: 'ISS002',
    ruleId: 'BOQ-FEAT-001',
    ruleName: '必填特征缺失检查',
    defectType: 'featureMissing',
    severity: 'error',
    itemCode: '010501003002',
    itemName: '现浇混凝土梁',
    location: '分部分项 > 混凝土工程 > 第8项',
    description: '缺少必填特征"截面尺寸"',
    suggestion: '请补充梁截面尺寸（如250×500）',
    status: 'open',
  },
  {
    id: 'ISS003',
    ruleId: 'BOQ-FEAT-002',
    ruleName: '特征矛盾检查',
    defectType: 'featureConflict',
    severity: 'error',
    itemCode: '010401001003',
    itemName: '钢筋制安',
    location: '分部分项 > 钢筋工程 > 第3项',
    description: '特征描述"HRB400 Φ25"与清单名称"HPB300钢筋"矛盾',
    suggestion: '请核实钢筋种类，统一清单名称与特征描述',
    status: 'open',
  },
  {
    id: 'ISS004',
    ruleId: 'BOQ-MISS-001',
    ruleName: '关联项漏项检查',
    defectType: 'itemMissing',
    severity: 'error',
    itemCode: '-',
    itemName: '模板工程',
    location: '分部分项 > 混凝土工程',
    description: '存在混凝土清单项但未发现对应的模板清单项',
    suggestion: '混凝土工程通常需要配套模板，请检查是否漏项',
    relatedItems: ['010501004001 现浇混凝土矩形柱', '010501003002 现浇混凝土梁'],
    status: 'open',
  },
  {
    id: 'ISS005',
    ruleId: 'BOQ-QTY-001',
    ruleName: '工程量异常检查',
    defectType: 'quantityAbnormal',
    severity: 'warning',
    itemCode: '010401001005',
    itemName: '钢筋制安HRB400',
    location: '分部分项 > 钢筋工程 > 第5项',
    description: '含钢量125kg/m²超出参考区间(50-80kg/m²)',
    suggestion: '含钢量偏高，请核实钢筋工程量',
    status: 'open',
  },
  {
    id: 'ISS006',
    ruleId: 'BOQ-QTY-002',
    ruleName: '工程量为零检查',
    defectType: 'quantityAbnormal',
    severity: 'warning',
    itemCode: '010201001002',
    itemName: '砖基础',
    location: '分部分项 > 砌筑工程 > 第2项',
    description: '清单项工程量为0',
    suggestion: '工程量为0的清单项应删除或补充工程量',
    status: 'open',
  },
  {
    id: 'ISS007',
    ruleId: 'BOQ-FEAT-003',
    ruleName: '特征格式检查',
    defectType: 'featureMissing',
    severity: 'warning',
    itemCode: '010501002001',
    itemName: '现浇混凝土板',
    location: '分部分项 > 混凝土工程 > 第3项',
    description: '特征"板厚120"缺少单位',
    suggestion: '建议补充单位，如"板厚120mm"',
    status: 'open',
  },
  {
    id: 'ISS008',
    ruleId: 'BOQ-QTY-003',
    ruleName: '工程量精度检查',
    defectType: 'quantityAbnormal',
    severity: 'info',
    itemCode: '010101001001',
    itemName: '挖一般土方',
    location: '分部分项 > 土石方工程 > 第1项',
    description: '工程量5000.123456m³小数位数过多',
    suggestion: '建议保留2位小数',
    status: 'open',
  },
  {
    id: 'ISS009',
    ruleId: 'BOQ-MISS-002',
    ruleName: '措施项目漏项检查',
    defectType: 'itemMissing',
    severity: 'info',
    itemCode: '-',
    itemName: '脚手架',
    location: '措施项目',
    description: '存在多层建筑但未发现脚手架措施项目',
    suggestion: '多层建筑通常需要脚手架，请检查是否漏项',
    status: 'open',
  },
];

const BoQDefectCheckPage: React.FC = () => {
  const [hasFile, setHasFile] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [defectTypeFilter, setDefectTypeFilter] = useState('all');

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

  // 获取缺陷类型标签
  const getDefectTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      featureMissing: { color: 'red', text: '特征缺失', icon: <ExclamationCircleOutlined /> },
      featureConflict: { color: 'orange', text: '特征矛盾', icon: <ExclamationCircleOutlined /> },
      itemMissing: { color: 'purple', text: '清单漏项', icon: <LinkOutlined /> },
      quantityAbnormal: { color: 'blue', text: '工程量异常', icon: <CalculatorOutlined /> },
    };
    const t = map[type] || { color: 'default', text: type, icon: null };
    return <Tag color={t.color} icon={t.icon}>{t.text}</Tag>;
  };

  // Issue列定义
  const issueColumns: ColumnsType<BoQDefectIssue> = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 90,
      render: (v) => getSeverityTag(v),
    },
    {
      title: '缺陷类型',
      dataIndex: 'defectType',
      key: 'defectType',
      width: 110,
      render: (v) => getDefectTypeTag(v),
    },
    {
      title: '清单项',
      key: 'item',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.itemName}</div>
          <div className="text-xs text-gray-400">{record.itemCode !== '-' ? record.itemCode : '—'}</div>
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
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
      width: 280,
    },
    {
      title: '规则',
      dataIndex: 'ruleId',
      key: 'ruleId',
      width: 100,
      render: (v) => <span className="text-xs text-gray-400">{v}</span>,
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
      if (defectTypeFilter !== 'all' && i.defectType !== defectTypeFilter) return false;
      return true;
    });
  };

  // 渲染上传区域
  const renderUploadArea = () => (
    <Card className="text-center py-12">
      <Upload {...uploadProps}>
        <div className="space-y-4">
          <UnorderedListOutlined style={{ fontSize: 64, color: '#13c2c2' }} />
          <div className="text-lg">上传造价文件进行清单缺陷检查</div>
          <div className="text-gray-400">检查特征缺失、特征矛盾、清单漏项、工程量异常</div>
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
        <div className="text-lg">正在进行清单缺陷检查...</div>
        <div className="text-gray-400">检查特征完整性、逻辑一致性、关联项漏项...</div>
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
            <FileTextOutlined style={{ fontSize: 24, color: '#13c2c2' }} />
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">特征缺失检查</div>
                <div className="text-xs text-gray-400">必填特征完整性</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.featureMissing.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.featureMissing.total}</span>
                {mockCheckResult.summary.featureMissing.fail > 0 && (
                  <Badge count={mockCheckResult.summary.featureMissing.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">特征矛盾检查</div>
                <div className="text-xs text-gray-400">名称与特征一致</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.featureConflict.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.featureConflict.total}</span>
                {mockCheckResult.summary.featureConflict.fail > 0 && (
                  <Badge count={mockCheckResult.summary.featureConflict.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">清单漏项检查</div>
                <div className="text-xs text-gray-400">关联项完整性</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.itemMissing.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.itemMissing.total}</span>
                {mockCheckResult.summary.itemMissing.fail > 0 && (
                  <Badge count={mockCheckResult.summary.itemMissing.fail} className="ml-2" />
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">工程量异常检查</div>
                <div className="text-xs text-gray-400">数值合理性</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mockCheckResult.summary.quantityAbnormal.pass}</span>
                <span className="text-gray-400">/ {mockCheckResult.summary.quantityAbnormal.total}</span>
                {mockCheckResult.summary.quantityAbnormal.fail > 0 && (
                  <Badge count={mockCheckResult.summary.quantityAbnormal.fail} className="ml-2" />
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
          message={`发现 ${mockCheckResult.issueCount.error} 个严重清单缺陷，请优先处理`}
        />
      )}

      {/* Issue列表 */}
      <Card
        size="small"
        title="问题清单"
        extra={
          <Space>
            <Tabs
              activeKey={defectTypeFilter}
              onChange={setDefectTypeFilter}
              size="small"
              items={[
                { key: 'all', label: '全部' },
                { key: 'featureMissing', label: '特征缺失' },
                { key: 'featureConflict', label: '特征矛盾' },
                { key: 'itemMissing', label: '清单漏项' },
                { key: 'quantityAbnormal', label: '工程量异常' },
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
                <Descriptions.Item label="规则名称">{record.ruleName}</Descriptions.Item>
                {record.relatedItems && (
                  <Descriptions.Item label="关联清单项" span={2}>
                    {record.relatedItems.map((item, idx) => (
                      <Tag key={idx} className="mb-1">{item}</Tag>
                    ))}
                  </Descriptions.Item>
                )}
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
            <span className="text-lg font-medium">清单缺陷检查</span>
            <span className="text-gray-400 ml-2">特征缺失 · 特征矛盾 · 清单漏项 · 工程量异常</span>
          </div>
          <Tag color="cyan">内容质量检查</Tag>
        </div>
      </Card>

      {/* 内容区 */}
      {!hasFile && renderUploadArea()}
      {hasFile && checking && renderChecking()}
      {hasFile && checkComplete && renderCheckResult()}
    </div>
  );
};

export default BoQDefectCheckPage;
