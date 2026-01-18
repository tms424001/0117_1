/**
 * 指标计算工作台页面
 * 对齐 specs/05_Index_System/Index_Calculation_Spec.md
 * 
 * 页面结构：
 * - 左栏：维度树（tag/space/prof/scale）
 * - 中栏：预览卡（样本→异常→统计→推荐）
 * - 右栏：参数配置（基准期/异常法/minSample）
 * - 底部：失败/低质量队列
 * 
 * V1.1 Patch：价格基准期口径统一
 * - 参数区显示：目标基准期 targetPriceDate
 * - 预览卡显示：样本数（原始N → 可调价N → 有效N）、缺指数样本数、调价因子范围
 * - 样本列表新增：原基准期、原指数、目标指数、调价系数、调整后单方、included/excludeReason
 */

import { useState, useMemo, Key } from 'react';
import { 
  Tag, Card, Statistic, Table, Progress, 
  Drawer, Descriptions, Tooltip, Alert, message
} from 'antd';
import { 
  CheckOutlined, ReloadOutlined, WarningOutlined,
  CheckCircleOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useNavigate, useParams } from 'react-router-dom';
import { GoldenPage, TreePanel } from '@/components/golden';
import type { IssueItem } from '@/components/golden/BottomPanel';

// Mock 维度树数据
const mockDimensionTree: DataNode[] = [
  {
    key: 'all',
    title: '全部指标 (1250)',
    children: [
      {
        key: 'tag',
        title: '按功能标签',
        children: [
          { key: 'tag:YI', title: '医疗建筑 (320)' },
          { key: 'tag:JY', title: '教育建筑 (280)' },
          { key: 'tag:BG', title: '办公建筑 (250)' },
          { key: 'tag:ZZ', title: '住宅建筑 (400)' },
        ],
      },
      {
        key: 'space',
        title: '按空间',
        children: [
          { key: 'space:DS', title: '地上 (980)' },
          { key: 'space:DX', title: '地下 (180)' },
          { key: 'space:SW', title: '室外 (90)' },
        ],
      },
      {
        key: 'scale',
        title: '按规模档',
        children: [
          { key: 'scale:XS', title: '小型 (300)' },
          { key: 'scale:S', title: '中小型 (350)' },
          { key: 'scale:M', title: '中型 (320)' },
          { key: 'scale:L', title: '大型 (180)' },
          { key: 'scale:XL', title: '特大型 (100)' },
        ],
      },
    ],
  },
];

// Mock 指标数据
interface CostIndex {
  id: string;
  code: string;
  tagCode: string;
  tagName: string;
  space: string;
  profession: string;
  scaleRangeCode: string;
  // V1.1: 样本数统计
  rawSampleCount: number;       // 原始样本数
  adjustableSampleCount: number; // 可调价样本数
  validSampleCount: number;      // 有效样本数（剔除异常后）
  missingIndexCount: number;     // 缺指数样本数
  missingMetaCount: number;      // 缺元数据样本数
  outlierCount: number;
  outlierRatio: number;
  // V1.1: 调价因子统计
  factorMin: number;
  factorMedian: number;
  factorMax: number;
  // 统计值
  p25: number;
  p50: number;
  p75: number;
  mean: number;
  std: number;
  status: 'generated' | 'skipped' | 'warning';
  skipReason?: string;
  // V1.1: 质量提示
  qualityWarnings?: string[];
}

