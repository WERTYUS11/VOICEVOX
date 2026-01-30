!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "funcs.nsh"

; voicevox-X.X.X-x64.nsis.7z.ini などが配置されている場所
; 開発中はここを一時的に差し替えて、out フォルダ内で npx http-server などとするとテストしやすい
; !define DOWNLOAD_BASE_URL "http://127.0.0.1:8080"
!define DOWNLOAD_BASE_URL "${APP_PACKAGE_URL}"

; inetc::get で使用するタイムアウト時間（秒）
; https://nsis.sourceforge.io/Inetc_plug-in#Commands
!define CONNECTTIMEOUT "300"
!define RECEIVETIMEOUT "300"

!ifndef BUILD_UNINSTALLER

  ; インストール後のサイズ
  Var installedSize
  ; 7zアーカイブのサイズ
  Var archiveSize
  ; ダウンロードするファイルサイズ
  ; （一部のファイルがダウンロード済みの場合に archiveSize とは異なるサイズになる）
  Var downloadSize

  ; 分割数
  Var numFiles
  ; ini ファイルへのフルパス
  Var iniFileName

  ; 動作モード
  ;   "None"                   - ファイルのダウンロードもファイルの結合も行わない
  ;   "DownloadAndConcatenate" - ファイルのダウンロードとファイルの結合を行う
  ;   "Concatenate"            - ファイルの結合のみを行う
  Var additionalProcess

  ; voicevox-X.X.X-x64.nsis.7z のようなファイル名
  Var archiveName
  ; SHA2-512 でのハッシュ値
  Var archiveHash

  ; 既に Welcome ページはスキップされているか？
  Var skippedWelcomePage

!endif

; ${updateDefinedVariablesINI} Result
; ini ファイルの内容に従い変数を更新する
; @return Result "OK"、"Broken"
!define updateDefinedVariablesINI "!insertmacro updateDefinedVariablesINI"
!macro updateDefinedVariablesINI Result
  Push $0 ; Stack $0
  Push $1 ;       $1 $0
  Push $2 ;       $2 $1 $0
  Push $3 ;       $3 $2 $1 $0

  ; 分割数を取得
  ReadINIStr $0 "$iniFileName" "files" "n"
  IfErrors updateDefinedVariablesINI_foundError 0
  StrCpy $numFiles $0

  ; 分割ファイルについての情報がすべて ini ファイル内に存在するか検証する
  ; 合わせて 7z ファイルの合計サイズを計算する
  StrCpy $3 "0"
  StrCpy $2 $numFiles
  IntOp $2 $2 - 1
  ${ForEach} $0 0 $2 + 1
    ReadINIStr $1 "$iniFileName" "files" "hash$0"
    IfErrors updateDefinedVariablesINI_foundError 0
    ReadINIStr $1 "$iniFileName" "files" "size$0"
    IfErrors updateDefinedVariablesINI_foundError 0
    System::Int64Op $3 + $1
    Pop $3
  ${Next}
  StrCpy $archiveSize $3

  StrCpy $0 "OK"
  Goto updateDefinedVariablesINI_finish

  updateDefinedVariablesINI_foundError:
  StrCpy $0 "Broken"

  updateDefinedVariablesINI_finish:
                  ; Stack $3 $2 $1 $0
  Pop $3          ;       $2 $1 $0
  Pop $2          ;       $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
!macroend

; ${updateDefinedVariables7z} Result
; 7z ファイルの内容に従い変数を更新する
; @return Result "OK", "Failed" のどれか
!define updateDefinedVariables7z "!insertmacro updateDefinedVariables7z"
!macro updateDefinedVariables7z Result
  Push $0 ; Stack $0
  Push $1 ;       $1 $0

  StrCpy $1 "$EXEDIR\$archiveName"

  ; アーカイブのサイズを取得
  ${getFileSize} $0 $1
  ${If} ${Errors}
    StrCpy $0 "Failed"
    Goto updateDefinedVariables7z_finish
  ${EndIf}
  StrCpy $archiveSize $0

  ; 展開後の合計サイズを取得
  File /oname=$PLUGINSDIR\7za.exe "${PROJECT_DIR}\vendored\7z\7za.exe"
  ${getUncompressedSizeFrom7z} $0 $1
  ${If} $0 == "Failed to execute 7za.exe"
  ${OrIf} $0 == "Failed to open file list"
    StrCpy $0 "Failed"
    Goto updateDefinedVariables7z_finish
  ${EndIf}
  StrCpy $installedSize $0

  StrCpy $0 "OK"

  updateDefinedVariables7z_finish:
                  ; Stack $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
!macroend

; ${downloadIniFile} Result FilePath
; ファイルのハッシュ値情報などがある ini ファイルをダウンロードする
; @param FilePath iniファイルの保存先
; @return Result inetc::get の戻り値
!define downloadIniFile "!insertmacro downloadIniFile"
!macro downloadIniFile Result FilePath
  Push "${FilePath}" ; Stack <FilePath>
  Exch $0            ;       $0
  Push $1            ;       $1 $0

  inetc::get /CONNECTTIMEOUT ${CONNECTTIMEOUT} /RECEIVETIMEOUT ${RECEIVETIMEOUT} /POPUP "" /CAPTION "$(^Name) 安装程序" /RESUME "附加文件下载失败。$\r$\n是否重试？" "${DOWNLOAD_BASE_URL}/$archiveName.ini" "$0" /END
  Pop $0

                  ; Stack $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
