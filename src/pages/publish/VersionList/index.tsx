/**
 * 指标版本管理列表页面
 * 对齐 specs/05_Index_System/Index_Publish_Spec.md
 * 
 * 功能：
 * - 版本列表（含状态、价格基准期、阶段）
 * - 版本对比
 * - 创建新版本
 * - 提交审核/发布
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, Button, Tag, Space, Modal, Form, Input, Select, 
  DatePicker, Tooltip, Dropdown, message, Descriptions
} from 'antd';
import {
  PlusOutlined, EyeOutlined, EditOutlined, SendOutlined,
  RocketOutlined, MoreOutlined, DiffOutlined, CopyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { GoldenPage } from '@/components/golden';

// 版本状态
type VersionStatus = 'draft' | 'reviewing' | 'approved' | 'published' | 'archived';

// 版本数据
interface IndexVersion {
  id: string;
  versionCode: string;
  versionName: string;
  status: VersionStatus;
  // V1.1: 口径身份证
  priceBaseDate: string;
  stage: 'ESTIMATE' | 'TENDER' | 'SETTLEMENT';
  libraryVersionCode: string;
  // 统计
  totalIndexes: number;
  newIndexes: number;
  updatedIndexes: number;
  deletedIndexes: number;
  // 时间
  createdAt: string;
  createdBy: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
}

const mockVersions: IndexVersion[] = [
  {
    id: '1', versionCode: 'V2026.01', versionName: '2026年1月版',
    status: 'published', priceBaseDate: '2026-01', stage: 'ESTIMATE',
    libraryVersionCode: 'V2026Q1',
    totalIndexes: 1250, newIndexes: 85, updatedIndexes: 320, deletedIndexes: 12,
    createdAt: '2026-01-10', createdBy: '张三',
    submittedAt: '2026-01-12', approvedAt: '2026-01-14', publishedAt: '2026-01-15'
  },
  {
    id: '2', versionCode: 'V2026.02', versionName: '2026年2月版（草稿）',
    status: 'draft', priceBaseDate: '2026-02', stage: 'ESTIMATE',
    libraryVersionCode: 'V2026Q1',
    totalIndexes: 1280, newIndexes: 45, updatedIndexes: 180, deletedIndexes: 5,
    createdAt: '2026-01-18', createdBy: '张三'
  },
  {
    id: '3', versionCode: 'V2025.12', versionName: '2025年12月版',
    status: 'archived', priceBaseDate: '2025-12', stage: 'ESTIMATE',
    libraryVersionCode: 'V2025Q4',
    totalIndexes: 1180, newIndexes: 60, updatedIndexes: 250, deletedIndexes: 8,
    createdAt: '2025-12-05', createdBy: '李四',
    submittedAt: '2025-12-08', approvedAt: '2025-12-10', publishedAt: '2025-12-12'
  },
  {
    id: '4', versionCode: 'V2026.01-TENDER', versionName: '2026年1月招标版',
    status: 'reviewing', priceBaseDate: '2026-01', stage: 'TENDER',
    libraryVersionCode: 'V2026Q1',
    totalIndexes: 980, newIndexes: 120, updatedIndexes: 0, deletedIndexes: 0,
    createdAt: '2026-01-16', createdBy: '王五',
    submittedAt: '2026-01-17'
  },
];

const statusConfig: Record<VersionStatus, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  reviewing: { text: '审核中', color: 'processing' },
  approved: { text: '已审核', color: 'success' },
  published: { text: '已发布', color: 'green' },
  archived: { text: '已归档', color: 'default' },
};

const stageConfig: Record<string, { text: string; color: string }> = {
  ESTIMATE: { text: '估算', color: 'blue' },
  TENDER: { text: '招标', color: 'orange' },
  SETTLEMENT: { text: '结算', color: 'purple' },
};

export default function VersionListPage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 操作菜单
  const getActionItems = (record: IndexVersion): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: '查看详情',
        onClick: () => navigate(`/publish/versions/${record.id}`),
      },
    ];

    if (record.status === 'draft') {
      items.push(
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '编辑',
          onClick: () => navigate(`/publish/versions/${record.id}/edit`),
        },
        {
          key: 'submit',
          icon: <SendOutlined />,
          label: '提交审核',
          onClick: () => handleSubmitReview(record),
        }
      );
    }

    if (record.status === 'reviewing') {
      items.push({
        key: 'review',
        icon: <EyeOutlined />,
        label: '进入审核',
        onClick: () => navigate(`/publish/review/${record.id}`),
      });
    }

    if (record.status === 'approved') {
      items.push({
        key: 'publish',
        icon: <RocketOutlined />,
        label: '发布',
        onClick: () => navigate(`/publish/console/${record.id}`),
      });
    }

    items.push(
      { type: 'divider' },
      {
        key: 'copy',
        icon: <CopyOutlined />,
        label: '复制为新版本',
        onClick: () => handleCopyVersion(record),
      }
    );

    return items;
  };

  // 表格列定义
  const columns: ColumnsType<IndexVersion> = [
    {
      title: '版本号',
      dataIndex: 'versionCode',
      width: 140,
      render: (code, record) => (
        <a onClick={() => navigate(`/publish/versions/${record.id}`)}>
          <span className="font-mono font-medium">{code}</span>
        </a>
      ),
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: VersionStatus) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '价格基准期',
      dataIndex: 'priceBaseDate',
      width: 100,
      render: (date) => <Tag color="blue">{date}</Tag>,
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      width: 80,
      render: (stage) => {
        const config = stageConfig[stage];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '指标数',
      key: 'indexes',
      width: 150,
      render: (_, record) => (
        <Tooltip title={`新增${record.newIndexes} / 更新${record.updatedIndexes} / 删除${record.deletedIndexes}`}>
          <span>
            {record.totalIndexes}
            <span className="text-xs text-gray-400 ml-1">
              (+{record.newIndexes} / ~{record.updatedIndexes})
            </span>
          </span>
        </Tooltip>
      ),
    },
    {
      title: '标准库版本',
      dataIndex: 'libraryVersionCode',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      width: 100,
      render: (date) => date || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // 提交审核
  const handleSubmitReview = (record: IndexVersion) => {
    Modal.confirm({
      title: '提交审核',
      content: `确定要将版本 ${record.versionCode} 提交审核吗？`,
      onOk: () => {
        message.success('已提交审核');
      },
    });
  };

  // 复制版本
  const handleCopyVersion = (record: IndexVersion) => {
    message.success(`已复制版本 ${record.versionCode} 为新草稿`);
  };

  // 创建新版本
  const handleCreateVersion = () => {
    form.validateFields().then((values) => {
      console.log('Create version:', values);
      message.success('版本创建成功');
      setCreateModalOpen(false);
      form.resetFields();
    });
  };

  // 版本对比
  const handleCompare = () => {
    if (selectedVersions.length !== 2) {
      message.warning('请选择两个版本进行对比');
      return;
    }
    setCompareModalOpen(true);
  };

  return (
    <GoldenPage
      header={{
        title: '指标版本管理',
        subtitle: '管理指标版本的创建、审核和发布',
        breadcrumbs: [
          { title: '指标系统', path: '/indexes/list' },
          { title: '版本管理' },
        ],
        actions: [
          { 
            key: 'compare', 
            label: '版本对比', 
            icon: <DiffOutlined />,
            disabled: selectedVersions.length !== 2,
            onClick: handleCompare,
          },
          { 
            key: 'create', 
            label: '创建新版本', 
            type: 'primary', 
            icon: <PlusOutlined />,
            onClick: () => setCreateModalOpen(true),
          },
        ],
      }}
    >
      <Card>
        <Table
          columns={columns}
          dataSource={mockVersions}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedVersions,
            onChange: (keys) => setSelectedVersions(keys as string[]),
          }}
          scroll={{ x: 1200 }}
          pagination={{
            total: mockVersions.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个版本`,
          }}
        />
      </Card>

      {/* 创建版本弹窗 */}
      <Modal
        title="创建新版本"
        open={createModalOpen}
        onOk={handleCreateVersion}
        onCancel={() => setCreateModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="versionCode" label="版本号" rules={[{ required: true }]}>
            <Input placeholder="如 V2026.02" />
          </Form.Item>
          <Form.Item name="versionName" label="版本名称" rules={[{ required: true }]}>
            <Input placeholder="如 2026年2月版" />
          </Form.Item>
          <Form.Item name="priceBaseDate" label="价格基准期" rules={[{ required: true }]}>
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stage" label="阶段" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'ESTIMATE', label: '估算' },
                { value: 'TENDER', label: '招标' },
                { value: 'SETTLEMENT', label: '结算' },
              ]}
            />
          </Form.Item>
          <Form.Item name="libraryVersionCode" label="标准库版本" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'V2026Q1', label: 'V2026Q1 (当前)' },
                { value: 'V2025Q4', label: 'V2025Q4' },
              ]}
            />
          </Form.Item>
          <Form.Item name="baseVersionId" label="基于版本">
            <Select
              allowClear
              placeholder="选择基础版本（可选）"
              options={mockVersions.map(v => ({ value: v.id, label: v.versionCode }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 版本对比弹窗 */}
      <Modal
        title="版本对比"
        open={compareModalOpen}
        onCancel={() => setCompareModalOpen(false)}
        width={800}
        footer={null}
      >
        <VersionCompare versionIds={selectedVersions} />
      </Modal>
    </GoldenPage>
  );
}

