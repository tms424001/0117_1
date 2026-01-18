import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Table,
  Statistic,
  Steps,
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  Descriptions,
  Progress,
  Tabs,
  Alert,
  Tooltip,
  Divider,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

// 单体数据类型
interface EstimationUnit {
  id: string;
  unitName: string;
  unitCode: string;
  functionTagCode: string;
  functionTagName: string;
  totalArea: number;
  aboveGroundArea: number;
  undergroundArea: number;
  scaleLevel: string;
  scaleLevelName: string;
  matchStatus: 'matched' | 'partial' | 'none';
  unitCost: number;
  estimatedCost: number;
}

// 指标匹配结果
interface MatchedIndex {
  id: string;
  unitId: string;
  spaceCode: string;
  spaceName: string;
  professionCode: string;
  professionName: string;
  recommendedLow: number;
  recommendedMid: number;
  recommendedHigh: number;
  selectedValue: number;
  selectedLevel: 'low' | 'mid' | 'high' | 'custom';
  sampleCount: number;
  confidenceLevel: string;
  area: number;
  estimatedCost: number;
}

// 模拟单体数据
const mockUnits: EstimationUnit[] = [
  { id: '1', unitName: '门诊医技楼', unitCode: 'U001', functionTagCode: 'YI-01', functionTagName: '门诊', totalArea: 25000, aboveGroundArea: 22000, undergroundArea: 3000, scaleLevel: 'large', scaleLevelName: '大型', matchStatus: 'matched', unitCost: 5200, estimatedCost: 130000000 },
  { id: '2', unitName: '住院楼', unitCode: 'U002', functionTagCode: 'YI-02', functionTagName: '住院', totalArea: 35000, aboveGroundArea: 32000, undergroundArea: 3000, scaleLevel: 'large', scaleLevelName: '大型', matchStatus: 'matched', unitCost: 4800, estimatedCost: 168000000 },
  { id: '3', unitName: '后勤综合楼', unitCode: 'U003', functionTagCode: 'YI-10', functionTagName: '后勤保障', totalArea: 8000, aboveGroundArea: 7000, undergroundArea: 1000, scaleLevel: 'medium', scaleLevelName: '中型', matchStatus: 'partial', unitCost: 3500, estimatedCost: 28000000 },
  { id: '4', unitName: '地下车库', unitCode: 'U004', functionTagCode: 'TG-01', functionTagName: '地下车库', totalArea: 15000, aboveGroundArea: 0, undergroundArea: 15000, scaleLevel: 'large', scaleLevelName: '大型', matchStatus: 'matched', unitCost: 3200, estimatedCost: 48000000 },
  { id: '5', unitName: '室外工程', unitCode: 'U005', functionTagCode: 'SW-01', functionTagName: '室外总平', totalArea: 2000, aboveGroundArea: 2000, undergroundArea: 0, scaleLevel: 'small', scaleLevelName: '小型', matchStatus: 'none', unitCost: 0, estimatedCost: 0 },
];

// 模拟指标匹配结果
const mockMatchedIndexes: MatchedIndex[] = [
  { id: 'm1', unitId: '1', spaceCode: 'DS', spaceName: '地上', professionCode: 'TJ', professionName: '土建', recommendedLow: 2800, recommendedMid: 3200, recommendedHigh: 3600, selectedValue: 3200, selectedLevel: 'mid', sampleCount: 156, confidenceLevel: 'A', area: 22000, estimatedCost: 70400000 },
  { id: 'm2', unitId: '1', spaceCode: 'DS', spaceName: '地上', professionCode: 'AZ', professionName: '安装', recommendedLow: 1200, recommendedMid: 1500, recommendedHigh: 1800, selectedValue: 1500, selectedLevel: 'mid', sampleCount: 142, confidenceLevel: 'A', area: 22000, estimatedCost: 33000000 },
  { id: 'm3', unitId: '1', spaceCode: 'DX', spaceName: '地下', professionCode: 'TJ', professionName: '土建', recommendedLow: 2200, recommendedMid: 2500, recommendedHigh: 2800, selectedValue: 2500, selectedLevel: 'mid', sampleCount: 89, confidenceLevel: 'B', area: 3000, estimatedCost: 7500000 },
  { id: 'm4', unitId: '1', spaceCode: 'DX', spaceName: '地下', professionCode: 'AZ', professionName: '安装', recommendedLow: 800, recommendedMid: 1000, recommendedHigh: 1200, selectedValue: 1000, selectedLevel: 'mid', sampleCount: 76, confidenceLevel: 'B', area: 3000, estimatedCost: 3000000 },
];

