import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Progress, Result, Button, Space } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface AnalyzeModalProps {
  open: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

type AnalyzeStep = 'config' | 'progress' | 'result';

const AnalyzeModal: React.FC<AnalyzeModalProps> = ({ open, record, onCancel, onSuccess }) => {
  const [step, setStep] = useState<AnalyzeStep>('config');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  // 分析选项
  const [analyzeOptions, setAnalyzeOptions] = useState({
    materialStd: true,
    boqStd: true,
    indexCalc: true,
  });

  // 单位工程选择
  const [selectedUnits, setSelectedUnits] = useState<string[]>([
    'unit-001', 'unit-002', 'unit-003', 'unit-004', 'unit-005', 'unit-006'
  ]);

  const unitProjects = [
    { id: 'unit-001', name: '门诊楼 - 土建工程' },
    { id: 'unit-002', name: '门诊楼 - 装饰工程' },
    { id: 'unit-003', name: '门诊楼 - 安装工程' },
    { id: 'unit-004', name: '附属用房 - 配电房' },
    { id: 'unit-005', name: '附属用房 - 水泵房' },
    { id: 'unit-006', name: '附属用房 - 门卫室' },
  ];

  // 分析任务状态
  const [taskStatus, setTaskStatus] = useState({
    materialStd: 'waiting' as 'waiting' | 'running' | 'done',
    boqStd: 'waiting' as 'waiting' | 'running' | 'done',
    indexCalc: 'waiting' as 'waiting' | 'running' | 'done',
  });

  // 分析结果
  const [result, setResult] = useState({
    materialCount: 0,
    materialMatched: 0,
    boqCount: 0,
    boqMatched: 0,
    unitCost: 0,
    steelContent: 0,
  });

  useEffect(() => {
    if (open) {
      setStep('config');
      setProgress(0);
      setTaskStatus({
        materialStd: 'waiting',
        boqStd: 'waiting',
        indexCalc: 'waiting',
      });
    }
  }, [open]);

  const handleStartAnalyze = () => {
    setStep('progress');
    setAnalyzing(true);
    setProgress(0);

    // 模拟分析过程
    const tasks = [
      { key: 'materialStd', name: '材料标准化', duration: 1500 },
      { key: 'boqStd', name: '清单标准化', duration: 2000 },
      { key: 'indexCalc', name: '指标计算', duration: 1000 },
    ];

    let currentProgress = 0;
    let taskIndex = 0;

    const runTask = () => {
      if (taskIndex >= tasks.length) {
        setAnalyzing(false);
        setProgress(100);
        setResult({
          materialCount: 1256,
          materialMatched: 1180,
          boqCount: 1340,
          boqMatched: 1285,
          unitCost: 3256,
          steelContent: 58.6,
        });
        setStep('result');
        return;
      }

      const task = tasks[taskIndex];
      setCurrentTask(task.name);
      setTaskStatus((prev) => ({ ...prev, [task.key]: 'running' }));

      const progressIncrement = 100 / tasks.length;
      const intervalTime = task.duration / 10;

      let localProgress = 0;
      const interval = setInterval(() => {
        localProgress += 10;
        currentProgress = (taskIndex * progressIncrement) + (localProgress / 100) * progressIncrement;
        setProgress(Math.min(Math.round(currentProgress), 99));

        if (localProgress >= 100) {
          clearInterval(interval);
          setTaskStatus((prev) => ({ ...prev, [task.key]: 'done' }));
          taskIndex++;
          runTask();
        }
      }, intervalTime);
    };

    runTask();
  };

  const handleCancel = () => {
    if (!analyzing) {
      onCancel();
    }
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'running':
        return <LoadingOutlined className="text-blue-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-400" />;
    }
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return '完成';
      case 'running':
        return '进行中';
      default:
        return '等待中';
    }
  };

  const renderConfig = () => (
    <div className="space-y-6">
      {/* 分析范围 */}
      <div className="border rounded p-4">
        <div className="font-medium mb-3">分析范围</div>
        <Checkbox
          checked={selectedUnits.length === unitProjects.length}
          indeterminate={selectedUnits.length > 0 && selectedUnits.length < unitProjects.length}
          onChange={(e) => {
            setSelectedUnits(e.target.checked ? unitProjects.map((u) => u.id) : []);
          }}
        >
          全部单位工程 ({unitProjects.length}个)
        </Checkbox>
        <div className="mt-3 ml-6 space-y-2">
          {unitProjects.map((unit) => (
            <div key={unit.id}>
              <Checkbox
                checked={selectedUnits.includes(unit.id)}
                onChange={(e) => {
                  setSelectedUnits(
                    e.target.checked
                      ? [...selectedUnits, unit.id]
                      : selectedUnits.filter((id) => id !== unit.id)
                  );
                }}
              >
                {unit.name}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* 分析内容 */}
      <div className="border rounded p-4">
        <div className="font-medium mb-3">分析内容</div>
        <div className="space-y-2">
          <Checkbox
            checked={analyzeOptions.materialStd}
            onChange={(e) => setAnalyzeOptions({ ...analyzeOptions, materialStd: e.target.checked })}
          >
            材料标准化（材料名称 → SMLCode + ParamMap）
          </Checkbox>
          <Checkbox
            checked={analyzeOptions.boqStd}
            onChange={(e) => setAnalyzeOptions({ ...analyzeOptions, boqStd: e.target.checked })}
          >
            清单标准化（清单项 → SBoQCode + FeatureMap）
          </Checkbox>
          <Checkbox
            checked={analyzeOptions.indexCalc}
            onChange={(e) => setAnalyzeOptions({ ...analyzeOptions, indexCalc: e.target.checked })}
          >
            指标计算（生成经济指标、工程量指标）
          </Checkbox>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Progress type="circle" percent={progress} />
        <div className="mt-4 text-gray-500">
          {analyzing ? `正在${currentTask}...` : '分析完成'}
        </div>
      </div>

      <div className="border rounded p-4">
        <div className="space-y-3">
          {analyzeOptions.materialStd && (
            <div className="flex items-center justify-between">
              <Space>
                {getTaskIcon(taskStatus.materialStd)}
                <span>材料标准化</span>
              </Space>
              <span className="text-gray-500">{getTaskStatusText(taskStatus.materialStd)}</span>
            </div>
          )}
          {analyzeOptions.boqStd && (
            <div className="flex items-center justify-between">
              <Space>
                {getTaskIcon(taskStatus.boqStd)}
                <span>清单标准化</span>
              </Space>
              <span className="text-gray-500">{getTaskStatusText(taskStatus.boqStd)}</span>
            </div>
          )}
          {analyzeOptions.indexCalc && (
            <div className="flex items-center justify-between">
              <Space>
                {getTaskIcon(taskStatus.indexCalc)}
                <span>指标计算</span>
              </Space>
              <span className="text-gray-500">{getTaskStatusText(taskStatus.indexCalc)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <Result
      status="success"
      title="分析完成"
      subTitle={
        <div className="text-left mt-4 space-y-4">
          <div className="border rounded p-4">
            <div className="font-medium mb-2">材料标准化</div>
            <div className="text-gray-600">
              共 {result.materialCount.toLocaleString()} 条材料
              <br />
              自动匹配：{result.materialMatched.toLocaleString()} 条 ({Math.round(result.materialMatched / result.materialCount * 100)}%)
              <br />
              待人工确认：{(result.materialCount - result.materialMatched).toLocaleString()} 条
            </div>
          </div>
          <div className="border rounded p-4">
            <div className="font-medium mb-2">清单标准化</div>
            <div className="text-gray-600">
              共 {result.boqCount.toLocaleString()} 条清单
              <br />
              自动匹配：{result.boqMatched.toLocaleString()} 条 ({Math.round(result.boqMatched / result.boqCount * 100)}%)
              <br />
              待人工确认：{(result.boqCount - result.boqMatched).toLocaleString()} 条
            </div>
          </div>
          <div className="border rounded p-4">
            <div className="font-medium mb-2">指标计算</div>
            <div className="text-gray-600">
              单方造价：{result.unitCost.toLocaleString()} 元/m²
              <br />
              钢筋含量：{result.steelContent} kg/m²
            </div>
          </div>
        </div>
      }
    />
  );

  return (
    <Modal
      title={`分析造价文件 - ${record?.projectName || ''}`}
      open={open}
      onCancel={handleCancel}
      width={600}
      maskClosable={!analyzing}
      closable={!analyzing}
      footer={
        step === 'config' ? (
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button
              type="primary"
              onClick={handleStartAnalyze}
              disabled={selectedUnits.length === 0}
            >
              开始分析
            </Button>
          </Space>
        ) : step === 'progress' ? (
          <Button onClick={handleCancel} disabled={analyzing}>
            {analyzing ? '分析中...' : '取消'}
          </Button>
        ) : (
          <Space>
            <Button onClick={handleCancel}>查看详情</Button>
            <Button type="primary" onClick={onSuccess}>
              完成
            </Button>
          </Space>
        )
      }
    >
      {step === 'config' && renderConfig()}
      {step === 'progress' && renderProgress()}
      {step === 'result' && renderResult()}
    </Modal>
  );
};

export default AnalyzeModal;
