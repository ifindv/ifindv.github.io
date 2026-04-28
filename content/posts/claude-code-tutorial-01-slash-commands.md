---
title: "Claude教程系列：斜杠命令-slash commands"
description: "claude code 斜杠命令功能详解与实用指南"
date: 2026-04-22
categories: ["AI"]
tags: ["claude code"]
featured: true
author: "ifindv"
---
斜杠命令是claude code中最基础的交互方式，用户通过  `/命令名`快速调用预定义功能。claude内置了超60+斜杠命令，也可以由用户自定义。

## 内置命令

内置命令覆盖了绝大多数使用场景与功能。在claude中输入 `/`查看完整列表，或输入 `/`后跟任何字母进行过滤。

| 命令                                         | 用途                                                                                                                                                            |

| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| `/add-dir <path>`                          | 添加工作目录                                                                                                                                                    |

| `/agents`                                  | 管理代理配置                                                                                                                                                    |

| `/branch [name]`                           | 将对话分支到新会话（别名：`/fork`）。注意：`/fork`在v2.1.77中重命名为 `/branch`                                                                           |

| `/btw <question>`                          | 不添加到历史的旁注问题                                                                                                                                          |

| `/chrome`                                  | 配置Chrome浏览器集成                                                                                                                                            |

| `/clear`                                   | 清除对话（别名：`/reset`、`/new`）                                                                                                                          |

| `/color [color\|default]`                   | 设置提示栏颜色                                                                                                                                                  |

| `/compact [instructions]`                  | 使用可选聚焦指令压缩对话                                                                                                                                        |

| `/config`                                  | 打开设置（别名：`/settings`）                                                                                                                                 |

| `/context`                                 | 以彩色网格可视化上下文使用情况                                                                                                                                  |

| `/copy [N]`                                | 将助手响应复制到剪贴板；`w`写入文件                                                                                                                           |

| `/cost`                                    | 显示token使用统计                                                                                                                                               |

| `/desktop`                                 | 在桌面应用中继续（别名：`/app`）                                                                                                                              |

| `/diff`                                    | 未提交更改的交互式diff查看器                                                                                                                                    |

| `/doctor`                                  | 诊断安装健康状态                                                                                                                                                |

| `/effort [low\|medium\|high\|xhigh\|max\|auto]` | 通过交互式箭头键滑块设置努力级别。级别：`low` → `medium` → `high` → `xhigh`（v2.1.111新增）→ `max`。Opus 4.7默认为 `xhigh`；`max`仅限Opus 4.7 |

| `/exit`                                    | 退出REPL（别名：`/quit`）                                                                                                                                     |

| `/export [filename]`                       | 将当前对话导出到文件或剪贴板                                                                                                                                    |

| `/extra-usage`                             | 配置速率限制的额外使用                                                                                                                                          |

| `/fast [on\|off]`                           | 切换快速模式                                                                                                                                                    |

| `/feedback`                                | 提交反馈（别名：`/bug`）                                                                                                                                      |

| `/focus`                                   | 切换焦点视图（v2.1.110新增；替换 `Ctrl+O`用于焦点切换）                                                                                                       |

| `/help`                                    | 显示帮助                                                                                                                                                        |

| `/hooks`                                   | 查看钩子配置                                                                                                                                                    |

| `/ide`                                     | 管理IDE集成                                                                                                                                                     |

| `/init`                                    | 初始化 `CLAUDE.md`。设置 `CLAUDE_CODE_NEW_INIT=1`以启用交互式流程                                                                                           |

| `/insights`                                | 生成会话分析报告                                                                                                                                                |

| `/install-github-app`                      | 设置GitHub Actions应用                                                                                                                                          |

| `/install-slack-app`                       | 安装Slack应用                                                                                                                                                   |

| `/keybindings`                             | 打开键绑定配置                                                                                                                                                  |

| `/less-permission-prompts`                 | 分析最近的Bash/MCP工具调用并将优先级允许列表添加到 `.claude/settings.json`以减少权限提示（v2.1.111新增）                                                      |

