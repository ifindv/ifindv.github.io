---
title: "claude code 教程：subagents"
description: "claude code 子代理详解"
date: 2026-04-25
categories: ["AI"]
tags: ["claude code"]
featured: true
author: "ifindv"
---
子代理是claude code可委派任务的专业AI助手，具备独立上下文，可进行tools访问控制，定制系统提示词。

<!--more-->

## 核心概念

### 子代理

子代理通过以下方式在claude code中实现委托任务执行：

- 创建具有独立上下文窗口的**隔离AI助手**
- 提供专业化的**自定义系统提示词**
- 强制执行**工具访问控制**以限制能力
- 防止来自复杂任务的**上下文污染**
- 启用多个专门任务的**并行执行**

每个子代理独立操作，从干净的状态开始，仅接收其任务所需的特定上下文，然后将结果返回给主代理进行综合。

### 关键优势

| 优势                 | 描述                                 |
| -------------------- | ------------------------------------ |
| **上下文保留** | 在独立上下文中操作，防止主对话污染   |
| **专业化**     | 针对特定领域进行微调，成功率更高     |
| **可复用性**   | 在不同项目中使用并与团队共享         |
| **灵活权限**   | 不同子代理类型具有不同的工具访问级别 |
| **可扩展性**   | 多个代理同时处理不同方面             |

### 文件位置

子代理文件可以存储在具有不同作用域的多个位置：

| 优先级   | 类型                   | 位置                          | 作用域   |
| -------- | ---------------------- | ----------------------------- | -------- |
| 1 (最高) | **CLI定义**      | 通过 `--agents`标志（JSON） | 仅会话   |
| 2        | **项目级子代理** | `.claude/agents/`           | 当前项目 |
| 3        | **用户级子代理** | `~/.claude/agents/`         | 所有项目 |
| 4 (最低) | **插件代理**     | 插件 `agents/`目录          | 通过插件 |

### 内置子代理

claude code包括几个始终可用的内置子代理：

| 代理                        | 模型   | 目的                                         |
| --------------------------- | ------ | -------------------------------------------- |
| **general-purpose**   | 继承   | 复杂、多步骤任务                             |
| **Plan**              | 继承   | 规划模式研究                                 |
| **Explore**           | Haiku  | 只读代码库探索（quick/medium/very thorough） |
| **Bash**              | 继承   | 在独立上下文中执行终端命令                   |
| **statusline-setup**  | Sonnet | 配置状态栏                                   |
| **claude code Guide** | Haiku  | 回答claude code功能问题                      |

### Explore子代理的探索级别

- **"quick"** - 最少探索的快速搜索，适合查找特定模式
- **"medium"** - 中等探索，平衡速度和全面性，默认方法
- **"very thorough"** - 跨多个位置和命名约定的全面分析，可能需要更长时间

## 架构

### 高层架构

主代理作为协调者，将任务委派给不同的专业子代理，子代理在独立上下文中执行后返回结果，由主代理综合后反馈给用户。

```mermaid
graph TB
    User["用户"]
    Main["主代理<br/>(协调者)"]
    Reviewer["代码审查<br/>子代理"]
    Tester["测试工程师<br/>子代理"]
    Docs["文档编写<br/>子代理"]

    User -->|请求| Main
    Main -->|委派| Reviewer
    Main -->|委派| Tester
    Main -->|委派| Docs
    Reviewer -->|返回结果| Main
    Tester -->|返回结果| Main
    Docs -->|返回结果| Main
    Main -->|综合| User
```

### 子代理生命周期

```mermaid
sequenceDiagram
    participant User as 用户
    participant MainAgent as 主代理
    participant SubAgent as 子代理
    participant Context as 独立上下文窗口

    User->>MainAgent: "构建新的认证功能"
    MainAgent->>MainAgent: 分析任务
    MainAgent->>SubAgent: "审查这段代码"
    SubAgent->>Context: 初始化干净上下文
    Context->>SubAgent: 加载子代理指令
    SubAgent->>SubAgent: 执行审查
    SubAgent-->>MainAgent: 返回发现
    MainAgent->>MainAgent: 整合结果
    MainAgent-->>User: 提供综合反馈
```

### 上下文管理

每个子代理获得独立的上下文窗口，避免主对话被污染，且只有相关上下文传递给子代理。

```mermaid
graph TB
    A["主代理上下文<br/>50,000 tokens"]
    B["子代理 1 上下文<br/>20,000 tokens"]
    C["子代理 2 上下文<br/>20,000 tokens"]
    D["子代理 3 上下文<br/>20,000 tokens"]

    A -->|干净状态| B
    A -->|干净状态| C
    A -->|干净状态| D

    B -->|仅返回结果| A
    C -->|仅返回结果| A
    D -->|仅返回结果| A

    style A fill:#e1f5fe
    style B fill:#fff9c4
    style C fill:#fff9c4
    style D fill:#fff9c4
```

**关键要点**：

- 每个子代理获得**全新上下文窗口**，不包含主对话历史
- 只有**相关上下文**传递给子代理
- 结果被**提炼后**返回主代理
- 有效防止长时间项目的**上下文令牌耗尽**

**关键行为**：

