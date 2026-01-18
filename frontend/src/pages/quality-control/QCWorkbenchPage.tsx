import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Table,
  Upload,
  Statistic,
  Badge,
  Dropdown,
  Modal,
  message,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

// 文件数据类型
interface QCFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadTime: string;
  status: 'pending' | 'checking' | 'checked' | 'error';
  checkResults?: {
    compliance?: { pass: number; fail: number };
    materialPrice?: { pass: number; fail: number };
    compositePrice?: { pass: number; fail: number };
    boqDefect?: { pass: number; fail: number };
    indexRationality?: { pass: number; fail: number };
  };
  totalIssues?: { error: number; warning: number; info: number };
}

// 检查类型定义
const checkTypes = [
  { key: 'compliance', name: '合规性检查', icon: <SafetyCertificateOutlined />, path: '/quality-control/compliance', color: '#1890ff' },
  { key: 'materialPrice', name: '材料价格检查', icon: <DollarOutlined />, path: '/quality-control/material-price', color: '#52c41a' },
  { key: 'compositePrice', name: '综合单价检查', icon: <CalculatorOutlined />, path: '/quality-control/composite-price', color: '#722ed1' },
  { key: 'boqDefect', name: '清单缺陷检查', icon: <UnorderedListOutlined />, path: '/quality-control/boq-defect', color: '#13c2c2' },
  { key: 'indexRationality', name: '指标合理性检查', icon: <BarChartOutlined />, path: '/quality-control/index-check', color: '#fa8c16' },
];

// 模拟文件列表
const mockFiles: QCFile[] = [
  {
    id: '1',
    fileName: '某医院门诊楼招标控制价.xml',
    fileType: '招标控制价',
    fileSize: '2.5MB',
    uploadTime: '2026-01-18 15:30:00',
    status: 'checked',
    checkResults: {
      compliance: { pass: 1248, fail: 8 },
      materialPrice: { pass: 856, fail: 12 },
      compositePrice: { pass: 1218, fail: 38 },
      boqDefect: { pass: 1198, fail: 58 },
      indexRationality: { pass: 32, fail: 3 },
    },
    totalIssues: { error: 15, warning: 52, info: 29 },
  },
  {
    id: '2',
    fileName: '某住宅项目投标报价.gcz',
    fileType: '投标报价',
    fileSize: '1.8MB',
    uploadTime: '2026-01-18 14:20:00',
    status: 'checked',
    checkResults: {
      compliance: { pass: 986, fail: 3 },
      materialPrice: { pass: 652, fail: 5 },
    },
    totalIssues: { error: 3, warning: 8, info: 12 },
  },
  {
    id: '3',
    fileName: '某学校项目结算文件.gzb',
    fileType: '结算文件',
    fileSize: '3.2MB',
    uploadTime: '2026-01-18 10:15:00',
    status: 'pending',
  },
];

const QCWorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<QCFile[]>(mockFiles);
  const [selectedFile, setSelectedFile] = useState<QCFile | null>(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xml,.gcz,.gzb',
    showUploadList: false,
    beforeUpload: (file) => {
      const newFile: QCFile = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: '待识别',
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        uploadTime: new Date().toLocaleString(),
        status: 'pending',
      };
      setFiles([newFile, ...files]);
      message.success(`文件 ${file.name} 上传成功`);
      return false;
    },
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待检查' },
      checking: { color: 'processing', text: '检查中' },
      checked: { color: 'success', text: '已检查' },
      error: { color: 'error', text: '检查失败' },
    };
    const s = map[status] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // 获取问题统计显示
  const getIssueDisplay = (issues?: { error: number; warning: number; info: number }) => {
    if (!issues) return <span className="text-gray-400">-</span>;
    return (
      <Space size="small">
        {issues.error > 0 && <Badge count={issues.error} style={{ backgroundColor: '#f5222d' }} />}
        {issues.warning > 0 && <Badge count={issues.warning} style={{ backgroundColor: '#fa8c16' }} />}
        {issues.info > 0 && <Badge count={issues.info} style={{ backgroundColor: '#1890ff' }} />}
        {issues.error === 0 && issues.warning === 0 && issues.info === 0 && (
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
        )}
      </Space>
    );
  };

  // 打开检查类型选择
  const handleStartCheck = (file: QCFile) => {
    setSelectedFile(file);
    setCheckModalVisible(true);
  };

  // 执行检查
  const handleRunCheck = (checkType: typeof checkTypes[0]) => {
    if (selectedFile) {
      setCheckModalVisible(false);
      // 跳转到对应检查页面，带上文件ID参数
      navigate(`${checkType.path}?fileId=${selectedFile.id}`);
    }
  };

  // 查看检查结果
  const handleViewResult = (file: QCFile, checkType: string) => {
    const type = checkTypes.find(t => t.key === checkType);
    if (type) {
      navigate(`${type.path}?fileId=${file.id}`);
    }
  };

  // 删除文件
  const handleDelete = (file: QCFile) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文件 "${file.fileName}" 吗？`,
      onOk: () => {
        setFiles(files.filter(f => f.id !== file.id));
        message.success('删除成功');
      },
    });
  };

  // 操作菜单
  const getActionMenu = (file: QCFile): MenuProps['items'] => [
    { key: 'check', label: '执行检查', icon: <PlayCircleOutlined />, onClick: () => handleStartCheck(file) },
    { key: 'view', label: '查看详情', icon: <EyeOutlined /> },
    { type: 'divider' },
    { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(file) },
  ];

  // 文件列定义
  const fileColumns: ColumnsType<QCFile> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (v, record) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <div>
            <div className="font-medium">{v}</div>
            <div className="text-xs text-gray-400">{record.fileType} | {record.fileSize}</div>
          </div>
        </div>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v) => getStatusTag(v),
    },
    {
      title: '检查结果',
      key: 'checkResults',
      width: 300,
      render: (_, record) => {
        if (record.status !== 'checked' || !record.checkResults) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <Space size="small" wrap>
            {Object.entries(record.checkResults).map(([key, result]) => {
              const type = checkTypes.find(t => t.key === key);
              if (!type) return null;
              const hasIssue = result.fail > 0;
              return (
                <Tag
                  key={key}
                  color={hasIssue ? 'orange' : 'green'}
                  className="cursor-pointer"
                  onClick={() => handleViewResult(record, key)}
                >
                  {type.name.replace('检查', '')}: {hasIssue ? <WarningOutlined /> : <CheckCircleOutlined />}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: '问题数',
      key: 'issues',
      width: 120,
      render: (_, record) => getIssueDisplay(record.totalIssues),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStartCheck(record)}>
            检查
          </Button>
          <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    checked: files.filter(f => f.status === 'checked').length,
    totalIssues: files.reduce((sum, f) => sum + (f.totalIssues?.error || 0) + (f.totalIssues?.warning || 0), 0),
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">质控工作台</span>
            <span className="text-gray-400 ml-2">统一文件管理 · 多维度检查</span>
          </div>
          <Upload {...uploadProps}>
            <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="文件总数" value={stats.total} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待检查" value={stats.pending} valueStyle={{ color: '#fa8c16' }} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已检查" value={stats.checked} valueStyle={{ color: '#52c41a' }} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待处理问题" value={stats.totalIssues} valueStyle={{ color: '#f5222d' }} suffix="个" />
          </Card>
        </Col>
      </Row>

      {/* 文件列表 */}
      <Card size="small" title="文件列表">
        <Table
          rowKey="id"
          columns={fileColumns}
          dataSource={files}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个文件` }}
          size="small"
        />
      </Card>

      {/* 检查类型选择弹窗 */}
      <Modal
        title={`选择检查类型 - ${selectedFile?.fileName}`}
        open={checkModalVisible}
        onCancel={() => setCheckModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="grid grid-cols-2 gap-4 py-4">
          {checkTypes.map(type => (
            <Card
              key={type.key}
              size="small"
              hoverable
              className="cursor-pointer"
              onClick={() => handleRunCheck(type)}
            >
              <div className="flex items-center gap-3">
                <div style={{ fontSize: 32, color: type.color }}>{type.icon}</div>
                <div>
                  <div className="font-medium">{type.name}</div>
                  {selectedFile?.checkResults?.[type.key as keyof typeof selectedFile.checkResults] && (
                    <div className="text-xs text-gray-400">
                      已检查，点击查看结果
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default QCWorkbenchPage;