| `/login`                                   | 切换Anthropic账户                                                                                                                                               |

| `/logout`                                  | 退出Anthropic账户                                                                                                                                               |

| `/mcp`                                     | 管理MCP服务器和OAuth                                                                                                                                            |

| `/memory`                                  | 编辑 `CLAUDE.md`，切换自动内存                                                                                                                                |

| `/mobile`                                  | 移动应用的二维码（别名：`/ios`、`/android`）                                                                                                                |

| `/model [model]`                           | 使用左右箭头选择模型以调整努力                                                                                                                                  |

| `/passes`                                  | 分享Claude Code免费周                                                                                                                                           |

| `/permissions`                             | 查看/更新权限（别名：`/allowed-tools`）                                                                                                                       |

| `/plan [description]`                      | 进入规划模式                                                                                                                                                    |

| `/plugin`                                  | 管理插件                                                                                                                                                        |

| `/proactive`                               | `/loop`的别名（v2.1.105新增）                                                                                                                                 |

| `/powerup`                                 | 通过带动画演示的交互式课程发现功能                                                                                                                              |

| `/privacy-settings`                        | 隐私设置（仅Pro/Max）                                                                                                                                           |

| `/release-notes`                           | 查看更新日志                                                                                                                                                    |

| `/recap`                                   | 返回会话时显示会话回顾/摘要（v2.1.108新增）                                                                                                                     |

| `/reload-plugins`                          | 重新加载活动插件                                                                                                                                                |

| `/remote-control`                          | 从claude.ai远程控制（别名：`/rc`）                                                                                                                            |

| `/remote-env`                              | 配置默认远程环境                                                                                                                                                |

| `/rename [name]`                           | 重命名会话                                                                                                                                                      |

| `/resume [session]`                        | 恢复对话（别名：`/continue`）                                                                                                                                 |

| `/review`                                  | **已弃用** — 安装 `code-review`插件代替                                                                                                                |

| `/rewind`                                  | 回溯对话和/或代码（别名：`/checkpoint`）                                                                                                                      |

| `/sandbox`                                 | 切换沙箱模式                                                                                                                                                    |

| `/schedule [description]`                  | 创建/管理云端计划任务                                                                                                                                           |

| `/security-review`                         | 分析分支的安全漏洞                                                                                                                                              |

| `/skills`                                  | 列出可用技能                                                                                                                                                    |

| `/stats`                                   | 可视化每日使用情况、会话、连续天数                                                                                                                              |

| `/stickers`                                | 订购Claude Code贴纸                                                                                                                                             |

| `/status`                                  | 显示版本、模型、账户                                                                                                                                            |

| `/statusline`                              | 配置状态栏                                                                                                                                                      |

| `/tasks`                                   | 列出/管理后台任务                                                                                                                                               |

| `/team-onboarding`                         | 从项目的Claude Code设置生成队友入门指南（v2.1.101新增）                                                                                                         |

| `/terminal-setup`                          | 配置终端键绑定                                                                                                                                                  |

| `/theme`                                   | 更改颜色主题                                                                                                                                                    |

| `/tui`                                     | 切换全屏TUI（文本用户界面）模式，无闪烁渲染（v2.1.110新增）                                                                                                     |

| `/ultraplan <prompt>`                      | 在ultraplan会话中起草计划，在浏览器中审查                                                                                                                       |

| `/ultrareview`                             | 基于云的多代理分析全面代码审查（v2.1.111新增）                                                                                                                  |

| `/undo`                                    | `/rewind`的别名（v2.1.108新增）                                                                                                                               |

| `/upgrade`                                 | 打开升级页面以获得更高计划层级                                                                                                                                  |

| `/usage`                                   | 显示计划使用限制和速率限制状态                                                                                                                                  |

| `/voice`                                   | 切换按住说话语音听写                                                                                                                                            |

## 自定义命令

自定义斜杠命令已**合并到技能中**。两种方法都创建可用 `/command-name`调用的命令：

