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

每个SQL input由一系列SQL commands组成。
每个SQL commands由一系列tokens组成，以;结束。
tokens分为关键字，如SELECT, FROM, WHERE, ORDER BY等，标识符，如表名，列名，变量名等，常量，如数字，字符串等，操作符，如=, <, >, +, -, *等。
SQL大小写不敏感，但通常关键字大写，标识符小写。
双引号可以用于标识符，以避免关键字冲突，被双引号包围的标识符大小写敏感。

举例：
SELECT * FROM MY_TABLE;
UPDATE MY_TABLE SET A = 5;
INSERT INTO MY_TABLE VALUES (3, 'hi there');