!macroend

; ${verifyPartedFile} Result Index FilePath
; 分割ファイルのうちの1つを検証する
; @param Index 7z.N の N
; @param FilePath ファイルへのパス
; @return Result "OK"、"No entry"、"Failed to get file size"、"Filesize mismatch"、"Hash mismatch" のどれか
!define verifyPartedFile "!insertmacro verifyPartedFile"
!macro verifyPartedFile Result Index FilePath
  !define UniqueID ${__LINE__}
  Push "${FilePath}" ; Stack <FilePath>
  Push "${Index}"    ;       <Index> <FilePath>
  Exch $0            ;       $0 <FilePath>
  Exch               ;       <FilePath> $0
  Exch $1            ;       $1 $0
  Push $2            ;       $2 $1 $0
  Push $3            ;       $3 $2 $1 $0

  ; ini ファイルからファイルサイズを取得
  ReadINIStr $2 "$iniFileName" "files" "size$0"
  ${If} ${Errors}
    StrCpy $0 "No entry"
    Goto verifyPartedFile_finish${UniqueID}
  ${EndIf}
  ; ファイルサイズを検証
  ${getFileSize} $3 $1
  ${If} ${Errors}
    StrCpy $0 "Failed to get file size"
    Goto verifyPartedFile_finish${UniqueID}
  ${EndIf}
  ${If} $3 != $2
    StrCpy $0 "Filesize mismatch"
    Goto verifyPartedFile_finish${UniqueID}
  ${EndIf}

  ; ini ファイルから正しいハッシュ値を取得
  ReadINIStr $2 "$iniFileName" "files" "hash$0"
  ${If} ${Errors}
    StrCpy $0 "No entry"
    Goto verifyPartedFile_finish${UniqueID}
  ${EndIf}
  ; ハッシュ値を検証
  ${verifyFile} $3 $1 "MD5-128" $2
  ${If} $3 != "OK"
    StrCpy $0 "Hash mismatch"
    Goto verifyPartedFile_finish${UniqueID}
  ${EndIf}

  StrCpy $0 "OK"

verifyPartedFile_finish${UniqueID}:
                  ; Stack $3 $2 $1 $0
  Pop $3          ;       $2 $1 $0
  Pop $2          ;       $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
  !undef UniqueID
!macroend

; ${downloadFile} Result ResultFilePath Index
; 分割されたファイルを1つダウンロードする
; @param Index 7z.N の N
; @return Result inetc::get の戻り値, "Hash mismatch", "No entry", "Failed to rename", "Failed to get file size" のどれか
; @return ResultFilePath ダウンロードしたファイルへのフルパス
!define downloadFile "!insertmacro downloadFile"
!macro downloadFile Result ResultFilePath Index
  Push "${Index}" ; Stack <Index>
  Exch $0         ;       $0
  Push $1         ;       $1 $0
  Push $2         ;       $2 $1 $0
  Push $3         ;       $3 $2 $1 $0
  Push $4         ;       $4 $3 $2 $1 $0

  StrCpy $1 "$EXEDIR\$archiveName.$0" ; 保存先
  StrCpy $2 $0 ; 7z.N の N
  IntOp $3 $0 + 1 ; 画面表示で使用するインデックス番号
  StrCpy $4 "$1.partial" ; 一時保存先

  ${If} ${FileExists} "$1"
    ; ダウンロード対象ファイルが既にある場合は検証済みなのでそのまま終わる
    StrCpy $0 "OK"
    Goto downloadFile_finish
  ${EndIf}

  inetc::get /CONNECTTIMEOUT ${CONNECTTIMEOUT} /RECEIVETIMEOUT ${RECEIVETIMEOUT} /POPUP "" /CAPTION "$(^Name) 安装程序 ($3/$numFiles)" /RESUME "ファイルのダウンロード中に错误が発生しました。$\r$\n是否重试？" "${DOWNLOAD_BASE_URL}/$archiveName.$2" "$4" /END
  Pop $0

  ; プロキシーなしでリトライする処理は合理的な理由が見つからないのでひとまずやめる
  ; プロキシーを設定している環境は必要があってやっているはずなので無断で外してもいい結果を生むとは考えにくいし、これによって問題が起こっていたユーザーが改善したという報告も見当たらない
  ; https://github.com/electron-userland/electron-builder/issues/2049
  ; ${If} $0 != "OK"
  ; ${AndIf} $0 != "Cancelled"
  ;   inetc::get /CONNECTTIMEOUT ${CONNECTTIMEOUT} /RECEIVETIMEOUT ${RECEIVETIMEOUT} /NOPROXY /POPUP "" /CAPTION "$(^Name) 安装程序 ($3/$numFiles)" /RESUME "ファイルのダウンロード中に错误が発生しました。$\r$\n是否重试？" "${DOWNLOAD_BASE_URL}/$archiveName.$2" "$4" /END
  ;   Pop $0
  ; ${EndIf}

  ; ファイルのダウンロードが成功していたら
  ${If} $0 == "OK"

    ; ファイルを検証する
    downloadFile_verify:
    Banner::show /set 76 "$(^Name) 安装程序" "正在验证文件... ($3/$numFiles)"
    ${verifyPartedFile} $0 $2 $4
    Banner::destroy
    ${If} $0 == "OK"
      ; 成功したので最終的なファイル名へリネーム
      downloadFile_rename:
      Delete "$1"
      Rename "$4" "$1"
      ${If} ${Errors}
        MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "项目保存$\r$\n如果打开了其他应用程序，请关闭后再试。$\r$\n是否重试？" IDRETRY downloadFile_rename
        StrCpy $0 "Failed to rename"
      ${EndIf}
    ${ElseIf} $0 == "Filesize mismatch"
    ${OrIf} $0 == "Hash mismatch"
      ; ハッシュ値が一致しなかった
      ; よくわからないファイルなので削除する
      Delete "$4"
      StrCpy $0 "Hash mismatch"
    ${ElseIf} $0 == "No entry"
      ; ini ファイルに該当ファイルを検証するためのデータが存在しなかった
      ; 通常の流れでは発生しない
      Delete "$4"
      StrCpy $0 "No entry"
    ${ElseIf} $0 == "Failed to get file size"
      ; 検証に必要なファイルサイズの取得に失敗した
      ; ダウンロードファイルを他のソフトなどで開いているかもしれない
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "获取文件大小失败。$\r$\n如果打开了其他应用程序，请关闭后再试。$\r$\n是否重试？" IDRETRY downloadFile_verify
      StrCpy $0 "Failed to get file size"
    ${Else}
      ; スクリプトの記述ミスの可能性が高いので错误を通知して終わる
      MessageBox MB_OK|MB_ICONSTOP "发生意外错误，安装程序中止。$\r$\n$\r$\n错误: $0"
      ${myQuit}
    ${EndIf}

  ${EndIf}

  downloadFile_finish:

                          ; Stack $4 $3 $2 $1 $0
  Pop $4                  ;       $3 $2 $1 $0
  Pop $3                  ;       $2 $1 $0
  Pop $2                  ;       $1 $0
  Exch $1                 ;       <ResultFilePath> $0
  Exch                    ;       $0 <ResultFilePath>
  Exch $0                 ;       <Result> <ResultFilePath>
  Pop "${Result}"         ;       <ResultFilePath>
  Pop "${ResultFilePath}" ;       -empty-
