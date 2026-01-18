import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Dropdown,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  SettingOutlined,
  EditOutlined,
  SendOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

// 导入弹窗组件
import CollectModal from './components/CollectModal';
import ViewCostFileModal from './components/ViewCostFileModal';
import AnalyzeModal from './components/AnalyzeModal';
import SupplementModal from './components/SupplementModal';
import PushModal from './components/PushModal';

// 类型定义
interface CostFileRecord {
  id: string;
  projectName: string;
  fileName: string;
  source: 'upload' | 'qc' | 'pricing' | 'estimation';
  sourceName: string;
  status: 'pending' | 'analyzed' | 'completed' | 'pushed';
  statusName: string;
  province: string;
  city: string;
  pricingStage: string;
  pricingStageName: string;
  createdAt: string;
}

// Mock数据
const mockData: CostFileRecord[] = [
  {
    id: '1',
    projectName: 'XX医院门诊楼项目',
    fileName: 'XX医院项目.gbq',
    source: 'upload',
    sourceName: '直接上传',
    status: 'analyzed',
    statusName: '已分析',
    province: '北京市',
    city: '海淀区',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    createdAt: '2026-01-18 10:30:00',
  },
  {
    id: '2',
    projectName: 'XX学校教学楼工程',
    fileName: 'XX学校工程.gcfx',
    source: 'qc',
    sourceName: '质控模块',
    status: 'completed',
    statusName: '已补录',
    province: '上海市',
    city: '浦东新区',
    pricingStage: 'settlement',
    pricingStageName: '结算',
    createdAt: '2026-01-17 14:20:00',
  },
  {
    id: '3',
    projectName: 'XX办公楼项目',
    fileName: 'XX办公楼.gbq',
    source: 'pricing',
    sourceName: '计价模块',
    status: 'pending',
    statusName: '待分析',
    province: '广州市',
    city: '天河区',
    pricingStage: 'bidQuote',
    pricingStageName: '投标报价',
    createdAt: '2026-01-16 09:15:00',
  },
  {
    id: '4',
    projectName: 'XX住宅小区一期',
    fileName: 'XX住宅一期.gbq',
    source: 'upload',
    sourceName: '直接上传',
    status: 'pushed',
    statusName: '已推送',
    province: '深圳市',
    city: '南山区',
    pricingStage: 'bidControl',
    pricingStageName: '招标控制价',
    createdAt: '2026-01-15 16:45:00',
  },
  {
    id: '5',
    projectName: 'XX商业综合体',
    fileName: 'XX商业综合体.cjz',
    source: 'estimation',
    sourceName: '估算模块',
    status: 'analyzed',
    statusName: '已分析',
    province: '杭州市',
    city: '西湖区',
    pricingStage: 'estimate',
    pricingStageName: '概算',
    createdAt: '2026-01-14 11:30:00',
  },
];

const CostFilesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, _setLoading] = useState(false);
  const [data, setData] = useState<CostFileRecord[]>(mockData);

  // 弹窗状态
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [supplementModalOpen, setSupplementModalOpen] = useState(false);
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CostFileRecord | null>(null);

  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();
  const [stageFilter, setStageFilter] = useState<string | undefined>();

  // 状态标签颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'default',
      analyzed: 'processing',
      completed: 'success',
      pushed: 'purple',
    };
    return colorMap[status] || 'default';
  };

  // 来源标签颜色
  const getSourceColor = (source: string) => {
    const colorMap: Record<string, string> = {
      upload: 'blue',
      qc: 'green',
      pricing: 'orange',
      estimation: 'cyan',
    };
    return colorMap[source] || 'default';
  };

  // 操作按钮是否可用
  const canAnalyze = (status: string) => status !== 'pushed';
  const canSupplement = (status: string) => status === 'analyzed' || status === 'completed';
  const canPush = (status: string) => status === 'completed';

  // 操作菜单
  const getActionMenuItems = (record: CostFileRecord): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看',
      onClick: () => handleView(record),
    },
    {
      key: 'analyze',
      icon: <SettingOutlined />,
      label: '分析',
      disabled: !canAnalyze(record.status),
      onClick: () => handleAnalyze(record),
    },
    {
      key: 'supplement',
      icon: <EditOutlined />,
      label: '补录',
      disabled: !canSupplement(record.status),
      onClick: () => handleSupplement(record),
    },
    {
      key: 'push',
      icon: <SendOutlined />,
      label: '推送',
      disabled: !canPush(record.status),
      onClick: () => handlePush(record),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

  // 操作处理函数
  const handleView = (record: CostFileRecord) => {
    setCurrentRecord(record);
    setViewModalOpen(true);
  };

  const handleAnalyze = (record: CostFileRecord) => {
    setCurrentRecord(record);
    setAnalyzeModalOpen(true);
  };

  const handleSupplement = (record: CostFileRecord) => {
    setCurrentRecord(record);
    setSupplementModalOpen(true);
  };

  const handlePush = (record: CostFileRecord) => {
    setCurrentRecord(record);
    setPushModalOpen(true);
  };

  const handleDelete = (record: CostFileRecord) => {
    setData(data.filter((item) => item.id !== record.id));
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('批量删除成功');
  };

  // 表格列定义
  const columns: ColumnsType<CostFileRecord> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 300,
      ellipsis: true,
    },
    {
      title: '采集时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: '采集来源',
      dataIndex: 'sourceName',
      key: 'sourceName',
      width: 70,
      render: (_, record) => (
        <Tag color={getSourceColor(record.source)}>{record.sourceName}</Tag>
      ),
    },
    {
      title: '地点',
      key: 'location',
      width: 70,
      render: (_, record) => `${record.province}`,
    },
    {
      title: '计价阶段',
      dataIndex: 'pricingStageName',
      key: 'pricingStageName',
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 70,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>{record.statusName}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          <Button type="link" size="small" disabled={!canAnalyze(record.status)} onClick={() => handleAnalyze(record)}>分析</Button>
          <Button type="link" size="small" disabled={!canSupplement(record.status)} onClick={() => handleSupplement(record)}>补录</Button>
          <Button type="link" size="small" disabled={!canPush(record.status)} onClick={() => handlePush(record)}>推送</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="text-lg font-medium">造价文件采集</div>

      {/* 操作栏 */}
      <Card size="small">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCollectModalOpen(true)}
            >
              采集文件
            </Button>
            <Popconfirm
              title="确定要删除选中的文件吗？"
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
          </Space>

          <Space wrap>
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="采集来源"
              value={sourceFilter}
              onChange={setSourceFilter}
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'upload', label: '直接上传' },
                { value: 'qc', label: '质控模块' },
                { value: 'pricing', label: '计价模块' },
                { value: 'estimation', label: '估算模块' },
              ]}
            />
            <Select
              placeholder="计价阶段"
              value={stageFilter}
              onChange={setStageFilter}
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'estimate', label: '概算' },
                { value: 'budget', label: '预算' },
                { value: 'bidControl', label: '招标控制价' },
                { value: 'bidQuote', label: '投标报价' },
                { value: 'settlement', label: '结算' },
              ]}
            />
          </Space>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 900 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 弹窗组件 */}
      <CollectModal
        open={collectModalOpen}
        onCancel={() => setCollectModalOpen(false)}
        onSuccess={() => {
          setCollectModalOpen(false);
          message.success('采集成功');
        }}
      />

      <ViewCostFileModal
        open={viewModalOpen}
        record={currentRecord}
        onCancel={() => setViewModalOpen(false)}
      />

      <AnalyzeModal
        open={analyzeModalOpen}
        record={currentRecord}
        onCancel={() => setAnalyzeModalOpen(false)}
        onSuccess={() => {
          setAnalyzeModalOpen(false);
          message.success('分析完成');
        }}
      />

      <SupplementModal
        open={supplementModalOpen}
        record={currentRecord}
        onCancel={() => setSupplementModalOpen(false)}
        onSuccess={() => {
          setSupplementModalOpen(false);
          message.success('保存成功');
        }}
      />

      <PushModal
        open={pushModalOpen}
        record={currentRecord}
        onCancel={() => setPushModalOpen(false)}
        onSuccess={() => {
          setPushModalOpen(false);
          message.success('推送成功');
        }}
      />
    </div>
  );
};

export default CostFilesPage;
