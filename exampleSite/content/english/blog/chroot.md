---
title: 使用chroot实现用户访问控制
description: 限制指定用户可见的目录及文件并控制其读写权限，允许该用户通过ssh访问设备
date: 2025-08-13T17:03:00.000+08:00
image: /images/uploads/linux.png
categories:
  - 操作系统
author: ifindv
tags:
  - LINUX
draft: false
meta_title: ""
---
## 使用chroot创建隔离的用户空间

### 创建用户及工作目录

```bash
# 创建用户并修改密码
useradd test
passwd test
# 为用户创建根目录
mkdir /home/test
chown root:root /home/test
chmod 755 /home/test
```

### 设置ssh远程登录

```bash
AllowUsers test
Subsystem sftp internal-sftp
Match User test
    ChrootDirectory /home/test
```

### 重启sshd服务

```bash
systemctl restart sshd
```

### 安装动态库及常用工具

```bash
mkdir -p /home/test/{bin,lib,lib32,lib64,usr,sbin,usr/local}
ln -s ../bin /home/test/usr/bin
ln -s ../bin /home/test/usr/local/bin
ln -s ../sbin /home/test/usr/sbin
ln -s ../sbin /home/test/usr/local/sbin
ln -s ../lib /home/test/usr/lib
ln -s ../lib /home/test/usr/local/lib
ln -s ../lib32 /home/test/usr/lib32
ln -s ../lib32 /home/test/usr/local/lib32
ln -s ../lib64 /home/test/usr/lib64
ln -s ../lib64 /home/test/usr/local/lib64
cp /usr/local/lib/libreadline.so.6 /home/test/usr/local/lib/
cp /usr/local/lib/libhistory.so.6 /home/test/usr/local/lib/
cp /usr/local/lib/libncurses.so.5 /home/test/usr/local/lib/
cp /usr/local/lib/libdl.so.2 /home/test/usr/local/lib/
cp /usr/local/lib/libc.so.6 /home/test/usr/local/lib/
cp /usr/local/lib/libm.so.6 /home/test/usr/local/lib/
cp /usr/local/lib/libnsl.so.1 /home/test/usr/local/lib/
cp /lib/ld-linux-* /home/test/lib/
cp /home/test/lib/* /home/test/lib64/*
cp /bin/bash /home/test/bin/
cp /bin/ls /home/test/bin/
cp /bin/cat /home/test/bin/
cp /bin/cp /home/test/bin/
cp /bin/mkdir /home/test/bin/
cp /bin/rm /home/test/bin/
cp /bin/mv /home/test/bin/
cp /bin/touch /home/test/bin/
cp /bin/chmod /home/test/bin/
cp /bin/vi /home/test/bin/
cp /bin/rz /home/test/bin/
cp /bin/sz /home/test/bin/
cp /bin/clear /home/test/bin/
mkdir -p /home/test/usr/share/terminfo/x
cp /usr/share/terminfo/x/xterm /home/test/usr/share/terminfo/x/
```

### 挂载文件系统

```bash
mkdir -p /home/test/{proc,sys,dev,run,var}
mount -t proc /proc /home/test/proc
mount -t sysfs /sys /home/test/sys
mount --rbind /dev /home/test/dev
mount --rbind /run /home/test/run
ln -s ../run /home/test/var/run
```

### 为用户创建home目录

```bash
mkdir /home/test/home
chown test:test /home/test/home
chmod 755 /home/test/home
```

## 安装docker程序

```bash
cp /bin/docker /home/test/bin/
chmod 766 /var/run/docker* -R
```
