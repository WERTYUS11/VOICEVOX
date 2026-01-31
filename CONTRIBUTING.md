# 贡献者指南

## 开始之前

首先，感谢您对 VOICEVOX 项目的关注。
我们非常欢迎您积极参与其中。

在实际参与时，任何社区都会有一定的规则，如果不了解这些规则，可能会让人感觉门槛很高。

本指南正是为了尽可能清晰地说明这些内容而编写，目的是为您提供一个更容易参与社区的环境。由于为了方便新贡献者加入而进行了较为详细的说明，因此其中也包含了一些对熟悉者来说可能多余的内容。项目欢迎有意愿的贡献者，请阅读本文档并尝试参与进来。

## 担当

| 角色               | 担当                         |
| ------------------ | ---------------------------- |
| 产品负责人         | @Hiroshiba                   |
| 维护者             | @Hiroshiba、@y-chan、@qryxip |

## 参与须知

VOICEVOX 项目属于典型的集体开发型开源软件。希望参与的人员需要注意以下事项：

- 结合 [VOICEVOXの目標](docs/ミッション・バリュー・ビジョン.md) 进行提案，可以让沟通更加顺畅。

- 关于实施内容，需要在社区内进行讨论并达成共识。同时，根据项目方针，某些提案可能会被拒绝。

- 集体开发的一大魅力在于通过交流共同完成成果，因此相比个人创作，需要更加细致、尊重他人的沟通方式。

- 参与项目不受年龄、国籍、背景、性别等影响，项目不允许任何形式的歧视行为。

- 项目尊重作者及其作品。请始终遵守他人的权利和许可证，不要提交抄袭的程序代码。

- 作为贡献者所提供的程序，将按照项目所定义的许可证进行处理。

- 涉及隐私或可能对计算机造成危害的实现，需要进行慎重讨论。请不要先行实现，务必先达成共识。

## 贡献方式

本文档主要面向希望协助改进程序的贡献者，介绍“如何参与”。

在 VOICEVOX 中，可以通过以下方式进行贡献：

- 作为用户使用
- 发布文章或视频进行推广
- 协助改进程序
- 编写文档等

程序分为三个部分，请根据对应部分参与相应的项目。

