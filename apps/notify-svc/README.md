# @scop/notify-svc

> SCOP 智慧社区运营平台 — 消息中心微服务

## 职责

- 站内通知 (WebSocket 实时推送)
- 微信小程序订阅消息
- 短信通道 (P0 告警)
- 通知模板管理
- 多通道路由策略

## 端口

`3004`

## 数据表

- `notifications` (站内通知)
- `templates` (消息模板)
- `push_logs` (推送日志)

## 阶段

**M2** — 业务实现
