/**
 * 导入批次列表页面
 * 对齐 specs/03_Data_Collection/Collection_Overview_Spec.md
 */

import { useState } from 'react';
import { 
  Button, Tag, Space, Progress, Modal, Upload, Steps, 
  Form, Input, Select, DatePicker, message, Tooltip 
} from 'antd';
import { 
  PlusOutlined, UploadOutlined, ReloadOutlined, 
  DeleteOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';
import { GoldenPage, GridPanel } from '@/components/golden';
import dayjs from 'dayjs';

// Mock 数据
interface ImportBatch {
  id: string;
  type: 'cost' | 'material_price' | 'composite_price';
  fileName: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'parsing' | 'ready' | 'failed';
  progress?: number;
  errorSummary?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    projectName?: string;
    region?: string;
    priceBaseDate?: string;
  };
}

const mockBatches: ImportBatch[] = [
  { 
    id: '1', type: 'cost', fileName: '某医院门诊楼工程.gzb', fileSize: 2456000, 
    status: 'ready', createdAt: '2026-01-15 10:30:00', updatedAt: '2026-01-15 10:35:00',
    metadata: { projectName: '某医院门诊楼工程', region: '北京', priceBaseDate: '2025-12' }
  },
  { 
    id: '2', type: 'cost', fileName: '某学校教学楼工程.gzb', fileSize: 1890000, 
    status: 'parsing', progress: 65, createdAt: '2026-01-16 14:20:00', updatedAt: '2026-01-16 14:22:00'
  },
  { 
    id: '3', type: 'material_price', fileName: '2025年12月北京材价.xlsx', fileSize: 456000, 
    status: 'ready', createdAt: '2026-01-14 09:00:00', updatedAt: '2026-01-14 09:05:00',
    metadata: { region: '北京', priceBaseDate: '2025-12' }
  },
  { 
    id: '4', type: 'cost', fileName: '某办公楼工程.gzb', fileSize: 3200000, 
    status: 'failed', errorSummary: '文件格式不支持，请检查文件是否损坏', 
    createdAt: '2026-01-13 16:00:00', updatedAt: '2026-01-13 16:02:00'
  },
  { 
    id: '5', type: 'composite_price', fileName: '2025年综合单价库.xlsx', fileSize: 890000, 
    status: 'pending', createdAt: '2026-01-17 08:00:00', updatedAt: '2026-01-17 08:00:00'
  },
];

const TYPE_CONFIG = {
  cost: { label: '造价文件', color: 'blue' },
  material_price: { label: '材价文件', color: 'green' },
  composite_price: { label: '综价文件', color: 'purple' },
};

const STATUS_CONFIG = {
  pending: { label: '待处理', color: 'default', icon: <FileTextOutlined /> },
  uploading: { label: '上传中', color: 'processing', icon: <LoadingOutlined /> },
  parsing: { label: '解析中', color: 'processing', icon: <LoadingOutlined /> },
  ready: { label: '就绪', color: 'success', icon: <CheckCircleOutlined /> },
  failed: { label: '失败', color: 'error', icon: <CloseCircleOutlined /> },
};

