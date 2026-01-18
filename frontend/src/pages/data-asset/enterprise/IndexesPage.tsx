import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Select,
  Checkbox,
  Statistic,
  Radio,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  LineChartOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

// 原始指标数据类型
interface IndexRecord {
  indexId: string;
  indexCode: string;
  indexName: string;
  indexCategory: string;
  indexValue: number;
  indexUnit: string;
  functionTag: string;
  scaleLevel: string;
  province: string;
  city: string;
  dataPeriod: string;
  qualityFlag: string;
  deviationRatio: number;
}

// 聚合指标数据类型
interface AggregateIndex {
  indexCode: string;
  indexName: string;
  indexUnit: string;
  sampleCount: number;
  avgValue: number;
  medianValue: number;
  recommendValue: number;
  recommendRangeLow: number;
  recommendRangeHigh: number;
  reliabilityLevel: string;
}

// 矩阵数据类型
interface MatrixCell {
  value: number;
  sampleCount: number;
}

// 模拟原始指标数据
const mockIndexData: IndexRecord[] = [
  {
    indexId: 'EI202510001',
    indexCode: 'IDX-EC-001',
    indexName: '综合单方造价',
    indexCategory: 'economic',
    indexValue: 4200,
    indexUnit: '元/㎡',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'normal',
    deviationRatio: 8.2,
  },
  {
    indexId: 'EI202510002',
    indexCode: 'IDX-QT-001',
    indexName: '钢筋含量',
    indexCategory: 'quantity',
    indexValue: 58.6,
    indexUnit: 'kg/㎡',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'normal',
    deviationRatio: 6.5,
  },
  {
    indexId: 'EI202510003',
    indexCode: 'IDX-QT-002',
    indexName: '混凝土含量',
    indexCategory: 'quantity',
    indexValue: 0.42,
    indexUnit: 'm³/㎡',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'normal',
    deviationRatio: 2.4,
  },
  {
    indexId: 'EI202510004',
    indexCode: 'IDX-EC-001',
    indexName: '综合单方造价',
    indexCategory: 'economic',
    indexValue: 5850,
    indexUnit: '元/㎡',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'warning',
    deviationRatio: 51.2,
  },
  {
    indexId: 'EI202510005',
    indexCode: 'IDX-EC-002',
    indexName: '土建单方造价',
    indexCategory: 'economic',
    indexValue: 2520,
    indexUnit: '元/㎡',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'normal',
    deviationRatio: 5.8,
  },
  {
    indexId: 'EI202510006',
    indexCode: 'IDX-EC-005',
    indexName: '人工费占比',
    indexCategory: 'economic',
    indexValue: 18.5,
    indexUnit: '%',
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
    province: '广东省',
    city: '深圳市',
    dataPeriod: '2025Q3',
    qualityFlag: 'normal',
    deviationRatio: -1.6,
  },
];

// 模拟聚合数据
const mockAggregateData: AggregateIndex[] = [
  {
    indexCode: 'IDX-EC-001',
    indexName: '综合单方造价',
    indexUnit: '元/㎡',
    sampleCount: 42,
    avgValue: 4012,
    medianValue: 3950,
    recommendValue: 3950,
    recommendRangeLow: 3720,
    recommendRangeHigh: 4280,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-EC-002',
    indexName: '土建单方造价',
    indexUnit: '元/㎡',
    sampleCount: 42,
    avgValue: 2407,
    medianValue: 2370,
    recommendValue: 2370,
    recommendRangeLow: 2160,
    recommendRangeHigh: 2640,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-EC-003',
    indexName: '安装单方造价',
    indexUnit: '元/㎡',
    sampleCount: 38,
    avgValue: 1204,
    medianValue: 1185,
    recommendValue: 1185,
    recommendRangeLow: 1080,
    recommendRangeHigh: 1320,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-EC-005',
    indexName: '人工费占比',
    indexUnit: '%',
    sampleCount: 42,
    avgValue: 18.8,
    medianValue: 18.5,
    recommendValue: 18.5,
    recommendRangeLow: 17.0,
    recommendRangeHigh: 20.5,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-EC-006',
    indexName: '材料费占比',
    indexUnit: '%',
    sampleCount: 42,
    avgValue: 61.5,
    medianValue: 62.0,
    recommendValue: 62.0,
    recommendRangeLow: 58.0,
    recommendRangeHigh: 65.0,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-QT-001',
    indexName: '钢筋含量',
    indexUnit: 'kg/㎡',
    sampleCount: 35,
    avgValue: 56.2,
    medianValue: 55.0,
    recommendValue: 55.0,
    recommendRangeLow: 48,
    recommendRangeHigh: 62,
    reliabilityLevel: 'high',
  },
  {
    indexCode: 'IDX-QT-002',
    indexName: '混凝土含量',
    indexUnit: 'm³/㎡',
    sampleCount: 35,
    avgValue: 0.42,
    medianValue: 0.41,
    recommendValue: 0.41,
    recommendRangeLow: 0.36,
    recommendRangeHigh: 0.46,
    reliabilityLevel: 'high',
  },
];

