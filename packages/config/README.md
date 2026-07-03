# @scop/config

> SCOP 共享配置 (ESLint / TypeScript / Prettier)

提供给所有 apps 和 packages 继承的共享配置。

## 使用方式

在 app/package 的配置文件中继承:

**ESLint** (`.eslintrc.js`):
```javascript
module.exports = {
  extends: ['@scop/config/eslint-preset'],
};
```

**Prettier** (`.prettierrc.js`):
```javascript
module.exports = require('@scop/config/prettier-preset');
```

## 阶段

M0 骨架占位 — 基础配置已就位
