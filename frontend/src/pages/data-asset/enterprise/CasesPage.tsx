import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Statistic,
  DatePicker,
  Checkbox,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  BarChartOutlined,
  EyeOutlined,
  LinkOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

// 案例数据类型
interface CaseRecord {
  caseId: string;
  caseCode: string;
  caseName: string;
  projectName: string;
  projectLocation: string;
  functionCategory: string;
  functionTag: string;
  scaleLevel: string;
  buildingArea: number;
  totalCost: number;
  unitCost: number;
  pricingStage: string;
  pricingStageName: string;
  qualityLevel: string;
  dataCompleteness: number;
  status: string;
  statusName: string;
  publishTime: string;
}

// 模拟数据
const mockData: CaseRecord[] = [
  {
    caseId: 'EC202506001',
    caseCode: 'EC202506001',
    caseName: '深圳某办公楼项目',
    projectName: '深圳某办公楼项目',
    projectLocation: '广东省深圳市南山区',
    functionCategory: '公共建筑',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    buildingArea: 8500,
    totalCost: 35700000,
    unitCost: 4200,
    pricingStage: 'budget',
    pricingStageName: '预算',
    qualityLevel: 'A',
    dataCompleteness: 92,
    status: 'active',
    statusName: '启用',
    publishTime: '2025-06-15',
  },
  {
    caseId: 'EC202508002',
    caseCode: 'EC202508002',
    caseName: '东莞某商业综合体',
    projectName: '东莞某商业综合体',
    projectLocation: '广东省东莞市',
    functionCategory: '公共建筑',
    functionTag: '商业建筑-购物中心',
    scaleLevel: '10000-20000㎡',
    buildingArea: 15200,
    totalCost: 77520000,
    unitCost: 5100,
    pricingStage: 'settlement',
    pricingStageName: '结算',
    qualityLevel: 'B',
    dataCompleteness: 85,
    status: 'active',
    statusName: '启用',
    publishTime: '2025-08-22',
  },
  {
    caseId: 'EC202511003',
    caseCode: 'EC202511003',
    caseName: '珠海某学校教学楼',
    projectName: '珠海某学校教学楼',
    projectLocation: '广东省珠海市',
    functionCategory: '公共建筑',
    functionTag: '教育建筑-教学建筑',
    scaleLevel: '3000-5000㎡',
    buildingArea: 4800,
    totalCost: 17520000,
    unitCost: 3650,
    pricingStage: 'budget',
    pricingStageName: '预算',
    qualityLevel: 'A',
    dataCompleteness: 95,
    status: 'active',
    statusName: '启用',
    publishTime: '2025-11-10',
  },
  {
    caseId: 'EC202512004',
    caseCode: 'EC202512004',
    caseName: '广州某医院门诊楼',
    projectName: '广州某医院门诊楼',
    projectLocation: '广东省广州市天河区',
    functionCategory: '公共建筑',
    functionTag: '医疗建筑-综合医院',
    scaleLevel: '10000-20000㎡',
    buildingArea: 12000,
    totalCost: 66000000,
    unitCost: 5500,
    pricingStage: 'settlement',
    pricingStageName: '结算',
    qualityLevel: 'A',
    dataCompleteness: 90,
    status: 'active',
    statusName: '启用',
    publishTime: '2025-12-05',
  },
  {
    caseId: 'EC202601005',
    caseCode: 'EC202601005',
    caseName: '佛山某住宅小区',
    projectName: '佛山某住宅小区',
    projectLocation: '广东省佛山市顺德区',
    functionCategory: '居住建筑',
    functionTag: '住宅-高层住宅',
    scaleLevel: '20000-50000㎡',
    buildingArea: 35000,
    totalCost: 105000000,
    unitCost: 3000,
    pricingStage: 'budget',
    pricingStageName: '预算',
    qualityLevel: 'B',
    dataCompleteness: 82,
    status: 'active',
    statusName: '启用',
    publishTime: '2026-01-08',
  },
];

const EnterpriseCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data] = useState<CaseRecord[]>(mockData);
  const [searchText, setSearchText] = useState('');
  const [filterExpanded, setFilterExpanded] = useState(true);

  // 质量等级颜色
  const getQualityColor = (level: string) => {
    const colorMap: Record<string, string> = {
      A: 'green',
      B: 'blue',
      C: 'orange',
      D: 'red',
    };
    return colorMap[level] || 'default';
  };

  // 状态颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      expired: 'warning',
    };
    return colorMap[status] || 'default';
  };

  // 统计数据
  const stats = {
    total: data.length,
    monthNew: 2,
    aLevel: data.filter((d) => d.qualityLevel === 'A').length,
    avgUnitCost: Math.round(data.reduce((sum, d) => sum + d.unitCost, 0) / data.length),
    functionCoverage: '89/239',
  };

  // 查看详情
  const handleViewDetail = (record: CaseRecord) => {
    navigate(`/data-asset/enterprise/cases/${record.caseId}`);
  };

  // 对比分析
  const handleCompare = () => {
    if (selectedRowKeys.length < 2) {
      return;
    }
    navigate(`/data-asset/enterprise/cases/compare?ids=${selectedRowKeys.join(',')}`);
  };

  // 表格列定义
  const columns: ColumnsType<CaseRecord> = [
    {
      title: '案例名称',
      dataIndex: 'caseName',
      key: 'caseName',
      width: 250,
      ellipsis: true,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.caseName}</div>
          <div className="text-xs text-gray-400">
            {record.projectLocation} | {record.pricingStageName}
          </div>
        </div>
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'functionTag',
      key: 'functionTag',
      width: 140,
      ellipsis: true,
    },
    {
      title: '规模档',
      dataIndex: 'scaleLevel',
      key: 'scaleLevel',
      width: 110,
      render: (_, record) => (
        <div>
          <div>{record.scaleLevel}</div>
          <div className="text-xs text-gray-400">{record.buildingArea.toLocaleString()}㎡</div>
        </div>
      ),
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (val, record) => (
        <div>
          <div className="font-medium">¥{val.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{record.qualityLevel}级</div>
        </div>
      ),
    },
    {
      title: '质量',
      dataIndex: 'qualityLevel',
      key: 'qualityLevel',
      width: 70,
      align: 'center',
      render: (val, record) => (
        <Tooltip title={`完整度: ${record.dataCompleteness}%`}>
          <Tag color={getQualityColor(val)}>{val}级</Tag>
        </Tooltip>
      ),
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
      title: '入库时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small">
            引用
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">企业案例库</div>

      {/* 筛选区 */}
      <Card
        size="small"
        title={
          <Space>
            <FilterOutlined />
            <span>筛选条件</span>
          </Space>
        }
        extra={
          <Space>
            <Button size="small" icon={<ReloadOutlined />}>
              重置
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              {filterExpanded ? '收起' : '展开'}
            </Button>
          </Space>
        }
      >
        {filterExpanded && (
          <div className="space-y-4">
            <Row gutter={16}>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">功能标签</div>
                <Select
                  placeholder="选择功能标签"
                  style={{ width: '100%' }}
                  allowClear
                  options={[
                    { value: 'office', label: '办公建筑' },
                    { value: 'commercial', label: '商业建筑' },
                    { value: 'education', label: '教育建筑' },
                    { value: 'medical', label: '医疗建筑' },
                    { value: 'residential', label: '住宅' },
                  ]}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">规模档</div>
                <Select
                  placeholder="选择规模档"
                  style={{ width: '100%' }}
                  allowClear
                  options={[
                    { value: '1', label: '< 1000㎡' },
                    { value: '2', label: '1000-3000㎡' },
                    { value: '3', label: '3000-5000㎡' },
                    { value: '4', label: '5000-10000㎡' },
                    { value: '5', label: '10000-20000㎡' },
                    { value: '6', label: '20000-50000㎡' },
                    { value: '7', label: '> 50000㎡' },
                  ]}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">省份</div>
                <Select
                  placeholder="选择省份"
                  style={{ width: '100%' }}
                  allowClear
                  options={[
                    { value: '440000', label: '广东省' },
                    { value: '310000', label: '上海市' },
                    { value: '110000', label: '北京市' },
                  ]}
                />
              </Col>
              <Col span={6}>
                <div className="text-xs text-gray-500 mb-1">城市</div>
                <Select
                  placeholder="选择城市"
                  style={{ width: '100%' }}
                  allowClear
                  options={[
                    { value: '440300', label: '深圳市' },
                    { value: '440100', label: '广州市' },
                    { value: '441900', label: '东莞市' },
                    { value: '440400', label: '珠海市' },
                    { value: '440600', label: '佛山市' },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <div className="text-xs text-gray-500 mb-1">计价阶段</div>
                <Checkbox.Group
                  options={[
                    { label: '概算', value: 'estimate' },
                    { label: '预算', value: 'budget' },
                    { label: '结算', value: 'settlement' },
                    { label: '决算', value: 'final' },
                  ]}
                  defaultValue={['budget', 'settlement']}
                />
              </Col>
              <Col span={8}>
                <div className="text-xs text-gray-500 mb-1">入库时间</div>
                <RangePicker style={{ width: '100%' }} />
              </Col>
              <Col span={8}>
                <div className="text-xs text-gray-500 mb-1">质量等级</div>
                <Checkbox.Group
                  options={[
                    { label: 'A级', value: 'A' },
                    { label: 'B级', value: 'B' },
                    { label: 'C级', value: 'C' },
                    { label: 'D级', value: 'D' },
                  ]}
                  defaultValue={['A', 'B']}
                />
              </Col>
            </Row>
            <Row justify="end">
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<BarChartOutlined />}>统计</Button>
                <Button icon={<ExportOutlined />}>导出</Button>
              </Space>
            </Row>
          </div>
        )}
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="案例总数" value={stats.total} suffix="个" />
          </Col>
          <Col span={5}>
            <Statistic
              title="本月新增"
              value={stats.monthNew}
              suffix="个"
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="A级案例"
              value={stats.aLevel}
              suffix={`个 (${((stats.aLevel / stats.total) * 100).toFixed(1)}%)`}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="平均单方"
              value={stats.avgUnitCost}
              prefix="¥"
              suffix="元/㎡"
            />
          </Col>
          <Col span={5}>
            <Statistic title="功能覆盖" value={stats.functionCoverage} suffix="(37.2%)" />
          </Col>
        </Row>
      </Card>

      {/* 操作栏 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Input
              placeholder="搜索案例名称、项目名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
          </Space>
          <Space>
            <span className="text-gray-500">已选 {selectedRowKeys.length} 项</span>
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              disabled={selectedRowKeys.length < 2}
              onClick={handleCompare}
            >
              对比分析
            </Button>
          </Space>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          rowKey="caseId"
          columns={columns}
          dataSource={data}
          scroll={{ x: 1100 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: () => ({
              disabled: selectedRowKeys.length >= 5 && !selectedRowKeys.includes(''),
            }),
          }}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleViewDetail(record),
          })}
        />
      </Card>
    </div>
  );
};

export default EnterpriseCasesPage;
