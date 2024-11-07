---
title: 网络安全技术之用户认证
date: 2024-11-07 16:00:00+0000
categories:
    - 网络
tags:
    - 用户认证
weight: 1 
image: 
---

## AAA

AAA 是 Authentication, Authorization, Accounting 的简称，即认证、授权和计费， 提供了在NAS（网络接入服务器）上配置访问控制的框架，
它决定了哪些用户可以访问网络，具有哪些权限，以及如何对他们的访问进行计费。

实现方式：
- 本地认证
- LDAP
- RADIUS

## RADIUS
RADIUS（Remote Authentication Dial In User Service，远程用户拨号认证系统）是一种网络认证协议，NAS（网络接入服务器）通过RADIUS协议与RADIUS服务器进行通信，以实现用户认证、授权和计费。

RADIUS特点：
- C/S架构
- 安全的消息交互机制（使用共享密钥）
- 良好的扩展性（报文格式头+属性）
- 认证与授权不可分割（AAA尚未提出）

RADIUS认证过程：
1. 用户输入用户名和密码，NAS将用户名和密码发送给RADIUS服务器。
2. RADIUS服务器对用户身份进行校验。
3. NAS通知用户认证结果（成功或失败）。
4. 如果认证成功，NAS发送计费开始请求。
5. RADIUS服务器返回计费开始响应，并开始计费。
6. 用户开始访问网络资源。

RADIUS动态授权
RADIUS支持CoA（Change of Authorization），由RADIUS服务器向NAS发送CoA请求，NAS根据请求内容修改用户权限，并返回CoA-ACK或CoA-NAK响应。

RADIUS强制下线
RADIUS支持DM（Disconnect Message），由RADIUS服务器向NAS发送DM请求，NAS强制用户下线，并返回DM-ACK或DM-NAK响应。
