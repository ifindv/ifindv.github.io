---
title: postgresql快速入门指南
date: 2024-10-21 10:22:00+0000
categories:
    - 知识
tags:
    - database
weight: 1 
image: postgresql.jpg
---

## 简介
PG是一款开源的对象关系数据库管理系统，它支持大部分的SQL标准，并提供了大量的modern features:
- complex queries
- foreign keys
- triggers
- updatable views
- transactional integrity
- multiversion concurrency control

用户可以灵活的的扩展PG的功能，支持自定义：
- data types
- functions
- operators
- aggregate functions
- index methods
- procedural languages

PG可以免费使用、修改和分发，并且可以用于商业用途。

## SQL语法

### 语法结构

一条SQL语句由多个tokens组成，以分号结束。tokens分为以下几种类型：
1. 关键字：如SELECT, FROM, WHERE, ORDER BY等，用于描述SQL语句的操作。
2. 标识符：如表名，列名，变量名等，用于引用数据库中的对象。
3. 常量：如数字，字符串等，用于提供数据。
4. 操作符：如=, <, >, +, -, *等，用于对数据进行操作。

SQL语句对大小写不敏感，但通常关键字使用大写，标识符使用小写。双引号可以用于标识符，以避免关键字冲突，特别注意，被双引号包围的标识符大小写敏感。

SQL语句举例：
```sql
SELECT * FROM MY_TABLE;
UPDATE MY_TABLE SET A = 5;
INSERT INTO MY_TABLE VALUES (3, 'hi there');
```

### Unicode
使用‘U&’标记，\hhhh或\\+hhhhhh表示一个Unicode字符，其中h代表一个十六进制字符。举例data可以表示为：
```unicode
U&"d\0061t\+000061"
```

可以使用UESCAPE定义转义字符替代\\,比如：
```unicode
U&"d!00061t!+000061" UESCAPE '!'
```

