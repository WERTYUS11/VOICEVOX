# 常见问题（FAQ）

## 关于运行环境与规格的提问

### Q. 运行环境是什么？

#### CPU 版

支持搭载 Windows／Mac／Linux 的电脑。

※Windows：Windows 10、Windows 11  
※Mac：macOS 13（Ventura）及以上  
※Linux：Ubuntu 20.04、Ubuntu 22.04

#### GPU 版

支持搭载**支持 DirectML 的 GPU 的 Windows 电脑**，以及**搭载 Nvidia GPU 的 Linux 电脑**。

---

## 关于安装的提问

### Q. 无法下载安装程序

由于浏览器的安全功能，在下载并保存文件时，可能会显示与程序安全性相关的警告。  
请按照以下步骤下载。

#### 出现「无法安全地下载」提示时

1. 将鼠标移动到右上角显示的「无法安全地下载」处。
2. 点击「…」→「保存」按钮。
3. 若为从 VOICEVOX 官方网站下载的安装程序等能够确认安全性的文件，请点击「保留」。  
   若来源不明或无法确认安全性，请点击「取消」。  
   即使是从 VOICEVOX 官方网站下载的安装程序，「发布者」有时也会显示为「未知」。如果能确认是安全的，请放心保存。

#### 出现「很少有人下载」或「因可能对您的设备造成问题而被拦截」提示时

1. 将鼠标移动到右上角显示的「很少有人下载」或「因可能对您的设备造成问题而被拦截」处。
2. 点击「…」→「保存」按钮。
3. 出现「请在打开文件前确认该文件或其来源是否可信。」时，点击「显示详细信息」。
4. 若为从 VOICEVOX 官方网站下载的安装程序等能够确认安全性的文件，请点击「保留」。  
   若来源不明或无法确认安全性，请点击「删除」。  
   即使发布者显示为「未知」，只要能确认安全即可保存。

---

### Q. 显示「Windows 已保护您的电脑」

当尝试执行安装程序时，可能会出现此消息。  
这是来自 Windows SmartScreen（Windows Defender SmartScreen）的提示，用于确认该程序是否安全。  
检查发布者等信息并确认无问题后，请点击消息中的「详细信息」，然后执行安装程序。

---

### Q. 安装目录在哪里？

默认安装目录如下：

#### Windows 版

`C:\Users\（用户名）\AppData\Local\Programs\VOICEVOX`

#### Mac 版

`/Applications/VOICEVOX`  
或  
`/Users/（用户名）/Applications/VOICEVOX`

#### Ubuntu 版

`/home/（用户名）/.voicevox`

---

### Q. 如何更新版本？

从官方网站重新安装最新版即可完成更新。

---

### Q. 可以回到旧版本吗？

