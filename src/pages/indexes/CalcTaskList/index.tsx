/**
 * 指标计算任务列表页面
 * 对齐 specs/05_Index_System/Index_Calculation_Spec.md
 */

import { useState } from 'react';
import { 
  Button, Tag, Progress, Space, Modal, Form, Input, 
  Select, DatePicker, InputNumber, message 
} from 'antd';
import { 
  PlusOutlined, PlayCircleOutlined, EyeOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, 
  LoadingOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { GoldenPage, GridPanel } from '@/components/golden';
import dayjs from 'dayjs';

// Mock 数据
interface CalcTask {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  priceBaseDate: string;
  outlierMethod: 'iqr' | 'zscore' | 'mad';
  minSampleCount: number;
  totalIndexCount: number;
  generatedCount: number;
  skippedCount: number;
  warningCount: number;
  createdAt: string;
  completedAt?: string;
  createdBy: string;
}

const mockTasks: CalcTask[] = [
  { 
    id: '1', name: '2025年12月全量计算', type: 'full', status: 'completed', progress: 100,
    priceBaseDate: '2025-12', outlierMethod: 'iqr', minSampleCount: 3,
    totalIndexCount: 1250, generatedCount: 1180, skippedCount: 45, warningCount: 25,
    createdAt: '2026-01-15 10:00:00', completedAt: '2026-01-15 12:30:00', createdBy: '张三'
  },
  { 
    id: '2', name: '2026年1月增量计算', type: 'incremental', status: 'running', progress: 65,
    priceBaseDate: '2026-01', outlierMethod: 'iqr', minSampleCount: 3,
    totalIndexCount: 320, generatedCount: 208, skippedCount: 12, warningCount: 8,
    createdAt: '2026-01-17 09:00:00', createdBy: '李四'
  },
  { 
    id: '3', name: '2025年11月全量计算', type: 'full', status: 'completed', progress: 100,
    priceBaseDate: '2025-11', outlierMethod: 'zscore', minSampleCount: 5,
    totalIndexCount: 1200, generatedCount: 1050, skippedCount: 120, warningCount: 30,
    createdAt: '2025-12-10 14:00:00', completedAt: '2025-12-10 17:00:00', createdBy: '张三'
  },
  { 
    id: '4', name: '测试计算任务', type: 'incremental', status: 'failed', progress: 30,
    priceBaseDate: '2026-01', outlierMethod: 'mad', minSampleCount: 3,
    totalIndexCount: 100, generatedCount: 30, skippedCount: 0, warningCount: 5,
    createdAt: '2026-01-16 16:00:00', createdBy: '王五'
  },
];

const STATUS_CONFIG = {
  pending: { label: '待运行', color: 'default', icon: <ClockCircleOutlined /> },
  running: { label: '运行中', color: 'processing', icon: <LoadingOutlined /> },
  completed: { label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
  failed: { label: '失败', color: 'error', icon: <ExclamationCircleOutlined /> },
};

const OUTLIER_METHODS = [
  { value: 'iqr', label: 'IQR (四分位距)' },
  { value: 'zscore', label: 'Z-Score (标准差)' },
  { value: 'mad', label: 'MAD (中位数绝对偏差)' },
];

export default function CalcTaskListPage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<CalcTask> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 200,
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-400">
            {record.type === 'full' ? '全量计算' : '增量计算'} · {record.priceBaseDate}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '进度',
      key: 'progress',
      width: 180,
      render: (_, record) => (
        <div className="w-32">
          <Progress 
            percent={record.progress} 
            size="small" 
            status={record.status === 'failed' ? 'exception' : undefined}
          />
        </div>
      ),
    },
    {
      title: '指标统计',
      key: 'stats',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <span className="text-green-600">{record.generatedCount} 生成</span>
          <span className="text-gray-400">{record.skippedCount} 跳过</span>
          {record.warningCount > 0 && (
            <span className="text-orange-500">{record.warningCount} 警告</span>
          )}
        </Space>
      ),
    },
    {
      title: '异常处理',
      dataIndex: 'outlierMethod',
      width: 120,
      render: (method) => {
        const config = OUTLIER_METHODS.find(m => m.value === method);
        return <span className="text-gray-600">{config?.label}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 140,
      render: (time) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.status === 'completed' && (
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/indexes/calc/workbench/${record.id}`)}
            >
              查看
            </Button>
          )}
          {record.status === 'running' && (
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/indexes/calc/workbench/${record.id}`)}
            >
              监控
            </Button>
          )}
          {record.status === 'pending' && (
            <Button 
              type="link" 
              size="small" 
              icon={<PlayCircleOutlined />}
            >
              运行
            </Button>
          )}
          {record.status === 'failed' && (
            <Button 
              type="link" 
              size="small" 
              icon={<PlayCircleOutlined />}
            >
              重试
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 创建任务
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      console.log('Create task:', values);
      message.success('计算任务已创建');
      setCreateModalOpen(false);
      form.resetFields();
    } catch (error) {
      // validation failed
    }
  };

  return (
    <GoldenPage
      header={{
        title: '指标计算',
        subtitle: '从已完成标签化的事实数据生成可追溯指标',
        breadcrumbs: [
          { title: '指标系统' },
          { title: '计算任务' },
        ],
        actions: [
          {
            key: 'create',
            label: '新建计算任务',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: () => setCreateModalOpen(true),
          },
        ],
      }}
      toolbar={{
        search: {
          placeholder: '搜索任务名称...',
        },
      }}
      showTreePanel={false}
    >
      <GridPanel
        columns={columns}
        dataSource={mockTasks}
        rowKey="id"
        onRowClick={(record) => navigate(`/indexes/calc/workbench/${record.id}`)}
        pagination={{
          total: mockTasks.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无计算任务',
          action: (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              新建计算任务
            </Button>
          ),
        }}
      />

      {/* 创建任务 Modal */}
      <Modal
        title="新建计算任务"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreate}
        okText="创建"
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item 
            name="name" 
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="如：2026年1月全量计算" />
          </Form.Item>

          <Form.Item 
            name="type" 
            label="计算类型"
            rules={[{ required: true, message: '请选择计算类型' }]}
            initialValue="full"
          >
            <Select
              options={[
                { value: 'full', label: '全量计算 - 重新计算所有指标' },
                { value: 'incremental', label: '增量计算 - 仅计算新增数据' },
              ]}
            />
          </Form.Item>

          <Form.Item 
            name="priceBaseDate" 
            label="价格基准期"
            rules={[{ required: true, message: '请选择基准期' }]}
          >
            <DatePicker picker="month" className="w-full" />
          </Form.Item>

          <Form.Item 
            name="outlierMethod" 
            label="异常值处理方法"
            rules={[{ required: true, message: '请选择异常处理方法' }]}
            initialValue="iqr"
          >
            <Select options={OUTLIER_METHODS} />
          </Form.Item>

          <Form.Item 
            name="minSampleCount" 
            label="最小样本数"
            rules={[{ required: true, message: '请输入最小样本数' }]}
            initialValue={3}
            extra="样本数小于此值的指标将被跳过"
          >
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </GoldenPage>
  );
}
