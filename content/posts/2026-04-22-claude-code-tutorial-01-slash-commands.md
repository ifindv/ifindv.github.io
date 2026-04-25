---
title: "Claude Code 教程系列：斜杠命令"
description: "快速掌握 Claude Code 斜杠命令，提升开发效率"
date: 2026-04-22
categories: ["教程"]
tags: ["Claude Code", "AI"]
featured: true
author: "ifindv"
---

斜杠命令是 Claude Code 的基础交互方式，通过 `/命令名` 快速调用预定义功能。内置 60+ 命令，同时支持自定义扩展。

## 内置命令速查

### 日常操作

| 命令 | 用途 |
|------|------|
| `/init` | 初始化项目，生成 CLAUDE.md |
| `/memory` | 编辑内存文件 |
| `/clear` | 清除对话（别名：`/reset`） |
| `/exit` | 退出（别名：`/quit`） |

### 代码相关

| 命令 | 用途 |
|------|------|
| `/diff` | 查看未提交更改的 diff |
| `/plan [描述]` | 进入规划模式，分析任务 |
| `/rewind` | 回溯对话或代码状态 |
| `/compact` | 压缩上下文，节省 token |

### 信息查看

| 命令 | 用途 |
|------|------|
| `/model` | 切换模型（Haiku / Sonnet / Opus） |
| `/cost` | 查看 token 使用统计 |
| `/context` | 可视化查看上下文占用 |
| `/status` | 显示版本、模型、账户信息 |

完整列表在 Claude Code 中输入 `/` 查看。

### 捆绑技能

| 技能 | 用途 |
|------|------|
| `/batch <指令>` | 使用 git worktree 并行执行大规模更改 |
| `/debug [描述]` | 启用调试日志排查问题 |
| `/loop <间隔> <提示>` | 定时重复运行提示 |
| `/simplify [聚焦]` | 审查代码质量 |

## 自定义命令

自定义斜杠命令已并入**技能系统**，创建技能后可直接用 `/技能名` 调用。

### 目录结构

```
.claude/skills/my-command/
└── SKILL.md
```

### 基本格式

```yaml
---
name: my-command
description: 命令功能描述，包含触发关键词
---

# 标题

执行步骤说明。
```

## 核心参数

| 参数 | 说明 |
|------|------|
| `name` | 命令名称，用 `/name` 调用 |
| `description` | 最重要 — 告诉 Claude 何时使用此命令 |
| `allowed-tools` | 无需审批可用的工具 |
| `disable-model-invocation` | `true` 时仅用户可调用 |

## 变量

| 变量 | 说明 |
|------|------|
| `$ARGUMENTS` | 调用时传入的全部参数 |
| `$0`, `$1` | 位置参数 |
| `` !`command` `` | 执行命令并插入结果 |
| `@file` | 插入文件内容 |

### 使用示例

```yaml
---
name: commit
description: 生成符合规范的 git 提交信息
allowed-tools: Bash(git *)
---

## 当前更改
!`git diff --stat`

## 最近提交
!`git log --oneline -3`

根据以上更改生成提交信息。
```

## 架构

![命令架构](/img/claude-code-command-architecture.png)

## 最佳实践

- ✅ 描述要具体，包含触发关键词
- ✅ 命令名清晰、动作导向
- ✅ 危险操作加 `disable-model-invocation: true`
- ❌ 不硬编码敏感信息（密码、API 密钥等）
- ❌ 不让命令过于复杂，一个命令做一件事

## 总结

斜杠命令是 Claude Code 最基础的交互入口。常用命令记不住没关系，输入 `/` 随时查看完整列表。自定义命令通过技能系统扩展，核心是写好 `name` 和 `description`，合理配置 `allowed-tools`。
