---
title: "Claude Code 教程系列：子代理（Subagents）"
description: "Claude Code 子代理系统详解与实用指南"
date: 2026-04-25
categories: ["教程"]
tags: ["Claude Code", "AI", "教程"]
featured: true
author: "ifindv"
---

子代理是Claude Code可以委托任务给的专业化AI助手。每个子代理都有特定目的，使用与主对话分离的独立上下文窗口，并可以配置特定工具和自定义系统提示词。

## 核心概念

### 什么是子代理？

子代理通过以下方式在Claude Code中实现委托任务执行：

- 创建具有独立上下文窗口的**隔离AI助手**
- 提供专业化专业知识的**自定义系统提示词**
- 强制执行**工具访问控制**以限制能力
- 防止来自复杂任务的**上下文污染**
- 启用多个专门任务的**并行执行**

每个子代理独立操作，从干净的状态开始，仅接收其任务所需的特定上下文，然后将结果返回给主代理进行综合。

### 关键优势

| 优势 | 描述 |
|------|------|
| **上下文保留** | 在独立上下文中操作，防止主对话污染 |
| **专业化专业知识** | 针对特定领域进行微调，成功率更高 |
| **可复用性** | 在不同项目中使用并与团队共享 |
| **灵活权限** | 不同子代理类型具有不同的工具访问级别 |
| **可扩展性** | 多个代理同时处理不同方面 |

### 文件位置

子代理文件可以存储在具有不同作用域的多个位置：

| 优先级 | 类型 | 位置 | 作用域 |
|--------|------|------|--------|
| 1 (最高) | **CLI定义** | 通过`--agents`标志（JSON） | 仅会话 |
| 2 | **项目级子代理** | `.claude/agents/` | 当前项目 |
| 3 | **用户级子代理** | `~/.claude/agents/` | 所有项目 |
| 4 (最低) | **插件代理** | 插件`agents/`目录 | 通过插件 |

![子代理优先级层级](/img/claude-code-subagent-hierarchy.png)

*图：子代理配置的优先级层级，高优先级的配置会覆盖低优先级的配置。*

### 内置子代理

Claude Code包括几个始终可用的内置子代理：

| 代理 | 模型 | 目的 |
|------|------|------|
| **general-purpose** | 继承 | 复杂、多步骤任务 |
| **Plan** | 继承 | 规划模式研究 |
| **Explore** | Haiku | 只读代码库探索（quick/medium/very thorough） |
| **Bash** | 继承 | 在独立上下文中执行终端命令 |
| **statusline-setup** | Sonnet | 配置状态栏 |
| **Claude Code Guide** | Haiku | 回答Claude Code功能问题 |

![内置子代理类型](/img/claude-code-subagent-types.png)

*图：Claude Code内置的6个子代理类型，每个都有特定的用途和模型配置。*

### Explore子代理的探索级别

- **"quick"** - 最少探索的快速搜索，适合查找特定模式
- **"medium"** - 中等探索，平衡速度和全面性，默认方法
- **"very thorough"** - 跨多个位置和命名约定的全面分析，可能需要更长时间

## 实用示例

### 示例1：创建代码审查子代理

```yaml
---
name: code-reviewer
description: 专家代码审查专家。编写或修改代码后主动使用。
tools: Read, Grep, Glob, Bash
---

你是一名高级代码审查专家。专注于代码质量、安全性和最佳实践。

## 审查优先级（按顺序）
1. 安全问题
2. 性能问题
3. 代码质量

## 输出格式
对于每个问题提供：
- 严重性：Critical/High/Medium/Low
- 类别：安全/性能/质量/可维护性
- 位置：文件和行号
- 描述：清晰的说明
- 修复：代码示例
- 影响：为什么重要

## 行动步骤
调用时：
1. 运行`git diff`查看最近更改
2. 专注于修改的文件
3. 立即开始审查
```

### 示例2：测试工程师子代理

```yaml
---
name: test-engineer
description: 测试策略、覆盖率分析和自动化测试专家
tools: Read, Write, Bash, Grep
---

你是一名测试自动化专家。当你看到代码更改时，主动运行相应的测试。
如果测试失败，分析失败并修复它们，同时保留原始测试意图。

## 专长
- 单元测试创建
- 集成测试设计
- 边缘情况识别
- 覆盖率分析（>80%目标）

## 测试策略
1. 识别测试用例
2. 编写测试（先失败）
3. 实现代码（通过测试）
4. 重构（保持通过）
5. 确保覆盖率>80%
```

### 示例3：调试器子代理

```yaml
---
name: debugger
description: 错误、测试失败和意外行为的调试专家
tools: Read, Edit, Bash, Grep, Glob
---

你是一名调试专家。专注于根本原因分析和最小修复。

## 调试流程
1. 复现问题
2. 收集错误信息
3. 分析根本原因
4. 实施最小修复
5. 验证解决方案

## 方法
- 始终首先调查错误消息
- 使用日志进行追踪
- 隔离问题变量
- 修复，不要重构
```

### 示例4：持久内存子代理

使用`memory`字段为子代理提供跨对话持久化的目录：

