/**
 * 标签化工作台页面
 * 对齐 specs/04_Data_Tagging/Tagging_Process_Spec.md
 * 
 * 页面结构：
 * - 顶部：进度条 + Stepper（5步）+ 操作按钮
 * - 左栏：原始工程树
 * - 中栏：单体列表（作业清单）
 * - 右栏：单体配置面板（随 step 切换）
 * - 底部：问题面板
 */

import { useState, useMemo, Key } from 'react';
import { 
  Button, Tag, Steps, Progress, Drawer, Form, Input, 
  Select, InputNumber, Table, Tooltip, message, Alert, Badge
} from 'antd';
import { 
  SaveOutlined, CheckOutlined, ArrowLeftOutlined,
  ExclamationCircleOutlined, WarningOutlined, 
  CheckCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useNavigate, useParams } from 'react-router-dom';
import { GoldenPage, TreePanel, GridPanel } from '@/components/golden';
import type { IssueItem } from '@/components/golden/BottomPanel';

// 步骤定义
const STEPS = [
  { title: '单体识别', description: '合并/拆分单体' },
  { title: '标签分配', description: '功能标签推荐' },
  { title: '面积录入', description: '面积与规模' },
  { title: '造价归集', description: '空间×专业矩阵' },
  { title: '校验确认', description: '问题修复' },
];

// Mock 单体数据
interface BuildingUnit {
  id: string;
  name: string;
  sourceNodeIds: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  tagCode?: string;
  tagName?: string;
  space?: 'DS' | 'DX' | 'SW';
  totalArea?: number;
  aboveGroundArea?: number;
  undergroundArea?: number;
  functionalScale?: number;
  scaleRangeCode?: string;
  totalCost?: number;
  errorCount: number;
  warningCount: number;
}

const mockUnits: BuildingUnit[] = [
  { id: 'u1', name: '门诊楼', sourceNodeIds: ['n1'], status: 'completed', tagCode: 'YI-01', tagName: '门诊', space: 'DS', totalArea: 25000, aboveGroundArea: 22000, undergroundArea: 3000, functionalScale: 1500, scaleRangeCode: 'M', totalCost: 85600000, errorCount: 0, warningCount: 0 },
  { id: 'u2', name: '医技楼', sourceNodeIds: ['n2'], status: 'in_progress', tagCode: 'YI-03', tagName: '医技', space: 'DS', totalArea: 12000, aboveGroundArea: 10000, undergroundArea: 2000, totalCost: 32000000, errorCount: 1, warningCount: 2 },
  { id: 'u3', name: '住院楼', sourceNodeIds: ['n3'], status: 'pending', space: 'DS', totalArea: 35000, errorCount: 0, warningCount: 0 },
  { id: 'u4', name: '地下车库', sourceNodeIds: ['n4'], status: 'pending', space: 'DX', totalArea: 15000, errorCount: 0, warningCount: 1 },
  { id: 'u5', name: '室外工程', sourceNodeIds: ['n5'], status: 'error', space: 'SW', errorCount: 2, warningCount: 0 },
];

// Mock 原始树数据
const mockTreeData: DataNode[] = [
  {
    key: 'root',
    title: '某医院门诊楼工程',
    children: [
      { key: 'n1', title: '门诊楼 (已关联: 门诊楼)' },
      { key: 'n2', title: '医技楼 (已关联: 医技楼)' },
      { key: 'n3', title: '住院楼 (未关联)' },
      { key: 'n4', title: '地下车库 (未关联)' },
      { key: 'n5', title: '室外总平 (已关联: 室外工程)' },
    ],
  },
];

// Mock 问题列表
const mockIssues: IssueItem[] = [
  { id: 'e1', type: 'error', message: '医技楼：功能规模未填写，无法匹配规模档', field: 'functionalScale', rowId: 'u2' },
  { id: 'e2', type: 'error', message: '室外工程：存在未映射的专业（QT）', field: 'profession', rowId: 'u5' },
  { id: 'e3', type: 'error', message: '室外工程：总造价为空', field: 'totalCost', rowId: 'u5' },
  { id: 'w1', type: 'warning', message: '医技楼：地上面积+地下面积 ≠ 总面积', field: 'area', rowId: 'u2' },
  { id: 'w2', type: 'warning', message: '医技楼：存在低置信度映射（给排水→QT, 65%）', field: 'mapping', rowId: 'u2' },
  { id: 'w3', type: 'warning', message: '地下车库：建议选择地下空间专用标签', field: 'tag', rowId: 'u4' },
];

