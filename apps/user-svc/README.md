# @scop/user-svc

> SCOP 智慧社区运营平台 — 用户中心微服务

## 职责

- 用户注册/登录（账号密码 + 微信小程序 OAuth）
- JWT Token 签发与刷新
- 用户档案管理（基础信息、角色、状态）
- 多端认证（工作站/运营后台/商家端密码登录，老人/家属端微信登录）

## 端口

`3001`

## 技术栈

- NestJS 11 + TypeScript 5.4
- Prisma 5 + PostgreSQL 16
- Passport + JWT
- bcrypt 密码加密

## 数据表

- `users` (主表)
- `roles`, `permissions` (RBAC)

## 上游

无（基础服务）

## 下游消费

- `api-gateway` (M3)
- 所有需要用户认证的前端 (web-station, web-admin, web-merchant, miniapp-elder, miniapp-family)
- 其他微服务之间的用户信息查询

## 启动

```bash
cd apps/user-svc
pnpm dev
```

## 阶段

**M1.1** — 业务实现：Prisma Schema + auth/user 模块 + 登录注册接口 + JWT
