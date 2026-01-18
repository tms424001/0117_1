# 数据模型规范 (Data Model Spec)

> 版本：V1.0  
> 更新日期：2026-01-17  
> 所属模块：07_Technical

---

## 1. 概述

### 1.1 目的
数据模型规范定义了系统的数据库设计标准和数据结构，确保：
- 数据结构的规范性和一致性
- 数据库设计的可维护性
- 数据完整性和安全性
- 查询性能的优化

### 1.2 技术选型

| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 主数据库 | PostgreSQL 15+ | 关系型数据存储 |
| 缓存 | Redis 7+ | 缓存和会话存储 |
| 搜索 | Elasticsearch 8+ | 全文搜索（可选） |
| 文件存储 | MinIO / OSS | 文件对象存储 |

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| 规范化 | 适度规范化，避免冗余 |
| 一致性 | 命名和结构保持一致 |
| 可扩展 | 预留扩展字段 |
| 性能优先 | 合理索引和分区 |

---

## 2. 命名规范

### 2.1 表命名

```
规则：{模块前缀}_{业务名称}

示例：
sys_user           -- 系统用户表
sys_role           -- 系统角色表
std_function_tag   -- 标准-功能标签表
prj_project        -- 项目表
prj_building_unit  -- 项目-单体表
idx_cost_index     -- 指标表
est_estimation     -- 估算表
```

**模块前缀：**

| 前缀 | 模块 |
|------|------|
| sys_ | 系统管理 |
| std_ | 标准库 |
| prj_ | 项目数据 |
| idx_ | 指标系统 |
| est_ | 估算应用 |
| log_ | 日志记录 |

### 2.2 字段命名

```
规则：小写字母 + 下划线分隔

示例：
id                 -- 主键
project_name       -- 项目名称
total_area         -- 总面积
created_at         -- 创建时间
created_by         -- 创建人
is_deleted         -- 是否删除
```

**常用字段后缀：**

| 后缀 | 含义 | 示例 |
|------|------|------|
| _id | 外键/ID | project_id |
| _code | 编码 | tag_code |
| _name | 名称 | tag_name |
| _type | 类型 | project_type |
| _status | 状态 | review_status |
| _at | 时间 | created_at |
| _by | 操作人 | created_by |
| _count | 数量 | sample_count |
| _rate | 比率 | coverage_rate |

### 2.3 索引命名

```
规则：idx_{表名}_{字段名}

示例：
idx_project_name              -- 单字段索引
idx_project_type_status       -- 复合索引
uk_project_code               -- 唯一索引
```

### 2.4 约束命名

```
规则：{约束类型}_{表名}_{字段名}

示例：
pk_project                    -- 主键
fk_unit_project               -- 外键
uk_user_username              -- 唯一约束
ck_project_status             -- 检查约束
```

---

## 3. 字段类型规范

### 3.1 基础类型

| 数据类型 | PostgreSQL | 说明 |
|----------|------------|------|
| 主键 | VARCHAR(36) / UUID | UUID格式 |
| 字符串-短 | VARCHAR(50) | 编码、状态等 |
| 字符串-中 | VARCHAR(200) | 名称、标题等 |
| 字符串-长 | VARCHAR(1000) | 描述、备注等 |
| 文本 | TEXT | 大文本内容 |
| 整数 | INTEGER | 普通整数 |
| 长整数 | BIGINT | 大数值 |
| 小数 | DECIMAL(18,2) | 金额等精确数值 |
| 浮点数 | DOUBLE PRECISION | 非精确计算 |
| 布尔 | BOOLEAN | true/false |
| 日期 | DATE | 仅日期 |
| 时间戳 | TIMESTAMP | 日期时间 |
| JSON | JSONB | JSON数据 |

### 3.2 通用字段

**每张表必须包含的字段：**

```sql
-- 主键
id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),

-- 审计字段
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by VARCHAR(36) NOT NULL,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_by VARCHAR(36) NOT NULL,

-- 软删除
is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
deleted_at TIMESTAMP,
deleted_by VARCHAR(36)
```

### 3.3 枚举类型

```sql
-- 使用VARCHAR存储，应用层维护枚举值
-- 不使用数据库枚举类型，便于扩展

-- 示例：项目状态
project_status VARCHAR(20) NOT NULL DEFAULT 'draft'
-- 可选值：draft, imported, tagging, completed

-- 添加检查约束（可选）
CONSTRAINT ck_project_status 
CHECK (project_status IN ('draft', 'imported', 'tagging', 'completed'))
```

---

## 4. 核心数据模型

### 4.1 ER图概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              核心实体关系                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────┐         ┌───────────┐         ┌───────────┐               │
│   │  sys_user │────────→│  sys_role │←────────│sys_permission│             │
│   └───────────┘         └───────────┘         └───────────┘               │
│                                                                             │
│   ┌───────────┐         ┌───────────┐         ┌───────────┐               │
│   │std_function│        │std_scale_ │         │std_profession│             │
│   │   _tag    │         │  range    │         │             │              │
│   └───────────┘         └───────────┘         └───────────┘               │
│         │                     │                     │                      │
│         └─────────────────────┼─────────────────────┘                      │
│                               │                                            │
│                               ▼                                            │
│   ┌───────────┐         ┌───────────┐         ┌───────────┐               │
│   │prj_project│────────→│prj_building│────────→│prj_cost_  │               │
│   │           │    1:N  │   _unit   │    1:N  │  detail   │               │
│   └───────────┘         └───────────┘         └───────────┘               │
│                               │                                            │
│                               │ 标签化                                     │
│                               ▼                                            │
│   ┌───────────┐         ┌───────────┐         ┌───────────┐               │
│   │idx_cost_  │←────────│idx_index_ │────────→│idx_index_ │               │
│   │  index    │    1:N  │  sample   │         │  version  │               │
│   └───────────┘         └───────────┘         └───────────┘               │
│         │                                                                  │
│         │ 引用                                                             │
│         ▼                                                                  │
│   ┌───────────┐         ┌───────────┐                                     │
│   │est_project│────────→│est_detail │                                     │
│   │           │    1:N  │           │                                     │
│   └───────────┘         └───────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 系统管理模块

**用户表 (sys_user):**
```sql
CREATE TABLE sys_user (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 账号信息
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    
    -- 基本信息
    real_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    
    -- 组织信息
    department_id VARCHAR(36),
    department_name VARCHAR(100),
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    
    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_user_username UNIQUE (username)
);

CREATE INDEX idx_user_department ON sys_user(department_id);
CREATE INDEX idx_user_status ON sys_user(status);
```

**角色表 (sys_role):**
```sql
CREATE TABLE sys_role (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    role_code VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    role_type VARCHAR(20) NOT NULL DEFAULT 'custom',
    role_level INTEGER DEFAULT 0,
    parent_id VARCHAR(36),
    
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_role_code UNIQUE (role_code)
);
```

**用户角色关联表 (sys_user_role):**
```sql
CREATE TABLE sys_user_role (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    CONSTRAINT uk_user_role UNIQUE (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES sys_user(id),
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES sys_role(id)
);
```

### 4.3 标准库模块

**功能标签表 (std_function_tag):**
```sql
CREATE TABLE std_function_tag (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 标签信息
    tag_code VARCHAR(20) NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    tag_level INTEGER NOT NULL,
    parent_id VARCHAR(36),
    parent_code VARCHAR(20),
    
    -- 分类信息
    category_code VARCHAR(10) NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    
    -- 规模类型
    scale_type_code VARCHAR(20),
    scale_type_name VARCHAR(50),
    
    -- 排序和状态
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    -- 描述
    description VARCHAR(500),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_tag_code UNIQUE (tag_code)
);

CREATE INDEX idx_tag_parent ON std_function_tag(parent_id);
CREATE INDEX idx_tag_category ON std_function_tag(category_code);
CREATE INDEX idx_tag_level ON std_function_tag(tag_level);
```

**规模分档表 (std_scale_range):**
```sql
CREATE TABLE std_scale_range (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 规模类型
    scale_type_code VARCHAR(20) NOT NULL,
    scale_type_name VARCHAR(50) NOT NULL,
    
    -- 分档信息
    range_code VARCHAR(20) NOT NULL,
    range_name VARCHAR(50) NOT NULL,
    range_level INTEGER NOT NULL,
    
    -- 范围
    min_value DECIMAL(18,2),
    max_value DECIMAL(18,2),
    unit VARCHAR(20),
    
    -- 排序
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_scale_range UNIQUE (scale_type_code, range_code)
);
```

### 4.4 项目数据模块

**项目表 (prj_project):**
```sql
CREATE TABLE prj_project (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基本信息
    project_code VARCHAR(50),
    project_name VARCHAR(200) NOT NULL,
    project_type VARCHAR(20),
    project_type_name VARCHAR(50),
    
    -- 地区
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    address VARCHAR(500),
    
    -- 规模
    total_area DECIMAL(18,2),
    above_ground_area DECIMAL(18,2),
    underground_area DECIMAL(18,2),
    land_area DECIMAL(18,2),
    
    -- 造价
    total_cost DECIMAL(18,2),
    unit_cost DECIMAL(18,2),
    price_base_date DATE,
    
    -- 时间
    start_date DATE,
    completion_date DATE,
    settlement_date DATE,
    
    -- 参建单位
    building_party VARCHAR(200),
    design_party VARCHAR(200),
    construction_party VARCHAR(200),
    supervision_party VARCHAR(200),
    
    -- 数据来源
    data_source VARCHAR(50),
    source_file VARCHAR(200),
    import_batch VARCHAR(50),
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    tagging_status VARCHAR(20) DEFAULT 'pending',
    
    -- 备注
    description TEXT,
    remarks TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(36)
);

CREATE INDEX idx_project_name ON prj_project(project_name);
CREATE INDEX idx_project_type ON prj_project(project_type);
CREATE INDEX idx_project_status ON prj_project(status);
CREATE INDEX idx_project_province ON prj_project(province);
CREATE INDEX idx_project_created ON prj_project(created_at);
```

**单体表 (prj_building_unit):**
```sql
CREATE TABLE prj_building_unit (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(36) NOT NULL,
    
    -- 基本信息
    unit_code VARCHAR(50),
    unit_name VARCHAR(200) NOT NULL,
    unit_type VARCHAR(50),
    
    -- 功能标签（标签化后填充）
    function_tag_id VARCHAR(36),
    function_tag_code VARCHAR(20),
    function_tag_name VARCHAR(100),
    
    -- 面积
    total_area DECIMAL(18,2),
    above_ground_area DECIMAL(18,2),
    underground_area DECIMAL(18,2),
    above_ground_floors INTEGER,
    underground_floors INTEGER,
    
    -- 功能规模
    functional_scale DECIMAL(18,2),
    functional_unit VARCHAR(20),
    
    -- 规模分档（自动计算）
    scale_type_code VARCHAR(20),
    scale_range_code VARCHAR(20),
    scale_range_name VARCHAR(50),
    
    -- 结构
    structure_type VARCHAR(50),
    structure_type_name VARCHAR(50),
    foundation_type VARCHAR(50),
    
    -- 造价
    total_cost DECIMAL(18,2),
    unit_cost DECIMAL(18,2),
    civil_cost DECIMAL(18,2),
    install_cost DECIMAL(18,2),
    other_cost DECIMAL(18,2),
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    tagging_status VARCHAR(20) DEFAULT 'pending',
    
    -- 排序
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_unit_project FOREIGN KEY (project_id) REFERENCES prj_project(id)
);

CREATE INDEX idx_unit_project ON prj_building_unit(project_id);
CREATE INDEX idx_unit_tag ON prj_building_unit(function_tag_code);
CREATE INDEX idx_unit_status ON prj_building_unit(tagging_status);
```

**造价明细表 (prj_cost_detail):**
```sql
CREATE TABLE prj_cost_detail (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(36) NOT NULL,
    unit_id VARCHAR(36) NOT NULL,
    
    -- 分类
    category VARCHAR(20) NOT NULL,
    category_name VARCHAR(50),
    sub_category VARCHAR(50),
    sub_category_name VARCHAR(100),
    
    -- 空间专业（标签化后填充）
    space_code VARCHAR(10),
    space_name VARCHAR(50),
    profession_code VARCHAR(10),
    profession_name VARCHAR(50),
    
    -- 造价数据
    cost DECIMAL(18,2) NOT NULL,
    area DECIMAL(18,2),
    unit_cost DECIMAL(18,2),
    cost_ratio DECIMAL(8,4),
    
    -- 明细
    has_detail BOOLEAN DEFAULT FALSE,
    detail_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_detail_project FOREIGN KEY (project_id) REFERENCES prj_project(id),
    CONSTRAINT fk_detail_unit FOREIGN KEY (unit_id) REFERENCES prj_building_unit(id)
);

CREATE INDEX idx_detail_project ON prj_cost_detail(project_id);
CREATE INDEX idx_detail_unit ON prj_cost_detail(unit_id);
CREATE INDEX idx_detail_profession ON prj_cost_detail(profession_code);
```

### 4.5 指标系统模块

