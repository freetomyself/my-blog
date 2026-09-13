# 个人博客 — 设计文档

## 1. 项目概述

为运维工程师打造的简约个人博客，支持混合内容（技术笔记、运维实践、生活随笔），预估几百篇文章规模，部署于 GitHub Pages 并通过 Cloudflare 加速，视觉风格极简黑白。

## 2. 目标

- 极简阅读体验，黑白为主，减少视觉干扰
- 内容组织清晰，标签/分类/搜索快速定位
- 零服务器运维成本，推送即部署
- 用户可自选主题（亮/暗/跟随系统）

## 3. 技术选型

| 维度 | 选型 | 理由 |
|------|------|------|
| 静态站点生成器 | **Hugo** | 单二进制、构建极快（几百篇文章毫秒级）、运维友好 |
| 主题 | 基于 **PaperMod** 二次定制 | 极简黑白基因、响应式、内置搜索/归档/RSS |
| 部署 | **GitHub Pages** | 免费、与 Git 工作流天然契合 |
| CDN | **Cloudflare** | 免费 CDN、自定义域名、自动 HTTPS |
| 评论 | **Giscus** | 基于 GitHub Discussions，零后端，免费 |
| 搜索 | **Fuse.js**（客户端全文搜索） | 无后端依赖，离线可用 |
| 统计 | **Umami Cloud**（可选） | 轻量隐私友好的访问统计 |

## 4. 架构设计

```
用户请求
   │
   ▼
Cloudflare CDN (缓存 + HTTPS + 防护)
   │
   ▼
GitHub Pages (静态文件托管)
   │
   ▼
Hugo 生成的静态站点
   ├── /posts/          文章列表（分页）
   ├── /posts/<slug>/   文章详情
   ├── /tags/           标签云
   ├── /categories/     分类
   ├── /archive/        归档（按年月）
   ├── /about/          关于我
   ├── /search/         全文搜索
   ├── /index.xml       RSS
   └── /pagefind.json   搜索索引
```

## 5. 页面结构

### 5.1 首页
- 顶部：站点标题 + 导航（首页/归档/标签/关于/搜索）
- 中部：文章列表（按时间倒序，分页）
  - 每篇显示：标题、日期、摘要（2-3行）、标签
- 底部：分页控件 + 版权信息

### 5.2 文章详情页
- 标题、日期、阅读时长、标签
- 正文（Markdown 渲染，代码高亮）
- 上一篇/下一篇导航
- 评论区（Giscus）

### 5.3 标签/分类页
- 标签云（按文章数显示大小）
- 点击标签 → 过滤后的文章列表

### 5.4 归档页
- 按年-月分组的时间线
- 适合浏览历史内容

### 5.5 搜索页
- 搜索框 + 实时结果
- Fuse.js 客户端搜索，匹配标题/摘要/正文

### 5.6 关于我
- 个人简介
- 技能栈
- 社交链接（GitHub、邮箱等）

## 6. 视觉设计

### 6.1 配色方案

| 模式 | 背景 | 文字 | 链接 | 强调色 |
|------|------|------|------|--------|
| 亮色 | `#FFFFFF` | `#1A1A1A` | `#333333` | `#000000` |
| 暗色 | `#1A1A1A` | `#E0E0E0` | `#A0A0A0` | `#FFFFFF` |

- 代码块：亮色 `#F5F5F5` / 暗色 `#2D2D2D`
- 边框：亮色 `#E0E0E0` / 暗色 `#333333`

### 6.2 主题切换
- 默认：跟随系统 `prefers-color-scheme`
- 用户可通过顶部按钮手动切换（亮/暗/自动）
- 选择存入 `localStorage`，下次访问保持

### 6.3 字体
- 正文：系统字体栈（PingFang SC / Microsoft YaHei / sans-serif）
- 代码：`JetBrains Mono` / `Consolas` / `monospace`
- 字号：正文 16px，行高 1.8

### 6.4 布局
- 最大内容宽度：720px（阅读舒适区）
- 移动端：全宽自适应
- 导航：顶部固定，滚动时半透明背景

## 7. 功能模块

### 7.1 内容组织
```
content/
├── posts/           # 技术文章
│   ├── ops/         # 运维实践
│   ├── tech/        # 技术笔记
│   └── life/        # 生活随笔
├── about.md         # 关于我
└── archive.md       # 归档页
```

- 每篇文章 frontmatter：
```yaml
title: "文章标题"
date: 2026-09-13
tags: ["Linux", "Docker"]
categories: ["运维"]
summary: "文章摘要..."
draft: false
```

### 7.2 评论系统（Giscus）
- 基于 GitHub Discussions
- 需要：GitHub 仓库启用 Discussions + 创建 Giscus App
- 配置项：repo、repoId、category、categoryId
- 支持：Markdown、表情、@提及、编辑历史

### 7.3 搜索（Fuse.js）
- 构建时生成 `fuse.json` 索引
- 搜索范围：标题、摘要、标签
- 支持模糊匹配、关键词高亮

### 7.4 RSS
- 自动生成 `index.xml`
- 包含最近 20 篇文章
- 支持全文或摘要输出（可配置）

## 8. 部署流程

### 8.1 GitHub 仓库结构
```
my-blog/
├── content/          # 文章源文件
├── layouts/          # 模板定制
├── static/           # 静态资源
├── themes/           # 主题
├── hugo.toml         # 站点配置
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions 自动部署
```

### 8.2 CI/CD 流程
```
git push → GitHub Actions → Hugo Build → Deploy to Pages
```

- 每次推送 main 分支自动触发
- 构建产物：`public/` 目录
- 部署目标：GitHub Pages

### 8.3 Cloudflare 配置
1. 域名 DNS 指向 GitHub Pages（CNAME 记录）
2. 开启 Cloudflare 代理（橙色云）
3. 配置 SSL/TLS：Full (strict)
4. 缓存规则：静态资源缓存 1 年，HTML 缓存 1 小时
5. 开启 Brotli 压缩

## 9. 技术难点与风险

| 风险 | 应对 |
|------|------|
| 几百篇文章搜索索引体积大 | Fuse.js 索引只含标题+摘要，正文搜索用分页加载 |
| GitHub Pages 构建超时 | Hugo 构建快，通常 <5s，无风险 |
| Cloudflare 缓存导致内容不更新 | HTML 短缓存 + 部署后手动刷新 Cloudflare 缓存 |
| Giscus 依赖 GitHub 可用性 | 可接受，GitHub SLA 足够 |
| 中文搜索分词 | Fuse.js 支持中文字符级匹配，效果可接受 |

## 10. 后续扩展（可选）

- 站内暗色模式手动切换按钮
- 文章目录（TOC）
- 图片懒加载
- 多语言支持
- 404 页面定制

## 11. 验收标准

- [ ] 首页正常显示文章列表，分页工作
- [ ] 文章详情页渲染 Markdown，代码高亮
- [ ] 标签/分类过滤正常
- [ ] 搜索功能可用
- [ ] 评论区加载并可提交
- [ ] 主题切换（亮/暗/跟随系统）正常
- [ ] RSS 订阅可被 Feedly 等阅读器解析
- [ ] 移动端响应式正常
- [ ] GitHub Actions 自动部署成功
- [ ] Cloudflare CDN 生效（访问速度 <1s）
