# API契约规范 (API Contract Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：07_Technical

---

## 1. 概述

### 1.1 目的
API契约规范定义了系统所有接口的设计规范和通信协议，确保：
- 前后端接口的一致性
- API设计的规范性和可预测性
- 接口文档的标准化
- 版本管理和兼容性

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| RESTful | 遵循REST架构风格 |
| 一致性 | 相同场景使用相同模式 |
| 简洁性 | 接口设计简单直观 |
| 安全性 | 认证授权、数据加密 |
| 可扩展 | 支持版本演进 |

---

## 2. 基础规范

### 2.1 URL规范

**基础格式：**
```
{protocol}://{host}:{port}/api/{version}/{resource}

示例：
https://api.example.com/api/v1/projects
https://api.example.com/api/v1/projects/123
https://api.example.com/api/v1/projects/123/units
```

**URL命名规则：**

| 规则 | 示例 | 说明 |
|------|------|------|
| 使用小写 | /projects | ✓ 正确 |
| 使用连字符 | /cost-indexes | ✓ 正确 |
| 避免下划线 | /cost_indexes | ✗ 避免 |
| 名词复数 | /projects | ✓ 资源用复数 |
| 避免动词 | /getProjects | ✗ 避免 |

### 2.2 HTTP方法

| 方法 | 用途 | 幂等性 | 示例 |
|------|------|--------|------|
| GET | 查询资源 | 是 | GET /projects |
| POST | 创建资源 | 否 | POST /projects |
| PUT | 全量更新 | 是 | PUT /projects/123 |
| PATCH | 部分更新 | 是 | PATCH /projects/123 |
| DELETE | 删除资源 | 是 | DELETE /projects/123 |

### 2.3 HTTP状态码

**成功状态码：**

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建成功 |
| 204 | No Content | 删除成功 |

**客户端错误：**

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 业务校验失败 |
| 429 | Too Many Requests | 请求过频 |

**服务端错误：**

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 500 | Internal Server Error | 服务器错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |
| 504 | Gateway Timeout | 网关超时 |

---

## 3. 请求规范

### 3.1 请求头

**标准请求头：**

| Header | 必填 | 说明 | 示例 |
|--------|------|------|------|
| Content-Type | 是 | 内容类型 | application/json |
| Authorization | 是* | 认证令牌 | Bearer {token} |
| Accept | 否 | 接受类型 | application/json |
| Accept-Language | 否 | 语言 | zh-CN |
| X-Request-Id | 否 | 请求追踪ID | uuid |
| X-Timestamp | 否 | 请求时间戳 | 1705467600000 |

### 3.2 请求体

**JSON格式：**
```json
{
  "projectName": "XX市人民医院",
  "projectType": "YI",
  "totalArea": 85000,
  "priceBaseDate": "2026-01-01"
}
```

**命名规范：**
- 使用 camelCase 命名
- 布尔值使用 is/has/can 前缀
- 日期使用 ISO 8601 格式

### 3.3 查询参数

**分页参数：**
```
GET /projects?page=1&pageSize=20

page: 页码，从1开始
pageSize: 每页数量，默认20，最大100
```

**排序参数：**
```
GET /projects?sortBy=createdAt&sortOrder=desc

sortBy: 排序字段
sortOrder: asc(升序) / desc(降序)
```

**筛选参数：**
```
GET /projects?status=active&type=YI&startDate=2026-01-01

字段名=值 的形式
多个条件为AND关系
```

**搜索参数：**
```
GET /projects?keyword=医院

keyword: 关键词搜索
```

---

## 4. 响应规范

### 4.1 响应结构

**统一响应格式：**
```typescript
interface ApiResponse<T> {
  code: number;          // 业务状态码，0表示成功
  message: string;       // 提示信息
  data: T;               // 响应数据
  timestamp: number;     // 响应时间戳
  requestId: string;     // 请求追踪ID
}
```

