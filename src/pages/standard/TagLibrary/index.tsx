import { useState } from 'react';
import { Card, Tree, Table, Input, Button, Tag, Space, Descriptions } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const treeData: DataNode[] = [
  {
    title: '医疗建筑 (YI)',
    key: 'YI',
    children: [
      {
        title: '门诊 (YI-MZ)',
        key: 'YI-MZ',
        children: [
          { title: '综合门诊 (YI-MZ-01)', key: 'YI-MZ-01' },
          { title: '专科门诊 (YI-MZ-02)', key: 'YI-MZ-02' },
        ],
      },
      {
        title: '住院 (YI-ZY)',
        key: 'YI-ZY',
        children: [
          { title: '普通病房 (YI-ZY-01)', key: 'YI-ZY-01' },
          { title: 'ICU病房 (YI-ZY-02)', key: 'YI-ZY-02' },
        ],
      },
      {
        title: '医技 (YI-YJ)',
        key: 'YI-YJ',
        children: [
          { title: '检验科 (YI-YJ-01)', key: 'YI-YJ-01' },
          { title: '影像科 (YI-YJ-02)', key: 'YI-YJ-02' },
        ],
      },
    ],
  },
  {
    title: '教育建筑 (JY)',
    key: 'JY',
    children: [
      {
        title: '教学 (JY-JX)',
        key: 'JY-JX',
        children: [
          { title: '普通教室 (JY-JX-01)', key: 'JY-JX-01' },
          { title: '实验室 (JY-JX-02)', key: 'JY-JX-02' },
        ],
      },
    ],
  },
  {
    title: '办公建筑 (BG)',
    key: 'BG',
    children: [
      { title: '行政办公 (BG-XZ)', key: 'BG-XZ' },
      { title: '商务办公 (BG-SW)', key: 'BG-SW' },
    ],
  },
];

const tagDetails: Record<string, { name: string; scaleType: string; description: string }> = {
  'YI-MZ-01': { name: '综合门诊', scaleType: '日门诊量', description: '综合性医院的门诊部分，包含挂号、候诊、诊室等功能区域' },
  'YI-MZ-02': { name: '专科门诊', scaleType: '日门诊量', description: '专科医院或综合医院的专科门诊部分' },
  'YI-ZY-01': { name: '普通病房', scaleType: '床位数', description: '普通住院病房，包含病房、护士站、治疗室等' },
  'YI-ZY-02': { name: 'ICU病房', scaleType: '床位数', description: '重症监护病房，配备高端医疗设备' },
};

export default function TagLibrary() {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['YI', 'YI-MZ']);

  const selectedTag = tagDetails[selectedKey];

  return (
    <div>
      <div className="page-header">
        <h1>功能标签库</h1>
      </div>

      <div className="flex gap-4">
        <Card className="w-80 flex-shrink-0" title="标签树">
          <Input
            placeholder="搜索标签"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
            allowClear
          />
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            selectedKeys={selectedKey ? [selectedKey] : []}
            onSelect={(keys) => setSelectedKey(keys[0] as string)}
            showLine
            defaultExpandAll
          />
        </Card>

        <Card className="flex-1" title="标签详情">
          {selectedTag ? (
            <div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="标签编码">{selectedKey}</Descriptions.Item>
                <Descriptions.Item label="标签名称">{selectedTag.name}</Descriptions.Item>
                <Descriptions.Item label="规模类型">{selectedTag.scaleType}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color="green">启用</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>
                  {selectedTag.description}
                </Descriptions.Item>
              </Descriptions>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium">关联规模分档</h3>
                  <Button type="primary" size="small" icon={<PlusOutlined />}>
                    添加分档
                  </Button>
                </div>
                <Table
                  size="small"
                  pagination={false}
                  columns={[
                    { title: '分档名称', dataIndex: 'name', key: 'name' },
                    { title: '范围', dataIndex: 'range', key: 'range' },
                    { title: '单位', dataIndex: 'unit', key: 'unit' },
                  ]}
                  dataSource={[
                    { key: '1', name: '小型', range: '0 - 500', unit: '人次/日' },
                    { key: '2', name: '中型', range: '500 - 2000', unit: '人次/日' },
                    { key: '3', name: '大型', range: '2000+', unit: '人次/日' },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-20">
              请从左侧选择一个标签查看详情
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
