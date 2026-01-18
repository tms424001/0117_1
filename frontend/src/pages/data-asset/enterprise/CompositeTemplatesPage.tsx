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
  Checkbox,
  Modal,
  Form,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  StarOutlined,
  StarFilled,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

// 模板数据类型
interface TemplateRecord {
  templateId: string;
  templateName: string;
  templateType: string;
  sboqCode: string;
  sboqName: string;
  itemFeature: string;
  unit: string;
  compositePrice: number;
  laborCost: number;
  materialCost: number;
  machineCost: number;
  quotaVersion: string;
  useCount: number;
  lastUseTime: string;
  isRecommend: boolean;
  createdBy: string;
  createdAt: string;
}

// 模拟模板数据
const mockTemplates: TemplateRecord[] = [
  {
    templateId: 'TPL001',
    templateName: '挖基坑土方-深圳常用',
    templateType: 'personal',
    sboqCode: 'SBOQ-0101-001',
    sboqName: '挖基坑土方',
    itemFeature: '普通土 深≤2m',
    unit: 'm³',
    compositePrice: 38.50,
    laborCost: 6.93,
    materialCost: 4.62,
    machineCost: 26.95,
    quotaVersion: '广东2018',
    useCount: 156,
    lastUseTime: '2025-12-15',
    isRecommend: true,
    createdBy: '张三',
    createdAt: '2025-06-01',
  },
  {
    templateId: 'TPL002',
    templateName: 'C30混凝土浇筑-基础泵送',
    templateType: 'personal',
    sboqCode: 'SBOQ-0301-003',
    sboqName: 'C30混凝土浇筑',
    itemFeature: '基础 泵送',
    unit: 'm³',
    compositePrice: 625.80,
    laborCost: 50.06,
    materialCost: 531.93,
    machineCost: 43.81,
    quotaVersion: '广东2018',
    useCount: 289,
    lastUseTime: '2025-12-14',
    isRecommend: true,
    createdBy: '张三',
    createdAt: '2025-05-15',
  },
  {
    templateId: 'TPL003',
    templateName: '钢筋制安-HRB400现浇',
    templateType: 'department',
    sboqCode: 'SBOQ-0401-001',
    sboqName: '钢筋制安',
    itemFeature: '现浇构件 HRB400',
    unit: 't',
    compositePrice: 5280,
    laborCost: 1161.6,
    materialCost: 3801.6,
    machineCost: 316.8,
    quotaVersion: '广东2018',
    useCount: 342,
    lastUseTime: '2025-12-16',
    isRecommend: true,
    createdBy: '李四',
    createdAt: '2025-04-20',
  },
  {
    templateId: 'TPL004',
    templateName: '外墙涂料-精装修',
    templateType: 'department',
    sboqCode: 'SBOQ-0801-012',
    sboqName: '外墙涂料',
    itemFeature: '乳胶漆 两遍',
    unit: 'm²',
    compositePrice: 85.60,
    laborCost: 25.68,
    materialCost: 51.36,
    machineCost: 8.56,
    quotaVersion: '广东2018',
    useCount: 52,
    lastUseTime: '2025-12-10',
    isRecommend: false,
    createdBy: '王五',
    createdAt: '2025-07-10',
  },
  {
    templateId: 'TPL005',
    templateName: '柱模板-木模板',
    templateType: 'enterprise',
    sboqCode: 'SBOQ-0501-001',
    sboqName: '柱模板',
    itemFeature: '木模板 周转5次',
    unit: 'm²',
    compositePrice: 68.50,
    laborCost: 34.25,
    materialCost: 27.40,
    machineCost: 6.85,
    quotaVersion: '广东2018',
    useCount: 186,
    lastUseTime: '2025-12-12',
    isRecommend: true,
    createdBy: '管理员',
    createdAt: '2025-03-01',
  },
];

// 推荐模板数据
const recommendTemplates = mockTemplates.filter(t => t.isRecommend);

const CompositeTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['personal', 'department', 'enterprise']);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取模板类型标签
  const getTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      personal: { color: 'blue', text: '个人' },
      department: { color: 'orange', text: '部门' },
      enterprise: { color: 'green', text: '企业' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 模板列表列定义
  const columns: ColumnsType<TemplateRecord> = [
    {
      title: '模板名称',
      key: 'name',
      width: 220,
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            {record.isRecommend && <StarFilled className="text-yellow-500 mr-1" />}
            <span className="font-medium">{record.templateName}</span>
          </div>
          <div className="text-xs text-gray-400">{record.sboqCode}</div>
        </div>
      ),
    },
    {
      title: '清单项目',
      key: 'item',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.sboqName}</div>
          <div className="text-xs text-gray-400">{record.itemFeature}</div>
        </div>
      ),
    },
    {
      title: '综合单价',
      dataIndex: 'compositePrice',
      key: 'compositePrice',
      width: 120,
      align: 'right',
      render: (val, record) => (
        <div>
          <div className="font-medium">¥{val.toLocaleString()}</div>
          <div className="text-xs text-gray-400">/{record.unit}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'templateType',
      key: 'templateType',
      width: 80,
      render: (type) => getTypeTag(type),
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      width: 90,
      align: 'center',
    },
    {
      title: '最后使用',
      dataIndex: 'lastUseTime',
      key: 'lastUseTime',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<CopyOutlined />}>
            套用
          </Button>
          {record.templateType === 'personal' && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />}>
                编辑
              </Button>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </>
          )}
          {record.templateType !== 'personal' && (
            <Button type="link" size="small">
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 创建模板
  const handleCreateTemplate = () => {
    form.validateFields().then((values) => {
      console.log('创建模板:', values);
      message.success('模板创建成功');
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  // 过滤模板
  const filteredTemplates = mockTemplates.filter(t => selectedTypes.includes(t.templateType));

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">组价模板</span>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建模板
          </Button>
        </div>
      </Card>

      {/* 筛选区 */}
      <Card size="small" title="模板筛选">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <span className="mr-2">清单分类：</span>
            <Select defaultValue="" style={{ width: 160 }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="土石方工程">土石方工程</Select.Option>
              <Select.Option value="混凝土工程">混凝土工程</Select.Option>
              <Select.Option value="钢筋工程">钢筋工程</Select.Option>
            </Select>
          </Col>
          <Col span={8}>
            <span className="mr-2">模板类型：</span>
            <Checkbox.Group
              value={selectedTypes}
              onChange={(vals) => setSelectedTypes(vals as string[])}
              options={[
                { label: '个人', value: 'personal' },
                { label: '部门', value: 'department' },
                { label: '企业', value: 'enterprise' },
              ]}
            />
          </Col>
          <Col span={8}>
            <Search placeholder="搜索模板名称或清单名称" style={{ width: 280 }} />
          </Col>
        </Row>
      </Card>

      {/* 推荐模板 */}
      <Card size="small" title={<span><StarFilled className="text-yellow-500 mr-1" />推荐模板</span>}>
        <Row gutter={16}>
          {recommendTemplates.slice(0, 4).map((template) => (
            <Col span={6} key={template.templateId}>
              <div className="border rounded-lg p-4 hover:border-blue-400 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium truncate" style={{ maxWidth: 150 }}>
                    {template.sboqName}
                  </span>
                  {getTypeTag(template.templateType)}
                </div>
                <div className="text-xs text-gray-400 mb-2">{template.itemFeature}</div>
                <div className="text-xl font-bold text-blue-600 mb-2">
                  ¥{template.compositePrice.toLocaleString()}
                  <span className="text-xs text-gray-400 font-normal">/{template.unit}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>使用{template.useCount}次</span>
                  <Button type="primary" size="small" icon={<CopyOutlined />}>
                    套用
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 模板列表 */}
      <Card size="small" title="我的模板">
        <Table
          rowKey="templateId"
          columns={columns}
          dataSource={filteredTemplates}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
          size="small"
        />
      </Card>

      {/* 创建模板弹窗 */}
      <Modal
        title="新建组价模板"
        open={createModalVisible}
        onOk={handleCreateTemplate}
        onCancel={() => setCreateModalVisible(false)}
        okText="创建"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="templateName"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如：挖基坑土方-深圳常用" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sboqCode"
                label="清单编码"
                rules={[{ required: true, message: '请选择清单' }]}
              >
                <Select placeholder="请选择清单">
                  <Select.Option value="SBOQ-0101-001">SBOQ-0101-001 挖基坑土方</Select.Option>
                  <Select.Option value="SBOQ-0301-003">SBOQ-0301-003 C30混凝土浇筑</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="templateType"
                label="模板类型"
                initialValue="personal"
              >
                <Select>
                  <Select.Option value="personal">个人模板</Select.Option>
                  <Select.Option value="department">部门模板</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="itemFeature" label="项目特征">
            <Input.TextArea rows={2} placeholder="例如：普通土 深≤2m" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="compositePrice" label="综合单价">
                <Input prefix="¥" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="单位">
                <Input placeholder="例如：m³" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quotaVersion" label="定额版本">
                <Select placeholder="请选择">
                  <Select.Option value="广东2018">广东2018</Select.Option>
                  <Select.Option value="广东2010">广东2010</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="text-gray-400 text-sm">
            提示：您也可以从综价详情页直接保存为模板，会自动填充组价明细信息。
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CompositeTemplatesPage;
