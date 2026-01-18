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

// 分档类型数据类型
interface ScaleType {
  id: string;
  code: string;
  name: string;
  unit: string;
  description: string;
  applicableTagCategories: string[];
  priority: number;
  isSystem: boolean;
  rangeCount: number;
  sortOrder: number;
  status: string;
}

// 规模档位数据类型
interface ScaleRange {
  id: string;
  scaleTypeId: string;
  scaleTypeCode: string;
  scaleTypeName: string;
  code: string;
  name: string;
  shortName: string;
  minValue: number;
  maxValue: number;
  rangeText: string;
  sortOrder: number;
  status: string;
}

// 模拟分档类型数据
const mockScaleTypes: ScaleType[] = [
  { id: '1', code: 'AREA', name: '建筑面积', unit: 'm²', description: '按建筑面积划分的通用分档', applicableTagCategories: [], priority: 1, isSystem: true, rangeCount: 5, sortOrder: 1, status: 'active' },
  { id: '2', code: 'BED', name: '床位数', unit: '床', description: '按床位数划分，适用于医疗、养老', applicableTagCategories: ['YI', 'YA'], priority: 10, isSystem: true, rangeCount: 5, sortOrder: 2, status: 'active' },
  { id: '3', code: 'CLASS', name: '班级数', unit: '班', description: '按班级数划分，适用于教育', applicableTagCategories: ['JY'], priority: 10, isSystem: true, rangeCount: 5, sortOrder: 3, status: 'active' },
  { id: '4', code: 'SEAT', name: '座位数', unit: '座', description: '按座位数划分，适用于体育、文化', applicableTagCategories: ['TI', 'WH'], priority: 10, isSystem: true, rangeCount: 4, sortOrder: 4, status: 'active' },
  { id: '5', code: 'ROOM', name: '客房数', unit: '间', description: '按客房数划分，适用于酒店', applicableTagCategories: ['JD'], priority: 10, isSystem: true, rangeCount: 4, sortOrder: 5, status: 'active' },
  { id: '6', code: 'PARKING', name: '车位数', unit: '个', description: '按车位数划分，适用于停车', applicableTagCategories: ['TG'], priority: 10, isSystem: true, rangeCount: 4, sortOrder: 6, status: 'active' },
  { id: '7', code: 'HOUSEHOLD', name: '户数', unit: '户', description: '按户数划分，适用于居住', applicableTagCategories: ['JZ'], priority: 10, isSystem: true, rangeCount: 4, sortOrder: 7, status: 'active' },
];