| 类型            | 页面                                                       | 角色说明                                 |
| --------------- | ---------------------------------------------------------- | ---------------------------------------- |
| VOICEVOX        | [プロジェクト](https://github.com/VOICEVOX/voicevox/)        | 主要为用户界面（编辑器）部分             |
| VOICEVOX_ENGINE | [プロジェクト](https://github.com/VOICEVOX/voicevox_engine/) | 主要为 Web API 实现部分                  |
| VOICEVOX_CORE   | [プロジェクト](https://github.com/VOICEVOX/voicevox_core/)   | 主要为语音合成与库实现部分               |

如果希望了解整体结构，可参考 [こちら](docs/全体構成.md)。

## 新手友好任务

如果您正在学习程序开发，或希望实践开源社区活动，推荐参与社区 Issue 中已经提出的「初心者歓迎タスク」。

「初心者歓迎タスク」指的是对 VOICEVOX 项目来说“难度相对较低但确实需要完成的任务”，可以在学习完整流程的同时进行贡献。

| 类型            | 页面                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| VOICEVOX        | [初心者歓迎タスク](https://github.com/VOICEVOX/voicevox/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)        |
| VOICEVOX_ENGINE | [初心者歓迎タスク](https://github.com/VOICEVOX/voicevox_engine/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |
| VOICEVOX_CORE   | [初心者歓迎タスク](https://github.com/VOICEVOX/voicevox_core/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)   |

## 事前准备

以下内容以 Windows 用户构建 VOICEVOX（编辑器）环境为例进行说明。首先，我们来搭建测试版 VOICEVOX 的环境。

### 1. 安装正式版 VOICEVOX

- 首先安装 [VOICEVOXの製品版](https://voicevox.hiroshiba.jp/)，这样可以立即获得可用的 VOICEVOX 引擎。

### 2. 构建开发环境

- 必需工具

  - [Node.js](https://nodejs.org/en/download/releases/)  
    请安装 [こちら](https://github.com/VOICEVOX/voicevox/blob/main/.node-version) 中指定版本的安装程序。

- 视需要安装
  - [Git](https://git-scm.com/downloads)
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [GitHub CLI](https://github.com/cli/cli#installation)
  - [typos](https://github.com/crate-ci/typos#install)（用于拼写检查）
  - [Tortoise Git](https://tortoisegit.org/download/)
    （希望在资源管理器中操作时）

### 3. Fork 项目

- 将项目复制到自己 GitHub 仓库的操作称为 Fork。请点击 [こちら](https://github.com/VOICEVOX/voicevox/fork) 进行 Fork。

### 4. 获取源代码（Clone）

- 将自己 GitHub 仓库中的源代码下载到本地。

#### 4.1 使用命令行

- 使用 GitHub CLI：

```bash
gh repo clone https://github.com/(个人GitHub账号名)/voicevox.git
```

- 使用 Git CLI：

```bash
git clone git@github.com:(个人GitHub账号名)/voicevox.git
```

#### 4.2 使用 GUI

- 使用 Visual Studio Code、Tortoise Git 等工具。
- URL 通常为  
  `git@github.com:(个人GitHub账号名)/voicevox.git`  
  或  
  `https://github.com/(个人GitHub账号名)/voicevox.git`

### 5. 下载所需程序

- 打开第 4 步获取的文件夹并启动命令提示符。
- 执行以下命令准备环境：

```bash
npm install -g pnpm
pnpm i
```

- 出现的警告可忽略，不影响开发环境。

### 6. 指定引擎

- 复制 `.env.production` 文件并重命名为 `.env`。
- 打开文件，在 `VITE_DEFAULT_ENGINE_INFOS` 中将 `executionFilePath` 修改为步骤 1 中的安装路径。

（以下示例保持原文）

### 7. 启动

- 执行 `pnpm run electron:serve`。
- 若配置正确，开发环境将会启动。

## 项目贡献流程

### 1. 提案与协调

如有以下情况，请先创建 Issue：

- 想修改程序规格
- 想新增功能
- 发现 Bug

#### 1.1 提案

请明确是针对 VOICEVOX 的哪个部分进行提案，并尽可能描述“改进后的优点”以及“可能的缺点或影响”。

#### 1.2 咨询

此阶段将与相关人员确认实现限制、影响范围、优先级以及是否符合项目方针。

#### 1.3 着手声明

若要处理已有 Issue，请在 Issue 页面声明“我将着手处理”，避免与他人重复。

### 2. 创建分支

- 在本地创建用于本次修改的分支。
- 分支名可自行决定，清晰易懂即可。

### 3. 修改程序

- 函数名、变量名原则上使用驼峰命名。
- 若因限制无法使用驼峰命名，请添加注释说明。
- 尽量保持代码简洁、易读，删除无用代码。

### 4. 事前测试

- 提交前请执行 lint、fmt、typecheck、测试等步骤，确保没有新增警告或错误。
- 在本地实际运行 VOICEVOX，确认功能正常。

### 5. 提交代码

- 先提交到个人仓库，并清晰填写提交说明。
- 创建 Pull Request 向社区提案。
- 如有相关 Issue，请在 PR 中注明，必要时使用 `close #xxxx`。

### 6. 代码审查

- 维护者或社区成员会进行审查。
- 如有修改建议，请讨论并调整至最佳方案。

### 7. 冲突处理

- 若发生冲突，请拉取 VOICEVOX 官方仓库并手动解决。
- 再次执行测试，确认无问题后提交。

完成以上流程后，贡献即告完成。感谢您的付出！

## 参考信息

- UX・UI 设计方针：[UX・UIデザインの方針](docs/UX・UIデザインの方針.md)
- 设计细节：[細かい設計方針](docs/細かい設計方針.md)
- 代码结构：[コードの歩き方](docs/コードの歩き方.md)
- 颜色实现：[色について](docs/色について.md)
- 字体相关：[フォントについて](docs/フォントについて.md)