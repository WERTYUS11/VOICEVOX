# UI 名称与 Vue 文件名对应速查表

## 注意事项等

此文件更新遗漏的可能性较高。请同时查阅实际文件。

如果不知道各 UI 的名称，请参阅[VOICEVOX 专用 UI 名称](./UX・UIデザインの方針.md#voicevox-専用-ui-の名称)。

所有文件共用的扩展名`.vue`已省略。

## 对应速查

### views 目录

- 主界面整体 ･･･ [EditorHome](../src/components/Talk/EditorHome.vue)

### components 目录

- 最顶部栏（含菜单） ･･･ [MenuBar](../src/components/MenuBar.vue)
 - 菜单
   - 菜单项列表 ･･･ [MenuItem](../src/components/MenuItem.vue)
   - 菜单按钮 ･･･ [MenuButton](../src/components/MenuButton.vue)
   - 引擎
     - 引擎管理 ･･･ [EngineManageDialog](../src/components/Dialog/EngineManageDialog.vue)
   - 设置
     - 快捷键设置 ･･･ [HotkeySettingDialog](../src/components/Dialog/HotkeySettingDialog.vue)
     - 工具栏自定义 ･･･ [ToolBarCustomDialog](../src/components/Dialog/ToolBarCustomDialog.vue)
     - 角色排序·试听 ･･･ [CharacterOrderDialog](../src/components/Dialog/CharacterOrderDialog.vue)
       - 试听语音列表中的各角色 ･･･ [CharacterTryListenCard](../src/components/Dialog/CharacterTryListenCard.vue)
     - 默认样式 ･･･ [DefaultStyleListDialog](../src/components/Dialog/DefaultStyleListDialog.vue)
       - 单独选择 ･･･ [DefaultStyleSelectDialog](../src/components/Dialog/DefaultStyleSelectDialog.vue)
     - 读法与重音词典 ･･･ [DictionaryManageDialog](../src/components/Dialog/DictionaryManageDialog.vue)
     - 选项 ･･･ [SettingDialog](../src/components/Dialog/SettingDialog.vue)
       - 导出文件名模式 ･･･ [FileNamePatternDialog](../src/components/Dialog/FileNamePatternDialog.vue)
   - 帮助 ･･･ `help`目录
     - 请参阅 [HelpDialog](../src/components/Dialog/HelpDialog/HelpDialog.vue) 的`pagedata`中的`components`。
 - 窗口右上角的按钮组（含置顶按钮） ･･･ [TitleBarButtons](../src/components/TitleBarButtons.vue)
   - 除置顶按钮外的按钮 ･･･ [MinMaxCloseButtons](../src/components/MinMaxCloseButtons.vue)
- 工具栏 ･･･ [ToolBar](../src/components/ToolBar.vue)
- 角色显示区 ･･･ [CharacterPortrait](../src/components/Talk/CharacterPortrait.vue)
- 台词区（含文本框添加按钮） ･･･ 包含在 [views/EditorHome](../src/views/EditorHome.vue) 中
 - 音轨（含行号·文本框） ･･･ [AudioCell](../src/components/Talk/AudioCell.vue)
   - 角色图标 ･･･ [CharacterButton](../src/components/CharacterButton.vue)
   - 上下文（右键）菜单 ･･･ [ContextMenu](../src/components/ContextMenu.vue)
- 参数调整区 ･･･ [AudioInfo](../src/components/Talk/AudioInfo.vue)
 - 预设管理 ･･･ [PresetManageDialog](../src/components/Dialog/PresetManageDialog.vue)
- 详细调整区（含各项目·播放按钮） ･･･ [AudioDetail](../src/components/Talk/AudioDetail.vue)
 - 重音项目中，非文字部分的 UI ･･･ [AudioAccent](../src/components/Talk/AudioAccent.vue)
 - 语调·长度项目的滑块 [AudioParameter](../src/components/Talk/AudioParameter.vue)
- 其他
 - 首次启动时显示的画面
   - 使用条款 ･･･ [AcceptTermsDialog](../src/components/Dialog/AcceptTermsDialog.vue)
   - 数据收集与隐私政策 ･･･ [AcceptRetrieveTelemetryDialog](../src/components/Dialog/AcceptRetrieveTelemetryDialog.vue)
 - 启动时显示的画面
   - 新增角色介绍 ･･･ [CharacterOrderDialog](../src/components/Dialog/CharacterOrderDialog.vue)（与 设置 / 角色排序·试听 共通）
 - “音频导出”时的成功与否通知 ･･･ [SaveAllResultDialog](../src/components/Dialog/SaveAllResultDialog.vue)
 - 仅显示一次的提示 ･･･ [ToolTip](../src/components/ToolTip.vue)
 - 音频生成中的进度显示 ･･･ [ProgressView](../src/components/ProgressView.vue)
 - 错误记录用（对 UI 无影响） ･･･ [ErrorBoundary](../src/components/ErrorBoundary.vue)
