# @scop/iot-svc

> SCOP 智慧社区运营平台 — IoT 中心微服务

## 职责

- 设备注册与绑定（扫码绑定 4 种设备：烟感/门磁/紧急按钮/穿戴手环）
- MQTT 数据采集（对接 EMQX）
- 设备影子管理 (Redis Hash)
- 设备状态监控（在线/离线/低电量）
- 设备数据入库 (TimescaleDB)

## 端口

`3013`

## 数据表

- `devices`
- `device_data` (TimescaleDB hypertable)

## 外部依赖

- EMQX MQTT Broker (1883)
- TimescaleDB

## 阶段

**M3** — 业务实现
