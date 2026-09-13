# 文章发布指南

本指南介绍如何在博客中撰写、预览和发布新文章。

---

## 快速开始（3 步发布）

```bash
# 1. 创建新文章
hugo new content posts/ops/my-article.md

# 2. 编辑文章内容，修改 frontmatter

# 3. 推送到 GitHub，自动部署
git add .
git commit -m "post: 文章标题"
git push origin main
```

推送后约 1-2 分钟，文章会自动上线。

---

## 文章存放位置

```
content/posts/
├── ops/       # 运维实践
├── tech/      # 技术笔记
└── life/      # 生活随笔
```

将 `.md` 文件放到对应子目录即可。

---

## 文章模板

每篇文章必须包含以下 frontmatter（文件顶部的 YAML 块）：

```markdown
---
title: "文章标题"
date: 2026-09-13
tags: ["标签1", "标签2"]
categories: ["运维"]
summary: "文章摘要，显示在列表页，建议 50-100 字。"
draft: false
---

这里是正文内容...

## 二级标题

正文段落...

​```bash
# 代码块示例
echo "hello world"
​```

## 另一个标题

更多内容...
```

### frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，格式 `YYYY-MM-DD` |
| `tags` | 否 | 标签列表，可多个 |
| `categories` | 是 | 分类：运维 / 技术笔记 / 生活随笔 |
| `summary` | 否 | 摘要，不填则自动截取正文 |
| `draft` | 否 | `true` 为草稿不发布，`false` 或省略为发布 |
| `comments` | 否 | `true` 开启评论（默认已开启） |

---

## Markdown 语法速查

### 常用语法

```markdown
# 一级标题（一般不用，title 已是标题）
## 二级标题
### 三级标题

**加粗文字**
*斜体文字*
~~删除线~~

[链接文字](https://example.com)
![图片描述](/images/photo.png)

> 引用块内容

- 无序列表项
1. 有序列表项

- [ ] 待办事项
- [x] 已完成事项
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容 | 内容 | 内容 |
```

### 代码块

````markdown
​```bash
# Bash 命令
sudo systemctl restart nginx
​```

​```yaml
# YAML 配置
key: value
​```

​```json
{
  "name": "example"
}
​```
````

### 图片

将图片放入 `static/images/` 目录，然后引用：

```markdown
![描述文字](/images/my-photo.png)
```

---

## 本地预览

发布前可本地预览效果：

```bash
# 启动本地服务器
hugo server -D

# 浏览器打开
# http://localhost:1313/my-blog/
```

`-D` 参数会同时显示草稿文章。

---

## 完整发布流程示例

```bash
# 进入项目目录
cd D:\AI_WorkSpace\MIMO\GIT

# 创建文章
hugo new content posts/ops/kubernetes-deployment-guide.md

# 用编辑器打开并编写内容
# 编辑器打开 content/posts/ops/kubernetes-deployment-guide.md

# 本地预览确认效果
hugo server -D

# 确认无误后提交推送
git add content/posts/ops/kubernetes-deployment-guide.md
git commit -m "post: K8s 部署指南"
git push origin main
```

---

## 常见问题

### Q: 文章发布后多久能在线上看到？
A: 推送到 GitHub 后，Actions 自动构建约需 1-2 分钟。

### Q: 如何删除已发布的文章？
A: 删除对应的 `.md` 文件，提交推送即可。

### Q: 如何修改已发布文章？
A: 直接修改 `.md` 文件内容，提交推送后自动更新。

### Q: 文章顺序如何排列？
A: 按 `date` 日期倒序排列，最新日期的在最前面。

### Q: 如何让某篇文章不发布？
A: frontmatter 中设置 `draft: true`。
