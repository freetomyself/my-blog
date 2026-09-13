---
title: "写作指南"
date: 2026-09-13
layout: "page"
ShowDate: false
ShowReadingTime: false
ShowToc: true
---

## 快速发布文章

```bash
# 1. 创建新文章
hugo new content posts/ops/my-article.md

# 2. 编辑文章，写入内容

# 3. 推送自动部署
git add .
git commit -m "post: 文章标题"
git push origin main
```

推送后约 1-2 分钟自动上线。

## 文章模板

```yaml
---
title: "文章标题"
date: 2026-09-13
tags: ["标签1", "标签2"]
categories: ["运维"]  # 运维 / 技术笔记 / 生活随笔
summary: "文章摘要，列表页显示"
draft: false
---
```

## 存放位置

| 目录 | 用途 |
|------|------|
| `content/posts/ops/` | 运维实践 |
| `content/posts/tech/` | 技术笔记 |
| `content/posts/life/` | 生活随笔 |

## Markdown 常用语法

### 标题

```markdown
## 二级标题
### 三级标题
```

### 代码块

````markdown
​```bash
sudo systemctl restart nginx
​```
````

### 表格

```markdown
| 列1 | 列2 |
|-----|-----|
| 内容 | 内容 |
```

### 图片

图片放入 `static/images/` 目录，引用方式：

```markdown
![描述](/images/photo.png)
```

## 本地预览

```bash
hugo server -D
# 打开 http://localhost:1313/my-blog/
```

## 常见问题

| 问题 | 解答 |
|------|------|
| 多久上线 | 推送后 1-2 分钟 |
| 如何删除 | 删除 .md 文件并推送 |
| 如何修改 | 改内容后推送 |
| 排列顺序 | 按日期倒序 |
| 暂不发布 | `draft: true` |
