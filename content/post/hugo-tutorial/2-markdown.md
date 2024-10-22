---
title: 语法介绍
date: 2024-10-17
categories:
    - HUGO
weight: 2
---

## 标题

支持H1-H6共六级标题，使用`#`来表示：

# H1
## H2
### H3
#### H4
##### H5
###### H6

## 段落

若超出页面宽度将自动换行，以下是关于markdown的介绍：

Markdown is a lightweight and easy-to-use markup language that allows you to write formatted text using a plain-text editor. 
It is widely used for creating documentation, writing articles, and creating content for websites and blogs.

Markdown syntax is simple and intuitive, making it easy to learn and use. It supports various formatting options such as 
headings, bold and italic text, lists, links, images, and more. With just a few keystrokes, you can create well-structured 
and visually appealing content.

## 引用

引用的内容会显示为灰色背景，使用`>`来表示引用。

### 在引用中使用markdown语法

与普通段落一样，引用中也可以使用markdown语法：

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

### 引用中使用cite标记

在引用中可以使用cite块设置一个标记，单击此标记可以进行跳转。

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## 表格

表格不是markdown的标准语法，但HUGO支持表格。

   Name | Age
--------|------
    Bob | 27
  Alice | 23

### 在表格中使用markdown语法

| Italics   | Bold     | Code   |
| --------  | -------- | ------ |
| *italics* | **bold** | `code` |

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

1. First item
2. Second item
3. Third item

### 无序列表

* List item
* Another item
* And another item

### 嵌套列表

* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese

## 其它

### 缩写
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

### 下标
H<sub>2</sub>O

### 上标
X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

### 键盘按键
press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

### 高亮显示
This is very <mark>important</mark> !
