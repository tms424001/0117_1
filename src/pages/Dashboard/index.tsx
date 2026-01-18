import { Row, Col, Card, Statistic, Table, Progress } from 'antd';
import {
  ProjectOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const statisticsData = [
  { title: '项目总数', value: 128, icon: <ProjectOutlined />, color: '#1677ff' },
  { title: '指标数量', value: 3456, icon: <BarChartOutlined />, color: '#52c41a' },
  { title: '估算任务', value: 42, icon: <FileTextOutlined />, color: '#faad14' },
  { title: '已完成', value: 96, icon: <CheckCircleOutlined />, color: '#722ed1' },
];

const recentProjects = [
  { key: '1', name: 'XX医院门诊楼', type: '医疗', area: 25000, status: '已完成', progress: 100 },
  { key: '2', name: 'XX学校教学楼', type: '教育', area: 18000, status: '标签化中', progress: 65 },
  { key: '3', name: 'XX办公大厦', type: '办公', area: 42000, status: '导入中', progress: 30 },
  { key: '4', name: 'XX住宅小区', type: '住宅', area: 85000, status: '待处理', progress: 0 },
];

const columns = [
  { title: '项目名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
  { title: '面积(m²)', dataIndex: 'area', key: 'area', render: (v: number) => v.toLocaleString() },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 150,
    render: (v: number) => <Progress percent={v} size="small" />,
  },
];

const getIndexDistributionOption = () => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 1048, name: '医疗建筑' },
        { value: 735, name: '教育建筑' },
        { value: 580, name: '办公建筑' },
        { value: 484, name: '住宅建筑' },
        { value: 300, name: '其他' },
      ],
    },
  ],
});

const getTrendOption = () => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '新增项目',
      type: 'line',
      smooth: true,
      data: [12, 19, 15, 25, 22, 30],
      areaStyle: { opacity: 0.3 },
    },
    {
      name: '新增指标',
      type: 'line',
      smooth: true,
      data: [150, 230, 180, 290, 250, 340],
      areaStyle: { opacity: 0.3 },
    },
  ],
});

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>工作台</h1>
      </div>

      <Row gutter={[16, 16]}>
        {statisticsData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color }}>{item.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={16}>
          <Card title="数据趋势">
            <ReactECharts option={getTrendOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="指标分布">
            <ReactECharts option={getIndexDistributionOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card title="最近项目">
            <Table
              columns={columns}
              dataSource={recentProjects}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
