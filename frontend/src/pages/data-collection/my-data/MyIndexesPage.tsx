import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Popconfirm,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  SendOutlined,
  ExportOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MyIndexRecord {
  id: string;
  projectName: string;
  unitProjectName?: string;
  indexLevel: 'project' | 'unit';
  functionTagName: string;
  scaleLevel?: string;
  scaleLevelName?: string;
  province?: string;
  unitCost: number;
  steelContent?: number;
  status: 'pending' | 'completed' | 'pushed';
  statusName: string;
  children?: MyIndexRecord[];
}

const mockData: MyIndexRecord[] = [
  {
    id: '1',
    projectName: 'XX医院门诊楼项目',
    indexLevel: 'project',
    functionTagName: '综合医院',
    scaleLevel: 'large',
    scaleLevelName: '大型',
    province: '北京市',
    unitCost: 3400,
    steelContent: 58.6,
    status: 'completed',
    statusName: '已补录',
    children: [
      {
        id: '1-1',
        projectName: 'XX医院门诊楼项目',
        unitProjectName: '门诊楼-土建',
        indexLevel: 'unit',
        functionTagName: '门诊楼',
        unitCost: 2850,
        steelContent: 62.3,
        status: 'completed',
        statusName: '已补录',
      },
      {
        id: '1-2',
        projectName: 'XX医院门诊楼项目',
        unitProjectName: '门诊楼-装饰',
        indexLevel: 'unit',
        functionTagName: '门诊楼',
        unitCost: 1200,
        status: 'pending',
        statusName: '待补录',
      },
      {
        id: '1-3',
        projectName: 'XX医院门诊楼项目',
        unitProjectName: '门诊楼-安装',
        indexLevel: 'unit',
        functionTagName: '门诊楼',
        unitCost: 1050,
        status: 'pending',
        statusName: '待补录',
      },
    ],
  },
  {
    id: '2',
    projectName: 'XX学校教学楼工程',
    indexLevel: 'project',
    functionTagName: '中学-教学楼',
    scaleLevel: 'medium',
    scaleLevelName: '中型',
    province: '上海市',
    unitCost: 2800,
    steelContent: 45.2,
    status: 'pushed',
    statusName: '已推送',
    children: [
      {
        id: '2-1',
        projectName: 'XX学校教学楼工程',
        unitProjectName: '教学楼-土建',
        indexLevel: 'unit',
        functionTagName: '教学楼',
        unitCost: 2100,
        steelContent: 48.5,
        status: 'pushed',
        statusName: '已推送',
      },
      {
        id: '2-2',
        projectName: 'XX学校教学楼工程',
        unitProjectName: '教学楼-装饰',
        indexLevel: 'unit',
        functionTagName: '教学楼',
        unitCost: 850,
        status: 'pushed',
        statusName: '已推送',
      },
    ],
  },
  {
    id: '3',
    projectName: 'XX办公楼项目',
    indexLevel: 'project',
    functionTagName: '商务办公',
    scaleLevel: 'large',
    scaleLevelName: '大型',
    province: '广州市',
    unitCost: 3100,
    steelContent: 52.8,
    status: 'pending',
    statusName: '待补录',
  },
];

const MyIndexesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data] = useState<MyIndexRecord[]>(mockData);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>(['1', '2']);

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'default',
      completed: 'success',
      pushed: 'purple',
    };
    return colorMap[status] || 'default';
  };

  // 统计数据
  const totalProjects = data.length;
  const totalIndexes = data.reduce((acc, item) => acc + 1 + (item.children?.length || 0), 0);
  const pendingCount = data.filter((d) => d.status === 'pending').length;
  const pushedCount = data.filter((d) => d.status === 'pushed').length;

  const columns: ColumnsType<MyIndexRecord> = [
    {
      title: '项目/单位工程',
      key: 'name',
      width: 300,
      render: (_, record) => (
        <span className={record.indexLevel === 'unit' ? 'pl-4' : 'font-medium'}>
          {record.unitProjectName || record.projectName}
        </span>
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'functionTagName',
      key: 'functionTagName',
      width: 90,
    },
    {
      title: '规模档',
      dataIndex: 'scaleLevelName',
      key: 'scaleLevelName',
      width: 70,
      render: (val) => val || '-',
    },
    {
      title: '地点',
      dataIndex: 'province',
      key: 'province',
      width: 70,
      render: (val) => val || '-',
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 90,
      align: 'right',
      render: (val) => `${val.toLocaleString()} 元/m²`,
    },
    {
      title: '钢筋含量',
      dataIndex: 'steelContent',
      key: 'steelContent',
      width: 80,
      align: 'right',
      render: (val) => (val ? `${val} kg/m²` : '-'),
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small" disabled={record.status === 'pushed'}>补录</Button>
          <Button type="link" size="small" disabled={record.status === 'pushed'}>推送</Button>
          {record.status !== 'pushed' && (
            <Button type="link" size="small" danger>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">我的指标</div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="项目数" value={totalProjects} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="指标条数" value={totalIndexes} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待补录" value={pendingCount} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已推送" value={pushedCount} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card size="small">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap>
            <Button icon={<SendOutlined />} disabled={selectedRowKeys.length === 0}>
              批量推送
            </Button>
            <Popconfirm
              title="确定要删除选中的指标吗？"
              disabled={selectedRowKeys.length === 0}
            >
              <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
            <Button icon={<ExportOutlined />}>导出Excel</Button>
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
              placeholder="状态"
              style={{ width: 100 }}
              allowClear
              options={[
                { value: 'pending', label: '待补录' },
                { value: 'completed', label: '已补录' },
                { value: 'pushed', label: '已推送' },
              ]}
            />
            <Select
              placeholder="功能标签"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: 'hospital', label: '医疗建筑' },
                { value: 'school', label: '教育建筑' },
                { value: 'office', label: '办公建筑' },
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as React.Key[]),
            expandIcon: ({ expanded, onExpand, record }) =>
              record.children ? (
                expanded ? (
                  <DownOutlined onClick={(e) => onExpand(record, e)} className="mr-2 cursor-pointer" />
                ) : (
                  <RightOutlined onClick={(e) => onExpand(record, e)} className="mr-2 cursor-pointer" />
                )
              ) : (
                <span className="mr-6" />
              ),
          }}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个项目`,
          }}
        />
      </Card>
    </div>
  );
};

export default MyIndexesPage;
