/**
 * web-station 入口占位
 * 实际 React 渲染代码将在 M1.1 阶段填充
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

function Placeholder(): React.ReactElement {
  return React.createElement('div', null, 'SCOP 工作站 — M0 骨架占位 (M1.1 业务实现)');
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(React.createElement(Placeholder));
}

export {};
