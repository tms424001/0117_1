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
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Dropdown,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  CalculatorOutlined,
  ProjectOutlined,
  MoreOutlined,
  SearchOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

// 估算项目数据类型
interface EstimationProject {
  id: string;
  projectName: string;
  projectCode: string;
  projectType: string;
  province: string;
  city: string;
  estimationType: 'quick' | 'standard' | 'detailed';
  totalArea: number;
  totalCost: number;
  unitCost: number;
  unitCount: number;
  status: 'draft' | 'calculating' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// 模拟项目数据
const mockProjects: EstimationProject[] = [
  {
    id: '1',
    projectName: '某三甲医院新建项目',
    projectCode: 'EST-2026-001',
    projectType: '医疗卫生',
    province: '北京',
    city: '北京市',
    estimationType: 'standard',
    totalArea: 85000,
    totalCost: 425000000,
    unitCost: 5000,
    unitCount: 5,
    status: 'completed',
    createdAt: '2026-01-15 10:30:00',
    updatedAt: '2026-01-16 14:20:00',
  },
  {
    id: '2',
    projectName: '某高中教学楼项目',
    projectCode: 'EST-2026-002',
    projectType: '教育',
    province: '上海',
    city: '上海市',
    estimationType: 'quick',
    totalArea: 32000,
    totalCost: 96000000,
    unitCost: 3000,
    unitCount: 3,
    status: 'completed',
    createdAt: '2026-01-14 09:00:00',
    updatedAt: '2026-01-14 11:30:00',
  },
  {
    id: '3',
    projectName: '某办公综合体项目',
    projectCode: 'EST-2026-003',
    projectType: '办公',
    province: '广东',
    city: '深圳市',
    estimationType: 'detailed',
    totalArea: 120000,
    totalCost: 0,
    unitCost: 0,
    unitCount: 8,
    status: 'draft',
    createdAt: '2026-01-18 08:00:00',
    updatedAt: '2026-01-18 08:00:00',
  },
  {
    id: '4',
    projectName: '某商业综合体项目',
    projectCode: 'EST-2026-004',
    projectType: '商业',
    province: '浙江',
    city: '杭州市',
    estimationType: 'standard',
    totalArea: 68000,
    totalCost: 272000000,
    unitCost: 4000,
    unitCount: 4,
    status: 'completed',
    createdAt: '2026-01-12 14:00:00',
    updatedAt: '2026-01-13 16:45:00',
  },
  {
    id: '5',
    projectName: '某住宅小区项目',
    projectCode: 'EST-2026-005',
    projectType: '居住',
    province: '江苏',
    city: '南京市',
    estimationType: 'quick',
    totalArea: 150000,
    totalCost: 0,
    unitCost: 0,
    unitCount: 12,
    status: 'calculating',
    createdAt: '2026-01-17 11:00:00',
    updatedAt: '2026-01-18 09:30:00',
  },
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取估算类型标签
  const getEstimationTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      quick: { color: 'green', text: '快速估算' },
      standard: { color: 'blue', text: '标准估算' },
      detailed: { color: 'purple', text: '精细估算' },
    };
    const t = map[type] || { color: 'default', text: type };
    return <Tag color={t.color}>{t.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      calculating: { color: 'processing', text: '计算中' },
      completed: { color: 'success', text: '已完成' },
      archived: { color: 'warning', text: '已归档' },
    };
    const s = map[status] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // 格式化金额
  const formatMoney = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}万`;
    }
    return value.toLocaleString();
  };

  // 格式化面积
  const formatArea = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(2)}万m²`;
    }
    return `${value.toLocaleString()}m²`;
  };

  // 表格列定义
  const columns: ColumnsType<EstimationProject> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (v, r) => (
        <div className="flex items-center gap-2">
          <ProjectOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <div>
            <div className="font-medium cursor-pointer hover:text-blue-500" onClick={() => navigate(`/estimation/projects/${r.id}`)}>
              {v}
            </div>
            <div className="text-xs text-gray-400">{r.projectCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      key: 'projectType',
      width: 100,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '地区',
      key: 'location',
      width: 120,
      render: (_, r) => `${r.province} ${r.city}`,
    },
    {
      title: '估算类型',
      dataIndex: 'estimationType',
      key: 'estimationType',
      width: 100,
      render: (v) => getEstimationTypeTag(v),
    },
    {
      title: '建筑面积',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 120,
      align: 'right',
      render: (v) => formatArea(v),
    },
    {
      title: '估算造价',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      align: 'right',
      render: (v) => v > 0 ? `¥${formatMoney(v)}` : '-',
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (v) => v > 0 ? `${v.toLocaleString()}元/m²` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (v) => getStatusTag(v),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<CalculatorOutlined />}
            onClick={() => navigate(`/estimation/projects/${record.id}`)}
          >
            {record.status === 'draft' ? '继续' : '查看'}
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: 'edit', icon: <EditOutlined />, label: '编辑' },
                { key: 'copy', icon: <CopyOutlined />, label: '复制' },
                { key: 'export', icon: <ExportOutlined />, label: '导出' },
                { type: 'divider' },
                { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true },
              ],
            }}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: mockProjects.length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    draft: mockProjects.filter(p => p.status === 'draft').length,
    totalCost: mockProjects.reduce((sum, p) => sum + p.totalCost, 0),
  };

  // 创建项目
  const handleCreate = () => {
    form.validateFields().then(values => {
      console.log('创建项目:', values);
      message.success('项目创建成功');
      setCreateModalVisible(false);
      form.resetFields();
      // 跳转到工作台
      navigate('/estimation/projects/new');
    });
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">估算项目</span>
            <span className="text-gray-400 ml-2">指标匡算 · 投资估算 · 方案比选</span>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            新建估算
          </Button>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="项目总数" value={stats.total} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已完成" value={stats.completed} valueStyle={{ color: '#52c41a' }} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="草稿" value={stats.draft} valueStyle={{ color: '#faad14' }} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="估算总额" value={stats.totalCost / 100000000} precision={2} suffix="亿元" />
          </Card>
        </Col>
      </Row>

      {/* 项目列表 */}
      <Card
        size="small"
        title="项目列表"
        extra={
          <Space>
            <Input.Search placeholder="搜索项目名称" style={{ width: 200 }} prefix={<SearchOutlined />} />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="archived">已归档</Select.Option>
            </Select>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={mockProjects}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个项目` }}
          size="small"
        />
      </Card>

      {/* 新建项目弹窗 */}
      <Modal
        title="新建估算项目"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => setCreateModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="自动生成" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="projectType" label="项目类型" rules={[{ required: true, message: '请选择项目类型' }]}>
                <Select placeholder="请选择">
                  <Select.Option value="医疗卫生">医疗卫生</Select.Option>
                  <Select.Option value="教育">教育</Select.Option>
                  <Select.Option value="办公">办公</Select.Option>
                  <Select.Option value="商业">商业</Select.Option>
                  <Select.Option value="居住">居住</Select.Option>
                  <Select.Option value="文化">文化</Select.Option>
                  <Select.Option value="体育">体育</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="province" label="省份" rules={[{ required: true, message: '请选择省份' }]}>
                <Select placeholder="请选择">
                  <Select.Option value="北京">北京</Select.Option>
                  <Select.Option value="上海">上海</Select.Option>
                  <Select.Option value="广东">广东</Select.Option>
                  <Select.Option value="浙江">浙江</Select.Option>
                  <Select.Option value="江苏">江苏</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="city" label="城市">
                <Select placeholder="请选择">
                  <Select.Option value="北京市">北京市</Select.Option>
                  <Select.Option value="上海市">上海市</Select.Option>
                  <Select.Option value="深圳市">深圳市</Select.Option>
                  <Select.Option value="杭州市">杭州市</Select.Option>
                  <Select.Option value="南京市">南京市</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="estimationType" label="估算类型" rules={[{ required: true, message: '请选择估算类型' }]}>
                <Select placeholder="请选择">
                  <Select.Option value="quick">快速估算 (±20%)</Select.Option>
                  <Select.Option value="standard">标准估算 (±15%)</Select.Option>
                  <Select.Option value="detailed">精细估算 (±10%)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estimationDate" label="估算基准日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="indexVersion" label="指标版本">
                <Select placeholder="请选择" defaultValue="2026.01">
                  <Select.Option value="2026.01">v2026.01 (最新)</Select.Option>
                  <Select.Option value="2025.12">v2025.12</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="项目描述">
            <Input.TextArea rows={3} placeholder="请输入项目描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
