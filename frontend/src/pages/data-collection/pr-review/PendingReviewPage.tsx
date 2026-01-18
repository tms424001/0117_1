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
  Statistic,
  Modal,
  Descriptions,
  message,
  Form,
  Radio,
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { TextArea } = Input;

// PR数据类型
interface PRRecord {
  id: string;
  prCode: string;
  dataType: string;
  dataName: string;
  dataCount: number;
  submitter: string;
  submitTime: string;
  status: string;
  claimedBy: string;
}

// 模拟待审核PR数据
const mockPendingPRList: PRRecord[] = [
  {
    id: 'PR001',
    prCode: 'PR-2026011801',
    dataType: 'project',
    dataName: 'XX医院门诊楼项目',
    dataCount: 1,
    submitter: '张三',
    submitTime: '2026-01-18 10:30',
    status: 'pending',
    claimedBy: '',
  },
  {
    id: 'PR002',
    prCode: 'PR-2026011805',
    dataType: 'material',
    dataName: '水泥',
    dataCount: 15,
    submitter: '李四',
    submitTime: '2026-01-18 11:45',
    status: 'pending',
    claimedBy: '',
  },
  {
    id: 'PR003',
    prCode: 'PR-2026011806',
    dataType: 'composite',
    dataName: '装饰清单',
    dataCount: 20,
    submitter: '王五',
    submitTime: '2026-01-18 12:00',
    status: 'pending',
    claimedBy: '',
  },
  {
    id: 'PR004',
    prCode: 'PR-2026011807',
    dataType: 'index',
    dataName: '某商业综合体指标',
    dataCount: 8,
    submitter: '赵六',
    submitTime: '2026-01-18 13:30',
    status: 'reviewing',
    claimedBy: '当前用户',
  },
  {
    id: 'PR005',
    prCode: 'PR-2026011808',
    dataType: 'project',
    dataName: '某学校教学楼项目',
    dataCount: 1,
    submitter: '张三',
    submitTime: '2026-01-18 14:00',
    status: 'reviewing',
    claimedBy: '当前用户',
  },
];

// 项目数据预览
const mockProjectPreview = {
  projectName: 'XX医院门诊楼项目',
  functionTag: '综合医院',
  scaleLevel: '大型',
  location: '北京市海淀区',
  pricingStage: '招标控制价',
  pricePeriod: '2026年01月',
  buildingArea: 25000,
  totalCost: 85000000,
  unitCost: 3400,
  unitCount: 6,
  indexCount: 7,
};

const PendingReviewPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PRRecord | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();

  // 获取数据类型标签
  const getDataTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      project: { color: 'blue', text: '项目' },
      index: { color: 'green', text: '指标' },
      material: { color: 'orange', text: '材价' },
      composite: { color: 'purple', text: '综价' },
    };
    const t = typeMap[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
  };

  // 统计数据
  const stats = {
    pendingClaim: mockPendingPRList.filter(p => p.status === 'pending').length,
    myClaimed: mockPendingPRList.filter(p => p.status === 'reviewing' && p.claimedBy === '当前用户').length,
    todayReviewed: 12,
    weekReviewed: 68,
  };

  // 认领PR
  const handleClaim = (pr: PRRecord) => {
    message.success(`已认领 ${pr.prCode}`);
    setSelectedPR({ ...pr, status: 'reviewing', claimedBy: '当前用户' });
    setReviewModalVisible(true);
  };

  // 查看/审核PR
  const handleReview = (pr: PRRecord) => {
    setSelectedPR(pr);
    setReviewModalVisible(true);
  };

  // 通过PR
  const handleApprove = () => {
    form.validateFields().then((values) => {
      console.log('审核通过:', values);
      message.success(`${selectedPR?.prCode} 审核通过，数据已入库`);
      setReviewModalVisible(false);
      form.resetFields();
    });
  };

  // 打开驳回弹窗
  const handleOpenReject = () => {
    setReviewModalVisible(false);
    setRejectModalVisible(true);
  };

  // 确认驳回
  const handleReject = () => {
    form.validateFields().then((values) => {
      console.log('审核驳回:', values);
      message.success(`${selectedPR?.prCode} 已驳回`);
      setRejectModalVisible(false);
      form.resetFields();
    });
  };

  // 批量审核
  const handleBatchReview = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的PR');
      return;
    }
    setBatchModalVisible(true);
  };

  // 确认批量审核
  const handleBatchConfirm = () => {
    batchForm.validateFields().then((values) => {
      console.log('批量审核:', values, selectedRowKeys);
      message.success(`已批量${values.action === 'approve' ? '通过' : '驳回'} ${selectedRowKeys.length} 个PR`);
      setBatchModalVisible(false);
      batchForm.resetFields();
      setSelectedRowKeys([]);
    });
  };

  // 列定义
  const columns: ColumnsType<PRRecord> = [
    {
      title: 'PR编号',
      dataIndex: 'prCode',
      key: 'prCode',
      width: 140,
      render: (v) => <span className="font-mono text-blue-600">{v}</span>,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 80,
      render: (type) => getDataTypeTag(type),
    },
    {
      title: '数据名称',
      key: 'dataName',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.dataName}</div>
          {record.dataCount > 1 && (
            <div className="text-xs text-gray-400">共 {record.dataCount} 条</div>
          )}
        </div>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 80,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 140,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        if (record.status === 'pending') {
          return <Tag color="orange" icon={<ClockCircleOutlined />}>待认领</Tag>;
        }
        if (record.claimedBy === '当前用户') {
          return <Tag color="blue" icon={<CheckCircleOutlined />}>我认领的</Tag>;
        }
        return <Tag>其他人认领</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => {
        if (record.status === 'pending') {
          return (
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleReview(record)}
              >
                查看
              </Button>
              <Button
                type="link"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => handleClaim(record)}
              >
                认领
              </Button>
            </Space>
          );
        }
        if (record.claimedBy === '当前用户') {
          return (
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleReview(record)}
              >
                审核
              </Button>
            </Space>
          );
        }
        return (
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
        );
      },
    },
  ];

  // 过滤数据
  const filteredData = mockPendingPRList.filter(pr => {
    if (statusFilter === 'pending' && pr.status !== 'pending') return false;
    if (statusFilter === 'myClaimed' && (pr.status !== 'reviewing' || pr.claimedBy !== '当前用户')) return false;
    if (dataTypeFilter !== 'all' && pr.dataType !== dataTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">待我审核</span>
          <Button type="primary" onClick={handleBatchReview} disabled={selectedRowKeys.length === 0}>
            批量审核 ({selectedRowKeys.length})
          </Button>
        </div>
      </Card>

      {/* 统计卡片 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="待认领"
              value={stats.pendingClaim}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="我认领的"
              value={stats.myClaimed}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="今日已审" value={stats.todayReviewed} />
          </Col>
          <Col span={6}>
            <Statistic title="本周已审" value={stats.weekReviewed} />
          </Col>
        </Row>
      </Card>

      {/* 筛选区 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">状态</div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '待认领', value: 'pending' },
                { label: '我认领的', value: 'myClaimed' },
              ]}
            />
          </Col>
          <Col span={6}>
            <div className="text-xs text-gray-500 mb-1">数据类型</div>
            <Select
              value={dataTypeFilter}
              onChange={setDataTypeFilter}
              style={{ width: '100%' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '项目', value: 'project' },
                { label: '指标', value: 'index' },
                { label: '材价', value: 'material' },
                { label: '综价', value: 'composite' },
              ]}
            />
          </Col>
          <Col span={8}>
            <div className="text-xs text-gray-500 mb-1">搜索</div>
            <Search placeholder="PR编号/数据名称/提交人" allowClear />
          </Col>
        </Row>
      </Card>

      {/* PR列表 */}
      <Card size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
            getCheckboxProps: (record) => ({
              disabled: record.status !== 'reviewing' || record.claimedBy !== '当前用户',
            }),
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
        />
      </Card>

      {/* 审核弹窗 */}
      <Modal
        title={`审核PR - ${selectedPR?.prCode}`}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={
          selectedPR?.claimedBy === '当前用户' ? [
            <Button key="reject" danger icon={<CloseOutlined />} onClick={handleOpenReject}>
              驳回
            </Button>,
            <Button key="approve" type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
              通过并入库
            </Button>,
          ] : [
            <Button key="close" onClick={() => setReviewModalVisible(false)}>关闭</Button>,
            <Button key="claim" type="primary" icon={<UserAddOutlined />} onClick={() => selectedPR && handleClaim(selectedPR)}>
              认领
            </Button>,
          ]
        }
        width={700}
      >
        {selectedPR && (
          <div className="space-y-4">
            {/* PR信息 */}
            <Card size="small" title="PR信息">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="PR编号">{selectedPR.prCode}</Descriptions.Item>
                <Descriptions.Item label="数据类型">{getDataTypeTag(selectedPR.dataType)}</Descriptions.Item>
                <Descriptions.Item label="提交人">{selectedPR.submitter}</Descriptions.Item>
                <Descriptions.Item label="提交时间">{selectedPR.submitTime}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 数据预览 */}
            <Card size="small" title="数据预览">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="项目名称">{mockProjectPreview.projectName}</Descriptions.Item>
                <Descriptions.Item label="功能标签">{mockProjectPreview.functionTag}</Descriptions.Item>
                <Descriptions.Item label="规模档">{mockProjectPreview.scaleLevel}</Descriptions.Item>
                <Descriptions.Item label="地点">{mockProjectPreview.location}</Descriptions.Item>
                <Descriptions.Item label="计价阶段">{mockProjectPreview.pricingStage}</Descriptions.Item>
                <Descriptions.Item label="材价基准期">{mockProjectPreview.pricePeriod}</Descriptions.Item>
                <Descriptions.Item label="总建筑面积">{mockProjectPreview.buildingArea.toLocaleString()} m²</Descriptions.Item>
                <Descriptions.Item label="单方造价">{mockProjectPreview.unitCost.toLocaleString()} 元/m²</Descriptions.Item>
                <Descriptions.Item label="工程总造价">{mockProjectPreview.totalCost.toLocaleString()} 元</Descriptions.Item>
              </Descriptions>
              <div className="mt-2 text-sm text-gray-500">
                包含数据：单位工程 {mockProjectPreview.unitCount} 个，指标数据 {mockProjectPreview.indexCount} 条
              </div>
              <div className="mt-2">
                <Button type="link" size="small">查看完整详情 →</Button>
              </div>
            </Card>

            {/* 审核操作 */}
            {selectedPR.claimedBy === '当前用户' && (
              <Card size="small" title="审核操作">
                <Form form={form} layout="vertical">
                  <Form.Item name="comment" label="审核意见">
                    <TextArea rows={3} placeholder="请输入审核意见（可选）" />
                  </Form.Item>
                  <div className="space-x-2">
                    <Tag className="cursor-pointer" onClick={() => form.setFieldValue('comment', '数据完整，同意入库')}>
                      数据完整，同意入库
                    </Tag>
                    <Tag className="cursor-pointer" onClick={() => form.setFieldValue('comment', '标签需调整')}>
                      标签需调整
                    </Tag>
                    <Tag className="cursor-pointer" onClick={() => form.setFieldValue('comment', '信息不完整')}>
                      信息不完整
                    </Tag>
                  </div>
                </Form>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* 驳回弹窗 */}
      <Modal
        title={`驳回PR - ${selectedPR?.prCode}`}
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <TextArea rows={4} placeholder="请输入驳回原因（必填）" />
          </Form.Item>
          <div className="space-x-2">
            <span className="text-gray-500">快捷原因：</span>
            <Tag className="cursor-pointer" onClick={() => form.setFieldValue('rejectReason', '功能标签不准确')}>
              功能标签不准确
            </Tag>
            <Tag className="cursor-pointer" onClick={() => form.setFieldValue('rejectReason', '规模档错误')}>
              规模档错误
            </Tag>
            <Tag className="cursor-pointer" onClick={() => form.setFieldValue('rejectReason', '元数据不完整')}>
              元数据不完整
            </Tag>
            <Tag className="cursor-pointer" onClick={() => form.setFieldValue('rejectReason', '数据质量问题')}>
              数据质量问题
            </Tag>
          </div>
        </Form>
        <div className="mt-4 text-orange-500 text-sm">
          ⚠️ 驳回后，提交人可修改后重新提交。
        </div>
      </Modal>

      {/* 批量审核弹窗 */}
      <Modal
        title="批量审核"
        open={batchModalVisible}
        onCancel={() => setBatchModalVisible(false)}
        onOk={handleBatchConfirm}
        okText="确认"
      >
        <div className="mb-4">
          已选择 <span className="font-bold text-blue-600">{selectedRowKeys.length}</span> 个PR
        </div>
        <Form form={batchForm} layout="vertical">
          <Form.Item
            name="action"
            label="批量操作"
            rules={[{ required: true, message: '请选择操作' }]}
          >
            <Radio.Group>
              <Radio value="approve">全部通过</Radio>
              <Radio value="reject">全部驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="comment" label="审核意见">
            <TextArea rows={3} placeholder="请输入审核意见" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PendingReviewPage;
