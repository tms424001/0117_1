/**
 * 功能标签库页面
 * 对齐 specs/02_Standard_Library/Tag_System_Spec.md
 */

import { useState, useMemo, Key } from 'react';
import { 
  Table, Input, Button, Tag, Space, Drawer, Form, 
  Select, Switch, Descriptions, message, Tooltip 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, SearchOutlined, 
  StopOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { GoldenPage, TreePanel, GridPanel } from '@/components/golden';

// Mock 数据 - 标签大类
const mockCategories: TagCategory[] = [
  { code: 'YI', name: '医疗建筑', color: '#1890ff', sortOrder: 1, status: 'active' },
  { code: 'JY', name: '教育建筑', color: '#52c41a', sortOrder: 2, status: 'active' },
  { code: 'BG', name: '办公建筑', color: '#722ed1', sortOrder: 3, status: 'active' },
  { code: 'ZZ', name: '住宅建筑', color: '#fa8c16', sortOrder: 4, status: 'active' },
  { code: 'SW', name: '室外工程', color: '#13c2c2', sortOrder: 5, status: 'active' },
];

// Mock 数据 - 功能标签
const mockTags: FunctionTag[] = [
  { code: 'YI-01', categoryCode: 'YI', name: '门诊', fullName: '医疗-门诊', defaultSpaces: ['DS'], defaultUnit: '人次/日', keywords: ['门诊', '挂号', '候诊'], synonyms: ['门诊部'], status: 'active', version: 1 },
  { code: 'YI-02', categoryCode: 'YI', name: '住院', fullName: '医疗-住院', defaultSpaces: ['DS'], defaultUnit: '床', keywords: ['病房', '住院', '床位'], synonyms: ['住院部'], status: 'active', version: 1 },
  { code: 'YI-03', categoryCode: 'YI', name: '医技', fullName: '医疗-医技', defaultSpaces: ['DS'], defaultUnit: 'm²', keywords: ['检验', '影像', '手术'], synonyms: ['医技楼'], status: 'active', version: 1 },
  { code: 'YI-04', categoryCode: 'YI', name: '行政后勤', fullName: '医疗-行政后勤', defaultSpaces: ['DS'], defaultUnit: 'm²', keywords: ['行政', '后勤', '办公'], synonyms: [], status: 'active', version: 1 },
  { code: 'JY-01', categoryCode: 'JY', name: '教学楼', fullName: '教育-教学楼', defaultSpaces: ['DS'], defaultUnit: '班', keywords: ['教室', '教学'], synonyms: ['教学楼'], status: 'active', version: 1 },
  { code: 'JY-02', categoryCode: 'JY', name: '实验楼', fullName: '教育-实验楼', defaultSpaces: ['DS'], defaultUnit: 'm²', keywords: ['实验室', '实验'], synonyms: [], status: 'active', version: 1 },
  { code: 'JY-03', categoryCode: 'JY', name: '图书馆', fullName: '教育-图书馆', defaultSpaces: ['DS'], defaultUnit: '座', keywords: ['图书', '阅览'], synonyms: [], status: 'active', version: 1 },
  { code: 'BG-01', categoryCode: 'BG', name: '行政办公', fullName: '办公-行政办公', defaultSpaces: ['DS'], defaultUnit: 'm²', keywords: ['办公', '行政'], synonyms: [], status: 'active', version: 1 },
  { code: 'BG-02', categoryCode: 'BG', name: '商务办公', fullName: '办公-商务办公', defaultSpaces: ['DS'], defaultUnit: 'm²', keywords: ['商务', '写字楼'], synonyms: [], status: 'inactive', version: 1 },
];

interface TagCategory {
  code: string;
  name: string;
  color: string;
  sortOrder: number;
  status: 'active' | 'inactive';
}

interface FunctionTag {
  code: string;
  categoryCode: string;
  name: string;
  fullName: string;
  defaultSpaces: string[];
  defaultUnit?: string;
  functionalUnit?: string;
  keywords: string[];
  synonyms: string[];
  status: 'active' | 'inactive';
  version: number;
}

export default function TagLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<FunctionTag | null>(null);
  const [form] = Form.useForm();

  // 构建树数据
  const treeData: DataNode[] = useMemo(() => {
    return [
      {
        key: '',
        title: `全部标签 (${mockTags.length})`,
      },
      ...mockCategories.map(cat => ({
        key: cat.code,
        title: (
          <span className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: cat.color }}
            />
            {cat.name} ({mockTags.filter(t => t.categoryCode === cat.code).length})
          </span>
        ),
      })),
    ];
  }, []);

  // 过滤标签列表
  const filteredTags = useMemo(() => {
    return mockTags.filter(tag => {
      // 大类筛选
      if (selectedCategory && tag.categoryCode !== selectedCategory) return false;
      // 状态筛选
      if (!showInactive && tag.status === 'inactive') return false;
      // 搜索筛选（code/name/keyword）
      if (searchText) {
        const search = searchText.toLowerCase();
        return (
          tag.code.toLowerCase().includes(search) ||
          tag.name.toLowerCase().includes(search) ||
          tag.fullName.toLowerCase().includes(search) ||
          tag.keywords.some(k => k.toLowerCase().includes(search))
        );
      }
      return true;
    });
  }, [selectedCategory, searchText, showInactive]);

  // 表格列定义
  const columns: ColumnsType<FunctionTag> = [
    {
      title: '标签编码',
      dataIndex: 'code',
      width: 100,
      render: (code) => <span className="font-mono text-blue-600">{code}</span>,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '完整名称',
      dataIndex: 'fullName',
      width: 150,
    },
    {
      title: '默认空间',
      dataIndex: 'defaultSpaces',
      width: 100,
      render: (spaces: string[]) => spaces.map(s => (
        <Tag key={s} color="blue">{s}</Tag>
      )),
    },
    {
      title: '默认单位',
      dataIndex: 'defaultUnit',
      width: 100,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      width: 200,
      render: (keywords: string[]) => (
        <Tooltip title={keywords.join(', ')}>
          <span className="text-gray-500">
            {keywords.slice(0, 3).join(', ')}
            {keywords.length > 3 && '...'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger={record.status === 'active'}
            icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  // 编辑标签
  const handleEdit = (tag: FunctionTag) => {
    setEditingTag(tag);
    form.setFieldsValue({
      ...tag,
      keywords: tag.keywords.join(', '),
      synonyms: tag.synonyms.join(', '),
    });
    setDrawerOpen(true);
  };

  // 新建标签
  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    if (selectedCategory) {
      form.setFieldsValue({ categoryCode: selectedCategory });
    }
    setDrawerOpen(true);
  };

  // 切换状态
  const handleToggleStatus = (tag: FunctionTag) => {
    const action = tag.status === 'active' ? '停用' : '启用';
    message.success(`标签 ${tag.name} 已${action}`);
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Save:', values);
      message.success(editingTag ? '标签已更新' : '标签已创建');
      setDrawerOpen(false);
    } catch (error) {
      // validation failed
    }
  };

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    setSelectedCategory(keys[0] as string || '');
  };

  return (
    <GoldenPage
      header={{
        title: '功能标签库',
        subtitle: '管理功能标签体系，支持标签化和估算复用',
        breadcrumbs: [
          { title: '标准库' },
          { title: '功能标签' },
        ],
        actions: [
          {
            key: 'create',
            label: '新建标签',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleCreate,
          },
        ],
      }}
      toolbar={{
        search: {
          placeholder: '搜索编码/名称/关键词...',
          value: searchText,
          onChange: setSearchText,
        },
        extra: (
          <Space>
            <span className="text-gray-500 text-sm">显示停用:</span>
            <Switch 
              size="small" 
              checked={showInactive} 
              onChange={setShowInactive} 
            />
          </Space>
        ),
      }}
      treePanel={
        <TreePanel
          title="标签大类"
          data={treeData}
          selectedKeys={[selectedCategory]}
          onSelect={handleTreeSelect}
          showSearch={false}
        />
      }
      treePanelWidth={220}
      drawerOpen={drawerOpen}
      drawer={
        <TagDrawer
          tag={editingTag}
          form={form}
          categories={mockCategories}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
        />
      }
      drawerWidth={480}
    >
      <GridPanel
        columns={columns}
        dataSource={filteredTags}
        rowKey="code"
        onRowClick={handleEdit}
        pagination={{
          total: filteredTags.length,
          pageSize: 20,
        }}
        empty={{
          description: searchText ? '未找到匹配的标签' : '暂无标签数据',
          action: !searchText && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建标签
            </Button>
          ),
        }}
      />
    </GoldenPage>
  );
}

