# VOICEVOX

[![releases](https://img.shields.io/github/v/release/VOICEVOX/voicevox?label=Release)](https://github.com/VOICEVOX/voicevox/releases)  
[![build](https://github.com/VOICEVOX/voicevox/actions/workflows/build.yml/badge.svg)](https://github.com/VOICEVOX/voicevox/actions/workflows/build.yml)  
[![test](https://github.com/VOICEVOX/voicevox/actions/workflows/test.yml/badge.svg)](https://github.com/VOICEVOX/voicevox/actions/workflows/test.yml)  
[![Discord](https://img.shields.io/discord/879570910208733277?color=5865f2&label=&logo=discord&logoColor=ffffff)](https://discord.gg/WMwWetrzuh)

这里是 **[VOICEVOX](https://voicevox.hiroshiba.jp/) 的编辑器仓库**。

（语音引擎是 [VOICEVOX ENGINE](https://github.com/VOICEVOX/voicevox_engine/)，  
核心库是 [VOICEVOX CORE](https://github.com/VOICEVOX/voicevox_core/)，  
整体架构请参考 [こちら](./docs/全体構成.md)。）

---

## 面向普通用户

本仓库是**开发用仓库**。  
使用方法请查看 **[VOICEVOX 公式サイト](https://voicevox.hiroshiba.jp/)**。

---

## 面向想参与贡献的人

VOICEVOX 项目欢迎任何感兴趣的人参与。  
我们准备了 **[貢献手順について説明したガイド](./CONTRIBUTING.md)** 作为贡献指南。

贡献不仅限于写代码，还包括：

- 编写文档  
- 制作测试  
- 参与功能讨论  
- 提出改进建议  

同时也有**初心者歓迎タスク**，非常适合新手入门。

VOICEVOX 编辑器使用了 **Electron、TypeScript、Vue、Vuex** 等技术，整体结构比较复杂。  
可以参考 **[コードの歩き方](./docs/コードの歩き方.md)** 来理解项目结构。

如果你打算为某个 Issue 提交 PR，请**先在 Issue 中声明你已开始处理**，或者先提交 Draft PR，以避免重复工作。

开发讨论与交流主要在 **[VOICEVOX 非公式 Discord サーバー](https://discord.gg/WMwWetrzuh)**，欢迎加入。

### デザインガイドライン

请参考 **[UX・UI デザインの方針](./docs/UX・UIデザインの方針.md)**。

---

## 环境构筑

请安装与 **[.node-version](.node-version)** 一致的 Node.js 版本。  
推荐使用 nvs 或 Volta 进行版本管理。

安装 Node.js 后，Fork 本仓库并执行 `git clone`：

https://github.com/VOICEVOX/voicevox.git

### 安装依赖

```bash
npm i -g pnpm   # 仅首次
pnpm i
```

---

## 运行

### 准备引擎

复制 `.env.production` 为 `.env`，并在 `VITE_DEFAULT_ENGINE_INFOS` 中设置：

- Windows（默认路径）  
  ```
  C:/Users/(用户名)/AppData/Local/Programs/VOICEVOX/vv-engine/run.exe
  ```
  ⚠️ **路径分隔符请使用 `/`，不要用 `\`**

- macOS  
  ```
  /path/to/VOICEVOX.app/Resources/MacOS/vv-engine/run
  ```

- Linux  
  使用 Releases 中的 tar.gz 版里的 `vv-engine/run`。

如果你已经**单独启动了引擎 API 服务器**，请将：

```json
"executionEnabled": false
```

并修改 `host` 指向你的 API 地址。

---

### 运行 Electron

```bash
pnpm run electron:serve
pnpm run electron:serve --mode production
pnpm run electron:serve -- ...
```

音声合成エンジンのリポジトリはこちらです  
<https://github.com/VOICEVOX/voicevox_engine>

---

### 运行 Storybook

```bash
pnpm run storybook
```

main 分支的预览：  
https://voicevox.github.io/preview-pages/preview/editor/branch-main/storybook/index.html

---

### 运行浏览器版（开发中）

先启动引擎，然后执行：

```bash
pnpm run browser:serve
```

线上预览：  
https://voicevox.github.io/preview-pages/preview/editor/branch-main/editor/index.html

（目前仍需要本地运行引擎）

---

## 构建

```bash
pnpm run electron:build
```

### 使用 GitHub Actions 构建

在 fork 仓库中开启 Actions，手动运行 `build.yml` 即可，产物会上传到 Release。

---

## 测试

### 单元测试

```bash
pnpm run test:unit
pnpm run test-watch:unit
pnpm run test-ui:unit
pnpm run test:unit --update
```

> 文件后缀规则：
> - `.node.spec.ts` → Node 环境  
> - `.browser.spec.ts` → Chromium  
> - `.spec.ts` → happy-dom

---

### 浏览器 E2E

```bash
pnpm run test:browser-e2e
pnpm run test-watch:browser-e2e
pnpm run test-watch:browser-e2e --headed
pnpm run test-ui:browser-e2e
```

生成测试用例（需先启动浏览器版）：

```bash
pnpm exec playwright codegen http://localhost:5173/ --viewport-size=1024,630
```

---

### Storybook VRT（视觉回归测试）

> 仅支持 Windows

```bash
pnpm run test:storybook-vrt
pnpm run test-watch:storybook-vrt
pnpm run test-ui:storybook-vrt
```

#### 在 GitHub Actions 更新截图

（步骤保持原文逻辑，此处略）

---

### Electron E2E

```bash
pnpm run test:electron-e2e
pnpm run test-watch:electron-e2e
```

---

## 生成依赖许可证

```bash
pnpm run license:generate -o voicevox_licenses.json
pnpm run license:merge -o public/licenses.json -i engine_licenses.json -i voicevox_licenses.json
```

---

## 代码格式化

```bash
pnpm run fmt
```

## Lint

```bash
pnpm run lint
```

> 会生成 `.eslintcache`，必要时可删除重跑。

---

## 拼写检查

```bash
pnpm run typos
```

---

## TypeScript 类型检查

```bash
pnpm run typecheck
```

---

## Markdown 检查

```bash
pnpm run markdownlint
```

---

## Shellcheck

```bash
shellcheck ./build/*.sh
shellcheck ./tools/*.bash
```

---

## OpenAPI generator

（需先启动开发版 ENGINE）

```bash
pnpm run generate-openapi
```

查看版本：

```bash
pnpm exec openapi-generator-cli version-manager list
```

---

## VS Code 调试

复制以下文件：

- `.vscode/launch.template.json` → `.vscode/launch.json`
- `.vscode/tasks.template.json` → `.vscode/tasks.json`

即可在 VS Code 中调试 `electron:serve`。

---

## 许可证

**LGPL v3 + 商用可选许可（双许可）**  
如需商业许可，请联系：  
X：[@hiho_karuta](https://x.com/hiho_karuta)