// 版本对比组件
function VersionCompare({ versionIds }: { versionIds: string[] }) {
  const v1 = mockVersions.find(v => v.id === versionIds[0]);
  const v2 = mockVersions.find(v => v.id === versionIds[1]);

  if (!v1 || !v2) return null;

  const contextChanged = v1.priceBaseDate !== v2.priceBaseDate || 
                         v1.stage !== v2.stage || 
                         v1.libraryVersionCode !== v2.libraryVersionCode;

  return (
    <div>
      {contextChanged && (
        <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
          <div className="font-medium text-orange-600 mb-2">⚠️ 本次差异包含口径变更</div>
          <ul className="text-sm text-orange-700 list-disc list-inside">
            {v1.priceBaseDate !== v2.priceBaseDate && (
              <li>价格基准期: {v1.priceBaseDate} → {v2.priceBaseDate}</li>
            )}
            {v1.stage !== v2.stage && (
              <li>阶段: {v1.stage} → {v2.stage}</li>
            )}
            {v1.libraryVersionCode !== v2.libraryVersionCode && (
              <li>标准库版本: {v1.libraryVersionCode} → {v2.libraryVersionCode}</li>
            )}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card title={v1.versionCode} size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[v1.status].color}>{statusConfig[v1.status].text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格基准期">{v1.priceBaseDate}</Descriptions.Item>
            <Descriptions.Item label="阶段">{v1.stage}</Descriptions.Item>
            <Descriptions.Item label="指标数">{v1.totalIndexes}</Descriptions.Item>
            <Descriptions.Item label="新增">{v1.newIndexes}</Descriptions.Item>
            <Descriptions.Item label="更新">{v1.updatedIndexes}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title={v2.versionCode} size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[v2.status].color}>{statusConfig[v2.status].text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格基准期">{v2.priceBaseDate}</Descriptions.Item>
            <Descriptions.Item label="阶段">{v2.stage}</Descriptions.Item>
            <Descriptions.Item label="指标数">{v2.totalIndexes}</Descriptions.Item>
            <Descriptions.Item label="新增">{v2.newIndexes}</Descriptions.Item>
            <Descriptions.Item label="更新">{v2.updatedIndexes}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Card title="数据变化统计" size="small" className="mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">+{Math.abs(v2.totalIndexes - v1.totalIndexes)}</div>
            <div className="text-gray-500 text-sm">指标数变化</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{v2.newIndexes}</div>
            <div className="text-gray-500 text-sm">新增指标</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{v2.updatedIndexes}</div>
            <div className="text-gray-500 text-sm">更新指标</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
