 # 贡献者指南

## 开始前

首先，非常感谢您对 VOICEVOX 项目的关注。  
我们欢迎您的积极参与。

实际上，加入任何社区时都会有一些规则，如果不了解这些规则，可能会感到参与门槛较高。

本指南的目的是尽量以易懂的文字记录这些规则，为您提供一个更容易参与社区的环境。此外，为了让新贡献者更容易上手，本指南包含了详细说明，熟悉项目的人可能会觉得其中有些内容是多余的。项目欢迎有意愿的贡献者，请阅读文档并尝试参与。

## 负责人

| 角色               | 负责人                        |
| ------------------ | ---------------------------- |
| 产品负责人         | @Hiroshiba                   |
| 维护者             | @Hiroshiba、@y-chan、@qryxip |

## 参与心态

VOICEVOX 项目属于典型的集体开发型开源软件。希望参与的人员需注意以下事项：

- 根据 [VOICEVOX 的目标](docs/ミッション・バリュー・ビジョン.md) 提出建议会使沟通更顺畅。  
- 对于实施内容，需要在社区中讨论并达成共识。项目方针可能导致部分提案被拒绝。  
- 集体开发的魅力之一是边讨论边开发。相比个人开发，更需要细致的沟通。请始终尊重对话对象。  
- 参与项目时，年龄、国籍、境遇、性别等因素不影响参与。项目不容忍任何形式的歧视。  
- 项目尊重作者及其作品，始终遵守他人权利和许可。请勿提交抄袭的程序。  
- 作为贡献者提供的程序，将按照项目定义的许可协议处理。  
- 涉及隐私或可能损害计算机的实现，需要谨慎讨论。切勿先行实现，必须先达成共识。  

## 贡献方式

本指南主要面向希望协助程序改进的贡献者，介绍参与方式。

VOICEVOX 的贡献方式包括：

- 作为用户使用  
- 发布文章或视频进行宣传  
- 协助程序改进  
- 编写文档等  

程序分为三个部分，请参与对应项目：