| 方法                   | 位置                               | 状态     |

| ---------------------- | ---------------------------------- | -------- |

| **技能（推荐）** | `.claude/skills/<name>/SKILL.md` | 当前标准 |

| **传统命令**     | `.claude/commands/<name>.md`     | 仍然工作 |

如果技能和命令共享相同名称，**技能优先**。例如，当同时存在 `.claude/commands/review.md`和 `.claude/skills/review/SKILL.md`时，使用技能版本。

### 示例1：代码优化

```yaml

---

description: Analyze code for performance issues and suggest optimizations

---


# Code Optimization


Review the provided code for the following issues in order of priority:


1. **Performance bottlenecks** - identify O(n²) operations, inefficient loops

2. **Memory leaks** - find unreleased resources, circular references

3. **Algorithm improvements** - suggest better algorithms or data structures

4. **Caching opportunities** - identify repeated computations

5. **Concurrency issues** - find race conditions or threading problems


Format your response with:

- Issue severity (Critical/High/Medium/Low)

- Location in code

- Explanation

- Recommended fix with code example


---

**LastUpdated**: April 9, 2026

```

### 示例2：PR准备

```yaml

---

description: Clean up code, stage changes, and prepare a pull request

allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(npm test:*), Bash(npm run lint:*)

---


# Pull Request Preparation Checklist


Before creating a PR, execute these steps:


1. Run linting: `prettier --write .`

2. Run tests: `npm test`

3. Review git diff: `git diff HEAD`

4. Stage changes: `git add .`

5. Create commit message following conventional commits:

   - `fix:` for bug fixes

   - `feat:` for new features

   - `docs:` for documentation

   - `refactor:` for code restructuring

   - `test:` for test additions

   - `chore:` for maintenance


6. Generate PR summary including:

   - What changed

   - Why it changed

   - Testing performed

   - Potential impacts


---

**LastUpdated**: April 9, 2026

```

### 示例3：API文档生成

```yaml

---

description: Create comprehensive API documentation from source code

---


# API Documentation Generator


Generate API documentation by:


1. Scanning all files in `/src/api/`

2. Extracting function signatures and JSDoc comments

3. Organizing by endpoint/module

4. Creating markdown with examples

5. Including request/response schemas

6. Adding error documentation


Output format:

- Markdown file in `/docs/api.md`

- Include curl examples for all endpoints

- Add TypeScript types


---

**LastUpdated**: April 9, 2026

```

### 示例4：代码提交

```yaml

---

description: Create git commit with dynamic context from repository

allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*)

---


# Git Commit with Context


Create a git commit with relevant repository context.


## Steps


1. Run in parallel to gather context:

   - `git status` - show working tree status

   - `git diff` - show both staged and unstaged changes

   - `git log -1 --oneline` - show recent commit message


2. Analyze all staged and newly added changes


3. Draft a concise commit message:

   - Summarize the nature of the changes (eg. new feature, enhancement to an existing feature, bug fix, refactoring, test, docs, etc.)

   - Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.)

   - Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files

   - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"

   - Ensure it accurately reflects the changes and their purpose


4. Run sequentially:

   - Add relevant untracked files

   - Create commit with message

   - Run git status after commit to verify success


---

**LastUpdated**: April 9, 2026

```

### 示例5：代码推送

