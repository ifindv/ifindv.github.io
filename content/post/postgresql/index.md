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

### 字符串常量
任意字符构成的序列，使用单引号包围，如：
```
'This is a string'
```

单引号可以嵌套使用，如：
```
'This is a string with a ''quote'' in it'
```

两个字符串之间必须使用空格分隔。

字符串常量支持C风格转义字符，如下表所示：
| 转义字符 | 含义 |
| --- | --- |
| \b | 退格符 |
| \f | 换页符 |
| \n | 换行符 |
| \r | 回车符 |
| \t | 制表符 |
| \o, \oo, \ooo | 八进制字符 |
| \xh, \xhh, \xhhh | 十六进制字符 |
| \u, \uu, \uuu, \uuuu | Unicode字符 |


使用‘U&’标记标识unicode，格式U&\uuuu或U&\\+uuuuuu，其中u代表一个十六进制字符。举例data可以表示为：
```unicode
U&"d\0061t\+000061"
```

可以使用UESCAPE定义转义字符替代\\,比如：
```unicode
U&"d!00061t!+000061" UESCAPE '!'
```

使用$标记标识原始字符串，$标记包围的字符串可以包含任何字符，不需要转义，格式：
```
$$raw_string$$
$tag$raw_string$tag$
```

举例函数定义可以表示为：
```
$function$
BEGIN
    RETURN ($1 ~ $q$[\t\r\n\v\\]$q$);
END;
$function$
```

### 位串常量
二进制位串使用B标记，十六进制位串使用X标记，举例：
```
B'101001'
X'1FF'
```

### 数字常量
常用的数字常量格式：
```
digits
digits.[digits][e[+-]digits]
[digits].digits[e[+-]digits]
digitse[+-]digits
0xhexdigits
0ooctdigits
0bbindigits
digits_digits
```

举例：
```
43
2.3
4.
.002
5e4
1.82e-3
0x1A
0o27
0b101011
1_000_000
```

数字常量自动被转换为最合适的类型，比如interger（32位）、bigint（64位）、numeric等。可以使用强制类型转换，语法：
```
CAST ('expression' AS type)
expression::CAST
```

举例：
```
REAL '1.23'
1.23::REAL
```

### 操作符
```
+-*/<>=~!@#%^&|`?
```

### 注释
```
-- This is single-line comment

/** This is multi-line comment
* with nesting: /* nested comment */
*/
```

### 表达式
| 类型 | 表达式 | 描述 |
| --- | --- | --- |
| 列 | table_name.column_name | 列名唯一时表名和逗号可以省略 |
| 参数 | $1, $2, ... | 比如$1代表函数调用中的第一个参数，类比shell脚本 |
| 数组 | table_name.array_column_name[INDEX] | 支持多维数组，类比C语言中的数组，支持切片，类比python中字符串切片 |
| 字段 | (composite_column).field | 复合列中选取字段，类比C语言中的结构体，括号不能省略 |
| 一元运算 | opertator expression | 一元运算符 |
| 二元运算 | expression operator expression | 二元运算符 |
| 函数调用 | function_name(expression, ...) | 函数调用， 比如sqrt(2) |