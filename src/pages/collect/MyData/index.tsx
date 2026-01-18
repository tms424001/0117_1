/**
 * 我的数据工作区页面
 * 对齐 specs/03_Data_Collection/My_Data_Workspace_Spec.md
 */

import { useState, useMemo } from 'react';
import { 
  Button, Tag, Drawer, Form, Input, Select, 
  Descriptions, message, Modal, Timeline, Checkbox
} from 'antd';
import { 
  EditOutlined, SendOutlined, SaveOutlined, 
  FileTextOutlined, HistoryOutlined, CheckSquareOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { GoldenPage, GridPanel } from '@/components/golden';
import dayjs from 'dayjs';

// Mock 数据
interface MyDataRecord {
  id: string;
  type: 'material' | 'composite' | 'index' | 'case' | 'batch';
  name: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  changeCount: number;
  lastChangeAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChangeLog {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  changedBy: string;
}

const mockRecords: MyDataRecord[] = [
  { id: '1', type: 'material', name: '钢筋 HRB400 Φ12', status: 'draft', changeCount: 2, lastChangeAt: '2026-01-17 10:30:00', createdAt: '2026-01-15', updatedAt: '2026-01-17' },
  { id: '2', type: 'material', name: '商品混凝土 C30', status: 'submitted', changeCount: 1, lastChangeAt: '2026-01-16 14:20:00', createdAt: '2026-01-14', updatedAt: '2026-01-16' },
  { id: '3', type: 'composite', name: '钢筋混凝土柱 400x400', status: 'approved', changeCount: 3, lastChangeAt: '2026-01-15 09:00:00', createdAt: '2026-01-10', updatedAt: '2026-01-15' },
  { id: '4', type: 'index', name: '医疗-门诊-土建-中型', status: 'draft', changeCount: 0, createdAt: '2026-01-12', updatedAt: '2026-01-12' },
  { id: '5', type: 'case', name: '某医院门诊楼工程', status: 'rejected', changeCount: 1, lastChangeAt: '2026-01-14 16:00:00', createdAt: '2026-01-08', updatedAt: '2026-01-14' },
  { id: '6', type: 'batch', name: '2025年12月北京材价', status: 'submitted', changeCount: 5, lastChangeAt: '2026-01-17 08:00:00', createdAt: '2026-01-05', updatedAt: '2026-01-17' },
];

const mockChangeLogs: ChangeLog[] = [
  { id: '1', field: '单价', oldValue: '4500', newValue: '4650', changedAt: '2026-01-17 10:30:00', changedBy: '张三' },
  { id: '2', field: '规格', oldValue: 'Φ10', newValue: 'Φ12', changedAt: '2026-01-16 14:20:00', changedBy: '张三' },
];

const TYPE_CONFIG = {
  material: { label: '材料', color: 'blue' },
  composite: { label: '综价', color: 'green' },
  index: { label: '指标', color: 'purple' },
  case: { label: '案例', color: 'orange' },
  batch: { label: '批次', color: 'cyan' },
};

const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'default' },
  submitted: { label: '已提交', color: 'processing' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已驳回', color: 'error' },
};

export default function MyDataPage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<MyDataRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 过滤记录
  const filteredRecords = useMemo(() => {
    if (!selectedType) return mockRecords;
    return mockRecords.filter(r => r.type === selectedType);
  }, [selectedType]);

  // 表格列定义
  const columns: ColumnsType<MyDataRecord> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 280,
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">{name}</div>
            {record.changeCount > 0 && (
              <div className="text-xs text-orange-500">
                {record.changeCount} 处变更
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type) => {
        const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
      filters: Object.entries(TYPE_CONFIG).map(([key, val]) => ({
        text: val.label,
        value: key,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '最后变更',
      dataIndex: 'lastChangeAt',
      width: 140,
      render: (time) => time ? dayjs(time).format('MM-DD HH:mm') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 120,
      render: (time) => dayjs(time).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(record);
          }}
        >
          编辑
        </Button>
      ),
    },
  ];

  // 编辑记录
  const handleEdit = (record: MyDataRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
    });
    setDrawerOpen(true);
  };

  // 保存草稿
  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success('草稿已保存');
      setDrawerOpen(false);
    } catch (error) {
      // validation failed
    }
  };

  // 生成入库包
  const handleGeneratePackage = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要入库的数据');
      return;
    }
    const draftCount = mockRecords.filter(
      r => selectedRows.includes(r.id) && r.status === 'draft'
    ).length;
    if (draftCount === 0) {
      message.warning('所选数据中没有草稿状态的记录');
      return;
    }
    message.success(`已生成入库包，包含 ${draftCount} 条记录`);
  };

  // 提交 PR
  const handleSubmitPR = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要提交的数据');
      return;
    }
    setPrModalOpen(true);
  };

  // 确认提交 PR
  const handleConfirmPR = () => {
    message.success('PR 已提交，等待审核');
    setPrModalOpen(false);
    setSelectedRows([]);
  };

  return (
    <GoldenPage
      header={{
        title: '我的数据工作区',
        subtitle: '编辑、管理个人数据，生成入库包并提交 PR',
        breadcrumbs: [
          { title: '数据采集' },
          { title: '我的数据' },
        ],
        actions: [
          {
            key: 'package',
            label: '生成入库包',
            icon: <CheckSquareOutlined />,
            onClick: handleGeneratePackage,
            disabled: selectedRows.length === 0,
          },
          {
            key: 'submit',
            label: '提交 PR',
            type: 'primary',
            icon: <SendOutlined />,
            onClick: handleSubmitPR,
            disabled: selectedRows.length === 0,
          },
        ],
      }}
      toolbar={{
        search: {
          placeholder: '搜索名称...',
        },
        batchActions: [
          { key: 'package', label: '生成入库包', icon: <CheckSquareOutlined /> },
          { key: 'submit', label: '提交 PR', icon: <SendOutlined /> },
        ],
        selectedCount: selectedRows.length,
        totalCount: filteredRecords.length,
        extra: (
          <Select
            value={selectedType}
            onChange={setSelectedType}
            style={{ width: 120 }}
            placeholder="全部类型"
            allowClear
            options={[
              { value: '', label: '全部类型' },
              ...Object.entries(TYPE_CONFIG).map(([key, val]) => ({
                value: key,
                label: val.label,
              })),
            ]}
          />
        ),
      }}
      showTreePanel={false}
      drawerOpen={drawerOpen}
      drawer={
        editingRecord && (
          <RecordEditDrawer
            record={editingRecord}
            form={form}
            changeLogs={mockChangeLogs}
            onClose={() => setDrawerOpen(false)}
            onSave={handleSave}
          />
        )
      }
      drawerWidth={480}
    >
      <GridPanel
        columns={columns}
        dataSource={filteredRecords}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (keys) => setSelectedRows(keys as string[]),
        }}
        onRowClick={handleEdit}
        pagination={{
          total: filteredRecords.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无数据记录',
        }}
      />

      {/* 提交 PR Modal */}
      <Modal
        title="提交 PR"
        open={prModalOpen}
        onCancel={() => setPrModalOpen(false)}
        onOk={handleConfirmPR}
        okText="提交"
      >
        <div className="py-4">
          <p className="mb-4">
            即将提交 <span className="font-bold text-blue-600">{selectedRows.length}</span> 条数据的变更请求
          </p>
          <Form layout="vertical">
            <Form.Item label="PR 标题" required>
              <Input placeholder="如：更新2025年12月北京材价数据" />
            </Form.Item>
            <Form.Item label="变更说明">
              <Input.TextArea 
                placeholder="描述本次变更的内容和原因" 
                rows={3}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox>提交前校验必填元数据</Checkbox>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </GoldenPage>
  );
}

