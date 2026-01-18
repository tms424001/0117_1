import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Timeline,
} from 'antd';
import {
  RiseOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// 概览统计数据
const overviewStats = {
  totalIndexes: 1286,
  weeklyNewIndexes: 12,
  totalSamples: 8542,
  weeklyNewSamples: 156,
  coverageRate: 78,
  coveredTags: 186,
  totalTags: 239,
  avgQualityScore: 82.5,
  qualityLevelARate: 45,
};

// 质量分布数据
const qualityDistribution = {
  levelA: 45,
  levelB: 32,
  levelC: 18,
  levelD: 5,
};

// 分类统计数据
interface CategoryStat {
  categoryCode: string;
  categoryName: string;
  indexCount: number;
  sampleCount: number;
  coverageRate: number;
  avgQualityScore: number;
}

const categoryStats: CategoryStat[] = [
  { categoryCode: 'YL', categoryName: '医疗卫生', indexCount: 156, sampleCount: 892, coverageRate: 85, avgQualityScore: 86 },
  { categoryCode: 'JZ', categoryName: '居住', indexCount: 186, sampleCount: 1205, coverageRate: 92, avgQualityScore: 84 },
  { categoryCode: 'JY', categoryName: '教育', indexCount: 142, sampleCount: 756, coverageRate: 80, avgQualityScore: 83 },
  { categoryCode: 'BG', categoryName: '办公', indexCount: 98, sampleCount: 523, coverageRate: 75, avgQualityScore: 81 },
  { categoryCode: 'SY', categoryName: '商业', indexCount: 89, sampleCount: 412, coverageRate: 68, avgQualityScore: 79 },
  { categoryCode: 'JD', categoryName: '酒店', indexCount: 78, sampleCount: 356, coverageRate: 65, avgQualityScore: 80 },
  { categoryCode: 'WH', categoryName: '文化', indexCount: 65, sampleCount: 298, coverageRate: 58, avgQualityScore: 78 },
  { categoryCode: 'TY', categoryName: '体育', indexCount: 52, sampleCount: 245, coverageRate: 52, avgQualityScore: 77 },
  { categoryCode: 'JT', categoryName: '交通', indexCount: 45, sampleCount: 198, coverageRate: 48, avgQualityScore: 76 },
  { categoryCode: 'GY', categoryName: '工业', indexCount: 68, sampleCount: 312, coverageRate: 55, avgQualityScore: 75 },
];

// 近期动态
const recentActivities = [
  { time: '2026-01-17', content: '新增样本 23个', type: 'add' },
  { time: '2026-01-15', content: '更新医疗类指标 12个', type: 'update' },
  { time: '2026-01-10', content: '发布版本 2026.01', type: 'publish' },
  { time: '2026-01-05', content: '导入项目 5个', type: 'import' },
  { time: '2026-01-01', content: '全量重算完成', type: 'calculate' },
];

const IndexOverviewPage: React.FC = () => {
  // 分类统计列定义
  const categoryColumns: ColumnsType<CategoryStat> = [
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: '指标数',
      dataIndex: 'indexCount',
      key: 'indexCount',
      width: 80,
      align: 'right',
      render: (v) => <span className="text-blue-600">{v}</span>,
    },
    {
      title: '样本数',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 80,
      align: 'right',
    },
    {
      title: '覆盖率',
      dataIndex: 'coverageRate',
      key: 'coverageRate',
      width: 150,
      render: (v) => (
        <Progress
          percent={v}
          size="small"
          strokeColor={v >= 80 ? '#52c41a' : v >= 60 ? '#1890ff' : '#faad14'}
        />
      ),
    },
    {
      title: '质量分',
      dataIndex: 'avgQualityScore',
      key: 'avgQualityScore',
      width: 80,
      align: 'center',
      render: (v) => (
        <Tag color={v >= 80 ? 'green' : v >= 70 ? 'blue' : 'orange'}>{v}</Tag>
      ),
    },
  ];

  // 获取动态图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'update':
        return <BarChartOutlined style={{ color: '#1890ff' }} />;
      case 'publish':
        return <CheckCircleOutlined style={{ color: '#722ed1' }} />;
      case 'import':
        return <DatabaseOutlined style={{ color: '#fa8c16' }} />;
      case 'calculate':
        return <ClockCircleOutlined style={{ color: '#13c2c2' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">指标统计概览</span>
          <span className="text-gray-400">当前版本：2026.01</span>
        </div>
      </Card>

      {/* 核心指标 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="指标总数"
              value={overviewStats.totalIndexes}
              suffix={
                <span className="text-xs text-green-500">
                  ↑{overviewStats.weeklyNewIndexes} 本周
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="样本总数"
              value={overviewStats.totalSamples}
              suffix={
                <span className="text-xs text-green-500">
                  ↑{overviewStats.weeklyNewSamples} 本周
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="覆盖率"
              value={overviewStats.coverageRate}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="text-xs text-gray-400 mt-1">
              {overviewStats.coveredTags}/{overviewStats.totalTags} 标签
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均质量分"
              value={overviewStats.avgQualityScore}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="text-xs text-gray-400 mt-1">
              A级占 {overviewStats.qualityLevelARate}%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 分类覆盖情况 */}
      <Card size="small" title="分类覆盖情况">
        <Table
          rowKey="categoryCode"
          columns={categoryColumns}
          dataSource={categoryStats}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 质量分布 + 近期动态 */}
      <Row gutter={16}>
        <Col span={10}>
          <Card size="small" title="质量分布">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>A级 (≥85分)</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={qualityDistribution.levelA}
                    showInfo={false}
                    strokeColor="#52c41a"
                    style={{ width: 150 }}
                  />
                  <span className="w-12 text-right">{qualityDistribution.levelA}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>B级 (70-84分)</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={qualityDistribution.levelB}
                    showInfo={false}
                    strokeColor="#1890ff"
                    style={{ width: 150 }}
                  />
                  <span className="w-12 text-right">{qualityDistribution.levelB}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>C级 (60-69分)</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={qualityDistribution.levelC}
                    showInfo={false}
                    strokeColor="#faad14"
                    style={{ width: 150 }}
                  />
                  <span className="w-12 text-right">{qualityDistribution.levelC}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>D级 (&lt;60分)</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={qualityDistribution.levelD}
                    showInfo={false}
                    strokeColor="#f5222d"
                    style={{ width: 150 }}
                  />
                  <span className="w-12 text-right">{qualityDistribution.levelD}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Card size="small" title="近期动态">
            <Timeline
              items={recentActivities.map((item) => ({
                dot: getActivityIcon(item.type),
                children: (
                  <div className="flex justify-between">
                    <span>{item.content}</span>
                    <span className="text-gray-400">{item.time}</span>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IndexOverviewPage;
