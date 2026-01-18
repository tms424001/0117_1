/**
 * 快速估算工作台页面
 * 对齐 specs/06_Estimation_Pricing/Estimation_Spec.md
 * 
 * 页面结构：
 * - 左栏：单体列表（可多个）
 * - 中栏：输入区（功能标签、面积、规模档、地区、分位）
 * - 右栏：推荐指标卡（TopK，含质量/样本量/层级）
 * - 底部：warnings（缺指标/低质量/兜底层级）
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Table,
  Statistic,
  Divider,
  Tag,
  Radio,
  Tooltip,
  Drawer,
  Descriptions,
  Progress,
  message,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { GoldenPage } from '@/components/golden';
import type { IssueItem } from '@/components/golden/BottomPanel';

// 估算单体
interface EstimationUnit {
  key: string;
  unitName: string;
  tagCode: string;
  tagName: string;
  space: 'DS' | 'DX' | 'SW';
  scaleRangeCode: string;
  scaleRangeName: string;
  area: number;
  functionalScale?: number;
  percentile: 'P25' | 'P50' | 'P75';
  unitCost: number;
  totalCost: number;
  indexCode?: string;
  indexLevel?: 'L4' | 'L3' | 'L2' | 'L1';
  sampleCount?: number;
  quality?: 'high' | 'medium' | 'low';
  hasWarning?: boolean;
  warningMsg?: string;
}

// 推荐指标
interface IndexRecommend {
  code: string;
  tagName: string;
  space: string;
  profession: string;
  scaleRange: string;
  level: 'L4' | 'L3' | 'L2' | 'L1';
  p25: number;
  p50: number;
  p75: number;
  sampleCount: number;
  quality: 'high' | 'medium' | 'low';
  isSelected?: boolean;
}

const mockUnits: EstimationUnit[] = [
  {
    key: '1', unitName: '门诊楼', tagCode: 'YI-01', tagName: '门诊', space: 'DS',
    scaleRangeCode: 'M', scaleRangeName: '中型', area: 25000, functionalScale: 1500,
    percentile: 'P50', unitCost: 3580, totalCost: 89500000,
    indexCode: 'IDX-YI-01-DS-M', indexLevel: 'L4', sampleCount: 25, quality: 'high',
  },
  {
    key: '2', unitName: '住院楼', tagCode: 'YI-02', tagName: '住院', space: 'DS',
    scaleRangeCode: 'L', scaleRangeName: '大型', area: 35000, functionalScale: 500,
    percentile: 'P50', unitCost: 3900, totalCost: 136500000,
    indexCode: 'IDX-YI-02-DS-L', indexLevel: 'L4', sampleCount: 30, quality: 'high',
  },
  {
    key: '3', unitName: '医技楼', tagCode: 'YI-03', tagName: '医技', space: 'DS',
    scaleRangeCode: 'M', scaleRangeName: '中型', area: 12000,
    percentile: 'P50', unitCost: 4200, totalCost: 50400000,
    indexCode: 'IDX-YI-03-DS-M', indexLevel: 'L3', sampleCount: 8, quality: 'medium',
    hasWarning: true, warningMsg: '使用L3层级指标（缺少L4）',
  },
  {
    key: '4', unitName: '地下车库', tagCode: 'SW-01', tagName: '地下停车', space: 'DX',
    scaleRangeCode: 'M', scaleRangeName: '中型', area: 15000, functionalScale: 300,
    percentile: 'P50', unitCost: 2800, totalCost: 42000000,
    indexCode: 'IDX-SW-01-DX-M', indexLevel: 'L4', sampleCount: 18, quality: 'high',
  },
];

const mockRecommends: IndexRecommend[] = [
  { code: 'IDX-YI-01-DS-TJ-M', tagName: '门诊', space: 'DS', profession: '土建', scaleRange: 'M', level: 'L4', p25: 3200, p50: 3580, p75: 4100, sampleCount: 25, quality: 'high', isSelected: true },
  { code: 'IDX-YI-01-DS-GPS-M', tagName: '门诊', space: 'DS', profession: '给排水', scaleRange: 'M', level: 'L4', p25: 280, p50: 320, p75: 380, sampleCount: 22, quality: 'medium' },
  { code: 'IDX-YI-01-DS-NT-M', tagName: '门诊', space: 'DS', profession: '暖通', scaleRange: 'M', level: 'L4', p25: 450, p50: 520, p75: 600, sampleCount: 18, quality: 'high' },
  { code: 'IDX-YI-01-DS-DQ-M', tagName: '门诊', space: 'DS', profession: '电气', scaleRange: 'M', level: 'L4', p25: 380, p50: 450, p75: 520, sampleCount: 20, quality: 'high' },
];

const mockIssues: IssueItem[] = [
  { id: 'w1', type: 'warning', message: '医技楼：使用L3层级指标（缺少L4精确匹配）', field: 'indexLevel' },
  { id: 'w2', type: 'info', message: '地下车库：样本量较少（18个），建议关注估算偏差', field: 'sampleCount' },
];

const tagOptions = [
  { value: 'YI-01', label: '门诊 (YI-01)' },
  { value: 'YI-02', label: '住院 (YI-02)' },
  { value: 'YI-03', label: '医技 (YI-03)' },
  { value: 'YI-04', label: '行政后勤 (YI-04)' },
  { value: 'JY-01', label: '教学楼 (JY-01)' },
  { value: 'BG-01', label: '行政办公 (BG-01)' },
  { value: 'SW-01', label: '地下停车 (SW-01)' },
];

const scaleOptions = [
  { value: 'XS', label: '小型' },
  { value: 'S', label: '中小型' },
  { value: 'M', label: '中型' },
  { value: 'L', label: '大型' },
  { value: 'XL', label: '特大型' },
];

export default function EstimationWorkbench() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [units, setUnits] = useState<EstimationUnit[]>(taskId ? mockUnits : []);
  const [selectedUnit, setSelectedUnit] = useState<EstimationUnit | null>(mockUnits[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [indexVersion, setIndexVersion] = useState('V2026.01');
  const [globalPercentile, setGlobalPercentile] = useState<'P25' | 'P50' | 'P75'>('P50');

  // 统计
  const stats = useMemo(() => {
    const totalArea = units.reduce((sum, u) => sum + u.area, 0);
    const totalCost = units.reduce((sum, u) => sum + u.totalCost, 0);
    const avgUnitCost = totalArea > 0 ? totalCost / totalArea : 0;
    const warningCount = units.filter(u => u.hasWarning).length;
    return { totalArea, totalCost, avgUnitCost, warningCount };
  }, [units]);

  // 单体列表列定义
  const unitColumns: ColumnsType<EstimationUnit> = [
    {
      title: '单体',
      dataIndex: 'unitName',
      width: 120,
      render: (name, record) => (
        <div className="flex items-center gap-1">
          {record.hasWarning && <WarningOutlined className="text-orange-500" />}
          <span className={record.hasWarning ? 'text-orange-600' : ''}>{name}</span>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tagName',
      width: 80,
      render: (tag) => <Tag color="blue">{tag}</Tag>,
    },
    {
      title: '空间',
      dataIndex: 'space',
      width: 60,
      render: (space) => {
        const colors: Record<string, string> = { DS: 'blue', DX: 'purple', SW: 'green' };
        return <Tag color={colors[space]}>{space}</Tag>;
      },
    },
    {
      title: '面积',
      dataIndex: 'area',
      width: 80,
      align: 'right',
      render: (v) => `${(v / 1000).toFixed(1)}k`,
    },
    {
      title: '单方',
      dataIndex: 'unitCost',
      width: 80,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '小计(万)',
      dataIndex: 'totalCost',
      width: 90,
      align: 'right',
      render: (v) => (v / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      title: '指标',
      key: 'index',
      width: 60,
      render: (_, record) => {
        const levelColors: Record<string, string> = { L4: 'green', L3: 'blue', L2: 'orange', L1: 'red' };
        return record.indexLevel ? (
          <Tooltip title={`${record.indexCode} (${record.sampleCount}样本)`}>
            <Tag color={levelColors[record.indexLevel]}>{record.indexLevel}</Tag>
          </Tooltip>
        ) : '-';
      },
    },
  ];

  // 添加单体
  const handleAddUnit = () => {
    const newUnit: EstimationUnit = {
      key: Date.now().toString(),
      unitName: `单体${units.length + 1}`,
      tagCode: '',
      tagName: '',
      space: 'DS',
      scaleRangeCode: '',
      scaleRangeName: '',
      area: 0,
      percentile: globalPercentile,
      unitCost: 0,
      totalCost: 0,
    };
    setUnits([...units, newUnit]);
    setSelectedUnit(newUnit);
  };

  // 删除单体
  const handleDeleteUnit = (key: string) => {
    const newUnits = units.filter((u) => u.key !== key);
    setUnits(newUnits);
    if (selectedUnit?.key === key) {
      setSelectedUnit(newUnits[0] || null);
    }
  };

  // 更新单体
  const handleUnitChange = (key: string, field: string, value: unknown) => {
    setUnits(
      units.map((u) => {
        if (u.key === key) {
          const updated = { ...u, [field]: value };
          if (field === 'area' || field === 'unitCost') {
            updated.totalCost = (updated.area || 0) * (updated.unitCost || 0);
          }
          return updated;
        }
        return u;
      })
    );
  };

  // 保存
  const handleSave = () => {
    message.success('估算已保存');
  };

  // 计算
  const handleCalculate = () => {
    message.loading('正在匹配指标...');
    setTimeout(() => {
      message.success('指标匹配完成');
    }, 1000);
  };

  // 导出
  const handleExport = () => {
    message.success('估算报告已导出');
  };

  // 复制方案
  const handleCopy = () => {
    message.success('方案已复制，可修改分位进行对比');
  };

  return (
    <GoldenPage
      header={{
        title: '快速估算工作台',
        subtitle: taskId ? `任务 #${taskId}` : '新建估算',
        showBack: true,
        backPath: '/estimation/tasks',
        breadcrumbs: [
          { title: '估算', path: '/estimation/tasks' },
          { title: '工作台' },
        ],
        actions: [
          { key: 'copy', label: '复制方案', icon: <CopyOutlined />, onClick: handleCopy },
          { key: 'export', label: '导出', icon: <DownloadOutlined />, onClick: handleExport },
          { key: 'calc', label: '重新计算', icon: <CalculatorOutlined />, onClick: handleCalculate },
          { key: 'save', label: '保存', type: 'primary', icon: <SaveOutlined />, onClick: handleSave },
        ],
        extra: (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              指标版本: <Tag color="blue">{indexVersion}</Tag>
            </span>
            <span className="text-sm">
              分位: 
              <Radio.Group 
                value={globalPercentile} 
                onChange={(e) => setGlobalPercentile(e.target.value)}
                size="small"
                className="ml-2"
              >
                <Radio.Button value="P25">P25</Radio.Button>
                <Radio.Button value="P50">P50</Radio.Button>
                <Radio.Button value="P75">P75</Radio.Button>
              </Radio.Group>
            </span>
          </div>
        ),
      }}
      showBottomPanel={mockIssues.length > 0}
      bottomPanel={{
        issues: mockIssues,
      }}
      bottomPanelHeight={120}
    >
      <div className="flex gap-4 h-full">
        {/* 左侧：单体列表 */}
        <div className="w-[420px] flex-shrink-0">
          <Card 
            title="单体列表" 
            size="small"
            extra={
              <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddUnit}>
                添加
              </Button>
            }
          >
            <Table
              columns={unitColumns}
              dataSource={units}
              rowKey="key"
              size="small"
              pagination={false}
              scroll={{ y: 300 }}
              onRow={(record) => ({
                onClick: () => setSelectedUnit(record),
                className: `cursor-pointer ${selectedUnit?.key === record.key ? 'bg-blue-50' : ''}`,
              })}
            />
          </Card>

          {/* 汇总卡片 */}
          <Card title="估算汇总" size="small" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Statistic title="总面积" value={stats.totalArea} suffix="m²" valueStyle={{ fontSize: 20 }} />
              <Statistic title="总造价" value={stats.totalCost / 10000} suffix="万" precision={0} valueStyle={{ fontSize: 20, color: '#1890ff' }} />
              <Statistic title="综合单方" value={stats.avgUnitCost} prefix="¥" suffix="/m²" precision={0} valueStyle={{ fontSize: 20 }} />
              <div>
                <div className="text-gray-500 text-xs mb-1">单体数 / 警告</div>
                <div className="text-xl">
                  {units.length} / <span className={stats.warningCount > 0 ? 'text-orange-500' : 'text-gray-400'}>{stats.warningCount}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 中间：输入区 */}
        <div className="flex-1">
          {selectedUnit ? (
            <Card title={`配置: ${selectedUnit.unitName}`} size="small">
              <Form layout="vertical" size="small">
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item label="单体名称">
                    <Input 
                      value={selectedUnit.unitName}
                      onChange={(e) => handleUnitChange(selectedUnit.key, 'unitName', e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="功能标签">
                    <Select
                      value={selectedUnit.tagCode || undefined}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'tagCode', v)}
                      options={tagOptions}
                      placeholder="选择标签"
                    />
                  </Form.Item>
                  <Form.Item label="空间类型">
                    <Select
                      value={selectedUnit.space}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'space', v)}
                      options={[
                        { value: 'DS', label: '地上 (DS)' },
                        { value: 'DX', label: '地下 (DX)' },
                        { value: 'SW', label: '室外 (SW)' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="建筑面积 (m²)">
                    <InputNumber
                      value={selectedUnit.area}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'area', v || 0)}
                      min={0}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item label="功能规模">
                    <InputNumber
                      value={selectedUnit.functionalScale}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'functionalScale', v)}
                      min={0}
                      className="w-full"
                      placeholder="如床位数"
                    />
                  </Form.Item>
                  <Form.Item label="规模档">
                    <Select
                      value={selectedUnit.scaleRangeCode || undefined}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'scaleRangeCode', v)}
                      options={scaleOptions}
                      placeholder="选择规模档"
                    />
                  </Form.Item>
                  <Form.Item label="分位选择">
                    <Radio.Group 
                      value={selectedUnit.percentile}
                      onChange={(e) => handleUnitChange(selectedUnit.key, 'percentile', e.target.value)}
                    >
                      <Radio.Button value="P25">P25</Radio.Button>
                      <Radio.Button value="P50">P50</Radio.Button>
                      <Radio.Button value="P75">P75</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="单方造价 (元/m²)">
                    <InputNumber
                      value={selectedUnit.unitCost}
                      onChange={(v) => handleUnitChange(selectedUnit.key, 'unitCost', v || 0)}
                      min={0}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item label="小计 (万元)">
                    <InputNumber
                      value={selectedUnit.totalCost / 10000}
                      disabled
                      className="w-full"
                    />
                  </Form.Item>
                </div>

                {selectedUnit.hasWarning && (
                  <Alert
                    message={selectedUnit.warningMsg}
                    type="warning"
                    showIcon
                    className="mt-2"
                  />
                )}

                <div className="flex justify-end mt-4">
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteUnit(selectedUnit.key)}
                  >
                    删除单体
                  </Button>
                </div>
              </Form>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-4">📊</div>
                <div>请选择或添加单体</div>
              </div>
            </Card>
          )}

          {/* 推荐指标卡 */}
          {selectedUnit && (
            <Card title="推荐指标 (TopK)" size="small" className="mt-4">
              <div className="space-y-2">
                {mockRecommends.map((rec) => (
                  <div 
                    key={rec.code}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      rec.isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rec.isSelected && <CheckCircleOutlined className="text-blue-500" />}
                        <span className="font-mono text-xs text-gray-600">{rec.code}</span>
                        <Tag color={rec.level === 'L4' ? 'green' : rec.level === 'L3' ? 'blue' : 'orange'}>
                          {rec.level}
                        </Tag>
                        <Tag>{rec.profession}</Tag>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">P25: {rec.p25}</span>
                        <span className="font-medium text-blue-600">P50: {rec.p50}</span>
                        <span className="text-gray-400">P75: {rec.p75}</span>
                        <Tooltip title={`${rec.sampleCount} 个样本`}>
                          <span className={rec.quality === 'high' ? 'text-green-600' : 'text-orange-500'}>
                            <StarOutlined /> {rec.sampleCount}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </GoldenPage>
  );
}
