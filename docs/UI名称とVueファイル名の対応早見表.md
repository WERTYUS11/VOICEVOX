# UI名称与Vue文件对应速查表

## 注意事项等

此文件较容易发生更新遗漏等情况。请同时结合实际文件进行确认。

如不清楚各UI的名称，请参阅[VOICEVOX专用UI名称](./UX・UIデザインの方針.md#voicevox-専用-ui-の名称)。

## 对应速查

所有文件共通的扩展名`.vue`已省略。

### views 目录

- 主画面整体 ･･･ [EditorHome](../src/components/Talk/EditorHome.vue)

### components 目录

- 最顶部的栏（包含菜单） ･･･ [MenuBar](../src/components/MenuBar.vue)
  - 菜单
    - 菜单的项目列表 ･･･ [MenuItem](../src/components/MenuItem.vue)
    - 菜单的按钮 ･･･ [MenuButton](../src/components/MenuButton.vue)
    - 引擎
      - 引擎管理 ･･･ [EngineManageDialog](../src/components/Dialog/EngineManageDialog.vue)
    - 设置
      - 快捷键分配 ･･･ [HotkeySettingDialog](../src/components/Dialog/HotkeySettingDialog.vue)
      - 工具栏自定义 ･･･ [ToolBarCustomDialog](../src/components/Dialog/ToolBarCustomDialog.vue)
      - 角色排序・试听 ･･･ [CharacterOrderDialog](../src/components/Dialog/CharacterOrderDialog.vue)
        - 示例语音列表中的各角色 ･･･ [CharacterTryListenCard](../src/components/Dialog/CharacterTryListenCard.vue)
      - 默认风格 ･･･ [DefaultStyleListDialog](../src/components/Dialog/DefaultStyleListDialog.vue)
        - 个别选择 ･･･ [DefaultStyleSelectDialog](../src/components/Dialog/DefaultStyleSelectDialog.vue)
      - 读音＆重音词典 ･･･ [DictionaryManageDialog](../src/components/Dialog/DictionaryManageDialog.vue)
      - 选项 ･･･ [SettingDialog](../src/components/Dialog/SettingDialog.vue)
        - 导出文件名模板 ･･･ [FileNamePatternDialog](../src/components/Dialog/FileNamePatternDialog.vue)
    - 帮助 ･･･ `help`目录
      - 请参阅 [HelpDialog](../src/components/Dialog/HelpDialog/HelpDialog.vue) 的`pagedata`中的`components`。
  - 窗口右上角的按钮组（包含固定按钮） ･･･ [TitleBarButtons](../src/components/TitleBarButtons.vue)
    - 固定按钮以外的按钮 ･･･ [MinMaxCloseButtons](../src/components/MinMaxCloseButtons.vue)
- 工具栏 ･･･ [ToolBar](../src/components/ToolBar.vue)
- 角色显示区域 ･･･ [CharacterPortrait](../src/components/Talk/CharacterPortrait.vue)
- 脚本区域（包含添加文本栏按钮） ･･･ 包含在 [views/EditorHome](../src/views/EditorHome.vue) 中
  - 轨道（包含行号・文本栏） ･･･ [AudioCell](../src/components/Talk/AudioCell.vue)
    - 角色图标 ･･･ [CharacterButton](../src/components/CharacterButton.vue)
    - 上下文（右键）菜单 ･･･ [ContextMenu](../src/components/ContextMenu.vue)
- 参数调整区域 ･･･ [AudioInfo](../src/components/Talk/AudioInfo.vue)
  - 预设管理 ･･･ [PresetManageDialog](../src/components/Dialog/PresetManageDialog.vue)
- 详细调整区域（包含各项目・播放按钮） ･･･ [AudioDetail](../src/components/Talk/AudioDetail.vue)
  - 重音项目中，文字以外部分的 UI ･･･ [AudioAccent](../src/components/Talk/AudioAccent.vue)
  - 音调・时长项目的滑块 ･･･ [AudioParameter](../src/components/Talk/AudioParameter.vue)
- 其他
  - 首次启动时显示的界面
    - 使用条款 ･･･ [AcceptTermsDialog](../src/components/Dialog/AcceptTermsDialog.vue)
    - 数据收集与隐私政策 ･･･ [AcceptRetrieveTelemetryDialog](../src/components/Dialog/AcceptRetrieveTelemetryDialog.vue)
  - 启动时显示的界面
    - 追加角色介绍 ･･･ [CharacterOrderDialog](../src/components/Dialog/CharacterOrderDialog.vue)（与 设置 / 角色排序・试听 共用）
  - “音频导出”时的成功/失败通知 ･･･ [SaveAllResultDialog](../src/components/Dialog/SaveAllResultDialog.vue)
  - 仅显示一次的提示 ･･･ [ToolTip](../src/components/ToolTip.vue)
  - 音频生成中的进度显示 ･･･ [ProgressView](../src/components/ProgressView.vue)
  - 用于错误记录（不影响UI） ･･･ [ErrorBoundary](../src/components/ErrorBoundary.vue)
