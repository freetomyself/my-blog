---
title: "Docker Compose 实战"
date: 2026-09-08
series: ["Docker"]
tags: ["Docker", "Compose"]
categories: ["运维"]
summary: "使用 Docker Compose 编排多容器应用，实现一键部署。"
---

## Docker Compose 简介

Docker Compose 是用于定义和运行多容器 Docker 应用的工具，通过 YAML 文件管理服务。

## 安装

```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

## Compose 文件结构

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - db
    environment:
      - DB_HOST=db

  db:
    image: mysql:8.0
    volumes:
      - db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password

volumes:
  db_data:
```

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重建并启动
docker-compose up -d --build
```

## 实战：部署 Web 应用

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

  app:
    build: ./app
    expose:
      - "3000"

  redis:
    image: redis:alpine
```

## 小结

Docker Compose 简化了多容器应用的管理，是开发和测试环境的理想选择。
