/**
 * デフォルトエンジンの最新情報関連のモジュール
 */

import { z } from "zod";

/** Runtime Target */
export const runtimeTargetSchema = z.string().regex(/^[^-]+-[^-]+-[^-]+$/);
export type RuntimeTarget = z.infer<typeof runtimeTargetSchema>;

/** パッケージ情報のスキーマ */
const packageInfoSchema = z.object({
  version: z.string(),
  displayInfo: z.object({
    label: z.string(),
    hint: z.string(),
    order: z.number(),
    default: z.boolean().optional(),
  }),
  files: z
    .object({
      url: z.string(),
      name: z.string(),
      size: z.number(),
      hash: z.string().optional(),
    })
    .array(),
});
export type PackageInfo = z.infer<typeof packageInfoSchema>;

/** デフォルトエンジンの最新情報のスキーマ */
const latestDefaultEngineInfoSchema = z.object({
  formatVersion: z.number(),
  packages: z.record(runtimeTargetSchema, packageInfoSchema),
});

/** デフォルトエンジンの最新情報を取得する */
export const fetchLatestDefaultEngineInfo = async (url: string) => {
  const response = await fetch(url);
  return latestDefaultEngineInfoSchema.parse(await response.json());
};

<<<<<<< HEAD
/**
 * 実行環境に合うパッケージを取得する。GPU版があってもCPU版を返す。
 * TODO: どのデバイス版にするかはユーザーが選べるようにするべき。
 */
export const getSuitablePackageInfo = (
=======
/** 指定ターゲットのパッケージを取得する */
export const getPackageInfoByTarget = (
>>>>>>> 80af4a3d5dbe9b5e81509d1a2ce338795386f0c1
  updateInfo: z.infer<typeof latestDefaultEngineInfoSchema>,
  target: RuntimeTarget,
): PackageInfo => {
<<<<<<< HEAD
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "win32") {
    if (arch === "x64") {
      return updateInfo.windows.x64.CPU;
    }
  } else if (platform === "darwin") {
    if (arch === "x64") {
      return updateInfo.macos.x64.CPU;
    } else if (arch === "arm64") {
      return updateInfo.macos.arm64.CPU;
    }
  } else if (platform === "linux") {
    if (arch === "x64") {
      return updateInfo.linux.x64.CPU;
    }
  }

  throw new Error(`Unsupported platform: ${platform} ${arch}`);
=======
  return updateInfo.packages[target];
>>>>>>> 80af4a3d5dbe9b5e81509d1a2ce338795386f0c1
};
