# 性能规范 (Performance Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：07_Technical

---

## 1. 概述

### 1.1 目的
性能规范定义了系统的性能目标、优化策略和监控方案，确保：
- 系统响应快速流畅
- 资源利用高效合理
- 高并发场景稳定可靠
- 性能问题可预警可追溯

### 1.2 性能目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 页面加载 | < 3秒 | 首次内容绘制(FCP) |
| API响应 | < 500ms | P95响应时间 |
| 并发用户 | 500+ | 同时在线用户 |
| 可用性 | 99.9% | 年度可用性目标 |
| 吞吐量 | 1000 QPS | 每秒请求数 |

---

## 2. 前端性能

### 2.1 核心指标

| 指标 | 目标 | 说明 |
|------|------|------|
| FCP | < 1.8s | 首次内容绘制 |
| LCP | < 2.5s | 最大内容绘制 |
| FID | < 100ms | 首次输入延迟 |
| CLS | < 0.1 | 累积布局偏移 |
| TTI | < 3.8s | 可交互时间 |

### 2.2 资源优化

**代码分割：**
```typescript
// 路由级代码分割
const ProjectList = lazy(() => import('./pages/ProjectList'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const routes = [
  {
    path: '/projects',
    element: (
      <Suspense fallback={<Loading />}>
        <ProjectList />
      </Suspense>
    ),
  },
];

// 组件级代码分割
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

**资源预加载：**
```html
<!-- 关键资源预加载 -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/api/v1/user/info" as="fetch" crossorigin>

<!-- 路由预加载 -->
<link rel="prefetch" href="/static/js/project-detail.chunk.js">

<!-- DNS预解析 -->
<link rel="dns-prefetch" href="//api.example.com">
<link rel="preconnect" href="//api.example.com">
```

**图片优化：**
```typescript
// 图片懒加载
<img 
  src={placeholder}
  data-src={actualImage}
  loading="lazy"
  alt="项目图片"
/>

// 响应式图片
<picture>
  <source media="(min-width: 1200px)" srcSet="/images/large.webp" type="image/webp" />
  <source media="(min-width: 768px)" srcSet="/images/medium.webp" type="image/webp" />
  <img src="/images/small.jpg" alt="项目图片" />
</picture>
```

### 2.3 渲染优化

**虚拟列表：**
```typescript
import { FixedSizeList } from 'react-window';

