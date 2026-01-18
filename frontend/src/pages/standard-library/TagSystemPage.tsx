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
  Tree,
  Descriptions,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

// 标签大类数据类型
interface TagCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tagCount: number;
  sortOrder: number;
  status: string;
}

// 功能标签数据类型
interface FunctionTag {
  id: string;
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  code: string;
  name: string;
  fullName: string;
  description: string;
  defaultSpaces: string[];
  defaultUnit: string;
  functionalUnit: string;
  keywords: string[];
  sortOrder: number;
  status: string;
}

// 模拟标签大类数据
const mockCategories: TagCategory[] = [
  { id: '1', code: 'YI', name: '医疗卫生', description: '各类医疗机构的功能单元', icon: 'medicine-box', color: '#1890FF', tagCount: 30, sortOrder: 1, status: 'active' },
  { id: '2', code: 'JY', name: '教育', description: '各级各类学校的功能单元', icon: 'read', color: '#52C41A', tagCount: 30, sortOrder: 2, status: 'active' },
  { id: '3', code: 'BG', name: '办公', description: '办公类建筑的功能单元', icon: 'bank', color: '#722ED1', tagCount: 15, sortOrder: 3, status: 'active' },
  { id: '4', code: 'SY', name: '商业', description: '商业类建筑的功能单元', icon: 'shop', color: '#FA8C16', tagCount: 16, sortOrder: 4, status: 'active' },
  { id: '5', code: 'JD', name: '酒店', description: '酒店类建筑的功能单元', icon: 'home', color: '#EB2F96', tagCount: 17, sortOrder: 5, status: 'active' },
  { id: '6', code: 'WH', name: '文化', description: '文化类建筑的功能单元', icon: 'book', color: '#13C2C2', tagCount: 17, sortOrder: 6, status: 'active' },
  { id: '7', code: 'TI', name: '体育', description: '体育类建筑的功能单元', icon: 'trophy', color: '#F5222D', tagCount: 16, sortOrder: 7, status: 'active' },
  { id: '8', code: 'JZ', name: '居住', description: '居住类建筑的功能单元', icon: 'home', color: '#FAAD14', tagCount: 20, sortOrder: 8, status: 'active' },
  { id: '9', code: 'YA', name: '养老', description: '养老类建筑的功能单元', icon: 'heart', color: '#A0D911', tagCount: 10, sortOrder: 9, status: 'active' },
  { id: '10', code: 'SF', name: '司法', description: '司法类建筑的功能单元', icon: 'safety', color: '#2F54EB', tagCount: 11, sortOrder: 10, status: 'active' },
  { id: '11', code: 'JT', name: '交通', description: '交通类建筑的功能单元', icon: 'car', color: '#597EF7', tagCount: 11, sortOrder: 11, status: 'active' },
  { id: '12', code: 'GY', name: '工业', description: '工业类建筑的功能单元', icon: 'tool', color: '#8C8C8C', tagCount: 16, sortOrder: 12, status: 'active' },
  { id: '13', code: 'TG', name: '通用', description: '各类项目通用的功能单元', icon: 'appstore', color: '#595959', tagCount: 15, sortOrder: 13, status: 'active' },
  { id: '14', code: 'SW', name: '室外/总平', description: '室外工程的功能单元', icon: 'environment', color: '#389E0D', tagCount: 15, sortOrder: 14, status: 'active' },
];

// 模拟功能标签数据
const mockTags: FunctionTag[] = [
  { id: 'T001', categoryId: '1', categoryCode: 'YI', categoryName: '医疗卫生', code: 'YI-01', name: '门诊', fullName: '医疗卫生-门诊', description: '普通门诊、专家门诊', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['门诊', '门诊楼', '门诊部'], sortOrder: 1, status: 'active' },
  { id: 'T002', categoryId: '1', categoryCode: 'YI', categoryName: '医疗卫生', code: 'YI-02', name: '急诊', fullName: '医疗卫生-急诊', description: '急诊科、急救中心', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['急诊', '急救'], sortOrder: 2, status: 'active' },
  { id: 'T003', categoryId: '1', categoryCode: 'YI', categoryName: '医疗卫生', code: 'YI-03', name: '住院', fullName: '医疗卫生-住院', description: '住院病房楼', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '床', keywords: ['住院', '病房', '住院楼'], sortOrder: 3, status: 'active' },
  { id: 'T004', categoryId: '1', categoryCode: 'YI', categoryName: '医疗卫生', code: 'YI-04', name: '医技', fullName: '医疗卫生-医技', description: '检验、影像、手术等', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['医技', '检验', '影像', '手术'], sortOrder: 4, status: 'active' },
  { id: 'T005', categoryId: '2', categoryCode: 'JY', categoryName: '教育', code: 'JY-01', name: '教学楼', fullName: '教育-教学楼', description: '普通教室、专用教室', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '班', keywords: ['教学', '教室', '教学楼'], sortOrder: 1, status: 'active' },
  { id: 'T006', categoryId: '2', categoryCode: 'JY', categoryName: '教育', code: 'JY-02', name: '实验楼', fullName: '教育-实验楼', description: '理化生实验室', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['实验', '实验室', '实验楼'], sortOrder: 2, status: 'active' },
  { id: 'T007', categoryId: '2', categoryCode: 'JY', categoryName: '教育', code: 'JY-03', name: '图书馆', fullName: '教育-图书馆', description: '图书馆、阅览室', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '座', keywords: ['图书', '阅览', '图书馆'], sortOrder: 3, status: 'active' },
  { id: 'T008', categoryId: '3', categoryCode: 'BG', categoryName: '办公', code: 'BG-01', name: '办公楼', fullName: '办公-办公楼', description: '综合办公楼', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['办公', '办公楼', '写字楼'], sortOrder: 1, status: 'active' },
  { id: 'T009', categoryId: '3', categoryCode: 'BG', categoryName: '办公', code: 'BG-02', name: '行政中心', fullName: '办公-行政中心', description: '政府行政办公', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['行政', '政务', '行政中心'], sortOrder: 2, status: 'active' },
  { id: 'T010', categoryId: '4', categoryCode: 'SY', categoryName: '商业', code: 'SY-01', name: '商场', fullName: '商业-商场', description: '购物中心、百货商场', defaultSpaces: ['DS', 'DX'], defaultUnit: 'm²', functionalUnit: '', keywords: ['商场', '购物', '百货'], sortOrder: 1, status: 'active' },
];

