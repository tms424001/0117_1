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

// ============================================================
// 02 标准库 - 功能标签体系 (239标签, 14大类)
// ============================================================
const TAG_CATEGORIES = [
  { code: 'YI', name: '医疗卫生', color: '#f5222d', count: 30 },
  { code: 'JY', name: '教育', color: '#fa8c16', count: 30 },
  { code: 'BG', name: '办公', color: '#1890ff', count: 15 },
  { code: 'SY', name: '商业', color: '#eb2f96', count: 16 },
  { code: 'JD', name: '酒店', color: '#722ed1', count: 17 },
  { code: 'WH', name: '文化', color: '#13c2c2', count: 17 },
  { code: 'TI', name: '体育', color: '#52c41a', count: 16 },
  { code: 'JZ', name: '居住', color: '#faad14', count: 20 },
  { code: 'YA', name: '养老', color: '#a0d911', count: 10 },
  { code: 'SF', name: '司法', color: '#2f54eb', count: 11 },
  { code: 'JT', name: '交通', color: '#597ef7', count: 11 },
  { code: 'GY', name: '工业', color: '#8c8c8c', count: 16 },
  { code: 'TG', name: '通用', color: '#bfbfbf', count: 15 },
  { code: 'SW', name: '室外/总平', color: '#73d13d', count: 15 },
];

// 功能标签完整列表（按02_Tag_System_Spec.md）
const FUNCTION_TAGS = [
  // 医疗卫生 (YI)
  { code: 'YI-01', name: '门诊', category: 'YI', keywords: ['门诊', '门急诊', '诊疗'] },
  { code: 'YI-02', name: '住院', category: 'YI', keywords: ['住院', '病房', '住院部'] },
  { code: 'YI-03', name: '急诊', category: 'YI', keywords: ['急诊', '急救', '抢救'] },
  { code: 'YI-04', name: '医技', category: 'YI', keywords: ['医技', '检验', '影像', '放射'] },
  { code: 'YI-05', name: '手术', category: 'YI', keywords: ['手术', '手术室', '手术中心'] },
  { code: 'YI-06', name: 'ICU', category: 'YI', keywords: ['ICU', '重症', '监护'] },
  { code: 'YI-07', name: '感染', category: 'YI', keywords: ['感染', '传染', '发热'] },
  { code: 'YI-08', name: '行政办公', category: 'YI', keywords: ['行政', '办公', '管理'] },
  { code: 'YI-09', name: '教学科研', category: 'YI', keywords: ['教学', '科研', '培训'] },
  { code: 'YI-10', name: '后勤保障', category: 'YI', keywords: ['后勤', '保障', '设备', '锅炉'] },
  // 教育 (JY)
  { code: 'JY-01', name: '教学楼', category: 'JY', keywords: ['教学', '教室', '教学楼'] },
  { code: 'JY-02', name: '实验楼', category: 'JY', keywords: ['实验', '实验室', '实训'] },
  { code: 'JY-03', name: '图书馆', category: 'JY', keywords: ['图书', '图书馆', '阅览'] },
  { code: 'JY-04', name: '行政楼', category: 'JY', keywords: ['行政', '办公', '综合楼'] },
  { code: 'JY-05', name: '学生宿舍', category: 'JY', keywords: ['宿舍', '公寓', '学生'] },
  { code: 'JY-06', name: '食堂', category: 'JY', keywords: ['食堂', '餐厅', '饭堂'] },
  { code: 'JY-07', name: '体育馆', category: 'JY', keywords: ['体育馆', '风雨操场', '球馆'] },
  { code: 'JY-08', name: '礼堂', category: 'JY', keywords: ['礼堂', '报告厅', '会堂'] },
  // 办公 (BG)
  { code: 'BG-01', name: '办公楼', category: 'BG', keywords: ['办公', '办公楼', '写字楼'] },
  { code: 'BG-02', name: '综合楼', category: 'BG', keywords: ['综合', '综合楼'] },
  { code: 'BG-03', name: '会议中心', category: 'BG', keywords: ['会议', '会议中心', '会展'] },
  // 商业 (SY)
  { code: 'SY-01', name: '商场', category: 'SY', keywords: ['商场', '购物', '百货'] },
  { code: 'SY-02', name: '超市', category: 'SY', keywords: ['超市', '卖场'] },
  { code: 'SY-03', name: '商业街', category: 'SY', keywords: ['商业街', '步行街', '商铺'] },
  // 通用 (TG)
  { code: 'TG-01', name: '地下车库', category: 'TG', keywords: ['车库', '停车', '地下室'] },
  { code: 'TG-02', name: '配套用房', category: 'TG', keywords: ['配套', '附属', '辅助'] },
  { code: 'TG-03', name: '人防工程', category: 'TG', keywords: ['人防', '防空'] },
  { code: 'TG-04', name: '设备用房', category: 'TG', keywords: ['设备', '机房', '配电'] },
  // 室外 (SW)
  { code: 'SW-01', name: '室外总平', category: 'SW', keywords: ['室外', '总平', '场地', '道路'] },
  { code: 'SW-02', name: '景观绿化', category: 'SW', keywords: ['景观', '绿化', '园林'] },
  { code: 'SW-03', name: '室外管网', category: 'SW', keywords: ['管网', '给排水', '电力'] },
];