**成功响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "proj-001",
    "projectName": "XX市人民医院",
    "totalArea": 85000
  },
  "timestamp": 1705467600000,
  "requestId": "req-abc-123"
}
```

**错误响应示例：**
```json
{
  "code": 40001,
  "message": "项目名称不能为空",
  "data": null,
  "timestamp": 1705467600000,
  "requestId": "req-abc-123",
  "errors": [
    {
      "field": "projectName",
      "message": "项目名称不能为空"
    }
  ]
}
```

### 4.2 分页响应

```typescript
interface PageResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];           // 数据列表
    pagination: {
      page: number;      // 当前页码
      pageSize: number;  // 每页数量
      total: number;     // 总记录数
      totalPages: number;// 总页数
    };
  };
  timestamp: number;
  requestId: string;
}
```

**示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      { "id": "1", "name": "项目A" },
      { "id": "2", "name": "项目B" }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": 1705467600000,
  "requestId": "req-abc-123"
}
```

### 4.3 业务状态码

**状态码分段：**

| 范围 | 分类 | 说明 |
|------|------|------|
| 0 | 成功 | 操作成功 |
| 10000-19999 | 系统错误 | 系统级别错误 |
| 20000-29999 | 认证错误 | 认证授权相关 |
| 30000-39999 | 参数错误 | 请求参数相关 |
| 40000-49999 | 业务错误 | 业务逻辑相关 |
| 50000-59999 | 外部错误 | 外部服务相关 |

**常用状态码：**

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 系统繁忙 |
| 10002 | 服务不可用 |
| 20001 | 未登录 |
| 20002 | Token过期 |
| 20003 | 无权限 |
| 30001 | 参数为空 |
| 30002 | 参数格式错误 |
| 40001 | 数据不存在 |
| 40002 | 数据已存在 |
| 40003 | 状态不允许 |

---

## 5. 认证授权

### 5.1 认证方式

**JWT Token认证：**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token结构：**
```typescript
interface JwtPayload {
  sub: string;           // 用户ID
  username: string;      // 用户名
  roles: string[];       // 角色列表
  permissions: string[]; // 权限列表
  iat: number;           // 签发时间
  exp: number;           // 过期时间
}
```

### 5.2 Token刷新

**刷新流程：**
```
1. Access Token 过期
2. 使用 Refresh Token 请求新的 Access Token
3. 返回新的 Access Token 和 Refresh Token
```

**刷新接口：**
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "xxx..."
}
```

### 5.3 接口权限

**权限标注：**
```typescript
// 接口定义
@Permission('project:create')
@Post('/projects')
async createProject() { }

// 权限检查中间件
const checkPermission = (requiredPermission: string) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions;
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        code: 20003,
        message: '无权限访问'
      });
    }
    next();
  };
};
```

---

## 6. 版本管理

### 6.1 版本策略

**URL版本：**
```
/api/v1/projects
/api/v2/projects
```

**版本规则：**
- 主版本：v1, v2（重大变更）
- 次版本：通过请求头传递（可选）

### 6.2 版本兼容

**向后兼容原则：**
- 新增字段不影响旧版本
- 废弃字段保留一定时间
- 破坏性变更必须升级版本

**废弃标记：**
```json
{
  "projectName": "XX医院",
  "name": "XX医院",          // deprecated, use projectName
  "_deprecated": {
    "name": "请使用 projectName 字段"
  }
}
```

### 6.3 版本生命周期

| 阶段 | 说明 | 时长 |
|------|------|------|
| Current | 当前版本，完整支持 | 持续 |
| Deprecated | 废弃版本，仍可用 | 6个月 |
| Retired | 退役版本，不可用 | - |

---

## 7. 接口文档

### 7.1 文档格式

**OpenAPI 3.0规范：**
```yaml
openapi: 3.0.0
info:
  title: 造价指标系统 API
  version: 1.0.0
  description: 造价指标系统后端接口文档
  
