---
title: "使用 GitHub Actions 自动部署博客"
description: "通过 GitHub Actions 实现博客的自动化构建和部署，每次推送代码后自动更新网站。"
date: 2024-02-15
categories: ["DevOps"]
tags: ["GitHub", "CI/CD", "自动化"]
featured: true
author: "ifindv"
---

自动化部署是现代开发流程的重要组成部分。本文介绍如何用 GitHub Actions 自动部署 Hugo 博客到 GitHub Pages。

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的持续集成/持续部署（CI/CD）服务，可以自动化构建、测试和部署流程。

## 创建 Workflow 文件

在 `.github/workflows/deploy.yml` 中定义部署流程：

```yaml
name: Deploy Blog
on: [push]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
      - name: Build
        run: hugo
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## 效果

每次 `git push` 后，GitHub Actions 会自动：
1. 拉取最新代码
2. 运行 Hugo 构建
3. 将生成的静态文件推送到 gh-pages 分支
4. GitHub Pages 自动更新网站

整个过程无需人工干预，真正实现了"推送即发布"。
