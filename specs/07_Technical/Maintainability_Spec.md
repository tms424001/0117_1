# 可维护性规范 (Maintainability Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：07_Technical

---

## 1. 概述

### 1.1 目的
可维护性规范定义了系统的代码规范、架构设计和工程实践标准，确保：
- 代码质量和可读性
- 系统的可扩展性
- 团队协作效率
- 长期维护成本可控

### 1.2 适用范围

| 范围 | 说明 |
|------|------|
| 前端代码 | React/TypeScript项目 |
| 后端代码 | Node.js/NestJS项目 |
| 数据库 | PostgreSQL脚本 |
| 配置文件 | YAML/JSON配置 |
| 文档 | 技术文档和注释 |

---

## 2. 代码规范

### 2.1 通用规范

**命名规范：**

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 | camelCase | projectName, totalArea |
| 常量 | UPPER_SNAKE_CASE | MAX_PAGE_SIZE, API_BASE_URL |
| 函数 | camelCase + 动词 | getProject, calculateIndex |
| 类/接口 | PascalCase | ProjectService, IUserRepository |
| 文件 | kebab-case / PascalCase | project-service.ts, ProjectList.tsx |
| 数据库 | snake_case | prj_project, total_area |

**注释规范：**
```typescript
/**
 * 计算造价指标
 * 
 * @description 根据样本数据计算指定维度的造价指标
 * @param samples - 样本数据列表
 * @param options - 计算选项
 * @returns 计算结果，包含统计值和推荐值
 * @throws {ValidationError} 样本数据不足时抛出
 * 
 * @example
 * const result = calculateIndex(samples, { outlierMethod: 'iqr' });
 */
function calculateIndex(samples: Sample[], options: CalcOptions): IndexResult {
  // 1. 数据预处理
  const validSamples = filterValidSamples(samples);
  
  // 2. 异常值剔除
  // 使用IQR方法识别并剔除异常值
  const cleanSamples = removeOutliers(validSamples, options.outlierMethod);
  
  // 3. 统计计算
  return computeStatistics(cleanSamples);
}
```

### 2.2 TypeScript规范

**类型定义：**
```typescript
// ✓ 使用interface定义对象类型
interface Project {
  id: string;
  projectName: string;
  totalArea: number;
  status: ProjectStatus;
}

// ✓ 使用type定义联合类型
type ProjectStatus = 'draft' | 'active' | 'archived';

// ✓ 使用enum定义常量集合
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// ✓ 避免any，使用unknown
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

// ✓ 使用泛型提高复用性
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

**空值处理：**
```typescript
// ✓ 使用可选链
const userName = user?.profile?.name;

// ✓ 使用空值合并
const pageSize = options.pageSize ?? 20;

// ✓ 使用类型守卫
function isProject(obj: unknown): obj is Project {
  return typeof obj === 'object' && obj !== null && 'projectName' in obj;
}
```

### 2.3 React规范

**组件结构：**
```typescript
// 组件文件结构
// src/components/ProjectList/
// ├── index.tsx          # 主组件
// ├── ProjectList.tsx    # 组件实现
// ├── ProjectList.types.ts   # 类型定义
// ├── ProjectList.styles.ts  # 样式
// ├── ProjectList.test.tsx   # 测试
// └── hooks/             # 组件专用hooks
//     └── useProjectList.ts

// 组件实现示例
import React, { FC, useState, useCallback } from 'react';
import { ProjectListProps, Project } from './ProjectList.types';
import { useProjectList } from './hooks/useProjectList';
import styles from './ProjectList.styles';

export const ProjectList: FC<ProjectListProps> = ({
  initialFilters,
  onSelect,
}) => {
  // 1. Hooks调用
  const { projects, loading, error, refetch } = useProjectList(initialFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 2. 事件处理
  const handleSelect = useCallback((project: Project) => {
    setSelectedId(project.id);
    onSelect?.(project);
  }, [onSelect]);

  // 3. 条件渲染
  if (loading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={refetch} />;
  if (!projects.length) return <Empty />;

  // 4. 主渲染
  return (
    <div className={styles.container}>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={project.id === selectedId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};
```

**Hooks规范：**
```typescript
// ✓ 自定义Hook命名以use开头
function useProjectList(filters: ProjectFilters) {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getProjects(filters);
      setData(result.list);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
```

### 2.4 后端规范

**模块结构：**
```
// NestJS模块结构
src/modules/project/
├── project.module.ts       # 模块定义
├── project.controller.ts   # 控制器
├── project.service.ts      # 服务层
├── project.repository.ts   # 数据访问层
├── dto/                    # 数据传输对象
│   ├── create-project.dto.ts
│   └── update-project.dto.ts
├── entities/               # 实体定义
│   └── project.entity.ts
├── interfaces/             # 接口定义
│   └── project.interface.ts
└── tests/                  # 测试文件
    ├── project.controller.spec.ts
    └── project.service.spec.ts
```

**服务层示例：**
```typescript
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly unitRepository: UnitRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 创建项目
   */
  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    // 1. 业务校验
    await this.validateProjectName(dto.projectName);

    // 2. 创建实体
    const project = this.projectRepository.create({
      ...dto,
      status: ProjectStatus.DRAFT,
      createdBy: userId,
    });

    // 3. 保存数据
    const saved = await this.projectRepository.save(project);

    // 4. 发布事件
    this.eventEmitter.emit('project.created', new ProjectCreatedEvent(saved));

    return saved;
  }

  /**
   * 分页查询项目
   */
  async findAll(query: ProjectQueryDto): Promise<PageResult<Project>> {
    const { page = 1, pageSize = 20, ...filters } = query;

    const [list, total] = await this.projectRepository.findAndCount({
      where: this.buildWhere(filters),
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
```

---

## 3. 架构规范

### 3.1 分层架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              前端应用层                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │  Pages  │  │Components│  │  Hooks  │  │ Stores  │  │Services │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
├─────────────────────────────────────────────────────────────────────────────┤
│                              API层                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                              后端应用层                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Controller│  │ Service │  │Repository│  │ Entity  │  │   DTO   │          │
│  │   层    │→ │    层   │→ │    层   │→ │   层    │  │   层    │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
├─────────────────────────────────────────────────────────────────────────────┤
│                              基础设施层                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                       │
│  │ Database│  │  Cache  │  │  Queue  │  │ Storage │                       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 职责划分

| 层级 | 职责 | 不应包含 |
|------|------|----------|
| Controller | 请求处理、参数校验、响应封装 | 业务逻辑 |
| Service | 业务逻辑、事务管理、权限检查 | SQL语句、HTTP调用 |
| Repository | 数据访问、查询构建 | 业务逻辑 |
| Entity | 数据结构定义、字段验证 | 业务逻辑 |
| DTO | 接口数据结构、参数校验 | 业务逻辑 |

### 3.3 依赖原则

```typescript
// ✓ 依赖抽象而非具体实现
interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  save(project: Project): Promise<Project>;
}

@Injectable()
class ProjectService {
  constructor(
    // 注入接口而非具体类
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}
}

// ✓ 使用依赖注入
@Module({
  providers: [
    ProjectService,
    {
      provide: 'IProjectRepository',
      useClass: PostgresProjectRepository,
    },
  ],
})
export class ProjectModule {}
```

---

## 4. 错误处理

### 4.1 错误分类

```typescript
// 基础错误类
abstract class AppError extends Error {
  abstract readonly code: number;
  abstract readonly httpStatus: number;
}

// 业务错误
class BusinessError extends AppError {
  readonly code: number;
  readonly httpStatus = 422;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

// 验证错误
class ValidationError extends AppError {
  readonly code = 30002;
  readonly httpStatus = 400;
  readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('参数校验失败');
    this.errors = errors;
  }
}

// 资源不存在
class NotFoundError extends AppError {
  readonly code = 40001;
  readonly httpStatus = 404;

  constructor(resource: string, id: string) {
    super(`${resource} ${id} 不存在`);
  }
}

// 权限错误
class ForbiddenError extends AppError {
  readonly code = 20003;
  readonly httpStatus = 403;

  constructor(message = '无权限访问') {
    super(message);
  }
}
```

### 4.2 错误处理策略

```typescript
// 全局异常过滤器
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let code = 10001;
    let message = '系统繁忙，请稍后重试';
    let errors: FieldError[] | undefined;

    if (exception instanceof AppError) {
      status = exception.httpStatus;
      code = exception.code;
      message = exception.message;
      if (exception instanceof ValidationError) {
        errors = exception.errors;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 记录日志
    this.logger.error({
      requestId: request.headers['x-request-id'],
      path: request.url,
      method: request.method,
      error: exception,
    });

    response.status(status).json({
      code,
      message,
      errors,
      timestamp: Date.now(),
      requestId: request.headers['x-request-id'],
    });
  }
}
```

### 4.3 前端错误处理

```typescript
// API错误处理
const request = async <T>(config: RequestConfig): Promise<T> => {
  try {
    const response = await axios(config);
    const { code, message, data } = response.data;

    if (code !== 0) {
      throw new ApiError(code, message);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // 业务错误处理
      handleBusinessError(error);
    } else if (axios.isAxiosError(error)) {
      // 网络错误处理
      handleNetworkError(error);
    }
    throw error;
  }
};

// 错误边界组件
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 上报错误
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
```

---

## 5. 日志规范

### 5.1 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| ERROR | 错误，需要关注 | 未捕获异常、服务调用失败 |
| WARN | 警告，可能的问题 | 参数异常、降级处理 |
| INFO | 重要业务信息 | 接口调用、关键操作 |
| DEBUG | 调试信息 | 变量值、执行流程 |

### 5.2 日志格式

```typescript
// 结构化日志
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  context: string;
  requestId?: string;
  userId?: string;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  extra?: Record<string, unknown>;
}

// 日志示例
{
  "timestamp": "2026-01-17T10:30:00.000Z",
  "level": "INFO",
  "message": "Project created",
  "context": "ProjectService",
  "requestId": "req-abc-123",
  "userId": "user-001",
  "duration": 150,
  "extra": {
    "projectId": "proj-001",
    "projectName": "XX医院"
  }
}
```

### 5.3 日志使用

```typescript
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const startTime = Date.now();

    this.logger.debug(`Creating project: ${dto.projectName}`);

    try {
      const project = await this.projectRepository.save(dto);

      this.logger.log({
        message: 'Project created',
        duration: Date.now() - startTime,
        extra: { projectId: project.id, projectName: project.projectName },
      });

      return project;
    } catch (error) {
      this.logger.error({
        message: 'Failed to create project',
        error,
        extra: { projectName: dto.projectName },
      });
      throw error;
    }
  }
}
```

---

## 6. 测试规范

### 6.1 测试分类

| 类型 | 目的 | 覆盖率要求 |
|------|------|------------|
| 单元测试 | 测试单个函数/类 | ≥80% |
| 集成测试 | 测试模块交互 | 关键流程 |
| E2E测试 | 测试完整功能 | 核心场景 |

### 6.2 单元测试

```typescript
// 服务测试示例
describe('ProjectService', () => {
  let service: ProjectService;
  let repository: MockType<ProjectRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useFactory: () => ({
            findOne: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(ProjectService);
    repository = module.get(ProjectRepository);
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      // Arrange
      const dto: CreateProjectDto = {
        projectName: 'Test Project',
        totalArea: 10000,
      };
      const userId = 'user-001';
      const expected = { id: 'proj-001', ...dto };

      repository.save.mockResolvedValue(expected);

      // Act
      const result = await service.create(dto, userId);

      // Assert
      expect(result).toEqual(expected);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: dto.projectName,
          createdBy: userId,
        }),
      );
    });

    it('should throw error when name is duplicate', async () => {
      // Arrange
      const dto: CreateProjectDto = { projectName: 'Existing', totalArea: 10000 };
      repository.findOne.mockResolvedValue({ id: 'existing' });

      // Act & Assert
      await expect(service.create(dto, 'user-001')).rejects.toThrow(
        BusinessError,
      );
    });
  });
});
```

### 6.3 组件测试

```typescript
// React组件测试
describe('ProjectList', () => {
  it('should render project list', async () => {
    // Arrange
    const projects = [
      { id: '1', projectName: 'Project A', totalArea: 10000 },
      { id: '2', projectName: 'Project B', totalArea: 20000 },
    ];
    jest.spyOn(api, 'getProjects').mockResolvedValue({ list: projects });

    // Act
    render(<ProjectList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    jest.spyOn(api, 'getProjects').mockReturnValue(new Promise(() => {}));

    render(<ProjectList />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should handle error', async () => {
    jest.spyOn(api, 'getProjects').mockRejectedValue(new Error('Network error'));

    render(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## 7. 配置管理

### 7.1 环境配置

```yaml
# config/default.yaml - 默认配置
app:
  name: cost-index-system
  port: 3000

database:
  host: localhost
  port: 5432
  database: cost_index

redis:
  host: localhost
  port: 6379

# config/development.yaml - 开发环境
database:
  host: localhost
  logging: true

# config/production.yaml - 生产环境
database:
  host: ${DB_HOST}
  password: ${DB_PASSWORD}
  logging: false
  pool:
    min: 10
    max: 50
```

### 7.2 配置加载

```typescript
// 配置模块
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => yaml.load(readFileSync('config/default.yaml', 'utf8')),
        () => yaml.load(readFileSync(`config/${process.env.NODE_ENV}.yaml`, 'utf8')),
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

// 使用配置
@Injectable()
export class DatabaseService {
  constructor(private config: ConfigService) {
    const host = this.config.get<string>('database.host');
    const port = this.config.get<number>('database.port');
  }
}
```

### 7.3 敏感配置

```bash
# 敏感配置使用环境变量
# .env文件（不提交到代码仓库）
DB_PASSWORD=your_password
JWT_SECRET=your_secret
ENCRYPTION_KEY=your_key

# docker-compose.yaml
services:
  app:
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
```

---

## 8. 代码审查

### 8.1 审查清单

**功能正确性：**
- [ ] 功能实现是否符合需求
- [ ] 边界条件是否处理
- [ ] 异常情况是否考虑

**代码质量：**
- [ ] 命名是否清晰
- [ ] 函数是否单一职责
- [ ] 是否有重复代码
- [ ] 注释是否充分

**安全性：**
- [ ] 是否有SQL注入风险
- [ ] 是否有XSS风险
- [ ] 敏感数据是否脱敏
- [ ] 权限是否检查

**性能：**
- [ ] 是否有N+1查询
- [ ] 是否需要索引
- [ ] 是否有内存泄漏

**测试：**
- [ ] 单元测试是否覆盖
- [ ] 边界情况是否测试

### 8.2 提交规范

```bash
# 提交信息格式
<type>(<scope>): <subject>

<body>

<footer>

# type类型
feat:     新功能
fix:      修复bug
docs:     文档更新
style:    代码格式
refactor: 重构
test:     测试
chore:    构建/工具

# 示例
feat(project): add project export feature

- Add export to Excel functionality
- Support multiple format options
- Add progress indicator

Closes #123
```

---

## 9. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |