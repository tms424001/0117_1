# 权限规范 (Permission Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：01_Foundation

---

## 1. 概述

### 1.1 目的
权限规范定义了系统的访问控制机制，确保：
- 数据安全性和隐私保护
- 功能访问的合理控制
- 操作审计的可追溯性
- 灵活的权限配置能力

### 1.2 权限模型

系统采用 **RBAC（基于角色的访问控制）** 模型：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              权限模型                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   用户 (User)                                                               │
│      │                                                                      │
│      │ N:M                                                                  │
│      ▼                                                                      │
│   角色 (Role)                                                               │
│      │                                                                      │
│      │ N:M                                                                  │
│      ▼                                                                      │
│   权限 (Permission)                                                         │
│      │                                                                      │
│      │ 1:1                                                                  │
│      ▼                                                                      │
│   资源 (Resource) + 操作 (Action)                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| 最小权限 | 仅授予必要的最小权限 |
| 职责分离 | 关键操作需多角色协作 |
| 显式授权 | 未明确授权即为拒绝 |
| 可审计 | 所有权限操作可追溯 |

---

## 2. 角色体系

### 2.1 系统角色

| 角色编码 | 角色名称 | 说明 | 权限范围 |
|----------|----------|------|----------|
| SUPER_ADMIN | 超级管理员 | 系统最高权限 | 全部 |
| ADMIN | 系统管理员 | 管理系统配置和用户 | 系统管理 |
| INDEX_ADMIN | 指标管理员 | 管理指标全流程 | 指标模块全部 |
| INDEX_EDITOR | 指标编辑员 | 编辑和计算指标 | 指标编辑 |
| INDEX_REVIEWER | 指标审核员 | 审核指标发布 | 指标审核 |
| DATA_OPERATOR | 数据操作员 | 数据采集和标签化 | 数据采集 |
| ESTIMATOR | 估算人员 | 使用指标进行估算 | 估算应用 |
| VIEWER | 只读用户 | 仅查看权限 | 查看 |

### 2.2 角色层级

```
                    ┌─────────────────┐
                    │  SUPER_ADMIN    │
                    │   超级管理员    │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐  ┌───────▼───────┐  ┌─────▼─────┐
    │    ADMIN    │  │  INDEX_ADMIN  │  │ ESTIMATOR │
    │  系统管理员  │  │  指标管理员   │  │  估算人员  │
    └──────┬──────┘  └───────┬───────┘  └───────────┘
           │                 │
           │        ┌────────┴────────┐
           │        │                 │
    ┌──────▼──────┐ │                 │
    │   VIEWER    │ │                 │
    │  只读用户   │ │                 │
    └─────────────┘ │                 │
              ┌─────▼─────┐   ┌───────▼───────┐
              │INDEX_EDITOR│   │INDEX_REVIEWER │
              │ 指标编辑员 │   │  指标审核员   │
              └─────┬─────┘   └───────────────┘
                    │
              ┌─────▼─────┐
              │DATA_OPERATOR│
              │ 数据操作员 │
              └───────────┘
```

### 2.3 角色数据模型

```typescript
interface Role {
  id: string;
  code: string;              // 角色编码
  name: string;              // 角色名称
  description: string;       // 角色描述
  type: 'system' | 'custom'; // 系统角色/自定义角色
  level: number;             // 角色层级
  parentId?: string;         // 父角色ID
  
  // 状态
  status: 'active' | 'inactive';
  
  // 系统字段
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
```

---

## 3. 权限定义

### 3.1 权限结构

```typescript
interface Permission {
  id: string;
  code: string;              // 权限编码，如 "index:create"
  name: string;              // 权限名称
  description: string;       // 权限描述
  
  // 资源和操作
  resource: string;          // 资源，如 "index"
  action: string;            // 操作，如 "create"
  
  // 分组
  module: string;            // 所属模块
  group: string;             // 权限分组
  
  // 类型
  type: 'menu' | 'button' | 'api' | 'data';
  
  // 状态
  status: 'active' | 'inactive';
}
```

