/**
 * 造价文件预览页面
 * 对齐 specs/03_Data_Collection/Cost_File_Spec.md
 */

import { useState, useMemo, Key } from 'react';
import { 
  Button, Tag, Drawer, Descriptions, Tooltip, Badge 
} from 'antd';
import { 
  ArrowLeftOutlined, DownloadOutlined, CheckOutlined,
  ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useNavigate, useParams } from 'react-router-dom';
import { GoldenPage, TreePanel, GridPanel } from '@/components/golden';
import type { IssueItem } from '@/components/golden/BottomPanel';

// Mock 树节点数据
interface CostTreeNode {
  id: string;
  name: string;
  level: number;
  path: string;
  childrenCount: number;
  totalPrice?: number;
  children?: CostTreeNode[];
}

const mockTreeData: CostTreeNode[] = [
  {
    id: 'root',
    name: '某医院门诊楼工程',
    level: 0,
    path: '/',
    childrenCount: 3,
    totalPrice: 125680000,
    children: [
      {
        id: 'unit-1',
        name: '门诊楼',
        level: 1,
        path: '/门诊楼',
        childrenCount: 5,
        totalPrice: 85600000,
        children: [
          { id: 'unit-1-1', name: '土建工程', level: 2, path: '/门诊楼/土建工程', childrenCount: 12, totalPrice: 45000000 },
          { id: 'unit-1-2', name: '给排水工程', level: 2, path: '/门诊楼/给排水工程', childrenCount: 8, totalPrice: 8500000 },
          { id: 'unit-1-3', name: '暖通工程', level: 2, path: '/门诊楼/暖通工程', childrenCount: 6, totalPrice: 12000000 },
          { id: 'unit-1-4', name: '电气工程', level: 2, path: '/门诊楼/电气工程', childrenCount: 10, totalPrice: 15000000 },
          { id: 'unit-1-5', name: '智能化工程', level: 2, path: '/门诊楼/智能化工程', childrenCount: 5, totalPrice: 5100000 },
        ],
      },
      {
        id: 'unit-2',
        name: '医技楼',
        level: 1,
        path: '/医技楼',
        childrenCount: 4,
        totalPrice: 32000000,
        children: [
          { id: 'unit-2-1', name: '土建工程', level: 2, path: '/医技楼/土建工程', childrenCount: 10, totalPrice: 18000000 },
          { id: 'unit-2-2', name: '安装工程', level: 2, path: '/医技楼/安装工程', childrenCount: 8, totalPrice: 14000000 },
        ],
      },
      {
        id: 'unit-3',
        name: '室外工程',
        level: 1,
        path: '/室外工程',
        childrenCount: 3,
        totalPrice: 8080000,
        children: [
          { id: 'unit-3-1', name: '道路工程', level: 2, path: '/室外工程/道路工程', childrenCount: 5, totalPrice: 3500000 },
          { id: 'unit-3-2', name: '绿化工程', level: 2, path: '/室外工程/绿化工程', childrenCount: 4, totalPrice: 2580000 },
          { id: 'unit-3-3', name: '管网工程', level: 2, path: '/室外工程/管网工程', childrenCount: 6, totalPrice: 2000000 },
        ],
      },
    ],
  },
];

// Mock 行数据
interface CostRow {
  rowId: string;
  itemName: string;
  feature?: string;
  unit?: string;
  qty?: number;
  unitPrice?: number;
  totalPrice?: number;
  originPath: string;
}

