# 贡献者指南

## 开始之前

首先，感谢您对 VOICEVOX 项目感兴趣。我们欢迎您的积极参与。

实际参与时，任何社区都会存在规则，如果不理解这些规则，可能会感到门槛较高。

本指南的编写目的是将这部分内容尽可能以易懂的方式记录下来，为参与社区提供便利的环境。此外，为了让新的贡献者更容易加入，本文进行了详细解说，因此也包含了对熟悉者而言不必要的说明。项目欢迎有意愿的贡献者，请阅读文档并参与进来。

## 负责人

| 角色 | 负责人 |
| ------------------ | ---------------------------- |
| 产品负责人 | @Hiroshiba |
| 维护者 | @Hiroshiba、@y-chan、@qryxip |

## 参与须知

VOICEVOX 项目属于所谓的集体开发型开源软件。希望参与的人需要注意以下事项。

- 对照 [VOICEVOX 的目标](docs/ミッション・バリュー・ビジョン.md) 进行提案，交流会更顺畅。

- 关于实施的内容，需要在社区内边交流边达成共识。此外，根据项目方针，提案有可能不被采纳。

- 在集体开发中，一边交流一边制作东西也是乐趣之一。与独自创作相比，需要更细致的沟通。请始终对交谈对象保持敬意。

- 参与项目与年龄、国籍、境遇、性别等无关。项目不容忍对这些方面的歧视。

- 项目尊重作者和作品。我们始终注意遵守他人的权利和许可证。在为项目做贡献时，请勿提交抄袭的程序。

- 请注意，作为贡献者提供的程序将按照项目定义的许可证进行处理。

- 关于涉及隐私的实现，或可能对计算机造成危害的实现，需要谨慎讨论。请不要先进行实现，务必先达成共识。

## 贡献方式

本文档主要面向协助改进程序的人，介绍"参与方式"。

VOICEVOX 有以下几种贡献方式：

- 作为用户使用
- 发布文章或视频进行推广
- 协助改进程序
- 编写文档等

程序分为三个部分，请加入与相应部分对应的项目。

