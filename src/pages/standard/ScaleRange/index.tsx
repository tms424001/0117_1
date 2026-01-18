/**
 * 规模分档页面
 * 对齐 specs/02_Standard_Library/Scale_Range_Spec.md
 */

import { useState, useMemo, Key } from 'react';
import { 
  Button, Tag, Space, Drawer, Form, Input, InputNumber, 
  message, Alert, Tooltip 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, CheckCircleOutlined, 
  WarningOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { GoldenPage, TreePanel, GridPanel, BottomPanel } from '@/components/golden';
import type { IssueItem } from '@/components/golden/BottomPanel';

// Mock 数据 - 分档类型
interface ScaleType {
  code: string;
  name: string;
  unit: string;
  isSystem: boolean;
  status: 'active' | 'inactive';
}

const mockScaleTypes: ScaleType[] = [
  { code: 'AREA', name: '建筑面积', unit: 'm²', isSystem: true, status: 'active' },
  { code: 'BED', name: '床位数', unit: '床', isSystem: true, status: 'active' },
  { code: 'CLASS', name: '班级数', unit: '班', isSystem: true, status: 'active' },
  { code: 'PARKING', name: '车位数', unit: '个', isSystem: true, status: 'active' },
  { code: 'DAILY_VISIT', name: '日门诊量', unit: '人次/日', isSystem: false, status: 'active' },
];

// Mock 数据 - 规模档位
interface ScaleRange {
  id: string;
  typeCode: string;
  code: string;
  name: string;
  min: number;
  max: number;        // -1 表示无穷大
  rangeText: string;
  sortOrder: number;
  status: 'active' | 'inactive';
}

const mockRanges: ScaleRange[] = [
  // 建筑面积
  { id: '1', typeCode: 'AREA', code: 'XS', name: '小型', min: 0, max: 5000, rangeText: '<5000', sortOrder: 1, status: 'active' },
  { id: '2', typeCode: 'AREA', code: 'S', name: '中小型', min: 5000, max: 10000, rangeText: '5000-10000', sortOrder: 2, status: 'active' },
  { id: '3', typeCode: 'AREA', code: 'M', name: '中型', min: 10000, max: 30000, rangeText: '10000-30000', sortOrder: 3, status: 'active' },
  { id: '4', typeCode: 'AREA', code: 'L', name: '大型', min: 30000, max: 50000, rangeText: '30000-50000', sortOrder: 4, status: 'active' },
  { id: '5', typeCode: 'AREA', code: 'XL', name: '特大型', min: 50000, max: -1, rangeText: '≥50000', sortOrder: 5, status: 'active' },
  // 床位数
  { id: '6', typeCode: 'BED', code: 'XS', name: '小型', min: 0, max: 100, rangeText: '<100', sortOrder: 1, status: 'active' },
  { id: '7', typeCode: 'BED', code: 'S', name: '中小型', min: 100, max: 300, rangeText: '100-300', sortOrder: 2, status: 'active' },
  { id: '8', typeCode: 'BED', code: 'M', name: '中型', min: 300, max: 500, rangeText: '300-500', sortOrder: 3, status: 'active' },
  { id: '9', typeCode: 'BED', code: 'L', name: '大型', min: 500, max: 1000, rangeText: '500-1000', sortOrder: 4, status: 'active' },
  { id: '10', typeCode: 'BED', code: 'XL', name: '特大型', min: 1000, max: -1, rangeText: '≥1000', sortOrder: 5, status: 'active' },
  // 班级数
  { id: '11', typeCode: 'CLASS', code: 'S', name: '小型', min: 0, max: 24, rangeText: '<24', sortOrder: 1, status: 'active' },
  { id: '12', typeCode: 'CLASS', code: 'M', name: '中型', min: 24, max: 48, rangeText: '24-48', sortOrder: 2, status: 'active' },
  { id: '13', typeCode: 'CLASS', code: 'L', name: '大型', min: 48, max: -1, rangeText: '≥48', sortOrder: 3, status: 'active' },
];

export default function ScaleRangePage() {
  const [selectedType, setSelectedType] = useState<string>('AREA');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRange, setEditingRange] = useState<ScaleRange | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [form] = Form.useForm();

  // 构建树数据
  const treeData: DataNode[] = useMemo(() => {
    return mockScaleTypes.map(type => ({
      key: type.code,
      title: (
        <span className="flex items-center justify-between w-full pr-2">
          <span>{type.name}</span>
          <span className="text-gray-400 text-xs">
            {mockRanges.filter(r => r.typeCode === type.code).length}档
          </span>
        </span>
      ),
    }));
  }, []);

  // 当前类型
  const currentType = mockScaleTypes.find(t => t.code === selectedType);

  // 过滤档位列表
  const filteredRanges = useMemo(() => {
    return mockRanges
      .filter(r => r.typeCode === selectedType)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [selectedType]);

  // 校验规则
  const validationIssues: IssueItem[] = useMemo(() => {
    const issues: IssueItem[] = [];
    const ranges = filteredRanges;
    
    for (let i = 0; i < ranges.length; i++) {
      const curr = ranges[i];
      const next = ranges[i + 1];
      
      // 检查连续性
      if (next && curr.max !== next.min && curr.max !== -1) {
        issues.push({
          id: `gap-${curr.id}`,
          type: 'error',
          message: `档位 ${curr.name} 与 ${next.name} 之间存在间隙`,
          field: `${curr.name}.max`,
        });
      }
      
      // 检查重叠
      if (next && curr.max > next.min && curr.max !== -1) {
        issues.push({
          id: `overlap-${curr.id}`,
          type: 'error',
          message: `档位 ${curr.name} 与 ${next.name} 存在重叠`,
          field: `${curr.name}.max`,
        });
      }
    }
    
    // 检查是否有无穷大档位
    const hasInfinity = ranges.some(r => r.max === -1);
    if (!hasInfinity && ranges.length > 0) {
      issues.push({
        id: 'no-infinity',
        type: 'warning',
        message: '建议最后一个档位设置为无上限',
      });
    }
    
    return issues;
  }, [filteredRanges]);

  // 表格列定义
  const columns: ColumnsType<ScaleRange> = [
    {
      title: '档位编码',
      dataIndex: 'code',
      width: 100,
      render: (code) => <span className="font-mono text-blue-600">{code}</span>,
    },
    {
      title: '档位名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '范围',
      key: 'range',
      width: 180,
      render: (_, record) => {
        const min = record.min;
        const max = record.max === -1 ? '∞' : record.max;
        return (
          <Tooltip title={`左闭右开: ${min} ≤ v < ${max}`}>
            <span className="font-mono">
              [{min}, {max})
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '范围文本',
      dataIndex: 'rangeText',
      width: 120,
    },
    {
      title: '单位',
      key: 'unit',
      width: 80,
      render: () => currentType?.unit,
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
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  // 编辑档位
  const handleEdit = (range: ScaleRange) => {
    setEditingRange(range);
    form.setFieldsValue({
      ...range,
      max: range.max === -1 ? undefined : range.max,
      isInfinity: range.max === -1,
    });
    setDrawerOpen(true);
  };

  // 新建档位
  const handleCreate = () => {
    setEditingRange(null);
    form.resetFields();
    form.setFieldsValue({ 
      typeCode: selectedType,
      sortOrder: filteredRanges.length + 1,
    });
    setDrawerOpen(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Save:', values);
      message.success(editingRange ? '档位已更新' : '档位已创建');
      setDrawerOpen(false);
    } catch (error) {
      // validation failed
    }
  };

  // 校验
  const handleValidate = () => {
    setShowValidation(true);
    if (validationIssues.filter(i => i.type === 'error').length === 0) {
      message.success('校验通过，档位配置正确');
    } else {
      message.error('校验失败，请修复问题后保存');
    }
  };

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    if (keys[0]) {
      setSelectedType(keys[0] as string);
      setShowValidation(false);
    }
  };

  return (
    <GoldenPage
      header={{
        title: '规模分档',
        subtitle: '维护分档类型与档位，供标签化/指标/估算使用',
        breadcrumbs: [
          { title: '标准库' },
          { title: '规模分档' },
        ],
        actions: [
          {
            key: 'validate',
            label: '校验',
            icon: <CheckCircleOutlined />,
            onClick: handleValidate,
          },
          {
            key: 'create',
            label: '新增档位',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleCreate,
          },
        ],
      }}
      treePanel={
        <TreePanel
          title="分档类型"
          data={treeData}
          selectedKeys={[selectedType]}
          onSelect={handleTreeSelect}
          showSearch={false}
        />
      }
      treePanelWidth={200}
      drawerOpen={drawerOpen}
      drawer={
        <RangeDrawer
          range={editingRange}
          form={form}
          scaleType={currentType}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
        />
      }
      drawerWidth={400}
      showBottomPanel={showValidation && validationIssues.length > 0}
      bottomPanel={{
        issues: validationIssues,
      }}
      bottomPanelHeight={160}
    >
      {/* 规则提示 */}
      <Alert
        message="分档规则"
        description="左闭右开: min ≤ v < max | max=-1 表示无穷大 | 同类型档位不可重叠、必须连续"
        type="info"
        showIcon
        className="mb-4"
      />
      
      <GridPanel
        columns={columns}
        dataSource={filteredRanges}
        rowKey="id"
        onRowClick={handleEdit}
        pagination={false}
        empty={{
          description: '该类型暂无档位配置',
          action: (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增档位
            </Button>
          ),
        }}
      />
    </GoldenPage>
  );
}

// 档位编辑抽屉
interface RangeDrawerProps {
  range: ScaleRange | null;
  form: any;
  scaleType?: ScaleType;
  onClose: () => void;
  onSave: () => void;
}

function RangeDrawer({ range, form, scaleType, onClose, onSave }: RangeDrawerProps) {
  const isEdit = !!range;
  const [isInfinity, setIsInfinity] = useState(range?.max === -1);

  return (
    <Drawer
      title={isEdit ? '编辑档位' : '新增档位'}
      open={true}
      onClose={onClose}
      width={400}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onSave}>保存</Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item label="分档类型">
          <Input value={scaleType?.name} disabled />
        </Form.Item>

        <Form.Item 
          name="code" 
          label="档位编码"
          rules={[{ required: true, message: '请输入编码' }]}
        >
          <Input placeholder="如: XS, S, M, L, XL" disabled={isEdit} />
        </Form.Item>

        <Form.Item 
          name="name" 
          label="档位名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="如: 小型、中型、大型" />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item 
            name="min" 
            label="最小值 (含)"
            rules={[{ required: true, message: '请输入最小值' }]}
            className="flex-1"
          >
            <InputNumber 
              placeholder="0" 
              className="w-full"
              addonAfter={scaleType?.unit}
            />
          </Form.Item>

          <Form.Item 
            name="max" 
            label="最大值 (不含)"
            className="flex-1"
            rules={[{ required: !isInfinity, message: '请输入最大值' }]}
          >
            <InputNumber 
              placeholder={isInfinity ? '∞' : '输入值'} 
              className="w-full"
              disabled={isInfinity}
              addonAfter={scaleType?.unit}
            />
          </Form.Item>
        </div>

        <Form.Item name="isInfinity" valuePropName="checked">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isInfinity}
              onChange={(e) => {
                setIsInfinity(e.target.checked);
                if (e.target.checked) {
                  form.setFieldValue('max', undefined);
                }
              }}
            />
            <span>无上限 (max = ∞)</span>
          </label>
        </Form.Item>

        <Form.Item 
          name="rangeText" 
          label="范围文本"
          extra="用于显示，如: <5000, 5000-10000, ≥50000"
        >
          <Input placeholder="如: ≥50000" />
        </Form.Item>

        <Form.Item 
          name="sortOrder" 
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber placeholder="1" min={1} className="w-full" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