const mockIndexes: CostIndex[] = [
  { 
    id: '1', code: 'IDX-YI-01-DS-TJ-M', tagCode: 'YI-01', tagName: '门诊', space: 'DS', profession: '土建', scaleRangeCode: 'M',
    rawSampleCount: 28, adjustableSampleCount: 26, validSampleCount: 24, missingIndexCount: 1, missingMetaCount: 1, outlierCount: 2, outlierRatio: 8,
    factorMin: 0.92, factorMedian: 1.05, factorMax: 1.18,
    p25: 3200, p50: 3580, p75: 4100, mean: 3650, std: 450, status: 'generated'
  },
  { 
    id: '2', code: 'IDX-YI-01-DS-GPS-M', tagCode: 'YI-01', tagName: '门诊', space: 'DS', profession: '给排水', scaleRangeCode: 'M',
    rawSampleCount: 25, adjustableSampleCount: 22, validSampleCount: 17, missingIndexCount: 2, missingMetaCount: 1, outlierCount: 5, outlierRatio: 23,
    factorMin: 0.88, factorMedian: 1.02, factorMax: 1.25,
    p25: 280, p50: 320, p75: 380, mean: 330, std: 55, status: 'warning',
    qualityWarnings: ['异常值比例过高 (23% > 20%)']
  },
  { 
    id: '3', code: 'IDX-YI-01-DS-NT-M', tagCode: 'YI-01', tagName: '门诊', space: 'DS', profession: '暖通', scaleRangeCode: 'M',
    rawSampleCount: 20, adjustableSampleCount: 19, validSampleCount: 18, missingIndexCount: 0, missingMetaCount: 1, outlierCount: 1, outlierRatio: 6,
    factorMin: 0.95, factorMedian: 1.03, factorMax: 1.12,
    p25: 450, p50: 520, p75: 600, mean: 530, std: 75, status: 'generated'
  },
  { 
    id: '4', code: 'IDX-YI-01-DS-DQ-M', tagCode: 'YI-01', tagName: '门诊', space: 'DS', profession: '电气', scaleRangeCode: 'M',
    rawSampleCount: 22, adjustableSampleCount: 20, validSampleCount: 18, missingIndexCount: 1, missingMetaCount: 1, outlierCount: 2, outlierRatio: 10,
    factorMin: 0.91, factorMedian: 1.04, factorMax: 1.15,
    p25: 380, p50: 450, p75: 520, mean: 455, std: 70, status: 'generated'
  },
  { 
    id: '5', code: 'IDX-YI-01-DS-ZN-M', tagCode: 'YI-01', tagName: '门诊', space: 'DS', profession: '智能化', scaleRangeCode: 'M',
    rawSampleCount: 3, adjustableSampleCount: 2, validSampleCount: 2, missingIndexCount: 1, missingMetaCount: 0, outlierCount: 0, outlierRatio: 0,
    factorMin: 0, factorMedian: 0, factorMax: 0,
    p25: 0, p50: 0, p75: 0, mean: 0, std: 0, status: 'skipped', skipReason: '可调价样本数不足 (2<3)'
  },
  { 
    id: '6', code: 'IDX-YI-02-DS-TJ-M', tagCode: 'YI-02', tagName: '住院', space: 'DS', profession: '土建', scaleRangeCode: 'M',
    rawSampleCount: 35, adjustableSampleCount: 32, validSampleCount: 29, missingIndexCount: 2, missingMetaCount: 1, outlierCount: 3, outlierRatio: 10,
    factorMin: 0.89, factorMedian: 1.06, factorMax: 1.22,
    p25: 3500, p50: 3900, p75: 4400, mean: 3950, std: 480, status: 'generated'
  },
  { 
    id: '7', code: 'IDX-YI-03-DS-TJ-L', tagCode: 'YI-03', tagName: '医技', space: 'DS', profession: '土建', scaleRangeCode: 'L',
    rawSampleCount: 20, adjustableSampleCount: 15, validSampleCount: 11, missingIndexCount: 5, missingMetaCount: 0, outlierCount: 4, outlierRatio: 27,
    factorMin: 0.65, factorMedian: 1.08, factorMax: 1.35,
    p25: 4200, p50: 4800, p75: 5500, mean: 4900, std: 650, status: 'warning',
    qualityWarnings: ['异常值比例过高 (27% > 20%)', '缺指数样本比例过高 (25% > 20%)', '调价系数极端 (0.65 < 0.7)']
  },
];

// Mock 样本数据 (V1.1 Patch: 新增调价相关字段)
interface IndexSample {
  id: string;
  projectName: string;
  unitName: string;
  // V1.1: 原始数据
  originalUnitCost: number;
  originalPriceDate: string;  // 原始价格基准期 (year-month)
  regionKey: string;          // 地区键
  area: number;
  // V1.1: 调价数据
  originalIndexValue: number;
  targetIndexValue: number;
  priceAdjustFactor: number;
  adjustedUnitCost: number;
  // 状态
  included: boolean;
  excludeReason?: 'MISSING_META' | 'MISSING_PRICE_INDEX' | 'OUTLIER' | 'MANUAL_EXCLUDE';
  isOutlier: boolean;
  outlierReason?: string;
}

const mockSamples: IndexSample[] = [
  { 
    id: 's1', projectName: '某医院门诊楼', unitName: '门诊楼', area: 25000,
    originalUnitCost: 3400, originalPriceDate: '2024-06', regionKey: '浙江-杭州',
    originalIndexValue: 105.2, targetIndexValue: 110.5, priceAdjustFactor: 1.05, adjustedUnitCost: 3570,
    included: true, isOutlier: false
  },
  { 
    id: 's2', projectName: '某医院综合楼', unitName: '门诊部分', area: 18000,
    originalUnitCost: 3280, originalPriceDate: '2025-01', regionKey: '浙江-杭州',
    originalIndexValue: 107.8, targetIndexValue: 110.5, priceAdjustFactor: 1.025, adjustedUnitCost: 3362,
    included: true, isOutlier: false
  },
  { 
    id: 's3', projectName: '某社区医院', unitName: '门诊楼', area: 8000,
    originalUnitCost: 3050, originalPriceDate: '2023-12', regionKey: '浙江-宁波',
    originalIndexValue: 102.5, targetIndexValue: 110.5, priceAdjustFactor: 1.078, adjustedUnitCost: 3288,
    included: true, isOutlier: false
  },
  { 
    id: 's4', projectName: '某三甲医院', unitName: '门诊医技楼', area: 35000,
    originalUnitCost: 3800, originalPriceDate: '2025-06', regionKey: '浙江-杭州',
    originalIndexValue: 109.2, targetIndexValue: 110.5, priceAdjustFactor: 1.012, adjustedUnitCost: 3846,
    included: true, isOutlier: false
  },
  { 
    id: 's5', projectName: '某专科医院', unitName: '门诊楼', area: 12000,
    originalUnitCost: 6200, originalPriceDate: '2024-03', regionKey: '浙江-杭州',
    originalIndexValue: 104.5, targetIndexValue: 110.5, priceAdjustFactor: 1.057, adjustedUnitCost: 6553,
    included: false, excludeReason: 'OUTLIER', isOutlier: true, outlierReason: 'IQR 上界超出'
  },
  { 
    id: 's6', projectName: '某县医院', unitName: '门诊楼', area: 6000,
    originalUnitCost: 2900, originalPriceDate: '', regionKey: '浙江-温州',
    originalIndexValue: 0, targetIndexValue: 110.5, priceAdjustFactor: 0, adjustedUnitCost: 0,
    included: false, excludeReason: 'MISSING_META', isOutlier: false
  },
  { 
    id: 's7', projectName: '某乡镇卫生院', unitName: '门诊楼', area: 3000,
    originalUnitCost: 2600, originalPriceDate: '2022-06', regionKey: '浙江-丽水',
    originalIndexValue: 0, targetIndexValue: 110.5, priceAdjustFactor: 0, adjustedUnitCost: 0,
    included: false, excludeReason: 'MISSING_PRICE_INDEX', isOutlier: false
  },
];

// Mock 问题列表 (V1.1 Patch: 新增调价相关警告)
const mockIssues: IssueItem[] = [
  { id: 'w1', type: 'warning', message: 'IDX-YI-01-DS-GPS-M: 异常值比例过高 (23% > 20%)', field: 'outlierRatio' },
  { id: 'w2', type: 'warning', message: 'IDX-YI-03-DS-TJ-L: 异常值比例过高 (27% > 20%)', field: 'outlierRatio' },
  { id: 'w3', type: 'warning', message: 'IDX-YI-03-DS-TJ-L: 缺指数样本比例过高 (25% > 20%)', field: 'INDEX_MISSING_RATIO' },
  { id: 'w4', type: 'warning', message: 'IDX-YI-03-DS-TJ-L: 调价系数极端 (0.65 < 0.7)，请核对指数表', field: 'INDEX_FACTOR_OUTLIER' },
  { id: 'e1', type: 'info', message: 'IDX-YI-01-DS-ZN-M: 可调价样本数不足，已跳过 (2<3)', field: 'sampleCount' },
  { id: 'e2', type: 'info', message: '共 2 个样本因缺少元数据被排除', field: 'MISSING_META' },
  { id: 'e3', type: 'info', message: '共 1 个样本因缺少价格指数被排除', field: 'MISSING_PRICE_INDEX' },
];