### 3.2 权限编码规范

```
权限编码格式：{module}:{resource}:{action}

示例：
- index:project:create      指标模块-项目-创建
- index:project:read        指标模块-项目-查看
- index:project:update      指标模块-项目-编辑
- index:project:delete      指标模块-项目-删除
- index:version:publish     指标模块-版本-发布
- estimation:report:export  估算模块-报告-导出
```

### 3.3 标准操作类型

| 操作 | 编码 | 说明 |
|------|------|------|
| 创建 | create | 新建资源 |
| 查看 | read | 查看资源 |
| 编辑 | update | 修改资源 |
| 删除 | delete | 删除资源 |
| 导入 | import | 导入数据 |
| 导出 | export | 导出数据 |
| 审核 | review | 审核资源 |
| 发布 | publish | 发布资源 |
| 归档 | archive | 归档资源 |

### 3.4 权限清单

#### 3.4.1 系统管理模块

| 权限编码 | 权限名称 | 类型 |
|----------|----------|------|
| system:user:create | 创建用户 | button |
| system:user:read | 查看用户 | menu |
| system:user:update | 编辑用户 | button |
| system:user:delete | 删除用户 | button |
| system:role:manage | 角色管理 | menu |
| system:permission:manage | 权限管理 | menu |
| system:config:manage | 系统配置 | menu |
| system:log:read | 查看日志 | menu |

#### 3.4.2 标准库模块

| 权限编码 | 权限名称 | 类型 |
|----------|----------|------|
| standard:tag:read | 查看标签 | menu |
| standard:tag:manage | 管理标签 | button |
| standard:scale:read | 查看规模档 | menu |
| standard:scale:manage | 管理规模档 | button |
| standard:mapping:read | 查看映射 | menu |
| standard:mapping:manage | 管理映射 | button |

#### 3.4.3 数据采集模块

| 权限编码 | 权限名称 | 类型 |
|----------|----------|------|
| data:project:create | 创建项目 | button |
| data:project:read | 查看项目 | menu |
| data:project:update | 编辑项目 | button |
| data:project:delete | 删除项目 | button |
| data:project:import | 导入数据 | button |
| data:tagging:execute | 执行标签化 | button |

#### 3.4.4 指标系统模块

| 权限编码 | 权限名称 | 类型 |
|----------|----------|------|
| index:calculate:execute | 执行计算 | button |
| index:calculate:read | 查看计算 | menu |
| index:analysis:read | 统计分析 | menu |
| index:version:create | 创建版本 | button |
| index:version:read | 查看版本 | menu |
| index:version:review | 审核版本 | button |
| index:version:publish | 发布版本 | button |

#### 3.4.5 估算应用模块

| 权限编码 | 权限名称 | 类型 |
|----------|----------|------|
| estimation:project:create | 创建估算 | button |
| estimation:project:read | 查看估算 | menu |
| estimation:project:update | 编辑估算 | button |
| estimation:project:delete | 删除估算 | button |
| estimation:report:export | 导出报告 | button |
| pricing:query:execute | 价格查询 | menu |
| pricing:calculate:execute | 报价测算 | button |

---

## 4. 角色权限矩阵

### 4.1 功能模块权限

| 权限 | 超管 | 管理 | 指标管理 | 指标编辑 | 指标审核 | 数据操作 | 估算 | 只读 |
|------|:----:|:----:|:--------:|:--------:|:--------:|:--------:|:----:|:----:|
| **系统管理** |
| 用户管理 | ✓ | ✓ | - | - | - | - | - | - |
| 角色管理 | ✓ | ✓ | - | - | - | - | - | - |
| 系统配置 | ✓ | ✓ | - | - | - | - | - | - |
| **标准库** |
| 查看标签 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 管理标签 | ✓ | ✓ | ✓ | - | - | - | - | - |
| **数据采集** |
| 创建项目 | ✓ | - | ✓ | ✓ | - | ✓ | - | - |
| 查看项目 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 导入数据 | ✓ | - | ✓ | ✓ | - | ✓ | - | - |
| 标签化 | ✓ | - | ✓ | ✓ | - | ✓ | - | - |
| **指标系统** |
| 执行计算 | ✓ | - | ✓ | ✓ | - | - | - | - |
| 查看指标 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 统计分析 | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| 创建版本 | ✓ | - | ✓ | ✓ | - | - | - | - |
| 审核版本 | ✓ | - | ✓ | - | ✓ | - | - | - |
| 发布版本 | ✓ | - | ✓ | - | - | - | - | - |
| **估算应用** |
| 创建估算 | ✓ | - | - | - | - | - | ✓ | - |
| 查看估算 | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| 导出报告 | ✓ | - | - | - | - | - | ✓ | - |

