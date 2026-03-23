# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is ifindv's blog - a personal website built with Hugo and the Hugoplate theme. The site uses Tailwind CSS v4.0 for styling and is configured for deployment on GitHub Pages.

## Commands

### Development

- `npm run dev` - Start Hugo development server (default: localhost:1313)
- `npm run build` - Build for production with minification and optimization
- `npm run preview` - Preview build with production settings and live reload
- `npm run format` - Format code with Prettier

### Hugo Modules

- `npm run update-modules` - Update all Hugo modules to latest versions

### Theme Management

These commands work when this project is in theme mode (not applicable as currently used):

- `npm run project-setup` - Initial project setup script
- `npm run theme-setup` - Set up theme structure
- `npm run update-theme` - Update Hugoplate theme

## Architecture

### Directory Structure

- `exampleSite/` - Main site directory containing content and configuration
  - `config/` - Site configuration files
    - `_default/` - Default configs (menus, module, params)
  - `content/` - Content files (blog posts, pages)
  - `data/` - Data files (theme.json, social.json)
  - `static/` - Static assets
  - `i18n/` - Internationalization files
- `layouts/` - Theme templates
  - `_default/` - Default Hugo layouts
  - `partials/` - Reusable components
    - `essentials/` - Core layout elements (head, header, footer)
    - `components/` - UI components (cards, pagination, theme-switcher)
    - `widgets/` - Sidebar widgets
  - `favorites/` - Custom favorites page layout
- `assets/` - Source assets
  - `css/` - Tailwind CSS
  - `js/` - JavaScript files
  - `plugins/` - Third-party plugins (FontAwesome, Swiper, GLightbox)
- `resources/` - Processed resources cache

### Configuration Files

- `exampleSite/hugo.toml` - Main Hugo configuration
- `exampleSite/config/_default/params.toml` - Site parameters (logo, search, widgets)
- `exampleSite/config/_default/menus.en.toml` - Navigation menu structure
- `exampleSite/data/theme.json` - Custom colors and fonts (light/dark mode)

### Custom Taxonomies

The site includes a custom `favorite_category` taxonomy in addition to standard `categories` and `tags`. This powers the favorites page accessible at `/favorites/`.

### Key Features

- Search functionality enabled and configured for blog section
- Dark mode capability (currently disabled via `theme_switcher = false`)
- Custom `favorite_category` taxonomy for curated content
- Timezone set to `Asia/Shanghai`
- CJK language support disabled (`hasCJKLanguage = false`)

### Hugo Modules

The project uses Go modules via `exampleSite/go.mod` for managing Hugo module dependencies.

### Static Assets Location

Images, favicon, and logo files should be in `exampleSite/static/images/`.