// 标签推荐
const mockTagRecommendations = [
  { code: 'YI-01', name: '门诊', confidence: 0.95, keywords: ['门诊', '挂号'] },
  { code: 'YI-02', name: '住院', confidence: 0.88, keywords: ['病房', '住院'] },
  { code: 'YI-03', name: '医技', confidence: 0.82, keywords: ['检验', '影像'] },
];

export default function TaggingWorkbenchPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<BuildingUnit | null>(mockUnits[1]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [form] = Form.useForm();

  // 统计
  const stats = useMemo(() => ({
    total: mockUnits.length,
    completed: mockUnits.filter(u => u.status === 'completed').length,
    errors: mockUnits.reduce((sum, u) => sum + u.errorCount, 0),
    warnings: mockUnits.reduce((sum, u) => sum + u.warningCount, 0),
  }), []);

  const progress = Math.round((stats.completed / stats.total) * 100);

  // 单体列表列定义
  const unitColumns: ColumnsType<BuildingUnit> = [
    {
      title: '单体名称',
      dataIndex: 'name',
      width: 140,
      render: (name, record) => (
        <div className="flex items-center gap-2">
          {record.status === 'completed' && <CheckCircleOutlined className="text-green-500" />}
          {record.status === 'error' && <ExclamationCircleOutlined className="text-red-500" />}
          {record.status === 'in_progress' && <QuestionCircleOutlined className="text-blue-500" />}
          <span className={record.status === 'error' ? 'text-red-600' : ''}>{name}</span>
        </div>
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'tagName',
      width: 100,
      render: (tag) => tag ? <Tag color="blue">{tag}</Tag> : <span className="text-gray-400">未分配</span>,
    },
    {
      title: '空间',
      dataIndex: 'space',
      width: 60,
      render: (space) => {
        const colors: Record<string, string> = { DS: 'blue', DX: 'purple', SW: 'green' };
        const labels: Record<string, string> = { DS: '地上', DX: '地下', SW: '室外' };
        return space ? <Tag color={colors[space]}>{labels[space]}</Tag> : '-';
      },
    },
    {
      title: '面积',
      dataIndex: 'totalArea',
      width: 80,
      align: 'right',
      render: (area) => area ? `${(area / 1000).toFixed(1)}k` : '-',
    },
    {
      title: '问题',
      key: 'issues',
      width: 80,
      render: (_, record) => (
        <div className="flex gap-1">
          {record.errorCount > 0 && <Badge count={record.errorCount} style={{ backgroundColor: '#ff4d4f' }} />}
          {record.warningCount > 0 && <Badge count={record.warningCount} style={{ backgroundColor: '#faad14' }} />}
        </div>
      ),
    },
  ];

  // 选择单体
  const handleSelectUnit = (unit: BuildingUnit) => {
    setSelectedUnit(unit);
    setDrawerOpen(true);
    form.setFieldsValue({
      name: unit.name,
      tagCode: unit.tagCode,
      space: unit.space,
      totalArea: unit.totalArea,
      aboveGroundArea: unit.aboveGroundArea,
      undergroundArea: unit.undergroundArea,
      functionalScale: unit.functionalScale,
    });
  };

  // 保存
  const handleSave = () => {
    message.success('已保存');
  };

  // 校验
  const handleValidate = () => {
    if (stats.errors > 0) {
      message.error(`存在 ${stats.errors} 个阻断问题，请先修复`);
    } else {
      message.success('校验通过');
    }
  };

  // 完成
  const handleComplete = () => {
    if (stats.errors > 0) {
      message.error('存在阻断问题，无法完成');
      return;
    }
    message.success('标签化已完成');
    navigate('/tagging/tasks');
  };

  // 问题点击定位
  const handleIssueClick = (issue: IssueItem) => {
    const unit = mockUnits.find(u => u.id === issue.rowId);
    if (unit) {
      handleSelectUnit(unit);
    }
  };

  return (
    <GoldenPage
      header={{
        title: '标签化工作台',
        subtitle: `任务 #${taskId} - 某医院门诊楼工程`,
        showBack: true,
        backPath: '/tagging/tasks',
        breadcrumbs: [
          { title: '标签化', path: '/tagging/tasks' },
          { title: '工作台' },
        ],
        actions: [
          { key: 'save', label: '保存', icon: <SaveOutlined />, onClick: handleSave },
          { key: 'validate', label: '校验', onClick: handleValidate },
          { key: 'complete', label: '完成', type: 'primary', icon: <CheckOutlined />, onClick: handleComplete, disabled: stats.errors > 0 },
        ],
        extra: (
          <div className="flex items-center gap-4">
            <Progress 
              percent={progress} 
              size="small" 
              style={{ width: 120 }}
              status={stats.errors > 0 ? 'exception' : undefined}
            />
            <span className="text-sm text-gray-500">
              {stats.completed}/{stats.total} 单体
            </span>
            {stats.errors > 0 && (
              <Tag color="error">{stats.errors} 错误</Tag>
            )}
            {stats.warnings > 0 && (
              <Tag color="warning">{stats.warnings} 警告</Tag>
            )}
          </div>
        ),
      }}
      treePanel={
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              size="small"
              direction="vertical"
              items={STEPS.map((step, index) => ({
                title: step.title,
                description: step.description,
                status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
              }))}
            />
          </div>
          <div className="flex-1 overflow-auto">
            <TreePanel
              title="原始工程树"
              data={mockTreeData}
              expandedKeys={['root']}
              showSearch={false}
            />
          </div>
        </div>
      }
      treePanelWidth={260}
      drawerOpen={drawerOpen}
      drawer={
        selectedUnit && (
          <UnitConfigPanel
            unit={selectedUnit}
            step={currentStep}
            form={form}
            onClose={() => setDrawerOpen(false)}
          />
        )
      }
      drawerWidth={420}
      showBottomPanel={true}
      bottomPanel={{
        issues: mockIssues.map(issue => ({
          ...issue,
          onClick: () => handleIssueClick(issue),
        })),
      }}
      bottomPanelHeight={180}
    >
      {/* 步骤提示 */}
      <Alert
        message={STEPS[currentStep].title}
        description={getStepHint(currentStep)}
        type="info"
        showIcon
        className="mb-4"
      />

      {/* 单体列表 */}
      <GridPanel
        columns={unitColumns}
        dataSource={mockUnits}
        rowKey="id"
        onRowClick={handleSelectUnit}
        pagination={false}
        size="small"
      />
    </GoldenPage>
  );
}

// 步骤提示文案
function getStepHint(step: number): string {
  switch (step) {
    case 0: return '识别并确认单体划分，可合并或拆分节点。室外总平建议单独作为一个单体。';
    case 1: return '为每个单体分配功能标签。系统会根据名称推荐标签，室外单体需选择室外类标签。';
    case 2: return '录入各单体的面积信息，包括总面积、地上/地下面积、功能规模。系统会自动匹配规模档。';
    case 3: return '查看造价归集结果，确认空间×专业矩阵。低置信度或未映射的项目需要人工确认。';
    case 4: return '检查所有问题，阻断问题必须修复后才能完成。点击问题可定位到对应单体。';
    default: return '';
  }
}

// 单体配置面板
interface UnitConfigPanelProps {
  unit: BuildingUnit;
  step: number;
  form: any;
  onClose: () => void;
}

function UnitConfigPanel({ unit, step, form, onClose }: UnitConfigPanelProps) {
  return (
    <Drawer
      title={`配置: ${unit.name}`}
      open={true}
      onClose={onClose}
      width={420}
      mask={false}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>关闭</Button>
          <Button type="primary">保存单体</Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {/* Step 0: 单体识别 */}
        {step === 0 && (
          <>
            <Form.Item name="name" label="单体名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="关联节点">
              <div className="text-sm text-gray-500">
                {unit.sourceNodeIds.join(', ')}
              </div>
            </Form.Item>
          </>
        )}

        {/* Step 1: 标签分配 */}
        {step === 1 && (
          <>
            <Form.Item name="tagCode" label="功能标签" rules={[{ required: true }]}>
              <Select
                placeholder="选择功能标签"
                showSearch
                options={[
                  { value: 'YI-01', label: '门诊' },
                  { value: 'YI-02', label: '住院' },
                  { value: 'YI-03', label: '医技' },
                  { value: 'YI-04', label: '行政后勤' },
                ]}
              />
            </Form.Item>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">推荐标签</div>
              <div className="space-y-2">
                {mockTagRecommendations.map(rec => (
                  <div 
                    key={rec.code}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-50"
                    onClick={() => form.setFieldValue('tagCode', rec.code)}
                  >
                    <div>
                      <Tag color="blue">{rec.name}</Tag>
                      <span className="text-xs text-gray-400 ml-2">
                        关键词: {rec.keywords.join(', ')}
                      </span>
                    </div>
                    <span className={`text-sm ${rec.confidence >= 0.9 ? 'text-green-600' : 'text-orange-500'}`}>
                      {(rec.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Form.Item name="space" label="空间类型" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'DS', label: '地上 (DS)' },
                  { value: 'DX', label: '地下 (DX)' },
                  { value: 'SW', label: '室外 (SW)' },
                ]}
              />
            </Form.Item>
          </>
        )}

        {/* Step 2: 面积录入 */}
        {step === 2 && (
          <>
            <Form.Item name="totalArea" label="总建筑面积" rules={[{ required: true }]}>
              <InputNumber className="w-full" addonAfter="m²" />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item name="aboveGroundArea" label="地上面积" className="flex-1">
                <InputNumber className="w-full" addonAfter="m²" />
              </Form.Item>
              <Form.Item name="undergroundArea" label="地下面积" className="flex-1">
                <InputNumber className="w-full" addonAfter="m²" />
              </Form.Item>
            </div>
            <Form.Item 
              name="functionalScale" 
              label="功能规模"
              extra="如：床位数、班级数、日门诊量等"
            >
              <InputNumber className="w-full" />
            </Form.Item>
            {unit.scaleRangeCode && (
              <div className="p-3 bg-green-50 rounded">
                <span className="text-green-600">
                  自动匹配规模档: <Tag color="green">{unit.scaleRangeCode}</Tag>
                </span>
              </div>
            )}
          </>
        )}

        {/* Step 3: 造价归集 */}
        {step === 3 && (
          <>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">空间×专业矩阵</div>
              <Table
                size="small"
                pagination={false}
                columns={[
                  { title: '专业', dataIndex: 'profession', width: 80 },
                  { title: '金额(万)', dataIndex: 'amount', width: 80, align: 'right' },
                  { title: '置信度', dataIndex: 'confidence', width: 80, render: (v: number) => (
                    <span className={v >= 0.8 ? 'text-green-600' : v >= 0.6 ? 'text-orange-500' : 'text-red-500'}>
                      {(v * 100).toFixed(0)}%
                    </span>
                  )},
                ]}
                dataSource={[
                  { key: '1', profession: '土建', amount: 4500, confidence: 0.95 },
                  { key: '2', profession: '给排水', amount: 850, confidence: 0.65 },
                  { key: '3', profession: '暖通', amount: 1200, confidence: 0.88 },
                  { key: '4', profession: '电气', amount: 1500, confidence: 0.92 },
                ]}
              />
            </div>
            <Form.Item label="总造价">
              <InputNumber 
                className="w-full" 
                value={unit.totalCost} 
                addonAfter="元" 
                disabled 
              />
            </Form.Item>
          </>
        )}

        {/* Step 4: 校验确认 */}
        {step === 4 && (
          <>
            <div className="space-y-3">
              {unit.errorCount > 0 && (
                <Alert
                  message={`${unit.errorCount} 个阻断问题`}
                  type="error"
                  showIcon
                />
              )}
              {unit.warningCount > 0 && (
                <Alert
                  message={`${unit.warningCount} 个警告`}
                  type="warning"
                  showIcon
                />
              )}
              {unit.errorCount === 0 && unit.warningCount === 0 && (
                <Alert
                  message="该单体校验通过"
                  type="success"
                  showIcon
                />
              )}
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">单体摘要</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">功能标签</span>
                  <span>{unit.tagName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">空间类型</span>
                  <span>{unit.space || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">总面积</span>
                  <span>{unit.totalArea?.toLocaleString() || '-'} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">总造价</span>
                  <span className="font-medium text-blue-600">
                    ¥{unit.totalCost?.toLocaleString() || '-'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </Form>
    </Drawer>
  );
}
