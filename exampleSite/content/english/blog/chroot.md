---
title: create a secure and isolated environment using chroot
description: run application in an isolated environment and limit user's access
date: 2022-04-04T05:00:00.000Z
image: images/uploads/linux.jpg
categories:
  - OS
  - Linux
author: ifindv
tags:
  - chroot
draft: false
meta_title: ""
---
## create an isolated environment using chroot

1. create a new user

```abuild
useradd test
passwd test
```

2. create a directory for the user and set the ownership and permissions

```
mkdir /home/test
chown root:root /home/test
chmod 755 /home/test
```

3. modify sshd_config to allow the user to login via ssh and use chroot

```
AllowUsers test
Subsystem sftp internal-sftp
Match User test
    ChrootDirectory /home/test
```

4. restart sshd service

```
systemctl restart sshd
```

5. install necessary libraries and commands

```
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

6. mount necessary file systems

```
mkdir -p /home/test/{proc,sys,dev,run,var}
mount -t proc /proc /home/test/proc
mount -t sysfs /sys /home/test/sys
mount --rbind /dev /home/test/dev
mount --rbind /run /home/test/run
ln -s ../run /home/test/var/run
```

7. create a new home directory for the user and set the ownership and permissions

```
mkdir /home/test/home
chown test:test /home/test/home
chmod 755 /home/test/home
```

## run docker applications inside chroot

```
cp /bin/docker /home/test/bin/
chmod 766 /var/run/docker* -R
```
