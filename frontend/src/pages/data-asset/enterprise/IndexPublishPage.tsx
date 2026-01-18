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
  Input,
  Select,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  CheckOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

// 发布版本数据类型
interface PublishVersion {
  publishId: string;
  versionCode: string;
  versionName: string;
  totalIndexes: number;
  newIndexes: number;
  updatedIndexes: number;
  status: string;
  effectiveTime: string | null;
  submittedBy: string | null;
  submittedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
}

// 模拟发布版本数据
const mockVersions: PublishVersion[] = [
  {
    publishId: 'PUB202510001',
    versionCode: '2025.4.1',
    versionName: '2025Q4指标（草稿）',
    totalIndexes: 1350,
    newIndexes: 64,
    updatedIndexes: 128,
    status: 'pending',
    effectiveTime: null,
    submittedBy: '张三',
    submittedAt: '2025-12-15',
    approvedBy: null,
    approvedAt: null,
    publishedAt: null,
  },
  {
    publishId: 'PUB202507001',
    versionCode: '2025.3.1',
    versionName: '2025Q3指标（当前版本）',
    totalIndexes: 1286,
    newIndexes: 88,
    updatedIndexes: 156,
    status: 'published',
    effectiveTime: '2025-10-01',
    submittedBy: '张三',
    submittedAt: '2025-09-20',
    approvedBy: '李四',
    approvedAt: '2025-09-25',
    publishedAt: '2025-10-01',
  },
  {
    publishId: 'PUB202504001',
    versionCode: '2025.2.1',
    versionName: '2025Q2指标',
    totalIndexes: 1198,
    newIndexes: 93,
    updatedIndexes: 142,
    status: 'archived',
    effectiveTime: '2025-07-01',
    submittedBy: '张三',
    submittedAt: '2025-06-18',
    approvedBy: '李四',
    approvedAt: '2025-06-22',
    publishedAt: '2025-07-01',
  },
  {
    publishId: 'PUB202501001',
    versionCode: '2025.1.1',
    versionName: '2025Q1指标',
    totalIndexes: 1105,
    newIndexes: 78,
    updatedIndexes: 125,
    status: 'archived',
    effectiveTime: '2025-04-01',
    submittedBy: '张三',
    submittedAt: '2025-03-15',
    approvedBy: '李四',
    approvedAt: '2025-03-20',
    publishedAt: '2025-04-01',
  },
];

