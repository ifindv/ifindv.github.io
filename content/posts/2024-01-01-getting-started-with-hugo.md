---
title: "开始使用 Hugo 搭建博客"
description: "Hugo 是一个快速、灵活的静态网站生成器，非常适合搭建个人博客和文档网站。"
date: 2024-01-01
categories: ["教程"]
tags: ["Hugo", "静态网站", "博客"]
featured: true
author: "ifindv"
---

Hugo 是一个用 Go 语言编写的静态网站生成器，以其极快的构建速度和灵活的模板系统著称。

## 为什么选择 Hugo？

- **速度极快**：Go 语言编写，构建速度是其他工具的数倍
- **灵活主题**：支持数百种社区主题
- **无需数据库**：纯静态文件，托管方便
- **Markdown 支持**：内容创作简单高效

## 快速开始

```bash
# 安装 Hugo (macOS)
brew install hugo

# 创建新站点
hugo new site myblog

# 添加主题
cd myblog
git init
git submodule add https://github.com/nunocoracao/blowfish.git themes/blowfish

# 启动本地服务器
hugo server
```

## 结语

Hugo 是搭建个人博客的绝佳选择，配合 GitHub Pages 可以实现免费托管和自动化部署。

快去试试吧！
