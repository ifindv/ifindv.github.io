---
title: "Claude Code 教程系列：CLI参考（CLI Reference）"
description: "Claude Code CLI参考详解与实用指南"
date: 2026-05-01
categories: ["教程"]
tags: ["Claude Code", "AI", "教程"]
featured: true
author: "ifindv"
---

Claude Code命令行界面（CLI）提供了强大的命令行工具，用于自动化、CI/CD集成和高级工作流程。

## 核心命令

### 主要命令

| 命令 | 用途 |
|------|------|
| `claude` | 交互式模式（默认） |
| `claude -p` | 打印模式（非交互） |
| `claude -c` | 继续最近的会话 |
| `claude -r "session"` | 按名称或ID恢复会话 |

### 标志选项

| 标志 | 描述 |
|------|------|
| `--model` | 选择模型 |
| `--agent` | 选择代理 |
| `--permission-mode` | 权限模式 |
| `--effort` | 推理努力级别 |
| `--max-turns` | 最大自主轮数 |
| `--output-format` | 输出格式 |
| `--plugin-dir` | 加载插件目录 |
| `--worktree` | 在git worktree中启动 |

![CLI命令结构](/img/claude-code-cli-structure.png)

*图：Claude Code CLI的主要命令和标志选项，展示命令层次结构和配置能力。*

## 会话管理

### 恢复会话

```bash
# 继续最近的对话
claude -c

# 按名称恢复会话
claude -r "auth-refactor"

# 恢复并分支进行实验
claude --resume auth-refactor --fork-session "替代方法"
```

### 重命名和分支

```bash
# 在REPL内重命名当前会话
/rename auth-refactor

# 分支当前会话
/fork
```

## 会话管理流程

会话管理的基本流程如下：

```mermaid
flowchart TB
    A["启动Claude Code"] --> B{选择启动方式}
    B -->|claude| C["新建会话"]
    B -->|claude -c| D["继续最近会话"]
    B -->|claude -r 'name'| E["恢复指定会话"]

    C --> F["交互模式"]
    D --> F
    E --> F

    F --> G{会话操作}
    G -->|/rename| H["命名当前会话"]
    G -->|/fork| I["分支会话"]
    G -->|Ctrl+D| J["退出并保存"]
    G -->|继续使用| K["继续对话"]

    H --> K
    I --> K
    J --> L["会话持久化"]

    K -->{用户再次启动?}
    K -->|是| D
    K -->|否| L

    style A fill:#4dabf7,stroke:#1864ab
    style F fill:#69db7c,stroke:#2b8a3e
    style I fill:#ffd43b,stroke:#f08c00
    style L fill:#da77f2,stroke:#862e9c
```

## 权限模式

### 可用模式

| 模式 | 标志 | 用途 |
|------|------|------|
| `default` | `--permission-mode default` | 默认：只读文件，提示其他操作 |
| `acceptEdits` | `--permission-mode acceptEdits` | 接受编辑：读取和编辑，命令需要提示 |
| `plan` | `--permission-mode plan` | 规划模式：只读，规划后实施 |
| `auto` | `--permission-mode auto` | 自动模式：带后台安全分类器 |
| `bypassPermissions` | `--permission-mode bypassPermissions` | 绕过权限：所有操作无检查 |
| `dontAsk` | `--permission-mode dontAsk` | 不询问：仅预先批准的工具执行 |

### 切换模式

**键盘快捷键：**
```bash
Shift + Tab  # 循环所有权限模式
```

**命令行标志：**
```bash
claude --permission-mode plan
claude --permission-mode auto
```

## 模型选择

### 可用模型

| 模型 | 标志 | 描述 |
|------|------|------|
| Claude Opus 4.7 | `--model opus` | 最强大，处理复杂任务 |
| Claude Sonnet 4.6 | `--model sonnet` | 平衡性能和成本 |
| Claude Haiku 4.5 | `--model haiku` | 快速，简单任务 |

### 模型别名

- `opusplan` - 使用Opus进行规划，使用Sonnet执行

### 环境变量

```bash
# 设置默认模型
export ANTHROPIC_MODEL=claude-opus-4-7
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-7
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
```

## 推理努力级别

### 努力级别（Opus 4.7）

| 级别 | 标志 | 描述 |
|------|------|------|
| `low` (○) | `--effort low` | 低推理 |
| `medium` (◐) | `--effort medium` | 中等推理 |
| `high` (●) | `--effort high` | 高推理 |
| `xhigh` | `--effort xhigh` | 超高推理（Opus 4.7默认） |
| `max` | `--effort max` | 最大推理（仅Opus 4.7） |

### 环境变量

```bash
export CLAUDE_CODE_EFFORT_LEVEL=xhigh   # low, medium, high, xhigh, 或max
export MAX_THINKING_TOKENS=16000
```

## 打印模式（非交互）

### 基本用法

```bash
# 运行特定任务
claude -p "运行所有测试"

# 处理管道内容
cat error.log | claude -p "分析这些错误"
```