// 模拟矩阵数据
const mockMatrixData: Record<string, Record<string, MatrixCell>> = {
  '办公建筑': {
    '<3000': { value: 4350, sampleCount: 12 },
    '3K-5K': { value: 4150, sampleCount: 18 },
    '5K-1W': { value: 3950, sampleCount: 42 },
    '1W-2W': { value: 3800, sampleCount: 35 },
    '2W-5W': { value: 3650, sampleCount: 28 },
  },
  '商业建筑': {
    '<3000': { value: 5200, sampleCount: 8 },
    '3K-5K': { value: 4950, sampleCount: 15 },
    '5K-1W': { value: 4700, sampleCount: 38 },
    '1W-2W': { value: 4500, sampleCount: 42 },
    '2W-5W': { value: 4350, sampleCount: 25 },
  },
  '教学建筑': {
    '<3000': { value: 3850, sampleCount: 15 },
    '3K-5K': { value: 3650, sampleCount: 22 },
    '5K-1W': { value: 3500, sampleCount: 35 },
    '1W-2W': { value: 3380, sampleCount: 28 },
    '2W-5W': { value: 3250, sampleCount: 18 },
  },
  '医疗建筑': {
    '<3000': { value: 6500, sampleCount: 5 },
    '3K-5K': { value: 6200, sampleCount: 12 },
    '5K-1W': { value: 5850, sampleCount: 25 },
    '1W-2W': { value: 5600, sampleCount: 32 },
    '2W-5W': { value: 5400, sampleCount: 22 },
  },
  '高层住宅': {
    '<3000': { value: 3200, sampleCount: 20 },
    '3K-5K': { value: 3050, sampleCount: 45 },
    '5K-1W': { value: 2950, sampleCount: 68 },
    '1W-2W': { value: 2850, sampleCount: 52 },
    '2W-5W': { value: 2750, sampleCount: 35 },
  },
};

const IndexesPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<string>('list');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['economic', 'quantity']);
  const [functionTag, setFunctionTag] = useState<string>('办公建筑');
  const [scaleLevel, setScaleLevel] = useState<string>('5K-1W');
  const [province, setProvince] = useState<string>('广东省');
  const [dataYear, setDataYear] = useState<string>('2025');

  // 列表视图列定义
  const listColumns: ColumnsType<IndexRecord> = [
    {
      title: '指标名称',
      dataIndex: 'indexName',
      key: 'indexName',
      width: 140,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-400">{record.indexUnit}</div>
        </div>
      ),
    },
    {
      title: '指标值',
      dataIndex: 'indexValue',
      key: 'indexValue',
      width: 120,
      align: 'right',
      render: (val, record) => (
        <div>
          <div className="font-medium">{val.toLocaleString()}</div>
          <div
            className="text-xs"
            style={{ color: record.deviationRatio > 0 ? '#f5222d' : '#52c41a' }}
          >
            {record.deviationRatio > 0 ? '↑' : '↓'}
            {Math.abs(record.deviationRatio)}%
          </div>
        </div>
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'functionTag',
      key: 'functionTag',
      width: 150,
      ellipsis: true,
    },
    {
      title: '规模档',
      dataIndex: 'scaleLevel',
      key: 'scaleLevel',
      width: 120,
    },
    {
      title: '地区',
      key: 'location',
      width: 120,
      render: (_, record) => `${record.province}${record.city}`,
    },
    {
      title: '数据期',
      dataIndex: 'dataPeriod',
      key: 'dataPeriod',
      width: 100,
    },
    {
      title: '质量',
      dataIndex: 'qualityFlag',
      key: 'qualityFlag',
      width: 80,
      render: (flag) => (
        <Tag color={flag === 'normal' ? 'green' : flag === 'warning' ? 'orange' : 'red'}>
          {flag === 'normal' ? '正常' : flag === 'warning' ? '异常' : '错误'}
        </Tag>
      ),
    },
  ];

  // 聚合视图列定义
  const aggregateColumns: ColumnsType<AggregateIndex> = [
    {
      title: '指标名称',
      dataIndex: 'indexName',
      key: 'indexName',
      width: 140,
    },
    {
      title: '推荐值',
      dataIndex: 'recommendValue',
      key: 'recommendValue',
      width: 100,
      align: 'right',
      render: (val) => <span className="font-medium text-blue-600">{val.toLocaleString()}</span>,
    },
    {
      title: '均值',
      dataIndex: 'avgValue',
      key: 'avgValue',
      width: 100,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '中位数',
      dataIndex: 'medianValue',
      key: 'medianValue',
      width: 100,
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: '推荐区间',
      key: 'range',
      width: 140,
      render: (_, record) => (
        <span className="text-gray-500">
          {record.recommendRangeLow.toLocaleString()} ~ {record.recommendRangeHigh.toLocaleString()}
        </span>
      ),
    },
    {
      title: '样本数',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 80,
      align: 'center',
    },
    {
      title: (
        <span>
          可靠性{' '}
          <Tooltip title="基于样本数和变异系数计算">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: 'reliabilityLevel',
      key: 'reliabilityLevel',
      width: 100,
      render: (level) => (
        <Tag color={level === 'high' ? 'green' : level === 'medium' ? 'orange' : 'red'}>
          {level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
  ];

  // 渲染列表视图
  const renderListView = () => (
    <Card size="small" title="原始指标列表">
      <Table
        rowKey="indexId"
        columns={listColumns}
        dataSource={mockIndexData}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 900 }}
        size="small"
      />
    </Card>
  );

  // 渲染聚合视图
  const renderAggregateView = () => (
    <Card size="small">
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <Row gutter={16} align="middle">
          <Col>
            <span className="text-gray-500">聚合维度：</span>
          </Col>
          <Col>
            <Select value={functionTag} onChange={setFunctionTag} style={{ width: 140 }}>
              <Select.Option value="办公建筑">办公建筑</Select.Option>
              <Select.Option value="商业建筑">商业建筑</Select.Option>
              <Select.Option value="教学建筑">教学建筑</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select value={scaleLevel} onChange={setScaleLevel} style={{ width: 140 }}>
              <Select.Option value="<3000">&lt;3000㎡</Select.Option>
              <Select.Option value="3K-5K">3000-5000㎡</Select.Option>
              <Select.Option value="5K-1W">5000-10000㎡</Select.Option>
              <Select.Option value="1W-2W">10000-20000㎡</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select value={province} onChange={setProvince} style={{ width: 120 }}>
              <Select.Option value="广东省">广东省</Select.Option>
              <Select.Option value="全国">全国</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select value={dataYear} onChange={setDataYear} style={{ width: 100 }}>
              <Select.Option value="2025">2025年</Select.Option>
              <Select.Option value="2024">2024年</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon={<ReloadOutlined />}>
              聚合计算
            </Button>
          </Col>
        </Row>
      </div>

      <div className="mb-4 p-3 border rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">
            聚合结果：{functionTag} | {scaleLevel} | {province} | {dataYear}年
          </span>
          <Tag color="green">可靠性：高</Tag>
        </div>
        <div className="text-gray-500">样本数：42个案例</div>
      </div>

      <div className="mb-4">
        <div className="font-medium mb-2">经济指标</div>
        <Table
          rowKey="indexCode"
          columns={aggregateColumns}
          dataSource={mockAggregateData.filter((d) => d.indexCode.includes('EC'))}
          pagination={false}
          size="small"
        />
      </div>

      <div>
        <div className="font-medium mb-2">工程量指标</div>
        <Table
          rowKey="indexCode"
          columns={aggregateColumns}
          dataSource={mockAggregateData.filter((d) => d.indexCode.includes('QT'))}
          pagination={false}
          size="small"
        />
      </div>

      <div className="mt-4 text-right">
        <Space>
          <Button>查看分布</Button>
          <Button icon={<LineChartOutlined />} onClick={() => navigate('/data-asset/enterprise/indexes/trend')}>
            趋势分析
          </Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </div>
    </Card>
  );

  // 渲染矩阵视图
  const renderMatrixView = () => {
    const scaleLevels = ['<3000', '3K-5K', '5K-1W', '1W-2W', '2W-5W'];
    const functionTags = Object.keys(mockMatrixData);

    const getCellColor = (count: number) => {
      if (count >= 10) return '#f6ffed';
      if (count >= 5) return '#fffbe6';
      return '#fff1f0';
    };

    return (
      <Card size="small">
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <Row gutter={16} align="middle">
            <Col>
              <span className="text-gray-500">指标：</span>
              <Select defaultValue="IDX-EC-001" style={{ width: 160 }}>
                <Select.Option value="IDX-EC-001">综合单方造价</Select.Option>
                <Select.Option value="IDX-QT-001">钢筋含量</Select.Option>
                <Select.Option value="IDX-QT-002">混凝土含量</Select.Option>
              </Select>
            </Col>
            <Col>
              <span className="text-gray-500">行维度：</span>
              <Select defaultValue="function" style={{ width: 120 }}>
                <Select.Option value="function">功能标签</Select.Option>
                <Select.Option value="province">省份</Select.Option>
              </Select>
            </Col>
            <Col>
              <span className="text-gray-500">列维度：</span>
              <Select defaultValue="scale" style={{ width: 120 }}>
                <Select.Option value="scale">规模档</Select.Option>
                <Select.Option value="year">年份</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select value={province} onChange={setProvince} style={{ width: 100 }}>
                <Select.Option value="广东省">广东省</Select.Option>
                <Select.Option value="全国">全国</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select value={dataYear} onChange={setDataYear} style={{ width: 100 }}>
                <Select.Option value="2025">2025年</Select.Option>
                <Select.Option value="2024">2024年</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary">生成矩阵</Button>
            </Col>
          </Row>
        </div>

        <div className="mb-2 font-medium">
          综合单方造价矩阵（元/㎡）| {province} | {dataYear}年
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 text-left">功能\规模</th>
                {scaleLevels.map((level) => (
                  <th key={level} className="border p-2 bg-gray-100 text-center">
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {functionTags.map((tag) => (
                <tr key={tag}>
                  <td className="border p-2 font-medium">{tag}</td>
                  {scaleLevels.map((level) => {
                    const cell = mockMatrixData[tag][level];
                    return (
                      <td
                        key={level}
                        className="border p-2 text-center"
                        style={{ backgroundColor: getCellColor(cell.sampleCount) }}
                      >
                        <div className="font-medium">{cell.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">({cell.sampleCount})</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            图例：数值为推荐值，括号内为样本数 |{' '}
            <span style={{ backgroundColor: '#f6ffed', padding: '2px 8px' }}>≥10样本</span>{' '}
            <span style={{ backgroundColor: '#fffbe6', padding: '2px 8px' }}>5-9样本</span>{' '}
            <span style={{ backgroundColor: '#fff1f0', padding: '2px 8px' }}>&lt;5样本</span>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>导出Excel</Button>
            <Button>生成热力图</Button>
          </Space>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* 筛选区 */}
      <Card size="small" title="筛选条件">
        <Row gutter={[16, 12]}>
          <Col span={24}>
            <span className="mr-2">指标类别：</span>
            <Checkbox.Group
              value={selectedCategories}
              onChange={(vals) => setSelectedCategories(vals as string[])}
              options={[
                { label: '经济指标', value: 'economic' },
                { label: '工程量指标', value: 'quantity' },
                { label: '人材机指标', value: 'resource' },
              ]}
            />
          </Col>
          <Col span={6}>
            <span className="mr-2">功能标签：</span>
            <Select defaultValue="" style={{ width: 140 }} placeholder="请选择">
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="办公建筑">办公建筑</Select.Option>
              <Select.Option value="商业建筑">商业建筑</Select.Option>
              <Select.Option value="教学建筑">教学建筑</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">规模档：</span>
            <Select defaultValue="" style={{ width: 140 }} placeholder="请选择">
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="5K-1W">5000-10000㎡</Select.Option>
              <Select.Option value="1W-2W">10000-20000㎡</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">省份：</span>
            <Select defaultValue="" style={{ width: 120 }} placeholder="请选择">
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="广东省">广东省</Select.Option>
              <Select.Option value="北京市">北京市</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <span className="mr-2">数据年份：</span>
            <Select defaultValue="2025" style={{ width: 100 }}>
              <Select.Option value="2025">2025年</Select.Option>
              <Select.Option value="2024">2024年</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <span className="mr-2">计价阶段：</span>
            <Checkbox.Group
              defaultValue={['budget', 'settlement']}
              options={[
                { label: '概算', value: 'estimate' },
                { label: '预算', value: 'budget' },
                { label: '结算', value: 'settlement' },
                { label: '决算', value: 'final' },
              ]}
            />
          </Col>
          <Col span={12}>
            <span className="mr-2">质量标识：</span>
            <Checkbox.Group
              defaultValue={['normal']}
              options={[
                { label: '正常', value: 'normal' },
                { label: '异常', value: 'warning' },
              ]}
            />
          </Col>
          <Col span={24} className="text-right">
            <Space>
              <Button>重置</Button>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button>聚合</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 视图切换 */}
      <Card size="small">
        <div className="flex justify-between items-center">
          <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
            <Radio.Button value="list">列表视图</Radio.Button>
            <Radio.Button value="aggregate">聚合视图</Radio.Button>
            <Radio.Button value="matrix">矩阵视图</Radio.Button>
          </Radio.Group>
          <Space>
            <Button
              icon={<LineChartOutlined />}
              onClick={() => navigate('/data-asset/enterprise/indexes/trend')}
            >
              趋势分析
            </Button>
            <Button onClick={() => navigate('/data-asset/enterprise/indexes/publish')}>
              发布管理
            </Button>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small" title="统计概览">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="指标总数" value={28560} />
          </Col>
          <Col span={4}>
            <Statistic title="本季新增" value={1286} suffix={<span className="text-green-500 text-sm">↑12%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="经济指标" value={12450} suffix={<span className="text-gray-400 text-sm">43.6%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="工程量指标" value={10280} suffix={<span className="text-gray-400 text-sm">36.0%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="人材机指标" value={5830} suffix={<span className="text-gray-400 text-sm">20.4%</span>} />
          </Col>
          <Col span={4}>
            <Statistic title="高可靠聚合" value={856} suffix="组" />
          </Col>
        </Row>
      </Card>

      {/* 视图内容 */}
      {viewType === 'list' && renderListView()}
      {viewType === 'aggregate' && renderAggregateView()}
      {viewType === 'matrix' && renderMatrixView()}
    </div>
  );
};

export default IndexesPage;