### 4.2 数据权限

| 角色 | 数据范围 |
|------|----------|
| 超级管理员 | 全部数据 |
| 系统管理员 | 全部数据（只读） |
| 指标管理员 | 全部指标数据 |
| 指标编辑员 | 本人创建的数据 |
| 指标审核员 | 待审核的数据 |
| 数据操作员 | 本人负责的项目 |
| 估算人员 | 本人创建的估算 |
| 只读用户 | 已发布的数据 |

---

## 5. 权限控制实现

### 5.1 前端权限控制

**路由权限：**
```typescript
// 路由配置
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  meta: {
    title: string;
    permission?: string;       // 所需权限
    roles?: string[];          // 所需角色
  };
}

// 路由守卫
const PermissionGuard: React.FC = ({ children }) => {
  const { user, hasPermission } = useAuth();
  const route = useCurrentRoute();
  
  if (route.meta.permission && !hasPermission(route.meta.permission)) {
    return <NoPermission />;
  }
  
  return children;
};
```

**按钮权限：**
```typescript
// 权限按钮组件
interface AuthButtonProps extends ButtonProps {
  permission: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ permission, ...props }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return null;  // 无权限不显示
  }
  
  return <Button {...props} />;
};

// 使用示例
<AuthButton permission="index:version:publish" type="primary">
  发布版本
</AuthButton>
```

**权限指令：**
```typescript
// 权限Hook
const usePermission = () => {
  const { permissions } = useAuth();
  
  const hasPermission = (code: string) => {
    return permissions.includes(code) || permissions.includes('*');
  };
  
  const hasAnyPermission = (codes: string[]) => {
    return codes.some(code => hasPermission(code));
  };
  
  const hasAllPermission = (codes: string[]) => {
    return codes.every(code => hasPermission(code));
  };
  
  return { hasPermission, hasAnyPermission, hasAllPermission };
};
```

### 5.2 后端权限控制

**接口鉴权：**
```typescript
// 权限装饰器
@Permission('index:version:publish')
@Post('/versions/:id/publish')
async publishVersion(@Param('id') id: string) {
  // 业务逻辑
}

// 角色装饰器
@Roles('INDEX_ADMIN', 'INDEX_REVIEWER')
@Post('/versions/:id/review')
async reviewVersion(@Param('id') id: string) {
  // 业务逻辑
}
```

**数据权限：**
```typescript
// 数据权限过滤
interface DataPermissionFilter {
  // 全部数据
  all: () => QueryBuilder;
  
  // 本部门数据
  department: (deptId: string) => QueryBuilder;
  
  // 本人数据
  self: (userId: string) => QueryBuilder;
}

// 使用示例
const dataFilter = getDataPermission(user);
const query = dataFilter(baseQuery);
```

### 5.3 权限缓存

```typescript
// 用户权限缓存
interface UserPermissionCache {
  userId: string;
  roles: string[];
  permissions: string[];
  dataScope: DataScope;
  expireAt: Date;
}

// 权限变更时清除缓存
const clearPermissionCache = async (userId: string) => {
  await redis.del(`permission:${userId}`);
};
```

---

## 6. 数据权限

### 6.1 数据权限类型

