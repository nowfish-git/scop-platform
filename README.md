# SCOP 智慧社区运营平台

> Smart Community Operations Platform

基于 Monorepo 的智慧社区综合运营平台。

## 仓库结构

```
├── apps/             # 15 个可部署应用
├── packages/         # 5 个共享库
├── infra/            # 基础设施
├── scripts/          # 工具脚本
└── .github/          # CI/CD
```

## 系统分支

### 后端微服务（10 中心）

| 中心        | 服务                  | 端口  | 阶段  |
| ----------- | --------------------- | ----- | ----- |
| 用户中心    | `apps/user-svc`       | 3001  | M1.1  |
| 家庭中心    | `apps/family-svc`     | 3010  | M2    |
| 服务中心    | `apps/service-svc`    | 3011  | M2    |
| 社区中心    | `apps/community-svc`  | 3002  | M2    |
| 商城中心    | `apps/market-svc`     | 3012  | M3    |
| IoT 中心    | `apps/iot-svc`        | 3013  | M3    |
| AI 中心     | `apps/ai-svc`         | 3014  | M3    |
| 消息中心    | `apps/notify-svc`     | 3004  | M2    |
| 支付中心    | `apps/payment-svc`    | 3008  | M3    |
| 数据中心    | `apps/data-svc`       | 3009  | M3    |

### 前端应用（5 端）

| 端        | 应用                     | 端口  | 技术栈                  | 阶段  |
| --------- | ------------------------ | ----- | ----------------------- | ----- |
| 工作站端  | `apps/web-station`       | 5173  | React 18 + AntD 5       | M1.1  |
| 运营后台  | `apps/web-admin`         | 5174  | React 18 + AntD Pro 5   | M2    |
| 商家端    | `apps/web-merchant`      | 5175  | React 18 + AntD 5       | M3    |
| 老人端    | `apps/miniapp-elder`     | -     | Taro 4 + NutUI          | M2    |
| 家属端    | `apps/miniapp-family`    | -     | Taro 4 + NutUI          | M3    |

### API 网关

| 网关          | 应用                | 端口  | 阶段  |
| ------------- | ------------------- | ----- | ----- |
| API Gateway   | `apps/api-gateway`  | 3000  | M3    |

### 共享包

| 包                    | 说明                          | 阶段  |
| --------------------- | ----------------------------- | ----- |
| `@scop/config`        | ESLint/TS/Prettier 配置       | M1    |
| `@scop/shared-types`  | 通用类型定义                  | M1    |
| `@scop/shared-utils`  | 通用工具函数                  | M1    |
| `@scop/api-client`    | 前端 API SDK                  | M2    |
| `@scop/ui-kit`        | 通用 UI 组件                  | M2    |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动本地基础设施 (PostgreSQL / Redis / EMQX / Elasticsearch)
pnpm docker:up

# 启动开发
pnpm dev
```

## 文档

- [`智慧社区运营平台_PRD.md`](./智慧社区运营平台_PRD.md) — 产品需求
- [`SCOP_开发框架与技术标准.md`](./SCOP_开发框架与技术标准.md) — 技术标准
- [`SCOP_原型效果图.html`](./SCOP_原型效果图.html) — 5 端 15 页原型
- [`SCOP_投资分析与商业可行性报告.html`](./SCOP_投资分析与商业可行性报告.html) — 商业分析
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — 贡献指南

## 阶段路线图

- **M0** (本提交) — 仓库初始化 + 骨架
- **M1.1** — `user-svc` (Prisma + JWT) + `web-station` (登录页) 业务实现
- **M2** — 5 个核心微服务 + Web 端完善 + 老人端小程序
- **M3** — IoT/AI/支付/数据微服务 + API 网关 + K8s 部署 + 监控

## 许可证

Private — All Rights Reserved
