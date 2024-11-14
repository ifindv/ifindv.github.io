---
title: 超实用的shell技巧
date: 2024-11-13 18:47:00+0000
categories:
    - 操作系统
tags:
    - linux
weight: 2 
image: shell.png
---

## 使用screen后台运行gdb

```
# 创建会话
screen -S <SESSION_NAME>

# 在screen会话中运行gdb
gdb attach <PID>

# 按ctrl + a，再按d，将当前会话放入后台
crtl + a
d

# 可以随时恢复会话（即使使用xshell远程连接，断开也不受影响）
screen -r <SESSION_NAME>
```