| 类型 | 编码 | 说明 |
|------|------|------|
| 全部数据 | ALL | 可访问全部数据 |
| 本部门及下级 | DEPT_AND_CHILD | 本部门及下级部门数据 |
| 本部门 | DEPT | 仅本部门数据 |
| 本人 | SELF | 仅本人创建的数据 |
| 自定义 | CUSTOM | 自定义数据范围 |

### 6.2 数据权限模型

```typescript
interface DataPermission {
  id: string;
  roleId: string;
  resource: string;          // 资源类型
  scopeType: 'ALL' | 'DEPT_AND_CHILD' | 'DEPT' | 'SELF' | 'CUSTOM';
  scopeValue?: string[];     // 自定义范围值
}
```

### 6.3 数据权限应用

```typescript
// 数据权限中间件
const dataPermissionMiddleware = async (ctx, next) => {
  const user = ctx.user;
  const resource = ctx.resource;
  
  // 获取数据权限配置
  const dataPermission = await getDataPermission(user.roleId, resource);
  
  // 应用数据过滤
  switch (dataPermission.scopeType) {
    case 'ALL':
      // 不过滤
      break;
    case 'DEPT_AND_CHILD':
      ctx.query.deptId = { $in: await getDeptAndChildren(user.deptId) };
      break;
    case 'DEPT':
      ctx.query.deptId = user.deptId;
      break;
    case 'SELF':
      ctx.query.createdBy = user.id;
      break;
    case 'CUSTOM':
      ctx.query.deptId = { $in: dataPermission.scopeValue };
      break;
  }
  
  await next();
};
```

---

## 7. 权限管理界面

### 7.1 角色管理

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  系统管理 > 角色管理                                        [+ 新建角色]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ 角色列表 ───────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  角色名称      │ 角色编码      │ 用户数 │ 状态   │ 创建时间   │ 操作  │  │
│  │  ─────────────┼──────────────┼───────┼───────┼───────────┼───────│  │
│  │  超级管理员   │ SUPER_ADMIN  │   1   │ ●启用 │ 2026-01-01│ 查看  │  │
│  │  系统管理员   │ ADMIN        │   3   │ ●启用 │ 2026-01-01│ 编辑  │  │
│  │  指标管理员   │ INDEX_ADMIN  │   5   │ ●启用 │ 2026-01-01│ 编辑  │  │
│  │  指标编辑员   │ INDEX_EDITOR │   12  │ ●启用 │ 2026-01-01│ 编辑  │  │
│  │  ...         │ ...          │  ...  │ ...   │ ...       │ ...   │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 角色权限配置

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  编辑角色 > 指标编辑员                                                [保存] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  基本信息                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  角色名称：[指标编辑员        ]    角色编码：[INDEX_EDITOR    ]              │
│  角色描述：[负责指标数据的编辑和计算工作                           ]          │
│                                                                             │
│  功能权限                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─ 权限树 ─────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ☐ 系统管理                                                          │  │
│  │     ☐ 用户管理                                                       │  │
│  │     ☐ 角色管理                                                       │  │
│  │                                                                       │  │
│  │  ☑ 标准库管理                                                        │  │
│  │     ☑ 查看标签                                                       │  │
│  │     ☐ 管理标签                                                       │  │
│  │                                                                       │  │
│  │  ☑ 数据采集                                                          │  │
│  │     ☑ 创建项目                                                       │  │
│  │     ☑ 查看项目                                                       │  │
│  │     ☑ 导入数据                                                       │  │
│  │     ☑ 执行标签化                                                     │  │
│  │                                                                       │  │
│  │  ☑ 指标系统                                                          │  │
│  │     ☑ 执行计算                                                       │  │
│  │     ☑ 查看指标                                                       │  │
│  │     ☑ 创建版本                                                       │  │
│  │     ☐ 审核版本                                                       │  │
│  │     ☐ 发布版本                                                       │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  数据权限                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  数据范围：○ 全部数据  ○ 本部门及下级  ○ 本部门  ● 本人  ○ 自定义           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 用户授权

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  用户授权 > 张三                                                    [保存]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  用户信息                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  用户名：zhangsan    姓名：张三    部门：造价部    状态：●在职               │
│                                                                             │
│  角色分配                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─ 可选角色 ───────────────┐     ┌─ 已分配角色 ─────────────┐             │
│  │                          │     │                          │             │
│  │  ☐ 系统管理员            │     │  ☑ 指标编辑员            │             │
│  │  ☐ 指标管理员            │ >>> │  ☑ 数据操作员            │             │
│  │  ☐ 指标审核员            │ <<< │                          │             │
│  │  ☐ 估算人员              │     │                          │             │
│  │  ☐ 只读用户              │     │                          │             │
│  │                          │     │                          │             │
│  └──────────────────────────┘     └──────────────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. 审计日志

