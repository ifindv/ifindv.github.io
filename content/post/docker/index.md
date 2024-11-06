---
title: Docker不完全指南
date: 2024-09-27 17:45:00+0000
categories:
    - 知识
tags:
    - Docker
weight: 1       # You can add weight to some posts to override the default sorting (date descending)
image: docker.jpg
---

## docker Desktop安装

### 硬件/系统要求

- 64-bit处理器，支持SLAT（Second Level Address Translation）
- 至少4GB内存
- BIOS启用硬件虚拟化特性
- windows 11 64-bit: 家庭版/专业版都要求21H2及以上（win10也可以，不在此讨论）

### 系统设置

按照以下步骤对系统进行设置：
- 搜索启用或关闭Windows功能，勾选Hyper-V相关选项
- 以管理员身份运行powershell，执行bcdedit /set hypervisorlaunchtype auto
- 重启计算机

### 安装WSL

以管理员身份运行powershell，执行：
```
wsl --install
wsl --update
wsl --install -d Debian
```

### 安装docker desktop
官网（https://www.docker.com）下载最新版本安装即可

## docker常用命令

### 代理设置

为dockerd设置代理，在daemon.json添加以下内容：
```
mkdir -p /etc/systemd/system/docker.service.d
cat > /etc/systemd/system/docker.service.d/http-proxy.conf << EOF
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890/" "HTTPS_PROXY=http://127.0.0.1:7890/" "NO_PROXY=localhost,127.0.0.1,.example.com"
EOF
systemctl daemon-reload
systemctl restart docker
```

### 镜像
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| docker images | 查看本地镜像 | docker images |
| docker search | 搜索镜像 | docker search nginx |
| docker pull | 拉取镜像 | docker pull nginx |
| docker rmi | 删除镜像 | docker rmi nginx |
| docker save | 导出镜像 | docker save nginx > nginx.tar |
| docker load | 导入镜像 | docker load < nginx.tar |
| docker build | 构建镜像 | docker build -t nginx:v1 . |

### 容器
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| docker ps | 查看运行中的容器 | docker ps |
| docker ps -a | 查看所有容器 | docker ps -a |
| docker run | 创建并启动容器 | docker run -d --name mynginx -p 80:80 nginx |
| docker start | 启动容器 | docker start mynginx |
| docker stop | 停止容器 | docker stop mynginx |
| docker restart | 重启容器 | docker restart mynginx |
| docker rm | 删除容器 | docker rm mynginx |
| docker exec | 进入容器 | docker exec -it mynginx /bin/bash |
| docker cp | 复制文件 | docker cp localfile mynginx:/tmp/ |
| docker logs | 查看容器日志 | docker logs mynginx |
| docker top | 查看容器内进程 | docker top mynginx |
| docker stats | 查看容器资源使用情况 | docker stats mynginx |
| docker inspect | 查看容器详细信息 | docker inspect mynginx |
| docker commit | 创建镜像 | docker commit mynginx mynginx:v1 |
| docker export | 导出容器 | docker export mynginx > mynginx.tar |
| docker import | 导入容器 | docker import mynginx.tar mynginx:v1 |

### 网络
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| docker network ls | 查看网络 | docker network ls |
| docker network create | 创建网络 | docker network create mynet |
| docker network inspect | 查看网络详情 | docker network inspect mynet |
| docker network rm | 删除网络 | docker network rm mynet |
| docker network connect | 连接容器到网络 | docker network connect mynet mynginx |
| docker network disconnect | 断开容器与网络的连接 | docker network disconnect mynet mynginx |

### 数据卷
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| docker volume ls | 查看数据卷 | docker volume ls |
| docker volume create | 创建数据卷 | docker volume create myvol |
| docker volume inspect | 查看数据卷详情 | docker volume inspect myvol |
| docker volume rm | 删除数据卷 | docker volume rm myvol |
| docker volume prune | 清理无用的数据卷 | docker volume prune |
| docker run -v | 挂载数据卷 | docker run -d --name mynginx -p 80:80 -v myvol:/usr/share/nginx/html nginx |

## 链接
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
