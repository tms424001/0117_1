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
  Radio,
  Avatar,
  List,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  TeamOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// 会员单位数据类型
interface MemberUnit {
  id: string;
  unitName: string;
  unitCode: string;
  unitType: string;
  memberLevel: string;
  provinceName: string;
  cityName: string;
  caseCount: number;
  indexCount: number;
  materialCount: number;
  dataQuality: number;
  joinDate: string;
  lastUpdateDate: string;
  isCollected: boolean;
}

// 会员共享案例数据类型
interface SharedCase {
  id: string;
  caseName: string;
  functionTag: string;
  scaleLevel: string;
  buildingArea: number;
  unitCost: number;
  pricingStage: string;
  provinceName: string;
  cityName: string;
  publishDate: string;
  sourceUnit: string;
  qualityLevel: string;
  viewCount: number;
}

// 模拟会员单位数据
const mockMemberUnits: MemberUnit[] = [
  {
    id: 'MU001',
    unitName: '深圳市建筑工程造价咨询有限公司',
    unitCode: 'SZZJ001',
    unitType: '造价咨询',
    memberLevel: '钻石会员',
    provinceName: '广东省',
    cityName: '深圳市',
    caseCount: 1256,
    indexCount: 8500,
    materialCount: 15600,
    dataQuality: 92,
    joinDate: '2020-03-15',
    lastUpdateDate: '2024-06-10',
    isCollected: true,
  },
  {
    id: 'MU002',
    unitName: '广州华南工程咨询有限公司',
    unitCode: 'GZHN002',
    unitType: '造价咨询',
    memberLevel: '金牌会员',
    provinceName: '广东省',
    cityName: '广州市',
    caseCount: 986,
    indexCount: 6200,
    materialCount: 12800,
    dataQuality: 88,
    joinDate: '2021-05-20',
    lastUpdateDate: '2024-06-08',
    isCollected: false,
  },
  {
    id: 'MU003',
    unitName: '东莞市建设工程造价管理站',
    unitCode: 'DGJZ003',
    unitType: '政府机构',
    memberLevel: '钻石会员',
    provinceName: '广东省',
    cityName: '东莞市',
    caseCount: 2150,
    indexCount: 12000,
    materialCount: 8500,
    dataQuality: 95,
    joinDate: '2019-08-10',
    lastUpdateDate: '2024-06-12',
    isCollected: true,
  },
  {
    id: 'MU004',
    unitName: '佛山市建筑设计研究院',
    unitCode: 'FSSJ004',
    unitType: '设计院',
    memberLevel: '银牌会员',
    provinceName: '广东省',
    cityName: '佛山市',
    caseCount: 456,
    indexCount: 3200,
    materialCount: 5600,
    dataQuality: 85,
    joinDate: '2022-01-15',
    lastUpdateDate: '2024-05-28',
    isCollected: false,
  },
  {
    id: 'MU005',
    unitName: '珠海市工程咨询公司',
    unitCode: 'ZHGC005',
    unitType: '造价咨询',
    memberLevel: '金牌会员',
    provinceName: '广东省',
    cityName: '珠海市',
    caseCount: 678,
    indexCount: 4500,
    materialCount: 9200,
    dataQuality: 90,
    joinDate: '2021-09-08',
    lastUpdateDate: '2024-06-05',
    isCollected: false,
  },
];

