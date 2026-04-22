---
title: "Claude Code 教程系列：斜杠命令（Slash Commands）"
date: 2026-04-22
description: "Claude Code 斜杠命令功能详解与实用指南"
tags: ["Claude Code", "AI", "教程"]
---

# Claude Code 教程系列：斜杠命令（Slash Commands）

斜杠命令（Slash Commands）是Claude Code中最基础的快捷方式，通过`/命令名`的语法快速调用预定义功能。无论是内置命令还是自定义命令，都能让你在开发过程中更高效地与Claude交互。

## 核心概念

### 什么是斜杠命令？

斜杠命令是用户手动触发的快捷方式，位于`.claude/skills/`或`.claude/commands/`目录中。Claude Code提供了60+个内置命令，同时支持创建自定义命令来扩展功能。

### 内置命令示例

| 命令 | 用途 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清除对话 |
| `/model` | 选择模型 |
| `/status` | 显示版本和账户状态 |
| `/cost` | 显示token使用统计 |
| `/context` | 可视化上下文使用情况 |
| `/agents` | 管理代理配置 |

### 自定义命令结构

自定义命令采用YAML frontmatter格式：

```yaml
---
name: optimize
description: 分析代码性能问题和优化机会。使用优化、性能、代码质量相关术语时自动触发。
---

# 代码优化

分析代码中的性能问题、内存泄漏和优化机会。

1. 算法效率分析（Big O）
2. 内存优化
3. 数据库查询优化
4. 缓存机会识别
```

### 命令参数处理

命令可以接收和处理参数：

**所有参数：**
```yaml
---
name: fix-issue
---

修复GitHub issue #$ARGUMENTS，遵循我们的编码标准
```
使用：`/fix-issue 123` → `$ARGUMENTS`变为"123"

**位置参数：**
```yaml
---
name: review-pr
---

以优先级$1审查PR #$0
```
使用：`/review-pr 456 high` → `$0`="456", `$1`="high"

### 动态上下文注入

使用`!command`语法执行shell命令并注入输出：

```yaml
---
name: commit
description: 使用git上下文创建提交
allowed-tools: Bash(git *)
---

## 上下文
- 当前状态：!`git status`
- 当前差异：!`git diff HEAD`
- 当前分支：!`git branch --show-current`
- 最近提交：!`git log --oneline -5`

基于上述更改创建单个git提交。
```

### 文件引用

使用`@`语法导入外部文件内容：

```markdown
审查@src/auth.ts的实现
比较@src/old-version.js与@src/new-version.js
```

### 调用控制

| 字段 | 用户可调用 | Claude可调用 |
|------|-----------|--------------|
| (默认) | 是 | 是 |
| `disable-model-invocation: true` | 是 | 否 |
| `user-invocable: false` | 否 | 是 |

## 实用示例

### 示例1：代码优化命令

```yaml
---
name: optimize
description: 分析代码性能问题。提及优化、性能、速度、效率时自动触发。
allowed-tools: Read, Grep, Bash
---

# 代码优化分析

审查代码中的性能问题和优化机会：

1. **算法复杂度** - 评估Big O复杂度
2. **内存使用** - 检查内存泄漏和不必要的分配
3. **数据库查询** - 识别N+1查询、缺少索引
4. **缓存策略** - 推荐可缓存的数据
5. **并发处理** - 建议异步操作的机会

提供具体优化建议和代码示例。
```

### 示例2：Pull Request准备命令

```yaml
---
name: pr
description: 引导完成PR的检查清单。提及PR、pull request、提交时自动触发。
---

# Pull Request 准备清单

在创建PR前完成以下检查：

## 代码质量
- [ ] 运行linting检查：`npm run lint`
- [ ] 修复所有linting错误
- [ ] 代码格式化：`npm run format`

## 测试
- [ ] 运行单元测试：`npm test`
- [ ] 测试覆盖率达标（>80%）
- [ ] 集成测试通过

## 文档
- [ ] 更新相关文档
- [ ] 添加CHANGELOG条目
- [ ] PR描述清晰说明更改

## Git
- [ ] 分支命名规范：`feature/描述`或`fix/描述`
- [ ] 提交消息遵循规范
- [ ] 无敏感信息泄露
```

### 示例3：Git提交命令

```yaml
---
name: commit
description: 创建带上下文的git提交。提及git、commit、提交时自动触发
disable-model-invocation: true
allowed-tools: Bash(git *)
---

## Git上下文
- 当前状态：!`git status`
- 暂存更改：!`git diff --cached`
- 分支信息：!`git branch --show-current`
- 最近提交：!`git log --oneline -5`

## 任务
基于上述git状态，创建一个有意义的git提交。
遵循项目的提交消息规范，清楚描述更改的目的。
```

## 最佳实践

### Do's ✅
- 使用清晰、动作导向的命令名称
- 在`description`中包含触发条件关键词
- 为命令添加具体的示例和使用说明
- 使用`disable-model-invocation`防止意外执行副作用操作
- 组织相关文件到命令目录中
- 在生产环境前测试命令

### Don'ts ❌
- 为一次性任务创建命令
- 在命令中硬编码敏感信息
- 跳过`description`字段
- 让命令过于复杂或涵盖多个不相关的功能
- 假设Claude知道当前项目状态
- 忘记添加工具权限配置（`allowed-tools`）

## 相关资源

- [Claude Code斜杠命令官方文档](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code技能文档](https://code.claude.com/docs/en/skills)
- [claude-howto教程源码](../claude-howto/01-slash-commands/)

---
这是[Claude Code 教程系列](../claude-howto/)的第一篇文章。下一篇文章将介绍Claude Code的内存系统。