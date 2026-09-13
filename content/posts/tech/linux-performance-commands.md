---
title: "Linux 性能排查常用命令速查"
date: 2026-09-08
tags: ["Linux", "性能优化", "排查"]
categories: ["技术笔记"]
summary: "整理 Linux 系统性能排查中最常用的命令，涵盖 CPU、内存、磁盘、网络四个维度。"
---

## CPU 排查

```bash
# 查看 CPU 使用率
top
htop

# 查看负载
uptime
vmstat 1

# 查看进程 CPU 占用
ps aux --sort=-%cpu | head -20
```

## 内存排查

```bash
# 查看内存使用
free -h

# 查看进程内存
ps aux --sort=-%mem | head -20

# 查看内存详细信息
cat /proc/meminfo
```

## 磁盘排查

```bash
# 查看磁盘使用
df -h

# 查看 inode 使用
df -i

# 查看磁盘 IO
iostat -x 1

# 查看哪个进程占用磁盘
lsof +D /path/to/dir
```

## 网络排查

```bash
# 查看网络连接
ss -tulnp
netstat -tulnp

# 抓包
tcpdump -i eth0 port 80 -w capture.pcap

# 测试连通性
mtr google.com
```

## 小结

掌握这些命令，可以快速定位 90% 的性能问题。建议制作成速查卡片，方便日常使用。
