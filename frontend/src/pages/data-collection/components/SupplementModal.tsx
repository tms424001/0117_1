import React from 'react';
import { Modal, Form, Input, Select, Cascader, DatePicker, InputNumber, Divider } from 'antd';

interface SupplementModalProps {
  open: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

// 省市数据
const locationOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      { value: '东城区', label: '东城区' },
      { value: '西城区', label: '西城区' },
      { value: '海淀区', label: '海淀区' },
      { value: '朝阳区', label: '朝阳区' },
    ],
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      { value: '浦东新区', label: '浦东新区' },
      { value: '黄浦区', label: '黄浦区' },
      { value: '徐汇区', label: '徐汇区' },
    ],
  },
];

// 功能标签选项
const functionTagOptions = [
  {
    value: 'medical',
    label: '医疗建筑',
    children: [
      { value: 'hospital', label: '医院', children: [
        { value: 'general-hospital', label: '综合医院' },
        { value: 'specialized-hospital', label: '专科医院' },
      ]},
      { value: 'clinic', label: '门诊部' },
    ],
  },
  {
    value: 'education',
    label: '教育建筑',
    children: [
      { value: 'school', label: '学校', children: [
        { value: 'primary-school', label: '小学' },
        { value: 'middle-school', label: '中学' },
        { value: 'university', label: '大学' },
      ]},
    ],
  },
  {
    value: 'office',
    label: '办公建筑',
    children: [
      { value: 'business-office', label: '商务办公' },
      { value: 'government-office', label: '政府办公' },
    ],
  },
];

const SupplementModal: React.FC<SupplementModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      await form.validateFields();
      onSuccess();
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <Modal
      title={`补录元数据 - ${record?.projectName || ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="保存"
      cancelText="取消"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          projectName: record?.projectName,
          location: record?.province ? [record.province, record.city] : undefined,
          pricingStage: record?.pricingStage,
        }}
      >
        {/* 基本信息 */}
        <Divider>基本信息</Divider>
        <Form.Item
          label="项目名称"
          name="projectName"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="建设单位" name="constructionUnit">
            <Input placeholder="请输入建设单位" />
          </Form.Item>
          <Form.Item label="设计单位" name="designUnit">
            <Input placeholder="请输入设计单位" />
          </Form.Item>
          <Form.Item label="施工单位" name="constructorUnit">
            <Input placeholder="请输入施工单位" />
          </Form.Item>
          <Form.Item label="咨询单位" name="consultUnit">
            <Input placeholder="请输入咨询单位" />
          </Form.Item>
        </div>

        {/* 项目属性 */}
        <Divider>项目属性</Divider>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="地点"
            name="location"
            rules={[{ required: true, message: '请选择地点' }]}
          >
            <Cascader options={locationOptions} placeholder="请选择省份/城市" />
          </Form.Item>
          <Form.Item
            label="计价阶段"
            name="pricingStage"
            rules={[{ required: true, message: '请选择计价阶段' }]}
          >
            <Select
              placeholder="请选择"
              options={[
                { value: 'estimate', label: '概算' },
                { value: 'budget', label: '预算' },
                { value: 'bidControl', label: '招标控制价' },
                { value: 'bidQuote', label: '投标报价' },
                { value: 'settlement', label: '结算' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="材价基准期"
            name="priceBaseDate"
            rules={[{ required: true, message: '请选择材价基准期' }]}
          >
            <DatePicker picker="month" style={{ width: '100%' }} placeholder="请选择年月" />
          </Form.Item>
          <Form.Item label="编制时间" name="compileDate">
            <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
          </Form.Item>
        </div>

        {/* 建设规模 */}
        <Divider>建设规模</Divider>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="总建筑面积(m²)" name="totalArea">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地上面积(m²)" name="aboveGroundArea">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地下面积(m²)" name="undergroundArea">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地上层数" name="aboveGroundFloors">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="地下层数" name="undergroundFloors">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="结构类型" name="structureType">
            <Select
              placeholder="请选择"
              options={[
                { value: 'frame', label: '框架结构' },
                { value: 'shearWall', label: '剪力墙结构' },
                { value: 'frameShearWall', label: '框架-剪力墙结构' },
                { value: 'steel', label: '钢结构' },
                { value: 'brick', label: '砖混结构' },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="功能标签"
          name="functionTag"
          rules={[{ required: true, message: '请选择功能标签' }]}
        >
          <Cascader
            options={functionTagOptions}
            placeholder="请选择功能标签"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* 造价信息 */}
        <Divider>造价信息</Divider>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="工程总造价(元)" name="totalCost">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/,/g, '') as any}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item label="单方造价(元/m²)">
            <InputNumber style={{ width: '100%' }} disabled placeholder="自动计算" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SupplementModal;
