import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Select,
  Checkbox,
  message,
  Alert,
  Steps,
  Descriptions,
} from 'antd';
import {
  ArrowLeftOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SendOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

// 贡献记录数据类型
interface ContributionRecord {
  id: string;
  publicCaseId: string;
  sourceCaseName: string;
  desensitizedName: string;
  qualityLevel: string;
  pointsEarned: number;
  reviewStatus: string;
  contributedAt: string;
}

// 可贡献案例数据类型
interface ContributableCase {
  id: string;
  caseName: string;
  functionTag: string;
  buildingArea: number;
  dataCompleteness: number;
  estimatedLevel: string;
  estimatedPoints: number;
}

// 模拟贡献记录数据
const mockContributions: ContributionRecord[] = [
  {
    id: 'CTB001',
    publicCaseId: 'PC202405001',
    sourceCaseName: '深圳XX办公楼项目',
    desensitizedName: '某办公楼项目（脱敏）',
    qualityLevel: 'A',
    pointsEarned: 500,
    reviewStatus: 'approved',
    contributedAt: '2025-05-20',
  },
  {
    id: 'CTB002',
    publicCaseId: 'PC202404001',
    sourceCaseName: '广州XX学校项目',
    desensitizedName: '某学校项目（脱敏）',
    qualityLevel: 'B',
    pointsEarned: 300,
    reviewStatus: 'approved',
    contributedAt: '2025-04-15',
  },
  {
    id: 'CTB003',
    publicCaseId: '',
    sourceCaseName: '东莞XX医院项目',
    desensitizedName: '某医院项目（脱敏）',
    qualityLevel: '',
    pointsEarned: 0,
    reviewStatus: 'pending',
    contributedAt: '2025-06-10',
  },
];

// 模拟可贡献案例数据
const mockContributableCases: ContributableCase[] = [
  {
    id: 'EC001',
    caseName: '深圳某商业项目',
    functionTag: '商业-商场',
    buildingArea: 45000,
    dataCompleteness: 95,
    estimatedLevel: 'A',
    estimatedPoints: 500,
  },
  {
    id: 'EC002',
    caseName: '广州某住宅项目',
    functionTag: '居住-住宅',
    buildingArea: 28000,
    dataCompleteness: 85,
    estimatedLevel: 'B',
    estimatedPoints: 300,
  },
  {
    id: 'EC003',
    caseName: '佛山某办公项目',
    functionTag: '办公-甲级办公',
    buildingArea: 12000,
    dataCompleteness: 78,
    estimatedLevel: 'C',
    estimatedPoints: 150,
  },
];

// 脱敏预览数据
const mockDesensitizedPreview = {
  projectTitle: '某商业综合体项目',
  projectLocation: '广东省深圳市',
  functionTag: '商业-商场',
  buildingArea: 45000,
  unitCost: 4850,
  pricingStage: '结算',
  qualityLevel: 'A',
  dataCompleteness: 95,
};

const CaseContributionPage: React.FC = () => {
  const navigate = useNavigate();
  const [contributeModalVisible, setContributeModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ContributableCase | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // 统计数据
  const stats = {
    totalContributions: 12,
    totalPoints: 3600,
    pendingCount: 2,
    memberLevel: '金牌会员',
  };

  // 获取审核状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      approved: { color: 'green', text: '已发布', icon: <CheckCircleOutlined /> },
      pending: { color: 'orange', text: '审核中', icon: <ClockCircleOutlined /> },
      rejected: { color: 'red', text: '已拒绝', icon: null },
    };
    const s = statusMap[status] || { color: 'default', text: status, icon: null };
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

  // 贡献记录列定义
  const contributionColumns: ColumnsType<ContributionRecord> = [
    {
      title: '案例名称',
      key: 'caseName',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.desensitizedName}</div>
          <div className="text-xs text-gray-400">原案例：{record.sourceCaseName}</div>
        </div>
      ),
    },
    {
      title: '质量等级',
      dataIndex: 'qualityLevel',
      key: 'qualityLevel',
      width: 80,
      align: 'center',
      render: (v) => v ? <Tag color="green">{v}级</Tag> : '-',
    },
    {
      title: '获得积分',
      dataIndex: 'pointsEarned',
      key: 'pointsEarned',
      width: 100,
      align: 'center',
      render: (v) => v > 0 ? <span className="text-orange-500 font-medium">{v}分</span> : '-',
    },
    {
      title: '状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '贡献时间',
      dataIndex: 'contributedAt',
      key: 'contributedAt',
      width: 120,
    },
  ];

  // 可贡献案例列定义
  const contributableColumns: ColumnsType<ContributableCase> = [
    {
      title: '案例名称',
      dataIndex: 'caseName',
      key: 'caseName',
      width: 180,
    },
    {
      title: '功能标签',
      dataIndex: 'functionTag',
      key: 'functionTag',
      width: 120,
      render: (v) => <Tag color="cyan">{v}</Tag>,
    },
    {
      title: '建筑面积',
      dataIndex: 'buildingArea',
      key: 'buildingArea',
      width: 100,
      align: 'right',
      render: (v) => `${v.toLocaleString()}㎡`,
    },
    {
      title: '完整度',
      dataIndex: 'dataCompleteness',
      key: 'dataCompleteness',
      width: 80,
      align: 'center',
      render: (v) => `${v}%`,
    },
    {
      title: '预计等级',
      dataIndex: 'estimatedLevel',
      key: 'estimatedLevel',
      width: 80,
      align: 'center',
      render: (v) => <Tag color={v === 'A' ? 'green' : v === 'B' ? 'blue' : 'orange'}>{v}级</Tag>,
    },
    {
      title: '预计积分',
      dataIndex: 'estimatedPoints',
      key: 'estimatedPoints',
      width: 80,
      align: 'center',
      render: (v) => <span className="text-orange-500 font-medium">{v}分</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedCase(record);
              setPreviewModalVisible(true);
            }}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SendOutlined />}
            onClick={() => {
              setSelectedCase(record);
              setCurrentStep(0);
              setContributeModalVisible(true);
            }}
          >
            贡献
          </Button>
        </Space>
      ),
    },
  ];

  // 提交贡献
  const handleSubmitContribution = () => {
    form.validateFields().then((values) => {
      console.log('提交贡献:', values);
      message.success('贡献申请已提交，预计1-3个工作日完成审核');
      setContributeModalVisible(false);
      form.resetFields();
      setCurrentStep(0);
    });
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span className="text-lg font-medium">我的贡献</span>
          </Space>
        </div>
      </Card>

      {/* 贡献统计 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="已贡献案例"
              value={stats.totalContributions}
              suffix="个"
              prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已获积分"
              value={stats.totalPoints}
              suffix="分"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="审核中"
              value={stats.pendingCount}
              suffix="个"
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-sm text-gray-500">会员等级</div>
              <div className="text-xl font-bold text-yellow-500 mt-2">
                <TrophyOutlined className="mr-1" />
                {stats.memberLevel}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 积分规则说明 */}
      <Card size="small" title="积分规则说明">
        <Alert
          type="info"
          showIcon
          message={
            <div className="space-y-1">
              <div>• <strong>A级案例</strong>（完整度≥90%）：每个案例获得 <span className="text-orange-500">500</span> 积分</div>
              <div>• <strong>B级案例</strong>（完整度≥80%）：每个案例获得 <span className="text-orange-500">300</span> 积分</div>
              <div>• <strong>C级案例</strong>（完整度≥70%）：每个案例获得 <span className="text-orange-500">150</span> 积分</div>
              <div>• 积分可兑换：VIP会员时长、报告下载次数、专属服务等</div>
            </div>
          }
        />
      </Card>

      {/* 我的贡献记录 */}
      <Card size="small" title="我的贡献记录">
        <Table
          rowKey="id"
          columns={contributionColumns}
          dataSource={mockContributions}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 可贡献案例 */}
      <Card
        size="small"
        title="可贡献案例（来自企业案例库）"
        extra={<span className="text-gray-400">以下案例符合贡献条件，您可以选择授权公开</span>}
      >
        <Table
          rowKey="id"
          columns={contributableColumns}
          dataSource={mockContributableCases}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 脱敏预览弹窗 */}
      <Modal
        title="脱敏预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPreviewModalVisible(false)}>关闭</Button>,
          <Button
            key="contribute"
            type="primary"
            onClick={() => {
              setPreviewModalVisible(false);
              setCurrentStep(0);
              setContributeModalVisible(true);
            }}
          >
            确认贡献
          </Button>,
        ]}
        width={600}
      >
        <Alert
          type="warning"
          showIcon
          message="以下是脱敏后将公开展示的信息，敏感信息已被移除"
          className="mb-4"
        />
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="项目名称">{mockDesensitizedPreview.projectTitle}</Descriptions.Item>
          <Descriptions.Item label="项目地点">{mockDesensitizedPreview.projectLocation}</Descriptions.Item>
          <Descriptions.Item label="功能标签">
            <Tag color="cyan">{mockDesensitizedPreview.functionTag}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="建筑面积">{mockDesensitizedPreview.buildingArea.toLocaleString()}㎡</Descriptions.Item>
          <Descriptions.Item label="综合单方">¥{mockDesensitizedPreview.unitCost}/㎡</Descriptions.Item>
          <Descriptions.Item label="计价阶段">{mockDesensitizedPreview.pricingStage}</Descriptions.Item>
          <Descriptions.Item label="预计等级">
            <Tag color="green">{mockDesensitizedPreview.qualityLevel}级</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="数据完整度">{mockDesensitizedPreview.dataCompleteness}%</Descriptions.Item>
        </Descriptions>
        <div className="mt-4 p-3 bg-green-50 rounded">
          <div className="text-green-600 font-medium">
            预计获得积分：<span className="text-xl">{selectedCase?.estimatedPoints || 500}</span> 分
          </div>
        </div>
      </Modal>

      {/* 贡献确认弹窗 */}
      <Modal
        title="贡献案例"
        open={contributeModalVisible}
        onCancel={() => {
          setContributeModalVisible(false);
          setCurrentStep(0);
        }}
        footer={null}
        width={600}
      >
        <Steps
          current={currentStep}
          size="small"
          className="mb-6"
          items={[
            { title: '确认授权' },
            { title: '提交审核' },
            { title: '完成' },
          ]}
        />

        {currentStep === 0 && (
          <div>
            <Alert
              type="info"
              showIcon
              message="贡献说明"
              description={
                <div className="space-y-1 text-sm">
                  <div>1. 您的案例数据将经过脱敏处理后公开展示</div>
                  <div>2. 敏感信息（项目名称、单位名称、联系方式等）将被移除</div>
                  <div>3. 贡献后无法撤回，请确认授权</div>
                </div>
              }
              className="mb-4"
            />
            <Form form={form} layout="vertical">
              <Form.Item
                name="authorizationType"
                label="授权类型"
                rules={[{ required: true, message: '请选择授权类型' }]}
                initialValue="permanent"
              >
                <Select>
                  <Select.Option value="permanent">永久授权</Select.Option>
                  <Select.Option value="temporary">临时授权（1年）</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="authorizationScope"
                label="授权范围"
                rules={[{ required: true, message: '请选择授权范围' }]}
                initialValue="full"
              >
                <Select>
                  <Select.Option value="full">完整数据（含指标明细）</Select.Option>
                  <Select.Option value="partial">概要数据（仅基本信息）</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="confirmDesensitization"
                valuePropName="checked"
                rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('请确认已阅读脱敏说明') }]}
              >
                <Checkbox>我已阅读并同意脱敏规则，确认授权公开</Checkbox>
              </Form.Item>
            </Form>
            <div className="text-right">
              <Space>
                <Button onClick={() => setContributeModalVisible(false)}>取消</Button>
                <Button type="primary" onClick={() => setCurrentStep(1)}>下一步</Button>
              </Space>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <div className="p-4 bg-gray-50 rounded mb-4">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="案例名称">{selectedCase?.caseName}</Descriptions.Item>
                <Descriptions.Item label="功能标签">{selectedCase?.functionTag}</Descriptions.Item>
                <Descriptions.Item label="预计等级">
                  <Tag color="green">{selectedCase?.estimatedLevel}级</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="预计积分">
                  <span className="text-orange-500 font-medium">{selectedCase?.estimatedPoints}分</span>
                </Descriptions.Item>
              </Descriptions>
            </div>
            <Alert
              type="success"
              showIcon
              message="确认提交后，案例将进入审核流程，预计1-3个工作日完成审核"
              className="mb-4"
            />
            <div className="text-right">
              <Space>
                <Button onClick={() => setCurrentStep(0)}>上一步</Button>
                <Button type="primary" onClick={handleSubmitContribution}>提交审核</Button>
              </Space>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            <div className="text-lg font-medium mt-4">提交成功！</div>
            <div className="text-gray-500 mt-2">您的贡献申请已提交，预计1-3个工作日完成审核</div>
            <Button
              type="primary"
              className="mt-4"
              onClick={() => {
                setContributeModalVisible(false);
                setCurrentStep(0);
              }}
            >
              完成
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CaseContributionPage;
