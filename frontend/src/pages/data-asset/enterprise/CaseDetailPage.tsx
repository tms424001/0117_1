import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Tabs,
  Table,
  Progress,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  ArrowLeftOutlined,
  ExportOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

// 造价明细类型
interface CostDetail {
  id: string;
  itemName: string;
  totalPrice: number;
  ratio: number;
  children?: CostDetail[];
}

// 指标数据类型
interface IndexData {
  id: string;
  indexCategory: string;
  indexName: string;
  indexValue: number;
  indexUnit: string;
  comparedToAvg: number;
}

// 材料数据类型
interface MaterialData {
  id: string;
  materialName: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  consumptionPerArea: number;
}

// 模拟案例详情数据
const mockCaseDetail = {
  basic: {
    caseId: 'EC202506001',
    caseCode: 'EC202506001',
    caseName: '深圳某办公楼项目',
    projectName: '深圳某办公楼项目',
    projectLocation: '广东省深圳市南山区',
    constructionUnit: '深圳某科技有限公司',
    designUnit: '某设计研究院',
    constructionContractor: '某建设集团',
    consultingUnit: '某造价咨询公司',
  },
  tag: {
    functionCategory: '公共建筑',
    functionSubcategory: '办公建筑',
    functionTag: '办公建筑-甲级办公',
    functionTagCode: 'B01-01-001',
    tagMatchType: 'auto',
    tagConfidence: 95.6,
  },
  scale: {
    scaleType: '建筑面积',
    buildingArea: 8500,
    scaleLevel: '5000-10000㎡',
    aboveGroundArea: 6800,
    undergroundArea: 1700,
    aboveGroundFloors: 12,
    undergroundFloors: 2,
    buildingHeight: 48.5,
    structureType: '框架剪力墙',
    foundationType: '桩基础',
  },
  cost: {
    pricingStage: 'budget',
    pricingStageName: '预算',
    pricingDate: '2025-06-01',
    pricePeriod: '2025-06',
    totalCost: 35700000,
    unitCost: 4200,
    civilCost: 21420000,
    civilRatio: 60,
    installCost: 10710000,
    installRatio: 30,
    decorationCost: 3570000,
    decorationRatio: 10,
  },
  quality: {
    dataCompleteness: 92,
    dataQualityScore: 88.5,
    qualityLevel: 'A',
  },
  status: {
    status: 'active',
    statusName: '启用',
    publishTime: '2025-06-15',
    version: 1,
  },
};

// 造价明细数据
const costDetails: CostDetail[] = [
  {
    id: '1',
    itemName: '分部分项工程费',
    totalPrice: 28560000,
    ratio: 80,
    children: [
      { id: '1-1', itemName: '土石方工程', totalPrice: 1428000, ratio: 5 },
      { id: '1-2', itemName: '基础工程', totalPrice: 4284000, ratio: 15 },
      { id: '1-3', itemName: '主体结构工程', totalPrice: 8568000, ratio: 30 },
      { id: '1-4', itemName: '装饰装修工程', totalPrice: 5712000, ratio: 20 },
      { id: '1-5', itemName: '屋面工程', totalPrice: 1142400, ratio: 4 },
      { id: '1-6', itemName: '给排水工程', totalPrice: 2856000, ratio: 10 },
      { id: '1-7', itemName: '电气工程', totalPrice: 2856000, ratio: 10 },
      { id: '1-8', itemName: '暖通空调工程', totalPrice: 1713600, ratio: 6 },
    ],
  },
  { id: '2', itemName: '措施项目费', totalPrice: 3570000, ratio: 10 },
  { id: '3', itemName: '其他项目费', totalPrice: 1785000, ratio: 5 },
  { id: '4', itemName: '规费', totalPrice: 1071000, ratio: 3 },
  { id: '5', itemName: '税金', totalPrice: 714000, ratio: 2 },
];

// 指标数据
const indexData: IndexData[] = [
  { id: '1', indexCategory: 'economic', indexName: '综合单方造价', indexValue: 4200, indexUnit: '元/㎡', comparedToAvg: 8.2 },
  { id: '2', indexCategory: 'economic', indexName: '土建单方造价', indexValue: 2520, indexUnit: '元/㎡', comparedToAvg: 5.1 },
  { id: '3', indexCategory: 'economic', indexName: '安装单方造价', indexValue: 1260, indexUnit: '元/㎡', comparedToAvg: 12.3 },
  { id: '4', indexCategory: 'economic', indexName: '装饰单方造价', indexValue: 420, indexUnit: '元/㎡', comparedToAvg: 15.8 },
  { id: '5', indexCategory: 'economic', indexName: '人工费占比', indexValue: 18.5, indexUnit: '%', comparedToAvg: -2.1 },
  { id: '6', indexCategory: 'economic', indexName: '材料费占比', indexValue: 62.3, indexUnit: '%', comparedToAvg: 1.5 },
  { id: '7', indexCategory: 'quantity', indexName: '钢筋含量', indexValue: 58.6, indexUnit: 'kg/㎡', comparedToAvg: 6.5 },
  { id: '8', indexCategory: 'quantity', indexName: '混凝土含量', indexValue: 0.42, indexUnit: 'm³/㎡', comparedToAvg: 2.4 },
  { id: '9', indexCategory: 'quantity', indexName: '模板含量', indexValue: 2.15, indexUnit: '㎡/㎡', comparedToAvg: 1.9 },
];

