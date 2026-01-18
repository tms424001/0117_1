/**
 * 标签化任务列表页面
 * 对齐 specs/04_Data_Tagging/Tagging_Process_Spec.md
 */

import { useState } from 'react';
import { 
  Button, Tag, Progress, Space, Tooltip 
} from 'antd';
import { 
  PlayCircleOutlined, EyeOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { GoldenPage, GridPanel } from '@/components/golden';
import dayjs from 'dayjs';

// Mock 数据
interface TaggingTask {
  id: string;
  projectName: string;
  batchId: string;
  fileName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  unitCount: number;
  completedCount: number;
  errorCount: number;
  warningCount: number;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

const mockTasks: TaggingTask[] = [
  { 
    id: '1', projectName: '某医院门诊楼工程', batchId: 'b1', fileName: '某医院门诊楼工程.gzb',
    status: 'in_progress', progress: 65, unitCount: 8, completedCount: 5, errorCount: 2, warningCount: 3,
    createdAt: '2026-01-15 10:00:00', updatedAt: '2026-01-17 14:30:00', assignee: '张三'
  },
  { 
    id: '2', projectName: '某学校教学楼工程', batchId: 'b2', fileName: '某学校教学楼工程.gzb',
    status: 'pending', progress: 0, unitCount: 5, completedCount: 0, errorCount: 0, warningCount: 0,
    createdAt: '2026-01-16 09:00:00', updatedAt: '2026-01-16 09:00:00'
  },
  { 
    id: '3', projectName: '某办公楼工程', batchId: 'b3', fileName: '某办公楼工程.gzb',
    status: 'completed', progress: 100, unitCount: 6, completedCount: 6, errorCount: 0, warningCount: 1,
    createdAt: '2026-01-10 08:00:00', updatedAt: '2026-01-14 16:00:00', assignee: '李四'
  },
  { 
    id: '4', projectName: '某住宅小区工程', batchId: 'b4', fileName: '某住宅小区工程.gzb',
    status: 'failed', progress: 30, unitCount: 12, completedCount: 3, errorCount: 5, warningCount: 2,
    createdAt: '2026-01-12 11:00:00', updatedAt: '2026-01-13 10:00:00', assignee: '王五'
  },
];

const STATUS_CONFIG = {
  pending: { label: '待处理', color: 'default', icon: <ClockCircleOutlined /> },
  in_progress: { label: '进行中', color: 'processing', icon: <PlayCircleOutlined /> },
  completed: { label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
  failed: { label: '有问题', color: 'error', icon: <ExclamationCircleOutlined /> },
};

export default function TaggingTaskListPage() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // 表格列定义
  const columns: ColumnsType<TaggingTask> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 220,
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-400">{record.fileName}</div>
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
      filters: Object.entries(STATUS_CONFIG).map(([key, val]) => ({
        text: val.label,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
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
          <div className="text-xs text-gray-400 mt-1">
            {record.completedCount}/{record.unitCount} 单体
          </div>
        </div>
      ),
    },
    {
      title: '问题',
      key: 'issues',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.errorCount > 0 && (
            <Tooltip title={`${record.errorCount} 个阻断问题`}>
              <Tag color="error">{record.errorCount} 错误</Tag>
            </Tooltip>
          )}
          {record.warningCount > 0 && (
            <Tooltip title={`${record.warningCount} 个警告`}>
              <Tag color="warning">{record.warningCount} 警告</Tag>
            </Tooltip>
          )}
          {record.errorCount === 0 && record.warningCount === 0 && (
            <span className="text-gray-400">-</span>
          )}
        </Space>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      width: 100,
      render: (assignee) => assignee || <span className="text-gray-400">未分配</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 140,
      render: (time) => dayjs(time).format('MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.status === 'completed' ? (
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/tagging/workbench/${record.id}`)}
            >
              查看
            </Button>
          ) : (
            <Button 
              type="link" 
              size="small" 
              icon={<PlayCircleOutlined />}
              onClick={() => navigate(`/tagging/workbench/${record.id}`)}
            >
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: mockTasks.length,
    pending: mockTasks.filter(t => t.status === 'pending').length,
    inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    failed: mockTasks.filter(t => t.status === 'failed').length,
  };

  return (
    <GoldenPage
      header={{
        title: '数据标签化',
        subtitle: '将原始造价数据加工为可计算指标的结构化事实',
        breadcrumbs: [
          { title: '标签化' },
          { title: '任务列表' },
        ],
        extra: (
          <div className="flex items-center gap-6 text-sm">
            <span>待处理 <span className="font-bold text-gray-600">{stats.pending}</span></span>
            <span>进行中 <span className="font-bold text-blue-600">{stats.inProgress}</span></span>
            <span>已完成 <span className="font-bold text-green-600">{stats.completed}</span></span>
            <span>有问题 <span className="font-bold text-red-600">{stats.failed}</span></span>
          </div>
        ),
      }}
      toolbar={{
        search: {
          placeholder: '搜索项目名称...',
        },
        selectedCount: selectedRows.length,
        totalCount: mockTasks.length,
      }}
      showTreePanel={false}
    >
      <GridPanel
        columns={columns}
        dataSource={mockTasks}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (keys) => setSelectedRows(keys as string[]),
        }}
        onRowClick={(record) => navigate(`/tagging/workbench/${record.id}`)}
        pagination={{
          total: mockTasks.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无标签化任务',
        }}
      />
    </GoldenPage>
  );
}