### 打印模式标志

| 标志 | 描述 |
|------|------|
| `--output-format json` | 结构化JSON输出 |
| `--max-turns N` | 限制自主轮数 |
| `--json-schema` | JSON模式验证 |
| `--no-session-persistence` | 禁用会话持久化 |

### JSON输出示例

```bash
claude -p --output-format json "分析代码质量" > analysis.json
```

## 插件管理

### 插件命令

```bash
# 从市场安装
claude plugin install plugin-name

# 卸载插件
claude plugin uninstall plugin-name

# 列出已安装的插件
claude plugin list

# 启用插件
claude plugin enable plugin-name

# 禁用插件
claude plugin disable plugin-name
```

### 本地插件测试

```bash
# 加载本地插件进行测试
claude --plugin-dir ./path/to/plugin
claude --plugin-dir ./plugin-a --plugin-dir ./plugin-b
```

## MCP管理

### MCP命令

```bash
# 添加MCP服务器
claude mcp add --transport http github https://api.github.com/mcp

# 添加本地stdio服务器
claude mcp add --transport stdio database -- npx @company/db-server

# 列出所有MCP服务器
claude mcp list

# 获取特定服务器详细信息
claude mcp get github

# 移除MCP服务器
claude mcp remove github
```

## Git Worktrees

### 启动Worktree

```bash
# 在隔离的worktree中启动Claude Code
claude --worktree
# 或
claude -w
```

### Worktree配置

```json
{
  "worktree": {
    "sparsePaths": ["packages/my-package", "shared/"]
  }
}
```

## 环境变量

### API配置

```bash
# API密钥
export ANTHROPIC_API_KEY=sk-ant-...

# 模型选择
export ANTHROPIC_MODEL=claude-opus-4-7
```

### 功能开关

```bash
# 禁用自动内存
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=true

# 禁用后台任务
export CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=true

# 禁用计划任务
export CLAUDE_CODE_DISABLE_CRON=1

# 禁用提示建议
export CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false
```

### MCP配置

```bash
# 最大MCP输出token
export MAX_MCP_OUTPUT_TOKENS=50000

# 启用工具搜索
export ENABLE_TOOL_SEARCH=true
```

### 任务管理

```bash
# 命名任务目录
export CLAUDE_CODE_TASK_LIST_ID=my-project-tasks
```

### 实验性功能

```bash
# 启用代理团队
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

## 管道集成

### 基本管道用法

```bash
# 将文件内容通过管道传递给Claude
cat file.txt | claude -p "总结这个文件"

# 将命令输出传递给Claude
ls -la | claude -p "分析这个目录结构"
```

### JSON处理

```bash
# 使用jq处理结构化输出
claude -p --output-format json "分析代码" | jq '.issues[]'
```

### CI/CD集成

**GitHub Actions示例：**
```yaml
- name: AI代码审查
  run: |
    claude -p --output-format json \
      --max-turns 3 \
      "审查PR的以下方面：代码质量、安全、性能" > review.json
```

## 键盘快捷键

### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 取消当前输入/生成 |
| `Ctrl+D` | 退出Claude Code |
| `Ctrl+G` | 在外部编辑器中编辑计划 |
| `Ctrl+L` | 清除终端屏幕 |
| `Ctrl+O` | 切换详细输出 |
| `Ctrl+R` | 反向搜索历史 |
| `Ctrl+T` | 切换任务列表 |
| `Esc+Esc` | 回溯代码/对话 |
| `Shift+Tab` | 切换权限模式 |
| `Alt+P` | 切换模型 |
| `Alt+T` | 切换扩展思考 |

## 调试和诊断

### 启用调试模式

```bash
claude --debug
```

### 详细模式

```bash
# 使用Ctrl+O启用详细模式查看推理过程
# 或使用标志
claude --verbose
```

## 最佳实践

### CLI使用

**Do's ✅**
- 使用打印模式进行自动化
- 管道集成用于数据处理
- 使用环境变量进行配置
- 使用JSON输出进行结构化处理

**Don'ts ❌**
- 不要在交互模式下使用不适合的标志
- 不要忽略错误输出
- 不要在CI/CD中使用交互式会话

### 安全性

**Do's ✅**
- 使用权限模式控制执行
- 适当时启用沙箱
- 安全地管理API密钥
- 审查自动化命令

**Don'ts ❌**
- 不要在配置文件中硬编码密钥
- 不要在生产中使用绕过权限
- 不要在敏感环境中启用调试模式

## 相关资源

- [Claude Code官方文档](https://code.claude.com/docs/en/)
- [交互模式文档](https://code.claude.com/docs/en/interactive-mode)
- [斜杠命令](../claude-howto/01-slash-commands/)
- [高级功能](../claude-howto/09-advanced-features/)
- [内存指南](../claude-howto/02-memory/)
- [技能指南](../claude-howto/03-skills/)

---
这是[Claude Code 教程系列](../claude-howto/)的第十篇文章，也是本系列的最后一篇文章。感谢阅读！