# 贡献者指南

## 前言

首先，感谢您对 VOICEVOX 项目的关注。
我们欢迎您的积极参与。

当您实际想要参与时，会发现任何社区都有其规则，如果不理解这些规则，可能会感到门槛很高。

本指南旨在尽可能清晰地以文字形式记录这些内容，提供一个易于参与社区的环境。此外，为方便新的贡献者加入，其中包含了一些对熟悉者而言可能不必要的详细说明。项目欢迎有志的贡献者，请阅读文档并加入我们吧。

## 负责人

| 角色               | 负责人                         |
| ------------------ | ---------------------------- |
| 产品负责人         | @Hiroshiba                   |
| 维护者             | @Hiroshiba、@y-chan、@qryxip |
| 汉化               | @WERTYUS11                   |

## 参与心得

VOICEVOX 项目属于典型的集体开发型开源软件。希望参与的人员需要注意以下事项：

- 提出建议时，如果能参照[VOICEVOX 的目标](docs/ミッション・バリュー・ビジョン.md)进行，沟通会更顺畅。

- 具体实施内容需要通过社区内的讨论达成共识。此外，项目方针可能会导致某些提议被拒绝。

- 集体开发的一大乐趣在于通过交流共同创造。相比独自创作，这需要更细致的沟通。请始终对沟通对象保持尊重。

- 参与项目与年龄、国籍、境遇、性别等无关。项目不容忍任何形式的歧视。

- 项目尊重作者和作品。我们始终致力于遵守他人的权利和许可。在为项目贡献时，请勿提交抄袭的代码。

- 请注意，作为贡献者提供的程序将按照项目定义的许可进行处理。

- 涉及隐私的实现或可能危害计算机的实现需要谨慎讨论。请务必先达成共识，而不是直接进行实现。

## 贡献方式

本文档主要针对希望协助改进程序的贡献者，指导“如何参与”。

VOICEVOX 有以下几种贡献方式：

- 作为用户使用
- 发布文章或视频进行推广
- 协助改进程序
- 撰写文档等

程序分为三个部分，请参与与您感兴趣的部分相关的项目。

