import React, { useState } from 'react';
import { Modal, Tree, Table, Tabs, Descriptions, Tag, Checkbox } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';

interface ViewCostFileModalProps {
  open: boolean;
  record: any;
  onCancel: () => void;
}

// Mock 树形数据
const treeData: DataNode[] = [
  {
    title: 'XX医院门诊楼项目',
    key: 'proj-001',
    children: [
      {
        title: '门诊楼',
        key: 'item-001',
        children: [
          { title: '土建工程', key: 'unit-001', isLeaf: true },
          { title: '装饰工程', key: 'unit-002', isLeaf: true },
          { title: '安装工程', key: 'unit-003', isLeaf: true },
        ],
      },
      {
        title: '附属用房',
        key: 'item-002',
        children: [
          { title: '配电房', key: 'unit-004', isLeaf: true },
          { title: '水泵房', key: 'unit-005', isLeaf: true },
          { title: '门卫室', key: 'unit-006', isLeaf: true },
        ],
      },
    ],
  },
];

// Mock 分部分项数据
const divisionData = [
  { id: '1', code: '010101', name: '土方开挖', unit: 'm³', quantity: 2500, unitPrice: 28.5, totalPrice: 71250 },
  { id: '2', code: '010102', name: '土方回填', unit: 'm³', quantity: 1800, unitPrice: 15.2, totalPrice: 27360 },
  { id: '3', code: '010201', name: 'C30混凝土', unit: 'm³', quantity: 3200, unitPrice: 685, totalPrice: 2192000 },
  { id: '4', code: '010301', name: 'HRB400钢筋', unit: 't', quantity: 450, unitPrice: 5850, totalPrice: 2632500 },
  { id: '5', code: '010401', name: '模板工程', unit: 'm²', quantity: 12000, unitPrice: 65, totalPrice: 780000 },
];

const ViewCostFileModal: React.FC<ViewCostFileModalProps> = ({ open, record, onCancel }) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['unit-001']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['unit-001', 'unit-002', 'unit-003']);
  const [activeTab, setActiveTab] = useState('division');

  const columns: ColumnsType<any> = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
    { title: '项目编码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '工程量', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'right' },
    { 
      title: '综合单价', 
      dataIndex: 'unitPrice', 
      key: 'unitPrice', 
      width: 100, 
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
    { 
      title: '合价', 
      dataIndex: 'totalPrice', 
      key: 'totalPrice', 
      width: 120, 
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
  ];

  const tabItems = [
    { key: 'division', label: '分部分项' },
    { key: 'measure', label: '措施项目' },
    { key: 'other', label: '其他项目' },
    { key: 'fee', label: '规费' },
    { key: 'tax', label: '税金' },
  ];

  return (
    <Modal
      title={`查看造价文件 - ${record?.projectName || ''}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1200}
      styles={{ body: { height: '70vh', overflow: 'hidden' } }}
    >
      <div className="flex h-full gap-4">
        {/* 左侧：项目树 */}
        <div className="w-64 flex-shrink-0 border rounded p-3 overflow-auto">
          <div className="text-sm font-medium mb-2">项目结构</div>
          <Tree
            checkable
            defaultExpandAll
            selectedKeys={selectedKeys}
            checkedKeys={checkedKeys}
            onSelect={(keys) => setSelectedKeys(keys)}
            onCheck={(keys) => setCheckedKeys(keys as React.Key[])}
            treeData={treeData}
          />
          <div className="mt-3 pt-3 border-t text-sm text-gray-500">
            <Checkbox
              checked={checkedKeys.length === 6}
              indeterminate={checkedKeys.length > 0 && checkedKeys.length < 6}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedKeys(['unit-001', 'unit-002', 'unit-003', 'unit-004', 'unit-005', 'unit-006']);
                } else {
                  setCheckedKeys([]);
                }
              }}
            >
              全选/取消
            </Checkbox>
            <div className="mt-1">已选: {checkedKeys.length}/6 个单位工程</div>
          </div>
        </div>

        {/* 右侧：单位工程详情 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="small"
          />
          <div className="flex-1 overflow-auto">
            <div className="text-sm text-gray-500 mb-2">
              当前显示：土建工程 - {tabItems.find(t => t.key === activeTab)?.label}
            </div>
            <Table
              columns={columns}
              dataSource={divisionData}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 'calc(70vh - 200px)' }}
            />
          </div>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="mt-4 pt-4 border-t">
        <Descriptions size="small" column={4}>
          <Descriptions.Item label="建设单位">{record?.constructionUnit || 'XX医院'}</Descriptions.Item>
          <Descriptions.Item label="地点">{record?.province || '北京市'}</Descriptions.Item>
          <Descriptions.Item label="计价阶段">
            <Tag color="blue">{record?.pricingStageName || '招标控制价'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color="green">{record?.statusName || '已分析'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ViewCostFileModal;
