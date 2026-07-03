# @scop/web-station

> SCOP 智慧社区运营平台 — 工作站端 (Web 后台)

## 职责

- 工作站人员日常工作台
- 告警中心（实时告警列表 + 处理）
- 老人档案管理
- 工单管理（创建/派发/处理/回访）
- 设备管理（设备状态、绑定/解绑）

## 端口

`5173` (Vite dev)

## 技术栈

- React 18 + TypeScript 5.4
- Vite 5
- Ant Design 5
- Zustand (状态管理)
- React Query (数据获取)
- React Router 6
- Axios (HTTP 客户端)
- Socket.IO Client (WebSocket)

## 阶段

**M1.1** — 业务实现：登录页 + Dashboard 骨架 + 联调 user-svc
**M2** — 完善：告警/老人/工单/设备完整功能
