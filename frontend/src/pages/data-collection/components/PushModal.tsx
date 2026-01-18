import React, { useState } from 'react';
import { Modal, Checkbox, Alert, Result, Space, Button } from 'antd';
import {
  FolderOutlined,
  DollarOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

interface PushModalProps {
  open: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const PushModal: React.FC<PushModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  // 推送选项
  const [pushOptions, setPushOptions] = useState({
    project: true,
    materialPrice: true,
    compositePrice: true,
    index: true,
  });

  const handlePush = () => {
    setPushing(true);
    // 模拟推送
    setTimeout(() => {
      setPushing(false);
      setPushed(true);
    }, 1500);
  };

  const handleClose = () => {
    setPushed(false);
    onCancel();
  };

  const handleViewData = () => {
    setPushed(false);
    onSuccess();
  };

  if (pushed) {
    return (
      <Modal
        title="推送到我的数据"
        open={open}
        onCancel={handleClose}
        footer={
          <Space>
            <Button onClick={handleClose}>留在当前页面</Button>
            <Button type="primary" onClick={handleViewData}>
              去查看我的数据
            </Button>
          </Space>
        }
        width={500}
      >
        <Result
          status="success"
          title="推送成功！"
          subTitle={
            <div className="text-left mt-4">
              <div className="text-gray-600">已推送到：</div>
              <ul className="mt-2 space-y-1 text-gray-600">
                {pushOptions.project && <li>• 我的项目：1 个项目</li>}
                {pushOptions.materialPrice && <li>• 我的材价：1,256 条数据</li>}
                {pushOptions.compositePrice && <li>• 我的综价：1,340 条数据</li>}
                {pushOptions.index && <li>• 我的指标：6 条数据</li>}
              </ul>
            </div>
          }
        />
      </Modal>
    );
  }

  return (
    <Modal
      title={`推送到我的数据 - ${record?.projectName || ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handlePush}
      okText="确认推送"
      cancelText="取消"
      confirmLoading={pushing}
      width={600}
    >
      <div className="space-y-4">
        {/* 推送内容预览 */}
        <div className="border rounded p-4">
          <div className="font-medium mb-3">将推送以下数据到"我的数据"：</div>
          <div className="space-y-3 bg-gray-50 rounded p-4">
            <div className="flex items-center gap-3">
              <FolderOutlined className="text-blue-500 text-lg" />
              <div>
                <div className="font-medium">我的项目</div>
                <div className="text-sm text-gray-500">
                  {record?.projectName || 'XX医院门诊楼项目'}（含 6 个单位工程）
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarOutlined className="text-green-500 text-lg" />
              <div>
                <div className="font-medium">我的材价</div>
                <div className="text-sm text-gray-500">1,256 条材料价格数据</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileTextOutlined className="text-orange-500 text-lg" />
              <div>
                <div className="font-medium">我的综价</div>
                <div className="text-sm text-gray-500">1,340 条清单综合单价数据</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChartOutlined className="text-purple-500 text-lg" />
              <div>
                <div className="font-medium">我的指标</div>
                <div className="text-sm text-gray-500">6 条单位工程指标数据</div>
              </div>
            </div>
          </div>
        </div>

        {/* 推送选项 */}
        <div className="border rounded p-4">
          <div className="font-medium mb-3">推送选项</div>
          <div className="space-y-2">
            <Checkbox
              checked={pushOptions.project}
              onChange={(e) => setPushOptions({ ...pushOptions, project: e.target.checked })}
            >
              推送到我的项目
            </Checkbox>
            <Checkbox
              checked={pushOptions.materialPrice}
              onChange={(e) => setPushOptions({ ...pushOptions, materialPrice: e.target.checked })}
            >
              推送到我的材价（解析出的材料价格）
            </Checkbox>
            <Checkbox
              checked={pushOptions.compositePrice}
              onChange={(e) => setPushOptions({ ...pushOptions, compositePrice: e.target.checked })}
            >
              推送到我的综价（解析出的清单综价）
            </Checkbox>
            <Checkbox
              checked={pushOptions.index}
              onChange={(e) => setPushOptions({ ...pushOptions, index: e.target.checked })}
            >
              推送到我的指标（计算出的指标数据）
            </Checkbox>
          </div>
        </div>

        {/* 提示信息 */}
        <Alert
          type="warning"
          showIcon
          message="推送后，此文件状态将变为「已推送」，不可再次分析和补录。"
        />
      </div>
    </Modal>
  );
};

export default PushModal;