// ============================================================
// 02 标准库 - 规模分档体系 (7类35档)
// ============================================================
const SCALE_TYPES = [
  { code: 'AREA', name: '建筑面积', unit: 'm²', priority: 1 },
  { code: 'BED', name: '床位数', unit: '床', priority: 2, applicableCategories: ['YI', 'YA'] },
  { code: 'CLASS', name: '班级数', unit: '班', priority: 2, applicableCategories: ['JY'] },
  { code: 'SEAT', name: '座位数', unit: '座', priority: 2, applicableCategories: ['TI', 'WH'] },
  { code: 'ROOM', name: '客房数', unit: '间', priority: 2, applicableCategories: ['JD'] },
  { code: 'PARKING', name: '车位数', unit: '个', priority: 2, applicableCategories: ['TG'] },
  { code: 'HOUSEHOLD', name: '户数', unit: '户', priority: 2, applicableCategories: ['JZ'] },
];

// 面积分档规则（通用）
const AREA_SCALE_RANGES = [
  { code: 'XS', name: '特小型', min: 0, max: 1000 },
  { code: 'S', name: '小型', min: 1000, max: 5000 },
  { code: 'M', name: '中型', min: 5000, max: 20000 },
  { code: 'L', name: '大型', min: 20000, max: 50000 },
  { code: 'XL', name: '特大型', min: 50000, max: Infinity },
];

// 04 标签化 - 根据面积自动计算规模档
const calculateScaleLevel = (area: number): { code: string; name: string } => {
  for (const range of AREA_SCALE_RANGES) {
    if (area >= range.min && area < range.max) {
      return { code: range.code, name: range.name };
    }
  }
  return { code: 'M', name: '中型' };
};

// 04 标签化 - 智能推荐标签（根据单体名称关键字匹配）
const recommendTagsByName = (unitName: string): Array<{ tag: typeof FUNCTION_TAGS[0]; confidence: number }> => {
  const results: Array<{ tag: typeof FUNCTION_TAGS[0]; confidence: number }> = [];
  const nameLower = unitName.toLowerCase();
  
  for (const tag of FUNCTION_TAGS) {
    let matchScore = 0;
    for (const keyword of tag.keywords) {
      if (nameLower.includes(keyword)) {
        matchScore += keyword.length; // 关键字越长，匹配度越高
      }
    }
    if (matchScore > 0) {
      results.push({ tag, confidence: Math.min(matchScore / 10, 1) });
    }
  }
  
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
};

// ============================================================
// 05 指标系统 - 指标匹配逻辑
// ============================================================
// 匹配维度：功能标签 × 规模档 × 地区 × 计价阶段
interface MatchCondition {
  functionTagCode: string;
  scaleLevel: string;
  province: string;
  pricingStage: string;
}

// 匹配策略（按优先级降级）
const MATCH_STRATEGIES = [
  { level: 1, name: '精确匹配', dimensions: ['functionTagCode', 'scaleLevel', 'province', 'pricingStage'], confidenceAdjust: 0 },
  { level: 2, name: '降级匹配1', dimensions: ['functionTagCode', 'scaleLevel', 'province'], confidenceAdjust: -1 },
  { level: 3, name: '降级匹配2', dimensions: ['functionTagCode', 'scaleLevel'], confidenceAdjust: -2 },
  { level: 4, name: '降级匹配3', dimensions: ['functionTagCode', 'province'], confidenceAdjust: -2 },
  { level: 5, name: '模糊匹配', dimensions: ['functionTagCode'], confidenceAdjust: -3 },
];

// 置信度计算（按05_Index_Aggregation_Spec.md）
const calculateConfidenceLevel = (sampleCount: number, cv: number): string => {
  if (sampleCount >= 30 && cv <= 0.15) return 'A';
  if (sampleCount >= 10 && cv <= 0.25) return 'B';
  if (sampleCount >= 3 && cv <= 0.35) return 'C';
  return 'D';
};

// 单体数据类型
interface EstimationUnit {
  id: string;
  unitName: string;
  unitCode: string;
  functionTagCode: string;
  functionTagName: string;
  functionTagCategory: string;
  totalArea: number;
  aboveGroundArea: number;
  undergroundArea: number;
  scaleLevel: string;
  scaleLevelName: string;
  matchStatus: 'matched' | 'partial' | 'none';
  matchLevel: number; // 匹配层级 1-5
  matchStrategy: string; // 匹配策略名称
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
  cv: number; // 变异系数
  confidenceLevel: string;
  area: number;
  estimatedCost: number;
  matchLevel: number;
  matchStrategy: string;
}

