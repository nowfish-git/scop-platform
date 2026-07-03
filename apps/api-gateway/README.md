# @scop/api-gateway

> SCOP 智慧社区运营平台 — API 网关

## 职责

- 统一入口路由（前端请求 → 内部微服务）
- JWT 鉴权统一拦截
- 限流与熔断
- 跨域处理
- 日志聚合

## 端口

`3000`

## 技术选型

- **M3 候选**: Kong / Nginx + Lua / 自建 NestJS 网关 / TKE Ingress

## 上游

前端应用 (web-station / web-admin / web-merchant / miniapp-elder / miniapp-family)

## 下游

所有 10 个微服务

## 阶段

**M3** — 待 user-svc 等核心服务稳定后实现
