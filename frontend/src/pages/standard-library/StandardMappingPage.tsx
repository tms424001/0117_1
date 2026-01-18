import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Modal,
  Form,
  Tabs,
  Descriptions,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// 空间分类数据类型
interface SpaceCategory {
  id: string;
  code: string;
  name: string;
  fullName: string;
  description: string;
  areaField: string;
  identifyKeywords: string[];
  applicableProfessions: string[];
  color: string;
  sortOrder: number;
  isSystem: boolean;
  status: string;
}

// 专业分类数据类型
interface ProfessionCategory {
  id: string;
  code: string;
  name: string;
  fullName: string;
  description: string;
  parentCode: string;
  level: number;
  identifyKeywords: string[];
  color: string;
  sortOrder: number;
  isSystem: boolean;
  status: string;
}

// 映射规则数据类型
interface MappingRule {
  id: string;
  sourceType: string;
  sourceField: string;
  targetType: string;
  targetCode: string;
  targetName: string;
  keyword: string;
  matchType: string;
  confidence: number;
  priority: number;
  status: string;
}

// 模拟空间分类数据
const mockSpaceCategories: SpaceCategory[] = [
  { id: '1', code: 'DS', name: '地上', fullName: '地上部分', description: '建筑物正负零标高及以上的部分', areaField: 'aboveGroundArea', identifyKeywords: ['地上', '正负零以上', '首层', '标准层', '裙楼', '塔楼', '屋面'], applicableProfessions: ['TJ', 'ZS', 'GPS', 'QD', 'RD', 'XF', 'DT', 'ZN'], color: '#1890FF', sortOrder: 1, isSystem: true, status: 'active' },
  { id: '2', code: 'DX', name: '地下', fullName: '地下部分', description: '建筑物正负零标高以下的部分', areaField: 'undergroundArea', identifyKeywords: ['地下', '负一层', '负二层', '地下室', '基础', '桩基', '基坑', '人防'], applicableProfessions: ['TJ', 'ZS', 'GPS', 'QD', 'RD', 'XF', 'DT', 'ZN'], color: '#722ED1', sortOrder: 2, isSystem: true, status: 'active' },
  { id: '3', code: 'SW', name: '室外', fullName: '室外部分', description: '建筑红线范围内，建筑物本体以外的室外工程', areaField: 'outdoorArea', identifyKeywords: ['室外', '总平', '总坪', '场地', '道路', '绿化', '景观', '管网', '围墙'], applicableProfessions: ['TJ', 'GPS', 'QD', 'YL'], color: '#52C41A', sortOrder: 3, isSystem: true, status: 'active' },
  { id: '4', code: 'QT', name: '其他', fullName: '其他部分', description: '无法明确归入以上三类的工程内容', areaField: '', identifyKeywords: [], applicableProfessions: [], color: '#8C8C8C', sortOrder: 4, isSystem: true, status: 'active' },
];