// 模拟规模档位数据
const mockScaleRanges: ScaleRange[] = [
  // 建筑面积分档
  { id: 'R001', scaleTypeId: '1', scaleTypeCode: 'AREA', scaleTypeName: '建筑面积', code: 'XS', name: '小型', shortName: '小', minValue: 0, maxValue: 3000, rangeText: '<3000m²', sortOrder: 1, status: 'active' },
  { id: 'R002', scaleTypeId: '1', scaleTypeCode: 'AREA', scaleTypeName: '建筑面积', code: 'ZX', name: '中小型', shortName: '中小', minValue: 3000, maxValue: 10000, rangeText: '3000-10000m²', sortOrder: 2, status: 'active' },
  { id: 'R003', scaleTypeId: '1', scaleTypeCode: 'AREA', scaleTypeName: '建筑面积', code: 'ZD', name: '中型', shortName: '中', minValue: 10000, maxValue: 30000, rangeText: '10000-30000m²', sortOrder: 3, status: 'active' },
  { id: 'R004', scaleTypeId: '1', scaleTypeCode: 'AREA', scaleTypeName: '建筑面积', code: 'ZDX', name: '中大型', shortName: '中大', minValue: 30000, maxValue: 80000, rangeText: '30000-80000m²', sortOrder: 4, status: 'active' },
  { id: 'R005', scaleTypeId: '1', scaleTypeCode: 'AREA', scaleTypeName: '建筑面积', code: 'DX', name: '大型', shortName: '大', minValue: 80000, maxValue: -1, rangeText: '≥80000m²', sortOrder: 5, status: 'active' },
  // 床位数分档
  { id: 'R006', scaleTypeId: '2', scaleTypeCode: 'BED', scaleTypeName: '床位数', code: 'XS', name: '小型', shortName: '小', minValue: 0, maxValue: 100, rangeText: '<100床', sortOrder: 1, status: 'active' },
  { id: 'R007', scaleTypeId: '2', scaleTypeCode: 'BED', scaleTypeName: '床位数', code: 'ZX', name: '中小型', shortName: '中小', minValue: 100, maxValue: 300, rangeText: '100-300床', sortOrder: 2, status: 'active' },
  { id: 'R008', scaleTypeId: '2', scaleTypeCode: 'BED', scaleTypeName: '床位数', code: 'ZD', name: '中型', shortName: '中', minValue: 300, maxValue: 600, rangeText: '300-600床', sortOrder: 3, status: 'active' },
  { id: 'R009', scaleTypeId: '2', scaleTypeCode: 'BED', scaleTypeName: '床位数', code: 'ZDX', name: '中大型', shortName: '中大', minValue: 600, maxValue: 1000, rangeText: '600-1000床', sortOrder: 4, status: 'active' },
  { id: 'R010', scaleTypeId: '2', scaleTypeCode: 'BED', scaleTypeName: '床位数', code: 'DX', name: '大型', shortName: '大', minValue: 1000, maxValue: -1, rangeText: '≥1000床', sortOrder: 5, status: 'active' },
  // 班级数分档
  { id: 'R011', scaleTypeId: '3', scaleTypeCode: 'CLASS', scaleTypeName: '班级数', code: 'XS', name: '小型', shortName: '小', minValue: 0, maxValue: 18, rangeText: '<18班', sortOrder: 1, status: 'active' },
  { id: 'R012', scaleTypeId: '3', scaleTypeCode: 'CLASS', scaleTypeName: '班级数', code: 'ZX', name: '中小型', shortName: '中小', minValue: 18, maxValue: 36, rangeText: '18-36班', sortOrder: 2, status: 'active' },
  { id: 'R013', scaleTypeId: '3', scaleTypeCode: 'CLASS', scaleTypeName: '班级数', code: 'ZD', name: '中型', shortName: '中', minValue: 36, maxValue: 60, rangeText: '36-60班', sortOrder: 3, status: 'active' },
  { id: 'R014', scaleTypeId: '3', scaleTypeCode: 'CLASS', scaleTypeName: '班级数', code: 'ZDX', name: '中大型', shortName: '中大', minValue: 60, maxValue: 90, rangeText: '60-90班', sortOrder: 4, status: 'active' },
  { id: 'R015', scaleTypeId: '3', scaleTypeCode: 'CLASS', scaleTypeName: '班级数', code: 'DX', name: '大型', shortName: '大', minValue: 90, maxValue: -1, rangeText: '≥90班', sortOrder: 5, status: 'active' },
];

const ScaleRangePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('types');
  const [selectedType, setSelectedType] = useState<string>('AREA');
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [rangeModalVisible, setRangeModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<ScaleType | null>(null);
  const [editingRange, setEditingRange] = useState<ScaleRange | null>(null);
  const [typeForm] = Form.useForm();
  const [rangeForm] = Form.useForm();

  // 分档类型列定义
  const typeColumns: ColumnsType<ScaleType> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200, ellipsis: true },
    {
      title: '适用范围',
      dataIndex: 'applicableTagCategories',
      key: 'applicableTagCategories',
      width: 150,
      render: (cats: string[]) => cats.length > 0 ? cats.map(c => <Tag key={c}>{c}</Tag>) : <Tag color="green">通用</Tag>,
    },
    { title: '档位数', dataIndex: 'rangeCount', key: 'rangeCount', width: 70, align: 'center' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 70, align: 'center' },
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
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditType(record)}
          >
            编辑
          </Button>
          {!record.isSystem && (
            <Popconfirm title="确定删除此分档类型？" onConfirm={() => message.success('删除成功')}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 规模档位列定义
  const rangeColumns: ColumnsType<ScaleRange> = [
    {
      title: '档位编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="cyan">{code}</Tag>,
    },
    { title: '档位名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '简称', dataIndex: 'shortName', key: 'shortName', width: 60 },
    {
      title: '区间范围',
      dataIndex: 'rangeText',
      key: 'rangeText',
      width: 150,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: '最小值',
      dataIndex: 'minValue',
      key: 'minValue',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString(),
    },
    {
      title: '最大值',
      dataIndex: 'maxValue',
      key: 'maxValue',
      width: 100,
      align: 'right',
      render: (v) => v === -1 ? '无上限' : v.toLocaleString(),
    },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 60, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRange(record)}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此档位？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 编辑分档类型
  const handleEditType = (type: ScaleType) => {
    setEditingType(type);
    typeForm.setFieldsValue(type);
    setTypeModalVisible(true);
  };

  // 编辑档位
  const handleEditRange = (range: ScaleRange) => {
    setEditingRange(range);
    rangeForm.setFieldsValue(range);
    setRangeModalVisible(true);
  };

  // 保存分档类型
  const handleSaveType = () => {
    typeForm.validateFields().then((values) => {
      console.log('保存分档类型:', values);
      message.success(editingType ? '更新成功' : '创建成功');
      setTypeModalVisible(false);
      typeForm.resetFields();
      setEditingType(null);
    });
  };

  // 保存档位
  const handleSaveRange = () => {
    rangeForm.validateFields().then((values) => {
      console.log('保存档位:', values);
      message.success(editingRange ? '更新成功' : '创建成功');
      setRangeModalVisible(false);
      rangeForm.resetFields();
      setEditingRange(null);
    });
  };

  // 过滤档位
  const filteredRanges = mockScaleRanges.filter(r => r.scaleTypeCode === selectedType);
  const selectedTypeInfo = mockScaleTypes.find(t => t.code === selectedType);

  // 分档类型Tab
  const TypesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">管理规模分档类型，如建筑面积、床位数、班级数等</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingType(null);
            typeForm.resetFields();
            setTypeModalVisible(true);
          }}
        >
          新建分档类型
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={typeColumns}
        dataSource={mockScaleTypes}
        pagination={false}
        size="small"
      />
    </div>
  );

  // 规模档位Tab
  const RangesTab = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card size="small" title="分档类型" style={{ height: 500 }}>
          <div className="space-y-2">
            {mockScaleTypes.map(type => (
              <div
                key={type.code}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedType === type.code ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedType(type.code)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{type.name}</span>
                  <Tag color="blue">{type.code}</Tag>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {type.unit} | {type.rangeCount}个档位
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
      <Col span={18}>
        <Card
          size="small"
          title={
            <span>
              档位配置 - {selectedTypeInfo?.name}
              <span className="text-gray-400 font-normal ml-2">({selectedTypeInfo?.unit})</span>
            </span>
          }
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRange(null);
                rangeForm.resetFields();
                rangeForm.setFieldValue('scaleTypeCode', selectedType);
                setRangeModalVisible(true);
              }}
            >
              新建档位
            </Button>
          }
        >
          {selectedTypeInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <Descriptions size="small" column={4}>
                <Descriptions.Item label="类型编码">
                  <Tag color="blue">{selectedTypeInfo.code}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="计量单位">{selectedTypeInfo.unit}</Descriptions.Item>
                <Descriptions.Item label="优先级">{selectedTypeInfo.priority}</Descriptions.Item>
                <Descriptions.Item label="适用范围">
                  {selectedTypeInfo.applicableTagCategories.length > 0
                    ? selectedTypeInfo.applicableTagCategories.join(', ')
                    : '通用'}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
          <Table
            rowKey="id"
            columns={rangeColumns}
            dataSource={filteredRanges}
            pagination={false}
            size="small"
          />

          {/* 档位可视化 */}
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">档位区间可视化</div>
            <div className="flex h-8 rounded overflow-hidden">
              {filteredRanges.map((range, idx) => (
                <div
                  key={range.id}
                  className="flex items-center justify-center text-white text-xs"
                  style={{
                    flex: range.maxValue === -1 ? 1 : (range.maxValue - range.minValue) / 100000,
                    minWidth: 60,
                    backgroundColor: ['#1890FF', '#52C41A', '#FAAD14', '#F5222D', '#722ED1'][idx % 5],
                  }}
                >
                  {range.shortName}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              {filteredRanges.slice(0, -1).map(range => (
                <span key={range.id}>{range.maxValue.toLocaleString()}</span>
              ))}
              <span>∞</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // 分档规则Tab
  const RulesTab = () => (
    <Card size="small" title="分档优先级规则">
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded">
          <div className="font-medium mb-2">分档优先级说明</div>
          <p className="text-sm text-gray-600">
            当单体同时具备面积和功能规模时，按以下优先级确定分档：
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
            <li><strong>功能规模分档</strong>（如有）：更能反映业态特征，优先级高</li>
            <li><strong>面积分档</strong>（兜底）：通用适用，优先级低</li>
          </ol>
        </div>

        <Table
          rowKey="code"
          columns={[
            { title: '分档类型', dataIndex: 'name', key: 'name', width: 120 },
            { title: '编码', dataIndex: 'code', key: 'code', width: 100, render: (v: string) => <Tag color="blue">{v}</Tag> },
            { title: '优先级', dataIndex: 'priority', key: 'priority', width: 80, align: 'center' as const },
            { title: '适用标签大类', dataIndex: 'applicableTagCategories', key: 'applicableTagCategories', render: (cats: string[]) => cats.length > 0 ? cats.join(', ') : '通用（所有标签）' },
            { title: '说明', dataIndex: 'description', key: 'description' },
          ]}
          dataSource={mockScaleTypes.sort((a, b) => b.priority - a.priority)}
          pagination={false}
          size="small"
        />

        <div className="p-4 bg-orange-50 rounded">
          <div className="font-medium mb-2">规模效应说明</div>
          <p className="text-sm text-gray-600">
            建筑规模与单方造价通常呈现以下规律：
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
            <li><strong>小型建筑</strong>：规模小，固定成本分摊高，单方造价偏高</li>
            <li><strong>中型建筑</strong>：规模适中，单方造价趋于稳定</li>
            <li><strong>大型建筑</strong>：规模效应显现，单方造价略有下降或持平</li>
          </ul>
        </div>
      </div>
    </Card>
  );

  const tabItems = [
    { key: 'types', label: '分档类型', children: <TypesTab /> },
    { key: 'ranges', label: '规模档位', children: <RangesTab /> },
    { key: 'rules', label: '分档规则', children: <RulesTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">规模分档配置</span>
          <Space>
            <span className="text-gray-400">
              共 {mockScaleTypes.length} 种分档类型，{mockScaleRanges.length} 个档位
            </span>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          {mockScaleTypes.slice(0, 7).map(type => (
            <Col span={3} key={type.id}>
              <div
                className="text-center p-2 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setActiveTab('ranges');
                  setSelectedType(type.code);
                }}
              >
                <Tag color="blue">{type.code}</Tag>
                <div className="text-sm mt-1">{type.name}</div>
                <div className="text-xs text-gray-400">{type.rangeCount}个档位</div>
              </div>
            </Col>
          ))}
          <Col span={3}>
            <div className="text-center p-2 rounded">
              <div className="text-lg font-bold text-blue-600">{mockScaleRanges.length}</div>
              <div className="text-sm">档位总数</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 分档类型编辑弹窗 */}
      <Modal
        title={editingType ? '编辑分档类型' : '新建分档类型'}
        open={typeModalVisible}
        onOk={handleSaveType}
        onCancel={() => setTypeModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={typeForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="类型编码" rules={[{ required: true }]}>
                <Input placeholder="如：AREA" maxLength={20} disabled={editingType?.isSystem} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="类型名称" rules={[{ required: true }]}>
                <Input placeholder="如：建筑面积" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="unit" label="计量单位" rules={[{ required: true }]}>
                <Input placeholder="如：m²、床、班" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                <Input type="number" placeholder="数值越大优先级越高" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="描述说明" />
          </Form.Item>
          <Form.Item name="applicableTagCategories" label="适用标签大类">
            <Select mode="multiple" placeholder="留空表示通用">
              <Select.Option value="YI">医疗卫生</Select.Option>
              <Select.Option value="JY">教育</Select.Option>
              <Select.Option value="BG">办公</Select.Option>
              <Select.Option value="SY">商业</Select.Option>
              <Select.Option value="JD">酒店</Select.Option>
              <Select.Option value="WH">文化</Select.Option>
              <Select.Option value="TI">体育</Select.Option>
              <Select.Option value="JZ">居住</Select.Option>
              <Select.Option value="YA">养老</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 档位编辑弹窗 */}
      <Modal
        title={editingRange ? '编辑规模档位' : '新建规模档位'}
        open={rangeModalVisible}
        onOk={handleSaveRange}
        onCancel={() => setRangeModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={rangeForm} layout="vertical">
          <Form.Item name="scaleTypeCode" label="所属分档类型" rules={[{ required: true }]}>
            <Select placeholder="选择分档类型" disabled={!!editingRange}>
              {mockScaleTypes.map(type => (
                <Select.Option key={type.code} value={type.code}>{type.name} ({type.unit})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="code" label="档位编码" rules={[{ required: true }]}>
                <Input placeholder="如：XS" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="档位名称" rules={[{ required: true }]}>
                <Input placeholder="如：小型" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="shortName" label="简称" rules={[{ required: true }]}>
                <Input placeholder="如：小" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minValue" label="最小值（含）" rules={[{ required: true }]}>
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxValue" label="最大值（不含，-1表示无上限）" rules={[{ required: true }]}>
                <Input type="number" placeholder="3000" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rangeText" label="区间显示文本" rules={[{ required: true }]}>
                <Input placeholder="如：<3000m²" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序号" rules={[{ required: true }]}>
                <Input type="number" placeholder="1" />
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

export default ScaleRangePage;