### 8.1 审计内容

| 类型 | 记录内容 |
|------|----------|
| 登录日志 | 登录/登出、登录IP、登录设备 |
| 操作日志 | 增删改查操作、操作对象、操作结果 |
| 权限日志 | 权限变更、角色变更、授权记录 |
| 敏感日志 | 敏感数据访问、导出记录 |

### 8.2 日志模型

```typescript
interface AuditLog {
  id: string;
  
  // 操作信息
  action: string;              // 操作类型
  actionName: string;          // 操作名称
  resource: string;            // 操作资源
  resourceId: string;          // 资源ID
  resourceName: string;        // 资源名称
  
  // 操作人
  userId: string;
  userName: string;
  userIp: string;
  userAgent: string;
  
  // 操作详情
  requestMethod: string;
  requestUrl: string;
  requestParams: any;
  responseStatus: number;
  responseTime: number;        // 响应时间(ms)
  
  // 变更记录
  beforeData?: any;
  afterData?: any;
  
  // 结果
  success: boolean;
  errorMessage?: string;
  
  // 时间
  createdAt: Date;
}
```

### 8.3 日志查询

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  系统管理 > 审计日志                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [操作类型 ▼] [操作人 ▼] [时间范围：2026-01-01 至 2026-01-17]   [查询]      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 时间        │ 操作人 │ 操作类型 │ 操作对象         │ IP地址    │ 结果 │  │
│  │ ───────────┼───────┼─────────┼─────────────────┼──────────┼─────│  │
│  │ 01-17 14:30│ 张三   │ 发布版本 │ 指标版本2026.01  │ 10.0.0.1 │ ✓   │  │
│  │ 01-17 14:25│ 李四   │ 审核通过 │ 指标版本2026.01  │ 10.0.0.2 │ ✓   │  │
│  │ 01-17 14:00│ 张三   │ 创建版本 │ 指标版本2026.01  │ 10.0.0.1 │ ✓   │  │
│  │ 01-17 10:30│ 王五   │ 导入数据 │ 项目XX医院       │ 10.0.0.3 │ ✓   │  │
│  │ 01-17 09:15│ 张三   │ 登录系统 │ -               │ 10.0.0.1 │ ✓   │  │
│  │ ...        │ ...   │ ...     │ ...             │ ...      │ ... │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. 安全策略

### 9.1 登录安全

| 策略 | 配置 |
|------|------|
| 密码强度 | 至少8位，包含大小写字母和数字 |
| 密码有效期 | 90天强制更换 |
| 登录失败锁定 | 连续5次失败锁定30分钟 |
| 会话超时 | 30分钟无操作自动登出 |
| 并发登录 | 同一账号最多2个终端 |

### 9.2 API安全

| 策略 | 说明 |
|------|------|
| Token认证 | JWT Token + Refresh Token |
| Token有效期 | Access Token 2小时，Refresh Token 7天 |
| 接口签名 | 敏感接口需签名验证 |
| 频率限制 | 单IP 100次/分钟 |

### 9.3 数据安全

| 策略 | 说明 |
|------|------|
| 敏感数据脱敏 | 手机号、身份证等自动脱敏 |
| 数据导出审批 | 大量数据导出需审批 |
| 操作日志 | 敏感操作全程记录 |
| 数据备份 | 每日增量，每周全量 |

---

## 10. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |