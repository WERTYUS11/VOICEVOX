import { dialog, net } from "electron";

import { getConfigManager } from "./electronConfig";
import { getEngineInfoManager } from "./manager/engineInfoManager";
import { getEngineProcessManager } from "./manager/engineProcessManager";
import { getRuntimeInfoManager } from "./manager/RuntimeInfoManager";
import { getVvppManager } from "./manager/vvppManager";
import { getMainWindowManager } from "./manager/windowManager/main";
import { MultiDownloader } from "./multiDownloader";
import {
  type EngineId,
  type EngineInfo,
  engineSettingSchema,
  UrlString,
} from "@/type/preload";
import {
  type PackageInfo,
  fetchLatestDefaultEngineInfo,
} from "@/domain/defaultEngine/latestDefaultEngine";
import { loadEnvEngineInfos } from "@/domain/defaultEngine/envEngineInfo";
import type {
  EnginePackageEmbeddedInfo,
  EnginePackageCurrentInfo,
  EnginePackageLatestInfo,
} from "@/domain/enginePackage";
import type { ProgressCallback } from "@/helpers/progressHelper";
import { createLogger } from "@/helpers/log";
import { DisplayableError, errorToMessage } from "@/helpers/errorHelper";
import { isLinux, isMac, isWindows } from "@/helpers/platform";
import { assertNonNullable } from "@/type/utility";

const log = createLogger("EngineAndVvppController");

/**
 * エンジンとVVPP周りの処理の流れを制御するクラス。
 */
export class EngineAndVvppController {
  private get configManager() {
    return getConfigManager();
  }
  private get engineInfoManager() {
    return getEngineInfoManager();
  }
  private get engineProcessManager() {
    return getEngineProcessManager();
  }
  private get runtimeInfoManager() {
    return getRuntimeInfoManager();
  }
  private get vvppManager() {
    return getVvppManager();
  }

  /**
   * VVPPエンジンをインストールする。
   * 失敗した場合は例外を投げる。
   *
   * @param asDefaultVvppEngine デフォルトエンジンとしてインストールするかどうか。デフォルトエンジン上書きを防ぐ目的で実装している。
   */
  async installVvppEngine(params: {
    vvppPath: string;
    asDefaultVvppEngine: boolean;
    immediate: boolean;
    callbacks?: { onProgress?: ProgressCallback };
  }) {
    const { vvppPath, asDefaultVvppEngine, immediate, callbacks } = params;

    try {
      const extractedEngineFiles = await this.vvppManager.extract(
        vvppPath,
        callbacks,
      );

      const isDefaultEngine = this.engineInfoManager.isDefaultEngine(
        extractedEngineFiles.getManifest().uuid,
      );
      if (asDefaultVvppEngine && !isDefaultEngine) {
        throw new DisplayableError("这不是默认引擎。");
      }
      if (!asDefaultVvppEngine && isDefaultEngine) {
        throw new DisplayableError(
          "无法安装与默认引擎相同的引擎。",
        );
      }

      await this.vvppManager.install({ extractedEngineFiles, immediate });
    } catch (e) {
      throw new DisplayableError(
        `无法安装 ${vvppPath}。`,
        { cause: e },
      );
    }
  }