// 模拟专业分类数据
const mockProfessionCategories: ProfessionCategory[] = [
  { id: '1', code: 'TJ', name: '土建', fullName: '土建工程', description: '建筑结构及装饰装修', parentCode: '', level: 1, identifyKeywords: ['土建', '结构', '建筑', '装修', '装饰'], color: '#1890FF', sortOrder: 1, isSystem: true, status: 'active' },
  { id: '2', code: 'ZS', name: '装饰', fullName: '装饰装修工程', description: '室内外装饰装修', parentCode: '', level: 1, identifyKeywords: ['装饰', '装修', '精装', '幕墙'], color: '#FA8C16', sortOrder: 2, isSystem: true, status: 'active' },
  { id: '3', code: 'GPS', name: '给排水', fullName: '给排水工程', description: '给水、排水、消防水系统', parentCode: '', level: 1, identifyKeywords: ['给排水', '给水', '排水', '消防水', '喷淋'], color: '#13C2C2', sortOrder: 3, isSystem: true, status: 'active' },
  { id: '4', code: 'QD', name: '强电', fullName: '强电工程', description: '供配电、照明、防雷接地', parentCode: '', level: 1, identifyKeywords: ['强电', '供配电', '照明', '防雷', '电气'], color: '#F5222D', sortOrder: 4, isSystem: true, status: 'active' },
  { id: '5', code: 'RD', name: '弱电', fullName: '弱电工程', description: '智能化、通信、安防', parentCode: '', level: 1, identifyKeywords: ['弱电', '智能化', '通信', '安防', '监控'], color: '#722ED1', sortOrder: 5, isSystem: true, status: 'active' },
  { id: '6', code: 'NT', name: '暖通', fullName: '暖通空调工程', description: '空调、通风、采暖', parentCode: '', level: 1, identifyKeywords: ['暖通', '空调', '通风', '采暖', 'HVAC'], color: '#2F54EB', sortOrder: 6, isSystem: true, status: 'active' },
  { id: '7', code: 'XF', name: '消防', fullName: '消防工程', description: '消防报警、气体灭火', parentCode: '', level: 1, identifyKeywords: ['消防', '报警', '灭火', '防火'], color: '#EB2F96', sortOrder: 7, isSystem: true, status: 'active' },
  { id: '8', code: 'DT', name: '电梯', fullName: '电梯工程', description: '垂直电梯、扶梯', parentCode: '', level: 1, identifyKeywords: ['电梯', '扶梯', '升降机'], color: '#FAAD14', sortOrder: 8, isSystem: true, status: 'active' },
  { id: '9', code: 'ZN', name: '智能化', fullName: '智能化工程', description: '楼宇自控、综合布线', parentCode: '', level: 1, identifyKeywords: ['智能化', '楼控', 'BAS', '综合布线'], color: '#A0D911', sortOrder: 9, isSystem: true, status: 'active' },
  { id: '10', code: 'YL', name: '园林', fullName: '园林景观工程', description: '绿化、景观、小品', parentCode: '', level: 1, identifyKeywords: ['园林', '景观', '绿化', '小品'], color: '#52C41A', sortOrder: 10, isSystem: true, status: 'active' },
];

