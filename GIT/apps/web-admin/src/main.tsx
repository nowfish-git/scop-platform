import React from 'react';
import ReactDOM from 'react-dom/client';

function Placeholder(): React.ReactElement {
  return React.createElement('div', null, 'SCOP 运营后台 — M0 骨架占位');
}

const root = document.getElementById('root');
if (root) ReactDOM.createRoot(root).render(React.createElement(Placeholder));

export {};