!macroend

; ${verifyArchive} Result
; 7z ファイルが正しいハッシュ値を持っているか調べる
; @return Result "OK"、"File not found"、"Hash mismatch" のどれか
!define verifyArchive "!insertmacro verifyArchive"
!macro verifyArchive Result
  Push $0 ; Stack $0
  Push $1 ;       $1 $0

  StrCpy $0 "$EXEDIR\$archiveName"
  ${IfNot} ${FileExists} $0
    StrCpy $0 "File not found"
  ${Else}
    Banner::show /set 76 "$(^Name) 安装程序" "正在验证文件..."
    ${verifyFile} $0 $0 "SHA2-512" $archiveHash
    Banner::destroy
    ${If} $0 == "OK"
      StrCpy $0 "OK"
    ${Else}
      StrCpy $0 "Hash mismatch"
    ${EndIf}
  ${EndIf}

                  ; Stack $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
!macroend

; ${calcDownloadSize} ResultSize
; ダウンロードが必要な分割ファイルの総容量を計算する
; @return Result "OK", "No entry", "Failed to get file size" のどれか
; @return ResultSize バイト単位の容量
!define calcDownloadSize "!insertmacro calcDownloadSize"
!macro calcDownloadSize Result ResultSize
  Push $0 ; Stack $0
  Push $1 ;       $1 $0
  Push $2 ;       $2 $1 $0
  Push $3 ;       $3 $2 $1 $0
  Push $4 ;       $4 $3 $2 $1 $0

  Banner::show /set 76 "$(^Name) 安装程序" ""

  StrCpy $3 "$EXEDIR\$archiveName"
  IntOp $2 $numFiles - 1
  StrCpy $4 "0"
  ${ForEach} $1 0 $2 + 1
    ; 分割ファイルがあるなら
    ${If} ${FileExists} "$3.$1"
      ; バナーのテキストを更新
      IntOp $0 $1 + 1
      ${updateBannerText} "正在验证文件... ($0/$numFiles)"

      ; ファイルを検証する
      calcDownloadSize_verify:
      ${verifyPartedFile} $0 $1 "$3.$1"
      ${If} $0 == "OK"
        ; 正しいファイルだった
        ${Continue}
      ${ElseIf} $0 == "Filesize mismatch"
      ${OrIf} $0 == "Hash mismatch"
        ; おかしいので削除しておく
        Delete "$3.$1"
      ${ElseIf} $0 == "No entry"
        ; ini ファイル内に必要な情報が見つからなかった
        StrCpy $0 "No entry"
        Goto calcDownloadSize_finish
      ${ElseIf} $0 == "Failed to get file size"
        ; ファイルサイズの取得に失敗した
        ; 別のソフトからのアクセスでブロックされている？
        MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "获取文件大小失败。$\r$\n如果打开了其他应用程序，请关闭后再试。$\r$\n是否重试？" IDRETRY calcDownloadSize_verify
        StrCpy $0 "Failed to get file size"
        Goto calcDownloadSize_finish
      ${Else}
        ; スクリプトの記述ミスの可能性が高いので错误を通知して終わる
        MessageBox MB_OK|MB_ICONSTOP "发生意外错误，安装程序中止。$\r$\n$\r$\n错误: $0"
        ${myQuit}
      ${EndIf}
    ${EndIf}

    ; ダウンロードが必要なファイルだったので、ini ファイルからファイルサイズを取得
    ReadINIStr $0 "$iniFileName" "files" "size$1"
    ${If} ${Errors}
      StrCpy $0 "No entry"
      Goto calcDownloadSize_finish
    ${EndIf}

    System::Int64Op $4 + $0
    Pop $4
  ${Next}

  StrCpy $0 "OK"
  StrCpy $1 $4

  calcDownloadSize_finish:
  Banner::destroy

                      ; Stack $4 $3 $2 $1 $0
  Pop $4              ;       $3 $2 $1 $0
  Pop $3              ;       $2 $1 $0
  Pop $2              ;       $1 $0
  Exch $1             ;       <ResultSize> $0
  Exch                ;       $0 <ResultSize>
  Exch $0             ;       <Result> <ResultSize>
  Pop "${Result}"     ;       <ResultSize>
  Pop "${ResultSize}" ;       -empty-
!macroend

; ${concatenateAndVerify} Result
; 分割されたファイルを連結し、正しいハッシュ値になるか検証する
; ある程度時間がかかるため処理のため進行中は Banner を表示する
; 成功しなかった場合はファイルは削除される
; @return Result "OK"、"Failed to concatenate file"、"Failed to rename"、"Hash mismatch" のどれか
!define concatenateAndVerify "!insertmacro concatenateAndVerify"
!macro concatenateAndVerify Result
  Push $0 ; Stack $0
  Push $1 ;       $1 $0
  Push $2 ;       $2 $1 $0
  Push $3 ;       $3 $2 $1 $0

  Banner::show /set 76 "$(^Name) 安装程序" "正在准备安装..."

  ${getArchiveNameAndHash} $1 $3
  StrCpy $1 "$EXEDIR\$1"
  StrCpy $2 "$1.partial"

  ; 連結ファイルを作成する
  ${concatenateFile} $0 $2 $1 $numFiles
  ${If} $0 != "OK"
    StrCpy $0 "Failed to concatenate file"
    Goto concatenateAndVerify_finish
  ${EndIf}

  ; 長く待たせてしまっているので「そろそろ終わり」感を煽っていく
  ${updateBannerText} "正在进行最终文件检查..."

  ; できあがったファイルが正しいか検証する
  ${verifyFile} $0 $2 "SHA2-512" $3
  ${If} $0 == "OK"
    ; 問題なかったのでファイル名を最終的なものに変える
    Delete "$1"
    ClearErrors
    Rename "$2" "$1"
    ${If} ${Errors}
      Delete "$2"
      StrCpy $0 "Failed to rename"
      Goto concatenateAndVerify_finish
    ${EndIf}

    ; 分割ファイルを片付ける
    IntOp $2 $numFiles - 1
    ${ForEach} $0 0 $2 + 1
      Delete "$1.$0"
    ${Next}
    StrCpy $0 "OK"
    Goto concatenateAndVerify_finish
  ${ElseIf} $0 == "Failed"
    ; ハッシュ値が一致しなかった
    ; 何かがおかしいファイルなので削除する
    Delete "$2"
    StrCpy $0 "Hash mismatch"
    Goto concatenateAndVerify_finish
  ${EndIf}

  concatenateAndVerify_finish:
  Banner::destroy

                  ; Stack $3 $2 $1 $0
  Pop $3          ;       $2 $1 $0
  Pop $2          ;       $1 $0
  Pop $1          ;       $0
  Exch $0         ;       <Result>
  Pop "${Result}" ;       -empty-
!macroend

; 一番最初に実行される場所
!macro customInit
  ; nsis-web インストーラーが持つ本来のダウンロード処理は、分割されていないファイルをダウンロードするもの
  ; それが動作してしまうと、存在しないファイルを探しに行ってしまい上手くインストールができなくなる
  ; しかし exe と同じ場所に正しいハッシュ値を持つファイルを配置しておけばダウンロード処理は省略できる
  ; それに必要なファイル名とハッシュ値を取得しておく
  ${getArchiveNameAndHash} $archiveName $archiveHash

  ; 自身はインストール中に昇格するために起動された別のプロセスか？
  ${If} ${UAC_IsInnerInstance}
    ; 全ユーザーに向けてインストールしようとしたことによって実行中の昇格が必要になるはずなので、
    ; その時点で正しいアーカイブを持っており、長時間掛かるアーカイブ検証を再度行う必要はないはず
    ; なお、ユーザーが直接インストーラーを管理者権限で実行してもここには来ない
    StrCpy $0 "OK"
  ${Else}
    ; 正しいハッシュ値を持った 7z ファイルがあるか検証する
    ${verifyArchive} $0
  ${EndIf}
  ${If} $0 == "OK"

    StrCpy $additionalProcess "None"

  ${ElseIf} $0 == "File not found"
  ${OrIf} $0 == "Hash mismatch"

    ; ファイルの分割数やハッシュ値などが記述された ini ファイルをまずダウンロードする
    StrCpy $iniFileName "$PLUGINSDIR\files.ini"
    ${downloadIniFile} $0 $iniFileName
    ${If} $0 == "Cancelled"
      ${myQuitSuccess}
    ${ElseIf} $0 == "File Not Found (404)"
      ; すぐに再試行しても望みが薄いので失敗したことを伝えつつ終わる
      MessageBox MB_OK|MB_ICONSTOP "未能获取安装所需的文件列表。$\r$\n请稍后重试$\r$\n$\r$\n错误: $0"
      ${myQuit}
    ${ElseIf} $0 != "OK"
      ; https://nsis.sourceforge.io/Inetc_plug-in
      ; Inetc のソースコードを読むと ST_OK, ST_CANCELLED, ERR_NOTFOUND 以外の場合は Inetc プラグイン側で再試行を問い合わせる仕組みになっている
      ; 再試行を諦めた結果ここにたどり着いており、ここで改めて問い合わせるとダイアログが重複してしまうためそのまま終了する
      ${myQuit}
    ${EndIf}

    ; ダウンロードした ini ファイルの内容を元に変数を更新
    ${updateDefinedVariablesINI} $0
    ${If} $0 == "Broken"
      MessageBox MB_OK|MB_ICONSTOP "准备安装程序时发生错误。$\r$\n请稍后重试"
      ${myQuit}
    ${ElseIf} $0 != "OK"
      ; 知らない戻り値を返してきた
      MessageBox MB_OK|MB_ICONSTOP "发生意外错误，安装程序中止。$\r$\n$\r$\n错误: $0"
      ${myQuit}
    ${EndIf}

    ; ダウンロードが必要な総容量を計算する
    ${calcDownloadSize} $0 $1
    ${If} $0 == "OK"
      ; 総容量が 0 ならダウンロードは必要ない
      StrCpy $downloadSize $1
      ${If} $downloadSize == "0"
        StrCpy $additionalProcess "Concatenate"
      ${Else}
        StrCpy $additionalProcess "DownloadAndConcatenate"
      ${EndIf}
    ${ElseIf} $0 == "No entry"
      ; ini ファイルから必要な情報が見つけられなかった
      ; ウィルス対策ソフトや掃除系ソフトによって一時フォルダ内のファイルを削除されると起こるかもしれない
      MessageBox MB_OK|MB_ICONSTOP "未找到文件验证所需数据，已中止处理。$\r$\n请稍后重试"
      ${myQuit}
    ${ElseIf} $0 == "Failed to get file size"
      ; リトライを諦めてここまできたのでそのまま終わる
      ${myQuit}
    ${EndIf}
  ${EndIf}

!macroend

; https://github.com/electron-userland/electron-builder/blob/1beda214d255211b36019e8d2febcd0868aae5f4/packages/app-builder-lib/templates/nsis/assistedInstaller.nsh#L9
!macro customWelcomePage

!define MUI_PAGE_CUSTOMFUNCTION_PRE welcomePagePre
!define MUI_PAGE_CUSTOMFUNCTION_SHOW welcomePageShow
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE welcomePageLeave
!insertmacro MUI_PAGE_WELCOME

Function welcomePagePre
  ${If} ${UAC_IsInnerInstance}
  ${AndIf} $additionalProcess == "None"
    ; 昇格後は Welcome ページは必要ないので省略したいが、
    ; 常に Abort してしまうと [戻る] ボタンを押したときに戻れなくなりインストーラー自体が終了してしまう
    ; これはユーザビリティ的に問題があるので回避したいが戻るボタンの非表示化や無効化は上手く行かなかったので、
    ; 苦肉の策として起動直後だけスキップし、戻った際は普通に表示できるようにする
    ${If} $skippedWelcomePage != "1"
      StrCpy $skippedWelcomePage "1"
      Abort
    ${EndIf}
  ${EndIf}
FunctionEnd

Function welcomePageShow
  StrCpy $2 "此向导将安装 $(^Name) ${VERSION} 在您的计算机上。"

  ${If} $additionalProcess == "None"

    ; ダウンロードも結合も必要ない

  ${ElseIf} $additionalProcess == "DownloadAndConcatenate"

    ; ダウンロードを行うのでその旨を表示する
    ${bytesToHumanReadable} $0 $downloadSize
    StrCpy $2 "$2$\r$\n$\r$\n需要总计 $0 将下载额外的文件。"

    ; ダウンロードと結合に必要な空き容量
    System::Int64Op $archiveSize + $downloadSize
    Pop $0

  ${ElseIf} $additionalProcess == "Concatenate"

    ; 結合に必要な空き容量
    StrCpy $0 $archiveSize

  ${EndIf}

  ${getDiskSpace} $1 "$EXEDIR"
  ${If} $1 L< $0
    ; 空き容量が足りないので画面に表示する
    ${bytesToHumanReadable} $0 $0
    ${bytesToHumanReadable} $1 $1
    ${GetRoot} "$EXEDIR" $3
    StrCpy $3 $3 1 ; "C:" から "C" だけを取り出す
    StrCpy $2 "$2$\r$\n安装程序所在的磁盘需要有 $0 以上的空闲空间。$\r$\n（现在磁盘$3可用空间为： $1）"
  ${EndIf}

  StrCpy $2 "$2$\r$\n$\r$\n要继续，请点击 [下一步]。"

  ; テキストを更新
  SendMessage $mui.WelcomePage.Text ${WM_SETTEXT} 0 "STR:$2"

FunctionEnd

Function welcomePageLeave
  welcomePageLeave_checkFreeSpace:
  ${If} $additionalProcess == "None"
    Return
  ${ElseIf} $additionalProcess == "DownloadAndConcatenate"
    ; ダウンロードと結合に必要な空き容量
    System::Int64Op $archiveSize * 2
    Pop $0
  ${ElseIf} $additionalProcess == "Concatenate"
    ; 結合に必要な空き容量
    StrCpy $0 $archiveSize
  ${EndIf}

  ${getDiskSpace} $1 "$EXEDIR"
  ${If} $1 L< $0
    ${bytesToHumanReadable} $0 $0
    ${bytesToHumanReadable} $1 $1
    ${GetRoot} "$EXEDIR" $2
    StrCpy $2 $2 1 ; "C:" から "C" だけを取り出す
    MessageBox MB_ABORTRETRYIGNORE|MB_ICONEXCLAMATION "可用空间不足$\r$\n要开始下载文件，需要$2磁盘上至少有 $0 的空闲空间。$\r$\n$\r$\n所需容量： $0$\r$\n磁盘$2上的可用空间：$1" IDRETRY welcomePageLeave_checkFreeSpace IDIGNORE welcomePageLeave_download
    Abort
  ${EndIf}

  welcomePageLeave_download:
  ShowWindow $HWNDPARENT ${SW_HIDE}

  ${If} $additionalProcess == "DownloadAndConcatenate"
    IntOp $3 $numFiles - 1
    ${ForEach} $2 0 $3 + 1
      ${downloadFile} $0 $1 $2
      ${If} $0 == "Cancelled"
        ${myQuitSuccess}
      ${ElseIf} $0 == "File Not Found (404)"
        ; すぐに再試行しても望みが薄いので失敗したことを伝えつつ終わる
        MessageBox MB_OK|MB_ICONSTOP "下载文件失败$\r$\n请稍后重试$\r$\n$\r$\n错误: $0"
        ${myQuit}
      ${ElseIf} $0 == "Hash mismatch"
        MessageBox MB_OK|MB_ICONSTOP "下载的文件不正确。$\r$\n请尝试重新下载安装程序。"
        ${myQuit}
      ${ElseIf} $0 == "Failed to rename"
      ${OrIf} $0 == "Failed to get file size"
        ; リトライを諦めてここまできたのでそのまま終わる
        ${myQuit}
      ${ElseIf} $0 == "No entry"
        ; ini ファイルから必要な情報が見つけられなかった
        ; ウィルス対策ソフトや掃除系ソフトによって一時フォルダ内のファイルを削除されると起こるかもしれない
        MessageBox MB_OK|MB_ICONSTOP "未找到文件验证所需数据，已中止处理。$\r$\n请稍后重试"
        ${myQuit}
      ${ElseIf} $0 != "OK"
        ; https://nsis.sourceforge.io/Inetc_plug-in
        ; Inetc のソースコードを読むと ST_OK, ST_CANCELLED, ERR_NOTFOUND 以外の場合は Inetc プラグイン側で再試行を問い合わせる仕組みになっている
        ; 再試行を諦めた結果ここにたどり着いており、ここで改めて問い合わせるとダイアログが重複してしまうためそのまま終了する
        ${myQuit}
      ${EndIf}
    ${Next}
  ${EndIf}

  welcomePageLeave_concatenate:
  ${concatenateAndVerify} $0
  ${If} $0 == "OK"
    ; 全てに成功
  ${ElseIf} $0 == "Failed to concatenate file"
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "无法创建文件，安装程序无法继续。$\r$\n如果打开了其他应用程序，请关闭后再试。$\r$\n是否重试？" IDRETRY welcomePageLeave_concatenate
    ${myQuit}
  ${ElseIf} $0 == "Failed to rename"
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "无法重命名文件，安装程序无法继续。$\r$\n如果打开了其他应用程序，请关闭后再试。$\r$\n是否重试？" IDRETRY welcomePageLeave_concatenate
    ${myQuit}
  ${ElseIf} $0 == "Hash mismatch"
    ; 結合する前のハッシュチェックは通ったのに統合後におかしくなった
    ; ビルド時に作成された分割ファイルではないものを受信した場合に発生するため、提供側の問題の可能性が高い
    MessageBox MB_OK|MB_ICONSTOP "检测到文件异常，安装程序已中断。$\r$\n请尝试重新下载安装程序。"
    ${myQuit}
  ${Else}
    ; 知らない戻り値を返してきた
    MessageBox MB_OK|MB_ICONSTOP "发生意外错误，安装程序中止。$\r$\n$\r$\n错误: $0"
    ${myQuit}
  ${EndIf}

  ; 戻るボタンを押して戻った場合にダウンロードや結合を再実行しないように変えておく
  StrCpy $additionalProcess "None"

  ShowWindow $HWNDPARENT ${SW_SHOW}
