---
title: "super useful bash skills"
meta_title: ""
description: "this is meta description"
date: 2025-04-27T05:00:00Z
image: "/images/bash.jpg"
categories: ["Linux"]
author: "ifindv"
tags: ["bash"]
draft: false
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