export default function ImportListPage() {
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<'cost' | 'price'>('cost');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // 表格列定义
  const columns: ColumnsType<ImportBatch> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 280,
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-400">
              {(record.fileSize / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type) => {
        const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status, record) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
        if (status === 'parsing' && record.progress) {
          return (
            <div className="w-24">
              <Progress percent={record.progress} size="small" status="active" />
            </div>
          );
        }
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '项目/来源',
      key: 'source',
      width: 180,
      render: (_, record) => (
        <div className="text-sm">
          {record.metadata?.projectName || record.metadata?.region || '-'}
          {record.metadata?.priceBaseDate && (
            <div className="text-xs text-gray-400">{record.metadata.priceBaseDate}</div>
          )}
        </div>
      ),
    },
    {
      title: '错误信息',
      dataIndex: 'errorSummary',
      width: 200,
      render: (error) => error ? (
        <Tooltip title={error}>
          <span className="text-red-500 text-sm">
            {error.length > 20 ? error.slice(0, 20) + '...' : error}
          </span>
        </Tooltip>
      ) : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      render: (time) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          {record.status === 'ready' && (
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            >
              预览
            </Button>
          )}
          {record.status === 'failed' && (
            <Button 
              type="link" 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={() => handleRetry(record)}
            >
              重试
            </Button>
          )}
          <Button 
            type="link" 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 进入预览
  const handlePreview = (batch: ImportBatch) => {
    if (batch.type === 'cost') {
      navigate(`/collect/import/${batch.id}`);
    } else {
      navigate(`/collect/price-files/${batch.id}`);
    }
  };

  // 重试
  const handleRetry = (batch: ImportBatch) => {
    message.loading(`正在重试解析 ${batch.fileName}...`);
    setTimeout(() => {
      message.success('已重新提交解析任务');
    }, 1000);
  };

  // 删除
  const handleDelete = (batch: ImportBatch) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 "${batch.fileName}" 吗？此操作不可恢复。`,
      okText: '删除',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  // 打开导入向导
  const openWizard = (type: 'cost' | 'price') => {
    setWizardType(type);
    setWizardOpen(true);
  };

  return (
    <GoldenPage
      header={{
        title: '数据采集',
        subtitle: '导入造价文件、材价文件，形成数据湖对象',
        breadcrumbs: [
          { title: '数据采集' },
          { title: '导入批次' },
        ],
        actions: [
          {
            key: 'import-cost',
            label: '导入造价文件',
            type: 'primary',
            icon: <UploadOutlined />,
            onClick: () => openWizard('cost'),
          },
          {
            key: 'import-price',
            label: '导入材价/综价',
            icon: <UploadOutlined />,
            onClick: () => openWizard('price'),
          },
        ],
      }}
      toolbar={{
        search: {
          placeholder: '搜索文件名...',
        },
        batchActions: [
          { key: 'delete', label: '批量删除', danger: true, icon: <DeleteOutlined /> },
        ],
        selectedCount: selectedRows.length,
        totalCount: mockBatches.length,
      }}
      showTreePanel={false}
    >
      <GridPanel
        columns={columns}
        dataSource={mockBatches}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (keys) => setSelectedRows(keys as string[]),
        }}
        onRowClick={handlePreview}
        pagination={{
          total: mockBatches.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无导入批次',
          action: (
            <Button type="primary" icon={<UploadOutlined />} onClick={() => openWizard('cost')}>
              导入造价文件
            </Button>
          ),
        }}
      />

      {/* 导入向导 Modal */}
      <ImportWizardModal
        open={wizardOpen}
        type={wizardType}
        onClose={() => setWizardOpen(false)}
      />
    </GoldenPage>
  );
}

// 导入向导 Modal
interface ImportWizardModalProps {
  open: boolean;
  type: 'cost' | 'price';
  onClose: () => void;
}

function ImportWizardModal({ open, type, onClose }: ImportWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const steps = [
    { title: '上传文件' },
    { title: '补录元数据' },
    { title: '完成' },
  ];

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setCurrentStep(2);
      message.success('文件已提交，正在解析中...');
      setTimeout(() => {
        onClose();
        setCurrentStep(0);
        setFileList([]);
        form.resetFields();
      }, 2000);
    } catch (error) {
      // validation failed
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="py-8">
            <Upload.Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              accept={type === 'cost' ? '.gzb,.gcb,.xml' : '.xlsx,.xls,.csv'}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                点击或拖拽文件到此区域上传
              </p>
              <p className="ant-upload-hint">
                {type === 'cost' 
                  ? '支持 .gzb, .gcb, .xml 格式的造价文件'
                  : '支持 .xlsx, .xls, .csv 格式的价格文件'
                }
              </p>
            </Upload.Dragger>
          </div>
        );
      case 1:
        return (
          <Form form={form} layout="vertical" className="py-4">
            {type === 'cost' ? (
              <>
                <Form.Item name="projectName" label="项目名称">
                  <Input placeholder="如：某医院门诊楼工程" />
                </Form.Item>
                <Form.Item name="projectOverview" label="项目概况">
                  <Input.TextArea placeholder="项目基本情况描述" rows={3} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item 
                  name="priceType" 
                  label="价格类型"
                  rules={[{ required: true, message: '请选择价格类型' }]}
                >
                  <Select
                    placeholder="选择价格类型"
                    options={[
                      { value: 'material', label: '材价' },
                      { value: 'composite', label: '综价' },
                    ]}
                  />
                </Form.Item>
                <Form.Item 
                  name="yearMonth" 
                  label="基准期"
                  rules={[{ required: true, message: '请选择基准期' }]}
                >
                  <DatePicker picker="month" className="w-full" />
                </Form.Item>
              </>
            )}
            <Form.Item 
              name="region" 
              label="地区"
              rules={[{ required: true, message: '请选择地区' }]}
            >
              <Select
                placeholder="选择地区"
                options={[
                  { value: '北京', label: '北京' },
                  { value: '上海', label: '上海' },
                  { value: '广州', label: '广州' },
                  { value: '深圳', label: '深圳' },
                ]}
              />
            </Form.Item>
          </Form>
        );
      case 2:
        return (
          <div className="py-12 text-center">
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            <div className="mt-4 text-lg font-medium">文件已提交</div>
            <div className="mt-2 text-gray-500">
              系统正在解析文件，完成后可在列表中查看
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={type === 'cost' ? '导入造价文件' : '导入材价/综价文件'}
      open={open}
      onCancel={onClose}
      width={600}
      footer={
        currentStep < 2 ? (
          <div className="flex justify-between">
            <Button onClick={onClose}>取消</Button>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
              {currentStep === 0 && (
                <Button type="primary" onClick={handleUpload}>
                  下一步
                </Button>
              )}
              {currentStep === 1 && (
                <Button type="primary" onClick={handleSubmit}>
                  提交
                </Button>
              )}
            </Space>
          </div>
        ) : null
      }
    >
      <Steps current={currentStep} items={steps} className="mb-6" />
      {renderStepContent()}
    </Modal>
  );
}
