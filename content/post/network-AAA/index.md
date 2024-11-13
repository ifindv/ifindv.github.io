---
title: 用户认证技术
date: 2024-11-06 16:00:00+0000
categories:
    - 网络
tags:
    - network
weight: 1 
image: network.png
---

## RADIUS
RADIUS（Remote Authentication Dial In User Service，远程用户拨号认证系统）是一种网络认证协议，NAS（网络接入服务器）通过RADIUS协议与RADIUS服务器进行通信，以实现用户认证、授权和计费（AAA）。Radius协议在RFC 2865与RFC 2866中定义，使用UDP协议进行通信，端口号为1812和1813。

RADIUS特点：
- C/S架构
- 安全的消息交互机制（共享密钥）
- 支持多种认证方式（如PAP、CHAP、EAP）
- 支持多种计费方式（如基于时间、流量、会话等）
- 支持动态授权和强制下线（CoA & DM）

RADIUS认证过程：
1. 用户输入用户名和密码，NAS将用户名和密码发送给RADIUS服务器。
2. RADIUS服务器对用户身份进行校验。
3. NAS通知用户认证结果（成功或失败）。
4. 如果认证成功，NAS发送计费开始请求。
5. RADIUS服务器返回计费开始响应，并开始计费。
6. 用户开始访问网络资源。

