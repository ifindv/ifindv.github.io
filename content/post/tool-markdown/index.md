---
title: markdown常用语法总结
date: 2024-10-17
categories:
    - 工具
tags: 
    - markdown
weight: 1
image: markdown.jpg
math: true
---

## 标题

代码

```
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

效果

# H1
## H2
### H3
#### H4
##### H5
###### H6

## 段落

Markdown is a lightweight and easy-to-use markup language that allows you to write formatted text using a plain-text editor. 
It is widely used for creating documentation, writing articles, and creating content for websites and blogs.

Markdown syntax is simple and intuitive, making it easy to learn and use. It supports various formatting options such as 
headings, bold and italic text, lists, links, images, and more. With just a few keystrokes, you can create well-structured 
and visually appealing content.

## 引用

引用的内容会显示为灰色背景，使用`>`来表示引用。

### 在引用中使用markdown语法

代码

```
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.
```

效果

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

### 引用中使用cite标记

代码

```
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.
```

效果

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## 表格

表格不是markdown的标准语法，但HUGO支持表格。

### 在表格中使用markdown语法

代码

```
| Italics   | Bold     | Code   |
| --------  | -------- | ------ |
| *italics* | **bold** | `code` |
```

效果

| Italics   | Bold     | Code   |
| --------  | -------- | ------ |
| *italics* | **bold** | `code` |

代码

```
|A|B|C|D|E|F|
|---|---|---|---|---|---|
| Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Phasellus ultricies, sapien non euismod aliquam, dui ligula tincidunt odio, at accumsan nulla sapien eget ex. | Proin eleifend dictum ipsum, non euismod ipsum pulvinar et. Vivamus sollicitudin, quam in pulvinar aliquam, metus elit pretium purus | Proin sit amet velit nec enim imperdiet vehicula. | Ut bibendum vestibulum quam, eu egestas turpis gravida nec | Sed scelerisque nec turpis vel viverra. Vivamus vitae pretium sapien |
```

效果

|A|B|C|D|E|F|
|---|---|---|---|---|---|
| Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Phasellus ultricies, sapien non euismod aliquam, dui ligula tincidunt odio, at accumsan nulla sapien eget ex. | Proin eleifend dictum ipsum, non euismod ipsum pulvinar et. Vivamus sollicitudin, quam in pulvinar aliquam, metus elit pretium purus | Proin sit amet velit nec enim imperdiet vehicula. | Ut bibendum vestibulum quam, eu egestas turpis gravida nec | Sed scelerisque nec turpis vel viverra. Vivamus vitae pretium sapien |

## 代码

代码块显示为灰色背景，使用三个反引号来表示代码块。

### 指定编程语言

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

### 代码版本比较

```diff
[dependencies.bevy]
git = "https://github.com/bevyengine/bevy"
rev = "11f52b8c72fc3a568e8bb4a4cd1f3eb025ac2e13"
- features = ["dynamic"]
+ features = ["jpeg", "dynamic"]
```

## 列表

### 有序列表

代码

```
1. First item
2. Second item
3. Third item
```

效果

1. First item
2. Second item
3. Third item

### 无序列表

代码

```
* List item
* Another item
* And another item
```

效果

* List item
* Another item
* And another item

### 嵌套列表

代码

```
* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese
```

效果

* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese

## 图片
使用`![]()`来表示图片。

代码

```markdown
![Image 1](1.jpg) ![Image 2](2.jpg)
```

效果

![Image 1](1.jpg) ![Image 2](2.jpg)

## 数学公式

hugo支持数学公式，在frontmatter中添加`math: true`即可。

### 内嵌公式

代码

```markdown
This is an inline mathematical expression: $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887…$
```

效果

This is an inline mathematical expression: $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887…$

### 公式块

代码

```markdown
$$
    \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }
$$

$$
    f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$
```

效果

$$
    \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }
$$

$$
    f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$

## 多媒体

使用\{\{\< + tencent|bilibili|youtube|video + "URL" \>\}\}`来表示视频。

### 腾讯视频

{{< tencent "g0014r3khdw" >}}

### 哔哩哔哩

{{< bilibili "BV1d4411N7zD" >}}

### Youtube

{{< youtube "0qwALOOvUik" >}}

### mp4文件

{{< video "https://www.w3schools.com/tags/movie.mp4" >}}

## 其它

### 缩写

代码

```
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.
```

效果

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

### 下标

代码

```
H<sub>2</sub>O
```

效果

H<sub>2</sub>O

### 上标

代码

```
X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>
```

效果

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

### 键盘按键

代码

```
press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.
```

效果

press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

### 高亮显示

代码

```
This is very <mark>important</mark> !
```

效果

This is very <mark>important</mark> !
