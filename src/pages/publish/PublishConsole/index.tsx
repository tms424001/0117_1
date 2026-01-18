/**
 * 发布控制台页面
 * 对齐 specs/05_Index_System/Index_Publish_Spec.md V1.1 Patch
 * 
 * 功能：
 * - 口径身份证卡片 (ReleaseContext)
 * - 发布前检查 (PrePublishCheck)
 * - 影响评估 (冻结机制说明)
 * - 发布策略选择
 * - 发布执行进度 (含 STR 写回)
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Button, Tag, Steps, Progress, Alert, Descriptions,
  Modal, Radio, Input, Timeline, Statistic, Tooltip, message
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  RocketOutlined, ClockCircleOutlined, SyncOutlined,
  CheckOutlined, LoadingOutlined, WarningOutlined
} from '@ant-design/icons';
import { GoldenPage } from '@/components/golden';

// 发布口径身份证
interface ReleaseContext {
  libraryVersionCode: string;
  mappingSnapshotVersion: number;
  scaleSnapshotVersion: number;
  stage: 'ESTIMATE' | 'TENDER' | 'SETTLEMENT';
  priceBaseDate: string;
  indexType: 'construction' | 'material' | 'labor';
  outlierMethod: 'iqr' | 'zscore' | 'empirical';
  minSampleCount: number;
  regionLevel: 'province' | 'city' | 'district';
  defaultRegionKey?: string;
  dataWindow: { start: string; end: string };
}

// 发布前检查
interface PrePublishCheck {
  prerequisites: {
    hasApproval: boolean;
    hasPriceBaseDate: boolean;
    priceIndexCoverageOk: boolean;
    noBlockingIssues: boolean;
  };
  impactAssessment: {
    activeEstimations: number;
    affectedUsers: number;
    majorChanges: string[];
  };
  recommendation: 'proceed' | 'delay' | 'abort';
  releaseContext: ReleaseContext;
}

// 发布步骤
interface PublishStep {
  key: string;
  title: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  description?: string;
  detail?: string;
}

// Mock 数据
const mockPrecheck: PrePublishCheck = {
  prerequisites: {
    hasApproval: true,
    hasPriceBaseDate: true,
    priceIndexCoverageOk: false, // 触发警告
    noBlockingIssues: true,
  },
  impactAssessment: {
    activeEstimations: 12,
    affectedUsers: 5,
    majorChanges: [
      '新增 85 个指标',
      '更新 320 个指标的 P50 值',
      '删除 12 个低质量指标',
    ],
  },
  recommendation: 'proceed',
  releaseContext: {
    libraryVersionCode: 'V2026Q1',
    mappingSnapshotVersion: 3,
    scaleSnapshotVersion: 2,
    stage: 'ESTIMATE',
    priceBaseDate: '2026-01',
    indexType: 'construction',
    outlierMethod: 'iqr',
    minSampleCount: 3,
    regionLevel: 'city',
    defaultRegionKey: '四川-成都',
    dataWindow: { start: '2023-01', end: '2025-12' },
  },
};

const mockPublishSteps: PublishStep[] = [
  { key: '1', title: '固化版本状态', status: 'finish', description: 'approved → published' },
  { key: '2', title: '写回 STR', status: 'process', description: '写入标准目标范围表', detail: '1180/1250 (94%)' },
  { key: '3', title: '刷新缓存', status: 'wait', description: '更新版本指针' },
  { key: '4', title: '归档旧版本', status: 'wait', description: '切换指针' },
  { key: '5', title: '通知与日志', status: 'wait', description: '发送通知' },
];

export default function PublishConsolePage() {
  const { versionId } = useParams<{ versionId: string }>();
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);
  const [publishSteps, setPublishSteps] = useState<PublishStep[]>([]);
  const [publishStrategy, setPublishStrategy] = useState<'immediate' | 'scheduled'>('immediate');
  const [publishNote, setPublishNote] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const precheck = mockPrecheck;
  const ctx = precheck.releaseContext;

  // 检查项状态图标
  const getCheckIcon = (passed: boolean, warning?: boolean) => {
    if (passed && !warning) return <CheckCircleOutlined className="text-green-500" />;
    if (warning) return <ExclamationCircleOutlined className="text-orange-500" />;
    return <CloseCircleOutlined className="text-red-500" />;
  };

  // 开始发布
  const handleStartPublish = () => {
    setConfirmModalOpen(false);
    setPublishing(true);
    setPublishSteps(mockPublishSteps);
    
    // 模拟发布进度
    setTimeout(() => {
      setPublishSteps(steps => steps.map(s => 
        s.key === '2' ? { ...s, status: 'finish', detail: '1250/1250 (100%)' } :
        s.key === '3' ? { ...s, status: 'process' } : s
      ));
    }, 2000);

    setTimeout(() => {
      setPublishSteps(steps => steps.map(s => 
        s.key === '3' ? { ...s, status: 'finish' } :
        s.key === '4' ? { ...s, status: 'process' } : s
      ));
    }, 3000);

    setTimeout(() => {
      setPublishSteps(steps => steps.map(s => ({ ...s, status: 'finish' })));
      message.success('发布成功！');
    }, 4500);
  };

  // 获取步骤图标
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'finish': return <CheckOutlined />;
      case 'process': return <LoadingOutlined />;
      case 'error': return <CloseCircleOutlined />;
      default: return undefined;
    }
  };

  return (
    <GoldenPage
      header={{
        title: '发布控制台',
        subtitle: `版本 V2026.01`,
        showBack: true,
        backPath: '/publish/versions',
        breadcrumbs: [
          { title: '指标系统', path: '/indexes/list' },
          { title: '版本管理', path: '/publish/versions' },
          { title: '发布控制台' },
        ],
        actions: publishing ? [] : [
          { 
            key: 'publish', 
            label: '执行发布', 
            type: 'primary', 
            icon: <RocketOutlined />,
            onClick: () => setConfirmModalOpen(true),
          },
        ],
      }}
    >
      {/* 口径身份证卡片 - V1.1 MUST */}
      <Card title="📋 口径身份证 (Release Context)" size="small" className="mb-4">
        <div className="grid grid-cols-4 gap-4">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="标准库版本">
              <Tag color="blue">{ctx.libraryVersionCode}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="映射快照">v{ctx.mappingSnapshotVersion}</Descriptions.Item>
            <Descriptions.Item label="规模分档快照">v{ctx.scaleSnapshotVersion}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="阶段">
              <Tag color={ctx.stage === 'ESTIMATE' ? 'blue' : ctx.stage === 'TENDER' ? 'orange' : 'purple'}>
                {ctx.stage}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格基准期">
              <span className="text-lg font-bold text-blue-600">{ctx.priceBaseDate}</span>
            </Descriptions.Item>
            <Descriptions.Item label="指数类型">{ctx.indexType}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="异常法">{ctx.outlierMethod.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="最小样本数">{ctx.minSampleCount}</Descriptions.Item>
            <Descriptions.Item label="区域层级">{ctx.regionLevel}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="默认区域">{ctx.defaultRegionKey || '-'}</Descriptions.Item>
            <Descriptions.Item label="数据窗">
              {ctx.dataWindow.start} ~ {ctx.dataWindow.end}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 发布前检查 - V1.1 MUST */}
        <Card title="🔍 发布前检查 (PrePublishCheck)" size="small">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>已通过审核</span>
              {getCheckIcon(precheck.prerequisites.hasApproval)}
            </div>
            <div className="flex items-center justify-between">
              <span>价格基准期已设置</span>
              {getCheckIcon(precheck.prerequisites.hasPriceBaseDate)}
            </div>
            <div className="flex items-center justify-between">
              <Tooltip title="缺指数导致排除样本比例 > 20%">
                <span>指数覆盖率</span>
              </Tooltip>
              {getCheckIcon(precheck.prerequisites.priceIndexCoverageOk, !precheck.prerequisites.priceIndexCoverageOk)}
            </div>
            <div className="flex items-center justify-between">
              <span>无阻断性问题</span>
              {getCheckIcon(precheck.prerequisites.noBlockingIssues)}
            </div>
          </div>

          {!precheck.prerequisites.priceIndexCoverageOk && (
            <Alert
              message="指数覆盖不足"
              description="缺指数导致排除样本比例 > 20%，可能导致指标质量下降。建议补齐指数表或缩小数据窗。"
              type="warning"
              showIcon
              className="mt-4"
            />
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">建议操作：</span>
              <Tag color={precheck.recommendation === 'proceed' ? 'green' : precheck.recommendation === 'delay' ? 'orange' : 'red'}>
                {precheck.recommendation === 'proceed' ? '可以发布' : precheck.recommendation === 'delay' ? '建议延迟' : '建议终止'}
              </Tag>
            </div>
          </div>
        </Card>

        {/* 影响评估 - V1.1 MUST */}
        <Card title="📊 影响评估" size="small">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Statistic 
              title="进行中的估算" 
              value={precheck.impactAssessment.activeEstimations} 
              suffix="个"
              valueStyle={{ color: precheck.impactAssessment.activeEstimations > 0 ? '#faad14' : '#52c41a' }}
            />
            <Statistic 
              title="影响用户数" 
              value={precheck.impactAssessment.affectedUsers} 
              suffix="人"
            />
          </div>

          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-2">主要变更：</div>
            <ul className="list-disc list-inside text-sm">
              {precheck.impactAssessment.majorChanges.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>

          {/* 冻结机制说明 - V1.1 MUST */}
          <Alert
            message="冻结机制说明"
            description={
              <div className="text-sm">
                <p className="mb-1">• 进行中的估算将继续使用其已绑定的指标版本，不随本次发布自动切换。</p>
                <p>• 新建估算默认使用新发布版本；如需升级，必须在估算侧显式执行"升级版本"。</p>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      </div>

      {/* 发布策略 */}
      {!publishing && (
        <Card title="🚀 发布策略" size="small" className="mb-4">
          <div className="flex items-center gap-8">
            <Radio.Group value={publishStrategy} onChange={(e) => setPublishStrategy(e.target.value)}>
              <Radio value="immediate">
                <span className="flex items-center gap-1">
                  <RocketOutlined /> 立即发布
                </span>
              </Radio>
              <Radio value="scheduled">
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined /> 定时发布
                </span>
              </Radio>
            </Radio.Group>
          </div>
          <div className="mt-4">
            <div className="text-gray-500 text-sm mb-2">发布说明：</div>
            <Input.TextArea 
              value={publishNote}
              onChange={(e) => setPublishNote(e.target.value)}
              placeholder="输入本次发布的说明（可选）"
              rows={2}
            />
          </div>
        </Card>
      )}

      {/* 发布执行进度 - V1.1 MUST */}
      {publishing && (
        <Card title="📈 发布执行进度" size="small">
          <Steps
            direction="vertical"
            current={publishSteps.findIndex(s => s.status === 'process')}
            items={publishSteps.map(step => ({
              title: step.title,
              description: (
                <div>
                  <div>{step.description}</div>
                  {step.detail && (
                    <div className="text-blue-600 font-medium">{step.detail}</div>
                  )}
                </div>
              ),
              status: step.status,
              icon: getStepIcon(step.status),
            }))}
          />

          {/* STR 写回统计 */}
          {publishSteps.find(s => s.key === '2')?.status !== 'wait' && (
            <Card size="small" className="mt-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-medium">STR 写回统计</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-600">成功: 1250</span>
                  <span className="text-red-600">失败: 0</span>
                </div>
              </div>
              <Progress percent={100} status="success" className="mt-2" />
            </Card>
          )}

          {publishSteps.every(s => s.status === 'finish') && (
            <div className="mt-4 text-center">
              <Button type="primary" onClick={() => navigate('/publish/versions')}>
                返回版本列表
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* 确认发布弹窗 */}
      <Modal
        title="确认发布"
        open={confirmModalOpen}
        onOk={handleStartPublish}
        onCancel={() => setConfirmModalOpen(false)}
        okText="确认发布"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="发布确认"
          description={
            <div>
              <p>您即将发布版本 <strong>V2026.01</strong>，请确认以下信息：</p>
              <ul className="list-disc list-inside mt-2">
                <li>价格基准期：<strong>{ctx.priceBaseDate}</strong></li>
                <li>阶段：<strong>{ctx.stage}</strong></li>
                <li>影响进行中估算：<strong>{precheck.impactAssessment.activeEstimations}</strong> 个</li>
              </ul>
              <p className="mt-2 text-orange-600">
                ⚠️ 发布后将写回 STR，进行中的估算不受影响。
              </p>
            </div>
          }
          type="warning"
          showIcon
        />
      </Modal>
    </GoldenPage>
  );
}
