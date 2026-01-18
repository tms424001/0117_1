import { useState } from 'react';
import { Card, Table, Button, Select, Tag, Space, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ScaleRange {
  id: string;
  scaleTypeCode: string;
  scaleTypeName: string;
  rangeCode: string;
  rangeName: string;
  minValue: number | null;
  maxValue: number | null;
  unit: string;
  status: string;
}

const mockData: ScaleRange[] = [
  { id: '1', scaleTypeCode: 'DAILY_VISIT', scaleTypeName: '日门诊量', rangeCode: 'S', rangeName: '小型', minValue: 0, maxValue: 500, unit: '人次/日', status: 'active' },
  { id: '2', scaleTypeCode: 'DAILY_VISIT', scaleTypeName: '日门诊量', rangeCode: 'M', rangeName: '中型', minValue: 500, maxValue: 2000, unit: '人次/日', status: 'active' },
  { id: '3', scaleTypeCode: 'DAILY_VISIT', scaleTypeName: '日门诊量', rangeCode: 'L', rangeName: '大型', minValue: 2000, maxValue: null, unit: '人次/日', status: 'active' },
  { id: '4', scaleTypeCode: 'BED_COUNT', scaleTypeName: '床位数', rangeCode: 'S', rangeName: '小型', minValue: 0, maxValue: 200, unit: '床', status: 'active' },
  { id: '5', scaleTypeCode: 'BED_COUNT', scaleTypeName: '床位数', rangeCode: 'M', rangeName: '中型', minValue: 200, maxValue: 500, unit: '床', status: 'active' },
  { id: '6', scaleTypeCode: 'BED_COUNT', scaleTypeName: '床位数', rangeCode: 'L', rangeName: '大型', minValue: 500, maxValue: null, unit: '床', status: 'active' },
  { id: '7', scaleTypeCode: 'STUDENT_COUNT', scaleTypeName: '学生人数', rangeCode: 'S', rangeName: '小型', minValue: 0, maxValue: 1000, unit: '人', status: 'active' },
  { id: '8', scaleTypeCode: 'STUDENT_COUNT', scaleTypeName: '学生人数', rangeCode: 'M', rangeName: '中型', minValue: 1000, maxValue: 3000, unit: '人', status: 'active' },
  { id: '9', scaleTypeCode: 'STUDENT_COUNT', scaleTypeName: '学生人数', rangeCode: 'L', rangeName: '大型', minValue: 3000, maxValue: null, unit: '人', status: 'active' },
];

const scaleTypes = [
  { value: '', label: '全部类型' },
  { value: 'DAILY_VISIT', label: '日门诊量' },
  { value: 'BED_COUNT', label: '床位数' },
  { value: 'STUDENT_COUNT', label: '学生人数' },
];

export default function ScaleRange() {
  const [selectedType, setSelectedType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredData = selectedType
    ? mockData.filter((item) => item.scaleTypeCode === selectedType)
    : mockData;

  const columns: ColumnsType<ScaleRange> = [
    { title: '规模类型', dataIndex: 'scaleTypeName', key: 'scaleTypeName', width: 120 },
    { title: '分档编码', dataIndex: 'rangeCode', key: 'rangeCode', width: 100 },
    { title: '分档名称', dataIndex: 'rangeName', key: 'rangeName', width: 100 },
    {
      title: '范围',
      key: 'range',
      width: 150,
      render: (_, record) => {
        const min = record.minValue ?? '-∞';
        const max = record.maxValue ?? '+∞';
        return `[${min}, ${max})`;
      },
    },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>规模分档</h1>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={scaleTypes}
              style={{ width: 160 }}
              placeholder="选择规模类型"
            />
          </div>
          <div className="table-toolbar-right">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              新增分档
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="新增规模分档"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form.validateFields().then(() => {
            setModalVisible(false);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="scaleType" label="规模类型" rules={[{ required: true }]}>
            <Select options={scaleTypes.slice(1)} placeholder="选择规模类型" />
          </Form.Item>
          <Form.Item name="rangeName" label="分档名称" rules={[{ required: true }]}>
            <Input placeholder="如：小型、中型、大型" />
          </Form.Item>
          <Space>
            <Form.Item name="minValue" label="最小值">
              <InputNumber placeholder="最小值" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="maxValue" label="最大值">
              <InputNumber placeholder="最大值（留空表示无上限）" style={{ width: 200 }} />
            </Form.Item>
          </Space>
          <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
            <Input placeholder="如：人次/日、床、人" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