// 构建树形数据
const buildTreeData = () => {
  return mockCategories.map(cat => ({
    title: `${cat.name} (${cat.tagCount})`,
    key: cat.code,
    children: mockTags
      .filter(tag => tag.categoryCode === cat.code)
      .map(tag => ({
        title: tag.name,
        key: tag.code,
        isLeaf: true,
      })),
  }));
};

const TagSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TagCategory | null>(null);
  const [editingTag, setEditingTag] = useState<FunctionTag | null>(null);
  const [categoryForm] = Form.useForm();
  const [tagForm] = Form.useForm();

  // 标签大类列定义
  const categoryColumns: ColumnsType<TagCategory> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 80,
      render: (code, record) => (
        <Tag color={record.color}>{code}</Tag>
      ),
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200, ellipsis: true },
    { title: '标签数', dataIndex: 'tagCount', key: 'tagCount', width: 80, align: 'center' },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 60, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
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
            onClick={() => handleEditCategory(record)}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此大类？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 功能标签列定义
  const tagColumns: ColumnsType<FunctionTag> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
    {
      title: '所属大类',
      key: 'category',
      width: 100,
      render: (_, record) => (
        <Tag>{record.categoryName}</Tag>
      ),
    },
    { title: '描述', dataIndex: 'description', key: 'description', width: 180, ellipsis: true },
    {
      title: '默认空间',
      dataIndex: 'defaultSpaces',
      key: 'defaultSpaces',
      width: 100,
      render: (spaces: string[]) => spaces.map(s => <Tag key={s} color="cyan">{s}</Tag>),
    },
    { title: '功能单位', dataIndex: 'functionalUnit', key: 'functionalUnit', width: 80, render: (v) => v || '-' },
    {
      title: '关键字',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 150,
      ellipsis: true,
      render: (keywords: string[]) => keywords.join(', '),
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
            onClick={() => handleEditTag(record)}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此标签？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 编辑大类
  const handleEditCategory = (category: TagCategory) => {
    setEditingCategory(category);
    categoryForm.setFieldsValue(category);
    setCategoryModalVisible(true);
  };

  // 编辑标签
  const handleEditTag = (tag: FunctionTag) => {
    setEditingTag(tag);
    tagForm.setFieldsValue(tag);
    setTagModalVisible(true);
  };

  // 保存大类
  const handleSaveCategory = () => {
    categoryForm.validateFields().then((values) => {
      console.log('保存大类:', values);
      message.success(editingCategory ? '更新成功' : '创建成功');
      setCategoryModalVisible(false);
      categoryForm.resetFields();
      setEditingCategory(null);
    });
  };

  // 保存标签
  const handleSaveTag = () => {
    tagForm.validateFields().then((values) => {
      console.log('保存标签:', values);
      message.success(editingTag ? '更新成功' : '创建成功');
      setTagModalVisible(false);
      tagForm.resetFields();
      setEditingTag(null);
    });
  };

  // 过滤标签
  const filteredTags = selectedCategory
    ? mockTags.filter(t => t.categoryCode === selectedCategory)
    : mockTags;

  // 标签大类Tab
  const CategoriesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Search placeholder="搜索大类名称或编码" style={{ width: 300 }} />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            categoryForm.resetFields();
            setCategoryModalVisible(true);
          }}
        >
          新建大类
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={categoryColumns}
        dataSource={mockCategories}
        pagination={false}
        size="small"
      />
    </div>
  );

  // 功能标签Tab
  const TagsTab = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card size="small" title="标签分类" style={{ height: 600 }}>
          <Tree
            showLine
            defaultExpandedKeys={['YI', 'JY']}
            treeData={buildTreeData()}
            onSelect={(keys) => {
              if (keys.length > 0) {
                const key = keys[0] as string;
                if (key.includes('-')) {
                  // 选中的是标签
                } else {
                  setSelectedCategory(key);
                }
              } else {
                setSelectedCategory('');
              }
            }}
          />
        </Card>
      </Col>
      <Col span={18}>
        <Card
          size="small"
          title={`功能标签${selectedCategory ? ` - ${mockCategories.find(c => c.code === selectedCategory)?.name || ''}` : ''}`}
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingTag(null);
                tagForm.resetFields();
                if (selectedCategory) {
                  tagForm.setFieldValue('categoryCode', selectedCategory);
                }
                setTagModalVisible(true);
              }}
            >
              新建标签
            </Button>
          }
        >
          <div className="mb-3">
            <Search placeholder="搜索标签名称、编码或关键字" style={{ width: 300 }} />
          </div>
          <Table
            rowKey="id"
            columns={tagColumns}
            dataSource={filteredTags}
            pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
            size="small"
            scroll={{ x: 1100 }}
          />
        </Card>
      </Col>
    </Row>
  );

  // 标签详情Tab
  const TagDetailTab = () => {
    const selectedTag = mockTags[0];
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small" title="选择标签">
            <Select
              showSearch
              placeholder="搜索并选择标签"
              style={{ width: '100%' }}
              defaultValue="YI-01"
              options={mockTags.map(t => ({ label: `${t.code} ${t.name}`, value: t.code }))}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card size="small" title="标签详情">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="标签编码">
                <Tag color="blue">{selectedTag.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="标签名称">{selectedTag.name}</Descriptions.Item>
              <Descriptions.Item label="完整名称">{selectedTag.fullName}</Descriptions.Item>
              <Descriptions.Item label="所属大类">
                <Tag>{selectedTag.categoryName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>{selectedTag.description}</Descriptions.Item>
              <Descriptions.Item label="默认空间">
                {selectedTag.defaultSpaces.map(s => <Tag key={s} color="cyan">{s}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="默认单位">{selectedTag.defaultUnit}</Descriptions.Item>
              <Descriptions.Item label="功能单位">{selectedTag.functionalUnit || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color="green">启用</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="匹配关键字" span={2}>
                {selectedTag.keywords.map(k => <Tag key={k}>{k}</Tag>)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    );
  };

  const tabItems = [
    { key: 'categories', label: '标签大类', children: <CategoriesTab /> },
    { key: 'tags', label: '功能标签', children: <TagsTab /> },
    { key: 'detail', label: '标签详情', children: <TagDetailTab /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">标签体系管理</span>
          <Space>
            <span className="text-gray-400">共 {mockCategories.length} 个大类，{mockTags.length} 个标签</span>
          </Space>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card size="small">
        <Row gutter={16}>
          {mockCategories.slice(0, 7).map(cat => (
            <Col span={3} key={cat.id}>
              <div
                className="text-center p-2 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setActiveTab('tags');
                  setSelectedCategory(cat.code);
                }}
              >
                <Tag color={cat.color}>{cat.code}</Tag>
                <div className="text-sm mt-1">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.tagCount}个标签</div>
              </div>
            </Col>
          ))}
          <Col span={3}>
            <div className="text-center p-2 rounded">
              <div className="text-lg font-bold text-blue-600">239</div>
              <div className="text-sm">标签总数</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Card size="small">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 大类编辑弹窗 */}
      <Modal
        title={editingCategory ? '编辑标签大类' : '新建标签大类'}
        open={categoryModalVisible}
        onOk={handleSaveCategory}
        onCancel={() => setCategoryModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={categoryForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="大类编码" rules={[{ required: true }]}>
                <Input placeholder="如：YI" maxLength={4} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="大类名称" rules={[{ required: true }]}>
                <Input placeholder="如：医疗卫生" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="描述说明" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="color" label="主题色">
                <Input placeholder="#1890FF" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序号">
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

      {/* 标签编辑弹窗 */}
      <Modal
        title={editingTag ? '编辑功能标签' : '新建功能标签'}
        open={tagModalVisible}
        onOk={handleSaveTag}
        onCancel={() => setTagModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={640}
      >
        <Form form={tagForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="categoryCode" label="所属大类" rules={[{ required: true }]}>
                <Select placeholder="选择大类">
                  {mockCategories.map(cat => (
                    <Select.Option key={cat.code} value={cat.code}>{cat.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="标签编码" rules={[{ required: true }]}>
                <Input placeholder="如：YI-01" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="标签名称" rules={[{ required: true }]}>
                <Input placeholder="如：门诊" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="functionalUnit" label="功能单位">
                <Input placeholder="如：床、班、座" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="描述说明" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="defaultSpaces" label="默认空间">
                <Select mode="multiple" placeholder="选择空间">
                  <Select.Option value="DS">地上</Select.Option>
                  <Select.Option value="DX">地下</Select.Option>
                  <Select.Option value="SW">室外</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="defaultUnit" label="默认单位" initialValue="m²">
                <Input placeholder="m²" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="keywords" label="匹配关键字">
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
    </div>
  );
};

export default TagSystemPage;
