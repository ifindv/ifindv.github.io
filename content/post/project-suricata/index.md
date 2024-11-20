---
title: suricata
date: 2024-11-12 00:00:00+0000
categories:
    - 项目
tags:
    - suricata
weight: 2
image: suricata.png
---

## 简介

> Suricata is a high performance, open source network analysis and threat detection software used by most private and public organizations, and embedded by major vendors to protect their assets.

- [官网](https://suricata.io/)
- [官方文档](https://docs.suricata.io/en/latest/index.html#)

## 快速开始

### 安装

debian系统，直接使用apt安装即可（其它系统参考官方文档第3部分installation）：

```bash
sudo apt install suricata
```

### 配置

基础配置只需关注HOME_NET与interfaces两个参数即可，其中HOME_NET为本地网络地址，interfaces为监听的网络接口。配置文件路径为/etc/suricata/suricata.yaml，
示例如下：

![HOME_NET](HOME_NET.png) ![interface](af-interface.png)

告警规则（suricata称为signatures）保存在/etc/suricata/rules/，可以通过suricata-update命令更新规则。当然，也可以手动新建规则文件（比如测试时）：

```bash
sudo touch /etc/suricata/rules/suricata.rules
sudo echo 'alert ip any any -> any any (msg: "baidu"; content: "baidu"; )' > /etc/suricata/rules/suricata.rules
```

### 启动

可以使用命令行直接起前台，或者通过service/systemd启动后台服务（后台启动需要先将/etc/default/suricata文件中的RUN改为yes，否则会报错）。

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

### 测试

事件日志/var/log/suricata/eve.json，告警日志/var/log/suricata/fast.log，可以使用curl www.baidu.com触发告警，日志示例如下：

![eve.json](eve-log.png) ![fast.log](fast-log.png)
