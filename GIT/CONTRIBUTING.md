# 贡献指南

## 开发环境

- **Node.js** >= 20.0.0 (推荐使用 [fnm](https://github.com/Schniz/fnm) 管理版本)
- **pnpm** >= 9.0.0 (`corepack enable && corepack prepare pnpm@9 --activate`)
- **Docker Desktop** (用于启动本地基础设施)

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动本地基础设施 (PostgreSQL / Redis / EMQX / Elasticsearch)
pnpm docker:up

# 3. 启动开发服务
pnpm dev
```

## 分支策略 (Trunk-based + Feature Branch)

```
main            ← 生产分支，保护
  ├── release/  ← 预发布分支 (可选)
  ├── develop   ← 开发主分支，保护
  │    ├── feat/<scope>-<description>   ← 功能分支
  │    ├── fix/<scope>-<description>    ← 修复分支
  │    └── chore/<scope>-<description>  ← 杂务分支
  └── hotfix/<description>              ← 紧急修复分支
```

1. 从 `develop` 创建功能分支: `feat/<scope>-<description>`
2. 开发完成后发起 PR 到 `develop`
3. 至少 **1 人 Code Review** 后 Squash Merge
4. `develop` 稳定后合并到 `main` 打 Tag 发布
5. 紧急 Bug 走 `hotfix/*` → 同时合并到 `main` + `develop`

## Commit 规范 (Conventional Commits)

格式: `<type>(<scope>): <description>`

### Type

| Type      | 用途             |
| --------- | ---------------- |
| feat      | 新功能           |
| fix       | Bug 修复         |
| refactor  | 重构             |
| perf      | 性能优化         |
| style     | 代码格式         |
| test      | 测试             |
| docs      | 文档             |
| chore     | 构建/依赖        |
| ci        | CI 配置          |
| build     | 构建系统         |
| revert    | 回退             |

### Scope

- **微服务**: `user`, `family`, `service`, `community`, `market`, `iot`, `ai`, `notify`, `payment`, `data`
- **前端**: `web-station`, `web-admin`, `web-merchant`, `miniapp-elder`, `miniapp-family`
- **共享包**: `shared-types`, `shared-utils`, `api-client`, `ui-kit`, `config`
- **基础设施**: `deps`, `ci`, `docs`, `infra`, `root`

### 示例

```bash
feat(user): 实现微信小程序 OAuth 登录
fix(alert): 修复告警状态流转 P0->pending 异常
chore(deps): 升级 Prisma 到 5.18.0
docs(readme): 补充快速开始文档
ci(github): 添加 Node.js 缓存优化
```

## 代码规范

- TypeScript **严格模式** (`strict: true`)
- **禁止 `any`** (特殊情况使用 `unknown` + 类型守卫)
- 所有函数必须有 **显式返回类型** 声明
- **NestJS**: Controller 只做路由和参数校验，业务逻辑在 Service
- **React**: 函数组件 + Hooks，Props 显式定义 interface
- **导入顺序**: builtin → external → internal → parent → sibling → index

## 测试要求

- 核心业务逻辑行覆盖率 >= **80%**
- PR 中新增/修改的代码必须有对应测试
- CI 中所有测试必须通过

## PR 模板

详见 [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)

## 环境变量

- 复制 `.env.example` 为 `.env` 并填入本地配置
- **不要**把真实凭据提交到仓库
