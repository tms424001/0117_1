/**
 * 空间专业映射页面
 * 对齐 specs/02_Standard_Library/Standard_Mapping_Spec.md
 */

import { useState, useMemo, Key } from 'react';
import { 
  Button, Tag, Drawer, Form, Input, Select, InputNumber, 
  message, Tabs, Table, Tooltip 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  BulbOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { GoldenPage, TreePanel, GridPanel } from '@/components/golden';

// 空间定义
const SPACES = [
  { code: 'DS', name: '地上', color: '#1890ff' },
  { code: 'DX', name: '地下', color: '#722ed1' },
  { code: 'SW', name: '室外', color: '#52c41a' },
  { code: 'QT', name: '其他', color: '#fa8c16' },
];

// 专业定义
const PROFESSIONS = [
  { code: 'TJ', name: '土建', group: '结构', spaceCode: 'DS' },
  { code: 'GPS', name: '给排水', group: '安装', spaceCode: 'DS' },
  { code: 'QD', name: '强电', group: '安装', spaceCode: 'DS' },
  { code: 'RD', name: '弱电', group: '安装', spaceCode: 'DS' },
  { code: 'NT', name: '暖通', group: '安装', spaceCode: 'DS' },
  { code: 'XF', name: '消防', group: '安装', spaceCode: 'DS' },
  { code: 'DQ', name: '电气', group: '安装', spaceCode: 'DS' },
  { code: 'ZN', name: '智能化', group: '安装', spaceCode: 'DS' },
  { code: 'OTHER', name: '其他', group: '其他', spaceCode: 'DS' },
];

// 匹配类型
const MATCH_TYPES = [
  { value: 'exact', label: '精确匹配' },
  { value: 'contains', label: '包含匹配' },
  { value: 'regex', label: '正则匹配' },
  { value: 'path', label: '路径匹配' },
];

// Mock 映射规则
interface MappingRule {
  id: string;
  targetType: 'space' | 'profession';
  targetCode: string;
  targetName: string;
  pattern: string;
  matchType: 'exact' | 'contains' | 'regex' | 'path';
  priority: number;
  confidence: number;
  applicableSpaces?: string[];
  status: 'active' | 'inactive';
}

const mockRules: MappingRule[] = [
  // 空间映射规则
  { id: '1', targetType: 'space', targetCode: 'DS', targetName: '地上', pattern: '地上', matchType: 'contains', priority: 100, confidence: 0.95, status: 'active' },
  { id: '2', targetType: 'space', targetCode: 'DX', targetName: '地下', pattern: '地下|负一|负二|B1|B2', matchType: 'regex', priority: 100, confidence: 0.95, status: 'active' },
  { id: '3', targetType: 'space', targetCode: 'SW', targetName: '室外', pattern: '室外|总平|道路|绿化|管网', matchType: 'regex', priority: 100, confidence: 0.9, status: 'active' },
  // 专业映射规则
  { id: '4', targetType: 'profession', targetCode: 'TJ', targetName: '土建', pattern: '土建|结构|基础|主体', matchType: 'regex', priority: 90, confidence: 0.9, applicableSpaces: ['DS', 'DX'], status: 'active' },
  { id: '5', targetType: 'profession', targetCode: 'GPS', targetName: '给排水', pattern: '给排水|给水|排水|消火栓', matchType: 'regex', priority: 90, confidence: 0.85, applicableSpaces: ['DS', 'DX'], status: 'active' },
  { id: '6', targetType: 'profession', targetCode: 'QD', targetName: '强电', pattern: '强电|配电|照明|动力', matchType: 'regex', priority: 90, confidence: 0.85, applicableSpaces: ['DS', 'DX'], status: 'active' },
  { id: '7', targetType: 'profession', targetCode: 'RD', targetName: '弱电', pattern: '弱电|智能|监控|网络', matchType: 'regex', priority: 90, confidence: 0.85, applicableSpaces: ['DS', 'DX'], status: 'active' },
  { id: '8', targetType: 'profession', targetCode: 'NT', targetName: '暖通', pattern: '暖通|空调|通风|采暖', matchType: 'regex', priority: 90, confidence: 0.85, applicableSpaces: ['DS', 'DX'], status: 'active' },
  { id: '9', targetType: 'profession', targetCode: 'XF', targetName: '消防', pattern: '消防|喷淋|报警', matchType: 'regex', priority: 90, confidence: 0.85, applicableSpaces: ['DS', 'DX'], status: 'active' },
];

export default function StandardMappingPage() {
  const [activeTab, setActiveTab] = useState<'space' | 'profession'>('space');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MappingRule | null>(null);
  const [form] = Form.useForm();

  // 构建树数据
  const treeData: DataNode[] = useMemo(() => {
    if (activeTab === 'space') {
      return [
        { key: '', title: `全部空间规则 (${mockRules.filter(r => r.targetType === 'space').length})` },
        ...SPACES.map(space => ({
          key: space.code,
          title: (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: space.color }} />
              {space.name} ({mockRules.filter(r => r.targetType === 'space' && r.targetCode === space.code).length})
            </span>
          ),
        })),
      ];
    } else {
      return [
        { key: '', title: `全部专业规则 (${mockRules.filter(r => r.targetType === 'profession').length})` },
        ...PROFESSIONS.map(prof => ({
          key: prof.code,
          title: `${prof.name} (${mockRules.filter(r => r.targetType === 'profession' && r.targetCode === prof.code).length})`,
        })),
      ];
    }
  }, [activeTab]);

  // 过滤规则列表
  const filteredRules = useMemo(() => {
    return mockRules.filter(rule => {
      if (rule.targetType !== activeTab) return false;
      if (selectedTarget && rule.targetCode !== selectedTarget) return false;
      return true;
    }).sort((a, b) => b.priority - a.priority);
  }, [activeTab, selectedTarget]);

  // 表格列定义
  const columns: ColumnsType<MappingRule> = [
    {
      title: '目标',
      dataIndex: 'targetName',
      width: 100,
      render: (name, record) => {
        const space = SPACES.find(s => s.code === record.targetCode);
        return (
          <Tag color={space?.color || 'default'}>{name}</Tag>
        );
      },
    },
    {
      title: '匹配模式',
      dataIndex: 'pattern',
      width: 200,
      render: (pattern) => (
        <Tooltip title={pattern}>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {pattern.length > 30 ? pattern.slice(0, 30) + '...' : pattern}
          </code>
        </Tooltip>
      ),
    },
    {
      title: '匹配类型',
      dataIndex: 'matchType',
      width: 100,
      render: (type) => {
        const config = MATCH_TYPES.find(t => t.value === type);
        return <span className="text-gray-600">{config?.label}</span>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority) => <span className="font-mono">{priority}</span>,
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      width: 80,
      render: (confidence) => (
        <span className={confidence >= 0.9 ? 'text-green-600' : confidence >= 0.7 ? 'text-orange-500' : 'text-red-500'}>
          {(confidence * 100).toFixed(0)}%
        </span>
      ),
    },
    ...(activeTab === 'profession' ? [{
      title: '适用空间',
      dataIndex: 'applicableSpaces',
      width: 120,
      render: (spaces: string[]) => spaces?.map(s => {
        const space = SPACES.find(sp => sp.code === s);
        return <Tag key={s} color={space?.color}>{space?.name}</Tag>;
      }),
    }] : []),
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
        <span className="flex gap-2">
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
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  // 编辑规则
  const handleEdit = (rule: MappingRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setDrawerOpen(true);
  };

  // 新建规则
  const handleCreate = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({ 
      targetType: activeTab,
      matchType: 'contains',
      priority: 50,
      confidence: 0.8,
      status: 'active',
    });
    if (selectedTarget) {
      form.setFieldsValue({ targetCode: selectedTarget });
    }
    setDrawerOpen(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Save:', values);
      message.success(editingRule ? '规则已更新' : '规则已创建');
      setDrawerOpen(false);
    } catch (error) {
      // validation failed
    }
  };

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    setSelectedTarget(keys[0] as string || '');
  };

  return (
    <GoldenPage
      header={{
        title: '空间专业映射',
        subtitle: '配置自动映射规则，用于标签化时的空间/专业识别',
        breadcrumbs: [
          { title: '标准库' },
          { title: '空间专业映射' },
        ],
        actions: [
          {
            key: 'test',
            label: '测试匹配',
            icon: <BulbOutlined />,
            onClick: () => message.info('测试匹配功能开发中'),
          },
          {
            key: 'create',
            label: '新增规则',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleCreate,
          },
        ],
      }}
      treePanel={
        <div className="h-full flex flex-col">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as 'space' | 'profession');
              setSelectedTarget('');
            }}
            items={[
              { key: 'space', label: '空间映射' },
              { key: 'profession', label: '专业映射' },
            ]}
            size="small"
            className="px-3"
          />
          <div className="flex-1 overflow-auto">
            <TreePanel
              data={treeData}
              selectedKeys={[selectedTarget]}
              onSelect={handleTreeSelect}
              showSearch={false}
            />
          </div>
        </div>
      }
      treePanelWidth={220}
      drawerOpen={drawerOpen}
      drawer={
        <RuleDrawer
          rule={editingRule}
          form={form}
          activeTab={activeTab}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
        />
      }
      drawerWidth={480}
    >
      <GridPanel
        columns={columns}
        dataSource={filteredRules}
        rowKey="id"
        onRowClick={handleEdit}
        pagination={{
          total: filteredRules.length,
          pageSize: 20,
        }}
        empty={{
          description: '暂无映射规则',
          action: (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增规则
            </Button>
          ),
        }}
      />
    </GoldenPage>
  );
}

