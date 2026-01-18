import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Table,
  Statistic,
  Tabs,
  Avatar,
  Progress,
} from 'antd';
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  DownloadOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

// 会员单位详情数据
const mockUnitDetail = {
  id: 'MU001',
  unitName: '深圳市建筑工程造价咨询有限公司',
  unitCode: 'SZZJ001',
  unitType: '造价咨询',
  memberLevel: '钻石会员',
  provinceName: '广东省',
  cityName: '深圳市',
  address: '深圳市福田区深南大道1001号',
  contactPerson: '张经理',
  contactPhone: '0755-8888****',
  email: 'contact@szzj.com',
  website: 'www.szzj.com',
  introduction: '深圳市建筑工程造价咨询有限公司成立于2005年，是一家专业从事工程造价咨询、招标代理、工程监理等业务的综合性咨询企业。',
  caseCount: 1256,
  indexCount: 8500,
  materialCount: 15600,
  dataQuality: 92,
  joinDate: '2020-03-15',
  lastUpdateDate: '2024-06-10',
  certifications: ['甲级造价咨询资质', 'ISO9001认证', '高新技术企业'],
};

// 共享案例数据
const mockSharedCases = [
  { id: 'SC001', caseName: '某市级办公楼项目', functionTag: '办公建筑-甲级办公', buildingArea: 8500, unitCost: 4250, pricingStage: 'settlement', publishDate: '2024-06-10', qualityLevel: 'A', viewCount: 256 },
  { id: 'SC002', caseName: '某科技园研发楼', functionTag: '办公建筑-产业园办公', buildingArea: 22000, unitCost: 3980, pricingStage: 'settlement', publishDate: '2024-05-28', qualityLevel: 'A', viewCount: 189 },
  { id: 'SC003', caseName: '某商业综合体', functionTag: '商业-商场', buildingArea: 45000, unitCost: 4650, pricingStage: 'budget', publishDate: '2024-05-15', qualityLevel: 'B', viewCount: 312 },
  { id: 'SC004', caseName: '某住宅小区', functionTag: '居住-住宅', buildingArea: 68000, unitCost: 2850, pricingStage: 'settlement', publishDate: '2024-04-20', qualityLevel: 'A', viewCount: 425 },
  { id: 'SC005', caseName: '某学校教学楼', functionTag: '教育-教学楼', buildingArea: 12000, unitCost: 3450, pricingStage: 'settlement', publishDate: '2024-04-10', qualityLevel: 'A', viewCount: 198 },
];

// 共享指标数据
const mockSharedIndexes = [
  { id: 'SI001', indexName: '综合单方造价', functionTag: '办公建筑', scaleLevel: '5000-10000㎡', avgValue: 4120, sampleCount: 28, updateDate: '2024-06' },
  { id: 'SI002', indexName: '土建单方造价', functionTag: '办公建筑', scaleLevel: '5000-10000㎡', avgValue: 2472, sampleCount: 28, updateDate: '2024-06' },
  { id: 'SI003', indexName: '钢筋含量', functionTag: '办公建筑', scaleLevel: '5000-10000㎡', avgValue: 58.5, sampleCount: 25, updateDate: '2024-06' },
  { id: 'SI004', indexName: '混凝土含量', functionTag: '办公建筑', scaleLevel: '5000-10000㎡', avgValue: 0.42, sampleCount: 25, updateDate: '2024-06' },
  { id: 'SI005', indexName: '综合单方造价', functionTag: '医疗卫生', scaleLevel: '10000-20000㎡', avgValue: 5680, sampleCount: 15, updateDate: '2024-06' },
];

// 共享材价数据
const mockSharedMaterials = [
  { id: 'SM001', materialName: '商品混凝土C30', specification: 'C30，塌落度120-160mm', unit: 'm³', avgPrice: 485, sampleCount: 156, updateDate: '2024-06' },
  { id: 'SM002', materialName: '热轧带肋钢筋', specification: 'HRB400，Φ12', unit: 't', avgPrice: 3850, sampleCount: 142, updateDate: '2024-06' },
  { id: 'SM003', materialName: '普通硅酸盐水泥', specification: 'P.O 42.5', unit: 't', avgPrice: 450, sampleCount: 128, updateDate: '2024-06' },
  { id: 'SM004', materialName: '中砂', specification: '细度模数2.3-3.0', unit: 'm³', avgPrice: 125, sampleCount: 135, updateDate: '2024-06' },
  { id: 'SM005', materialName: '碎石', specification: '5-25mm连续级配', unit: 'm³', avgPrice: 98, sampleCount: 130, updateDate: '2024-06' },
];

const MemberDataDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const [isCollected, setIsCollected] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const detail = mockUnitDetail;

  // 获取会员等级标签
  const getMemberLevelTag = (level: string) => {
    const levelMap: Record<string, { color: string }> = {
      '钻石会员': { color: 'purple' },
      '金牌会员': { color: 'gold' },
      '银牌会员': { color: 'default' },
    };
    return <Tag color={levelMap[level]?.color || 'default'}>{level}</Tag>;
  };

  // 案例列定义
  const caseColumns: ColumnsType<typeof mockSharedCases[0]> = [
    { title: '案例名称', dataIndex: 'caseName', key: 'caseName', width: 180 },
    { title: '功能标签', dataIndex: 'functionTag', key: 'functionTag', width: 150, render: (v) => <Tag color="cyan">{v}</Tag> },
    { title: '建筑面积', dataIndex: 'buildingArea', key: 'buildingArea', width: 100, align: 'right', render: (v) => `${v.toLocaleString()}㎡` },
    { title: '单方造价', dataIndex: 'unitCost', key: 'unitCost', width: 100, align: 'right', render: (v) => <span className="text-blue-600">¥{v.toLocaleString()}</span> },
    { title: '质量', dataIndex: 'qualityLevel', key: 'quality', width: 60, align: 'center', render: (v) => <Tag color="green">{v}级</Tag> },
    { title: '浏览', dataIndex: 'viewCount', key: 'viewCount', width: 60, align: 'center' },
    { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: 100 },
  ];

  // 指标列定义
  const indexColumns: ColumnsType<typeof mockSharedIndexes[0]> = [
    { title: '指标名称', dataIndex: 'indexName', key: 'indexName', width: 140 },
    { title: '功能标签', dataIndex: 'functionTag', key: 'functionTag', width: 100, render: (v) => <Tag color="cyan">{v}</Tag> },
    { title: '规模档', dataIndex: 'scaleLevel', key: 'scaleLevel', width: 120 },
    { title: '均值', dataIndex: 'avgValue', key: 'avgValue', width: 100, align: 'right', render: (v) => <span className="font-medium">{v}</span> },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
    { title: '更新期', dataIndex: 'updateDate', key: 'updateDate', width: 80 },
  ];

  // 材价列定义
  const materialColumns: ColumnsType<typeof mockSharedMaterials[0]> = [
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 180 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60, align: 'center' },
    { title: '均价', dataIndex: 'avgPrice', key: 'avgPrice', width: 100, align: 'right', render: (v) => <span className="text-blue-600">¥{v.toLocaleString()}</span> },
    { title: '样本数', dataIndex: 'sampleCount', key: 'sampleCount', width: 80, align: 'center' },
    { title: '更新期', dataIndex: 'updateDate', key: 'updateDate', width: 80 },
  ];

  // 概览Tab
  const OverviewTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="单位信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="单位名称">{detail.unitName}</Descriptions.Item>
              <Descriptions.Item label="单位编码">{detail.unitCode}</Descriptions.Item>
              <Descriptions.Item label="单位类型"><Tag color="blue">{detail.unitType}</Tag></Descriptions.Item>
              <Descriptions.Item label="所在地区">{detail.provinceName} {detail.cityName}</Descriptions.Item>
              <Descriptions.Item label="详细地址">{detail.address}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="会员信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="会员等级">{getMemberLevelTag(detail.memberLevel)}</Descriptions.Item>
              <Descriptions.Item label="入会时间">{detail.joinDate}</Descriptions.Item>
              <Descriptions.Item label="最近更新">{detail.lastUpdateDate}</Descriptions.Item>
              <Descriptions.Item label="数据质量">
                <Progress percent={detail.dataQuality} size="small" style={{ width: 120 }} />
              </Descriptions.Item>
              <Descriptions.Item label="资质认证">
                {detail.certifications.map(c => <Tag key={c} color="green">{c}</Tag>)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Card size="small" title="单位简介">
        <p className="text-gray-600">{detail.introduction}</p>
      </Card>
      <Card size="small" title="数据贡献统计">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="共享案例" value={detail.caseCount} suffix="条" prefix={<FileTextOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="共享指标" value={detail.indexCount} suffix="条" prefix={<BarChartOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="共享材价" value={detail.materialCount} suffix="条" prefix={<DollarOutlined />} />
          </Col>
          <Col span={6}>
            <div className="text-center">
              <SafetyCertificateOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div className="text-sm text-gray-500 mt-1">数据已审核</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  // 案例Tab
  const CasesTab = () => (
    <Card size="small" title={`共享案例 (${detail.caseCount}条)`}>
      <Table
        rowKey="id"
        columns={caseColumns}
        dataSource={mockSharedCases}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        size="small"
      />
    </Card>
  );

  // 指标Tab
  const IndexesTab = () => (
    <Card size="small" title={`共享指标 (${detail.indexCount}条)`}>
      <Table
        rowKey="id"
        columns={indexColumns}
        dataSource={mockSharedIndexes}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        size="small"
      />
    </Card>
  );

  // 材价Tab
  const MaterialsTab = () => (
    <Card size="small" title={`共享材价 (${detail.materialCount}条)`}>
      <Table
        rowKey="id"
        columns={materialColumns}
        dataSource={mockSharedMaterials}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        size="small"
      />
    </Card>
  );

  const tabItems = [
    { key: 'overview', label: '单位概览', children: <OverviewTab /> },
    { key: 'cases', label: `共享案例 (${detail.caseCount})`, children: <CasesTab /> },
    { key: 'indexes', label: `共享指标 (${detail.indexCount})`, children: <IndexesTab /> },
    { key: 'materials', label: `共享材价 (${detail.materialCount})`, children: <MaterialsTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <Avatar size={40} icon={<BankOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div>
              <span className="text-lg font-medium">{detail.unitName}</span>
              <div className="text-sm text-gray-400">
                {getMemberLevelTag(detail.memberLevel)}
                <Tag color="blue" className="ml-2">{detail.unitType}</Tag>
                <span className="ml-2">{detail.cityName}</span>
              </div>
            </div>
            {isCollected ? (
              <StarFilled style={{ color: '#faad14', fontSize: 18 }} onClick={() => setIsCollected(false)} />
            ) : (
              <StarOutlined style={{ fontSize: 18 }} onClick={() => setIsCollected(true)} />
            )}
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />}>导出数据</Button>
          </Space>
        </div>
      </Card>

      {/* 数据概览 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={5}>
            <Statistic title="共享案例" value={detail.caseCount} suffix="条" />
          </Col>
          <Col span={5}>
            <Statistic title="共享指标" value={detail.indexCount} suffix="条" />
          </Col>
          <Col span={5}>
            <Statistic title="共享材价" value={detail.materialCount} suffix="条" />
          </Col>
          <Col span={5}>
            <div className="text-center">
              <div className="text-sm text-gray-500">数据质量</div>
              <Progress type="circle" percent={detail.dataQuality} size={60} />
            </div>
          </Col>
          <Col span={4}>
            <div className="text-center">
              <div className="text-sm text-gray-500">最近更新</div>
              <div className="text-lg font-medium mt-1">{detail.lastUpdateDate}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 详情内容 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </div>
  );
};

export default MemberDataDetailPage;
