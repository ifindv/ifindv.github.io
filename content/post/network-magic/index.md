---
title: 国内镜像源大全
date: 2024-11-21 14:14:00+0000
categories:
    - 网络
tags:
    - network
weight: 1 
image: 
---

## cargo

### 中科大（2024-11-12）

```shell
touch ~/.cargo/config
cat <<EOF | tee ~/.cargo/config
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
EOF
```