// 标签编辑抽屉
interface TagDrawerProps {
  tag: FunctionTag | null;
  form: any;
  categories: TagCategory[];
  onClose: () => void;
  onSave: () => void;
}

function TagDrawer({ tag, form, categories, onClose, onSave }: TagDrawerProps) {
  const isEdit = !!tag;

  return (
    <Drawer
      title={isEdit ? '编辑标签' : '新建标签'}
      open={true}
      onClose={onClose}
      width={480}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onSave}>保存</Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="categoryCode" 
          label="所属大类" 
          rules={[{ required: true, message: '请选择大类' }]}
        >
          <Select
            placeholder="选择标签大类"
            options={categories.map(c => ({ value: c.code, label: c.name }))}
          />
        </Form.Item>

        <Form.Item 
          name="code" 
          label="标签编码"
          rules={[{ required: true, message: '请输入编码' }]}
          extra="编码创建后不可修改"
        >
          <Input placeholder="如: YI-01" disabled={isEdit} />
        </Form.Item>

        <Form.Item 
          name="name" 
          label="标签名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="如: 门诊" />
        </Form.Item>

        <Form.Item 
          name="defaultSpaces" 
          label="默认空间"
          rules={[{ required: true, message: '请选择默认空间' }]}
        >
          <Select
            mode="multiple"
            placeholder="选择默认空间"
            options={[
              { value: 'DS', label: '地上 (DS)' },
              { value: 'DX', label: '地下 (DX)' },
              { value: 'SW', label: '室外 (SW)' },
            ]}
          />
        </Form.Item>

        <Form.Item name="defaultUnit" label="默认单位">
          <Input placeholder="如: 床、班、m²" />
        </Form.Item>

        <Form.Item 
          name="keywords" 
          label="关键词"
          extra="多个关键词用逗号分隔，用于推荐匹配"
        >
          <Input.TextArea 
            placeholder="门诊, 挂号, 候诊" 
            rows={2}
          />
        </Form.Item>

        <Form.Item 
          name="synonyms" 
          label="同义词"
          extra="多个同义词用逗号分隔"
        >
          <Input.TextArea 
            placeholder="门诊部, 门诊楼" 
            rows={2}
          />
        </Form.Item>

        {isEdit && (
          <Descriptions column={1} size="small" className="mt-4">
            <Descriptions.Item label="版本">{tag?.version}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={tag?.status === 'active' ? 'success' : 'default'}>
                {tag?.status === 'active' ? '启用' : '停用'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Form>
    </Drawer>
  );
}