可以从[这里](https://github.com/VOICEVOX/voicevox/releases)下载旧版本。

---

## 关于使用方式的提问

### Q. 读音与预期不一致

可以通过「词典注册」更改读音。  
请前往「设置 → 读音 & 重音词典」添加单词。

---

### Q. 不知道如何使用

可参考 [使用方法](https://voicevox.hiroshiba.jp/how_to_use) 网页，或在软件的帮助中查看。  
若仍有疑问，可以在 X（原 Twitter）上带上 `#VOICEVOX` 发布，可能会有人告诉你解决方法。

---

### Q. 可以在离线电脑使用吗？

可以使用。

---

### Q. 想导入／导出词典

可在运行中的引擎的设置界面执行此操作。  
软件运行时，在浏览器访问 `http://127.0.0.1:[引擎端口]/setting` 即可打开引擎设置界面。默认端口为 `50021`。

---

## 关于故障・错误的提问

### Q. 发现了 bug，应该在哪里报告？

如果您发现了 bug，非常欢迎在 X 上反馈。  
VOICEVOX 官方账号：[@voicevox_pj](https://x.com/voicevox_pj)

---

### Q. 升级版本后界面显示异常

可能是设置出现问题。请退出软件，删除以下路径的设置文件后重新启动。

#### Windows

`C:\Users\（用户名）\AppData\Roaming\voicevox\config.json`

#### Mac

`/Users/（用户名）/Library/Application Support/voicevox/config.json`

---

### Q. 显示「引擎启动失败」

可能是在没有兼容 GPU 的电脑上以 GPU 模式启动导致。  
请前往「设置 → 引擎」选择 CPU 模式。

也可能是之前的引擎未正常退出，试试重启电脑。

---

### Q. 以 GPU 模式启动时出现错误

在没有兼容 GPU 的电脑上以 GPU 模式启动会出现错误，请切换至 CPU 模式。

如果你的电脑有兼容 GPU 但仍出错，可能安装的是 **CPU 版**。  
请从下载页面下载 **GPU 版**。

另外，Mac 不支持 GPU 模式。

---

### Q. 无法播放音频

可能是播放设备未正确设置。  
请前往：设置 → 高级设置 → 播放设备

若正在使用 GPU 模式，也可能导致此问题，请切换到 CPU 模式再试。

---

### Q. 无法播放长文本的语音

这通常是由于内存不足导致的，特别是在 GPU 模式下容易发生。  
请使用拥有更多 GPU 内存的电脑，或切换到 CPU 模式。

---

### Q. 用「、」分隔的短句有时不会被朗读

这是当前语音合成引擎的已知行为。  
增加前后无声区间的长度可能改善。

---

### Q. 如何查看错误日志？

通过菜单：帮助 → 联系我们 → 打开日志文件夹  
日志存放路径如下：

#### Windows

`C:\Users\（用户名）\AppData\Roaming\voicevox\logs`

#### Mac

`/Users/（用户名）/Library/Logs/voicevox`

---

### Q. 在 Ubuntu 22.04 无法运行

安装 `libfuse2` 可能解决问题：

```sh
sudo add-apt-repository universe
sudo apt install libfuse2
```

---

## 关于许可与使用条款的提问

### Q. 在视频中使用语音时，应该如何标注致谢（Credit）？

请在视频简介或视频内标注。  
在简介中标注更容易被搜索到，也会成为 VOICEVOX 开发的鼓励。

---

### Q. 使用「变声（Morphing）」功能时的使用条款如何？

需要遵守两种音声各自的使用条款。  
若条款不同，以限制更严格的一方为准。

例如：  
商用可用的音声 A + 商用不可用的音声 B → **商用不可用**

---

### Q. 若只想用于电话语音等音频用途，需如何标注？

请在音频开头或结尾插入语音致谢（Credit）。  
若角色方有特别说明，请以角色的使用条款为准。

---

### Q. 在音乐发布平台公开作品时如何标注？

若平台没有简介栏，可以在网站、附带页面、或相关视频平台标注，总之只要不是刻意隐藏即可。

---

### Q. 通过喇叭播放的设备（如语音提示机）应如何标注？

请在音频开头或结尾加入致谢，或在设备本体或周边位置贴上致谢标示。  
若角色方有特别规定，请以其为准。

---

### Q. 想在公司或学校使用 VOICEVOX

只要标注必要的致谢，无论商业或非商业都可以使用。  
请查看 VOICEVOX 的使用条款以及各角色的使用条款。

---

### Q. 若将音频的中间表示（AudioQuery／FrameAudioQuery）用于其他语音合成，是否必须标注？

是的，必须标注。

---

### Q. 如何省略「VOICEVOX:角色名」的致谢表记？

部分角色权利方可能提供「角色名部分」的付费省略许可。  
「VOICEVOX:」部分的省略许可也由角色权利者负责受理。

VOICEVOX 与角色的许可体系是分开的，但为了简化手续，两者均由角色方受理。  
请查看各角色的使用条款。

---

## 其他问题

### Q. 是否接受经济支持？

在 [pixiv FANBOX](https://hiho.fanbox.cc/) 接受支援。  
所得将全部用于 VOICEVOX 的开发、插画、音乐、影片、周边制作等活动经费。

---

### Q. 官方插画或立绘从哪里下载？

请从[ボイボ寮（BOIBO Dormitory）](https://voicevox.hiroshiba.jp/dormitory/) 查看各角色的主页。

---

### Q. 想询问有关角色的问题

VOICEVOX 的软件与角色并非同一权利方。  
有关角色的问题无法由 VOICEVOX 回答，请联系角色权利者。

---

### Q. 想参与 VOICEVOX 的开发

欢迎任何人参与，例如修复 bug。欢迎加入！

- [VOICEVOX 整体结构](https://github.com/VOICEVOX/voicevox/blob/main/docs/%E5%85%A8%E4%BD%93%E6%A7%8B%E6%88%90.md)
- [VOICEVOX 编辑器](https://github.com/VOICEVOX/voicevox)
- [VOICEVOX 引擎](https://github.com/VOICEVOX/voicevox_engine)
- [VOICEVOX 核心](https://github.com/VOICEVOX/voicevox_core)

---

### Q. 可以帮我判断是否遵守了使用条款吗？

原则上不提供个别判断服务。  
请尽量自行阅读使用条款后做出判断。

---

### Q. 联系方式是什么？

欢迎在 X（原 Twitter）上带上 `#VOICEVOX` 标签发表感想或需求，会成为开发动力。

如果遇到无法运行或发现 bug，请带上 `#VOICEVOX` 标签发布，  
或联系 VOICEVOX 官方账号（[@voicevox_pj](https://x.com/voicevox_pj)）。

若有本 Q&A 中未包含的问题，也请联系 VOICEVOX 官方账号（[@voicevox_pj](https://x.com/voicevox_pj)）。