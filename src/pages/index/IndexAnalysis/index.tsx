import { useState } from 'react';
import { Card, Row, Col, Select, Statistic, Table, Tabs } from 'antd';
import ReactECharts from 'echarts-for-react';

const getDistributionOption = () => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['<3000', '3000-4000', '4000-5000', '5000-6000', '>6000'],
    name: '单方造价(元/m²)',
  },
  yAxis: { type: 'value', name: '样本数' },
  series: [
    {
      type: 'bar',
      data: [5, 18, 35, 22, 8],
      itemStyle: { color: '#1677ff' },
    },
  ],
});

const getTrendOption = () => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['平均值', '中位数'] },
  xAxis: {
    type: 'category',
    data: ['2023Q1', '2023Q2', '2023Q3', '2023Q4', '2024Q1', '2024Q2'],
  },
  yAxis: { type: 'value', name: '元/m²' },
  series: [
    {
      name: '平均值',
      type: 'line',
      data: [4200, 4350, 4400, 4500, 4550, 4600],
      smooth: true,
    },
    {
      name: '中位数',
      type: 'line',
      data: [4100, 4250, 4300, 4380, 4420, 4500],
      smooth: true,
    },
  ],
});

const getCompareOption = () => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['土建', '安装', '其他'] },
  xAxis: { type: 'category', data: ['综合门诊', '专科门诊', '普通病房', 'ICU病房'] },
  yAxis: { type: 'value', name: '元/m²' },
  series: [
    { name: '土建', type: 'bar', stack: 'total', data: [4500, 4200, 5200, 6800] },
    { name: '安装', type: 'bar', stack: 'total', data: [1800, 1600, 2100, 3200] },
    { name: '其他', type: 'bar', stack: 'total', data: [500, 400, 600, 800] },
  ],
});

const sampleData = [
  { key: '1', projectName: 'XX市人民医院', unitName: '门诊楼', area: 15000, unitCost: 4500, deviation: '+2.3%' },
  { key: '2', projectName: 'XX区中心医院', unitName: '门诊综合楼', area: 12000, unitCost: 4380, deviation: '-0.5%' },
  { key: '3', projectName: 'XX县医院', unitName: '门诊部', area: 8000, unitCost: 4200, deviation: '-4.5%' },
  { key: '4', projectName: 'XX市第二医院', unitName: '新门诊楼', area: 18000, unitCost: 4650, deviation: '+5.7%' },
];

export default function IndexAnalysis() {
  const [selectedTag, setSelectedTag] = useState('YI-MZ-01');

  const tabItems = [
    {
      key: 'distribution',
      label: '分布分析',
      children: (
        <Row gutter={16}>
          <Col span={16}>
            <Card title="造价分布">
              <ReactECharts option={getDistributionOption()} style={{ height: 350 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="统计指标">
              <div className="space-y-4">
                <Statistic title="样本数量" value={88} />
                <Statistic title="平均值" value={4500} prefix="¥" suffix="元/m²" />
                <Statistic title="中位数" value={4380} prefix="¥" suffix="元/m²" />
                <Statistic title="标准差" value={520} prefix="¥" />
                <Statistic title="变异系数" value={0.12} precision={2} />
              </div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'trend',
      label: '趋势分析',
      children: (
        <Card title="造价趋势">
          <ReactECharts option={getTrendOption()} style={{ height: 400 }} />
        </Card>
      ),
    },
    {
      key: 'compare',
      label: '对比分析',
      children: (
        <Card title="专业构成对比">
          <ReactECharts option={getCompareOption()} style={{ height: 400 }} />
        </Card>
      ),
    },
    {
      key: 'samples',
      label: '样本明细',
      children: (
        <Card title="样本列表">
          <Table
            dataSource={sampleData}
            columns={[
              { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
              { title: '单体名称', dataIndex: 'unitName', key: 'unitName' },
              { title: '面积(m²)', dataIndex: 'area', key: 'area', render: (v: number) => v.toLocaleString() },
              { title: '单方造价', dataIndex: 'unitCost', key: 'unitCost', render: (v: number) => `¥${v.toLocaleString()}` },
              { title: '偏差', dataIndex: 'deviation', key: 'deviation' },
            ]}
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>指标分析</h1>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <span>功能标签：</span>
          <Select
            value={selectedTag}
            onChange={setSelectedTag}
            style={{ width: 200 }}
            options={[
              { value: 'YI-MZ-01', label: '综合门诊 (YI-MZ-01)' },
              { value: 'YI-ZY-01', label: '普通病房 (YI-ZY-01)' },
              { value: 'JY-JX-01', label: '普通教室 (JY-JX-01)' },
            ]}
          />
          <span>空间：</span>
          <Select
            defaultValue="DS"
            style={{ width: 120 }}
            options={[
              { value: 'DS', label: '地上' },
              { value: 'DX', label: '地下' },
            ]}
          />
          <span>专业：</span>
          <Select
            defaultValue="TJ"
            style={{ width: 120 }}
            options={[
              { value: 'TJ', label: '土建' },
              { value: 'AZ', label: '安装' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}
