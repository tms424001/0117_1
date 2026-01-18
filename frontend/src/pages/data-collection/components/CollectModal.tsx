import React, { useState } from 'react';
import { Modal, Upload, Form, Select, Cascader, message, Progress, List } from 'antd';
import { InboxOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface CollectModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// 省市数据（简化版）
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
  {
    value: '广州市',
    label: '广州市',
    children: [
      { value: '天河区', label: '天河区' },
      { value: '越秀区', label: '越秀区' },
      { value: '海珠区', label: '海珠区' },
    ],
  },
];

const CollectModal: React.FC<CollectModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // 模拟上传完成
    setTimeout(() => {
      clearInterval(timer);
      setUploadProgress(100);
      setUploading(false);
      setFileList([]);
      form.resetFields();
      onSuccess();
    }, 2500);
  };

  const handleCancel = () => {
    if (!uploading) {
      setFileList([]);
      form.resetFields();
      onCancel();
    }
  };

  const uploadProps = {
    multiple: true,
    fileList,
    beforeUpload: (file: UploadFile) => {
      const allowedTypes = ['.gbq', '.gcfx', '.cjz', '.qtfx', '.cos', '.xml', '.xlsx'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        message.error(`不支持的文件格式: ${ext}`);
        return Upload.LIST_IGNORE;
      }
      if ((file.size || 0) > 500 * 1024 * 1024) {
        message.error('文件大小不能超过500MB');
        return Upload.LIST_IGNORE;
      }
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <Modal
      title="采集造价文件"
      open={open}
      onCancel={handleCancel}
      onOk={handleUpload}
      okText="开始采集"
      cancelText="取消"
      width={600}
      confirmLoading={uploading}
      maskClosable={!uploading}
      closable={!uploading}
    >
      <div className="space-y-4">
        {/* 文件上传区域 */}
        <Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">将文件拖到此处，或点击选择文件</p>
          <p className="ant-upload-hint">
            支持格式：.gbq .gcfx .cjz .qtfx .cos .xml .xlsx
            <br />
            单个文件最大：500MB
          </p>
        </Dragger>

        {/* 上传进度 */}
        {uploading && (
          <div className="py-2">
            <Progress percent={uploadProgress} status="active" />
            <div className="text-center text-gray-500 mt-2">
              {uploadProgress < 100 ? '正在上传...' : '解析中...'}
            </div>
          </div>
        )}

        {/* 已选文件列表 */}
        {fileList.length > 0 && !uploading && (
          <div className="border rounded p-3 bg-gray-50">
            <div className="text-sm text-gray-500 mb-2">已选文件 ({fileList.length})</div>
            <List
              size="small"
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <DeleteOutlined
                      key="delete"
                      className="text-red-500 cursor-pointer"
                      onClick={() => setFileList((prev) => prev.filter((f) => f.uid !== file.uid))}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileOutlined />}
                    title={file.name}
                    description={`${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 可选信息 */}
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500 mb-3">可选信息（可在补录时填写）</div>
          <Form form={form} layout="vertical">
            <Form.Item label="地点" name="location">
              <Cascader
                options={locationOptions}
                placeholder="请选择省份/城市"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="计价阶段" name="pricingStage">
              <Select
                placeholder="请选择"
                allowClear
                options={[
                  { value: 'estimate', label: '概算' },
                  { value: 'budget', label: '预算' },
                  { value: 'bidControl', label: '招标控制价' },
                  { value: 'bidQuote', label: '投标报价' },
                  { value: 'settlement', label: '结算' },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CollectModal;
