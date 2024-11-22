---
title: 国内镜像源大全
date: 2024-11-21 14:14:00+0000
categories:
    - 网络
tags:
    - network
weight: 1 
image: network.png
---

## cargo

### 中科大（2024-11-12）

```shell
cat ~/.cargo/config <<EOF
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
EOF
```





