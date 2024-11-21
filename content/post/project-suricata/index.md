---
title: suricata基础
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

基础配置只需关注HOME_NET与interface两个参数即可，其中HOME_NET为本地网络地址，interface为监听的网络接口。配置文件路径为/etc/suricata/suricata.yaml，
示例如下：

![HOME_NET](HOME_NET.png) ![interface](af-interface.png)

规则（suricata中称为signatures）保存在/etc/suricata/rules/目录下，可以通过suricata-update命令更新。当然，也可以手动新建规则文件（比如用于测试）：

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

事件日志/var/log/suricata/eve.json(使用event_type标识事件类型，常见的像统计事件stats、告警事件alert、流事件flow等，记录非常详细)，告警日志/var/log/suricata/fast.log，可以使用curl www.baidu.com触发告警，日志示例如下：

![eve.json](eve-log.png) ![fast.log](fast-log.png)

## 规则

### 格式

一条规则由3个部分组成，分别是action、header、rule options，示例如下：

```bash
alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"HTTP GET Request Containing Rule in URI"; flow:established,to_server; http.method; content:"GET"; http.uri; content:"rule"; fast_pattern; classtype:bad-unknown; sid:123; rev:1;)
```

动作定义规则匹配时做什么，header定义规则的协议、IP、端口、方向等信息（网络层、传输层、应用层协议），rule options定义规则的细节（应用层数据）。

### 关键字

本部分介绍suricata元关键字（称为Meta Keywords），其它关键字（涉及协议细节）请参考官方文档第8部分。

| 关键字 | 说明 | 示例 |
|:---:|:---:|:---:|
| msg | 告警信息 | msg:"HTTP GET Request Containing Rule in URI", 该字段应该写在最前，各部分首字母大写，最好能反映规则的类型 |
| sid | 规则ID | sid:123 |
| rev | 规则版本 | rev:1 |
| gid | 规则组ID | gid:1，告警记录[gid:sid:rev] |
| classtype | 告警类型 | classtype:bad-unknown，该字段应该写在sid与rev之前 |
| reference | 参考信息 | reference:cve,2024-1234，规则的来源以及解决的问题 |
| priority | 规则优先级 | priority:1，最高为1，取值1~255, 一般使用1~4即可 |
| metadata | 元数据 | metadata:created_at,2024_01_01,metadata:created_by,xxx，用于附加一些功能无关的信息 |
| target | 目标 | target:[src_ip|dest_ip]，说明告警记录中哪个IP是攻击目标 |
| requires | 依赖 | requires: feature geoip, version >= 7.0.0, 用于指定规则依赖的模块以及版本，不符合依赖条件的规则会被忽略 |

