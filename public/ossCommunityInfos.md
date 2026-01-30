# 如何参加开发

本软件基于 VOICEVOX 的开源版本构建，任何人都可以参与功能扩展和改进。

要不要一起来打造 VOICEVOX 呢？

## [VOICEVOX 编辑器](https://github.com/VOICEVOX/voicevox)

用于呈现 GUI 的模块，并以应用程序形式提供。  
主要由 TypeScript、Electron 和 Vue 构成。

## [VOICEVOX 引擎](https://github.com/VOICEVOX/voicevox_engine)

用于对外提供文本语音合成 API 的模块，并以 Web 服务器形式提供。  
主要由 Python、FastAPI 和 OpenJTalk 构成。

## [VOICEVOX 核心](https://github.com/VOICEVOX/voicevox_core)

用于执行语音合成所需计算的模块，并以动态库的形式提供。  
主要由 Rust 和 onnxruntime 构成。

## [VOICEVOX Chinese Script](https://github.com/WERTYUS11/VOICEVOX/tree/main/Script)

用于执行文字翻译符的转换模块。

---

VOICEVOX 的整体架构可在[此处](https://github.com/VOICEVOX/voicevox/blob/main/docs/%E5%85%A8%E4%BD%93%E6%A7%8B%E6%88%90.md)查看详细信息。

本项目不支持任何关于汉化的PR、Iussue。若需要可前往[项目官网](https://github.com/VOICEVOX/voicevox)提交。
