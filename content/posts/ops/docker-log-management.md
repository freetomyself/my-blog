---
title: "Docker 容器日志管理实践"
date: 2026-09-10
tags: ["Docker", "运维", "日志"]
categories: ["运维"]
summary: "生产环境中 Docker 容器日志膨胀问题的排查与解决方案，包括日志驱动配置、轮转策略和监控告警。"
---

## 问题背景

生产环境某台服务器磁盘告警，排查发现是 Docker 容器日志文件过大导致。

## 排查过程

```bash
# 查看磁盘使用
df -h

# 定位大文件
du -sh /var/lib/docker/containers/*/*-json.log | sort -rh | head -10
```

## 解决方案

### 1. 配置日志驱动

在 `/etc/docker/daemon.json` 中添加：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

### 2. 重启 Docker

```bash
systemctl restart docker
```

### 3. 清理现有日志

```bash
# 停止容器后 truncate
truncate -s 0 /var/lib/docker/containers/<container-id>/<container-id>-json.log
```

## 最佳实践

- 单个日志文件不超过 50MB
- 保留文件数不超过 3 个
- 重要日志接入 ELK 或 Loki 集中管理
- 配置磁盘使用率监控告警