// 规则编辑抽屉
interface RuleDrawerProps {
  rule: MappingRule | null;
  form: any;
  activeTab: 'space' | 'profession';
  onClose: () => void;
  onSave: () => void;
}

function RuleDrawer({ rule, form, activeTab, onClose, onSave }: RuleDrawerProps) {
  const isEdit = !!rule;

  return (
    <Drawer
      title={isEdit ? '编辑映射规则' : '新增映射规则'}
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
          name="targetCode" 
          label={activeTab === 'space' ? '目标空间' : '目标专业'}
          rules={[{ required: true, message: '请选择目标' }]}
        >
          <Select
            placeholder="选择目标"
            options={
              activeTab === 'space' 
                ? SPACES.map(s => ({ value: s.code, label: s.name }))
                : PROFESSIONS.map(p => ({ value: p.code, label: p.name }))
            }
          />
        </Form.Item>

        <Form.Item 
          name="pattern" 
          label="匹配模式"
          rules={[{ required: true, message: '请输入匹配模式' }]}
          extra="支持正则表达式，多个关键词用 | 分隔"
        >
          <Input.TextArea 
            placeholder="如: 地下|负一|负二|B1|B2" 
            rows={2}
          />
        </Form.Item>

        <Form.Item 
          name="matchType" 
          label="匹配类型"
          rules={[{ required: true, message: '请选择匹配类型' }]}
        >
          <Select
            placeholder="选择匹配类型"
            options={MATCH_TYPES}
          />
        </Form.Item>

        {activeTab === 'profession' && (
          <Form.Item 
            name="applicableSpaces" 
            label="适用空间"
            extra="该专业规则仅在指定空间下生效"
          >
            <Select
              mode="multiple"
              placeholder="选择适用空间"
              options={SPACES.map(s => ({ value: s.code, label: s.name }))}
            />
          </Form.Item>
        )}

        <div className="flex gap-4">
          <Form.Item 
            name="priority" 
            label="优先级"
            rules={[{ required: true, message: '请输入优先级' }]}
            className="flex-1"
            extra="数值越大优先级越高"
          >
            <InputNumber placeholder="50" min={1} max={100} className="w-full" />
          </Form.Item>

          <Form.Item 
            name="confidence" 
            label="置信度"
            rules={[{ required: true, message: '请输入置信度' }]}
            className="flex-1"
            extra="0-1 之间"
          >
            <InputNumber placeholder="0.8" min={0} max={1} step={0.05} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item 
          name="status" 
          label="状态"
        >
          <Select
            options={[
              { value: 'active', label: '启用' },
              { value: 'inactive', label: '停用' },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