FunctionEnd

!macroend

!macro customPageAfterChangeDir

; https://github.com/electron-userland/electron-builder/blob/1beda214d255211b36019e8d2febcd0868aae5f4/packages/app-builder-lib/templates/nsis/assistedInstaller.nsh#L32
; 空き容量を計算をすべきタイミングはインストール先が確定する pageDirectory の leave のはずだが、
; そこだと正しい値を取得できないらしく、electron-builder にはフックする方法が存在しない
; instFiles pre ならフックのフックをすることで処理自体は注入可能だが、
; このタイミングだと「本当に続行しますか？」をキャンセルした場合に現在のページに留まる方法が存在せず、
; インストール処理全体をスキップするか、インストーラーを強制終了するしかなくなる
; それはユーザビリティ的にあまりに不親切になるので、ページを追加することで妥協する
Page custom readyPageShow readyPageLeave

Function readyPageShow
  ${If} $installedSize == ""
    ; 7z ファイルから必要な空き容量などを計算する
    ; すべてがコピーされる前提で計算するので実態とは少し乖離があるかもしれない
    ShowWindow $HWNDPARENT ${SW_HIDE}
    Banner::show /set 76 "$(^Name) 安装程序" "正在检查安装大小..."
    ${updateDefinedVariables7z} $0
    Banner::destroy
    ShowWindow $HWNDPARENT ${SW_SHOW}
  ${Else}
    ; 既に取得済みだった
    StrCpy $0 "OK"
  ${EndIf}
  ${If} $0 == "OK"
    ; すべてに成功
  ${ElseIf} $0 == "Failed"
    ; 致命的ではないのでデフォルトフォーカスは OK
    ; 10GB 以上空いてるなら聞かなくてもいいかも？
    MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "计算安装所需可用空间失败。$\r$\n如果安装目标位置有足够的可用空间，您可以继续。$\r$\n是否继续安装？" IDOK readyPageShow_ignore
    ${myQuit}
    readyPageShow_ignore:
    StrCpy $installedSize "0"
  ${Else}
    ; 知らない戻り値を返してきた
    MessageBox MB_OK|MB_ICONSTOP "发生意外错误，安装程序中止。$\r$\n$\r$\n错误: $0"
    ${myQuit}
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "开始安装" "安装准备就绪。"
  nsDialogs::Create /NOUNLOAD 1018
  Pop $0
  ${If} $0 == "error"
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 12u "按下“安装”将会启动  $(^Name) ${VERSION}  安装程序"
  Pop $0

  StrCpy $0 $installedSize
  ${getDiskSpace} $1 "$INSTDIR"
  ${If} $1 L< $0
    ; 空き容量が不足しているときだけその旨を表示
    ${bytesToHumanReadable} $0 $0
    ${bytesToHumanReadable} $1 $1
    ${GetRoot} "$INSTDIR" $2
    StrCpy $2 $2 1 ; "C:" から "C" だけを取り出す
    ${NSD_CreateLabel} 0 24u 100% 24u "安装需要 $0 以上的空闲空间。$\r$\n（当前磁盘$2上的可用空间：$1）"
    Pop $0
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function readyPageLeave
  readyPageLeave_checkDiskSpace:
  ; 空き容量チェック
  StrCpy $0 $installedSize
  ${getDiskSpace} $1 "$INSTDIR"
  ${If} $1 L< $0
    ${bytesToHumanReadable} $0 $0
    ${bytesToHumanReadable} $1 $1
    ${GetRoot} "$INSTDIR" $2
    StrCpy $2 $2 1 ; "C:" から "C" だけを取り出す
    MessageBox MB_ABORTRETRYIGNORE|MB_ICONEXCLAMATION "可用空间不足$\r$\n要安装$(^Name) $2到磁盘$0 的临时空间$\r$\n$\r$\n所需容量： $0$\r$\n磁盘$2上的可用空间：$1" IDRETRY readyPageLeave_checkDiskSpace IDIGNORE readyPageLeave_finish
    Abort
  ${EndIf}
  readyPageLeave_finish:
FunctionEnd

; README を表示するためのオプションを流用して、
; 安装程序完了画面にファイル削除のチェックボックスを追加する
Function deleteArchive
  Delete "$EXEDIR\$archiveName"
FunctionEnd
!define MUI_FINISHPAGE_SHOWREADME
!define MUI_FINISHPAGE_SHOWREADME_TEXT "删除已使用过的下载文件"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION deleteArchive

!macroend

!macro customHeader
  ; インストール成功後に%LOCALAPPDATA%\voicevox-updater\を削除する
  Function .onInstSuccess
    ; https://github.com/electron-userland/electron-builder/blob/f717e0ea67cec7c5c298889efee7df724838491a/packages/app-builder-lib/templates/nsis/include/installer.nsh#L77
    ${if} $installMode == "all"
      SetShellVarContext current
    ${endif}
    Push $R0
    ${GetParent} "$LOCALAPPDATA\${APP_PACKAGE_STORE_FILE}" $R0
    RMDir /r "$R0"
    Pop $R0
    ${if} $installMode == "all"
      SetShellVarContext all
    ${endif}
  FunctionEnd
