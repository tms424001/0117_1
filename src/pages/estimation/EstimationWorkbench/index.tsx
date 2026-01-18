import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Table,
  Statistic,
  Divider,
  Space,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface EstimationUnit {
  key: string;
  unitName: string;
  functionTagCode: string;
  functionTagName: string;
  scaleRangeName: string;
  area: number;
  unitCost: number;
  totalCost: number;
}

const mockUnits: EstimationUnit[] = [
  {
    key: '1',
    unitName: '门诊楼',
    functionTagCode: 'YI-MZ-01',
    functionTagName: '综合门诊',
    scaleRangeName: '中型',
    area: 15000,
    unitCost: 4500,
    totalCost: 67500000,
  },
  {
    key: '2',
    unitName: '住院楼',
    functionTagCode: 'YI-ZY-01',
    functionTagName: '普通病房',
    scaleRangeName: '大型',
    area: 25000,
    unitCost: 5200,
    totalCost: 130000000,
  },
  {
    key: '3',
    unitName: '医技楼',
    functionTagCode: 'YI-YJ-01',
    functionTagName: '医技用房',
    scaleRangeName: '中型',
    area: 12000,
    unitCost: 5500,
    totalCost: 66000000,
  },
];

const tagOptions = [
  { value: 'YI-MZ-01', label: '综合门诊 (YI-MZ-01)' },
  { value: 'YI-ZY-01', label: '普通病房 (YI-ZY-01)' },
  { value: 'YI-YJ-01', label: '医技用房 (YI-YJ-01)' },
  { value: 'JY-JX-01', label: '普通教室 (JY-JX-01)' },
];

export default function EstimationWorkbench() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [units, setUnits] = useState<EstimationUnit[]>(id ? mockUnits : []);

  const isNew = !id;

  const totalArea = units.reduce((sum, u) => sum + u.area, 0);
  const totalCost = units.reduce((sum, u) => sum + u.totalCost, 0);
  const avgUnitCost = totalArea > 0 ? totalCost / totalArea : 0;

  const handleAddUnit = () => {
    const newUnit: EstimationUnit = {
      key: Date.now().toString(),
      unitName: '',
      functionTagCode: '',
      functionTagName: '',
      scaleRangeName: '',
      area: 0,
      unitCost: 0,
      totalCost: 0,
    };
    setUnits([...units, newUnit]);
  };

  const handleDeleteUnit = (key: string) => {
    setUnits(units.filter((u) => u.key !== key));
  };

  const handleUnitChange = (key: string, field: string, value: unknown) => {
    setUnits(
      units.map((u) => {
        if (u.key === key) {
          const updated = { ...u, [field]: value };
          if (field === 'area' || field === 'unitCost') {
            updated.totalCost = (updated.area || 0) * (updated.unitCost || 0);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const handleSave = () => {
    message.success('保存成功');
  };

  const handleCalculate = () => {
    message.info('重新计算指标匹配...');
  };

  const columns: ColumnsType<EstimationUnit> = [
    {
      title: '单体名称',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 150,
      render: (_, record) => (
        <Input
          value={record.unitName}
          onChange={(e) => handleUnitChange(record.key, 'unitName', e.target.value)}
          placeholder="输入单体名称"
        />
      ),
    },
    {
      title: '功能标签',
      dataIndex: 'functionTagCode',
      key: 'functionTagCode',
      width: 200,
      render: (_, record) => (
        <Select
          value={record.functionTagCode || undefined}
          onChange={(v) => handleUnitChange(record.key, 'functionTagCode', v)}
          options={tagOptions}
          placeholder="选择功能标签"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '规模分档',
      dataIndex: 'scaleRangeName',
      key: 'scaleRangeName',
      width: 100,
      render: (_, record) => (
        <Select
          value={record.scaleRangeName || undefined}
          onChange={(v) => handleUnitChange(record.key, 'scaleRangeName', v)}
          options={[
            { value: '小型', label: '小型' },
            { value: '中型', label: '中型' },
            { value: '大型', label: '大型' },
          ]}
          placeholder="选择"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (_, record) => (
        <InputNumber
          value={record.area}
          onChange={(v) => handleUnitChange(record.key, 'area', v || 0)}
          min={0}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '单方造价(元/m²)',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 140,
      render: (_, record) => (
        <InputNumber
          value={record.unitCost}
          onChange={(v) => handleUnitChange(record.key, 'unitCost', v || 0)}
          min={0}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '小计(万元)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      align: 'right',
      render: (v) => (v / 10000).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteUnit(record.key)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <h1>{isNew ? '新建估算' : '编辑估算'}</h1>
        <Space>
          <Button onClick={() => navigate('/estimations')}>取消</Button>
          <Button icon={<CalculatorOutlined />} onClick={handleCalculate}>
            重新计算
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={18}>
          <Card title="基本信息" className="mb-4">
            <Form form={form} layout="vertical" initialValues={{ estimationType: 'standard' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="estimationName" label="估算名称" rules={[{ required: true }]}>
                    <Input placeholder="输入估算名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="projectName" label="项目名称">
                    <Input placeholder="输入项目名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="estimationType" label="估算类型">
                    <Select
                      options={[
                        { value: 'quick', label: '快速估算' },
                        { value: 'standard', label: '标准估算' },
                        { value: 'detailed', label: '详细估算' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="province" label="省份">
                    <Select placeholder="选择省份" options={[{ value: '浙江省', label: '浙江省' }]} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="city" label="城市">
                    <Select placeholder="选择城市" options={[{ value: '杭州市', label: '杭州市' }]} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="indexVersionCode" label="指标版本">
                    <Select
                      placeholder="选择指标版本"
                      options={[
                        { value: 'V2026.01', label: 'V2026.01 (最新)' },
                        { value: 'V2025.12', label: 'V2025.12' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card
            title="单体列表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUnit}>
                添加单体
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={units}
              rowKey="key"
              pagination={false}
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="估算汇总" className="sticky top-20">
            <Statistic
              title="总建筑面积"
              value={totalArea}
              suffix="m²"
              precision={0}
            />
            <Divider />
            <Statistic
              title="总造价"
              value={totalCost / 10000}
              suffix="万元"
              precision={2}
            />
            <Divider />
            <Statistic
              title="综合单方造价"
              value={avgUnitCost}
              prefix="¥"
              suffix="/m²"
              precision={0}
            />
            <Divider />
            <div className="text-sm text-gray-500">
              <div className="flex justify-between mb-2">
                <span>单体数量</span>
                <span>{units.length} 个</span>
              </div>
              <div className="flex justify-between">
                <span>指标版本</span>
                <span>V2026.01</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