```yaml

---

description: Stage all changes, create commit, and push to remote (use with caution)

allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(git diff:*), Bash(git log:*), Bash(git pull:*)

---


# Commit and Push Everything


⚠️ **CAUTION**: Stage ALL changes, commit, and push to remote. Use only when confident all changes belong together.


## Workflow


### 1. Analyze Changes

Run in parallel:

- `git status` - Show modified/added/deleted/untracked files

- `git diff --stat` - Show change statistics

- `git log -1 --oneline` - Show recent commit for message style


### 2. Safety Checks


**❌STOP and WARN if detected:**

- Secrets: `.env*`, `*.key`, `*.pem`, `credentials.json`, `secrets.yaml`, `id_rsa`, `*.p12`, `*.pfx`, `*.cer`

- API Keys: Any `*_API_KEY`, `*_SECRET`, `*_TOKEN` variables with real values (not placeholders like `your-api-key`, `xxx`, `placeholder`)

- Large files: `>10MB`withoutGitLFS

- Build artifacts: `node_modules/`, `dist/`, `build/`, `__pycache__/`, `*.pyc`, `.venv/`

- Temp files: `.DS_Store`, `thumbs.db`, `*.swp`, `*.tmp`


**✅Verify:**

- `.gitignore` properly configured

- No merge conflicts

- Correct branch (warn if main/master)

- API keys are placeholders only


### 3. Request Confirmation


Present summary and wait for explicit "yes" before proceeding.


### 4. Execute (After Confirmation)


Run sequentially:

```bash

git add .

git status  # Verify staging

```

### 示例6：文档重构

```

---

name: Documentation Refactor

description: Restructure project documentation for clarity and accessibility

tags: documentation, refactoring, organization

---

# Documentation Refactor


Refactor project documentation structure adapted to project type:


1. **Analyze project**: Identify type (library/API/web app/CLI/microservices), architecture, and user personas

2. **Centralize docs**: Move technical documentation to `docs/` with proper cross-references

3. **Root README.md**: Streamline as entry point with overview, quickstart, modules/components summary, license, contacts

4. **Component docs**: Add module/package/service-level README files with setup and testing instructions

5. **Organize `docs/`** by relevant categories:

   - Architecture, API Reference, Database, Design, Troubleshooting, Deployment, Contributing (adapt to project needs)

6. **Create guides** (select applicable):

   - User Guide: End-user documentation for applications

   - API Documentation: Endpoints, authentication, examples for APIs

   - Development Guide: Setup, testing, contribution workflow

   - Deployment Guide: Production deployment for services/apps

7. **Use Mermaid** for all diagrams (architecture, flows, schemas)


Keep docs concise, scannable, and contextual to project type.

```

### 示例7：CI/CD

```bash

---

name:SetupCI/CDPipeline

description:Implementpre-commithooksandGitHubActionsforqualityassurance

tags:ci-cd,devops,automation

---

# Setup CI/CD Pipeline


ImplementcomprehensiveDevOpsqualitygatesadaptedtoprojecttype:


1.**Analyzeproject**:Detectlanguage(s),framework,buildsystem,andexistingtooling

2.**Configurepre-commithooks**withlanguage-specifictools:

   -Formatting:Prettier/Black/gofmt/rustfmt/etc.

   -Linting:ESLint/Ruff/golangci-lint/Clippy/etc.

   -Security:Bandit/gosec/cargo-audit/npmaudit/etc.

   -Typechecking:TypeScript/mypy/flow (if applicable)

   -Tests:Runrelevanttestsuites

3.**CreateGitHubActionsworkflows** (.github/workflows/):

   -Mirrorpre-commitchecksonpush/PR

   -Multi-version/platformmatrix (if applicable)

   -Buildandtestverification

   -Deploymentsteps (if needed)

4.**Verifypipeline**:Testlocally,createtestPR,confirmallcheckspass


Usefree/open-sourcetools.Respectexistingconfigs.Keepexecutionfast.
```

## 最佳实践

### Do's ✅

- 使用清晰、动作导向的命令名称
- 在 `description`中包含触发条件关键词
- 为命令添加具体示例和使用说明
- 使用 `disable-model-invocation`防止意外执行副作用操作
- 组织相关文件到命令目录中
- 在生产环境前测试命令

### Don'ts ❌

- 为一次性任务创建命令
- 在命令中硬编码敏感信息
- 跳过 `description`字段
- 让命令过于复杂或涵盖多个不相关的功能
- 假设Claude知道当前项目状态
- 忘记添加工具权限配置（`allowed-tools`）

---

## 参考链接

- [claude-howto](https://github.com/luongnv89/claude-howto)
