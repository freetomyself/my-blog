---
title: "Docker 基础入门"
date: 2026-09-01
lastmod: 2026-09-13
series: ["Docker"]
tags: ["Docker", "容器"]
categories: ["运维"]
summary: "Docker 核心概念、安装配置、常用命令，快速入门容器技术。"
---

## 什么是 Docker

Docker 是一个开源的容器化平台，可以让开发者将应用及其依赖打包到一个可移植的容器中。

## 核心概念

### 镜像（Image）

镜像是只读模板，用于创建容器。

### 容器（Container）

容器是镜像的运行实例，可以被启动、停止、删除。

### 仓库（Repository）

仓库用于集中管理镜像。

## 安装 Docker

### CentOS 安装

```bash
# 安装依赖
yum install -y yum-utils

# 添加 Docker 源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
yum install docker-ce docker-ce-cli containerd.io

# 启动 Docker
systemctl start docker
systemctl enable docker
```

## 常用命令

```bash
# 查看镜像
docker images

# 拉取镜像
docker pull nginx:latest

# 运行容器
docker run -d -p 80:80 --name my-nginx nginx

# 查看容器
docker ps -a

# 查看日志
docker logs my-nginx

# 进入容器
docker exec -it my-nginx bash
```

## 小结

Docker 通过容器化技术简化了应用部署，是现代运维的必备技能。
