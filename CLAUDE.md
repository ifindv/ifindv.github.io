# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site generator blog using the Blowfish theme, deployed to GitHub Pages. The site is configured for Chinese content (`zh-cn`) with dark mode enabled by default.

## Development Commands

```bash
# Build the site
hugo

# Build with minification (production)
hugo --minify

# Run local development server
hugo server

# Build and watch for changes
hugo server -D
```

## Architecture

### Theme
- Uses **Blowfish** theme as a git submodule at `themes/blowfish/`
- Theme overrides and customizations are in `layouts/partials/`

### Content Structure
- **Blog posts**: `content/posts/*.md` - markdown files with date-prefix naming convention
- **Static files**: `static/` - copied directly to output
- **Assets**: `assets/` - processed by Hugo pipelines
  - `assets/media/blog-bg.jpg` - default background image
  - `assets/css/custom.css` - custom styles
  - `assets/img/` - images

### Custom Layouts
- `layouts/partials/extend-head.html` - adds custom CSS and search bundle scripts
- `layouts/partials/author.html` - custom author profile component
- `layouts/partials/home/` - homepage customizations
- `layouts/partials/header/` - header customizations

### Deployment
- GitHub Actions workflow in `.github/workflows/deploy.yml`
- Automatically deploys to GitHub Pages on `main` branch push
- Uses `hugo --minify` for production builds

### Configuration
- Main config in `hugo.yaml`
- Key settings: dark mode default, search enabled, Chinese language support, CJK character handling

## Custom Slash Commands

The project includes custom slash commands (implemented as skills) for common development tasks:

| Command | Function | Usage |
|---------|----------|-------|
| `/blog-draft` | Draft blog posts with research, outlining, and iterative drafting | `/blog-draft [topic]` |
| `/optimize` | Analyze code for performance issues and suggest optimizations | `/optimize [code]` |
| `/pr` | Pull request preparation checklist (linting, testing, commit) | `/pr` |
| `/generate-api-docs` | Generate API documentation from source code | `/generate-api-docs` |
| `/commit` | Create git commit with dynamic context from repository | `/commit [message]` |
| `/push-all` | Stage all changes, commit, and push with safety checks | `/push-all` |
| `/doc-refactor` | Restructure project documentation for clarity | `/doc-refactor` |
| `/setup-ci-cd` | Set up CI/CD pipeline with pre-commit hooks | `/setup-ci-cd` |
| `/unit-test-expand` | Expand unit test coverage for untested branches | `/unit-test-expand` |

**Note**: These commands are located in `.claude/skills/` and follow the Skills format (SKILL.md files).

## Git Submodule

The Blowfish theme is a git submodule. When cloning this repo, use:
```bash
git clone --recursive https://github.com/ifindv/ifindv.github.io.git
```

Or if already cloned:
```bash
git submodule update --init --recursive
```