servers:
  - url: https://api.example.com/api/v1
    description: 生产环境
  - url: https://api-dev.example.com/api/v1
    description: 开发环境

paths:
  /projects:
    get:
      summary: 获取项目列表
      tags:
        - 项目管理
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectListResponse'
```

### 7.2 接口描述模板

```yaml
/projects/{id}:
  get:
    summary: 获取项目详情
    description: |
      根据项目ID获取项目详细信息，包括基本信息、单体列表等。
      
      **权限要求：** project:read
      
      **注意事项：**
      - 仅返回用户有权限查看的项目
    tags:
      - 项目管理
    parameters:
      - name: id
        in: path
        required: true
        description: 项目ID
        schema:
          type: string
    responses:
      '200':
        description: 成功
      '404':
        description: 项目不存在
```

### 7.3 Schema定义

```yaml
components:
  schemas:
    Project:
      type: object
      required:
        - projectName
        - totalArea
      properties:
        id:
          type: string
          description: 项目ID
          example: proj-001
        projectName:
          type: string
          description: 项目名称
          maxLength: 100
          example: XX市人民医院
        projectType:
          type: string
          description: 项目类型
          enum: [YI, JY, BG, ZZ, SW, JD, TY, WH, JT, SZ, QT]
        totalArea:
          type: number
          description: 总建筑面积(m²)
          minimum: 0
          example: 85000
        totalCost:
          type: number
          description: 总造价(元)
          minimum: 0
        priceBaseDate:
          type: string
          format: date
          description: 价格基准期
        status:
          type: string
          enum: [draft, imported, tagging, completed]
          description: 项目状态
        createdAt:
          type: string
          format: date-time
          description: 创建时间
```

---

## 8. 常用接口模式

### 8.1 CRUD接口

```yaml
# 创建
POST /api/v1/{resources}
Request: { ...fields }
Response: { code: 0, data: { id, ...fields } }

# 查询列表
GET /api/v1/{resources}?page=1&pageSize=20
Response: { code: 0, data: { list: [], pagination: {} } }

# 查询详情
GET /api/v1/{resources}/{id}
Response: { code: 0, data: { id, ...fields } }

# 全量更新
PUT /api/v1/{resources}/{id}
Request: { ...allFields }
Response: { code: 0, data: { id, ...fields } }

# 部分更新
PATCH /api/v1/{resources}/{id}
Request: { ...partialFields }
Response: { code: 0, data: { id, ...fields } }

# 删除
DELETE /api/v1/{resources}/{id}
Response: { code: 0, data: null }
```

### 8.2 批量操作

```yaml
# 批量创建
POST /api/v1/{resources}/batch
Request: { items: [...] }
Response: { code: 0, data: { success: 10, failed: 2, errors: [...] } }

# 批量删除
DELETE /api/v1/{resources}/batch
Request: { ids: [...] }
Response: { code: 0, data: { deleted: 10 } }

# 批量更新
PATCH /api/v1/{resources}/batch
Request: { ids: [...], updates: {...} }
Response: { code: 0, data: { updated: 10 } }
```

### 8.3 关联资源

```yaml
# 获取子资源
GET /api/v1/projects/{projectId}/units
Response: { code: 0, data: { list: [...] } }

# 创建子资源
POST /api/v1/projects/{projectId}/units
Request: { ...unitFields }
Response: { code: 0, data: { id, ...unitFields } }

# 关联操作
POST /api/v1/projects/{projectId}/units/{unitId}/tags
Request: { tagId: "..." }
Response: { code: 0, data: null }
```

### 8.4 操作型接口

```yaml
# 状态变更
POST /api/v1/projects/{id}/actions/publish
Request: { releaseNotes: "..." }
Response: { code: 0, data: { status: "published" } }

# 执行计算
POST /api/v1/indexes/actions/calculate
Request: { projectIds: [...], options: {...} }
Response: { code: 0, data: { taskId: "..." } }

