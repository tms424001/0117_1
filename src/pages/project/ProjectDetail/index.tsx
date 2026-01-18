import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  Breadcrumb,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface BuildingUnit {
  id: string;
  unitName: string;
  functionTag: string;
  totalArea: number;
  totalCost: number;
  unitCost: number;
  status: string;
}

const mockProject = {
  id: '1',
  projectName: 'XX市人民医院门诊综合楼',
  projectCode: 'PRJ-2026-001',
  projectType: '医疗',
  province: '浙江省',
  city: '杭州市',
  district: '西湖区',
  totalArea: 25000,
  aboveGroundArea: 20000,
  undergroundArea: 5000,
  totalCost: 125000000,
  unitCost: 5000,
  priceBaseDate: '2025-06',
  startDate: '2024-03-01',
  completionDate: '2025-12-31',
  buildingParty: 'XX市卫生健康委员会',
  designParty: 'XX建筑设计研究院',
  constructionParty: 'XX建工集团',
  status: 'completed',
  createdAt: '2026-01-15',
};

const mockUnits: BuildingUnit[] = [
  {
    id: '1',
    unitName: '门诊楼',
    functionTag: 'YI-MZ-01',
    totalArea: 15000,
    totalCost: 75000000,
    unitCost: 5000,
    status: 'completed',
  },
  {
    id: '2',
    unitName: '医技楼',
    functionTag: 'YI-YJ-01',
    totalArea: 8000,
    totalCost: 40000000,
    unitCost: 5000,
    status: 'completed',
  },
  {
    id: '3',
    unitName: '地下车库',
    functionTag: 'QT-CK-01',
    totalArea: 2000,
    totalCost: 10000000,
    unitCost: 5000,
    status: 'completed',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  imported: { text: '已导入', color: 'blue' },
  tagging: { text: '标签化中', color: 'orange' },
  completed: { text: '已完成', color: 'green' },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const unitColumns: ColumnsType<BuildingUnit> = [
    { title: '单体名称', dataIndex: 'unitName', key: 'unitName' },
    { title: '功能标签', dataIndex: 'functionTag', key: 'functionTag' },
    {
      title: '建筑面积(m²)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      align: 'right',
      render: (v) => v?.toLocaleString(),
    },
    {
      title: '造价(万元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      align: 'right',
      render: (v) => (v / 10000).toLocaleString(),
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      align: 'right',
      render: (v) => `¥${v?.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const tabItems = [
    {
      key: 'units',
      label: '单体列表',
      children: (
        <Table
          columns={unitColumns}
          dataSource={mockUnits}
          rowKey="id"
          pagination={false}
        />
      ),
    },
    {
      key: 'costs',
      label: '造价明细',
      children: <div className="p-4 text-gray-500">造价明细功能开发中...</div>,
    },
    {
      key: 'history',
      label: '操作历史',
      children: <div className="p-4 text-gray-500">操作历史功能开发中...</div>,
    },
  ];

  const statusConfig = statusMap[mockProject.status] || { text: mockProject.status, color: 'default' };

  return (
    <div>
      <Breadcrumb
        className="mb-4"
        items={[
          { title: <a onClick={() => navigate('/projects')}>项目管理</a> },
          { title: '项目详情' },
        ]}
      />

      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/projects')}
            />
            <span>{mockProject.projectName}</span>
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
          </Space>
        }
        extra={
          <Button type="primary" icon={<EditOutlined />}>
            编辑项目
          </Button>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered size="small">
          <Descriptions.Item label="项目编号">{mockProject.projectCode}</Descriptions.Item>
          <Descriptions.Item label="项目类型">{mockProject.projectType}</Descriptions.Item>
          <Descriptions.Item label="所在地区">
            {mockProject.province} {mockProject.city} {mockProject.district}
          </Descriptions.Item>
          <Descriptions.Item label="总建筑面积">
            {mockProject.totalArea?.toLocaleString()} m²
          </Descriptions.Item>
          <Descriptions.Item label="地上面积">
            {mockProject.aboveGroundArea?.toLocaleString()} m²
          </Descriptions.Item>
          <Descriptions.Item label="地下面积">
            {mockProject.undergroundArea?.toLocaleString()} m²
          </Descriptions.Item>
          <Descriptions.Item label="总造价">
            ¥{(mockProject.totalCost / 10000).toLocaleString()} 万元
          </Descriptions.Item>
          <Descriptions.Item label="单方造价">
            ¥{mockProject.unitCost?.toLocaleString()} /m²
          </Descriptions.Item>
          <Descriptions.Item label="价格基准期">{mockProject.priceBaseDate}</Descriptions.Item>
          <Descriptions.Item label="建设单位">{mockProject.buildingParty}</Descriptions.Item>
          <Descriptions.Item label="设计单位">{mockProject.designParty}</Descriptions.Item>
          <Descriptions.Item label="施工单位">{mockProject.constructionParty}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mt-4">
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}