- **禁止嵌套生成** — 子代理不能生成其他子代理
- **后台权限** — 后台子代理自动拒绝任何未预先批准的权限请求
- **转录存储** — 子代理对话记录保存在 `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`
- **自动压缩** — 子代理上下文在约 95% 容量时自动压缩（可通过 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` 环境变量覆盖）

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

## 配置字段

| 字段                | 必需 | 描述                                                                                         |
| ------------------- | ---- | -------------------------------------------------------------------------------------------- |
| `name`            | 是   | 唯一标识符（小写字母和连字符）                                                               |
| `description`     | 是   | 目的自然语言描述。包含"use PROACTIVELY"以鼓励自动调用                                        |
| `tools`           | 否   | 特定工具的逗号分隔列表。省略以继承所有工具。支持 `Agent(agent_name)`语法以限制可生成子代理 |
| `disallowedTools` | 否   | 子代理不得使用的工具的逗号分隔列表                                                           |
| `model`           | 否   | 使用的模型：`sonnet`、`opus`、`haiku`、完整模型ID或 `inherit`                        |
| `permissionMode`  | 否   | `default`、`acceptEdits`、`dontAsk`、`bypassPermissions`、`plan`                   |
| `maxTurns`        | 否   | 子代理可以采取的最大代理轮数                                                                 |
| `skills`          | 否   | 要预加载的技能的逗号分隔列表                                                                 |
| `mcpServers`      | 否   | 对子代理可用的MCP服务器                                                                      |
| `memory`          | 否   | 持久内存目录作用域：`user`、`project`或 `local`                                        |
| `background`      | 否   | 设置为 `true`以始终将此子代理作为后台任务运行                                              |
| `effort`          | 否   | 推理努力级别：`low`、`medium`、`high`或 `max`                                        |
| `isolation`       | 否   | 设置为 `worktree`以给予子代理自己的git工作树                                               |

## 使用子代理

### 自动委托

claude根据以下内容主动委托任务：

- 请求中的任务描述
- 子代理配置中的 `description`字段
- 当前上下文和可用工具

为了鼓励主动使用，在 `description`字段中包含"use PROACTIVELY"或"MUST BE USED"。

### 显式调用

```
> 使用test-runner子代理修复失败的测试
> 让code-reviewer子代理查看我最近的更改
> 让debugger子代理调查此错误
```

### @-提及调用

使用 `@`前缀保证调用特定子代理（绕过自动委托启发式）：

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

| 快捷键     | 操作                           |
| ---------- | ------------------------------ |
| `Ctrl+B` | 将当前运行的子代理任务后台化   |
| `Ctrl+F` | 终止所有后台代理（按两次确认） |

## 子代理持久化内存

`memory` 字段赋予子代理跨会话持久化的内存目录，让子代理能够在不同会话间积累知识、存储笔记和上下文。

### 内存作用域

| 作用域      | 目录                                   | 用途                       |
| ----------- | -------------------------------------- | -------------------------- |
| `user`    | `~/.claude/agent-memory/<name>/`     | 跨项目的个人笔记和偏好     |
| `project` | `.claude/agent-memory/<name>/`       | 项目特定的团队共享知识     |
| `local`   | `.claude/agent-memory-local/<name>/` | 本地项目知识，不入版本控制 |

### 工作原理

- 内存目录中 `MEMORY.md` 的前 200 行自动加载到子代理的系统提示词中
- `Read`、`Write`、`Edit` 工具自动对子代理开放，用于管理内存文件
- 子代理可根据需要在其内存目录中创建额外文件

### 配置示例

```yaml
---
name: researcher
memory: user
---

你是一名研究助手。使用你的内存目录存储研究发现，
追踪跨会话的进度，并随时间积累知识。

在每个会话开始时检查 MEMORY.md 文件以恢复之前的上下文。
```

```mermaid
graph LR
    A["子代理<br/>会话 1"] -->|写入| M["MEMORY.md<br/>(持久化)"]
    M -->|加载到| B["子代理<br/>会话 2"]
    B -->|更新| M
    M -->|加载到| C["子代理<br/>会话 3"]

    style A fill:#e1f5fe,stroke:#333,color:#333
    style B fill:#e1f5fe,stroke:#333,color:#333
    style C fill:#e1f5fe,stroke:#333,color:#333
    style M fill:#f3e5f5,stroke:#333,color:#333
```

## Worktree 隔离

`isolation: worktree` 设置为子代理分配独立的 git worktree，使其能独立修改文件而不影响主工作树。

### 配置

```yaml
---
name: feature-builder
isolation: worktree
description: 在隔离的 git worktree 中实现功能
tools: Read, Write, Edit, Bash, Grep, Glob
---
```

### 工作原理

```mermaid
graph TB
    Main["主工作树"] -->|创建| Sub["子代理<br/>隔离 Worktree"]
    Sub -->|修改| WT["独立 Git<br/>Worktree + 分支"]
    WT -->|无变更| Clean["自动清理"]
    WT -->|有变更| Return["返回 worktree<br/>路径和分支"]

    style Main fill:#e1f5fe,stroke:#333,color:#333
    style Sub fill:#f3e5f5,stroke:#333,color:#333
    style WT fill:#e8f5e9,stroke:#333,color:#333
    style Clean fill:#fff3e0,stroke:#333,color:#333
    style Return fill:#fff3e0,stroke:#333,color:#333
```

- 子代理在其独立的 git worktree 和单独分支上操作
- 如果子代理未做任何更改，worktree 自动清理
- 如果存在更改，worktree 路径和分支名返回给主代理进行审查或合并

## 参考链接

[claude-howto](https://github.com/luongnv89/claude-howto)