// 记录编辑抽屉
interface RecordEditDrawerProps {
  record: MyDataRecord;
  form: any;
  changeLogs: ChangeLog[];
  onClose: () => void;
  onSave: () => void;
}

function RecordEditDrawer({ record, form, changeLogs, onClose, onSave }: RecordEditDrawerProps) {
  const typeConfig = TYPE_CONFIG[record.type];
  const statusConfig = STATUS_CONFIG[record.status];

  return (
    <Drawer
      title="编辑数据"
      open={true}
      onClose={onClose}
      width={480}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
            保存草稿
          </Button>
        </div>
      }
    >
      {/* 基本信息 */}
      <Descriptions column={2} size="small" className="mb-4">
        <Descriptions.Item label="类型">
          <Tag color={typeConfig.color}>{typeConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* 编辑表单 */}
      <Form form={form} layout="vertical">
        <Form.Item 
          name="name" 
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="数据名称" />
        </Form.Item>

        {record.type === 'material' && (
          <>
            <Form.Item name="spec" label="规格型号">
              <Input placeholder="如：HRB400 Φ12" />
            </Form.Item>
            <Form.Item name="unit" label="单位">
              <Input placeholder="如：t、m³" />
            </Form.Item>
            <Form.Item name="price" label="单价">
              <Input placeholder="单价" addonAfter="元" />
            </Form.Item>
          </>
        )}

        {record.type === 'composite' && (
          <>
            <Form.Item name="feature" label="特征描述">
              <Input.TextArea placeholder="特征描述" rows={2} />
            </Form.Item>
            <Form.Item name="unit" label="单位">
              <Input placeholder="如：m³、m²" />
            </Form.Item>
            <Form.Item name="price" label="综合单价">
              <Input placeholder="综合单价" addonAfter="元" />
            </Form.Item>
          </>
        )}

        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="备注说明" rows={2} />
        </Form.Item>
      </Form>

      {/* 变更记录 */}
      {changeLogs.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <HistoryOutlined />
            <span className="font-medium">变更记录</span>
          </div>
          <Timeline
            items={changeLogs.map(log => ({
              children: (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.field}</span>
                    <span className="text-xs text-gray-400">
                      {dayjs(log.changedAt).format('MM-DD HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-500 line-through">{log.oldValue}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600">{log.newValue}</span>
                  </div>
                  <div className="text-xs text-gray-400">{log.changedBy}</div>
                </div>
              ),
            }))}
          />
        </div>
      )}
    </Drawer>
  );
}