function ProjectList({ projects }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProjectCard project={projects[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={projects.length}
      itemSize={80}
    >
      {Row}
    </FixedSizeList>
  );
}
```

**避免不必要的重渲染：**
```typescript
// 使用React.memo
const ProjectCard = React.memo(({ project, onSelect }) => {
  return (
    <div onClick={() => onSelect(project.id)}>
      <h3>{project.projectName}</h3>
      <p>{project.totalArea} m²</p>
    </div>
  );
});

// 使用useMemo缓存计算结果
function ProjectAnalysis({ projects }) {
  const statistics = useMemo(() => {
    return {
      totalArea: projects.reduce((sum, p) => sum + p.totalArea, 0),
      totalCost: projects.reduce((sum, p) => sum + p.totalCost, 0),
      avgUnitCost: projects.reduce((sum, p) => sum + p.unitCost, 0) / projects.length,
    };
  }, [projects]);

  return <Statistics data={statistics} />;
}

// 使用useCallback缓存函数
function ProjectForm({ onSubmit }) {
  const [form] = Form.useForm();
  
  const handleSubmit = useCallback(async (values) => {
    await onSubmit(values);
    form.resetFields();
  }, [onSubmit, form]);

  return <Form form={form} onFinish={handleSubmit} />;
}
```

### 2.4 打包优化

**Webpack配置：**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库单独打包
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        // UI组件库单独打包
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: 'antd',
          priority: 20,
        },
        // 图表库单独打包
        echarts: {
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: 'echarts',
          priority: 20,
        },
      },
    },
    // 开启Tree Shaking
    usedExports: true,
    // 压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
```

**Bundle分析：**
```bash
# 分析打包大小
npm run build -- --analyze

# 目标：
# - 首屏JS < 200KB (gzip)
# - 首屏CSS < 50KB (gzip)
# - 单个chunk < 500KB
```

---

## 3. 后端性能

### 3.1 API响应时间

| 接口类型 | P50 | P95 | P99 |
|----------|-----|-----|-----|
| 简单查询 | < 50ms | < 100ms | < 200ms |
| 列表查询 | < 100ms | < 300ms | < 500ms |
| 复杂计算 | < 500ms | < 1s | < 2s |
| 导入导出 | 异步 | 异步 | 异步 |

### 3.2 数据库优化

**查询优化：**
```sql
-- ✓ 使用索引
CREATE INDEX idx_project_status_type ON prj_project(status, project_type)
WHERE is_deleted = FALSE;

-- ✓ 只查询需要的字段
SELECT id, project_name, total_area, status
FROM prj_project
WHERE status = 'active'
LIMIT 20;

-- ✗ 避免SELECT *
SELECT * FROM prj_project;

-- ✓ 使用EXPLAIN分析
EXPLAIN ANALYZE
SELECT * FROM prj_project
WHERE project_type = 'YI' AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

**分页优化：**
```typescript
// ✗ 传统分页（大偏移量时性能差）
SELECT * FROM prj_project
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;

// ✓ 游标分页（推荐）
SELECT * FROM prj_project
WHERE created_at < '2026-01-01'  -- 上一页最后一条的时间
ORDER BY created_at DESC
LIMIT 20;

// ✓ 键集分页
SELECT * FROM prj_project
WHERE (created_at, id) < ('2026-01-01', 'last-id')
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

**N+1问题：**
```typescript
// ✗ N+1查询
const projects = await projectRepo.find();
for (const project of projects) {
  project.units = await unitRepo.find({ projectId: project.id });
}

// ✓ 使用JOIN或预加载
const projects = await projectRepo.find({
  relations: ['units'],
});

// ✓ 或使用DataLoader批量加载
const unitLoader = new DataLoader(async (projectIds) => {
  const units = await unitRepo.find({
    where: { projectId: In(projectIds) },
  });
  return projectIds.map(id => units.filter(u => u.projectId === id));
});
```

### 3.3 缓存策略

**缓存层次：**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              缓存层次                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  浏览器缓存  │ →  │   CDN缓存   │ →  │  Redis缓存  │ →  │   数据库    │ │
│  │  (客户端)   │    │  (边缘节点) │    │  (应用层)   │    │  (持久层)   │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘ │
│                                                                             │
│  缓存时间：长        缓存时间：中         缓存时间：短       无缓存         │
│  静态资源           API响应              业务数据                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Redis缓存实现：**
```typescript
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  // 缓存装饰器
  @Cacheable({ key: 'project:{id}', ttl: 300 })
  async getProject(id: string): Promise<Project> {
    return this.projectRepository.findOne(id);
  }

  // 手动缓存
  async getProjectList(query: QueryDto): Promise<Project[]> {
    const cacheKey = `projects:${JSON.stringify(query)}`;
    
    // 尝试从缓存获取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 查询数据库
    const data = await this.projectRepository.find(query);

    // 写入缓存
    await this.redis.setex(cacheKey, 300, JSON.stringify(data));

    return data;
  }

  // 缓存失效
  async invalidateProject(id: string): Promise<void> {
    await this.redis.del(`project:${id}`);
    // 清除列表缓存
    const keys = await this.redis.keys('projects:*');
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
```

**缓存策略配置：**

| 数据类型 | 缓存时间 | 失效策略 |
|----------|----------|----------|
| 用户信息 | 30分钟 | 修改时失效 |
| 标签字典 | 24小时 | 修改时失效 |
| 指标数据 | 1小时 | 版本发布时失效 |
| 列表查询 | 5分钟 | 数据变更时失效 |
| 统计数据 | 10分钟 | 定时刷新 |

### 3.4 异步处理

**消息队列：**
```typescript
// 生产者
@Injectable()
export class IndexCalculationService {
  constructor(
    @InjectQueue('calculation') private queue: Queue,
  ) {}

  async startCalculation(params: CalcParams): Promise<string> {
    const job = await this.queue.add('calculate', params, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
    return job.id;
  }
}

// 消费者
@Processor('calculation')
export class CalculationProcessor {
  @Process('calculate')
  async handleCalculation(job: Job<CalcParams>) {
    const { data } = job;
    
    // 更新进度
    await job.progress(10);
    
    // 执行计算
    const result = await this.calculate(data);
    
    await job.progress(100);
    return result;
  }
}
```

**长任务处理：**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              异步任务流程                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 提交任务              2. 返回任务ID             3. 轮询/WebSocket      │
│  ┌─────────┐             ┌─────────┐              ┌─────────┐             │
│  │  客户端  │ ──────────→│  服务端  │ ──────────→│  客户端  │             │
│  └─────────┘             └─────────┘              └─────────┘             │
│       │                       │                        ▲                   │
│       │                       │ 写入队列               │                   │
│       │                       ▼                        │ 查询状态          │
│       │                  ┌─────────┐                   │                   │
│       │                  │  队列   │                   │                   │
│       │                  └─────────┘                   │                   │
│       │                       │                        │                   │
│       │                       │ 消费处理               │                   │
│       │                       ▼                        │                   │
│       │                  ┌─────────┐                   │                   │
│       │                  │  Worker │ ──────────────────┘                   │
│       │                  └─────────┘   更新状态/推送                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 数据库性能

### 4.1 连接池配置

```yaml
# 连接池配置
database:
  pool:
    min: 10              # 最小连接数
    max: 50              # 最大连接数
    acquireTimeout: 30000   # 获取连接超时
    idleTimeout: 600000     # 空闲超时
    connectionTimeout: 10000  # 连接超时
```

### 4.2 慢查询监控

```sql
-- 开启慢查询日志
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- 1秒

-- 查看慢查询
SELECT 
  query,
  calls,
  mean_time,
  max_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

### 4.3 表分区

```sql
-- 按时间分区（大数据量表）
CREATE TABLE log_operation (
    id VARCHAR(36),
    action VARCHAR(50),
    created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- 自动创建分区
CREATE OR REPLACE FUNCTION create_partition_if_not_exists()
RETURNS TRIGGER AS $$
DECLARE
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    partition_name := 'log_operation_' || to_char(NEW.created_at, 'YYYY_MM');
    start_date := date_trunc('month', NEW.created_at);
    end_date := start_date + interval '1 month';
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = partition_name) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF log_operation FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 4.4 读写分离

```typescript
// 读写分离配置
@Module({
  imports: [
    TypeOrmModule.forRoot({
      replication: {
        master: {
          host: 'master.db.example.com',
          port: 5432,
          username: 'master_user',
          password: 'master_pass',
          database: 'cost_index',
        },
        slaves: [
          {
            host: 'slave1.db.example.com',
            port: 5432,
            username: 'slave_user',
            password: 'slave_pass',
            database: 'cost_index',
          },
          {
            host: 'slave2.db.example.com',
            port: 5432,
            username: 'slave_user',
            password: 'slave_pass',
            database: 'cost_index',
          },
        ],
      },
    }),
  ],
})
export class DatabaseModule {}
```

---

## 5. 性能监控

### 5.1 监控指标

**应用层指标：**

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| QPS | 每秒请求数 | - |
| RT | 响应时间 | P95 > 1s |
| Error Rate | 错误率 | > 1% |
| Throughput | 吞吐量 | - |

**系统层指标：**

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| CPU | CPU使用率 | > 80% |
| Memory | 内存使用率 | > 85% |
| Disk I/O | 磁盘IO | > 80% |
| Network | 网络流量 | - |

**数据库指标：**

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| Connections | 连接数 | > 80% max |
| Query Time | 查询时间 | > 1s |
| Lock Wait | 锁等待 | > 100ms |
| Buffer Hit | 缓存命中率 | < 95% |

### 5.2 监控实现

**Prometheus指标收集：**
```typescript
// 自定义指标
import { Counter, Histogram, Gauge } from 'prom-client';

// 请求计数
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

// 响应时间
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

// 在线用户数
const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
});

// 中间件
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestsTotal.inc({ method: req.method, path: req.path, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, path: req.path }, duration);
  });
  
  next();
});
```

**Grafana仪表盘：**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           系统监控仪表盘                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    QPS      │  │     RT      │  │  Error Rate │  │   CPU       │       │
│  │   1,234     │  │   125ms     │  │    0.1%     │  │    45%      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  请求量趋势                                                          │   │
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                       │   │
│  │  00:00    04:00    08:00    12:00    16:00    20:00    24:00       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────┐ ┌────────────────────────────────┐    │
│  │  响应时间分布                   │ │  错误类型分布                   │    │
│  │  P50: 45ms                     │ │  400: 45%                      │    │
│  │  P95: 125ms                    │ │  500: 30%                      │    │
│  │  P99: 280ms                    │ │  502: 25%                      │    │
│  └────────────────────────────────┘ └────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 告警配置

```yaml
# Prometheus告警规则
groups:
  - name: api-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "高错误率告警"
          description: "错误率超过1%，当前值: {{ $value }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "高延迟告警"
          description: "P95响应时间超过1秒，当前值: {{ $value }}s"

      - alert: HighCPU
        expr: node_cpu_seconds_total > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "CPU使用率过高"
```

---

## 6. 压力测试

### 6.1 测试场景

| 场景 | 并发数 | 持续时间 | 目标 |
|------|--------|----------|------|
| 基准测试 | 10 | 1分钟 | 确定基准性能 |
| 负载测试 | 100 | 10分钟 | 正常负载性能 |
| 压力测试 | 500 | 30分钟 | 极限负载性能 |
| 稳定性测试 | 200 | 2小时 | 长时间稳定性 |

### 6.2 测试脚本

```javascript
// k6压测脚本
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // 预热
    { duration: '5m', target: 200 },  // 加压
    { duration: '10m', target: 200 }, // 稳定
    { duration: '2m', target: 0 },    // 降压
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // 项目列表接口
  const listRes = http.get('http://api.example.com/api/v1/projects?page=1&pageSize=20');
  check(listRes, {
    'list status is 200': (r) => r.status === 200,
    'list response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // 项目详情接口
  const detailRes = http.get('http://api.example.com/api/v1/projects/proj-001');
  check(detailRes, {
    'detail status is 200': (r) => r.status === 200,
    'detail response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

### 6.3 测试报告

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           压力测试报告                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  测试场景：负载测试                                                          │
│  测试时间：2026-01-17 10:00 - 10:30                                         │
│  并发用户：200                                                               │
│                                                                             │
│  ┌─ 总体指标 ───────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  总请求数：    125,000                                                │  │
│  │  成功率：      99.8%                                                  │  │
│  │  平均QPS：     694                                                    │  │
│  │  平均RT：      85ms                                                   │  │
│  │  P95 RT：      180ms                                                  │  │
│  │  P99 RT：      350ms                                                  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ 接口明细 ───────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  接口               │ 请求数  │ 成功率 │ Avg RT │ P95 RT │           │  │
│  │  ──────────────────┼────────┼───────┼───────┼────────│           │  │
│  │  GET /projects     │ 65,000 │ 99.9% │  95ms │  200ms │ ✓         │  │
│  │  GET /projects/:id │ 60,000 │ 99.7% │  75ms │  160ms │ ✓         │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  结论：系统在200并发下性能表现良好，各项指标均在目标范围内。                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. 性能优化清单

### 7.1 前端优化清单

- [ ] 代码分割和懒加载
- [ ] 图片压缩和懒加载
- [ ] 静态资源CDN
- [ ] 启用Gzip/Brotli压缩
- [ ] 资源预加载
- [ ] Service Worker缓存
- [ ] 虚拟列表
- [ ] 避免不必要的重渲染

### 7.2 后端优化清单

- [ ] 数据库索引优化
- [ ] SQL查询优化
- [ ] 分页查询优化
- [ ] Redis缓存
- [ ] 异步任务队列
- [ ] 连接池配置
- [ ] 读写分离
- [ ] 接口限流

### 7.3 基础设施清单

- [ ] 负载均衡
- [ ] 自动伸缩
- [ ] 数据库主从复制
- [ ] 分布式缓存
- [ ] CDN配置
- [ ] 日志和监控
- [ ] 告警配置

---

## 8. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |