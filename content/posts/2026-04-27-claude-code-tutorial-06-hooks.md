---
title: "Claude Code 教程系列：钩子（Hooks）"
description: "Claude Code 钩子系统详解与实用指南"
date: 2026-04-27
categories: ["教程"]
tags: ["Claude Code", "AI", "教程"]
featured: true
author: "ifindv"
---

钩子是响应Claude Code会话中特定事件而自动执行的脚本。它们实现自动化、验证、权限管理和自定义工作流。

## 核心概念

### 什么是钩子？

钩子是在Claude Code中发生特定事件时自动执行的自动化操作（shell命令、HTTP webhooks、LLM提示或子代理评估）。它们通过JSON输入接收信息，并通过退出代码和JSON输出传达结果。

**关键特性：**
- 事件驱动的自动化
- 基于JSON的输入/输出
- 支持command、prompt、http和agent钩子类型
- 工具特定的模式匹配

### 配置位置

钩子在具有特定结构的设置文件中配置：

- `~/.claude/settings.json` - 用户设置（所有项目）
- `.claude/settings.json` - 项目设置（可共享，已提交）
- `.claude/settings.local.json` - 本地项目设置（未提交）
- Managed policy - 组织范围设置
- Plugin `hooks/hooks.json` - 插件范围钩子
- Skill/Agent frontmatter - 组件生命周期钩子

### 基本配置结构

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

### 模式匹配

| 模式 | 描述 | 示例 |
|------|------|------|
| 精确字符串 | 匹配特定工具 | `"Write"` |
| 正则表达式 | 匹配多个工具 | `"Edit\|Write"` |
| 通配符 | 匹配所有工具 | `"*"` 或 `""` |
| MCP工具 | 服务器和工具模式 | `"mcp__memory__.*"` |

## 钩子类型

Claude Code支持四种钩子类型：

### Command Hooks

默认钩子类型。执行shell命令并通过JSON stdin/stdout和退出代码进行通信。

```json
{
  "type": "command",
  "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/validate.py\"",
  "timeout": 60
}
```

### HTTP Hooks

接收与command hooks相同JSON输入的远程webhook端点。HTTP hooks将JSON POST到URL并接收JSON响应。

```json
{
  "hooks": {
    "PostToolUse": [{
      "type": "http",
      "url": "https://my-webhook.example.com/hook",
      "matcher": "Write"
    }]
  }
}
```

### Prompt Hooks

LLM评估的提示，其中钩子内容是Claude评估的提示。主要用于`Stop`和`SubagentStop`事件，用于智能任务完成检查。

```json
{
  "type": "prompt",
  "prompt": "评估Claude是否完成了所有请求的任务。",
  "timeout": 30
}
```

LLM评估提示并返回结构化决策。

### Agent Hooks

基于子代理的验证钩子，生成专用代理来评估条件或执行复杂检查。与prompt hooks（单轮LLM评估）不同，agent hooks可以使用工具并执行多步推理。

```json
{
  "type": "agent",
  "prompt": "验证代码更改遵循我们的架构指南。检查相关设计文档并进行比较。",
  "timeout": 120
}
```

## 钩子事件

Claude Code支持**26个钩子事件**：

| 事件 | 触发时机 | 可阻塞 | 常见用途 |
|------|----------|--------|----------|
| **SessionStart** | 会话开始/恢复/清除/压缩 | 否 | 环境设置 |
| **InstructionsLoaded** | CLAUDE.md或规则文件加载后 | 否 | 修改/过滤指令 |
| **UserPromptSubmit** | 用户提交提示时 | 是 | 验证提示 |
| **PreToolUse** | 工具执行前 | 是 (允许/拒绝/询问) | 验证、修改输入 |
| **PermissionRequest** | 显示权限对话框时 | 是 | 自动批准/拒绝 |
| **PermissionDenied** | 用户拒绝权限提示时 | 否 | 日志记录、分析、策略执行 |
| **PostToolUse** | 工具成功后 | 否 | 添加上下文、反馈 |
| **PostToolUseFailure** | 工具执行失败时 | 否 | 错误处理、日志记录 |
| **SubagentStart** | 子代理生成时 | 否 | 子代理设置 |
| **SubagentStop** | 子代理完成时 | 是 | 子代理验证 |
| **Stop** | Claude完成响应时 | 是 | 任务完成检查 |
| **TaskCompleted** | 任务标记为完成时 | 是 | 任务后操作 |
| **ConfigChange** | 配置文件更改时 | 是 (策略除外) | 对配置更新的反应 |
| **SessionEnd** | 会话终止时 | 否 | 清理、最终日志记录 |

### 退出代码

| 退出代码 | 含义 | 行为 |
|----------|------|------|
| **0** | 成功 | 继续，解析JSON stdout |
| **2** | 阻塞错误 | 阻止操作，stderr显示为错误 |
| **其他** | 非阻塞错误 | 继续，verbose模式中显示stderr |

## 实用示例

### 示例1：Bash命令验证器（PreToolUse）

**文件：**`.claude/hooks/validate-bash.py`

```python
#!/usr/bin/env python3
import json
import sys
import re

BLOCKED_PATTERNS = [
    (r"\brm\s+-rf\s+/", "阻止危险的rm -rf /命令"),
    (r"\bsudo\s+rm", "阻止sudo rm命令"),
]

def main():
    input_data = json.load(sys.stdin)
    
    tool_name = input_data.get("tool_name", "")
    if tool_name != "Bash":
        sys.exit(0)
    
    command = input_data.get("tool_input", {}).get("command", "")
    
    for pattern, message in BLOCKED_PATTERNS:
        if re.search(pattern, command):
            print(message, file=sys.stderr)
            sys.exit(2)  # 退出代码2 = 阻塞错误
    
    sys.exit(0)

if __name__ == "__main__":
    main()
```

**配置：**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/validate-bash.py\""
          }
        ]
      }
    ]
  }
}
```

### 示例2：安全扫描器（PostToolUse）

**文件：**`.claude/hooks/security-scan.py`

```python
#!/usr/bin/env python3
import json
import sys
import re

SECRET_PATTERNS = [
    (r"password\s*=\s*['\"][^'\"]+['\"]", "潜在的硬编码密码"),
    (r"api[_-]?key\s*=\s*['\"][^'\"]+['\"]", "潜在的硬编码API密钥"),
]

def main():
    input_data = json.load(sys.stdin)
    
    tool_name = input_data.get("tool_name", "")
    if tool_name not in ["Write", "Edit"]:
        sys.exit(0)
    
    tool_input = input_data.get("tool_input", {})
    content = tool_input.get("content", "") or tool_input.get("new_string", "")
    file_path = tool_input.get("file_path", "")
    
    warnings = []
    for pattern, message in SECRET_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            warnings.append(message)
    
    if warnings:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": f"{file_path}的安全警告：" + "; ".join(warnings)
            }
        }
        print(json.dumps(output))
    
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### 示例3：自动格式化代码（PostToolUse）

**文件：**`.claude/hooks/format-code.sh`

```bash
#!/bin/bash

# 从stdin读取JSON
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_name', ''))")
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_input', {}).get('file_path', ''))")

if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then
    exit 0
fi

# 根据文件扩展名格式化
case "$FILE_PATH" in
    *.js|*.jsx|*.ts|*.tsx|*.json)
        command -v prettier &>/dev/null && prettier --write "$FILE_PATH" 2>/dev/null
        ;;
    *.py)
        command -v black &>/dev/null && black "$FILE_PATH" 2>/dev/null
        ;;
    *.go)
        command -v gofmt &>/dev/null && gofmt -w "$FILE_PATH" 2>/dev/null
        ;;
esac

exit 0
```

### 示例4：提示验证器（UserPromptSubmit）

**文件：**`.claude/hooks/validate-prompt.py`

```python
#!/usr/bin/env python3
import json
import sys
import re

BLOCKED_PATTERNS = [
    (r"delete\s+(all\s+)?database", "危险：数据库删除"),
    (r"rm\s+-rf\s+/", "危险：根目录删除"),
]

def main():
    input_data = json.load(sys.stdin)
    prompt = input_data.get("user_prompt", "") or input_data.get("prompt", "")
    
    for pattern, message in BLOCKED_PATTERNS:
        if re.search(pattern, prompt, re.IGNORECASE):
            output = {
                "decision": "block",
                "reason": f"已阻止：{message}"
            }
            print(json.dumps(output))
            sys.exit(0)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### 示例5：智能停止钩子（基于Prompt）

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "审查Claude是否完成了所有请求的任务。检查：1) 所有文件是否已创建/修改？2) 是否有未解决的错误？如果不完整，说明缺少什么。",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 环境变量

| 变量 | 可用性 | 描述 |
|------|--------|------|
| `CLAUDE_PROJECT_DIR` | 所有钩子 | 项目根目录的绝对路径 |
| `CLAUDE_ENV_FILE` | SessionStart, CwdChanged, FileChanged | 持久化环境变量的文件路径 |
| `CLAUDE_CODE_REMOTE` | 所有钩子 | 如果在远程环境中运行则为"true" |
| `${CLAUDE_PLUGIN_ROOT}` | 插件钩子 | 插件目录的路径 |
| `${CLAUDE_PLUGIN_DATA}` | 插件钩子 | 插件数据目录的路径 |

## 组件级钩子

钩子可以附加到特定组件（skills、agents、commands）的frontmatter中：

**在SKILL.md、agent.md或command.md中：**

```yaml
---
name: secure-operations
description: 执行带有安全检查的操作
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/check.sh"
          once: true  # 每会话仅运行一次
---
```

**组件钩子支持的事件：**`PreToolUse`、`PostToolUse`、`Stop`

## 最佳实践

### 安全考虑

#### Do's ✅
- 验证并清理所有输入
- 引用shell变量：`"$VAR"`
- 阻止路径遍历（`..`）
- 使用`$CLAUDE_PROJECT_DIR`的绝对路径
- 跳过敏感文件（`.env`、`.git/`、密钥）
- 首先在隔离环境中测试钩子
- 对HTTP hooks使用显式`allowedEnvVars`

#### Don'ts ❌
- 不要盲目信任输入数据
- 不要使用未引用的：`$VAR`
- 不要允许任意路径
- 不要硬编码路径
- 不要处理所有文件
- 不要部署未经测试的钩子
- 不要将所有env变量暴露给webhooks

### 调试

### 启用调试模式

使用debug标志运行Claude以获取详细的钩子日志：

```bash
claude --debug
```

### 详细模式

在Claude Code中使用`Ctrl+O`启用详细模式并查看钩子执行进度。

### 独立测试钩子

```bash
# 使用示例JSON输入测试
echo '{"tool_name": "Bash", "tool_input": {"command": "ls -la"}}' | python3 .claude/hooks/validate-bash.py

# 检查退出代码
echo $?
```

## 相关资源

- [Claude Code钩子官方文档](https://code.claude.com/docs/en/hooks)
- [检查点和回溯](../claude-howto/08-checkpoints/) - 保存和恢复对话状态
- [斜杠命令](../claude-howto/01-slash-commands/) - 创建自定义斜杠命令
- [技能](../claude-howto/03-skills/) - 可复用的自主能力
- [子代理](../claude-howto/04-subagents/) - 委托任务执行
- [插件](../claude-howto/07-plugins/) - 捆绑的扩展包

---
这是[Claude Code 教程系列](../claude-howto/)的第六篇文章。下一篇文章将介绍Claude Code的插件系统。