**造价指标表 (idx_cost_index):**
```sql
CREATE TABLE idx_cost_index (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 维度
    function_tag_code VARCHAR(20) NOT NULL,
    function_tag_name VARCHAR(100),
    space_code VARCHAR(10) NOT NULL,
    space_name VARCHAR(50),
    profession_code VARCHAR(10) NOT NULL,
    profession_name VARCHAR(50),
    scale_range_code VARCHAR(20),
    scale_range_name VARCHAR(50),
    
    -- 统计结果
    sample_count INTEGER NOT NULL DEFAULT 0,
    avg_unit_cost DECIMAL(18,2),
    median_unit_cost DECIMAL(18,2),
    min_unit_cost DECIMAL(18,2),
    max_unit_cost DECIMAL(18,2),
    std_deviation DECIMAL(18,2),
    cv DECIMAL(8,4),
    
    -- 推荐值
    recommended_low DECIMAL(18,2),
    recommended_mid DECIMAL(18,2),
    recommended_high DECIMAL(18,2),
    
    -- 质量评估
    quality_score DECIMAL(8,2),
    quality_level VARCHAR(10),
    
    -- 版本
    version_id VARCHAR(36),
    version_code VARCHAR(20),
    price_base_date DATE,
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_index_dimension UNIQUE (
        function_tag_code, space_code, profession_code, 
        scale_range_code, version_id
    )
);

CREATE INDEX idx_index_tag ON idx_cost_index(function_tag_code);
CREATE INDEX idx_index_version ON idx_cost_index(version_id);
CREATE INDEX idx_index_quality ON idx_cost_index(quality_level);
```

**指标版本表 (idx_index_version):**
```sql
CREATE TABLE idx_index_version (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 版本信息
    version_code VARCHAR(20) NOT NULL,
    version_name VARCHAR(100) NOT NULL,
    version_type VARCHAR(20) NOT NULL DEFAULT 'release',
    
    -- 统计
    total_indexes INTEGER DEFAULT 0,
    new_indexes INTEGER DEFAULT 0,
    updated_indexes INTEGER DEFAULT 0,
    deleted_indexes INTEGER DEFAULT 0,
    unchanged_indexes INTEGER DEFAULT 0,
    
    -- 质量
    avg_quality_score DECIMAL(8,2),
    quality_distribution JSONB,
    
    -- 覆盖
    covered_tags INTEGER DEFAULT 0,
    total_tags INTEGER DEFAULT 0,
    coverage_rate DECIMAL(8,4),
    
    -- 价格基准
    price_base_date DATE,
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    
    -- 审核
    submitted_by VARCHAR(36),
    submitted_at TIMESTAMP,
    reviewed_by VARCHAR(36),
    reviewed_at TIMESTAMP,
    review_comments TEXT,
    
    -- 发布
    published_by VARCHAR(36),
    published_at TIMESTAMP,
    release_notes TEXT,
    
    -- 归档
    archived_at TIMESTAMP,
    archived_reason VARCHAR(500),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uk_version_code UNIQUE (version_code)
);

CREATE INDEX idx_version_status ON idx_index_version(status);
CREATE INDEX idx_version_published ON idx_index_version(published_at);
```

### 4.6 估算应用模块

**估算项目表 (est_estimation):**
```sql
CREATE TABLE est_estimation (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基本信息
    estimation_name VARCHAR(200) NOT NULL,
    estimation_code VARCHAR(50),
    estimation_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    
    -- 项目信息
    project_name VARCHAR(200),
    project_type VARCHAR(20),
    
    -- 地区
    province VARCHAR(50),
    city VARCHAR(50),
    
    -- 时间
    estimation_date DATE,
    target_price_date DATE,
    
    -- 指标版本
    index_version_id VARCHAR(36),
    index_version_code VARCHAR(20),
    
    -- 汇总
    total_area DECIMAL(18,2),
    total_cost DECIMAL(18,2),
    unit_cost DECIMAL(18,2),
    unit_count INTEGER DEFAULT 0,
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    
    -- 备注
    description TEXT,
    remarks TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_est_created ON est_estimation(created_at);
CREATE INDEX idx_est_status ON est_estimation(status);
CREATE INDEX idx_est_user ON est_estimation(created_by);
```

---

## 5. 索引设计

### 5.1 索引原则

| 原则 | 说明 |
|------|------|
| 必要性 | 仅为高频查询创建索引 |
| 选择性 | 选择区分度高的字段 |
| 覆盖性 | 尽量使用覆盖索引 |
| 数量控制 | 单表索引不超过10个 |

### 5.2 索引类型

```sql
-- 主键索引（自动创建）
PRIMARY KEY (id)

-- 唯一索引
CREATE UNIQUE INDEX uk_user_username ON sys_user(username);

-- 普通索引
CREATE INDEX idx_project_name ON prj_project(project_name);

-- 复合索引（注意字段顺序）
CREATE INDEX idx_project_type_status ON prj_project(project_type, status);

-- 部分索引（条件索引）
CREATE INDEX idx_project_active ON prj_project(project_type) 
WHERE is_deleted = FALSE;

-- 表达式索引
CREATE INDEX idx_project_name_lower ON prj_project(LOWER(project_name));

-- GIN索引（用于JSONB）
CREATE INDEX idx_version_quality ON idx_index_version 
USING GIN (quality_distribution);
```