# 导入导出
POST /api/v1/projects/actions/import
Request: multipart/form-data
Response: { code: 0, data: { importId: "..." } }

POST /api/v1/projects/actions/export
Request: { ids: [...], format: "xlsx" }
Response: { code: 0, data: { downloadUrl: "..." } }
```

---

## 9. 错误处理

### 9.1 错误响应格式

```typescript
interface ErrorResponse {
  code: number;              // 业务错误码
  message: string;           // 用户友好提示
  errors?: FieldError[];     // 字段错误详情
  debug?: {                  // 调试信息（仅开发环境）
    stack: string;
    detail: string;
  };
  timestamp: number;
  requestId: string;
}

interface FieldError {
  field: string;             // 字段名
  value: any;                // 当前值
  message: string;           // 错误信息
  code: string;              // 错误类型
}
```

### 9.2 错误示例

**参数校验错误：**
```json
{
  "code": 30002,
  "message": "请求参数校验失败",
  "errors": [
    {
      "field": "projectName",
      "value": "",
      "message": "项目名称不能为空",
      "code": "REQUIRED"
    },
    {
      "field": "totalArea",
      "value": -100,
      "message": "面积必须大于0",
      "code": "MIN_VALUE"
    }
  ],
  "timestamp": 1705467600000,
  "requestId": "req-abc-123"
}
```

**业务错误：**
```json
{
  "code": 40003,
  "message": "当前状态不允许此操作",
  "errors": [
    {
      "field": "status",
      "value": "published",
      "message": "已发布的版本不能删除",
      "code": "INVALID_STATUS"
    }
  ],
  "timestamp": 1705467600000,
  "requestId": "req-abc-123"
}
```

---

## 10. 性能与限流

### 10.1 请求限流

| 接口类型 | 限流规则 |
|----------|----------|
| 普通接口 | 100次/分钟/IP |
| 登录接口 | 10次/分钟/IP |
| 导出接口 | 10次/小时/用户 |
| 批量接口 | 20次/分钟/用户 |

**限流响应：**
```json
{
  "code": 429,
  "message": "请求过于频繁，请稍后重试",
  "data": {
    "retryAfter": 60
  }
}
```

### 10.2 响应头

```
X-RateLimit-Limit: 100        // 限流上限
X-RateLimit-Remaining: 95     // 剩余次数
X-RateLimit-Reset: 1705467660 // 重置时间戳
```

### 10.3 超时设置

| 接口类型 | 超时时间 |
|----------|----------|
| 普通查询 | 10秒 |
| 复杂查询 | 30秒 |
| 导入操作 | 5分钟 |
| 计算任务 | 异步处理 |

---

## 11. 接口清单

### 11.1 认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/login | 用户登录 |
| POST | /auth/logout | 用户登出 |
| POST | /auth/refresh | 刷新Token |
| GET | /auth/userinfo | 获取用户信息 |

### 11.2 项目管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /projects | 获取项目列表 |
| POST | /projects | 创建项目 |
| GET | /projects/{id} | 获取项目详情 |
| PUT | /projects/{id} | 更新项目 |
| DELETE | /projects/{id} | 删除项目 |
| POST | /projects/import | 导入项目 |
| POST | /projects/export | 导出项目 |

### 11.3 指标系统

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /indexes | 获取指标列表 |
| GET | /indexes/{id} | 获取指标详情 |
| POST | /indexes/calculate | 执行计算 |
| GET | /index-versions | 获取版本列表 |
| POST | /index-versions | 创建版本 |
| POST | /index-versions/{id}/publish | 发布版本 |

### 11.4 估算应用

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /estimations | 获取估算列表 |
| POST | /estimations | 创建估算 |
| GET | /estimations/{id} | 获取估算详情 |
| POST | /estimations/{id}/calculate | 执行估算 |
| POST | /estimations/{id}/export | 导出报告 |

---

## 12. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |