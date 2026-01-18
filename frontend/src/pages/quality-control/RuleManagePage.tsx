import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Switch,
  Modal,
  Form,
  InputNumber,
  Descriptions,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { TextArea } = Input;

// 规则数据类型
interface QCRule {
  id: string;
  ruleId: string;
  ruleName: string;
  category: string;
  ruleType: 'single' | 'multi';
  severity: 'error' | 'warning' | 'info';
  description: string;
  isEnabled: boolean;
  version: string;
  hitCount: number;
  lastHitTime: string;
}

// 模拟规则数据
const mockRules: QCRule[] = [
  { id: '1', ruleId: 'CMP-001', ruleName: '清单编码格式检查', category: '合规性', ruleType: 'single', severity: 'error', description: '检查清单编码是否符合GB50500规范格式', isEnabled: true, version: '1.0.0', hitCount: 256, lastHitTime: '2026-01-18' },
  { id: '2', ruleId: 'CMP-002', ruleName: '计量单位规范性检查', category: '合规性', ruleType: 'single', severity: 'info', description: '检查计量单位是否使用标准单位', isEnabled: true, version: '1.0.0', hitCount: 128, lastHitTime: '2026-01-17' },
  { id: '3', ruleId: 'PRC-MAT-001', ruleName: '材料价格合理性检查', category: '价格检查', ruleType: 'single', severity: 'error', description: '检查材料价格是否在信息价合理区间内', isEnabled: true, version: '1.2.0', hitCount: 512, lastHitTime: '2026-01-18' },
  { id: '4', ruleId: 'PRC-MAT-003', ruleName: '混凝土强度等级价格逻辑', category: '价格检查', ruleType: 'single', severity: 'error', description: '高强度等级混凝土单价应不低于低强度等级', isEnabled: true, version: '1.0.0', hitCount: 89, lastHitTime: '2026-01-16' },
  { id: '5', ruleId: 'PRC-CMP-002', ruleName: '综合单价材料费占比检查', category: '价格检查', ruleType: 'single', severity: 'warning', description: '综合单价中材料费占比超过阈值时告警', isEnabled: true, version: '1.1.0', hitCount: 156, lastHitTime: '2026-01-18' },
  { id: '6', ruleId: 'BOQ-001', ruleName: '项目特征完整性检查', category: '清单缺陷', ruleType: 'single', severity: 'warning', description: '检查清单项是否包含必填项目特征', isEnabled: true, version: '1.0.0', hitCount: 342, lastHitTime: '2026-01-18' },
  { id: '7', ruleId: 'BOQ-002', ruleName: '工程量异常检查', category: '清单缺陷', ruleType: 'single', severity: 'warning', description: '检查工程量与建筑面积比值是否在合理区间', isEnabled: true, version: '1.0.0', hitCount: 198, lastHitTime: '2026-01-17' },
  { id: '8', ruleId: 'IDX-001', ruleName: '单方造价合理性检查', category: '指标检查', ruleType: 'single', severity: 'warning', description: '检查单方造价是否在同类项目参考区间内', isEnabled: true, version: '1.0.0', hitCount: 267, lastHitTime: '2026-01-18' },
  { id: '9', ruleId: 'CMP-BID-001', ruleName: '投标总价偏离率检查', category: '对比规则', ruleType: 'multi', severity: 'error', description: '投标总价与控制价偏离超过阈值时标记', isEnabled: true, version: '1.0.0', hitCount: 78, lastHitTime: '2026-01-15' },
  { id: '10', ruleId: 'CMP-BID-002', ruleName: '不平衡报价检测', category: '对比规则', ruleType: 'multi', severity: 'warning', description: '检测清单项单价偏离率异常的不平衡报价', isEnabled: false, version: '1.0.0', hitCount: 45, lastHitTime: '2026-01-10' },
];

// 规则统计
const ruleStats = {
  total: 86,
  enabled: 78,
  disabled: 8,
  categories: {
    compliance: 15,
    price: 28,
    boq: 18,
    index: 12,
    compare: 13,
  },
};

const RuleManagePage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [enabledFilter, setEnabledFilter] = useState<string>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState<QCRule | null>(null);
  const [form] = Form.useForm();

  // 获取分类标签
  const getCategoryTag = (category: string) => {
    const map: Record<string, { color: string }> = {
      '合规性': { color: 'blue' },
      '价格检查': { color: 'orange' },
      '清单缺陷': { color: 'purple' },
      '指标检查': { color: 'cyan' },
      '对比规则': { color: 'green' },
    };
    return <Tag color={map[category]?.color || 'default'}>{category}</Tag>;
  };

  // 获取严重程度标签
  const getSeverityTag = (severity: string) => {
    const map: Record<string, { color: string; text: string }> = {
      error: { color: 'red', text: '严重' },
      warning: { color: 'orange', text: '一般' },
      info: { color: 'blue', text: '提示' },
    };
    const s = map[severity] || { color: 'default', text: severity };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // 切换规则启用状态
  const handleToggleEnabled = (rule: QCRule) => {
    console.log('Toggle rule:', rule.ruleId);
  };

  // 编辑规则
  const handleEditRule = (rule: QCRule) => {
    setSelectedRule(rule);
    form.setFieldsValue({
      ruleName: rule.ruleName,
      description: rule.description,
      severity: rule.severity,
      isEnabled: rule.isEnabled,
    });
    setEditModalVisible(true);
  };

  // 保存规则
  const handleSaveRule = () => {
    form.validateFields().then((values) => {
      console.log('Save rule:', values);
      setEditModalVisible(false);
    });
  };

  // 规则列定义
  const ruleColumns: ColumnsType<QCRule> = [
    {
      title: '规则编号',
      dataIndex: 'ruleId',
      key: 'ruleId',
      width: 120,
      render: (v) => <span className="font-mono text-blue-600">{v}</span>,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (v) => getCategoryTag(v),
    },
    {
      title: '类型',
      dataIndex: 'ruleType',
      key: 'ruleType',
      width: 80,
      render: (v) => <Tag>{v === 'single' ? '单文件' : '多文件'}</Tag>,
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 90,
      render: (v) => getSeverityTag(v),
    },
    {
      title: '命中次数',
      dataIndex: 'hitCount',
      key: 'hitCount',
      width: 90,
      align: 'center',
      sorter: (a, b) => a.hitCount - b.hitCount,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 70,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: 80,
      render: (v, record) => (
        <Switch
          checked={v}
          onChange={() => handleToggleEnabled(record)}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<StopOutlined />}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            配置
          </Button>
        </Space>
      ),
    },
  ];

  // 过滤规则
  const getFilteredRules = () => {
    return mockRules.filter(r => {
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (enabledFilter === 'enabled' && !r.isEnabled) return false;
      if (enabledFilter === 'disabled' && r.isEnabled) return false;
      return true;
    });
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">检查规则管理</span>
          <Button type="primary" icon={<PlusOutlined />}>新建规则</Button>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={4}>
          <Card size="small">
            <Statistic title="规则总数" value={ruleStats.total} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="已启用" value={ruleStats.enabled} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="已禁用" value={ruleStats.disabled} valueStyle={{ color: '#999' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">分类分布：</span>
              <Space>
                <Tag color="blue">合规性 {ruleStats.categories.compliance}</Tag>
                <Tag color="orange">价格检查 {ruleStats.categories.price}</Tag>
                <Tag color="purple">清单缺陷 {ruleStats.categories.boq}</Tag>
                <Tag color="cyan">指标检查 {ruleStats.categories.index}</Tag>
                <Tag color="green">对比规则 {ruleStats.categories.compare}</Tag>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 筛选区 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">规则分类</div>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '合规性', value: '合规性' },
                { label: '价格检查', value: '价格检查' },
                { label: '清单缺陷', value: '清单缺陷' },
                { label: '指标检查', value: '指标检查' },
                { label: '对比规则', value: '对比规则' },
              ]}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">状态</div>
            <Select
              value={enabledFilter}
              onChange={setEnabledFilter}
              style={{ width: '100%' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '已启用', value: 'enabled' },
                { label: '已禁用', value: 'disabled' },
              ]}
            />
          </Col>
          <Col span={8}>
            <div className="text-xs text-gray-500 mb-1">搜索</div>
            <Search placeholder="规则编号/名称" allowClear />
          </Col>
        </Row>
      </Card>

      {/* 规则列表 */}
      <Card size="small">
        <Table
          rowKey="id"
          columns={ruleColumns}
          dataSource={getFilteredRules()}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条规则`,
          }}
          size="small"
        />
      </Card>

      {/* 编辑规则弹窗 */}
      <Modal
        title={`编辑规则 - ${selectedRule?.ruleId}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveRule}
        width={600}
      >
        {selectedRule && (
          <div className="space-y-4">
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="规则编号">{selectedRule.ruleId}</Descriptions.Item>
              <Descriptions.Item label="版本">{selectedRule.version}</Descriptions.Item>
              <Descriptions.Item label="分类">{getCategoryTag(selectedRule.category)}</Descriptions.Item>
              <Descriptions.Item label="类型">{selectedRule.ruleType === 'single' ? '单文件' : '多文件'}</Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical">
              <Form.Item name="ruleName" label="规则名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="规则描述">
                <TextArea rows={3} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="severity" label="严重程度" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { label: '严重', value: 'error' },
                        { label: '一般', value: 'warning' },
                        { label: '提示', value: 'info' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="isEnabled" label="启用状态" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RuleManagePage;
