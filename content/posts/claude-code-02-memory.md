---
title: "claude code教程：memory"
description: "claude code 记忆详解"
date: 2026-04-23
categories: ["AI"]
tags: ["claude code"]
featured: true
author: "ifindv"
---
memory使claude具备context持久化与跨会话共享能力。

<!--more-->

## 核心概念

### 什么是记忆

其实就是字面意思，claude启动新会话时会自主加载记忆文件内容到context中，这避免了需要反复prompt相同内容的低效率，你可以将以下内容写入记忆文件：

- 项目标准
- 个人开发偏好
- 维护目录特定的规则和配置
- 需要引用的外部文档

### 快捷命令

关于记忆，常用的commands如下表所示：

| 命令              | 用途           | 使用                              | 何时使用                      |
| ----------------- | -------------- | --------------------------------- | ----------------------------- |
| `/init`         | 初始化项目记忆 | `/init`                         | 开始新项目，首次设置CLAUDE.md |
| `/memory`       | 编辑记忆文件   | `/memory`                       | 大量更新、重组、审查内容      |
| `@path/to/file` | 导入外部内容   | `@README.md`或 `@docs/api.md` | 在CLAUDE.md中引用外部文档     |

## 快速开始

### `/init`命令

`/init`命令是初始化项目记忆的快捷方式，它将扫描项目文件并生成初始的记忆文件CLAUDE.md。

- 在你的项目中创建一个新的CLAUDE.md文件（通常在 `./CLAUDE.md`或 `./.claude/CLAUDE.md`）
- 建立项目约定和指南
- 为跨会话的上下文持久化设置基础
- 提供记录项目标准的模板结构

### 记忆更新

**选项1：使用 `/memory`命令**

```bash
/memory
```

在你的系统编辑器中打开记忆文件以进行直接编辑。

**选项2：对话式询问**

```
记住我们在该项目中总是使用TypeScript严格模式。
请添加到记忆中：比起promise链更喜欢使用async/await。
```

Claude将根据你的请求更新适当的CLAUDE.md文件。

### 记忆注入

CLAUDE.md文件支持 `@path/to/file`语法来包含外部内容：

```markdown
# 项目文档
见@README.md了解项目概览
见@package.json了解可用的npm命令
见@docs/architecture.md了解系统设计

# 使用绝对路径从主目录导入
@~/.claude/my-project-instructions.md
```

### 记忆层级

claude code使用多层分层记忆系统。当claude code启动时，记忆文件自主加载，更高层级的文件具有优先权：

| 位置                                                          | 作用域           | 优先级   | 共享 | 访问       | 最适合                     |
| ------------------------------------------------------------- | ---------------- | -------- | ---- | ---------- | -------------------------- |
| `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Managed Policy   | 1 (最高) | 组织 | 系统       | 公司范围策略               |
| `/etc/claude-code/CLAUDE.md` (Linux/WSL)                    | Managed Policy   | 1 (最高) | 组织 | 系统       | 组织标准                   |
| `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows)           | Managed Policy   | 1 (最高) | 组织 | 系统       | 公司指南                   |
| `managed-settings.d/*.md` (策略旁边)                        | Managed Drop-ins | 1.5      | 组织 | 系统       | 模块化策略文件（v2.1.83+） |
| `./CLAUDE.md`或 `./.claude/CLAUDE.md`                     | Project Memory   | 2        | 团队 | Git        | 团队标准、共享架构         |
| `./.claude/rules/*.md`                                      | Project Rules    | 3        | 团队 | Git        | 路径特定、模块化规则       |
| `~/.claude/CLAUDE.md`                                       | User Memory      | 4        | 个人 | 文件系统   | 个人偏好（所有项目）       |
| `~/.claude/rules/*.md`                                      | User Rules       | 5        | 个人 | 文件系统   | 个人规则（所有项目）       |
| `./CLAUDE.local.md`                                         | Project Local    | 6        | 个人 | Git (忽略) | 个人项目特定偏好           |
| `~/.claude/projects/<project>/memory/`                      | Auto Memory      | 7 (最低) | 个人 | 文件系统   | Claude的自主记录和学习     |

### 模块化规则系统

使用 `.claude/rules/`目录结构创建有组织的、路径特定的规则。规则可以在项目级别和用户级别定义：

```
your-project/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       ├── security.md
│       └── api/                  # 支持子目录
│           ├── conventions.md
│           └── validation.md

~/.claude/
├── CLAUDE.md
└── rules/                        # 用户级规则（所有项目）
    ├── personal-style.md
    └── preferred-patterns.md
```

规则在 `rules/`目录内递归发现，包括任何子目录。`~/.claude/rules/`处的用户级规则在项目级规则之前加载，允许项目可以覆盖的个人默认值。

### 使用YAML Frontmatter的路径特定规则

定义仅适用于特定文件路径的规则：

```markdown
---
paths: src/api/**/*.ts
---

# API开发规则

- 所有API端点必须包含输入验证
- 使用Zod进行架构验证
- 记录所有参数和响应类型
- 为所有操作包含错误处理
```

### 自主记忆

自主记忆是一个持久化目录，claude在处理项目时自主记录学习、模式和见解。与手动编写和维护的CLAUDE.md文件不同，自主记忆由Claude本身在会话期间编写。

### 自主记忆的工作原理

- **位置**：`~/.claude/projects/<project>/memory/`
- **入口点**：`MEMORY.md`是自主记忆目录中的主文件
- **主题文件**：用于特定主题的可选附加文件（例如，`debugging.md`、`api-conventions.md`）
- **加载行为**：`MEMORY.md`的前200行（或前25KB，以先到者为准）在会话开始时加载到上下文中。主题文件按需加载，不在启动时加载
- **读/写**：Claude在会话期间读写记忆文件，因为它发现模式和项目特定知识

### 自主记忆目录结构

```
~/.claude/projects/<project>/memory/
├── MEMORY.md              # 入口点（前200行 / 25KB在启动时加载）
├── debugging.md           # 主题文件（按需加载）
├── api-conventions.md     # 主题文件（按需加载）
└── testing-patterns.md    # 主题文件（按需加载）
```

### Worktree共享

同一git存储库中的所有worktree和子目录共享单个自主记忆目录。这意味着在worktree之间切换或在同一存储库的不同子目录中工作将读取和写入相同的记忆文件。

### 子代理记忆

子代理（通过Task工具或并行执行生成）可以有自己的记忆上下文。使用子代理定义中的 `memory` frontmatter字段指定要加载的记忆作用域：

```yaml
memory: user      # 仅加载用户级记忆
memory: project   # 仅加载项目级记忆
memory: local     # 仅加载本地记忆
```

### 控制自主记忆

自主记忆可以通过 `CLAUDE_CODE_DISABLE_AUTO_MEMORY`环境变量控制：

| 值           | 行为                       |
| ------------ | -------------------------- |
| `0`        | 强制自主记忆**开启** |
| `1`        | 强制自主记忆**关闭** |
| *(未设置)* | 默认行为（自主记忆启用）   |

```bash
# 为会话禁用自主记忆
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude

# 显式强制开启自主记忆
CLAUDE_CODE_DISABLE_AUTO_MEMORY=0 claude
```

### 使用 `--add-dir`的附加目录

`--add-dir`标志允许claude code从当前工作目录之外的其他目录加载CLAUDE.md文件。这对于monorepo或多项目设置很有用，其中其他目录的上下文是相关的。

要启用此功能，设置环境变量：

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1
```

然后用标志启动claude code：

```bash
claude --add-dir /path/to/other/project
```

Claude将从指定的附加目录加载CLAUDE.md，与当前工作目录的记忆文件一起。

## 实用示例

### 示例1：项目记忆结构

**文件：**`./CLAUDE.md`

```markdown
# 项目配置

## 项目概览
- **名称**：电商交易平台
- **技术栈**：Node.js、PostgreSQL、React 18、Docker
- **团队规模**：5名开发者
- **截止日期**：2025年第四季度

## 架构
@docs/architecture.md
@docs/api-standards.md
@docs/database-schema.md

## 开发标准

### 代码风格
- 使用Prettier进行格式化
- 使用ESLint和airbnb配置
- 最大行长度：100字符
- 使用2空格缩进

### 命名约定
- **文件**：kebab-case (user-controller.js)
- **类**：PascalCase (UserService)
- **函数/变量**：camelCase (getUserById)
- **常量**：UPPER_SNAKE_CASE (API_BASE_URL)
- **数据库表**：snake_case (user_accounts)

### Git工作流
- 分支命名：`feature/描述`或`fix/描述`
- 提交消息：遵循conventional commits
- 合并前需要PR
- 所有CI/CD检查必须通过
- 至少需要1个批准

### 测试要求
- 最低80%代码覆盖率
- 所有关键路径必须有测试
- 使用Jest进行单元测试
- 使用Cypress进行E2E测试
- 测试文件名：`*.test.ts`或`*.spec.ts`

### API标准
- 仅限RESTful端点
- JSON请求/响应
- 正确使用HTTP状态码
- 版本化API端点：`/api/v1/`
- 用示例记录所有端点

### 数据库
- 使用迁移进行架构更改
- 永不硬编码凭据
- 使用连接池
- 在开发中启用查询日志
- 需要定期备份

### 部署
- 基于Docker的部署
- Kubernetes编排
- 蓝绿部署策略
- 失败时自主回滚
- 部署前运行数据库迁移

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm test` | 运行测试套件 |
| `npm run lint` | 检查代码风格 |
| `npm run build` | 构建生产版本 |
| `npm run migrate` | 运行数据库迁移 |

## 团队联系
- 技术主管：Sarah Chen (@sarah.chen)
- 产品经理：Mike Johnson (@mike.j)
- DevOps：Alex Kim (@alex.k)

## 已知问题和解决方法
- 高峰时段PostgreSQL连接池限制为20
- 解决方法：实现查询队列
- Safari 14与async生成器兼容性问题
- 解决方法：使用Babel转译器

## 相关项目
- 分析仪表板：`/projects/analytics`
- 移动应用：`/projects/mobile`
- 管理面板：`/projects/admin`
```

### 示例2：目录特定记忆

**文件：**`./src/api/CLAUDE.md`

````markdown
# API模块标准

此文件为/src/api/中的所有内容覆盖根CLAUDE.md。

## API特定标准

### 请求验证
- 使用Zod进行架构验证
- 始终验证输入
- 返回400及验证错误
- 包含字段级错误详情

### 认证
- 所有端点需要JWT令牌
- 令牌在Authorization标头中
- 令牌24小时后过期
- 实现刷新令牌机制

### 响应格式

所有响应必须遵循此结构：

```json
{
  "success": true,
  "data": { /* 实际数据 */ },
  "timestamp": "2025-11-06T10:30:00Z",
  "version": "1.0"
}
```

错误响应：
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "用户消息",
    "details": { /* 字段错误 */ }
  },
  "timestamp": "2025-11-06T10:30:00Z"
}
```

### 分页
- 使用基于游标的分页（不是偏移）
- 包含`hasMore`布尔值
- 限制最大页面大小为100
- 默认页面大小：20

### 速率限制
- 认证用户每小时1000个请求
- 公共端点每小时100个请求
- 超限时返回429
- 包含retry-after标头

### 缓存
- 使用Redis进行会话缓存
- 缓存持续时间：默认5分钟
- 在写操作时使缓存失效
- 用资源类型标记缓存键
````

### 示例3：个人偏好

**文件：**`~/.claude/CLAUDE.md`

```markdown
# 我的开发偏好

## 关于我
- **经验水平**：8年全栈开发经验
- **偏好语言**：TypeScript、Python
- **沟通风格**：直接，附示例
- **学习风格**：带代码的视觉图表

## 代码偏好

### 错误处理
我偏好使用带有try-catch块和有意义错误消息的显式错误处理。
避免通用错误。始终记录错误以便调试。

### 注释
注释用于解释WHY，而不是WHAT。代码应该是自文档化的。
注释应该解释业务逻辑或非显而易见的决策。

### 测试
我偏好TDD（测试驱动开发）。
先写测试，然后实现。
关注行为，而不是实现细节。

### 架构
我偏好模块化、松耦合的设计。
使用依赖注入提高可测试性。
分离关注点（控制器、服务、仓库）。

## 调试偏好
- 使用前缀为`[DEBUG]`的console.log
- 包含上下文：函数名、相关变量
- 可用时使用堆栈跟踪
- 日志中始终包含时间戳

## 沟通
- 用图表解释复杂概念
- 在解释理论之前先展示具体示例
- 包含before/after代码片段
- 在末尾总结关键点

## 项目组织
我将项目组织为：

   project/
   ├── src/
   │   ├── api/
   │   ├── services/
   │   ├── models/
   │   └── utils/
   ├── tests/
   ├── docs/
   └── docker/

## 工具
- **IDE**：带有vim键绑定的VS Code
- **终端**：带有Oh-My-Zsh的Zsh
- **格式**：Prettier（100字符行长度）
- **Linter**：带有airbnb配置的ESLint
- **测试框架**：带有React Testing Library的Jest
```

## 参考链接

[claude-howto](https://github.com/luongnv89/claude-howto)