export default function CalcWorkbenchPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<CostIndex | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // V1.1: 目标价格基准期
  const [targetPriceDate] = useState<string>('2026-01');

  // 统计数据 (V1.1: 新增样本统计)
  const stats = useMemo(() => {
    const totalRaw = mockIndexes.reduce((sum, i) => sum + i.rawSampleCount, 0);
    const totalAdjustable = mockIndexes.reduce((sum, i) => sum + i.adjustableSampleCount, 0);
    const totalValid = mockIndexes.reduce((sum, i) => sum + i.validSampleCount, 0);
    const totalMissingIndex = mockIndexes.reduce((sum, i) => sum + i.missingIndexCount, 0);
    const totalMissingMeta = mockIndexes.reduce((sum, i) => sum + i.missingMetaCount, 0);
    return {
      total: mockIndexes.length,
      generated: mockIndexes.filter(i => i.status === 'generated').length,
      skipped: mockIndexes.filter(i => i.status === 'skipped').length,
      warning: mockIndexes.filter(i => i.status === 'warning').length,
      // V1.1: 样本统计
      totalRaw,
      totalAdjustable,
      totalValid,
      totalMissingIndex,
      totalMissingMeta,
    };
  }, []);

  // 指标表格列定义
  const indexColumns: ColumnsType<CostIndex> = [
    {
      title: '指标编码',
      dataIndex: 'code',
      width: 200,
      render: (code, record) => (
        <div>
          <div className="font-mono text-blue-600 text-xs">{code}</div>
          <div className="text-xs text-gray-400">
            {record.tagName} · {record.space} · {record.profession}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status, record) => {
        if (status === 'generated') return <Tag color="success">已生成</Tag>;
        if (status === 'skipped') return (
          <Tooltip title={record.skipReason}>
            <Tag color="default">已跳过</Tag>
          </Tooltip>
        );
        if (status === 'warning') return <Tag color="warning">警告</Tag>;
        return null;
      },
    },
    {
      title: '样本数',
      key: 'sampleCount',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={`原始${record.rawSampleCount} → 可调价${record.adjustableSampleCount} → 有效${record.validSampleCount}`}>
          <span className={record.validSampleCount < 3 ? 'text-red-500' : ''}>
            <span className="text-gray-400">{record.rawSampleCount}</span>
            <span className="mx-1">→</span>
            <span className="font-medium">{record.validSampleCount}</span>
            {record.missingIndexCount > 0 && (
              <span className="text-orange-500 text-xs ml-1">
                (-{record.missingIndexCount}缺指数)
              </span>
            )}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '调价因子',
      key: 'factor',
      width: 100,
      render: (_, record) => {
        if (record.status === 'skipped') return '-';
        const hasExtreme = record.factorMin < 0.7 || record.factorMax > 1.3;
        return (
          <Tooltip title={`min: ${record.factorMin} / median: ${record.factorMedian} / max: ${record.factorMax}`}>
            <span className={hasExtreme ? 'text-orange-500' : 'text-gray-600'}>
              {record.factorMin.toFixed(2)}~{record.factorMax.toFixed(2)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '异常比例',
      dataIndex: 'outlierRatio',
      width: 90,
      render: (ratio) => (
        <span className={ratio > 20 ? 'text-orange-500 font-medium' : 'text-gray-600'}>
          {ratio}%
        </span>
      ),
    },
    {
      title: 'P25',
      dataIndex: 'p25',
      width: 80,
      align: 'right',
      render: (v) => v > 0 ? v.toLocaleString() : '-',
    },
    {
      title: 'P50',
      dataIndex: 'p50',
      width: 80,
      align: 'right',
      render: (v) => v > 0 ? <span className="font-medium">{v.toLocaleString()}</span> : '-',
    },
    {
      title: 'P75',
      dataIndex: 'p75',
      width: 80,
      align: 'right',
      render: (v) => v > 0 ? v.toLocaleString() : '-',
    },
  ];

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    setSelectedDimension(keys[0] as string || 'all');
  };

  // 行点击
  const handleRowClick = (index: CostIndex) => {
    setSelectedIndex(index);
    setDrawerOpen(true);
  };

  // 完成
  const handleComplete = () => {
    message.success('计算任务已完成，指标已生成为草稿状态');
    navigate('/indexes/list');
  };

  return (
    <GoldenPage
      header={{
        title: '指标计算工作台',
        subtitle: `任务 #${taskId} - 2025年12月全量计算`,
        showBack: true,
        backPath: '/indexes/calc/tasks',
        breadcrumbs: [
          { title: '指标系统', path: '/indexes/list' },
          { title: '计算任务', path: '/indexes/calc/tasks' },
          { title: '工作台' },
        ],
        actions: [
          { key: 'refresh', label: '刷新', icon: <ReloadOutlined /> },
          { key: 'complete', label: '完成生成', type: 'primary', icon: <CheckOutlined />, onClick: handleComplete },
        ],
        extra: (
          <div className="flex items-center gap-4">
            <Tag color="blue">目标基准期: {targetPriceDate}</Tag>
            <Progress 
              percent={100} 
              size="small" 
              style={{ width: 100 }}
            />
            <span className="text-sm">
              <span className="text-green-600">{stats.generated}</span> 生成 / 
              <span className="text-gray-400 ml-1">{stats.skipped}</span> 跳过 / 
              <span className="text-orange-500 ml-1">{stats.warning}</span> 警告
            </span>
          </div>
        ),
      }}
      treePanel={
        <TreePanel
          title="维度筛选"
          data={mockDimensionTree}
          selectedKeys={[selectedDimension]}
          expandedKeys={['all', 'tag', 'space', 'scale']}
          onSelect={handleTreeSelect}
          showSearch={true}
          searchPlaceholder="搜索维度..."
        />
      }
      treePanelWidth={240}
      drawerOpen={drawerOpen}
      drawer={
        selectedIndex && (
          <IndexDetailDrawer
            index={selectedIndex}
            samples={mockSamples}
            onClose={() => setDrawerOpen(false)}
          />
        )
      }
      drawerWidth={500}
      showBottomPanel={mockIssues.length > 0}
      bottomPanel={{
        issues: mockIssues,
      }}
      bottomPanelHeight={160}
    >
      {/* 统计卡片 - V1.1: 新增样本统计 */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        <Card size="small">
          <Statistic 
            title="总指标数" 
            value={stats.total} 
            valueStyle={{ color: '#1890ff', fontSize: 20 }}
          />
        </Card>
        <Card size="small">
          <Statistic 
            title="已生成" 
            value={stats.generated} 
            valueStyle={{ color: '#52c41a', fontSize: 20 }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
        <Card size="small">
          <Statistic 
            title="已跳过" 
            value={stats.skipped} 
            valueStyle={{ color: '#8c8c8c', fontSize: 20 }}
            prefix={<MinusCircleOutlined />}
          />
        </Card>
        <Card size="small">
          <Statistic 
            title="警告" 
            value={stats.warning} 
            valueStyle={{ color: '#faad14', fontSize: 20 }}
            prefix={<WarningOutlined />}
          />
        </Card>
        <Card size="small">
          <Tooltip title={`原始${stats.totalRaw} → 可调价${stats.totalAdjustable} → 有效${stats.totalValid}`}>
            <Statistic 
              title="样本流转" 
              value={`${stats.totalRaw}→${stats.totalValid}`}
              valueStyle={{ fontSize: 16 }}
            />
          </Tooltip>
        </Card>
        <Card size="small">
          <Tooltip title={`缺元数据: ${stats.totalMissingMeta} / 缺指数: ${stats.totalMissingIndex}`}>
            <Statistic 
              title="排除样本" 
              value={stats.totalMissingMeta + stats.totalMissingIndex}
              valueStyle={{ color: stats.totalMissingIndex > 5 ? '#faad14' : '#8c8c8c', fontSize: 20 }}
            />
          </Tooltip>
        </Card>
      </div>

      {/* 规则提示 - V1.1: 新增调价规则 */}
      <Alert
        message="计算规则 (V1.1)"
        description={
          <span>
            样本数 &lt; 3 将跳过 | 异常比例 &gt; 20% 触发警告 | 推荐值使用 P25/P50/P75 | 
            <strong> 调价系数极端 (&lt;0.7 或 &gt;1.3) 触发警告</strong> | 
            <strong> 缺指数样本比例 &gt; 20% 触发警告</strong>
          </span>
        }
        type="info"
        showIcon
        className="mb-4"
      />

      {/* 指标列表 */}
      <Card title="指标预览" size="small">
        <Table
          columns={indexColumns}
          dataSource={mockIndexes}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: 'cursor-pointer hover:bg-blue-50',
          })}
        />
      </Card>
    </GoldenPage>
  );
}

