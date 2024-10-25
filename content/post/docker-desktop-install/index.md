---
title: docker desktop
date: 2024-09-27 17:45:00+0000
categories:
    - 技术
tags:
    - Docker
weight: 1       # You can add weight to some posts to override the default sorting (date descending)
image: docker.jpg
---

## 系统要求

### 操作系统

```
windows 11 64-bit: 家庭版/专业版都要求21H2及以上
启用WSL 2特性
windows 10也可以，不在此讨论
```

### 硬件/BIOS

```
WSL 2要求硬件支持以下特性：
- 64-bit处理器，支持SLAT（Second Level Address Translation）
- 至少4GB内存
- 在BIOS中启用硬件虚拟化特性

检查办法： cmd下运行命令systeminfo，查看最底部Hyper-V要求部分
```

## 安装步骤

### 开启Hyper-V
```
搜索启用或关闭Windows功能，勾选Hyper-V相关选项
以管理员身份运行powershell，执行命令：
bcdedit /set hypervisorlaunchtype auto

设置完成后重启计算机
```

### 安装WSL
```
以管理员身份运行powershell，执行命令：
wsl --install

更新wsl:
wsl --update

执行命令安装linux分发版(可根据自己需求选择)：
wsl --install -d Debian

查看已经安装的linux分发版：
wsl --list

如果要卸载已安装的linux分发版，可执行：
wsl --unregister Debian
```

### 安装docker desktop
```
官网下载最新版本安装即可
链接：https://www.docker.com
```