const IndexPublishPage: React.FC = () => {
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PublishVersion | null>(null);
  const [form] = Form.useForm();

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'blue', text: '已审核' },
      published: { color: 'green', text: '已发布' },
      archived: { color: 'default', text: '已归档' },
      rejected: { color: 'red', text: '已驳回' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 版本列表列定义
  const columns: ColumnsType<PublishVersion> = [
    {
      title: '版本号',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      key: 'versionName',
      width: 180,
    },
    {
      title: '指标数',
      key: 'indexes',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.totalIndexes}</div>
          {record.newIndexes > 0 && (
            <div className="text-xs text-green-500">+{record.newIndexes}新增</div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedVersion(record)}
          >
            查看
          </Button>
          {record.status === 'draft' && (
            <Button type="link" size="small" icon={<SendOutlined />}>
              提交审核
            </Button>
          )}
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />}>
                审核
              </Button>
              <Button type="link" size="small" icon={<RollbackOutlined />}>
                撤回
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button type="link" size="small">
              执行发布
            </Button>
          )}
          {record.status === 'published' && (
            <Button type="link" size="small">
              归档
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 创建新版本
  const handleCreateVersion = () => {
    form.validateFields().then((values) => {
      console.log('创建版本:', values);
      message.success('版本创建成功');
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  // 当前版本信息
  const currentVersion = mockVersions.find((v) => v.status === 'published');

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">指标发布管理</span>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建新版本
          </Button>
        </div>
      </Card>

      {/* 当前版本信息 */}
      {currentVersion && (
        <Card size="small" title="当前发布版本">
          <Row gutter={24}>
            <Col span={4}>
              <Statistic title="版本号" value={currentVersion.versionCode} />
            </Col>
            <Col span={4}>
              <Statistic title="指标总数" value={currentVersion.totalIndexes} />
            </Col>
            <Col span={4}>
              <Statistic
                title="状态"
                valueRender={() => getStatusTag(currentVersion.status)}
              />
            </Col>
            <Col span={4}>
              <Statistic title="发布时间" value={currentVersion.publishedAt || '-'} />
            </Col>
            <Col span={4}>
              <Statistic title="审核人" value={currentVersion.approvedBy || '-'} />
            </Col>
            <Col span={4}>
              <Statistic title="生效时间" value={currentVersion.effectiveTime || '-'} />
            </Col>
          </Row>
        </Card>
      )}

      {/* 版本列表 */}
      <Card size="small" title="版本列表">
        <Table
          rowKey="publishId"
          columns={columns}
          dataSource={mockVersions}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 版本详情 */}
      {selectedVersion && (
        <Card
          size="small"
          title={`版本 ${selectedVersion.versionCode} 详情`}
          extra={
            <Button type="link" onClick={() => setSelectedVersion(null)}>
              关闭
            </Button>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <div className="text-gray-500 mb-1">变更统计</div>
              <Row gutter={16}>
                <Col span={8}>
                  <div className="p-3 bg-green-50 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedVersion.newIndexes}
                    </div>
                    <div className="text-xs text-gray-500">新增指标</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedVersion.updatedIndexes}
                    </div>
                    <div className="text-xs text-gray-500">更新指标</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {selectedVersion.totalIndexes -
                        selectedVersion.newIndexes -
                        selectedVersion.updatedIndexes}
                    </div>
                    <div className="text-xs text-gray-500">无变化</div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <div className="text-gray-500 mb-1">主要变化</div>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>办公建筑综合单方上涨3.8%（3,950→4,100）</li>
                <li>新增产业园办公指标（功能标签扩展）</li>
                <li>钢筋含量指标样本数增加20%</li>
                <li>医疗建筑指标覆盖范围扩展至全省</li>
              </ul>
            </Col>
          </Row>

          <div className="mt-4 pt-4 border-t">
            <div className="text-gray-500 mb-2">审核流程</div>
            <div className="flex items-center">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  ✓
                </div>
                <div className="text-xs mt-1">创建</div>
                <div className="text-xs text-gray-400">
                  {selectedVersion.submittedBy}
                </div>
              </div>
              <div className="flex-1 h-0.5 bg-green-500 mx-2" />
              <div className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedVersion.submittedAt
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {selectedVersion.submittedAt ? '✓' : '2'}
                </div>
                <div className="text-xs mt-1">提交</div>
                <div className="text-xs text-gray-400">
                  {selectedVersion.submittedAt || '-'}
                </div>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  selectedVersion.approvedAt ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
              <div className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedVersion.approvedAt
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {selectedVersion.approvedAt ? '✓' : '3'}
                </div>
                <div className="text-xs mt-1">审核</div>
                <div className="text-xs text-gray-400">
                  {selectedVersion.approvedBy || '-'}
                </div>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  selectedVersion.publishedAt ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
              <div className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedVersion.publishedAt
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {selectedVersion.publishedAt ? '✓' : '4'}
                </div>
                <div className="text-xs mt-1">发布</div>
                <div className="text-xs text-gray-400">
                  {selectedVersion.publishedAt || '-'}
                </div>
              </div>
            </div>
          </div>

          {selectedVersion.status === 'pending' && (
            <div className="mt-4 text-right">
              <Space>
                <Button icon={<SendOutlined />}>提交审核</Button>
                <Button>保存草稿</Button>
                <Button>预览</Button>
              </Space>
            </div>
          )}
        </Card>
      )}

      {/* 创建版本弹窗 */}
      <Modal
        title="创建新版本"
        open={createModalVisible}
        onOk={handleCreateVersion}
        onCancel={() => setCreateModalVisible(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="versionCode"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如：2025.4.1" />
          </Form.Item>
          <Form.Item
            name="versionName"
            label="版本名称"
            rules={[{ required: true, message: '请输入版本名称' }]}
          >
            <Input placeholder="例如：2025Q4指标" />
          </Form.Item>
          <Form.Item name="publishScope" label="发布范围" initialValue="all">
            <Select>
              <Select.Option value="all">全量发布</Select.Option>
              <Select.Option value="category">按类别发布</Select.Option>
              <Select.Option value="custom">自定义范围</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="releaseNotes" label="发布说明">
            <TextArea rows={4} placeholder="请输入发布说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndexPublishPage;