// 模拟映射规则数据
const mockMappingRules: MappingRule[] = [
  { id: 'M001', sourceType: 'space', sourceField: 'name', targetType: 'space', targetCode: 'DS', targetName: '地上', keyword: '地上', matchType: 'contains', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M002', sourceType: 'space', sourceField: 'name', targetType: 'space', targetCode: 'DS', targetName: '地上', keyword: '标准层', matchType: 'contains', confidence: 0.9, priority: 9, status: 'active' },
  { id: 'M003', sourceType: 'space', sourceField: 'floorNumber', targetType: 'space', targetCode: 'DS', targetName: '地上', keyword: '>=1', matchType: 'gte', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M004', sourceType: 'space', sourceField: 'name', targetType: 'space', targetCode: 'DX', targetName: '地下', keyword: '地下', matchType: 'contains', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M005', sourceType: 'space', sourceField: 'name', targetType: 'space', targetCode: 'DX', targetName: '地下', keyword: '基础', matchType: 'contains', confidence: 0.9, priority: 9, status: 'active' },
  { id: 'M006', sourceType: 'space', sourceField: 'floorNumber', targetType: 'space', targetCode: 'DX', targetName: '地下', keyword: '<0', matchType: 'lt', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M007', sourceType: 'profession', sourceField: 'name', targetType: 'profession', targetCode: 'TJ', targetName: '土建', keyword: '土建', matchType: 'contains', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M008', sourceType: 'profession', sourceField: 'name', targetType: 'profession', targetCode: 'TJ', targetName: '土建', keyword: '结构', matchType: 'contains', confidence: 0.9, priority: 9, status: 'active' },
  { id: 'M009', sourceType: 'profession', sourceField: 'name', targetType: 'profession', targetCode: 'GPS', targetName: '给排水', keyword: '给排水', matchType: 'contains', confidence: 0.95, priority: 10, status: 'active' },
  { id: 'M010', sourceType: 'profession', sourceField: 'name', targetType: 'profession', targetCode: 'QD', targetName: '强电', keyword: '强电', matchType: 'contains', confidence: 0.95, priority: 10, status: 'active' },
];

const StandardMappingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('space');
  const [spaceModalVisible, setSpaceModalVisible] = useState(false);
  const [professionModalVisible, setProfessionModalVisible] = useState(false);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingSpace, setEditingSpace] = useState<SpaceCategory | null>(null);
  const [editingProfession, setEditingProfession] = useState<ProfessionCategory | null>(null);
  const [editingRule, setEditingRule] = useState<MappingRule | null>(null);
  const [spaceForm] = Form.useForm();
  const [professionForm] = Form.useForm();
  const [ruleForm] = Form.useForm();

  // 空间分类列定义
  const spaceColumns: ColumnsType<SpaceCategory> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 80,
      render: (code, record) => <Tag color={record.color}>{code}</Tag>,
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 80 },
    { title: '完整名称', dataIndex: 'fullName', key: 'fullName', width: 100 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200, ellipsis: true },
    { title: '面积字段', dataIndex: 'areaField', key: 'areaField', width: 140 },
    {
      title: '识别关键字',
      dataIndex: 'identifyKeywords',
      key: 'identifyKeywords',
      width: 200,
      ellipsis: true,
      render: (keywords: string[]) => keywords.slice(0, 3).join(', ') + (keywords.length > 3 ? '...' : ''),
    },
    {
      title: '系统',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 60,
      render: (v) => v ? <Tag color="purple">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '启用' : '停用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditSpace(record)}>编辑</Button>
          {!record.isSystem && (
            <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 专业分类列定义
  const professionColumns: ColumnsType<ProfessionCategory> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 80,
      render: (code, record) => <Tag color={record.color}>{code}</Tag>,
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 80 },
    { title: '完整名称', dataIndex: 'fullName', key: 'fullName', width: 120 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 180, ellipsis: true },
    {
      title: '识别关键字',
      dataIndex: 'identifyKeywords',
      key: 'identifyKeywords',
      width: 180,
      ellipsis: true,
      render: (keywords: string[]) => keywords.slice(0, 3).join(', ') + (keywords.length > 3 ? '...' : ''),
    },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 60, align: 'center' },
    {
      title: '系统',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 60,
      render: (v) => v ? <Tag color="purple">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '启用' : '停用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditProfession(record)}>编辑</Button>
          {!record.isSystem && (
            <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 映射规则列定义
  const ruleColumns: ColumnsType<MappingRule> = [
    {
      title: '映射类型',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 80,
      render: (type) => <Tag color={type === 'space' ? 'blue' : 'green'}>{type === 'space' ? '空间' : '专业'}</Tag>,
    },
    { title: '源字段', dataIndex: 'sourceField', key: 'sourceField', width: 100 },
    { title: '关键字', dataIndex: 'keyword', key: 'keyword', width: 100 },
    {
      title: '匹配方式',
      dataIndex: 'matchType',
      key: 'matchType',
      width: 100,
      render: (type) => {
        const typeMap: Record<string, string> = {
          exact: '精确匹配',
          contains: '包含匹配',
          startsWith: '前缀匹配',
          endsWith: '后缀匹配',
          regex: '正则匹配',
          lt: '小于',
          lte: '小于等于',
          gt: '大于',
          gte: '大于等于',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '目标',
      key: 'target',
      width: 120,
      render: (_, record) => (
        <span>
          <Tag color="cyan">{record.targetCode}</Tag>
          {record.targetName}
        </span>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 80,
      align: 'center',
      render: (v) => `${(v * 100).toFixed(0)}%`,
    },
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 70, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '启用' : '停用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditRule(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 编辑空间分类
  const handleEditSpace = (space: SpaceCategory) => {
    setEditingSpace(space);
    spaceForm.setFieldsValue(space);
    setSpaceModalVisible(true);
  };

  // 编辑专业分类
  const handleEditProfession = (profession: ProfessionCategory) => {
    setEditingProfession(profession);
    professionForm.setFieldsValue(profession);
    setProfessionModalVisible(true);
  };

  // 编辑映射规则
  const handleEditRule = (rule: MappingRule) => {
    setEditingRule(rule);
    ruleForm.setFieldsValue(rule);
    setRuleModalVisible(true);
  };

  // 保存空间分类
  const handleSaveSpace = () => {
    spaceForm.validateFields().then((values) => {
      console.log('保存空间分类:', values);
      message.success(editingSpace ? '更新成功' : '创建成功');
      setSpaceModalVisible(false);
      spaceForm.resetFields();
      setEditingSpace(null);
    });
  };

  // 保存专业分类
  const handleSaveProfession = () => {
    professionForm.validateFields().then((values) => {
      console.log('保存专业分类:', values);
      message.success(editingProfession ? '更新成功' : '创建成功');
      setProfessionModalVisible(false);
      professionForm.resetFields();
      setEditingProfession(null);
    });
  };

  // 保存映射规则
  const handleSaveRule = () => {
    ruleForm.validateFields().then((values) => {
      console.log('保存映射规则:', values);
      message.success(editingRule ? '更新成功' : '创建成功');
      setRuleModalVisible(false);
      ruleForm.resetFields();
      setEditingRule(null);
    });
  };

  // 空间分类Tab
  const SpaceTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">空间分类（一级子目）：按建筑物理位置划分</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSpace(null);
            spaceForm.resetFields();
            setSpaceModalVisible(true);
          }}
        >
          新建空间分类
        </Button>
      </div>

      {/* 空间分类可视化 */}
      <Card size="small" title="空间分类概览">
        <Row gutter={16}>
          {mockSpaceCategories.map(space => (
            <Col span={6} key={space.id}>
              <div className="p-4 rounded border" style={{ borderColor: space.color }}>
                <div className="flex items-center justify-between mb-2">
                  <Tag color={space.color}>{space.code}</Tag>
                  <span className="font-medium">{space.name}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{space.description}</div>
                <div className="text-xs">
                  <span className="text-gray-400">面积字段：</span>
                  <span>{space.areaField || '-'}</span>
                </div>
                <div className="text-xs mt-1">
                  <span className="text-gray-400">适用专业：</span>
                  <span>{space.applicableProfessions.length}个</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Table
        rowKey="id"
        columns={spaceColumns}
        dataSource={mockSpaceCategories}
        pagination={false}
        size="small"
        scroll={{ x: 1100 }}
      />
    </div>
  );

  // 专业分类Tab
  const ProfessionTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">专业分类（二级子目）：按工程专业类别划分</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProfession(null);
            professionForm.resetFields();
            setProfessionModalVisible(true);
          }}
        >
          新建专业分类
        </Button>
      </div>

      {/* 专业分类可视化 */}
      <Card size="small" title="专业分类概览">
        <div className="flex flex-wrap gap-2">
          {mockProfessionCategories.map(prof => (
            <div
              key={prof.id}
              className="px-3 py-2 rounded border cursor-pointer hover:shadow"
              style={{ borderColor: prof.color }}
            >
              <Tag color={prof.color}>{prof.code}</Tag>
              <span className="ml-1">{prof.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Table
        rowKey="id"
        columns={professionColumns}
        dataSource={mockProfessionCategories}
        pagination={false}
        size="small"
        scroll={{ x: 1000 }}
      />
    </div>
  );

  // 映射规则Tab
  const MappingTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Space>
          <span className="text-gray-500">映射规则：将原始数据分类名称映射到标准分类</span>
          <Select defaultValue="" style={{ width: 120 }}>
            <Select.Option value="">全部类型</Select.Option>
            <Select.Option value="space">空间映射</Select.Option>
            <Select.Option value="profession">专业映射</Select.Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRule(null);
            ruleForm.resetFields();
            setRuleModalVisible(true);
          }}
        >
          新建映射规则
        </Button>
      </div>

      <Card size="small" title="匹配类型说明">
        <Row gutter={16}>
          <Col span={8}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="exact">精确匹配，完全相等</Descriptions.Item>
              <Descriptions.Item label="contains">包含匹配，包含关键字</Descriptions.Item>
              <Descriptions.Item label="startsWith">前缀匹配，以关键字开头</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="endsWith">后缀匹配，以关键字结尾</Descriptions.Item>
              <Descriptions.Item label="regex">正则匹配，正则表达式</Descriptions.Item>
              <Descriptions.Item label="lt/lte">小于/小于等于（数值）</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="gt/gte">大于/大于等于（数值）</Descriptions.Item>
              <Descriptions.Item label="置信度">匹配结果的可信程度</Descriptions.Item>
              <Descriptions.Item label="优先级">多规则匹配时的优先顺序</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Table
        rowKey="id"
        columns={ruleColumns}
        dataSource={mockMappingRules}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        size="small"
        scroll={{ x: 1000 }}
      />
    </div>
  );

  // 分类层级Tab
  const HierarchyTab = () => (
    <Card size="small" title="分类层级关系">
      <div className="p-4 bg-gray-50 rounded">
        <pre className="text-sm">
{`单体工程
├── 一级子目：空间分类
│   ├── 地上 (DS)
│   │   └── 二级子目：专业分类
│   │       ├── 土建 (TJ)
│   │       ├── 装饰 (ZS)
│   │       ├── 给排水 (GPS)
│   │       ├── 强电 (QD)
│   │       ├── 弱电 (RD)
│   │       ├── 暖通 (NT)
│   │       ├── 消防 (XF)
│   │       ├── 电梯 (DT)
│   │       └── 智能化 (ZN)
│   ├── 地下 (DX)
│   │   └── 二级子目：专业分类
│   │       └── (同上)
│   └── 室外 (SW)
│       └── 二级子目：专业分类
│           ├── 土建 (TJ)
│           ├── 给排水 (GPS)
│           ├── 强电 (QD)
│           └── 园林 (YL)`}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <div className="font-medium mb-2">分类原则说明</div>
        <Row gutter={16}>
          <Col span={12}>
            <div className="text-sm">
              <div className="font-medium text-blue-600 mb-1">空间分类原则：</div>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>空间是估算阶段最早确定的信息</li>
                <li>空间决定造价的"大盘子"</li>
                <li>空间边界清晰，不会重叠</li>
              </ul>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-sm">
              <div className="font-medium text-green-600 mb-1">专业分类原则：</div>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>专业是造价数据的天然归集口径</li>
                <li>专业对应设计分工</li>
                <li>专业对应施工分包</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  const tabItems = [
    { key: 'space', label: '空间分类', children: <SpaceTab /> },
    { key: 'profession', label: '专业分类', children: <ProfessionTab /> },
    { key: 'mapping', label: '映射规则', children: <MappingTab /> },
    { key: 'hierarchy', label: '分类层级', children: <HierarchyTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">标准映射管理</span>
          <Space>
            <span className="text-gray-400">
              空间分类 {mockSpaceCategories.length} 个 | 专业分类 {mockProfessionCategories.length} 个 | 映射规则 {mockMappingRules.length} 条
            </span>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-blue-600">{mockSpaceCategories.length}</div>
              <div className="text-sm text-gray-500">空间分类</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-green-600">{mockProfessionCategories.length}</div>
              <div className="text-sm text-gray-500">专业分类</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-orange-600">{mockMappingRules.length}</div>
              <div className="text-sm text-gray-500">映射规则</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-purple-600">
                {mockSpaceCategories.length * mockProfessionCategories.length}
              </div>
              <div className="text-sm text-gray-500">分类组合</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 空间分类编辑弹窗 */}
      <Modal
        title={editingSpace ? '编辑空间分类' : '新建空间分类'}
        open={spaceModalVisible}
        onOk={handleSaveSpace}
        onCancel={() => setSpaceModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={spaceForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="code" label="编码" rules={[{ required: true }]}>
                <Input placeholder="如：DS" disabled={editingSpace?.isSystem} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input placeholder="如：地上" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="fullName" label="完整名称">
                <Input placeholder="如：地上部分" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="areaField" label="面积字段">
                <Input placeholder="如：aboveGroundArea" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="主题色">
                <Input placeholder="#1890FF" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="identifyKeywords" label="识别关键字">
            <Select mode="tags" placeholder="输入关键字后回车" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 专业分类编辑弹窗 */}
      <Modal
        title={editingProfession ? '编辑专业分类' : '新建专业分类'}
        open={professionModalVisible}
        onOk={handleSaveProfession}
        onCancel={() => setProfessionModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={professionForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="code" label="编码" rules={[{ required: true }]}>
                <Input placeholder="如：TJ" disabled={editingProfession?.isSystem} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input placeholder="如：土建" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="fullName" label="完整名称">
                <Input placeholder="如：土建工程" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序号">
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="主题色">
                <Input placeholder="#1890FF" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="identifyKeywords" label="识别关键字">
            <Select mode="tags" placeholder="输入关键字后回车" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 映射规则编辑弹窗 */}
      <Modal
        title={editingRule ? '编辑映射规则' : '新建映射规则'}
        open={ruleModalVisible}
        onOk={handleSaveRule}
        onCancel={() => setRuleModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={ruleForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sourceType" label="映射类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Select.Option value="space">空间映射</Select.Option>
                  <Select.Option value="profession">专业映射</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sourceField" label="源字段" rules={[{ required: true }]}>
                <Select placeholder="选择字段">
                  <Select.Option value="name">名称</Select.Option>
                  <Select.Option value="floorNumber">楼层号</Select.Option>
                  <Select.Option value="path">路径</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="keyword" label="匹配关键字" rules={[{ required: true }]}>
                <Input placeholder="如：地上" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="matchType" label="匹配方式" rules={[{ required: true }]}>
                <Select placeholder="选择匹配方式">
                  <Select.Option value="exact">精确匹配</Select.Option>
                  <Select.Option value="contains">包含匹配</Select.Option>
                  <Select.Option value="startsWith">前缀匹配</Select.Option>
                  <Select.Option value="endsWith">后缀匹配</Select.Option>
                  <Select.Option value="regex">正则匹配</Select.Option>
                  <Select.Option value="lt">小于</Select.Option>
                  <Select.Option value="lte">小于等于</Select.Option>
                  <Select.Option value="gt">大于</Select.Option>
                  <Select.Option value="gte">大于等于</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="targetCode" label="目标编码" rules={[{ required: true }]}>
                <Select placeholder="选择目标">
                  {mockSpaceCategories.map(s => (
                    <Select.Option key={s.code} value={s.code}>{s.code} - {s.name}</Select.Option>
                  ))}
                  {mockProfessionCategories.map(p => (
                    <Select.Option key={p.code} value={p.code}>{p.code} - {p.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="targetName" label="目标名称">
                <Input placeholder="自动填充" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="confidence" label="置信度" initialValue={0.9}>
                <Input type="number" step={0.05} min={0} max={1} placeholder="0-1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" initialValue={10}>
                <Input type="number" placeholder="数值越大优先级越高" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StandardMappingPage;