### 5.3 常用查询索引

```sql
-- 项目列表查询
-- WHERE status = ? AND project_type = ? ORDER BY created_at DESC
CREATE INDEX idx_project_list ON prj_project(status, project_type, created_at DESC)
WHERE is_deleted = FALSE;

-- 指标查询
-- WHERE function_tag_code = ? AND space_code = ? AND profession_code = ?
CREATE INDEX idx_cost_index_query ON idx_cost_index(
    function_tag_code, space_code, profession_code, scale_range_code
) WHERE is_deleted = FALSE;
```

---

## 6. 数据完整性

### 6.1 约束设计

```sql
-- 主键约束
PRIMARY KEY (id)

-- 外键约束
CONSTRAINT fk_unit_project 
FOREIGN KEY (project_id) REFERENCES prj_project(id)
ON DELETE CASCADE

-- 唯一约束
CONSTRAINT uk_project_code UNIQUE (project_code)

-- 非空约束
NOT NULL

-- 检查约束
CONSTRAINT ck_area_positive CHECK (total_area > 0)
CONSTRAINT ck_status_valid CHECK (status IN ('draft', 'active', 'archived'))

-- 默认值
DEFAULT CURRENT_TIMESTAMP
DEFAULT 'active'
DEFAULT FALSE
```

### 6.2 触发器

```sql
-- 更新时间自动更新
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_project_updated
    BEFORE UPDATE ON prj_project
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 单方造价自动计算
CREATE OR REPLACE FUNCTION calc_unit_cost()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_area > 0 THEN
        NEW.unit_cost = NEW.total_cost / NEW.total_area;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_project_unit_cost
    BEFORE INSERT OR UPDATE ON prj_project
    FOR EACH ROW
    EXECUTE FUNCTION calc_unit_cost();
```

---

## 7. 数据安全

### 7.1 敏感数据处理

```sql
-- 敏感字段加密存储
-- 使用pgcrypto扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 加密存储示例
UPDATE sys_user SET 
    phone = pgp_sym_encrypt(phone, 'encryption_key')
WHERE phone IS NOT NULL;

-- 解密读取
SELECT pgp_sym_decrypt(phone::bytea, 'encryption_key') as phone
FROM sys_user;
```

### 7.2 数据脱敏

```sql
-- 脱敏视图
CREATE VIEW v_user_safe AS
SELECT 
    id,
    username,
    CONCAT(LEFT(real_name, 1), '**') as real_name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) as phone,
    CONCAT(LEFT(email, 3), '***', SUBSTRING(email FROM POSITION('@' IN email))) as email,
    status,
    created_at
FROM sys_user
WHERE is_deleted = FALSE;
```

### 7.3 行级安全

```sql
-- 启用行级安全
ALTER TABLE prj_project ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能看到自己创建的项目
CREATE POLICY project_owner_policy ON prj_project
    FOR ALL
    TO application_user
    USING (created_by = current_user_id());
```

---

## 8. 性能优化

### 8.1 分区表

```sql
-- 按时间分区（适用于大数据量的日志表）
CREATE TABLE log_operation (
    id VARCHAR(36),
    action VARCHAR(50),
    user_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL,
    -- ...
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE log_operation_2026_01 PARTITION OF log_operation
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE log_operation_2026_02 PARTITION OF log_operation
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 8.2 查询优化

```sql
-- 使用EXPLAIN ANALYZE分析查询
EXPLAIN ANALYZE
SELECT * FROM prj_project
WHERE status = 'active' AND project_type = 'YI'
ORDER BY created_at DESC
LIMIT 20;

-- 避免SELECT *
SELECT id, project_name, total_area, status
FROM prj_project
WHERE status = 'active';

-- 使用EXISTS替代IN
SELECT * FROM prj_project p
WHERE EXISTS (
    SELECT 1 FROM prj_building_unit u 
    WHERE u.project_id = p.id AND u.status = 'completed'
);
```

### 8.3 连接池配置

```yaml
# 数据库连接池配置
datasource:
  pool:
    minimum-idle: 10
    maximum-pool-size: 50
    connection-timeout: 30000
    idle-timeout: 600000
    max-lifetime: 1800000
```

---

## 9. 版本历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-01-17 | 初版 | - |