// 材料数据
const materialData: MaterialData[] = [
  { id: '1', materialName: '钢筋', specification: 'HRB400 Φ12', unit: 't', quantity: 498.1, unitPrice: 4200, totalPrice: 2092020, consumptionPerArea: 58.6 },
  { id: '2', materialName: '混凝土', specification: 'C30', unit: 'm³', quantity: 3570, unitPrice: 450, totalPrice: 1606500, consumptionPerArea: 0.42 },
  { id: '3', materialName: '模板', specification: '木模板', unit: '㎡', quantity: 18275, unitPrice: 45, totalPrice: 822375, consumptionPerArea: 2.15 },
  { id: '4', materialName: '砌块', specification: '加气混凝土砌块', unit: 'm³', quantity: 1530, unitPrice: 280, totalPrice: 428400, consumptionPerArea: 0.18 },
  { id: '5', materialName: '电线电缆', specification: 'BV-2.5', unit: 'm', quantity: 85000, unitPrice: 3.5, totalPrice: 297500, consumptionPerArea: 10 },
];

const EnterpriseCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [activeTab, setActiveTab] = useState('basic');

  const caseData = mockCaseDetail;

  // 造价明细列
  const costColumns: ColumnsType<CostDetail> = [
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '金额(元)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 150,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '占比',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 200,
      render: (val) => (
        <div className="flex items-center gap-2">
          <Progress percent={val} size="small" style={{ width: 100 }} showInfo={false} />
          <span>{val}%</span>
        </div>
      ),
    },
  ];

  // 指标列
  const indexColumns: ColumnsType<IndexData> = [
    {
      title: '指标名称',
      dataIndex: 'indexName',
      key: 'indexName',
    },
    {
      title: '指标值',
      dataIndex: 'indexValue',
      key: 'indexValue',
      width: 120,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '单位',
      dataIndex: 'indexUnit',
      key: 'indexUnit',
      width: 80,
    },
    {
      title: '与同类对比',
      dataIndex: 'comparedToAvg',
      key: 'comparedToAvg',
      width: 150,
      render: (val) => (
        <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>
          {val > 0 ? '↑' : '↓'} {Math.abs(val)}%
        </span>
      ),
    },
  ];

  // 材料列
  const materialColumns: ColumnsType<MaterialData> = [
    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 120,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60,
    },
    {
      title: '用量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 80,
      align: 'right',
    },
    {
      title: '合价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '单方用量',
      dataIndex: 'consumptionPerArea',
      key: 'consumptionPerArea',
      width: 100,
      align: 'right',
    },
  ];

  // 基本信息Tab
  const BasicInfoTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="项目概况" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="项目名称">{caseData.basic.projectName}</Descriptions.Item>
              <Descriptions.Item label="项目地点">{caseData.basic.projectLocation}</Descriptions.Item>
              <Descriptions.Item label="建设单位">{caseData.basic.constructionUnit}</Descriptions.Item>
              <Descriptions.Item label="设计单位">{caseData.basic.designUnit}</Descriptions.Item>
              <Descriptions.Item label="施工单位">{caseData.basic.constructionContractor}</Descriptions.Item>
              <Descriptions.Item label="咨询单位">{caseData.basic.consultingUnit}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="标签信息" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="功能大类">{caseData.tag.functionCategory}</Descriptions.Item>
              <Descriptions.Item label="功能中类">{caseData.tag.functionSubcategory}</Descriptions.Item>
              <Descriptions.Item label="功能标签">{caseData.tag.functionTag}</Descriptions.Item>
              <Descriptions.Item label="标签编码">{caseData.tag.functionTagCode}</Descriptions.Item>
              <Descriptions.Item label="匹配方式">
                {caseData.tag.tagMatchType === 'auto' ? '自动匹配' : '手动选择'}
              </Descriptions.Item>
              <Descriptions.Item label="置信度">{caseData.tag.tagConfidence}%</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="造价信息" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="计价阶段">{caseData.cost.pricingStageName}</Descriptions.Item>
              <Descriptions.Item label="计价基准日">{caseData.cost.pricingDate}</Descriptions.Item>
              <Descriptions.Item label="材价期">{caseData.cost.pricePeriod}</Descriptions.Item>
              <Descriptions.Item label="总造价">
                {caseData.cost.totalCost.toLocaleString()} 元
              </Descriptions.Item>
              <Descriptions.Item label="单方造价">
                {caseData.cost.unitCost.toLocaleString()} 元/㎡
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="造价构成" size="small" className="mt-4">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="土建造价">
                {caseData.cost.civilCost.toLocaleString()} 元 ({caseData.cost.civilRatio}%)
              </Descriptions.Item>
              <Descriptions.Item label="安装造价">
                {caseData.cost.installCost.toLocaleString()} 元 ({caseData.cost.installRatio}%)
              </Descriptions.Item>
              <Descriptions.Item label="装饰造价">
                {caseData.cost.decorationCost.toLocaleString()} 元 ({caseData.cost.decorationRatio}%)
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="规模信息" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="规模类型">{caseData.scale.scaleType}</Descriptions.Item>
              <Descriptions.Item label="建筑面积">{caseData.scale.buildingArea.toLocaleString()} ㎡</Descriptions.Item>
              <Descriptions.Item label="规模档">{caseData.scale.scaleLevel}</Descriptions.Item>
              <Descriptions.Item label="地上面积">{caseData.scale.aboveGroundArea.toLocaleString()} ㎡</Descriptions.Item>
              <Descriptions.Item label="地下面积">{caseData.scale.undergroundArea.toLocaleString()} ㎡</Descriptions.Item>
              <Descriptions.Item label="地上层数">{caseData.scale.aboveGroundFloors} 层</Descriptions.Item>
              <Descriptions.Item label="地下层数">{caseData.scale.undergroundFloors} 层</Descriptions.Item>
              <Descriptions.Item label="建筑高度">{caseData.scale.buildingHeight} m</Descriptions.Item>
              <Descriptions.Item label="结构类型">{caseData.scale.structureType}</Descriptions.Item>
              <Descriptions.Item label="基础类型">{caseData.scale.foundationType}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="数据质量" size="small" className="mt-4">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="完整度" value={caseData.quality.dataCompleteness} suffix="%" />
              </Col>
              <Col span={8}>
                <Statistic title="质量评分" value={caseData.quality.dataQualityScore} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="质量等级"
                  value={caseData.quality.qualityLevel}
                  suffix="级"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 造价明细Tab
  const CostDetailTab = () => (
    <div className="space-y-4">
      <Card title="造价汇总" size="small">
        <Table
          rowKey="id"
          columns={costColumns}
          dataSource={costDetails}
          pagination={false}
          defaultExpandAllRows
          size="small"
        />
      </Card>
    </div>
  );

  // 指标数据Tab
  const IndexDataTab = () => (
    <div className="space-y-4">
      <Card title="经济指标" size="small">
        <Table
          rowKey="id"
          columns={indexColumns}
          dataSource={indexData.filter((d) => d.indexCategory === 'economic')}
          pagination={false}
          size="small"
        />
      </Card>
      <Card title="工程量指标" size="small">
        <Table
          rowKey="id"
          columns={indexColumns}
          dataSource={indexData.filter((d) => d.indexCategory === 'quantity')}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // 材料清单Tab
  const MaterialTab = () => (
    <Card title="主材清单" size="small">
      <Table
        rowKey="id"
        columns={materialColumns}
        dataSource={materialData}
        pagination={false}
        size="small"
      />
    </Card>
  );

  const tabItems = [
    { key: 'basic', label: '基本信息', children: <BasicInfoTab /> },
    { key: 'cost', label: '造价明细', children: <CostDetailTab /> },
    { key: 'index', label: '指标数据', children: <IndexDataTab /> },
    { key: 'material', label: '材料清单', children: <MaterialTab /> },
    { key: 'history', label: '变更记录', children: <div className="text-gray-400 p-8 text-center">暂无变更记录</div> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">{caseData.basic.caseName}</span>
            <Tag color="blue">{caseData.basic.caseCode}</Tag>
            <Tag color="green">{caseData.status.statusName}</Tag>
            <Tag color="gold">{caseData.quality.qualityLevel}级</Tag>
          </Space>
          <Space>
            <Button icon={<LinkOutlined />}>引用到估算</Button>
            <Button icon={<ExportOutlined />}>导出报告</Button>
          </Space>
        </div>
      </Card>

      {/* Tab内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </div>
  );
};

export default EnterpriseCaseDetailPage;
