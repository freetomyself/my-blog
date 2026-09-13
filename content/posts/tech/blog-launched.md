---
title: "博客发布成功：第一篇测试文章"
date: 2026-09-13
tags: ["博客", "Hugo"]
categories: ["技术笔记"]
summary: "这是博客的第一篇测试文章，用于验证 Markdown 解析、代码高亮、标签分类和评论功能是否正常工作。"
---

## 文章目的

这篇文章用于验证博客的完整发布流程，包括：

- Markdown 渲染
- 代码高亮
- 标签和分类
- Giscus 评论区
- 搜索功能

## Markdown 渲染测试

**加粗文字**、*斜体文字*、~~删除线~~

[这是一个链接](https://github.com/freetomyself/my-blog)

> 这是一段引用文字，用于测试引用块样式。

### 列表测试

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2

### 表格测试

| 命令 | 用途 |
|------|------|
| `hugo server` | 启动本地预览 |
| `git push` | 推送部署 |

## 代码高亮测试

### Bash

```bash
# 启动本地预览
hugo server -D

# 推送到 GitHub 自动部署
git add .
git commit -m "post: 博客发布成功"
git push origin main
```

### YAML

```yaml
---
title: "文章标题"
date: 2026-09-13
tags: ["标签1", "标签2"]
categories: ["技术笔记"]
---
```

### JSON

```json
{
  "name": "my-blog",
  "theme": "PaperMod",
  "deploy": "GitHub Pages"
}
```

## 技术栈回顾

| 组件 | 选型 |
|------|------|
| 静态站点生成器 | Hugo |
| 主题 | PaperMod |
| 部署 | GitHub Pages |
| 评论 | Giscus |
| 搜索 | Fuse.js |

## 结语

如果你能看到这篇文章，说明博客的发布流程已经完全打通。

欢迎在下方评论区留言测试。