  /**
   * 危険性を案内してからVVPPエンジンをインストールする。
   * FIXME: こちらで案内せず、GUIでのインストール側に合流させる
   */
  async installVvppEngineWithWarning({
    vvppPath,
    asDefaultVvppEngine,
    reloadNeeded,
    reloadCallback,
  }: {
    vvppPath: string;
    asDefaultVvppEngine: boolean;
    reloadNeeded: boolean;
    reloadCallback?: () => void; // 重新加载が必要な場合のコールバック
  }) {
    const windowManager = getMainWindowManager();
    const result = windowManager.showMessageBoxSync({
      type: "warning",
      title: "确认添加引擎",
      message: `此操作可能会对电脑造成损害。如不信任引擎来源，请不要添加。`,
      buttons: ["添加", "取消"],
      noLink: true,
      cancelId: 1,
    });
    if (result == 1) {
      return;
    }

    try {
      await this.installVvppEngine({
        vvppPath,
        asDefaultVvppEngine,
        immediate: false,
      });
    } catch (e) {
      log.error(e);
      dialog.showErrorBox("安装错误", errorToMessage(e));
      return;
    }

    if (reloadNeeded) {
      void windowManager
        .showMessageBox({
          type: "info",
          title: "需要重新加载",
          message:
            "已读取 VVPP 文件。需要重新加载才能生效。要立即重新加载吗？",
          buttons: ["重新加载", "取消"],
          noLink: true,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            reloadCallback?.();
          }
        });
    }
  }

  /**
   * VVPPエンジンをアンインストールする。
   * 関数を呼んだタイミングでアンインストール処理を途中まで行い、アプリ終了時に完遂する。
   * 失敗した場合は例外を投げる。
   */
  async uninstallVvppEngine(engineId: EngineId) {
    let engineInfo: EngineInfo | undefined;
    try {
      engineInfo = this.engineInfoManager.fetchEngineInfo(engineId);
      if (!engineInfo) {
        throw new Error(
          `No such engineInfo registered: engineId == ${engineId}`,
        );
      }

      if (!this.vvppManager.canUninstall(engineInfo)) {
        throw new Error(`Cannot uninstall: engineId == ${engineId}`);
      }

      // Windows環境だとエンジンを終了してから削除する必要がある。
      // そのため、アプリの終了時に削除するようにする。
      this.vvppManager.markWillDelete(engineId);
    } catch (e) {
      throw new DisplayableError(
        `无法卸载 ${engineId}。`,
        { cause: e },
      );
    }
  }

  /**
   * ダウンロード可能なデフォルトエンジン情報を取得する。
   * online fetchは行わない。
   */
  private getDownloadableEnvEngineInfos() {
    return loadEnvEngineInfos().filter(
      (engineInfo) => engineInfo.type === "downloadVvpp",
    );
  }

  private getInstalledEngineStatus(
    engineId: EngineId,
  ): EnginePackageCurrentInfo {
    const isInstalled = this.engineInfoManager.hasEngineInfo(engineId);
    if (!isInstalled) {
      return { status: "notInstalled" };
    }

    const installedEngineInfo =
      this.engineInfoManager.fetchEngineInfo(engineId);
    return {
      status: "installed",
      installedVersion: installedEngineInfo.version,
    };
  }

  /**
   * ダウンロード式のデフォルトエンジンがインストール済みかどうかを確認する。
   */
  hasInstalledDefaultEngine(): boolean {
    return this.getDownloadableDefaultEnginePackageIds().some(
      (engineId) =>
        this.getEnginePackageCurrentInfo(engineId).status !== "notInstalled",
    );
  }

  /**
   * ダウンロード式のデフォルトエンジンが存在するかどうかを確認する。
   */
  hasDownloadableDefaultEngine(): boolean {
    const downloadableEngines = this.getDownloadableEnvEngineInfos();
    return downloadableEngines.length > 0;
  }

  /**
   * ダウンロード式のデフォルトエンジンのIDを取得する。
   */
  getDownloadableDefaultEnginePackageIds(): EngineId[] {
    return this.getDownloadableEnvEngineInfos().map(
      (envEngineInfo) => envEngineInfo.uuid,
    );
  }

  /**
   * アプリに埋め込まれたエンジンの定義情報を取得する。
   */
  getEnginePackageEmbeddedInfo(engineId: EngineId): EnginePackageEmbeddedInfo {
    const envEngineInfo = this.getDownloadableEnvEngineInfos().find(
      (info) => info.uuid === engineId,
    );
    assertNonNullable(
      envEngineInfo,
      `Engine info not found for engineId: ${engineId}`,
    );

    return {
      engineName: envEngineInfo.name,
    };
  }

  /**
   * エンジンの更新情報のURLを取得する。
   */
  getEnginePackageUpdateInfosUrl(engineId: EngineId): UrlString {
    const envEngineInfo = this.getDownloadableEnvEngineInfos().find(
      (info) => info.uuid === engineId,
    );
    assertNonNullable(
      envEngineInfo,
      `Engine info not found for engineId: ${engineId}`,
    );

    return UrlString(envEngineInfo.latestUpdateInfosUrl);
  }

  /**
   * オフラインでエンジンのインストール状況を取得する。
   */
  getEnginePackageCurrentInfo(engineId: EngineId): EnginePackageCurrentInfo {
    const envEngineInfo = this.getDownloadableEnvEngineInfos().find(
      (info) => info.uuid === engineId,
    );
    assertNonNullable(
      envEngineInfo,
      `Engine info not found for engineId: ${engineId}`,
    );

    return this.getInstalledEngineStatus(engineId);
  }

  /**
   * オンラインでエンジンの最新パッケージ情報を取得する。
   */
  async fetchEnginePackageLatestInfo(
    engineId: EngineId,
  ): Promise<EnginePackageLatestInfo> {
    const envEngineInfo = this.getDownloadableEnvEngineInfos().find(
      (info) => info.uuid === engineId,
    );
    assertNonNullable(
      envEngineInfo,
      `Engine info not found for engineId: ${engineId}`,
    );

    const latestUrl = envEngineInfo.latestUrl;

    let latestInfo: Awaited<ReturnType<typeof fetchLatestDefaultEngineInfo>>;
    try {
      latestInfo = await fetchLatestDefaultEngineInfo(
        latestUrl,
        net.fetch.bind(net),
      );
    } catch (cause) {
      throw new DisplayableError(
        "因网络错误无法获取最新引擎信息。请检查网络连接后重试。",
        { cause },
      );
    }
    if (latestInfo.formatVersion !== 1) {
      throw new DisplayableError(
        "引擎信息格式与当前版本的 VOICEVOX 不兼容。请更新 VOICEVOX。",
      );
    }

    const availableRuntimeTargets: EnginePackageLatestInfo["availableRuntimeTargets"] =
      Object.entries(latestInfo.packages)
        .map(([target, packageInfo]) => ({ target, packageInfo }))
        .filter((runtimeTargetInfo) =>
          isSupportedTarget(runtimeTargetInfo.target),
        )
        .toSorted(
          (a, b) =>
            a.packageInfo.displayInfo.order - b.packageInfo.displayInfo.order,
        );

    if (availableRuntimeTargets.length === 0) {
      throw new Error(
        `No supported runtime targets were found for ${envEngineInfo.name}`,
      );
    }

    return {
      availableRuntimeTargets,
    };
  }

  /** VVPPパッケージをダウンロードし、インストールする */
  async downloadAndInstallVvppEngine(
    downloadDir: string,
    packageInfo: PackageInfo,
    callbacks: { onProgress: ProgressCallback<"download" | "install"> },
  ) {
    if (packageInfo.files.length === 0) {
      throw new Error("No packages to download");
    }

    await using downloader = new MultiDownloader(
      downloadDir,
      packageInfo.files,
      {
        onProgress: ({ progress }) => {
          callbacks.onProgress({ type: "download", progress });
        },
      },
    );
    await downloader.download();

    // インストール
    await this.installVvppEngine({
      vvppPath: downloader.downloadedPaths[0],
      asDefaultVvppEngine: true,
      immediate: true,
      callbacks: {
        onProgress: ({ progress }) => {
          callbacks.onProgress({ type: "install", progress });
        },
      },
    });
  }

  /** 各エンジンの設定を初期化する */
  private initializeEngineSettings() {
    // TODO: デフォルトエンジンの処理をConfigManagerに移してブラウザ版と共通化する
    const engineInfos = this.engineInfoManager.fetchEngineInfos();
    const engineSettings = this.configManager.get("engineSettings");
    for (const engineInfo of engineInfos) {
      if (!engineSettings[engineInfo.uuid]) {
        // 空オブジェクトをパースさせることで、デフォルト値を取得する
        engineSettings[engineInfo.uuid] = engineSettingSchema.parse({});
      }
    }
    this.configManager.set("engineSettings", engineSettings);
  }

  // エンジンの準備と起動
  async launchEngines() {
    // AltPortInfosを再生成する。
    this.engineInfoManager.initializeAltPortInfo();

    this.initializeEngineSettings();

    const engineInfos = this.engineInfoManager.fetchEngineInfos();
    await this.engineProcessManager.runEngineAll();
    this.runtimeInfoManager.setEngineInfos(
      engineInfos,
      this.engineInfoManager.altPortInfos,
    );
    await this.runtimeInfoManager.exportFile();
  }

  /**
   * エンジンを再起動する。
   * エンジンの起動が開始したらresolve、起動が失敗したらreject。
   */
  async restartEngines(engineId: EngineId) {
    await this.engineProcessManager.restartEngine(engineId);

    // ランタイム情報の更新
    // TODO: setからexportの処理は排他処理にしたほうがより良い
    this.runtimeInfoManager.setEngineInfos(
      this.engineInfoManager.fetchEngineInfos(),
      this.engineInfoManager.altPortInfos,
    );
    await this.runtimeInfoManager.exportFile();
  }

  /**
   * エンジンの停止とエンジン終了後処理を行う。
   */
  async cleanupEngines(): Promise<void> {
    const killingProcessPromises = this.engineProcessManager.killEngineAll();
    const numLivingEngineProcess = Object.entries(
      killingProcessPromises,
    ).length;

    // 前処理が完了している場合
    if (
      numLivingEngineProcess === 0 &&
      !this.vvppManager.hasMarkedEngineDirs()
    ) {
      return;
    }

    let numEngineProcessKilled = 0;

    // 非同期的にすべてのエンジンプロセスをキル
    const waitingKilledPromises: Promise<void>[] = Object.entries(
      killingProcessPromises,
    ).map(([engineId, promise]) => {
      return promise
        .catch((error) => {
          // TODO: 各エンジンプロセスキルの失敗をUIに通知する
          log.error(
            `ENGINE ${engineId}: Error during killing process: ${error}`,
          );
          // エディタを終了するため、エラーが起きてもエンジンプロセスをキルできたとみなす
        })
        .finally(() => {
          numEngineProcessKilled++;
          log.info(
            `ENGINE ${engineId}: Process killed. ${numEngineProcessKilled} / ${numLivingEngineProcess} processes killed`,
          );
        });
    });

    // すべてのエンジンプロセスキル処理が完了するまで待機
    return Promise.all(waitingKilledPromises).then(() => {
      // エンジン終了後の処理を実行
      log.info(
        "All ENGINE process kill operations done. Running post engine kill process",
      );
      // FIXME: handleMarkedEngineDirsはエラーをthrowしている。エラーがthrowされるとアプリが終了しないので、終了するようにしたい。
      return this.vvppManager.handleMarkedEngineDirs();
    });
  }
}

/** 指定したRuntime Targetは現在のプラットフォームで動くか */
function isSupportedTarget(target: string): boolean {
  let isSupported = true;
  const os = target.split("-")[0];
  switch (os) {
    case "windows":
      isSupported &&= isWindows;
      break;
    case "macos":
      isSupported &&= isMac;
      break;
    case "linux":
      isSupported &&= isLinux;
      break;
    default:
      isSupported = false;
  }

  const arch = target.split("-")[1];
  switch (arch) {
    case "x64":
      isSupported &&= process.arch === "x64";
      break;
    case "arm64":
      isSupported &&= process.arch === "arm64";
      break;
    case "x86":
      isSupported &&= process.arch === "ia32";
      break;
    default:
      isSupported = false;
  }

  return isSupported;
}

let manager: EngineAndVvppController | undefined;

export function getEngineAndVvppController() {
  if (manager == undefined) {
    manager = new EngineAndVvppController();
  }
  return manager;
}
