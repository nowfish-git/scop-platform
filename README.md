# 智慧社区运营平台

> SCOP · Smart Community Operations Platform

本目录是 SCOP 智慧社区运营平台的工作区。**代码仓库**位于 `GIT/` 子目录，**项目资料**（PRD、标准、原型、报告）保留在根目录。

---

## 目录结构

```
智慧社区/
├── README.md (本文件)              ← 工作区入口
│
├── GIT/                            ← 代码仓库（Git 仓库根）
│   ├── apps/                       # 15 个可部署应用
│   ├── packages/                   # 5 个共享库
│   ├── infra/                      # K8s / Terraform / Docker
│   ├── scripts/                    # 工具脚本
│   ├── .github/workflows/          # CI
│   ├── package.json / turbo.json   # Monorepo 根配置
│   ├── docker-compose.yml          # 本地基础设施
│   └── README.md                   # 代码仓库 README
│
├── PRD.docx                        # 产品需求文档 (Word)
├── SCOP_PRD_总结版.docx            # PRD 精简总结
├── 智慧社区运营平台_PRD.html/.md    # PRD 网页/Markdown 版
├── SCOP_开发框架与技术标准.md       # 技术标准规范
├── SCOP_原型效果图.html            # 5端15页高保真原型
├── SCOP_投资分析与商业可行性报告.html  # 商业可行性报告
├── SCOP_财务测算表.xlsx            # 财务测算表
└── 原始架构.png                    # 原始架构图
```

---

## 快速入口

| 关注点 | 位置 |
|------|------|
| **想看产品需求** | `智慧社区运营平台_PRD.html` 或 `PRD.docx` |
| **想看技术标准** | `SCOP_开发框架与技术标准.md` |
| **想看原型图** | `SCOP_原型效果图.html` (浏览器打开) |
| **想看商业分析** | `SCOP_投资分析与商业可行性报告.html` |
| **想写代码** | `GIT/README.md` → 进入代码仓库 |
| **想看 git log** | `cd GIT && git log` |

---

## 状态

- **代码仓库**: M0 仓库初始化完成（develop 分支）
- **远程仓库**: https://github.com/nowfish-git/scop-platform
- **下一里程碑**: M1.1 — user-svc + web-station

> 注：`.git/` 在根目录，仓库实际追踪 `GIT/` 下的代码文件。
