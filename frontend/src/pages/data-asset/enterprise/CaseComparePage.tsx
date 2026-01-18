import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Radio,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  ExportOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 案例数据类型
interface CompareCase {
  caseId: string;
  caseName: string;
  buildingArea: number;
  unitCost: number;
  functionTag: string;
  scaleLevel: string;
}

// 对比指标类型
interface CompareIndex {
  indexCode: string;
  indexName: string;
  indexUnit: string;
  values: number[];
  average: number;
  deviations: number[];
}

// 模拟对比数据
const mockCases: CompareCase[] = [
  {
    caseId: 'EC202506001',
    caseName: '深圳某办公楼项目',
    buildingArea: 8500,
    unitCost: 4200,
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
  },
  {
    caseId: 'EC202508002',
    caseName: '东莞某办公楼项目',
    buildingArea: 9200,
    unitCost: 3980,
    functionTag: '办公建筑-乙级办公',
    scaleLevel: '5000-10000㎡',
  },
  {
    caseId: 'EC202511003',
    caseName: '珠海某办公楼项目',
    buildingArea: 6800,
    unitCost: 4050,
    functionTag: '办公建筑-甲级办公',
    scaleLevel: '5000-10000㎡',
  },
];

const mockCompareData: CompareIndex[] = [
  {
    indexCode: 'EC-001',
    indexName: '综合单方造价',
    indexUnit: '元/㎡',
    values: [4200, 3980, 4050],
    average: 4077,
    deviations: [3.0, -2.4, -0.7],
  },
  {
    indexCode: 'EC-002',
    indexName: '土建单方造价',
    indexUnit: '元/㎡',
    values: [2520, 2388, 2430],
    average: 2446,
    deviations: [3.0, -2.4, -0.7],
  },
  {
    indexCode: 'EC-003',
    indexName: '安装单方造价',
    indexUnit: '元/㎡',
    values: [1260, 1194, 1215],
    average: 1223,
    deviations: [3.0, -2.4, -0.7],
  },
  {
    indexCode: 'EC-004',
    indexName: '人工费占比',
    indexUnit: '%',
    values: [18.5, 19.2, 18.8],
    average: 18.8,
    deviations: [-1.6, 2.1, 0],
  },
  {
    indexCode: 'EC-005',
    indexName: '材料费占比',
    indexUnit: '%',
    values: [62.3, 61.5, 62.0],
    average: 61.9,
    deviations: [0.6, -0.6, 0.2],
  },
  {
    indexCode: 'EC-006',
    indexName: '钢筋含量',
    indexUnit: 'kg/㎡',
    values: [58.6, 55.2, 56.8],
    average: 56.9,
    deviations: [3.0, -3.0, -0.2],
  },
  {
    indexCode: 'EC-007',
    indexName: '混凝土含量',
    indexUnit: 'm³/㎡',
    values: [0.42, 0.40, 0.41],
    average: 0.41,
    deviations: [2.4, -2.4, 0],
  },
];

const CaseComparePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [compareType, setCompareType] = useState<string>('economic');
  const [selectedCases, setSelectedCases] = useState<CompareCase[]>(mockCases);

  // 从URL获取案例ID（实际应用中会根据ID获取数据）
  const caseIds = searchParams.get('ids')?.split(',') || [];

  // 移除案例
  const handleRemoveCase = (caseId: string) => {
    setSelectedCases(selectedCases.filter((c) => c.caseId !== caseId));
  };

  // 生成对比表格列
  const generateColumns = (): ColumnsType<CompareIndex> => {
    const columns: ColumnsType<CompareIndex> = [
      {
        title: '指标',
        dataIndex: 'indexName',
        key: 'indexName',
        width: 140,
        fixed: 'left',
      },
      {
        title: '单位',
        dataIndex: 'indexUnit',
        key: 'indexUnit',
        width: 80,
      },
    ];

    // 为每个案例添加列
    selectedCases.forEach((caseItem, index) => {
      columns.push({
        title: (
          <div className="text-center">
            <div className="font-medium truncate" style={{ maxWidth: 120 }}>
              {caseItem.caseName}
            </div>
            <div className="text-xs text-gray-400">{caseItem.buildingArea.toLocaleString()}㎡</div>
          </div>
        ),
        dataIndex: `value_${index}`,
        key: `value_${index}`,
        width: 140,
        align: 'center',
        render: (_, record) => {
          const value = record.values[index];
          const deviation = record.deviations[index];
          return (
            <div>
              <div className="font-medium">{value.toLocaleString()}</div>
              <div
                className="text-xs"
                style={{ color: deviation > 0 ? '#f5222d' : deviation < 0 ? '#52c41a' : '#999' }}
              >
                {deviation > 0 ? '↑' : deviation < 0 ? '↓' : ''}
                {deviation !== 0 ? `${Math.abs(deviation)}%` : '-'}
              </div>
            </div>
          );
        },
      });
    });

    // 添加平均值列
    columns.push({
      title: '平均值',
      dataIndex: 'average',
      key: 'average',
      width: 100,
      align: 'center',
      render: (val) => <span className="text-gray-500">{val.toLocaleString()}</span>,
    });

    return columns;
  };

  // 筛选指标数据
  const getFilteredData = () => {
    if (compareType === 'economic') {
      return mockCompareData.filter((d) =>
        ['EC-001', 'EC-002', 'EC-003', 'EC-004', 'EC-005'].includes(d.indexCode)
      );
    } else if (compareType === 'quantity') {
      return mockCompareData.filter((d) => ['EC-006', 'EC-007'].includes(d.indexCode));
    }
    return mockCompareData;
  };

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <span className="text-lg font-medium">案例对比分析</span>
          </Space>
          <Space>
            <Button icon={<ExportOutlined />}>导出对比报告</Button>
            <Button type="primary">保存方案</Button>
          </Space>
        </div>
      </Card>

      {/* 已选案例 */}
      <Card
        size="small"
        title={`已选案例 (${selectedCases.length}/5)`}
        extra={
          <Button size="small" onClick={() => setSelectedCases([])}>
            清空选择
          </Button>
        }
      >
        <div className="flex gap-4 flex-wrap">
          {selectedCases.map((caseItem) => (
            <div
              key={caseItem.caseId}
              className="border rounded-lg p-3 relative"
              style={{ width: 200 }}
            >
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                className="absolute top-1 right-1"
                onClick={() => handleRemoveCase(caseItem.caseId)}
              />
              <div className="font-medium truncate pr-6">{caseItem.caseName}</div>
              <div className="text-sm text-gray-500">
                {caseItem.buildingArea.toLocaleString()}㎡ | ¥{caseItem.unitCost.toLocaleString()}
              </div>
              <Tag className="mt-1" color="blue">
                {caseItem.scaleLevel}
              </Tag>
            </div>
          ))}
          {selectedCases.length < 5 && (
            <div
              className="border border-dashed rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-blue-400"
              style={{ width: 200, height: 88 }}
              onClick={() => navigate('/data-asset/enterprise/cases')}
            >
              <Space>
                <PlusOutlined />
                <span>添加案例</span>
              </Space>
            </div>
          )}
        </div>
      </Card>

      {/* 对比内容 */}
      {selectedCases.length >= 2 ? (
        <Card size="small">
          <div className="mb-4">
            <span className="mr-4">对比维度：</span>
            <Radio.Group value={compareType} onChange={(e) => setCompareType(e.target.value)}>
              <Radio.Button value="economic">经济指标</Radio.Button>
              <Radio.Button value="quantity">工程量指标</Radio.Button>
              <Radio.Button value="cost">造价构成</Radio.Button>
              <Radio.Button value="material">材料用量</Radio.Button>
            </Radio.Group>
          </div>

          {/* 对比表格 */}
          <Table
            rowKey="indexCode"
            columns={generateColumns()}
            dataSource={getFilteredData()}
            pagination={false}
            scroll={{ x: 800 }}
            size="small"
          />

          {/* 对比图表区域 */}
          <Row gutter={16} className="mt-6">
            <Col span={12}>
              <Card title="单方造价对比" size="small">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <div className="flex items-end justify-center gap-4 h-40">
                      {selectedCases.map((caseItem, index) => (
                        <div key={caseItem.caseId} className="text-center">
                          <div
                            className="w-16 bg-blue-500 rounded-t"
                            style={{
                              height: `${(caseItem.unitCost / 5000) * 100}%`,
                              minHeight: 20,
                            }}
                          />
                          <div className="text-xs mt-1 truncate w-16">
                            {caseItem.caseName.slice(0, 4)}
                          </div>
                          <div className="text-xs font-medium">¥{caseItem.unitCost}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      平均线: ¥{Math.round(selectedCases.reduce((s, c) => s + c.unitCost, 0) / selectedCases.length)}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="指标偏差分析" size="small">
                <div className="h-64 p-4">
                  {getFilteredData().slice(0, 5).map((item) => (
                    <div key={item.indexCode} className="flex items-center mb-3">
                      <div className="w-24 text-sm truncate">{item.indexName}</div>
                      <div className="flex-1 mx-2">
                        <div
                          className="h-4 bg-blue-500 rounded"
                          style={{
                            width: `${Math.min(Math.abs(item.deviations[0]) * 5, 100)}%`,
                            backgroundColor: item.deviations[0] > 0 ? '#f5222d' : '#52c41a',
                          }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm">
                        {item.deviations[0] > 0 ? '+' : ''}
                        {item.deviations[0]}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card>
          <Empty description="请至少选择2个案例进行对比分析" />
        </Card>
      )}
    </div>
  );
};

export default CaseComparePage;