| 类型            | 页面                                                       | 角色                                    |
| --------------- | ------------------------------------------------------------ | ---------------------------------------- |
| VOICEVOX        | [项目](https://github.com/VOICEVOX/voicevox/)               | 主要为用户界面（编辑器）部分           |
| VOICEVOX_ENGINE | [项目](https://github.com/VOICEVOX/voicevox_engine/)        | 主要为 Web API 实现部分                  |
| VOICEVOX_CORE   | [项目](https://github.com/VOICEVOX/voicevox_core/)          | 主要为语音合成与库实现部分              |

若想了解整体结构，可参考 [整体结构](docs/全体構成.md)。

## 初学者欢迎任务

如果您想学习程序开发或在开源社区实践，可以参与社区 Issues 中已有的“初学者欢迎任务”。

“初学者欢迎任务”是 VOICEVOX 项目定义的“难度较低但必要的任务”，可在学习整个流程的同时进行贡献。

| 类型            | 页面                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VOICEVOX        | [初学者欢迎任务](https://github.com/VOICEVOX/voicevox/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)        |
| VOICEVOX_ENGINE | [初学者欢迎任务](https://github.com/VOICEVOX/voicevox_engine/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |
| VOICEVOX_CORE   | [初学者欢迎任务](https://github.com/VOICEVOX/voicevox_core/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)   |

## 事前准备

以下以 Windows 用户搭建 VOICEVOX（编辑器）环境为例。首先搭建测试版 VOICEVOX 环境。

### 1. 安装正式版 VOICEVOX

- 先安装 [VOICEVOX 正式版](https://voicevox.hiroshiba.jp/)，即可获得可立即使用的 VOICEVOX 引擎。

### 2. 搭建开发环境

- 必要工具：
  - [Node.js](https://nodejs.org/en/download/releases/)  
    下载并安装 [指定版本](https://github.com/VOICEVOX/voicevox/blob/main/.node-version)。
- 可选工具：
  - [Git](https://git-scm.com/downloads)
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [GitHub CLI](https://github.com/cli/cli#installation)
  - [typos](https://github.com/crate-ci/typos#install) （拼写检查）
  - [Tortoise Git](https://tortoisegit.org/download/)（在资源管理器操作时）

### 3. Fork 仓库

- 将项目复制到个人 GitHub 仓库，称为 Fork。点击 [这里](https://github.com/VOICEVOX/voicevox/fork) 进行 Fork。

### 4. 获取源码（Clone）

- 将自己 GitHub 仓库的源码下载到本地计算机。

#### 4.1 使用命令行

- 使用 GitHub CLI：

```bash
gh repo clone https://github.com/(个人GitHub账号)/voicevox.git
```

- 使用 Git CLI：

```bash
git clone git@github.com:(个人GitHub账号)/voicevox.git
```

#### 4.2 使用 GUI

- 可使用 Visual Studio Code 或 Tortoise Git 下载。  
- URL 可为 `git@github.com:(个人GitHub账号)/voicevox.git` 或 `https://github.com/(个人GitHub账号)/voicevox.git`。

### 5. 下载必要程序

- 打开第四步下载的文件夹，打开命令提示符。  
- 执行以下命令准备环境，程序会自动下载：

```bash
npm install -g pnpm
pnpm i
```

- 出现的工具组合或实现警告可忽略。

### 6. 指定引擎

- 复制 `.env.production` 文件并命名为 `.env`。  
- 打开文件，将 `VITE_DEFAULT_ENGINE_INFOS` 中的 `executionFilePath` 设置为第一步安装的路径，例如默认安装：

```ini
VITE_APP_NAME=voicevox
VITE_DEFAULT_ENGINE_INFOS=`[
    {
        "uuid": "074fc39e-678b-4c13-8916-ffca8d505d1d",
        "name": "VOICEVOX Engine",
        "executionEnabled": true,
        "executionFilePath": "C:/Users/(用户名)/AppData/Local/Programs/VOICEVOX/vv-engine/run.exe",
        "executionArgs": [],
        "host": "http://127.0.0.1:50021"
    }
]`
```

- 若安装路径自定义，例如 `D:\VOICEVOX0.14.1`，需修改为：

```text
"executionFilePath": "D:/VOICEVOX0.14.1/vv-engine/run.exe",
```

### 7. 启动

- 执行 `pnpm run electron:serve`，若设置正确，开发环境将启动。

## 项目贡献流程

### 1. 提案与协调

- 若想修改程序、增加新功能或发现 Bug，请先注册 Issue。

#### 1.1 提案

- 指明想修改 VOICEVOX 哪个部分，并描述“改进点”和“可能的影响点”。

#### 1.2 咨询

- 与相关人员讨论实现约束、影响范围、优先级及是否可执行。  
- 社区成员技术背景各异，遇到不懂的问题应及时提问。

#### 1.3 宣告开始

- 若要开始已有 Issue 的任务，请在 Issue 页面声明“我开始处理”，避免重复工作。

### 2. 创建分支

- 在本地创建工作分支，每个任务可创建独立分支。  
- 分支名称可自行命名，方便理解即可。

### 3. 修改程序

- 按约定编写程序，命名尽量使用驼峰法（CamelCase）。无法使用时可添加注释：

```ts
// FIXME: 因●●原因，无法使用驼峰命名
```

- 若结构约束导致实现与理想结构不同，也可加注释：

```ts
// TODO: 希望不使用●●实现为●●
```

- 命名遵循常用规则，函数名为“动词+功能”：

| 示例          | 功能              |
| ------------- | ---------------- |
| setVolume()   | 设置音量          |
| getVolume()   | 获取音量          |
| isMuted       | 获取静音状态(boolean) |

- 尽量不缩写变量和函数名，保持代码简洁易懂。  
- 不必要的定义或测试代码在提交前删除。

### 4. 事前测试

- 提交前测试代码，确保符合编码规范：

```bash
pnpm run lint
pnpm run fmt
```

- 删除损坏的 `.eslintcache` 文件后可重新运行。  
- 检查 TypeScript 类型：

```bash
pnpm run typecheck
```

- 检查 Markdown 语法：

```bash
pnpm run markdownlint ./*/*.md
```

- 检查命名英文拼写：

```bash
pnpm run typos
```

- 本地运行 VOICEVOX 确认功能正常：

```bash
pnpm run electron:serve
```

- 检查所用库许可：

```bash
pnpm run license:generate -o voicevox_licenses.json
```

- 执行 e2e 测试：

```bash
pnpm run test:unit
pnpm run test:browser-e2e
pnpm run test:electron-e2e
```

- 确认 e2e 测试未引入新的问题，必要时修正。

### 5. 提交代码

- 先提交到个人仓库，写明具体修改内容，标题简洁明了。  
- 提交后通过 Pull Request 提交至社区，有两种类型：

  - Draft Pull Request（草稿，用于共享进度）  
  - Pull Request（正式提交）  

- Draft Pull Request 标题可加 `WIP:` 前缀。  
- 正式提交时关联 Issue 编号，例如：

```text
标题：减少启动等待时间
内容：通过初始化并行处理缩短等待时间
相关 Issue：ref #0000
```

- 若 Pull Request 合并时自动关闭 Issue，可写：

```text
close #0000
```

### 6. 代码评审

- 社区成员进行代码审查，发现问题会提出修改建议。  
- 可接受建议直接修改，也可讨论寻找最佳方案。  
- Pull Request 已提交后，本地 Push 的修改会自动跟踪。  
- 当前 VOICEVOX 合并规则要求至少一人审查。

### 7. 解决冲突

- 审查完成后准备合并。  
- 若与他人修改冲突，Pull Request 页面会提示“发生冲突”，解决步骤：

1. 拉取 VOICEVOX 官方仓库最新代码到本地。  
2. 对比差异，修改冲突部分。  
3. 再次执行事前测试。  
4. 确认无误后提交。  
5. Pull Request 页面自动检测，确认冲突提示消失。

- 完成以上步骤后，贡献者工作结束。  
- 合并负责人确认后执行合并。  
- 合并完成后可删除个人分支。

### 其他事项

- VOICEVOX 成员会支持和咨询贡献者。  
- 遇到问题或不懂的地方，请向成员咨询。  
- [Discord 社区](https://discord.gg/gJamMrqFHg) 可用于讨论和整理想法。  
- 若因个人原因无法继续或遇到技术困难，可声明放弃，必要时先咨询。

## 参考信息

- 实现设计请参考 [UX/UI 设计方针](docs/UX・UIデザインの方針.md)。  
- 详细设计请参考 [细节设计方针](docs/細かい設計方針.md)。  
- VOICEVOX 使用多种技术实现，理解技术有助于阅读，可参考 [代码浏览方法](docs/コードの歩き方.md)。  
- 颜色相关可参考 [颜色实现](docs/色について.md)。  
- VOICEVOX 使用的字体及生成方法可参考 [字体相关](docs/フォントについて.md)。