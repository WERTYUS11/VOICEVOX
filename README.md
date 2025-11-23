# VOICEVOX

[![发布版本](https://img.shields.io/github/v/release/VOICEVOX/voicevox?label=Release)](https://github.com/WERTYUS11/Voicevox/releases)

（引擎是 [VOICEVOX ENGINE](https://github.com/VOICEVOX/voicevox_engine/)，
核心是 [VOICEVOX CORE](https://github.com/VOICEVOX/voicevox_core/)，
整体架构的详细信息请参阅[此处](./docs/全体構成.md)。）

## 致用户

此为开发用页面。有关使用方法，请参阅[VOICEVOX 官方网站](https://voicevox.hiroshiba.jp/)。

## 致有意贡献项目者

VOICEVOX 项目欢迎有兴趣的人士参与。
我们准备了[说明贡献流程的指南](./CONTRIBUTING.md)。

提及贡献，人们常以为是编写代码，但也有撰写文档、生成测试、参与改进提案讨论等多种参与方式。
我们也有欢迎新手的任务，期待大家的参与。

VOICEVOX 编辑器采用了 Electron、TypeScript、Vue、Vuex 等技术，整体架构可能不易理解。
[代码导览](./docs/コードの歩き方.md)中介绍了其结构，希望能对开发有所帮助。

在创建解决 Issue 的 PR 时，为了避免与他人同时处理同一个 Issue，
请在 Issue 中告知您已开始处理，或者首先创建一个 Draft Pull Request。

在[VOICEVOX 非官方 Discord 服务器](https://discord.gg/WMwWetrzuh)中，我们进行开发讨论和闲聊。欢迎随时加入。

### 设计指南

请参阅[UX/UI 设计方针](./docs/UX・UIデザインの方針.md)。

## 环境搭建

请安装[.node-version](.node-version)中指定的 Node.js 版本。
使用 Node.js 管理工具（如[nvs](https://github.com/jasongin/nvs)或[Volta](https://volta.sh)等）可以轻松安装，并能自动切换 Node.js 版本。

安装 Node.js 后，请 Fork [此仓库](https://github.com/WERTYUS11/voicevox.git) 并 `git clone`。

### 安装依赖库

运行以下命令将安装或更新依赖库。

```bash
npm i -g pnpm # 仅首次运行
pnpm i
```

## 运行

### 引擎准备

复制`.env.production`并创建`.env`文件，然后将`VITE_DEFAULT_ENGINE_INFOS`中的`executionFilePath`设置为[正式版 VOICEVOX](https://voicevox.hiroshiba.jp/)中的`vv-engine/run.exe`即可运行。

如果在 Windows 上未更改安装路径，请指定为`C:/Users/(用户)/AppData/Local/Programs/VOICEVOX/vv-engine/run.exe`。
请注意，路径分隔符是`/`而不是`\`。

如果使用 macOS 版本的`VOICEVOX.app`，请指定为`/path/to/VOICEVOX.app/Resources/MacOS/vv-engine/run`。
如果是 AppImage 版本，可以通过`$ /path/to/VOICEVOX.AppImage --appimage-mount`挂载文件系统。

对于 Linux，请指定从[Releases](https://github.com/VOICEVOX/voicevox/releases/)获取的 tar.gz 版本中包含的`vv-engine/run`命令。

如果除了运行 VOICEVOX 编辑器之外，您还单独启动了引擎 API 服务器，则无需指定`executionFilePath`，
但请将`executionEnabled`设置为`false`。
这同样适用于您正在运行正式版 VOICEVOX 的情况。

如果需要更改引擎 API 的目标端点，请修改`VITE_DEFAULT_ENGINE_INFOS`中的`host`。

### 运行 Electron

```bash
# 在便于开发的环境中运行
pnpm run electron:serve

# 在接近构建时的环境中运行
pnpm run electron:serve --mode production

# 带参数运行
pnpm run electron:serve -- ...
```

语音合成引擎的仓库在这里：<https://github.com/VOICEVOX/voicevox_engine>

### 运行 Storybook

您可以使用 Storybook 开发组件。

```bash
pnpm run storybook
```

main 分支的 Storybook 可在[VOICEVOX/preview-pages](https://github.com/VOICEVOX/preview-pages)查看。
<https://voicevox.github.io/preview-pages/preview/editor/branch-main/storybook/index.html>

### 中文翻译

使用js文件来进行文件的全局翻译

```bash
node zh-cn.js
```
### 在处理任何关于此文件的issue时一定要注意，若翻译的句子中包含了翻译的词语，比如"infoはアイコンなし"和"info",那么info的翻译一定要在"infoはアイコンなし"之下
```
...
"infoはアイコンなし"
"info"
...
```

### 运行浏览器版（开发中）

请单独启动语音合成引擎，然后运行以下命令并访问显示的 localhost 地址。

```bash
pnpm run browser:serve
```

此外，main 分支的构建结果已部署到[VOICEVOX/preview-pages](https://github.com/VOICEVOX/preview-pages)。
<https://voicevox.github.io/preview-pages/preview/editor/branch-main/editor/index.html>
目前需要在本地 PC 上启动语音合成引擎。

## 构建

```bash
pnpm run electron:build
```

### 通过 Github Actions 构建

在 Fork 的仓库中启用 Actions，并通过 workflow_dispatch 触发`build.yml`即可进行构建。
构建产物将上传到 Release。

## 测试

### 单元测试

运行`./tests/unit/`下的测试和 Storybook 的测试。

```bash
pnpm run test:unit
pnpm run test-watch:unit # 监控模式
pnpm run test-ui:unit # 显示 Vitest UI
pnpm run test:unit --update # 更新快照
```

> [!注意]
> `./tests/unit`下的测试，其运行环境会根据文件名而变化。
>
> - `.node.spec.ts`：Node.js 环境
> - `.browser.spec.ts`：浏览器环境（Chromium）
> - `.spec.ts`：浏览器环境（通过 happy-dom 模拟）

### 浏览器端到端测试

运行不需要 Electron 功能的 UI 和语音合成等端到端测试。

> [!注意]
> 部分修改引擎配置的测试仅在 CI (Github Actions) 上运行。

```bash
pnpm run test:browser-e2e
pnpm run test-watch:browser-e2e # 监控模式
pnpm run test-watch:browser-e2e --headed # 显示测试中的 UI
pnpm run test-ui:browser-e2e # 显示 Playwright UI
```

由于使用了 Playwright，您也可以生成测试模式。
**在浏览器版启动状态下**，执行以下命令。

```bash
pnpm exec playwright codegen http://localhost:5173/ --viewport-size=1024,630
```

详情请参阅 [Playwright 文档的 Test generator](https://playwright.dev/docs/codegen-intro)。

### Storybook 的视觉回归测试

比较 Storybook 组件的屏幕截图，如果存在变更则显示差异。

> [!注意]
> 此测试仅能在 Windows 上运行。

```bash
pnpm run test:storybook-vrt
pnpm run test-watch:storybook-vrt # 监控模式
pnpm run test-ui:storybook-vrt # 显示 Playwright UI
```

#### 更新屏幕截图

浏览器端到端测试和 Storybook 均进行视觉回归测试。
目前 VRT 测试仅在 Windows 上进行。
可以按照以下步骤更新屏幕截图：

##### 通过 Github Actions 更新

1.  在 Fork 的仓库设置中启用 GitHub Actions。
2.  在仓库设置的 Actions > General > Workflow permissions 中选择 Read and write permissions。
3.  在提交信息中包含字符串`[update snapshots]`进行提交。

    ```bash
    git commit -m "UIを変更 [update snapshots]"
    ```

4.  Github Workflow 完成后，更新的屏幕截图将被提交。
5.  拉取（pull）后，推送一个空提交以重新运行测试。

    ```bash
    git commit --allow-empty -m "（重新运行测试）"
    git push
    ```

> [!注意]
> 通过创建令牌并添加到 Secrets 中，可以自动重新运行测试。
>
> 1.  访问 [Fine-granted Tokens](https://github.com/settings/personal-access-tokens/new)。
> 2.  输入一个合适的名称，授予对 `用户名/voicevox` 的访问权限，并在 Repository permissions 的 Contents 中选择 Read and write。
>     <details>
>     <summary>设置示例</summary>
>     <img src="./docs/res/Fine-granted_Tokensの作成.png" width="320" alt="">
>     </details>
> 3.  创建令牌并复制字符串。
> 4.  打开 `用户名/voicevox` 仓库的 Settings > Secrets and variables > Actions > New repository secret。
> 5.  在名称中输入 `PUSH_TOKEN`，然后粘贴刚才的字符串并添加 Secret。

##### 在本地更新

仅更新与本地 PC 操作系统相对应的部分。

```bash
pnpm run test:browser-e2e --update-snapshots
```

### Electron 端到端测试

运行需要 Electron 功能的端到端测试，包括引擎启动和关闭等。

```bash
pnpm run test:electron-e2e
pnpm run test-watch:electron-e2e # 监控模式
```

## 生成依赖库的许可信息

依赖库的许可信息将在 Github Workflow 构建时自动生成。您可以通过以下命令生成：

```bash
# 从 voicevox_engine 获取 licenses.json 并命名为 engine_licenses.json

pnpm run license:generate -o voicevox_licenses.json
pnpm run license:merge -o public/licenses.json -i engine_licenses.json -i voicevox_licenses.json
```

## 代码格式化

整理代码格式。请在发送 Pull Request 之前运行。

```bash
pnpm run fmt
```

## Lint（静态分析）

执行代码静态分析，以预防潜在的 bug。请在发送 Pull Request 之前运行。

```bash
pnpm run lint
```

执行 Lint 后，会在仓库根目录生成缓存文件`.eslintcache`。
如果 ESLint 版本升级、配置更改或缓存损坏，请删除此文件。

## 拼写检查

我们使用[typos](https://github.com/crate-ci/typos)进行拼写检查。

```bash
pnpm run typos
```

即可进行拼写检查。
如果存在误判或需要从检查中排除的文件，
请按照[配置文件说明](https://github.com/crate-ci/typos#false-positives)编辑`_typos.toml`。

## 类型检查

执行 TypeScript 的类型检查。

```bash
pnpm run typecheck
```

## Markdownlint

执行 Markdown 语法检查。

```bash
pnpm run markdownlint
```

## Shellcheck

执行 ShellScript 语法检查。
安装方法请参阅[此处](https://github.com/koalaman/shellcheck#installing)。

```bash
shellcheck ./build/*.sh
shellcheck ./tools/*.bash
```

## OpenAPI generator

请在[开发版 VOICEVOX ENGINE](https://github.com/voicevox/voicevox_engine)启动的状态下执行以下命令。

```bash
pnpm run generate-openapi
```

### OpenAPI generator 版本升级

可以通过以下命令检查和安装新版本。

```bash
pnpm exec openapi-generator-cli version-manager list
```

## 在 VS Code 中调试运行

在 npm 脚本的 `serve` 或 `electron:serve` 等开发构建模式下，由于用于构建的 vite 会输出 sourcemap，因此会进行源代码与生成代码的映射。

复制`.vscode/launch.template.json`为`.vscode/launch.json`，
并复制`.vscode/tasks.template.json`为`.vscode/tasks.json`，
即可启用从 VS Code 运行开发构建并进行调试的任务。

## 许可证

采用 LGPL v3 和无需公开源代码的另一许可的双重许可。
如果希望获得其他许可，请联系 Hiho。
X 账号: [@hiho_karuta](https://x.com/hiho_karuta)
```