// 功能标签选项
const functionTagOptions = [
  { value: 'YI-01', label: '门诊', category: '医疗卫生' },
  { value: 'YI-02', label: '住院', category: '医疗卫生' },
  { value: 'YI-03', label: '急诊', category: '医疗卫生' },
  { value: 'YI-10', label: '后勤保障', category: '医疗卫生' },
  { value: 'JY-01', label: '教学楼', category: '教育' },
  { value: 'JY-02', label: '实验楼', category: '教育' },
  { value: 'BG-01', label: '办公楼', category: '办公' },
  { value: 'TG-01', label: '地下车库', category: '通用' },
  { value: 'SW-01', label: '室外总平', category: '室外' },
];

const EstimationWorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(2); // 默认在单体录入步骤
  const [units, setUnits] = useState<EstimationUnit[]>(mockUnits);
  const [selectedUnit, setSelectedUnit] = useState<EstimationUnit | null>(null);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [indexDetailVisible, setIndexDetailVisible] = useState(false);
  const [form] = Form.useForm();

  // 项目基本信息（模拟）
  const projectInfo = {
    projectName: '某三甲医院新建项目',
    projectCode: 'EST-2026-001',
    projectType: '医疗卫生',
    province: '北京',
    city: '北京市',
    estimationType: 'standard',
    indexVersion: 'v2026.01',
  };

  // 计算汇总数据
  const summary = {
    totalArea: units.reduce((sum, u) => sum + u.totalArea, 0),
    totalCost: units.reduce((sum, u) => sum + u.estimatedCost, 0),
    unitCost: units.reduce((sum, u) => sum + u.totalArea, 0) > 0
      ? Math.round(units.reduce((sum, u) => sum + u.estimatedCost, 0) / units.reduce((sum, u) => sum + u.totalArea, 0))
      : 0,
    unitCount: units.length,
    matchedCount: units.filter(u => u.matchStatus === 'matched').length,
  };

  // 获取匹配状态标签
  const getMatchStatusTag = (status: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      matched: { color: 'success', icon: <CheckCircleOutlined />, text: '已匹配' },
      partial: { color: 'warning', icon: <ExclamationCircleOutlined />, text: '部分匹配' },
      none: { color: 'error', icon: <InfoCircleOutlined />, text: '未匹配' },
    };
    const s = map[status] || { color: 'default', icon: null, text: status };
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

  // 获取置信等级标签
  const getConfidenceTag = (level: string) => {
    const map: Record<string, { color: string; text: string }> = {
      A: { color: 'green', text: 'A级 高置信' },
      B: { color: 'blue', text: 'B级 中置信' },
      C: { color: 'orange', text: 'C级 低置信' },
      D: { color: 'red', text: 'D级 不可信' },
    };
    const c = map[level] || { color: 'default', text: level };
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  // 单体列表列定义
  const unitColumns: ColumnsType<EstimationUnit> = [
    {
      title: '单体名称',
      dataIndex: 'unitName',
      key: 'unitName',
      render: (v, r) => (
        <div>
          <div className="font-medium">{v}</div>
          <div className="text-xs text-gray-400">{r.unitCode}</div>
        </div>
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'functionTagName',
      key: 'functionTagName',
      width: 100,
      render: (v, r) => (
        <Tooltip title={r.functionTagCode}>
          <Tag color="blue">{v}</Tag>
        </Tooltip>
      ),
    },
    {
      title: '建筑面积',
      key: 'area',
      width: 150,
      render: (_, r) => (
        <div className="text-right">
          <div>{r.totalArea.toLocaleString()} m²</div>
          <div className="text-xs text-gray-400">
            地上 {r.aboveGroundArea.toLocaleString()} / 地下 {r.undergroundArea.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: '规模档',
      dataIndex: 'scaleLevelName',
      key: 'scaleLevelName',
      width: 80,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '匹配状态',
      dataIndex: 'matchStatus',
      key: 'matchStatus',
      width: 100,
      render: (v) => getMatchStatusTag(v),
    },
    {
      title: '单方造价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (v) => v > 0 ? `${v.toLocaleString()} 元/m²` : '-',
    },
    {
      title: '估算造价',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      width: 120,
      align: 'right',
      render: (v) => v > 0 ? `¥${(v / 10000).toLocaleString()} 万` : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewIndex(record)}>指标详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditUnit(record)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUnit(record.id)} />
        </Space>
      ),
    },
  ];

  // 指标详情列定义
  const indexColumns: ColumnsType<MatchedIndex> = [
    { title: '空间', dataIndex: 'spaceName', key: 'spaceName', width: 80 },
    { title: '专业', dataIndex: 'professionName', key: 'professionName', width: 80 },
    {
      title: '推荐区间',
      key: 'range',
      width: 180,
      render: (_, r) => (
        <div className="text-xs">
          <span className="text-green-500">{r.recommendedLow}</span>
          <span className="mx-1">~</span>
          <span className="text-blue-500 font-bold">{r.recommendedMid}</span>
          <span className="mx-1">~</span>
          <span className="text-red-500">{r.recommendedHigh}</span>
          <span className="text-gray-400 ml-1">元/m²</span>
        </div>
      ),
    },
    {
      title: '选用值',
      dataIndex: 'selectedValue',
      key: 'selectedValue',
      width: 120,
      render: (v, r) => (
        <Select
          size="small"
          value={r.selectedLevel}
          style={{ width: 100 }}
          options={[
            { value: 'low', label: `低值 ${r.recommendedLow}` },
            { value: 'mid', label: `中值 ${r.recommendedMid}` },
            { value: 'high', label: `高值 ${r.recommendedHigh}` },
            { value: 'custom', label: '自定义' },
          ]}
        />
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidenceLevel',
      key: 'confidenceLevel',
      width: 100,
      render: (v) => getConfidenceTag(v),
    },
    {
      title: '样本数',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 80,
      render: (v) => <span className="text-gray-500">{v}个</span>,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      align: 'right',
      render: (v) => `${v.toLocaleString()} m²`,
    },
    {
      title: '估算造价',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      width: 120,
      align: 'right',
      render: (v) => `¥${(v / 10000).toLocaleString()} 万`,
    },
  ];

  // 查看指标详情
  const handleViewIndex = (unit: EstimationUnit) => {
    setSelectedUnit(unit);
    setIndexDetailVisible(true);
  };

  // 编辑单体
  const handleEditUnit = (unit: EstimationUnit) => {
    setSelectedUnit(unit);
    form.setFieldsValue(unit);
    setUnitModalVisible(true);
  };

  // 删除单体
  const handleDeleteUnit = (unitId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该单体吗？',
      onOk: () => {
        setUnits(units.filter(u => u.id !== unitId));
        message.success('删除成功');
      },
    });
  };

  // 添加单体
  const handleAddUnit = () => {
    setSelectedUnit(null);
    form.resetFields();
    setUnitModalVisible(true);
  };

  // 保存单体
  const handleSaveUnit = () => {
    form.validateFields().then(values => {
      if (selectedUnit) {
        // 编辑
        setUnits(units.map(u => u.id === selectedUnit.id ? { ...u, ...values } : u));
        message.success('保存成功');
      } else {
        // 新增
        const newUnit: EstimationUnit = {
          id: `${Date.now()}`,
          ...values,
          unitCode: `U${String(units.length + 1).padStart(3, '0')}`,
          scaleLevel: 'medium',
          scaleLevelName: '中型',
          matchStatus: 'none',
          unitCost: 0,
          estimatedCost: 0,
        };
        setUnits([...units, newUnit]);
        message.success('添加成功');
      }
      setUnitModalVisible(false);
    });
  };

  // 执行指标匹配
  const handleMatch = () => {
    message.loading('正在匹配指标...', 1.5).then(() => {
      message.success('指标匹配完成');
      setCurrentStep(3);
    });
  };

  // 生成报告
  const handleGenerateReport = () => {
    message.loading('正在生成报告...', 2).then(() => {
      message.success('报告生成成功');
      setCurrentStep(4);
    });
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderProjectConfig();
      case 1:
        return renderUnitInput();
      case 2:
        return renderIndexMatch();
      case 3:
        return renderAdjustment();
      case 4:
        return renderReport();
      default:
        return null;
    }
  };

  // Step 1: 项目配置
  const renderProjectConfig = () => (
    <Card title="项目基本信息" size="small">
      <Descriptions column={3} size="small">
        <Descriptions.Item label="项目名称">{projectInfo.projectName}</Descriptions.Item>
        <Descriptions.Item label="项目编号">{projectInfo.projectCode}</Descriptions.Item>
        <Descriptions.Item label="项目类型">{projectInfo.projectType}</Descriptions.Item>
        <Descriptions.Item label="所在地区">{projectInfo.province} {projectInfo.city}</Descriptions.Item>
        <Descriptions.Item label="估算类型">
          <Tag color="blue">{projectInfo.estimationType === 'standard' ? '标准估算' : projectInfo.estimationType}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="指标版本">{projectInfo.indexVersion}</Descriptions.Item>
      </Descriptions>
      <div className="mt-4 text-right">
        <Button type="primary" onClick={() => setCurrentStep(1)}>下一步：单体录入</Button>
      </div>
    </Card>
  );

  // Step 2: 单体录入
  const renderUnitInput = () => (
    <div className="space-y-4">
      <Card
        title="单体列表"
        size="small"
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={handleAddUnit}>添加单体</Button>
            <Button type="primary" onClick={() => setCurrentStep(2)}>下一步：指标匹配</Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={unitColumns.filter(c => !['matchStatus', 'unitCost', 'estimatedCost'].includes(c.key as string))}
          dataSource={units}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // Step 3: 指标匹配
  const renderIndexMatch = () => (
    <div className="space-y-4">
      {/* 匹配状态提示 */}
      {summary.matchedCount < summary.unitCount && (
        <Alert
          type="warning"
          showIcon
          message={`${summary.unitCount - summary.matchedCount} 个单体未完全匹配指标，请检查功能标签和规模档设置`}
        />
      )}

      {/* 单体列表 */}
      <Card
        title="指标匹配结果"
        size="small"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleMatch}>重新匹配</Button>
            <Button type="primary" onClick={() => setCurrentStep(3)}>下一步：估算调整</Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={unitColumns}
          dataSource={units}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );

  // Step 4: 估算调整
  const renderAdjustment = () => (
    <div className="space-y-4">
      {/* 汇总统计 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="总建筑面积" value={summary.totalArea} suffix="m²" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="估算总造价" value={summary.totalCost / 100000000} precision={2} suffix="亿元" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="综合单方" value={summary.unitCost} suffix="元/m²" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="单体数量" value={summary.unitCount} suffix="个" />
          </Card>
        </Col>
      </Row>

      {/* 调整表格 */}
      <Card
        title="估算明细"
        size="small"
        extra={
          <Space>
            <Button icon={<CalculatorOutlined />}>重新计算</Button>
            <Button type="primary" onClick={handleGenerateReport}>生成报告</Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={unitColumns}
          dataSource={units}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}><strong>合计</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right"><strong>{summary.totalArea.toLocaleString()} m²</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} align="right"><strong>{summary.unitCost.toLocaleString()} 元/m²</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right"><strong>¥{(summary.totalCost / 10000).toLocaleString()} 万</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );

  // Step 5: 报告输出
  const renderReport = () => (
    <div className="space-y-4">
      <Alert type="success" showIcon message="估算完成！您可以导出估算报告。" />

      {/* 估算汇总 */}
      <Card title="估算汇总" size="small">
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="项目名称">{projectInfo.projectName}</Descriptions.Item>
          <Descriptions.Item label="项目编号">{projectInfo.projectCode}</Descriptions.Item>
          <Descriptions.Item label="总建筑面积">{summary.totalArea.toLocaleString()} m²</Descriptions.Item>
          <Descriptions.Item label="单体数量">{summary.unitCount} 个</Descriptions.Item>
          <Descriptions.Item label="估算总造价" span={2}>
            <span className="text-xl font-bold text-blue-500">¥ {(summary.totalCost / 100000000).toFixed(2)} 亿元</span>
          </Descriptions.Item>
          <Descriptions.Item label="综合单方造价">{summary.unitCost.toLocaleString()} 元/m²</Descriptions.Item>
          <Descriptions.Item label="指标版本">{projectInfo.indexVersion}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 导出选项 */}
      <Card title="报告导出" size="small">
        <Space size="large">
          <Button icon={<DownloadOutlined />} size="large">估算汇总表 (Excel)</Button>
          <Button icon={<DownloadOutlined />} size="large">分部估算表 (Excel)</Button>
          <Button icon={<DownloadOutlined />} size="large">指标对比表 (Excel)</Button>
          <Button icon={<FileTextOutlined />} type="primary" size="large">估算报告 (PDF)</Button>
        </Space>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/estimation/projects')}>返回</Button>
            <Divider type="vertical" />
            <span className="text-lg font-medium">{projectInfo.projectName}</span>
            <Tag color="blue">{projectInfo.projectType}</Tag>
            <Tag>{projectInfo.province}</Tag>
          </Space>
          <Space>
            <Button icon={<SaveOutlined />}>保存</Button>
          </Space>
        </div>
      </Card>

      {/* 步骤条 */}
      <Card size="small">
        <Steps
          current={currentStep}
          onChange={setCurrentStep}
          items={[
            { title: '项目配置', description: '基本信息' },
            { title: '单体录入', description: '功能标签·面积' },
            { title: '指标匹配', description: '自动匹配' },
            { title: '估算调整', description: '费用调整' },
            { title: '报告输出', description: '导出报告' },
          ]}
        />
      </Card>

      {/* 步骤内容 */}
      {renderStepContent()}

      {/* 单体编辑弹窗 */}
      <Modal
        title={selectedUnit ? '编辑单体' : '添加单体'}
        open={unitModalVisible}
        onOk={handleSaveUnit}
        onCancel={() => setUnitModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="unitName" label="单体名称" rules={[{ required: true, message: '请输入单体名称' }]}>
                <Input placeholder="如：门诊医技楼" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="functionTagCode"
                label={
                  <span>
                    功能标签
                    <Tooltip title="功能标签决定匹配哪类指标">
                      <QuestionCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: '请选择功能标签' }]}
              >
                <Select
                  placeholder="请选择功能标签"
                  showSearch
                  optionFilterProp="label"
                  options={functionTagOptions}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="totalArea" label="总建筑面积(m²)" rules={[{ required: true, message: '请输入面积' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="aboveGroundArea" label="地上面积(m²)">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="undergroundArea" label="地下面积(m²)">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 指标详情弹窗 */}
      <Modal
        title={`指标详情 - ${selectedUnit?.unitName}`}
        open={indexDetailVisible}
        onCancel={() => setIndexDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIndexDetailVisible(false)}>关闭</Button>,
        ]}
      >
        {selectedUnit && (
          <div className="space-y-4">
            <Descriptions size="small" bordered column={4}>
              <Descriptions.Item label="功能标签">{selectedUnit.functionTagName}</Descriptions.Item>
              <Descriptions.Item label="规模档">{selectedUnit.scaleLevelName}</Descriptions.Item>
              <Descriptions.Item label="总面积">{selectedUnit.totalArea.toLocaleString()} m²</Descriptions.Item>
              <Descriptions.Item label="匹配状态">{getMatchStatusTag(selectedUnit.matchStatus)}</Descriptions.Item>
            </Descriptions>

            <Table
              rowKey="id"
              columns={indexColumns}
              dataSource={mockMatchedIndexes.filter(m => m.unitId === selectedUnit.id)}
              pagination={false}
              size="small"
              summary={(data) => {
                const totalCost = data.reduce((sum, r) => sum + r.estimatedCost, 0);
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={6}><strong>合计</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right"><strong>{selectedUnit.totalArea.toLocaleString()} m²</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={7} align="right"><strong>¥{(totalCost / 10000).toLocaleString()} 万</strong></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EstimationWorkbenchPage;
