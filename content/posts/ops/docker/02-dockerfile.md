---
title: "Dockerfile 编写指南"
date: 2026-09-05
lastmod: 2026-09-12
series: ["Docker"]
tags: ["Docker", "镜像"]
categories: ["运维"]
summary: "Dockerfile 常用指令详解，编写高效、安全的镜像构建文件。"
---

## Dockerfile 简介

Dockerfile 是用于构建 Docker 镜像的脚本文件，通过一系列指令定义镜像的构建过程。

## 常用指令

### FROM

指定基础镜像：

```dockerfile
FROM ubuntu:22.04
```

### WORKDIR

设置工作目录：

```dockerfile
WORKDIR /app
```

### COPY / ADD

复制文件到镜像：

```dockerfile
COPY package.json .
ADD app.tar.gz /app/
```

### RUN

执行命令：

```dockerfile
RUN apt-get update && apt-get install -y curl
```

### EXPOSE

声明端口：

```dockerfile
EXPOSE 80
```

### CMD / ENTRYPOINT

设置启动命令：

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

## 最佳实践

1. 使用 `.dockerignore` 排除不需要的文件
2. 合并 RUN 指令，减少镜像层数
3. 使用多阶段构建减小镜像体积
4. 不要在镜像中存储敏感信息

## 示例：多阶段构建

```dockerfile
# 构建阶段
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

# 运行阶段
FROM alpine:3.18
COPY --from=builder /app/myapp /usr/local/bin/
ENTRYPOINT ["myapp"]
```

## 小结

合理编写 Dockerfile 可以构建出高效、安全的容器镜像。
