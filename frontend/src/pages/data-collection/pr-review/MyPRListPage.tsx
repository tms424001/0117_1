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
  Popconfirm,
  Alert,
} from 'antd';
import {
  EyeOutlined,
  RollbackOutlined,
  ReloadOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// PR数据类型
interface PRRecord {
  id: string;
  prCode: string;
  dataType: string;
  dataName: string;
  dataCount: number;
  submitTime: string;
  status: string;
  reviewer: string;
  reviewTime: string;
  rejectReason: string;
}

// 模拟PR数据
const mockPRList: PRRecord[] = [
  {
    id: 'PR001',
    prCode: 'PR-2026011801',
    dataType: 'project',
    dataName: 'XX医院门诊楼项目',
    dataCount: 1,
    submitTime: '2026-01-18 10:30',
    status: 'pending',
    reviewer: '',
    reviewTime: '',
    rejectReason: '',
  },
  {
    id: 'PR002',
    prCode: 'PR-2026011802',
    dataType: 'index',
    dataName: 'XX医院门诊楼指标',
    dataCount: 7,
    submitTime: '2026-01-18 10:35',
    status: 'reviewing',
    reviewer: '王审核',
    reviewTime: '',
    rejectReason: '',
  },
  {
    id: 'PR003',
    prCode: 'PR-2026011803',
    dataType: 'material',
    dataName: 'HRB400钢筋',
    dataCount: 25,
    submitTime: '2026-01-18 11:00',
    status: 'approved',
    reviewer: '李审核',
    reviewTime: '2026-01-18 14:20',
    rejectReason: '',
  },
  {
    id: 'PR004',
    prCode: 'PR-2026011804',
    dataType: 'composite',
    dataName: '土建清单',
    dataCount: 30,
    submitTime: '2026-01-18 11:20',
    status: 'rejected',
    reviewer: '王审核',
    reviewTime: '2026-01-18 15:30',
    rejectReason: '功能标签不准确，该项目应归类为"专科医院-妇幼保健院"，而非"综合医院"。请修改后重新提交。',
  },
  {
    id: 'PR005',
    prCode: 'PR-2026011805',
    dataType: 'material',
    dataName: '普通硅酸盐水泥',
    dataCount: 15,
    submitTime: '2026-01-18 11:45',
    status: 'withdrawn',
    reviewer: '',
    reviewTime: '',
    rejectReason: '',
  },
  {
    id: 'PR006',
    prCode: 'PR-2026011806',
    dataType: 'project',
    dataName: '某商业综合体项目',
    dataCount: 1,
    submitTime: '2026-01-18 14:00',
    status: 'approved',
    reviewer: '李审核',
    reviewTime: '2026-01-18 16:00',
    rejectReason: '',
  },
];

const MyPRListPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PRRecord | null>(null);

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      pending: { color: 'orange', text: '待审核', icon: <ClockCircleOutlined /> },
      reviewing: { color: 'blue', text: '审核中', icon: <ClockCircleOutlined /> },
      approved: { color: 'green', text: '已通过', icon: <CheckCircleOutlined /> },
      rejected: { color: 'red', text: '已驳回', icon: <CloseCircleOutlined /> },
      withdrawn: { color: 'default', text: '已撤回', icon: <ExclamationCircleOutlined /> },
    };
    const s = statusMap[status] || { color: 'default', text: status, icon: null };
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

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
    total: mockPRList.length,
    pending: mockPRList.filter(p => p.status === 'pending').length,
    approved: mockPRList.filter(p => p.status === 'approved').length,
    rejected: mockPRList.filter(p => p.status === 'rejected').length,
  };

  // 撤回PR
  const handleWithdraw = (pr: PRRecord) => {
    message.success(`PR ${pr.prCode} 已撤回`);
  };

  // 重新提交
  const handleResubmit = (pr: PRRecord) => {
    message.info(`跳转到数据编辑页面，准备重新提交 ${pr.prCode}`);
  };

  // 查看详情
  const handleViewDetail = (pr: PRRecord) => {
    setSelectedPR(pr);
    setDetailModalVisible(true);
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
      width: 200,
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
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 140,
    },
    {
      title: '审核员',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 80,
      render: (v) => v || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => {
        const actions = [];
        
        // 查看按钮（所有状态都有）
        actions.push(
          <Button
            key="view"
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        );

        // 待审核状态：可撤回
        if (record.status === 'pending') {
          actions.push(
            <Popconfirm
              key="withdraw"
              title="确定要撤回此PR吗？"
              onConfirm={() => handleWithdraw(record)}
            >
              <Button type="link" size="small" icon={<RollbackOutlined />}>
                撤回
              </Button>
            </Popconfirm>
          );
        }

        // 已驳回状态：可修改、重新提交
        if (record.status === 'rejected') {
          actions.push(
            <Button
              key="edit"
              type="link"
              size="small"
              icon={<EditOutlined />}
            >
              修改
            </Button>
          );
          actions.push(
            <Button
              key="resubmit"
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleResubmit(record)}
            >
              重新提交
            </Button>
          );
        }

        // 已撤回状态：可重新提交
        if (record.status === 'withdrawn') {
          actions.push(
            <Button
              key="resubmit"
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleResubmit(record)}
            >
              重新提交
            </Button>
          );
        }

        return <Space size="small">{actions}</Space>;
      },
    },
  ];

  // 过滤数据
  const filteredData = mockPRList.filter(pr => {
    if (statusFilter !== 'all' && pr.status !== statusFilter) return false;
    if (dataTypeFilter !== 'all' && pr.dataType !== dataTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <span className="text-lg font-medium">我提交的PR</span>
      </Card>

      {/* 统计卡片 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="全部" value={stats.total} />
          </Col>
          <Col span={6}>
            <Statistic
              title="待审核"
              value={stats.pending}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已通过"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已驳回"
              value={stats.rejected}
              valueStyle={{ color: '#f5222d' }}
            />
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
                { label: '待审核', value: 'pending' },
                { label: '审核中', value: 'reviewing' },
                { label: '已通过', value: 'approved' },
                { label: '已驳回', value: 'rejected' },
                { label: '已撤回', value: 'withdrawn' },
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
            <Search placeholder="PR编号/数据名称" allowClear />
          </Col>
        </Row>
      </Card>

      {/* PR列表 */}
      <Card size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
        />
      </Card>

      {/* PR详情弹窗 */}
      <Modal
        title={`PR详情 - ${selectedPR?.prCode}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          selectedPR?.status === 'rejected' && (
            <Button key="edit" icon={<EditOutlined />}>去修改</Button>
          ),
          <Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>,
        ]}
        width={700}
      >
        {selectedPR && (
          <div className="space-y-4">
            {/* 驳回信息 */}
            {selectedPR.status === 'rejected' && (
              <Alert
                type="error"
                showIcon
                message="此PR已被驳回"
                description={
                  <div>
                    <div>审核员：{selectedPR.reviewer}</div>
                    <div>驳回时间：{selectedPR.reviewTime}</div>
                    <div className="mt-2">驳回原因：{selectedPR.rejectReason}</div>
                  </div>
                }
              />
            )}

            {/* PR信息 */}
            <Card size="small" title="PR信息">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="PR编号">{selectedPR.prCode}</Descriptions.Item>
                <Descriptions.Item label="数据类型">{getDataTypeTag(selectedPR.dataType)}</Descriptions.Item>
                <Descriptions.Item label="提交时间">{selectedPR.submitTime}</Descriptions.Item>
                <Descriptions.Item label="状态">{getStatusTag(selectedPR.status)}</Descriptions.Item>
                {selectedPR.reviewer && (
                  <Descriptions.Item label="审核员">{selectedPR.reviewer}</Descriptions.Item>
                )}
                {selectedPR.reviewTime && (
                  <Descriptions.Item label="审核时间">{selectedPR.reviewTime}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* 数据预览 */}
            <Card size="small" title="数据预览">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="数据名称">{selectedPR.dataName}</Descriptions.Item>
                <Descriptions.Item label="数据条数">{selectedPR.dataCount} 条</Descriptions.Item>
              </Descriptions>
              <div className="mt-2">
                <Button type="link" size="small">查看完整详情 →</Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyPRListPage;
