# SCOP 智慧社区运营平台 — 开发框架与技术标准

> 基于《智慧社区运营平台 PRD V2.0》规划  
> 版本：v1.0 | 日期：2026-07-02

---

## 目录

1. [整体架构概览](#1-整体架构概览)
2. [技术栈选型](#2-技术栈选型)
3. [项目目录结构](#3-项目目录结构)
4. [编码规范](#4-编码规范)
5. [API 设计规范](#5-api-设计规范)
6. [数据库设计规范](#6-数据库设计规范)
7. [IoT 对接架构](#7-iot-对接架构)
8. [前端开发规范](#8-前端开发规范)
9. [小程序开发规范](#9-小程序开发规范)
10. [Git 分支策略与工作流](#10-git-分支策略与工作流)
11. [CI/CD 方案](#11-cicd-方案)
12. [测试规范](#12-测试规范)
13. [安全规范](#13-安全规范)
14. [附录](#14-附录)

---

## 1. 整体架构概览

### 1.1 系统拓扑

```
┌──────────────────────────────────────────────────────────┐
│                   用户触点层 (Presentation)                │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │
│  │ 老人端    │  │ 家属端    │  │ 工作站  │  │ 运营后台   │  │
│  │ (小程序)  │  │ (小程序)  │  │ (Web)  │  │ (Web)     │  │
│  └────┬─────┘  └────┬─────┘  └───┬────┘  └─────┬─────┘  │
│       └──────────────┴────────────┴──────────────┘       │
├──────────────────────────────────────────────────────────┤
│                API 网关层 (API Gateway)                    │
│              Nginx / Kong / TKE Ingress                   │
├──────────────────────────────────────────────────────────┤
│                  业务服务层 (Services)                     │
│  ┌──────┐ ┌──────┐ ┌────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │用户中 │ │家庭中 │ │服务 │ │社区中 │ │商城中 │ │AI中   │   │
│  │ 心    │ │ 心    │ │中心 │ │ 心    │ │ 心    │ │心     │   │
│  └──────┘ └──────┘ └────┘ └──────┘ └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐ ┌────┐ ┌──────┐ ┌──────────┐        │
│  │消息中 │ │支付中 │ │IoT  │ │告警   │ │设备/订阅  │        │
│  │ 心    │ │ 心    │ │中心 │ │引擎   │ │管理      │        │
│  └──────┘ └──────┘ └────┘ └──────┘ └──────────┘        │
├──────────────────────────────────────────────────────────┤
│                基础设施层 (Infrastructure)                 │
│  ┌──────┐ ┌──────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌──────┐   │
│  │Postgre│ │Redis │ │MQ   │ │Mongo│ │OSS   │ │ELK   │   │
│  │SQL    │ │      │ │     │ │DB   │ │      │ │      │   │
│  └──────┘ └──────┘ └─────┘ └─────┘ └──────┘ └──────┘   │
└──────────────────────────────────────────────────────────┘
```

### 1.2 十中心对应服务

| 中心 | 核心职责 | 微服务名 | 关键数据表 |
|------|---------|---------|-----------|
| 用户中心 | 用户注册/登录/权限/角色 | `user-svc` | users, roles, permissions |
| 家庭中心 | 家庭关系/老人绑定 | `family-svc` | families, elder_relations |
| 服务中心 | 工单/家政/餐饮/活动 | `service-svc` | orders, activities |
| 社区中心 | 社区管理/工作站 | `community-svc` | communities, stations |
| 商城中心 | 套餐/订阅/支付 | `market-svc` | plans, subscriptions |
| IoT中心 | 设备管理/数据采集 | `iot-svc` | devices, device_data |
| AI中心 | 风险预警/推荐 | `ai-svc` | risk_scores, predictions |
| 消息中心 | 通知推送/消息 | `notify-svc` | notifications, templates |
| 支付中心 | 支付对接/结算 | `payment-svc` | payments, bills |
| 数据中心 | 数据看板/报表 | `data-svc` | analytics, reports |

---

## 2. 技术栈选型

### 2.1 后端

| 层次 | 技术选型 | 版本 | 选型理由 |
|------|---------|------|---------|
| **运行时** | Node.js | ≥ 20 LTS | 全栈统一语言，IO密集型场景优势，NPM生态丰富 |
| **框架** | NestJS | ≥ 11 | 模块化/装饰器风格，TypeScript原生支持，GraphQL+WebSocket内置 |
| **语言** | TypeScript | ≥ 5.4 | 类型安全，提升协作效率，降低运行时错误 |
| **ORM** | Prisma | ≥ 5 | 类型安全的数据库客户端，schema-first，Migrate自动化 |
| **API风格** | RESTful + GraphQL | - | 查询类API用GraphQL，命令类API用REST |
| **实时通信** | Socket.IO | - | 告警弹窗/工单状态变更推送 |
| **认证** | Passport + JWT | - | 微信OAuth2 + JWT双通道 |
| **序列化** | class-validator + class-transformer | - | DTO校验与转换 |

### 2.2 IoT 网关

| 组件 | 选型 | 说明 |
|------|------|------|
| MQTT Broker | **EMQX** (或 HiveMQ) | 支持百万级并发连接，MQTT 5.0 |
| IoT协议 | MQTT + CoAP | 设备端MQTT上报，网关向服务推送 |
| 设备影子 | Redis + PostgreSQL | 设备状态快照存Redis，历史数据存PG |
| 规则引擎 | Node.js (NestJS微服务) | 解析设备数据，触发告警规则 |

> 注：如IoT设备使用厂商私有协议，IoT网关层需开发协议适配器。

### 2.3 前端

| 终端 | 框架 | UI库 | 状态管理 | 构建工具 |
|------|------|------|---------|---------|
| **工作站端** (Web) | React 18 + TypeScript | Ant Design Pro 5 | Zustand + React Query | Vite |
| **运营后台** (Web) | React 18 + TypeScript | Ant Design Pro 5 | Zustand + React Query | Vite |
| **商家端** (Web) | React 18 + TypeScript | Ant Design 5 | Zustand + React Query | Vite |
| **老人端** (小程序) | Taro 4 + React | NutUI / Taro UI | - | Taro CLI |
| **家属端** (小程序) | Taro 4 + React | NutUI / Taro UI | - | Taro CLI |

> **选型说明**：Web端统一React + Ant Design，便于组件复用。小程序端使用Taro实现一套代码双端运行（微信 + 支付宝），降低维护成本。

### 2.4 数据层

| 组件 | 选型 | 用途 |
|------|------|------|
| **主数据库** | PostgreSQL 16 (云原生) | 核心业务数据（用户/订单/订阅/工单） |
| **时序数据** | TimescaleDB (PG扩展) | IoT设备上报数据、健康数据时间序列 |
| **缓存** | Redis 7 | Session、设备影子、热点数据、消息队列 |
| **搜索引擎** | Elasticsearch 8 | 告警日志检索、工单全文搜索 |
| **对象存储** | 腾讯云COS / S3兼容 | 设备图片、用户头像、活动图片 |
| **消息队列** | RabbitMQ (或 Redis Stream) | IoT数据缓冲、异步任务、事件驱动 |

### 2.5 DevOps 与云基础设施

| 类别 | 选型 |
|------|------|
| **云平台** | 腾讯云 (TKE + 云数据库 + 消息队列) |
| **容器编排** | Kubernetes (TKE) |
| **CI/CD** | GitHub Actions + ArgoCD |
| **APM** | Prometheus + Grafana + Sentry |
| **日志** | ELK (Elasticsearch + Logstash + Kibana) |
| **API网关** | Nginx / Kong / TKE Ingress |
| **CDN** | 腾讯云CDN (静态资源加速) |

---

## 3. 项目目录结构

### 3.1 Monorepo 根结构

```
scop-platform/                          # 项目根目录
├── apps/                               # 可部署应用
│   ├── api-gateway/                    # API网关
│   ├── user-svc/                       # 用户中心微服务
│   ├── family-svc/                     # 家庭中心微服务
│   ├── service-svc/                    # 服务中心微服务
│   ├── community-svc/                  # 社区中心微服务
│   ├── market-svc/                     # 商城中心微服务
│   ├── iot-svc/                        # IoT中心微服务
│   ├── ai-svc/                         # AI中心微服务
│   ├── notify-svc/                     # 消息中心微服务
│   ├── payment-svc/                    # 支付中心微服务
│   ├── data-svc/                       # 数据中心微服务
│   ├── web-station/                    # 工作站端（React）
│   ├── web-admin/                      # 运营后台（React）
│   ├── web-merchant/                   # 商家端（React）
│   ├── miniapp-elder/                  # 老人端小程序（Taro）
│   └── miniapp-family/                 # 家属端小程序（Taro）
├── packages/                           # 共享库
│   ├── shared-types/                   # 通用类型定义
│   ├── shared-utils/                   # 通用工具函数
│   ├── ui-kit/                         # 通用UI组件
│   ├── api-client/                     # API客户端（前端用）
│   └── config/                         # 共享配置
├── infra/                              # 基础设施
│   ├── k8s/                            # K8s部署配置
│   ├── terraform/                      # Terraform基础设施定义
│   └── docker/                         # Docker相关配置
├── docs/                               # 项目文档
│   ├── architecture/                   # 架构文档
│   ├── api/                            # API文档
│   └── standards/                      # 规范文档
├── scripts/                            # 工具脚本
├── .github/                            # GitHub配置
│   └── workflows/                      # CI/CD流水线
├── turbo.json                          # Turborepo配置
├── package.json                        # 根package.json
├── tsconfig.base.json                  # 基础TypeScript配置
├── .eslintrc.js                        # ESLint配置
├── .prettierrc                         # Prettier配置
└── .commitlintrc.js                    # Commit消息规范
```

### 3.2 微服务内部结构（NestJS）

以 `user-svc` 为例：

```
apps/user-svc/
├── src/
│   ├── main.ts                         # 入口
│   ├── app.module.ts                   # 根模块
│   ├── common/                         # 公共模块
│   │   ├── decorators/                 # 自定义装饰器
│   │   ├── filters/                    # 异常过滤器
│   │   ├── guards/                     # 守卫（鉴权）
│   │   ├── interceptors/              # 拦截器（日志/转换）
│   │   ├── pipes/                      # 管道（校验）
│   │   └── constants/                  # 常量
│   ├── modules/                        # 业务模块
│   │   ├── auth/                       # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.entity.ts
│   │   │   └── strategies/            # Passport策略
│   │   ├── user/                       # 用户模块
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.dto.ts
│   │   │   └── user.entity.ts
│   │   └── role/                       # 角色权限模块
│   │       ├── role.module.ts
│   │       ├── role.controller.ts
│   │       ├── role.service.ts
│   │       └── role.entity.ts
│   └── prisma/                         # Prisma schema
│       └── schema.prisma
├── test/
│   ├── unit/
│   └── e2e/
└── tsconfig.json
```

### 3.3 Web 前端（工作站端示例）

```
apps/web-station/
├── src/
│   ├── main.tsx                        # 入口
│   ├── App.tsx                         # 根组件
│   ├── routes/                         # 路由配置
│   ├── layouts/                        # 布局组件
│   │   ├── MainLayout/
│   │   └── AuthLayout/
│   ├── pages/                          # 页面
│   │   ├── Dashboard/                  # 工作台
│   │   ├── Alert/                      # 告警中心
│   │   ├── Elder/                      # 老人管理
│   │   ├── Device/                     # 设备管理
│   │   ├── Order/                      # 工单管理
│   │   ├── Activity/                   # 活动管理
│   │   └── Settings/                   # 设置
│   ├── components/                     # 通用组件
│   │   ├── AlertPanel/                 # 告警弹窗
│   │   ├── ElderCard/                  # 老人信息卡
│   │   ├── DeviceStatus/              # 设备状态
│   │   └── ChartWidget/               # 图表组件
│   ├── hooks/                          # 自定义Hooks
│   │   ├── useAlerts.ts
│   │   ├── useSocket.ts
│   │   └── useElders.ts
│   ├── stores/                         # Zustand状态
│   │   ├── alertStore.ts
│   │   └── userStore.ts
│   ├── services/                       # API调用
│   │   └── api/
│   ├── types/                          # 类型定义
│   ├── utils/                          # 工具函数
│   └── styles/                         # 样式
├── public/
├── vite.config.ts
└── tsconfig.json
```

---

## 4. 编码规范

### 4.1 通用规则

| 规则 | 标准 |
|------|------|
| **缩进** | 2空格（禁用Tab） |
| **编码** | UTF-8 |
| **行尾** | LF（Unix风格） |
| **文件末尾** | 保留一个空行 |
| **行最大长度** | 120字符（代码），80字符（注释） |
| **引号** | 单引号 `''`（TypeScript/JavaScript） |
| **分号** | 必须加分号 |

### 4.2 TypeScript 规范

- **类型定义优先**：优先使用 `interface` 而非 `type`（可extends）
- **显式返回类型**：函数必须有显式返回类型声明
- **禁用 `any`**：特殊情况使用 `unknown` + 类型守卫
- **枚举使用**：业务常量使用 `const enum`，或 union type
- **命名规范**：

| 类别 | 规范 | 示例 |
|------|------|------|
| 类/接口/类型 | PascalCase | `UserService`, `IUserEntity` |
| 函数/方法/变量 | camelCase | `findUserById()`, `userName` |
| 常量/枚举值 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `ROLE_ADMIN` |
| 私有属性 | `#`前缀（ES私有字段） | `#passwordHash` |
| 文件/目录 | kebab-case | `user.service.ts`, `auth.guard.ts` |

### 4.3 NestJS 规范

- **模块设计**：每个业务域一个 `@Module`，遵循单一职责
- **控制器**：只负责路由与参数校验，不包含业务逻辑
- **服务层**：纯业务逻辑，可注入 Repository / 其他 Service
- **DTO**：使用 `class-validator` 装饰器进行参数校验
- **禁止循环依赖**：模块间严禁循环引用，必要时使用 `@Inject(forwardRef(() => XxxModule))`

### 4.4 React / 前端规范

- **组件类型**：函数组件 + Hooks，禁止 Class Component
- **命名**：组件文件与导出名保持一致（PascalCase）
- **Props类型**：显式定义 `interface ComponentNameProps`
- **样式隔离**：CSS Modules（`*.module.css`）或 Tailwind CSS（统一用 Ant Design token）
- **状态提升**：避免prop drilling，优先使用Zustand
- **数据获取**：统一使用 React Query（TanStack Query）管理服务端状态

---

## 5. API 设计规范

### 5.1 RESTful 设计原则

**URL 格式**：`/api/v1/{资源名}[/{资源ID}][/{子资源}]`

**HTTP动词**：

| 动作 | HTTP方法 | 路径示例 | 说明 |
|------|---------|---------|------|
| 查询列表 | GET | `GET /api/v1/elders` | 分页+过滤 |
| 查询详情 | GET | `GET /api/v1/elders/:id` | 单个资源 |
| 创建 | POST | `POST /api/v1/elders` | 创建资源 |
| 更新 | PUT | `PUT /api/v1/elders/:id` | 全量更新 |
| 部分更新 | PATCH | `PATCH /api/v1/elders/:id` | 部分更新 |
| 删除 | DELETE | `DELETE /api/v1/elders/:id` | 软删除 |

### 5.2 通用请求头

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-Request-Id: <uuid>          # 请求追踪ID
X-Community-Id: <number>      # 当前社区ID
X-Device-Type: web/miniapp    # 客户端类型
```

### 5.3 通用响应结构

**成功响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

**错误响应**：
```json
{
  "code": 40001,
  "message": "老人档案不存在",
  "details": {
    "elderId": "e-001"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 5.4 错误码定义

| 范围 | 含义 |
|------|------|
| 0 | 成功 |
| 1xxxx | 通用错误（参数校验、系统错误） |
| 2xxxx | 用户/认证相关 |
| 3xxxx | 设备/IoT相关 |
| 4xxxx | 工单/服务相关 |
| 5xxxx | 支付/订阅相关 |
| 6xxxx | 社区/工作站相关 |
| 7xxxx | 告警相关 |
| 8xxxx | 消息/通知相关 |
| 9xxxx | 权限/安全相关 |

### 5.5 分页规范

```json
// 请求
GET /api/v1/elders?page=1&pageSize=20&sort=-createdAt

// 响应 meta
"meta": {
  "page": 1,
  "pageSize": 20,
  "total": 156,
  "totalPages": 8
}
```

- 默认 `page=1, pageSize=20`
- 最大 `pageSize=100`
- 排序：`+field`（升序），`-field`（降序）

### 5.6 WebSocket 事件规范（告警推送）

```
事件名: alert:new
数据:
{
  "alertId": "a-001",
  "level": "P0",
  "elderId": "e-001",
  "elderName": "张秀英",
  "deviceType": "smoke",
  "message": "烟感告警 - 疑似火灾",
  "timestamp": "2026-07-02T09:30:00Z"
}

事件名: alert:status_change
数据:
{
  "alertId": "a-001",
  "fromStatus": "pending",
  "toStatus": "processing",
  "operator": "李工作",
  "timestamp": "2026-07-02T09:30:30Z"
}
```

---

## 6. 数据库设计规范

### 6.1 通用约定

| 规范 | 说明 |
|------|------|
| **命名** | 表名：`snake_case` 复数（`users`, `elder_devices`） |
| **主键** | 自增 BIGINT 或 ULID（分布式场景） |
| **时间戳** | 每张表必须有 `created_at` 和 `updated_at` |
| **软删除** | 每张表使用 `deleted_at`（nullable timestamp） |
| **字符集** | PostgreSQL 默认 UTF-8 |
| **索引前缀** | `idx_`（普通索引），`uniq_`（唯一索引），`idx_${table}_${field}` |
| **外键** | 必须加索引，使用 `ON DELETE RESTRICT`（避免误删） |

### 6.2 核心表结构示例

#### 用户表 `users`

```sql
CREATE TABLE users (
  id          BIGSERIAL PRIMARY KEY,
  phone       VARCHAR(20) NOT NULL,
  password    VARCHAR(255),           -- bcrypt hash，小程序用户可为空
  name        VARCHAR(50) NOT NULL,
  avatar      VARCHAR(500),
  role        VARCHAR(20) NOT NULL DEFAULT 'elder',  -- elder/family/staff/admin/merchant
  status      VARCHAR(20) NOT NULL DEFAULT 'active', -- active/disabled/deleted
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX uniq_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
```

#### 设备数据表 `device_data` （TimescaleDB 时序表）

```sql
-- TimescaleDB hypertable
CREATE TABLE device_data (
  time        TIMESTAMP WITH TIME ZONE NOT NULL,
  device_id   BIGINT NOT NULL,
  elder_id    BIGINT NOT NULL,
  device_type VARCHAR(20) NOT NULL,     -- smoke/door_sensor/button/wearable
  data        JSONB NOT NULL,           -- 设备上报的原始数据
  is_abnormal BOOLEAN DEFAULT FALSE
);

SELECT create_hypertable('device_data', 'time');

CREATE INDEX idx_device_data_device_id ON device_data(device_id, time DESC);
CREATE INDEX idx_device_data_elder ON device_data(elder_id, time DESC);
```

#### 告警表 `alerts`

```sql
CREATE TABLE alerts (
  id            BIGSERIAL PRIMARY KEY,
  community_id  BIGINT NOT NULL,
  elder_id      BIGINT NOT NULL,
  device_id     BIGINT,
  alert_level   VARCHAR(5) NOT NULL,     -- P0/P1/P2
  alert_type    VARCHAR(50) NOT NULL,    -- smoke/fire/door_unusual/fall/sos/health_abnormal
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
                                          -- pending/processing/review/closed
  source        VARCHAR(20) NOT NULL,    -- device/manual/system
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  occurred_at   TIMESTAMP WITH TIME ZONE NOT NULL,
  confirmed_at  TIMESTAMP WITH TIME ZONE,
  confirmed_by  BIGINT,
  closed_at     TIMESTAMP WITH TIME ZONE,
  closed_by     BIGINT,
  handle_result TEXT,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_alerts_community_status ON alerts(community_id, status, alert_level);
CREATE INDEX idx_alerts_elder ON alerts(elder_id, occurred_at DESC);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
```

### 6.3 数据库选型映射

| 数据类型 | 存储方案 | 说明 |
|---------|---------|------|
| 业务核心数据 | PostgreSQL | 用户/社区/工单/订阅 |
| IoT时序数据 | TimescaleDB | 设备上报数据流 |
| 设备实时状态 | Redis Hash | 设备影子 |
| 会话/Cache | Redis | Token、权限缓存 |
| 告警日志 | Elasticsearch | 全文搜索+聚合 |
| 文件/图片 | COS/S3 | 头像、设备照片 |
| 消息队列 | RabbitMQ | IoT事件缓冲、异步任务 |

---

## 7. IoT 对接架构

### 7.1 数据流

```
IoT设备 → MQTT Broker (EMQX) → IoT网关服务 → Redis(设备影子) + RabbitMQ
                                                      ↓
                                              规则引擎服务
                                                      ↓
                                          ┌───────────────┐
                                          │ 数据写入      │ 正常数据 → TimescaleDB
                                          │  判断          │
                                          │               │ 异常 → 生成告警 → 告警服务
                                          └───────────────┘
```

### 7.2 设备数据协议

```json
{
  "deviceId": "SN20260701001",
  "type": "smoke",
  "timestamp": "2026-07-02T09:30:00Z",
  "data": {
    "smokeLevel": 0.5,
    "battery": 85,
    "temperature": 28,
    "signal": -65
  }
}
```

### 7.3 设备绑定流程

1. 工作人员扫码获取设备SN
2. 调用 `POST /api/v1/devices/bind` 绑定到老人账户
3. IoT中心将设备SN注册到EMQX认证列表
4. 设备首次上报时自动建立设备影子
5. 绑定后30秒内设备数据正常入库

### 7.4 告警规则引擎

| 设备类型 | 告警条件 | 级别 |
|---------|---------|------|
| 烟感 | smokeLevel > 0.8 持续3秒 | P0 |
| 门磁 | 门开超过30分钟未关 | P1 |
| 紧急按钮 | 按钮按下 | P0 |
| 穿戴设备 | 心率 > 120 或 < 40 持续1分钟 | P0 |
| 穿戴设备 | 跌倒检测触发 | P0 |
| 穿戴设备 | 24小时无活动 | P1 |
| 所有设备 | 离线超过15分钟 | P2 |

---

## 8. 前端开发规范

### 8.1 组件设计规约

- **原子设计**：按 Atomic Design 思想组织组件
  - Atoms: Button, Input, Icon
  - Molecules: SearchBar, DeviceCard
  - Organisms: AlertPanel, ElderInfoCard
  - Templates: AlertListTemplate
  - Pages: AlertCenterPage
- **容器/展示分离**：数据获取在容器组件，渲染在展示组件
- **Ant Design 定制**：统一通过 ConfigProvider 设置 theme token

### 8.2 WebSocket 集成

```typescript
// hooks/useSocket.ts
export function useSocket() {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(API_GATEWAY, {
      path: '/ws',
      auth: { token: getAccessToken() },
      transports: ['websocket'],
    });
    return () => { socket.current?.disconnect(); };
  }, []);

  return socket.current;
}
```

### 8.3 响应式适配

| 终端 | 分辨率 | 适配方案 |
|------|--------|---------|
| 工作站端 | ≥ 1366×768 | 固定宽度 + 弹性布局 |
| 运营后台 | ≥ 1440×900 | 固定宽度 + 弹性布局 |
| 小程序 | 自适应 | 弹性布局 + rpx |

---

## 9. 小程序开发规范

### 9.1 技术约束

- **老人端**：字体 ≥ 18px，按钮触控区域 ≥ 44×44px（WCAG 无障碍要求）
- **家属端**：支持复杂图表展示（健康趋势图）
- **双端复用**：Taro 4 + React 实现一套代码多端运行
- **分包加载**：主包 ≤ 2MB，分包加载

### 9.2 老人端（极简模式）

```
核心页面：首页(SOS) → 健康页 → 我的
- 首页：大字体SOS按钮 + 天气/问候 + 快捷入口
- 健康页：步数/心率/血压（大卡片展示）
- 我的：绑定家属/设备信息/设置
```

### 9.3 家属端

```
核心页面：首页 → 健康 → 设备 → 我的
- 首页：绑定老人状态卡片、最近告警
- 健康：趋势图表（日/周/月）、异常标记
- 设备：设备列表、状态、绑定
- 我的：个人信息、设置
```

---

## 10. Git 分支策略与工作流

### 10.1 分支模型（Trunk-based + Feature Branch）

```
main              ← 生产分支，保护，PR合并
  ├── release/    ← 预发布分支（可选）
  ├── develop     ← 开发主分支，保护，CI通过后合并
  │    ├── feat/user-auth      ← 功能分支
  │    ├── feat/alert-engine   ← 功能分支
  │    ├── fix/device-timeout  ← 修复分支
  │    └── chore/deps-update   ← 杂务分支
  └── hotfix/     ← 紧急修复分支（从main创建，修复后合并回main+develop）
```

### 10.2 Commit 规范（Conventional Commits）

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | 使用场景 |
|------|---------|
| `feat` | 新功能 |
| `fix` | Bug修复 |
| `refactor` | 重构（不新增功能也不修bug） |
| `perf` | 性能优化 |
| `style` | 格式调整（无代码逻辑变更） |
| `test` | 测试相关 |
| `docs` | 文档变更 |
| `chore` | 构建/CI/依赖管理 |
| `ci` | CI配置变更 |

**示例**：
```
feat(user): 实现微信小程序OAuth登录

- 新增微信登录接口 POST /api/v1/auth/wechat
- 集成微信小程序登录凭证校验
- 首次登录自动创建用户账号

Closes #123
```

### 10.3 PR 规范

- PR标题按 Conventional Commits 命名
- 必须有描述（做了什么、为什么、如何测试）
- 关联 Issue 或 Jira Ticket
- 至少 1 人 Code Review 后方可合并
- Squash Merge 到 develop/main

---

## 11. CI/CD 方案

### 11.1 流水线设计

```
                            GitHub Actions
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                On PR / Push main          Tag 发布
                        │                       │
            ┌───────────┴───────────┐           │
            │                       │           │
       Lint + Type Check       Unit Test        │
            │                       │           │
       Build (Docker)       Integration Test    │
            │                       │           │
       Image Push            E2E Test           │
            │                       │           │
            └───────────┬───────────┘           │
                        │                       │
                   Deploy to Staging     Deploy to Production
                        │
                   Smoke Test
```

### 11.2 环境配置

| 环境 | 用途 | 部署方式 | 数据库 |
|------|------|---------|-------|
| `dev` | 本地开发 | Docker Compose | 本地PG |
| `test` | 集成测试 | CI自动部署 | 测试PG |
| `staging` | 预发布 | ArgoCD自动同步 | 预发布PG |
| `production` | 生产 | ArgoCD + 人工审批 | 生产PG + 从库 |

### 11.3 容器化

- 每个微服务独立 Dockerfile（多阶段构建）
- 基础镜像：`node:20-alpine`
- 镜像Tag规范：`{service-name}:{git-sha}` / `{service-name}:{semver}`

---

## 12. 测试规范

### 12.1 测试金字塔

```
       ╱── E2E (5%) ──╲           —— Cypress (Web) / Minium (小程序)
      ╱ Integration (15%) ╲       —— Supertest + 测试数据库
     ╱── Unit Test (80%) ──╲      —— Jest + Vitest
```

### 12.2 覆盖率目标

| 层级 | 行覆盖率 | 分支覆盖率 |
|------|---------|-----------|
| 核心业务逻辑（告警/工单/支付） | ≥ 90% | ≥ 85% |
| 一般业务逻辑 | ≥ 80% | ≥ 75% |
| UI组件 | ≥ 70% | - |

### 12.3 测试框架选型

| 层 | 工具 | 说明 |
|----|------|------|
| 后端Unit | Jest | NestJS默认测试框架 |
| 后端Integration | Supertest | HTTP接口测试 |
| 前端Unit | Vitest | 快速，Vite生态兼容 |
| E2E（Web） | Playwright | 跨浏览器自动化测试 |
| E2E（小程序） | Minium | 微信官方测试框架 |

---

## 13. 安全规范

### 13.1 认证与授权

| 终端 | 认证方式 | 说明 |
|------|---------|------|
| 工作站端 | 账号密码 + JWT | Token 24h过期，支持刷新 |
| 运营后台 | 账号密码 + JWT | Token 24h过期 |
| 老人端 | 微信静默登录 + JWT | 首次需绑定手机号 |
| 家属端 | 微信静默登录 + JWT | 首次需绑定老人 |
| 商家端 | 账号密码 + JWT | 需审核通过 |

### 13.2 数据权限（SEC-06）

```typescript
// 工作站人员仅可查看本社区
@Get('elders')
@UseGuards(JwtAuthGuard, CommunityGuard)  // CommunityGuard 自动注入 community_id
async getElders(@CommunityId() communityId: number) {
  return this.elderService.findByCommunity(communityId);
}

// 家属仅可查看绑定的老人
@Get('elders/:id/health')
@UseGuards(JwtAuthGuard, FamilyGuard)  // FamilyGuard 校验当前用户是否绑定该老人
async getHealth(@ElderId() elderId: number) {
  return this.healthService.getData(elderId);
}
```

### 13.3 敏感数据加密

- 身份证号：AES-256-CBC 加密存储
- 联系电话：AES-256-CBC 加密存储
- 密码：bcrypt（cost factor ≥ 10）
- 健康数据：传输层TLS加密，数据库静态加密
- 手机号：脱敏展示（`138****1234`）

### 13.4 操作审计

所有敏感操作记录到 `audit_logs` 表：

```sql
CREATE TABLE audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  operator_id BIGINT NOT NULL,
  action      VARCHAR(50) NOT NULL,   -- elder_view / elder_edit / alert_process / plan_modify
  target_type VARCHAR(50),             -- elder / alert / plan
  target_id   BIGINT,
  detail      JSONB,                   -- 操作前后的数据快照
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_operator ON audit_logs(operator_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
```

审计日志为**追加写入，物理不可删除**（通过数据库权限控制）。

---

## 14. 附录

### 14.1 关键技术版本锁定

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| Node.js ≥ 20 LTS | 20.x | LTS长期支持 |
| TypeScript | ≥ 5.4 | 支持显式密封类型 |
| NestJS | ≥ 11 | 最新长期支持 |
| React | ≥ 18 | Concurrent Mode |
| Prisma | ≥ 5 | Relation Mode |
| PostgreSQL | ≥ 16 | 最新稳定版 |
| Redis | ≥ 7 | Redis Stack支持JSON |
| Taro | ≥ 4 | 支持React 18 |

### 14.2 推荐开发环境

- IDE: VS Code + 推荐插件（ESLint, Prettier, Prisma, Tailwind CSS IntelliSense）
- 包管理: pnpm（Monorepo场景性能优于npm/yarn）
- 节点管理: fnm（Fast Node Manager）
- 容器化: Docker Desktop + Docker Compose
- 数据库GUI: TablePlus / DBeaver

### 14.3 关键项目配置

**`.eslintrc.js` 核心规则**：
- no-console: warn（生产代码禁止console）
- @typescript-eslint/no-explicit-any: error
- @typescript-eslint/explicit-function-return-type: warn
- prettier/prettier: error

**`tsconfig.base.json` 核心配置**：
- target: ES2022
- module: NodeNext
- strict: true
- noUncheckedIndexedAccess: true
- paths: `@app/*` 映射

---

> 本文档将作为SCOP项目的技术纲领，后续根据实际开发反馈持续迭代。  
> 下一阶段：输出 **M1里程碑（基础框架）** 的详细技术设计文档。
