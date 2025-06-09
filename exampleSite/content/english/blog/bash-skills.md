---
title: some useful bash skills
description: collection of bash commands that helpful
date: 2025-05-27T09:20:00.000Z
image: exampleSite/assets/images/uploads/bd26f78c344b3ad6afef7b12b1421227.jpg
categories:
  - Linux
author: ifindv
tags:
  - bash
draft: false
meta_title: ""
---

bash is a powerful tool, here are some useful skills.

## use screen run gdb in background

```
# create a screen session
screen -S <SESSION_NAME>

# run gdb
gdb attach <PID>

# press ctrl + a then d to detach the session
crtl + a
d

# resume the session
screen -r <SESSION_NAME>
```

