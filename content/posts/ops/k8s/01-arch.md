---
title: "K8s 架构解析"
date: 2026-09-10
series: ["K8s"]
tags: ["Kubernetes", "K8s"]
categories: ["运维"]
summary: "Kubernetes 核心组件和架构设计，理解 K8s 的工作原理。"
---

## K8s 架构概览

Kubernetes 采用主从架构，分为控制平面（Control Plane）和工作节点（Worker Node）。

## 控制平面组件

### API Server

集群的统一入口，提供 RESTful API。

### etcd

分布式键值存储，保存集群状态数据。

### Scheduler

负责 Pod 的调度决策。

### Controller Manager

维护集群状态的控制器集合。

## 工作节点组件

### kubelet

负责 Pod 的生命周期管理。

### kube-proxy

实现 Service 的网络代理。

### Container Runtime

容器运行时，如 containerd、CRI-O。

## 核心概念

| 概念 | 说明 |
|------|------|
| Pod | 最小部署单元，包含一个或多个容器 |
| Deployment | 管理 Pod 的部署和更新 |
| Service | 提供网络访问的抽象层 |
| Namespace | 资源的逻辑隔离 |

## 小结

理解 K8s 架构是掌握容器编排的基础，后续将深入各个组件的实战应用。
