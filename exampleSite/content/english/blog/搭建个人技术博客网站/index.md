---
title: 搭建个人技术博客网站
description: 基于hugo主题hugoplate与github pages静态网站托管，搭建个人专属技术博客
date: 2025-08-19T09:13:00.000+08:00
image: /images/uploads/blog.png
categories:
  - 技术
author: ifindv
tags:
  - 博客
draft: false
---
## 接入giscus评论系统

原生的disqus评论系统广告充斥？与其花时间研究如何屏蔽，不如直接切换到giscus，网站瞬间变得清爽，照链接操作几分钟内轻松搞定
[giscus](https://giscus.app/zh-CN)

[](https://giscus.app/zh-CN)

![giscus效果图](comment.png "gitcus效果图")

## 资源列表

### 网站logo

不想被各种版权问题折磨，无需注册，快速获取心怡的网站logo
[Free icons - Iconfinder](https://www.iconfinder.com/search?price=free)

![免费logo下载](free-logo.png "免费logo下载")

### 图片背景去除

在线去除图片背景，无需注册，不带水印
[在线抠图软件_图片去除背景 | remove.bg – remove.bg](https://www.remove.bg/zh)

![在线抠图软件](remvoe-bg.png "在线抠图软件")

[](https://www.remove.bg/zh)


## Markdown语法

### Notice

{{< notice "note" >}}

This is a simple note.

{{< /notice >}}

{{< notice "tip" >}}

This is a simple tip.

{{< /notice >}}

{{< notice "info" >}}

This is a simple info.

{{< /notice >}}

{{< notice "warning" >}}

This is a simple warning.

{{< /notice >}}

<hr>

### Tab

{{< tabs >}}

{{< tab "Tab 1" >}}

#### Hey There, I am a tab

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

{{< /tab >}}

{{< tab "Tab 2" >}}

#### I wanna talk about the assassination attempt

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

{{< /tab >}}

{{< tab "Tab 3" >}}

#### We know you’re dealing in stolen ore

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo

{{< /tab >}}

{{< /tabs >}}

<hr>

### Accordions

{{< accordion "Why should you need to do this?" >}}

- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur

{{< /accordion >}}

{{< accordion "How can I adjust Horizontal centering" >}}

- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur

{{< /accordion >}}

{{< accordion "Should you use Negative margin?" >}}

- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur adipisicing elit.
- Lorem ipsum dolor sit amet consectetur

{{< /accordion >}}

<hr>

### Gallery

{{< gallery dir="images/gallery" class="" height="400" width="400" webp="true" command="Fit" option="" zoomable="true" >}}

<hr>

### Slider

{{< slider dir="images/gallery" class="max-w-[600px] ml-0" height="400" width="400" webp="true" command="Fit" option="" zoomable="true" >}}

<hr>

### Custom video

{{< video src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%" height="auto" autoplay="false" loop="false" muted="false" controls="true" class="rounded-lg" >}}