| 类型 | 页面 | 角色 |
| --------------- | ------------------------------------------------------------ | ---------------------------------------- |
| VOICEVOX | [项目](https://github.com/VOICEVOX/voicevox/) | 主要是用户界面（编辑器）部分 |
| VOICEVOX_ENGINE | [项目](https://github.com/VOICEVOX/voicevox_engine/) | 主要是 Web API 实现部分 |
| VOICEVOX_CORE | [项目](https://github.com/VOICEVOX/voicevox_core/) | 主要是语音合成、库实现部分 |

另外，如果想了解整体架构，可以参考[这里](docs/全体構成.md)。

## 新手欢迎任务

如果你想学习程序开发，或实践在开源开发社区中活动，推荐你参加社区 Issues 中已经提出的"新手欢迎任务"。

"新手欢迎任务"在 VOICEVOX 项目中是"难度相对较低、但又是所需要的任务"，可以在较高效地学习一整套流程的同时做出贡献。

| 类型 | 页面 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VOICEVOX | [新手欢迎任务](https://github.com/VOICEVOX/voicevox/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |
| VOICEVOX_ENGINE | [新手欢迎任务](https://github.com/VOICEVOX/voicevox_engine/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |
| VOICEVOX_CORE | [新手欢迎任务](https://github.com/VOICEVOX/voicevox_core/issues?q=is%3Aissue+is%3Aopen+label%3A初心者歓迎タスク) |

## 事前准备

下面假设您使用的是 Windows，并需要搭建 VOICEVOX（编辑器）的环境。首先，让我们搭建测试版 VOICEVOX 的环境。

### 1. 安装产品版 VOICEVOX

- 首先安装 [VOICEVOX 产品版](https://voicevox.hiroshiba.jp/)。这样就能获得可立即使用的 VOICEVOX 引擎。

### 2. 搭建开发环境

- 必备工具

  - [Node.js](https://nodejs.org/en/download/releases/)\
    获取[这里](https://github.com/VOICEVOX/voicevox/blob/main/.node-version)所记载版本的安装程序并进行安装。

- 根据需要
  - [Git](https://git-scm.com/downloads)
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [GitHub CLI](https://github.com/cli/cli#installation)
  - [typos](https://github.com/crate-ci/typos#install) （检查错字时）
  - [Tortoise Git](https://tortoisegit.org/download/)
    （想在资源管理器上操作时）

### 3. Fork

- 创建项目的副本并带到自己的 GitHub 仓库的操作称为 Fork。点击[这里](https://github.com/VOICEVOX/voicevox/fork)执行 Fork。

### 4. 获取源代码（Clone）

- 将自己 GitHub 仓库中的源代码从 GitHub 获取到用于工作的电脑上。

#### 4.1 使用命令行时

- 使用 GitHub 命令（GitHub CLI）时

```bash
gh repo clone https://github.com/(个人 GitHub 账户名)/voicevox.git
```

- 使用 Git 命令（Git CLI）时

```bash
git clone git@github.com:(个人 GitHub 账户名)/voicevox.git
```

#### 4.2 使用 GUI 时

- 使用 Visual Studio Code 或 Tortoise Git 等工具获取。
- 需指定的 URL 因工具而异，为 `git@github.com:(个人 GitHub 账户名)/voicevox.git` 或 `https://github.com/(个人 GitHub 账户名)/voicevox.git`。

### 5. 下载所需的程序

- 打开在步骤 4 中获得的文件夹，并打开命令提示符。
- 请执行以下准备环境的命令。它们会被自动下载。

```bash
npm install -g pnpm
pnpm i
```

- 会显示关于工具组合或实现的警告，但在搭建开发环境时忽略它们没有关系。

### 6. 指定引擎

- 存在名为 `.env.example` 的文件，请复制它，并将名称改为 `.env`。
- 用编辑器打开文件，在 `VITE_DEFAULT_ENGINE_INFOS` 内的 `executionFilePath` 中填入步骤 1 的文件夹路径。例如，如果通过安装程序安装产品版且未更改安装位置，请如下修改并保存。

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

- 如果您更改了 VOICEVOX 产品版的安装位置，则需要单独指定。例如，如果将产品版安装在 `D:\VOICEVOX0.14.1`，请如下修改并保存。

```text
"executionFilePath": "D:/VOICEVOX0.14.1/vv-engine/run.exe",
```

### 7. 尝试启动

- 执行 `pnpm run electron:serve`。
- 如果设置正确，开发环境应该会启动。

## 项目贡献流程

### 1. 提案与调整

首先，如果有以下情况，请注册为 Issue。

- 想修改程序的规格
- 想添加新功能
- 确认了 bug

#### 1.1 提案

此时，请考虑想就 VOICEVOX 的哪一部分进行提案，然后提出。另外，在个人了解的范围内即可，请写出"通过改进会变好的点"以及"会变差的点、受影响的点"进行注册。

#### 1.2 协商

在此阶段，与相关人员就实现相关的约束、影响范围，以及项目方针上的优先级和是否可以实施进行协调。

社区中混有各种技术领域、技能水平的人。在交流过程中经常会出现不懂的地方。对不清楚的地方请提问，加深理解。

#### 1.3 声明着手

如果想着手处理已注册为 Issue 的课题，为了避免与其他贡献者重复作业，请在该 Issue 页面声明"我来着手处理"。

另外，声明着手后，将按以下步骤进行作业。请定期报告协商和进度。此外，由于作业时间或技能等原因，可能存在无法写完代码的情况。此时请不要独自硬撑，在 Issue 页面进行协商。

### 2. 创建分支

- 在自己的作业文件夹内，为本次修改创建工作区。
- 如果要并行处理几个案件，请按此步骤创建多个分支。
- 分支名用自己容易理解的即可。

### 3. 修改程序

实际编写程序。编写程序时有几个惯例。

- 函数名和变量名应尽量使用驼峰式（camelCase）命名。如果因某些约束无法使用驼峰式命名，请留下注释。

```ts
// FIXME: 由于 ●●，无法采用驼峰式
```

- 本次进行编码时，如果由于结构约束等原因与"理想的结构不同"，也请留下注释。

```ts
// TODO: 想不用 ●●，实现为 ●●
```

- 在命名变量名和类型名时，如果该机制存在通用的命名规则，则优先采用。

- 函数名设置为"动词＋作用"的形式。

  | 命名示例 | 作用 |
  | ----------- | --------------------------- |
  | setVolume() | 设置音量 |
  | getVolume() | 获取音量 |
  | isMuted | 获取静音状态（boolean）|

- 变量名和函数名中的英语尽量不省略。
- 请保持代码的易读性和简洁性。
- 请在提交代码前删除不必要的定义和作业中的代码。

### 4. 事前测试

- 提交前对代码进行测试。测试会用到几个工具。如果按本指南的步骤进行，所需工具已准备齐全。

- 确认所写代码符合编码规则。（特别要注意本次作业是否增加了警告或错误）

  ```bash
  pnpm run lint
  pnpm run fmt
  ```

执行 lint 后，仓库根目录会生成缓存文件 `.eslintcache`。当 ESLint 升级、设置变更或缓存损坏时，请删除此文件。

- 进行 TypeScript 的类型检查。

  ```bash
  pnpm run typecheck
  ```

- 确认 Markdown 的书写是否正确。

  ```bash
  pnpm run markdownlint ./*/*.md
  ```

- 确认命名所用英语是否正确。

  ```bash
  pnpm run typos
  ```

- 在个人环境中运行 VOICEVOX，提交前确认整体能够正常运行。

  ```bash
  pnpm run electron:serve
  ```

- 确认所使用的库的许可证中没有不可使用的内容。

  ```bash
  pnpm run license:generate -o voicevox_licenses.json
  ```

- 确认 e2e 测试的内容。

  ```bash
  pnpm run test:unit
  pnpm run test:browser-e2e
  pnpm run test:electron-e2e
  ```

  - e2e 测试实际上可能会指出超出自己提交范围的要点，或警告无法完全消除。
  - 作为确认标准，请确认修改前后 e2e 测试结果中的指摘没有增加。（由于 checkout 时可能遗留 e2e 测试的指摘，最好通过前后的差异来判断）
  - 如果被指摘的内容属于提交范围，请在提交前修正。
  - 如果有无法修正 e2e 测试结果的情况，或难以判断时，请在审查时协商。

### 5. 提交代码

- 首先提交到个人仓库。此时，请在详情栏中准确填写与变更相关的具体内容。标题最好简洁易懂。

- 提交完成后，向社区提议代码。将编写的代码向社区提议的操作称为"Pull Request（拉取请求）"。

- Pull Request 有两种类型。

  - Draft Pull Request
  - Pull Request

- Draft Pull Request 用于共享进度。由于可以了解探讨的过程，对于需要讨论的项目尤为有效。

- 对于 Draft Pull Request，在标题开头加上 `WIP:` 会更易辨认。

- 如果判断大致没有问题，就提交 Pull Request。接下来将进入共同作业，请再次确认是否有遗漏或问题。

- 提交 Pull Request 时，请填写相关 Issue 的编号。

  填写示例：

  ```text
  标题：降低启动时的等待时间
  内容：通过并行处理初始化来缩短等待时间
  相关 Issue：ref #0000
  ```

- 在 Pull Request 的说明文字中如下书写，合并时对应的 Issue 会自动关闭。这样可以防止忘记关闭 Issue 以及讨论地点分散。

  ```text
  close #0000
  ```

### 6. 代码审查

- 由审查负责人或社区成员对源代码进行审阅。如果发现问题，会提出修改建议。

- 如果认同，可以采用"按建议修改"的方式；如果认为存在问题，请进行讨论，寻找最佳方案。

- 在此阶段，由于已经提交了 Pull Request，只需将修改推送到自己的仓库，就会被自动追踪。

- 按照目前 VOICEVOX 的合并规则，基本上需要 1 名以上的人员进行审阅。

### 7. 处理冲突

- 审查结束后，开始进行合并（并入）准备。

- 如果作业期间有其他修改被并入，可能会发生修改位置重叠的"冲突"现象。

- 发生冲突时，Pull Request 页面会显示"发生了冲突"，请按以下步骤进行修正。

  1. 拉取到自己的作业仓库。拉取源不是自己的 GitHub 仓库，而是指定 [VOICEVOX 的仓库](https://github.com/VOICEVOX/voicevox.git)。

  2. 一边查看变更差异，一边将冲突部分修正为正确的实现。

  3. 所有修改完成后，重新执行步骤 4 中的"事前测试"。

  4. 如果没有问题，进行提交。

  5. VOICEVOX 的 Pull Request 页面会运行自动检查。请确认该页面中"发生了冲突"的显示已消失。

- 辛苦了。进行到这一步，贡献者的工作就结束了。
- 合并负责人确认后，会进行合并处理。
- 合并完成后，可以删除个人分支。

### 其他

- VOICEVOX 项目成员会提供支持和咨询，方便贡献者开展活动。
- 如果遇到困难或不懂的地方，请向项目成员咨询。
- 还有 [Discord 社区](https://discord.gg/gJamMrqFHg)。如果想边讨论边整理思路，可以好好利用社区。
- 如果因种种原因无法继续处理，或技术门槛过高而心灰意冷时，也可以宣布放弃。由于有时可以进行调整，建议在宣布前先进行协商。

## 参考信息

- 关于实现时的设计，请参考 [UX・UI 设计方针](docs/UX・UIデザインの方針.md) 进行实现。

- 关于设计细节，请参考[详细设计方针](docs/細かい設計方針.md)。

- VOICEVOX 使用了各种技术实现，有些部分在不了解技术的情况下难以阅读。关于整体结构，请参考[代码导览](docs/コードの歩き方.md)。

- 关于颜色，请参考[颜色的实现](docs/色について.md)相关文档。

- VOICEVOX 使用的字体，其生成方法等写在[关于字体](docs/フォントについて.md)中。