const mockRows: CostRow[] = [
  { rowId: '1', itemName: '土方开挖', feature: '机械挖土，深度3m以内', unit: 'm³', qty: 12500, unitPrice: 28.5, totalPrice: 356250, originPath: '/门诊楼/土建工程' },
  { rowId: '2', itemName: '土方回填', feature: '机械回填，分层夯实', unit: 'm³', qty: 8000, unitPrice: 18.2, totalPrice: 145600, originPath: '/门诊楼/土建工程' },
  { rowId: '3', itemName: '混凝土垫层', feature: 'C15混凝土，厚100mm', unit: 'm³', qty: 450, unitPrice: 385, totalPrice: 173250, originPath: '/门诊楼/土建工程' },
  { rowId: '4', itemName: '钢筋混凝土基础', feature: 'C30混凝土，含钢筋', unit: 'm³', qty: 2800, unitPrice: 1250, totalPrice: 3500000, originPath: '/门诊楼/土建工程' },
  { rowId: '5', itemName: '钢筋混凝土柱', feature: 'C40混凝土，含钢筋', unit: 'm³', qty: 1500, unitPrice: 1680, totalPrice: 2520000, originPath: '/门诊楼/土建工程' },
  { rowId: '6', itemName: '钢筋混凝土梁', feature: 'C40混凝土，含钢筋', unit: 'm³', qty: 2200, unitPrice: 1580, totalPrice: 3476000, originPath: '/门诊楼/土建工程' },
  { rowId: '7', itemName: '钢筋混凝土板', feature: 'C30混凝土，含钢筋', unit: 'm³', qty: 3500, unitPrice: 1420, totalPrice: 4970000, originPath: '/门诊楼/土建工程' },
  { rowId: '8', itemName: '砌体墙', feature: '加气混凝土砌块，厚200mm', unit: 'm³', qty: 1800, unitPrice: 320, totalPrice: 576000, originPath: '/门诊楼/土建工程' },
  { rowId: '9', itemName: '内墙抹灰', feature: '水泥砂浆抹灰，厚20mm', unit: 'm²', qty: 25000, unitPrice: 35, totalPrice: 875000, originPath: '/门诊楼/土建工程' },
  { rowId: '10', itemName: '外墙保温', feature: '岩棉保温板，厚80mm', unit: 'm²', qty: 8500, unitPrice: 125, totalPrice: 1062500, originPath: '/门诊楼/土建工程' },
];

// Mock 解析日志
const mockLogs: IssueItem[] = [
  { id: 'log-1', type: 'error', message: '第125行：单价为空，已使用默认值0', field: 'unitPrice', rowId: '125' },
  { id: 'log-2', type: 'error', message: '第238行：数量格式错误，无法解析', field: 'qty', rowId: '238' },
  { id: 'log-3', type: 'warning', message: '第56行：单位"m3"已自动转换为"m³"', field: 'unit', rowId: '56' },
  { id: 'log-4', type: 'warning', message: '第89行：特征描述超长，已截断', field: 'feature', rowId: '89' },
  { id: 'log-5', type: 'info', message: '解析完成，共12,458行，耗时3.2秒' },
];