```yaml
---
name: researcher
memory: user
---

你是一名研究助理。使用你的内存目录存储发现、跨会话跟踪进度，并随时间积累知识。

在每个会话开始时检查你的MEMORY.md文件以回忆之前的上下文。

将重要发现写入你的内存目录，以便在将来的会话中访问。
```

### 示例5：工作树隔离子代理

`isolation: worktree`设置给子代理自己的git工作树，允许它独立地进行更改而不影响主工作树：

```yaml
---
name: feature-builder
isolation: worktree
description: 在隔离的git工作树中实现功能
tools: Read, Write, Edit, Bash, Grep, Glob
---

你在自己的git工作树中操作。创建功能时：
1. 创建功能分支
2. 在隔离的工作树中实现功能
3. 运行测试
4. 返回工作树路径和分支名称以供审查
```

## 配置字段

| 字段 | 必需 | 描述 |
|------|------|------|
| `name` | 是 | 唯一标识符（小写字母和连字符） |
| `description` | 是 | 目的自然语言描述。包含"use PROACTIVELY"以鼓励自动调用 |
| `tools` | 否 | 特定工具的逗号分隔列表。省略以继承所有工具。支持`Agent(agent_name)`语法以限制可生成子代理 |
| `disallowedTools` | 否 | 子代理不得使用的工具的逗号分隔列表 |
| `model` | 否 | 使用的模型：`sonnet`、`opus`、`haiku`、完整模型ID或`inherit` |
| `permissionMode` | 否 | `default`、`acceptEdits`、`dontAsk`、`bypassPermissions`、`plan` |
| `maxTurns` | 否 | 子代理可以采取的最大代理轮数 |
| `skills` | 否 | 要预加载的技能的逗号分隔列表 |
| `mcpServers` | 否 | 对子代理可用的MCP服务器 |
| `memory` | 否 | 持久内存目录作用域：`user`、`project`或`local` |
| `background` | 否 | 设置为`true`以始终将此子代理作为后台任务运行 |
| `effort` | 否 | 推理努力级别：`low`、`medium`、`high`或`max` |
| `isolation` | 否 | 设置为`worktree`以给予子代理自己的git工作树 |

## 使用子代理

子代理的调用流程如下：

```mermaid
flowchart TB
    A["用户请求"] --> B{匹配子代理描述?}
    B -->|是| C["Claude自动委托"]
    B -->|否| D["主代理处理"]

    C --> E{显式调用?}
    E -->|@提及| F["强制调用指定子代理"]
    E -->|否| G["自动选择匹配的子代理"]

    F --> H["子代理创建"]
    G --> H

    H --> I["加载子代理配置"]
    I --> J["执行任务"]
    J --> K["返回结果给主代理"]

    K --> L["主代理综合结果"]
    L --> M["返回给用户"]

    style A fill:#4dabf7,stroke:#1864ab
    style C fill:#69db7c,stroke:#2b8a3e
    style H fill:#ffd43b,stroke:#f08c00
    style K fill:#ff6b6b,stroke:#c92a2a
```

### 自动委托

Claude根据以下内容主动委托任务：
- 请求中的任务描述
- 子代理配置中的`description`字段
- 当前上下文和可用工具

为了鼓励主动使用，在`description`字段中包含"use PROACTIVELY"或"MUST BE USED"。

### 显式调用

```
> 使用test-runner子代理修复失败的测试
> 让code-reviewer子代理查看我最近的更改
> 让debugger子代理调查此错误
```

### @-提及调用

使用`@`前缀保证调用特定子代理（绕过自动委托启发式）：

```
> @"code-reviewer (agent)" 审查auth模块
```

### 可恢复代理

子代理可以继续之前的对话，保留完整上下文：

```bash
# 初始调用
> 使用code-analyzer代理开始审查认证模块
# 返回agentId："abc123"

# 稍后恢复代理
> 恢复代理abc123，现在也分析授权逻辑
```

### 键盘快捷键

| 快捷键 | 操作 |
|--------|------|
| `Ctrl+B` | 将当前运行的子代理任务后台化 |
| `Ctrl+F` | 终止所有后台代理（按两次确认） |

## 最佳实践

### Do's ✅
- 从Claude生成的代理开始——生成初始子代理，然后迭代自定义
- 设计专注的子代理——单一、清晰的职责而不是一个做所有事情
- 编写详细的提示词——包含具体指令、示例和约束
- 限制工具访问——仅授予子代理目的所需的工具
- 版本控制——将项目级子代理检入版本控制以进行团队协作

### Don'ts ❌
- 不要创建具有相同角色的重叠子代理
- 不要给子代理不必要的工具访问权限
- 不要将子代理用于简单的单步骤任务
- 不要在一个子代理的提示词中混合关注点
- 不要忘记传递必要的上下文

## 相关资源

- [Claude Code子代理官方文档](https://code.claude.com/docs/en/sub-agents)
- [Agent Teams（实验性）](https://code.claude.com/docs/en/agent-teams)
- [claude-howto教程源码](../claude-howto/04-subagents/)

---
这是[Claude Code 教程系列](../claude-howto/)的第四篇文章。下一篇文章将介绍Claude Code的MCP协议。