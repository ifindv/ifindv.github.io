---
title: Docker不完全指南
date: 2024-09-27 17:45:00+0000
categories:
    - 知识
tags:
    - Docker
weight: 1       # You can add weight to some posts to override the default sorting (date descending)
image: docker.jpg
---

## docker Desktop安装

### 硬件/系统要求

- 64-bit处理器，支持SLAT（Second Level Address Translation）
- 至少4GB内存
- BIOS中已启用硬件虚拟化特性
- windows 11 64-bit: 家庭版/专业版都要求21H2及以上（win10也可以，不在此讨论）

确认硬件/系统满足需求，按照以下步骤对系统进行设置：

- 搜索启用或关闭Windows功能，勾选Hyper-V相关选项
- 以管理员身份运行powershell，执行bcdedit /set hypervisorlaunchtype auto
- 重启计算机

### 安装WSL

以管理员身份运行powershell，执行：
```
wsl --install
wsl --update
wsl --install -d Debian
```

### 安装docker desktop
```
官网（https://www.docker.com）下载最新版本安装即可
```

## docker常用命令

### 镜像导入/导出
```
docker save -o <导出文件名> <镜像名>
docker load -i <导入文件名>
```