export default function CostFilePreviewPage() {
  const navigate = useNavigate();
  const { batchId } = useParams<{ batchId: string }>();
  const [selectedNode, setSelectedNode] = useState<string>('unit-1-1');
  const [selectedRow, setSelectedRow] = useState<CostRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 转换树数据为 antd Tree 格式
  const convertToTreeData = (nodes: CostTreeNode[]): DataNode[] => {
    return nodes.map(node => ({
      key: node.id,
      title: (
        <div className="flex items-center justify-between w-full pr-2">
          <span className="truncate" title={node.name}>{node.name}</span>
          {node.totalPrice && (
            <span className="text-xs text-gray-400 ml-2">
              {(node.totalPrice / 10000).toFixed(0)}万
            </span>
          )}
        </div>
      ),
      children: node.children ? convertToTreeData(node.children) : undefined,
    }));
  };

  const treeData = useMemo(() => convertToTreeData(mockTreeData), []);

  // 表格列定义
  const columns: ColumnsType<CostRow> = [
    {
      title: '序号',
      dataIndex: 'rowId',
      width: 60,
      render: (id) => <span className="text-gray-400">{id}</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      width: 200,
    },
    {
      title: '特征描述',
      dataIndex: 'feature',
      width: 250,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 100,
      align: 'right',
      render: (qty) => qty?.toLocaleString() || '-',
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      align: 'right',
      render: (price) => price?.toFixed(2) || '-',
    },
    {
      title: '合价',
      dataIndex: 'totalPrice',
      width: 120,
      align: 'right',
      render: (price) => (
        <span className="font-medium">
          {price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '-'}
        </span>
      ),
    },
  ];

  // 树选择
  const handleTreeSelect = (keys: Key[]) => {
    if (keys[0]) {
      setSelectedNode(keys[0] as string);
    }
  };

  // 行点击
  const handleRowClick = (row: CostRow) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  // 日志项点击（定位）
  const handleLogClick = (issue: IssueItem) => {
    if (issue.rowId) {
      const row = mockRows.find(r => r.rowId === issue.rowId);
      if (row) {
        setSelectedRow(row);
        setDrawerOpen(true);
      }
    }
  };

  // 获取当前节点信息
  const findNode = (nodes: CostTreeNode[], id: string): CostTreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentNode = findNode(mockTreeData, selectedNode);

  return (
    <GoldenPage
      header={{
        title: '造价文件预览',
        subtitle: currentNode?.path || '',
        showBack: true,
        backPath: '/collect/imports',
        breadcrumbs: [
          { title: '数据采集', path: '/collect/imports' },
          { title: '造价文件预览' },
        ],
        actions: [
          {
            key: 'confirm',
            label: '确认完成',
            type: 'primary',
            icon: <CheckOutlined />,
            onClick: () => navigate('/tagging/tasks'),
          },
          {
            key: 'download',
            label: '下载原文件',
            icon: <DownloadOutlined />,
          },
        ],
        extra: (
          <div className="flex items-center gap-4 text-sm">
            <span>
              <Badge status="error" /> 错误 {mockLogs.filter(l => l.type === 'error').length}
            </span>
            <span>
              <Badge status="warning" /> 警告 {mockLogs.filter(l => l.type === 'warning').length}
            </span>
          </div>
        ),
      }}
      treePanel={
        <TreePanel
          title="工程树"
          data={treeData}
          selectedKeys={[selectedNode]}
          expandedKeys={['root', 'unit-1', 'unit-2', 'unit-3']}
          onSelect={handleTreeSelect}
          showSearch={true}
          searchPlaceholder="搜索节点..."
        />
      }
      treePanelWidth={280}
      drawerOpen={drawerOpen}
      drawer={
        selectedRow && (
          <RowDetailDrawer
            row={selectedRow}
            onClose={() => setDrawerOpen(false)}
          />
        )
      }
      drawerWidth={400}
      showBottomPanel={true}
      bottomPanel={{
        issues: mockLogs.map(log => ({
          ...log,
          onClick: () => handleLogClick(log),
        })),
      }}
      bottomPanelHeight={180}
    >
      {/* 节点信息卡片 */}
      {currentNode && (
        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-medium">{currentNode.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              路径: {currentNode.path} | 子项: {currentNode.childrenCount} | 
              层级: {currentNode.level}
            </div>
          </div>
          {currentNode.totalPrice && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ¥{(currentNode.totalPrice / 10000).toFixed(2)}万
              </div>
              <div className="text-sm text-gray-500">合计金额</div>
            </div>
          )}
        </div>
      )}

      <GridPanel
        columns={columns}
        dataSource={mockRows}
        rowKey="rowId"
        onRowClick={handleRowClick}
        pagination={{
          total: 12458,
          pageSize: 50,
          showTotal: (total) => `共 ${total.toLocaleString()} 行`,
        }}
        scroll={{ y: 400 }}
        size="small"
      />
    </GoldenPage>
  );
}

// 行详情抽屉
interface RowDetailDrawerProps {
  row: CostRow;
  onClose: () => void;
}

function RowDetailDrawer({ row, onClose }: RowDetailDrawerProps) {
  return (
    <Drawer
      title="行详情"
      open={true}
      onClose={onClose}
      width={400}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="行号">{row.rowId}</Descriptions.Item>
        <Descriptions.Item label="项目名称">{row.itemName}</Descriptions.Item>
        <Descriptions.Item label="特征描述">{row.feature || '-'}</Descriptions.Item>
        <Descriptions.Item label="单位">{row.unit || '-'}</Descriptions.Item>
        <Descriptions.Item label="数量">{row.qty?.toLocaleString() || '-'}</Descriptions.Item>
        <Descriptions.Item label="单价">{row.unitPrice?.toFixed(2) || '-'}</Descriptions.Item>
        <Descriptions.Item label="合价">
          <span className="font-medium text-blue-600">
            ¥{row.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '-'}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="原始路径">{row.originPath}</Descriptions.Item>
      </Descriptions>

      <div className="mt-6">
        <div className="text-sm font-medium mb-2">原始数据 (Raw)</div>
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
{JSON.stringify({
  rowId: row.rowId,
  itemName: row.itemName,
  feature: row.feature,
  unit: row.unit,
  qty: row.qty,
  unitPrice: row.unitPrice,
  totalPrice: row.totalPrice,
}, null, 2)}
        </pre>
      </div>
    </Drawer>
  );
}