| 类型            | 页面                                                       | 角色                                     |
| --------------- | ------------------------------------------------------------ | ---------------------------------------- |
| VOICEVOX        | [项目](https://github.com/VOICEVOX/voicevox/)        | 主要负责用户界面（编辑器）部分 |
| VOICEVOX_ENGINE | [项目](https://github.com/VOICEVOX/voicevox_engine/) | 主要负责 Web API 实现部分                      |
| VOICEVOX_CORE   | [项目](https://github.com/VOICEVOX/voicevox_core/)   | 主要负责语音合成和库实现部分         |

此外，如果您想了解整体架构，[此处](docs/全体構成.md)可能会有所帮助。

## 新手友好任务

如果您想学习程序开发或实践在开源开发社区中活动，我们建议您参与社区 Issues 中已经提出的“新手友好任务”。

“新手友好任务”在 VOICEVOX 项目中被定义为“难度相对较低但有需求的任务”，您可以在相对智能地学习整个流程的同时进行贡献。

| 类型            | 页面                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VOICEVOX        | [新手友好任务](https://github.com/VOICEVOX/voicevox/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)        |
| VOICEVOX_ENGINE | [新手友好任务](https://github.com/VOICEVOX/voicevox_engine/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |
| VOICEVOX_CORE   | [新手友好任务](https://github.com/VOICEVOX/voicevox_core/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク)   |

## 前期准备

接下来，我们将假设您是 Windows 用户，并希望搭建 VOICEVOX（编辑器）的开发环境。首先，让我们构建一个测试版的 VOICEVOX 环境。

### 1. 安装正式版 VOICEVOX

- 首先安装[VOICEVOX 的正式版](https://voicevox.hiroshiba.jp/)。这样您就可以获得一个即用的 VOICEVOX 引擎。

### 2. 搭建开发环境

- 必备工具

  - [Node.js](https://nodejs.org/en/download/releases/)\
    获取并安装[此处](https://github.com/VOICEVOX/voicevox/blob/main/.node-version)列出的版本安装程序。

- 根据需要
  - [Git](https://git-scm.com/downloads)
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [GitHub CLI](https://github.com/cli/cli#installation)
  - [typos](https://github.com/crate-ci/typos#install) （如果需要进行错别字检查）
  - [Tortoise Git](https://tortoisegit.org/download/)
    （如果想在文件管理器中操作）

### 3. Fork 项目

- 将项目复制到您自己的 GitHub 仓库中，这个操作称为 Fork。[点击此处](https://github.com/VOICEVOX/voicevox/fork)进行 Fork。

### 4. 获取源代码（克隆）

- 将您 GitHub 仓库中的源代码从 GitHub 下载到您的工作电脑上。

#### 4.1 使用命令行操作

- 使用 GitHub 命令 (GitHub CLI)

```bash
gh repo clone https://github.com/(您的GitHub账户名)/voicevox.git
```

- 使用 Git 命令 (Git CLI)

```bash
git clone git@github.com:(您的GitHub账户名)/voicevox.git
```

#### 4.2 使用 GUI 操作

- 使用 Visual Studio Code 或 Tortoise Git 等工具获取。
- 指定的 URL 因工具而异，但通常是`git@github.com:(您的GitHub账户名)/voicevox.git`或`https://github.com/(您的GitHub账户名)/voicevox.git`。

### 5. 下载所需程序

- 打开在步骤 4 中获得的文件夹，并打开命令行提示符。
- 运行以下命令来准备环境。程序将自动下载。

```bash
npm install -g pnpm
pnpm i
```

- 可能会显示关于工具组合和实现方面的警告，但在搭建开发环境时可以忽略。

### 6. 指定引擎

- 复制`.env.production`文件，并将其重命名为`.env`。
- 用编辑器打开文件，将`VITE_DEFAULT_ENGINE_INFOS`中的`executionFilePath`填入步骤 1 中的文件夹名称。例如，如果您通过安装程序安装了正式版且未更改安装路径，请按如下方式修改并保存：

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

- 如果您更改了 VOICEVOX 正式版的安装路径，请单独指定。例如，如果正式版安装在`D:\VOICEVOX0.14.1`，请按如下方式修改并保存：

```text
"executionFilePath": "D:/VOICEVOX0.14.1/vv-engine/run.exe",
```

### 7. 启动尝试

- 执行`pnpm run electron:serve`。
- 如果设置正确，开发环境应该会启动。

## 项目贡献流程

### 1. 提案与协调

首先，如果有以下情况，请注册为 Issue：

- 想要更改程序规范
- 想要添加新功能
- 发现了一个 Bug

#### 1.1 提案

届时，请考虑您希望对 VOICEVOX 的哪个部分提出建议，并进行提案。此外，在您个人能力范围内，请说明“改进后会更好”以及“可能变差或受影响的点”，并进行注册。

#### 1.2 讨论

在此阶段，与相关人员就实现的限制、影响范围、项目方针的优先级以及是否可以实施进行协调。

社区中存在各种技术领域和技能水平的人员。在交流过程中，您可能会遇到许多不明白的地方。请提出问题，加深理解。

#### 1.3 声明着手

如果您想处理已注册为 Issue 的任务，为了避免与其他贡献者重复工作，请在该 Issue 页面上声明“我将着手处理”。

声明着手后，您将按照以下步骤进行工作。请定期报告讨论和进展。此外，由于工作时间或技能等原因，有时可能无法完成代码编写。在这种情况下，请不要独自承担，而是在 Issue 页面上进行讨论。

### 2. 创建分支

- 在您的工作文件夹中，为本次加工创建一个工作区。
- 如果同时处理多个任务，请按照此步骤创建多个分支。
- 分支名称可以取您自己容易理解的名称。

### 3. 加工程序

实际编写程序。编写程序时，有一些惯例。

- 函数名和变量名应尽量使用驼峰命名法。如果由于某些限制无法使用驼峰命名法，请添加注释。

```ts
// FIXME: 由于●●，无法采用驼峰命名法
```

- 如果本次编码中，由于结构限制等原因导致“与理想结构不符”，也请添加注释。

```ts
// TODO: 希望实现不使用●●，而是●●的结构
```

- 在命名变量和类型时，如果该机制有通用的命名规则，则优先采用这些规则。

- 函数名应设置为动词+作用的形式。

  | 命名示例      | 作用                        |
  | ----------- | --------------------------- |
  | setVolume() | 设置音量                  |
  | getVolume() | 获取音量                  |
  | isMuted     | 获取静音状态 (boolean) |

- 变量或函数名中的英文尽量不要缩写。
- 代码应保持清晰和简洁。
- 在提交代码前，请移除不必要的定义或正在处理中的代码。

### 4. 预测试

- 在提交代码之前进行测试。测试会使用一些工具。如果您按照本指南的步骤进行，所需工具应该已准备就绪。

- 确认代码符合编码规范。（特别注意本次操作是否增加了警告或错误）

  ```bash
  pnpm run lint
  pnpm run fmt
  ```

执行 Lint 后，会在仓库根目录生成缓存文件`.eslintcache`。
如果 ESLint 版本升级、配置更改或缓存损坏，请删除此文件。

- 执行 TypeScript 的类型检查。

  ```bash
  pnpm run typecheck
  ```

- 确认 Markdown 描述正确。

  ```bash
  pnpm run markdownlint ./*/*.md
  ```

- 确认命名中使用的英文没有拼写错误。

  ```bash
  pnpm run typos
  ```

- 在个人环境中运行 VOICEVOX，并在提交前确认其正常运行。

  ```bash
  pnpm run electron:serve
  ```

- 确认所使用的库的许可证中没有包含不允许使用的内容。

  ```bash
  pnpm run license:generate -o voicevox_licenses.json
  ```

- 确认 e2e 测试的内容。

  ```bash
  pnpm run test:unit
  pnpm run test:browser-e2e
  pnpm run test:electron-e2e
  ```

  - e2e 测试实际上可能会指出超出您提交范围的问题，或者警告可能无法完全消除。
  - 作为检查标准，请确认在加工前后，e2e 测试结果指出的问题没有增加。（由于在 checkout 时 e2e 测试可能已经存在问题，因此最好通过前后差异来判断。）
  - 如果在您提交的范围内被指出问题，请在提交前进行修正。
  - 如果有无法修正 e2e 测试结果的原因或难以判断的情况，请在评审时进行讨论。

### 5. 提交代码

- 首先将代码提交到个人仓库。此时，请务必在详细信息中准确填写更改的具体内容。标题应简洁明了。

- 提交完成后，将代码提交给社区。将创建的代码提交给社区的操作称为“Pull Request（拉取请求）”。

- Pull Request 有两种类型：

  - Draft Pull Request (草稿拉取请求)
  - Pull Request (拉取请求)

- Draft Pull Request 用于分享进展。由于它能展示思考过程，因此在需要讨论的项目中特别有效。

- 对于 Draft Pull Request，在标题前加上 `WIP:` 会更清晰易读。

- 当您认为大致没问题时，就可以提交 Pull Request。
  接下来将是协作工作，请再次确认没有遗漏或问题。

- 提交 Pull Request 时，请注明相关的 Issue 编号。

  示例：

  ```text
  标题：减少启动等待时间
  内容：通过并行处理初始化来缩短等待时间
  相关Issue：ref #0000
  ```

- 如果在 Pull Request 的说明中按以下方式编写，当合并时，相应的 Issue 将自动关闭。
  这可以防止遗漏关闭 Issue 或讨论分散的问题。

  ```text
  close #0000
  ```

### 6. 代码审查

- 审查者和社区成员将对源代码进行审阅。如果发现问题，将提出修改建议。

- 如果您同意，可以选择“按建议修改”，但如果您认为存在问题，请进行讨论以寻求最佳解决方案。

- 在此阶段，Pull Request 已经提交，因此只需将修改推送到您的仓库，系统将自动跟踪。

- 目前 VOICEVOX 的合并规则要求至少有一名审阅者进行审阅。

### 7. 冲突处理

- 审查结束后，将开始合并（集成）准备。

- 如果在您工作期间，其他修改已被集成，可能会发生修改区域重叠的“冲突”现象。

- 发生冲突时，Pull Request 页面会显示“发生冲突”，请按照以下步骤进行修正。

  1. 将代码拉取到您的工作仓库。拉取源不是您的 GitHub 仓库，而是[VOICEVOX 的仓库](https://github.com/VOICEVOX/voicevox.git)。

  2. 边查看变更差异，边将冲突部分修正为正确的实现。

  3. 所有变更完成后，重新执行步骤 4 中的“预测试”。

  4. 如果没有问题，提交。

  5. 在 VOICEVOX 的 Pull Request 页面上，会自动运行自动检查处理。请确认该页面上“发生冲突”的提示已消失。

- 辛苦了。到此，贡献者的工作就结束了。
- 负责合并的人员确认后，将进行合并处理。
- 合并完成后，您可以删除个人分支。

### 其他

- VOICEVOX 项目成员会支持和咨询，以帮助贡献者更轻松地开展活动。
- 如果您遇到困难或不明白的地方，请咨询项目成员。
- 我们也有[Discord 社区](https://discord.gg/gJamMrqFHg)。如果您想在讨论中整理思路，可以好好利用社区。
- 如果由于某些原因无法继续处理，或者技术门槛太高而感到沮丧，也可以宣布放弃。由于有时可以进行调整，建议在宣布放弃前进行咨询。

## 参考信息

- 实现时的设计请参考[UX/UI 设计方针](docs/UX・UIデザインの方針.md)进行实现。

- 设计详情请参考[详细设计方针](docs/細かい設計方針.md)。

- VOICEVOX 使用了各种技术进行实现，如果对技术不了解，可能会感到难以阅读。关于整体结构，请参考[代码导览](docs/コードの歩き方.md)。

- 关于颜色，请参考[关于颜色的实现](docs/色について.md)的文档。

- VOICEVOX 中使用的字体，其生成方法等信息可在[关于字体](docs/フォントについて.md)中找到。
```