// 指标详情抽屉
interface IndexDetailDrawerProps {
  index: CostIndex;
  samples: IndexSample[];
  onClose: () => void;
}

function IndexDetailDrawer({ index, samples, onClose }: IndexDetailDrawerProps) {
  // 样本表格列 - V1.1: 新增调价相关字段
  const sampleColumns: ColumnsType<IndexSample> = [
    {
      title: '项目',
      dataIndex: 'projectName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '原基准期',
      dataIndex: 'originalPriceDate',
      width: 70,
      render: (v) => v || <span className="text-red-500">缺失</span>,
    },
    {
      title: '原单方',
      dataIndex: 'originalUnitCost',
      width: 70,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '调价系数',
      dataIndex: 'priceAdjustFactor',
      width: 70,
      align: 'right',
      render: (v, record) => {
        if (!record.included && record.excludeReason !== 'OUTLIER') return '-';
        const isExtreme = v < 0.7 || v > 1.3;
        return <span className={isExtreme ? 'text-orange-500' : ''}>{v.toFixed(3)}</span>;
      },
    },
    {
      title: '调整后单方',
      dataIndex: 'adjustedUnitCost',
      width: 80,
      align: 'right',
      render: (v, record) => {
        if (!record.included && record.excludeReason !== 'OUTLIER') return '-';
        return (
          <span className={record.isOutlier ? 'text-red-500 line-through' : 'font-medium'}>
            {v.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_, record) => {
        if (!record.included) {
          const reasonMap: Record<string, { text: string; color: string }> = {
            'MISSING_META': { text: '缺元数据', color: 'default' },
            'MISSING_PRICE_INDEX': { text: '缺指数', color: 'orange' },
            'OUTLIER': { text: '异常', color: 'error' },
            'MANUAL_EXCLUDE': { text: '手动排除', color: 'default' },
          };
          const config = reasonMap[record.excludeReason || ''] || { text: '排除', color: 'default' };
          return (
            <Tooltip title={record.outlierReason || record.excludeReason}>
              <Tag color={config.color}>{config.text}</Tag>
            </Tooltip>
          );
        }
        return <Tag color="success">有效</Tag>;
      },
    },
  ];

  return (
    <Drawer
      title="指标详情"
      open={true}
      onClose={onClose}
      width={500}
    >
      {/* 基本信息 */}
      <Descriptions column={2} size="small" bordered className="mb-4">
        <Descriptions.Item label="指标编码" span={2}>
          <span className="font-mono text-blue-600">{index.code}</span>
        </Descriptions.Item>
        <Descriptions.Item label="功能标签">{index.tagName}</Descriptions.Item>
        <Descriptions.Item label="空间">{index.space}</Descriptions.Item>
        <Descriptions.Item label="专业">{index.profession}</Descriptions.Item>
        <Descriptions.Item label="规模档">{index.scaleRangeCode}</Descriptions.Item>
        <Descriptions.Item label="状态">
          {index.status === 'generated' && <Tag color="success">已生成</Tag>}
          {index.status === 'skipped' && <Tag color="default">已跳过</Tag>}
          {index.status === 'warning' && <Tag color="warning">警告</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="样本数">
          <Tooltip title={`原始${index.rawSampleCount} → 可调价${index.adjustableSampleCount} → 有效${index.validSampleCount}`}>
            <span>
              {index.rawSampleCount} → {index.validSampleCount}
              {index.missingIndexCount > 0 && (
                <span className="text-orange-500 ml-1">(-{index.missingIndexCount}缺指数)</span>
              )}
              {index.outlierCount > 0 && (
                <span className="text-red-500 ml-1">(-{index.outlierCount}异常)</span>
              )}
            </span>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="调价因子">
          {index.status !== 'skipped' ? (
            <span className={(index.factorMin < 0.7 || index.factorMax > 1.3) ? 'text-orange-500' : ''}>
              {index.factorMin.toFixed(2)} ~ {index.factorMax.toFixed(2)} (中位: {index.factorMedian.toFixed(2)})
            </span>
          ) : '-'}
        </Descriptions.Item>
      </Descriptions>

      {/* 统计值 */}
      {index.status !== 'skipped' && (
        <Card title="统计值" size="small" className="mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-500 text-xs">P25</div>
              <div className="text-lg font-medium">{index.p25.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 rounded p-2">
              <div className="text-blue-600 text-xs">P50 (推荐)</div>
              <div className="text-xl font-bold text-blue-600">{index.p50.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">P75</div>
              <div className="text-lg font-medium">{index.p75.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>均值: {index.mean.toLocaleString()}</span>
            <span>标准差: {index.std.toLocaleString()}</span>
            <span>异常比例: <span className={index.outlierRatio > 20 ? 'text-orange-500' : ''}>{index.outlierRatio}%</span></span>
          </div>
        </Card>
      )}

      {/* 样本列表 */}
      <Card title="样本列表" size="small">
        <Table
          columns={sampleColumns}
          dataSource={samples}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </Card>
    </Drawer>
  );
}
