---
title: "Claude Code 教程系列：MCP协议（Model Context Protocol）"
date: 2026-04-26
description: "Claude Code MCP协议详解与实用指南"
tags: ["Claude Code", "AI", "教程"]
---

# Claude Code 教程系列：MCP协议（Model Context Protocol）

MCP（Model Context Protocol）是Claude访问外部工具、API和实时数据源的标准方式。与Memory不同，MCP提供对变化数据的实时访问。

## 核心概念

### 什么是MCP？

MCP是Claude与外部服务交互的标准化协议。它的关键特性包括：

- 对外部服务的实时访问
- 实时数据同步
- 可扩展架构
- 安全认证
- 基于工具的交互

### MCP架构

```mermaid
graph TB
    A["Claude"]
    B["MCP Server"]
    C["External Service"]

    A -->|Request: list_issues| B
    B -->|Query| C
    C -->|Data| B
    B -->|Response| A

    A -->|Request: create_issue| B
    B -->|Action| C
    C -->|Result| B
    B -->|Response| A
```

### MCP生态系统

Claude可以通过MCP连接到多种外部服务：

- **Filesystem** - 文件操作
- **GitHub** - 代码仓库管理
- **Slack** - 团队沟通
- **Database** - SQL查询
- **Google Docs** - 文档访问
- **Asana** - 项目管理
- **Stripe** - 支付数据

### 传输方式

| 方式 | 推荐 | 用途 |
|------|------|------|
| **HTTP** | ✅ 推荐 | 远程MCP服务器 |
| **Stdio** | 本地 | 本地运行的MCP服务器 |
| **SSE** | ❌ 已弃用 | 服务器发送事件 |

### OAuth 2.0认证

Claude Code支持需要OAuth 2.0的MCP服务器。当连接到启用OAuth的服务器时，Claude Code处理整个认证流程：

```bash
# 连接到启用OAuth的MCP服务器（交互流程）
claude mcp add --transport http my-service https://my-service.example.com/mcp

# 为非交互式设置预配置OAuth凭据
claude mcp add --transport http my-service https://my-service.example.com/mcp \
  --client-id "your-client-id" \
  --client-secret "your-client-secret" \
  --callback-port 8080
```

### MCP作用域

MCP配置可以存储在不同的作用域，具有不同的共享级别：

| 作用域 | 位置 | 描述 | 共享于 |
|--------|------|------|--------|
| **Local** (默认) | `~/.claude.json` | 当前用户私有，仅当前项目 | 仅你 | 否 |
| **Project** | `.mcp.json` | 检入git仓库 | 团队成员 | 是（首次使用） |
| **User** | `~/.claude.json` | 所有项目可用 | 仅你 | 否 |

## 实用示例

### 示例1：GitHub MCP配置

**文件：**`.mcp.json`（项目根目录）

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**可用的GitHub MCP工具：**

#### Pull Request管理
- `list_prs` - 列出仓库中的所有PR
- `get_pr` - 获取PR详情包括差异
- `create_pr` - 创建新PR
- `update_pr` - 更新PR描述/标题
- `merge_pr` - 将PR合并到主分支
- `review_pr` - 添加审查评论

**示例请求：**
```
/mcp__github__get_pr 456

# 返回：
标题：添加深色模式支持
作者：@alice
描述：使用CSS变量实现深色主题
状态：OPEN
审查者：@bob, @charlie
```

**设置：**
```bash
export GITHUB_TOKEN="your_github_token"
# 或使用CLI直接添加：
claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github
```

### 示例2：数据库MCP设置

**配置：**

```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-database"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/mydb"
      }
    }
  }
}
```

**示例用法：**

```markdown
用户：获取订单数超过10的所有用户

Claude：我将查询你的数据库来查找该信息。

# 使用MCP数据库工具：
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
HAVING COUNT(o.id) > 10
ORDER BY order_count DESC;

# 结果：
- Alice: 15个订单
- Bob: 12个订单
- Charlie: 11个订单
```

**设置：**
```bash
export DATABASE_URL="postgresql://user:pass@localhost/mydb"
# 或使用CLI直接添加：
claude mcp add --transport stdio database -- npx @modelcontextprotocol/server-database
```

### 示例3：多MCP工作流

**场景：每日报告生成**

```markdown
# 使用多个MCP的每日报告工作流

## 设置
1. GitHub MCP - 获取PR指标
2. 数据库MCP - 查询销售数据
3. Slack MCP - 发布报告
4. 文件系统MCP - 保存报告

## 工作流

### 步骤1：获取GitHub数据
/mcp__github__list_prs completed:true last:7days

输出：
- 总PR数：42
- 平均合并时间：2.3小时
- 审查周转时间：1.1小时

### 步骤2：查询数据库
SELECT COUNT(*) as sales, SUM(amount) as revenue
FROM orders
WHERE created_at > NOW() - INTERVAL '1 day'

输出：
- 销售额：247
- 收入：$12,450

### 步骤3：生成报告
将数据组合成HTML报告

### 步骤4：保存到文件系统
将report.html写入/reports/

### 步骤5：发布到Slack
将摘要发送到#daily-reports频道

最终输出：
✅ 报告已生成并发布
📊 本周合并了47个PR
💰 每日销售额$12,450
```

### 礥例4：文件系统MCP操作

**配置：**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

**可用的操作：**

| 操作 | 命令 | 用途 |
|------|------|------|
| 列出文件 | `ls ~/projects` | 显示目录内容 |
| 读取文件 | `cat src/main.ts` | 读取文件内容 |
| 写入文件 | `create docs/api.md` | 创建新文件 |
| 编辑文件 | `edit src/app.ts` | 修改文件 |
| 搜索 | `grep "async function"` | 在文件中搜索 |
| 删除 | `rm old-file.js` | 删除文件 |

### 环境变量扩展

MCP配置支持环境变量扩展和回退默认值。`${VAR}`和`${VAR:-default}`语法适用于以下字段：`command`、`args`、`env`、`url`和`headers`。

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}",
        "X-Custom-Header": "${CUSTOM_HEADER:-default-value}"
      }
    },
    "local-server": {
      "command": "${MCP_BIN_PATH:-npx}",
      "args": ["${MCP_PACKAGE:-@company/mcp-server}"],
      "env": {
        "DB_URL": "${DATABASE_URL:-postgresql://localhost/dev}"
      }
    }
  }
}
```

变量在运行时扩展：
- `${VAR}` - 使用环境变量，未设置则报错
- `${VAR:-default}` - 使用环境变量，未设置则回退到默认值

## MCP与Memory的决策矩阵

```mermaid
graph TD
    A["需要外部数据？"]
    A -->|否| B["使用Memory"]
    A -->|是| C["它经常变化吗？"]
    C -->|否/很少| B
    C -->|是/经常| D["使用MCP"]

    B -->|存储| E["偏好设置<br/>上下文<br/>历史"]
    D -->|访问| F["实时API<br/>数据库<br/>服务"]

    style A fill:#fff3e0,stroke:#333,color:#333
    style B fill:#e1f5fe,stroke:#333,color:#333
    style C fill:#fff3e0,stroke:#333,color:#333
    style D fill:#f3e5f5,stroke:#333,color:#333
    style E fill:#e8f5e9,stroke:#333,color:#333
    style F fill:#e8f5e9,stroke:#333,color:#333
```

## MCP工具搜索

当MCP工具描述超过上下文窗口的10%时，Claude Code自动启用工具搜索，以便有效地选择正确的工具，而不会使模型上下文不堪重负。

| 设置 | 值 | 描述 |
|------|------|------|
| `ENABLE_TOOL_SEARCH` | `auto`（默认） | 当工具描述超过上下文的10%时自动启用 |
| `ENABLE_TOOL_SEARCH` | `auto:<N>` | 在自定义阈值`N`时自动启用 |
| `ENABLE_TOOL_SEARCH` | `true` | 始终启用，无论工具数量 |
| `ENABLE_TOOL_SEARCH` | `false` | 禁用；所有工具描述完整发送 |

> **注意**：工具搜索需要Sonnet 4或更高版本，或Opus 4或更高版本。Haiku模型不支持工具搜索。

## MCP配置管理

```bash
# 添加基于HTTP的服务器
claude mcp add --transport http github https://api.github.com/mcp

# 添加本地stdio服务器
claude mcp add --transport stdio database -- npx @company/db-server

# 列出所有MCP服务器
claude mcp list

# 获取特定服务器的详细信息
claude mcp get github

# 移除MCP服务器
claude mcp remove github

# 重置项目特定的批准选择
claude mcp reset-project-choices

# 从Claude Desktop导入
claude mcp add-from-claude-desktop
```

## 最佳实践

### 安全考虑

### Do's ✅
- 对所有凭据使用环境变量
- 定期轮换令牌和API密钥（建议每月）
- 尽可能使用只读令牌
- 将MCP服务器访问范围限制为最小所需
- 监控MCP服务器使用情况和访问日志
- 对外部服务尽可能使用OAuth
- 实施MCP请求的速率限制
- 在生产使用前测试MCP连接
- 记录所有活动的MCP连接
- 保持MCP服务器包更新

### Don'ts ❌
- 不要在配置文件中硬编码凭据
- 不要将令牌或机密提交到git
- 不要在团队聊天或电子邮件中共享令牌
- 不要为团队项目使用个人令牌
- 不要授予不必要的权限
- 不要忽略身份验证错误
- 不要公开暴露MCP端点
- 不要以root/管理员权限运行MCP服务器
- 不要在日志中缓存敏感数据
- 不要禁用身份验证机制

### 配置最佳实践

1. **版本控制**：将`.mcp.json`保持在git中，但对机密使用环境变量
2. **最小权限**：为每个MCP服务器授予所需的最小权限
3. **隔离**：尽可能在不同的进程中运行不同的MCP服务器
4. **监控**：记录所有MCP请求和错误以进行审计跟踪
5. **测试**：在部署到生产环境之前测试所有MCP配置

### 性能提示

- 在应用程序级别缓存频繁访问的数据
- 使用特定的MCP查询以减少数据传输
- 监控MCP操作的响应时间
- 考虑对外部API实施速率限制
- 在执行多个操作时使用批处理

## 相关资源

- [Claude Code MCP官方文档](https://code.claude.com/docs/en/mcp)
- [MCP协议规范](https://modelcontextprotocol.io/specification)
- [可用MCP服务器](https://github.com/modelcontextprotocol/servers)
- [MCPorter](https://github.com/steipete/mcporter) — 用于调用MCP服务器的TypeScript运行时和CLI工具包
- [代码执行与MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) — Anthropic工程博客关于解决上下文膨胀的文章
- [claude-howto教程源码](../claude-howto/05-mcp/)

---
这是[Claude Code 教程系列](../claude-howto/)的第五篇文章。下一篇文章将介绍Claude Code的钩子系统。