// 模拟共享案例数据
const mockSharedCases: SharedCase[] = [
  {
    id: 'SC001',
    caseName: '某市级办公楼项目',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    buildingArea: 8500,
    unitCost: 4250,
    pricingStage: 'settlement',
    provinceName: '广东省',
    cityName: '深圳市',
    publishDate: '2024-06-10',
    sourceUnit: '深圳市建筑工程造价咨询有限公司',
    qualityLevel: 'A',
    viewCount: 256,
  },
  {
    id: 'SC002',
    caseName: '某三甲医院门诊楼',
    functionTag: '医疗卫生-门诊',
    scaleLevel: '10000-20000㎡',
    buildingArea: 18500,
    unitCost: 5680,
    pricingStage: 'settlement',
    provinceName: '广东省',
    cityName: '广州市',
    publishDate: '2024-06-08',
    sourceUnit: '广州华南工程咨询有限公司',
    qualityLevel: 'A',
    viewCount: 389,
  },
  {
    id: 'SC003',
    caseName: '某区中学教学楼',
    functionTag: '教育-教学楼',
    scaleLevel: '5000-10000㎡',
    buildingArea: 6800,
    unitCost: 3250,
    pricingStage: 'settlement',
    provinceName: '广东省',
    cityName: '东莞市',
    publishDate: '2024-06-05',
    sourceUnit: '东莞市建设工程造价管理站',
    qualityLevel: 'A',
    viewCount: 198,
  },
  {
    id: 'SC004',
    caseName: '某商业综合体',
    functionTag: '商业-商场',
    scaleLevel: '50000-80000㎡',
    buildingArea: 65000,
    unitCost: 4850,
    pricingStage: 'budget',
    provinceName: '广东省',
    cityName: '佛山市',
    publishDate: '2024-05-28',
    sourceUnit: '佛山市建筑设计研究院',
    qualityLevel: 'B',
    viewCount: 312,
  },
];

const MemberDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'units' | 'cases'>('units');
  const [collectedUnits, setCollectedUnits] = useState<string[]>(['MU001', 'MU003']);

  // 切换收藏
  const toggleCollect = (id: string) => {
    if (collectedUnits.includes(id)) {
      setCollectedUnits(collectedUnits.filter(i => i !== id));
    } else {
      setCollectedUnits([...collectedUnits, id]);
    }
  };

  // 获取会员等级标签
  const getMemberLevelTag = (level: string) => {
    const levelMap: Record<string, { color: string }> = {
      '钻石会员': { color: 'purple' },
      '金牌会员': { color: 'gold' },
      '银牌会员': { color: 'default' },
      '普通会员': { color: 'blue' },
    };
    return <Tag color={levelMap[level]?.color || 'default'}>{level}</Tag>;
  };

  // 获取单位类型标签
  const getUnitTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string }> = {
      '造价咨询': { color: 'blue' },
      '政府机构': { color: 'green' },
      '设计院': { color: 'orange' },
      '施工企业': { color: 'cyan' },
    };
    return <Tag color={typeMap[type]?.color || 'default'}>{type}</Tag>;
  };

  // 会员单位列定义
  const unitColumns: ColumnsType<MemberUnit> = [
    {
      title: '会员单位',
      key: 'unit',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<BankOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div className="font-medium">{record.unitName}</div>
            <div className="text-xs text-gray-400">
              {getUnitTypeTag(record.unitType)}
              <span className="ml-2">{record.cityName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '会员等级',
      dataIndex: 'memberLevel',
      key: 'memberLevel',
      width: 100,
      render: (level) => getMemberLevelTag(level),
    },
    {
      title: '案例数',
      dataIndex: 'caseCount',
      key: 'caseCount',
      width: 80,
      align: 'center',
      render: (v) => <span className="font-medium text-blue-600">{v.toLocaleString()}</span>,
    },
    {
      title: '指标数',
      dataIndex: 'indexCount',
      key: 'indexCount',
      width: 80,
      align: 'center',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '材价数',
      dataIndex: 'materialCount',
      key: 'materialCount',
      width: 80,
      align: 'center',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '数据质量',
      dataIndex: 'dataQuality',
      key: 'dataQuality',
      width: 120,
      render: (v) => (
        <Progress
          percent={v}
          size="small"
          strokeColor={v >= 90 ? '#52c41a' : v >= 80 ? '#1890ff' : '#faad14'}
        />
      ),
    },
    {
      title: '最近更新',
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/data-asset/marketplace/member-data/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="text"
            size="small"
            icon={collectedUnits.includes(record.id) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
            onClick={() => toggleCollect(record.id)}
          />
        </Space>
      ),
    },
  ];

  // 共享案例列定义
  const caseColumns: ColumnsType<SharedCase> = [
    {
      title: '案例名称',
      key: 'case',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.caseName}</div>
          <div className="text-xs text-gray-400">{record.functionTag}</div>
        </div>
      ),
    },
    {
      title: '来源单位',
      dataIndex: 'sourceUnit',
      key: 'sourceUnit',
      width: 180,
      ellipsis: true,
    },
    {
      title: '规模',
      key: 'scale',
      width: 100,
      render: (_, record) => (
        <div>
          <div>{record.buildingArea.toLocaleString()}㎡</div>
          <div className="text-xs text-gray-400">{record.scaleLevel}</div>
        </div>
      ),
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (v) => <span className="font-medium text-blue-600">¥{v.toLocaleString()}</span>,
    },
    {
      title: '地区',
      dataIndex: 'cityName',
      key: 'city',
      width: 80,
    },
    {
      title: '质量',
      dataIndex: 'qualityLevel',
      key: 'quality',
      width: 60,
      align: 'center',
      render: (v) => <Tag color="green">{v}级</Tag>,
    },
    {
      title: '浏览',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 60,
      align: 'center',
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" size="small" icon={<SwapOutlined />}>对比</Button>
        </Space>
      ),
    },
  ];

  // 渲染会员单位视图
  const renderUnitsView = () => (
    <div className="space-y-4">
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              placeholder="会员等级"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '钻石会员', value: 'diamond' },
                { label: '金牌会员', value: 'gold' },
                { label: '银牌会员', value: 'silver' },
                { label: '普通会员', value: 'normal' },
              ]}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="单位类型"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '造价咨询', value: 'consulting' },
                { label: '政府机构', value: 'government' },
                { label: '设计院', value: 'design' },
                { label: '施工企业', value: 'construction' },
              ]}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="地区"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '深圳市', value: 'shenzhen' },
                { label: '广州市', value: 'guangzhou' },
                { label: '东莞市', value: 'dongguan' },
                { label: '佛山市', value: 'foshan' },
              ]}
            />
          </Col>
          <Col span={6}>
            <Search placeholder="搜索单位名称" allowClear />
          </Col>
        </Row>
      </Card>

      <Table
        rowKey="id"
        columns={unitColumns}
        dataSource={mockMemberUnits}
        pagination={{
          total: 156,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 家会员单位`,
        }}
        size="small"
      />
    </div>
  );

  // 渲染共享案例视图
  const renderCasesView = () => (
    <div className="space-y-4">
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={5}>
            <Select
              placeholder="功能标签"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '办公建筑', value: 'office' },
                { label: '医疗卫生', value: 'medical' },
                { label: '教育', value: 'education' },
                { label: '商业', value: 'commercial' },
              ]}
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="规模档"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '5000-10000㎡', value: 'M' },
                { label: '10000-20000㎡', value: 'L' },
                { label: '20000-50000㎡', value: 'XL' },
              ]}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="地区"
              style={{ width: '100%' }}
              allowClear
              options={[
                { label: '深圳市', value: 'shenzhen' },
                { label: '广州市', value: 'guangzhou' },
                { label: '东莞市', value: 'dongguan' },
              ]}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="来源单位"
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Search placeholder="搜索案例名称" allowClear />
          </Col>
        </Row>
      </Card>

      <Table
        rowKey="id"
        columns={caseColumns}
        dataSource={mockSharedCases}
        pagination={{
          total: 3856,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条共享案例`,
        }}
        size="small"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">会员单位数据</span>
          <Space>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="会员单位"
              value={156}
              suffix="家"
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="共享案例"
              value={3856}
              suffix="条"
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="共享指标"
              value={28500}
              suffix="条"
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="共享材价"
              value={45600}
              suffix="条"
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="本月新增"
              value={128}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={4}>
            <div className="text-center">
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div className="text-xs text-gray-400 mt-1">数据已审核</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 视图切换 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="units">
              <BankOutlined className="mr-1" />
              会员单位
            </Radio.Button>
            <Radio.Button value="cases">
              <TeamOutlined className="mr-1" />
              共享案例
            </Radio.Button>
          </Radio.Group>
          <span className="text-gray-400">
            {viewMode === 'units' ? '156 家会员单位' : '3,856 条共享案例'}
          </span>
        </div>
      </Card>

      {/* 内容区 */}
      {viewMode === 'units' && renderUnitsView()}
      {viewMode === 'cases' && renderCasesView()}
    </div>
  );
};

export default MemberDataPage;
