# ifindv's Blog

Hugo 驱动的个人技术博客,使用 [Blowfish](https://github.com/nunocoracao/blowfish) 主题,部署到 GitHub Pages。默认中文(`zh-cn`)+ 暗色模式。

## 技术栈

- 静态站点:[Hugo](https://gohugo.io/) (extended,SCSS 需要)
- 主题:Blowfish(以 git submodule 引入)
- 部署:GitHub Actions → GitHub Pages

## 本地开发

### 前置条件

1. 安装 Hugo extended(macOS):

   ```bash
   brew install hugo
   ```

2. 克隆仓库并拉取主题子模块:

   ```bash
   git clone --recursive https://github.com/ifindv/ifindv.github.io.git
   cd ifindv.github.io
   # 若已 clone 但没拉子模块:
   git submodule update --init --recursive
   ```

### 常用命令

| 命令 | 说明 |
|---|---|
| `hugo server -D` | 本地调试服务器,http://localhost:1313 ,支持热重载,`-D` 含草稿 |
| `hugo --minify` | 生产构建,与 GitHub Actions 行为一致,产物在 `public/` |
| `hugo server --disableFastRender` | 关闭 Fast Render,改动时做全量重建 |

## 网络提示

主题仓库位于 GitHub,某些网络环境下直接 `git submodule update` 可能在收尾阶段因 HTTP/2 长连接被代理截断而失败。若遇到 `RPC failed / early EOF`,改用部分克隆:

```bash
git config --global http.https://github.com.version HTTP/1.1
git config --global http.postBuffer 524288000
git submodule update --init --filter=blob:none themes/blowfish
```

## 部署

推送到 `main` 分支即触发 `.github/workflows/deploy.yml`,Hugo 构建后将 `public/` 发布到 GitHub Pages,无需手动操作。