!macroend

; "%VITE_APP_NAME%"が空の状態でビルドすると他のソフトのファイルを消してしまうためビルド错误にする。
!define DOLLAR "$"
!if "$%VITE_APP_NAME%" == "${DOLLAR}%VITE_APP_NAME%"
  !error 'The environment variable "%VITE_APP_NAME%" is undefined.'
!endif
!if "$%VITE_APP_NAME%" == ""
  !error 'The environment variable "%VITE_APP_NAME%" is empty.'
!endif

!macro locateVvppTmp callbacks
  ${Locate} "$APPDATA\$%VITE_APP_NAME%\vvpp-engines\.tmp" "/L=D /M=????????????? /G=0" ${callbacks}
!macroend

!macro locateVvppEngines callbacks
  ${Locate} "$APPDATA\$%VITE_APP_NAME%\vvpp-engines" "/L=D /M=*+????????-????-????-????-???????????? /G=0" ${callbacks}
!macroend

!macro customUninstallPage
  ; エンジンディレクトリが存在する場合は、消去するかのチェックボックスを案内する
  ; 存在しない場合はそのまま終了する
  UninstPage custom un.removeUserDataPage un.removeUserDataPageLeave

  Function un.removeUserDataPage
    Push $0

    Var /GLOBAL isExistEngine
    StrCpy $isExistEngine "0"

    ${If} $installMode == "all"
      SetShellVarContext current
    ${EndIf}

    Push $R0

    StrCpy $R0 "0"
    !insertmacro locateVvppTmp un.isExistVvppTmp
    ${If} $R0 == "1"
      StrCpy $isExistEngine "1"
    ${Else}
      RMDir "$APPDATA\$%VITE_APP_NAME%\vvpp-engines\.tmp"
    ${EndIf}
    ClearErrors

    ${If} $isExistEngine == "0"
      StrCpy $R0 "0"
      !insertmacro locateVvppEngines un.isExistVvppEngines
      ${If} $R0 == "1"
        StrCpy $isExistEngine "1"
      ${Else}
        RMDir "$APPDATA\$%VITE_APP_NAME%\vvpp-engines"
      ${EndIf}
      ClearErrors
    ${EndIf}

    Pop $R0

    ${If} $installMode == "all"
      SetShellVarContext all
    ${EndIf}

    ${If} $isExistEngine == "0"
      Pop $0
      Abort
    ${EndIf}

    nsDialogs::Create 1018
    Pop $0

    ${If} $0 == "error"
      Pop $0
      Abort
    ${EndIf}

    ; 既にアンインストールは完了してしまっているためキャンセルボタンは無効化する
    GetDlgItem $0 $HWNDPARENT 2
    EnableWindow $0 0

    ${NSD_CreateCheckBox} 0 0 100% 12u "删除附加引擎"
    Var /GLOBAL removeAdditionalEngineCheckBox
    Pop $removeAdditionalEngineCheckBox

    nsDialogs::Show

    Pop $0
  FunctionEnd

  Function un.removeUserDataPageLeave
    Push $0
    ; 削除の処理
    ${NSD_GetState} $removeAdditionalEngineCheckBox $0

    ${If} $0 == ${BST_CHECKED}
      ${If} $installMode == "all"
        SetShellVarContext current
      ${EndIf}

      !insertmacro locateVvppTmp  un.removeVvppTmp
      RMDir "$APPDATA\$%VITE_APP_NAME%\vvpp-engines\.tmp"
      !insertmacro locateVvppEngines un.removeVvppEngines
      RMDir "$APPDATA\$%VITE_APP_NAME%\vvpp-engines"
      ; 未知のファイルが残っている場合削除されずに错误フラグが立つのでクリアする
      ClearErrors

      ${If} $installMode == "all"
        SetShellVarContext all
      ${EndIf}
    ${EndIf}
    Pop $0
  FunctionEnd

  Function un.isExistVvppTmp
    ; 実行された場合は"$R0"に"1"を代入する。
    StrCpy $R0 "1"
    Push "StopLocate"
  FunctionEnd

  Function un.removeVvppTmp
    RMDir /r "$R9"
    Push ""
  FunctionEnd

  Function un.isExistVvppEngines
    ; "engine_manifest.json"がある場合"$R0"に"1"を代入する。
    ${If} ${FileExists} "$R9\engine_manifest.json"
      StrCpy $R0 "1"
      Push "StopLocate"
    ${Else}
      Push ""
    ${EndIf}
  FunctionEnd

  Function un.removeVvppEngines
    ; "engine_manifest.json"があるか確認してから削除する。
    ${If} ${FileExists} "$R9\engine_manifest.json"
      RMDir /r "$R9"
      ClearErrors
    ${EndIf}
    Push ""
  FunctionEnd

  ; MUI_UNPAGE_FINISHの戻るボタンを無効化する
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW un.disableBack

  Function un.disableBack
    Push $0
    GetDlgItem $0 $HWNDPARENT 3
    EnableWindow $0 0
    Pop $0
  FunctionEnd
!macroend