// 模拟单体数据（关联02标准库标签）
const mockUnits: EstimationUnit[] = [
  { id: '1', unitName: '门诊医技楼', unitCode: 'U001', functionTagCode: 'YI-01', functionTagName: '门诊', functionTagCategory: 'YI', totalArea: 25000, aboveGroundArea: 22000, undergroundArea: 3000, scaleLevel: 'L', scaleLevelName: '大型', matchStatus: 'matched', matchLevel: 1, matchStrategy: '精确匹配', unitCost: 5200, estimatedCost: 130000000 },
  { id: '2', unitName: '住院楼', unitCode: 'U002', functionTagCode: 'YI-02', functionTagName: '住院', functionTagCategory: 'YI', totalArea: 35000, aboveGroundArea: 32000, undergroundArea: 3000, scaleLevel: 'L', scaleLevelName: '大型', matchStatus: 'matched', matchLevel: 1, matchStrategy: '精确匹配', unitCost: 4800, estimatedCost: 168000000 },
  { id: '3', unitName: '后勤综合楼', unitCode: 'U003', functionTagCode: 'YI-10', functionTagName: '后勤保障', functionTagCategory: 'YI', totalArea: 8000, aboveGroundArea: 7000, undergroundArea: 1000, scaleLevel: 'M', scaleLevelName: '中型', matchStatus: 'partial', matchLevel: 3, matchStrategy: '降级匹配2', unitCost: 3500, estimatedCost: 28000000 },
  { id: '4', unitName: '地下车库', unitCode: 'U004', functionTagCode: 'TG-01', functionTagName: '地下车库', functionTagCategory: 'TG', totalArea: 15000, aboveGroundArea: 0, undergroundArea: 15000, scaleLevel: 'M', scaleLevelName: '中型', matchStatus: 'matched', matchLevel: 1, matchStrategy: '精确匹配', unitCost: 3200, estimatedCost: 48000000 },
  { id: '5', unitName: '室外工程', unitCode: 'U005', functionTagCode: 'SW-01', functionTagName: '室外总平', functionTagCategory: 'SW', totalArea: 2000, aboveGroundArea: 2000, undergroundArea: 0, scaleLevel: 'S', scaleLevelName: '小型', matchStatus: 'none', matchLevel: 0, matchStrategy: '无匹配', unitCost: 0, estimatedCost: 0 },
];

// 功能标签选项（用于下拉选择，基于FUNCTION_TAGS生成）
const functionTagOptions = FUNCTION_TAGS.map(tag => {
  const category = TAG_CATEGORIES.find(c => c.code === tag.category);
  return {
    value: tag.code,
    label: `${tag.name} (${tag.code})`,
    category: category?.name || tag.category,
    categoryCode: tag.category,
  };
});

// 模拟指标匹配结果（关联05指标聚合规范）
const mockMatchedIndexes: MatchedIndex[] = [
  { id: 'm1', unitId: '1', spaceCode: 'DS', spaceName: '地上', professionCode: 'TJ', professionName: '土建', recommendedLow: 2800, recommendedMid: 3200, recommendedHigh: 3600, selectedValue: 3200, selectedLevel: 'mid', sampleCount: 156, cv: 0.12, confidenceLevel: 'A', area: 22000, estimatedCost: 70400000, matchLevel: 1, matchStrategy: '精确匹配' },
  { id: 'm2', unitId: '1', spaceCode: 'DS', spaceName: '地上', professionCode: 'AZ', professionName: '安装', recommendedLow: 1200, recommendedMid: 1500, recommendedHigh: 1800, selectedValue: 1500, selectedLevel: 'mid', sampleCount: 142, cv: 0.14, confidenceLevel: 'A', area: 22000, estimatedCost: 33000000, matchLevel: 1, matchStrategy: '精确匹配' },
  { id: 'm3', unitId: '1', spaceCode: 'DX', spaceName: '地下', professionCode: 'TJ', professionName: '土建', recommendedLow: 2200, recommendedMid: 2500, recommendedHigh: 2800, selectedValue: 2500, selectedLevel: 'mid', sampleCount: 89, cv: 0.18, confidenceLevel: 'B', area: 3000, estimatedCost: 7500000, matchLevel: 2, matchStrategy: '降级匹配1' },
  { id: 'm4', unitId: '1', spaceCode: 'DX', spaceName: '地下', professionCode: 'AZ', professionName: '安装', recommendedLow: 800, recommendedMid: 1000, recommendedHigh: 1200, selectedValue: 1000, selectedLevel: 'mid', sampleCount: 76, cv: 0.20, confidenceLevel: 'B', area: 3000, estimatedCost: 3000000, matchLevel: 2, matchStrategy: '降级匹配1' },
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
