/**
 * AppImageに埋め込むruntimeをダウンロードする。
 * ビルド時にappimagetoolが最新版をダウンロードをしてしまうので、
 * バージョンを固定するために手動でダウンロードする。
 */

import fs from "node:fs/promises";
import path from "node:path";
import { retryFetch } from "./helper";

const TYPE2_RUNTIME_VERSION = "continuous";

const distDir = path.join(
  import.meta.dirname,
  "..",
  "vendored",
  "type2-runtime",
);
const runtimePath = path.join(distDir, "runtime");
const versionFilePath = path.join(distDir, "version.txt");

async function isDownloaded() {
  try {
    await fs.access(runtimePath);
    await fs.access(versionFilePath);
  } catch {
    return false;
  }
  const currentVersion = await fs.readFile(versionFilePath, "utf-8");
  if (currentVersion !== TYPE2_RUNTIME_VERSION) {
    await fs.rm(distDir, { recursive: true });
    return false;
  }
  return true;
}

function getDownloadURL() {
  const arch: Record<string, string> = {
    arm: "armhf",
    arm64: "aarch64",
    ia32: "i686",
    x64: "x86_64",
  };
  return `https://github.com/AppImage/type2-runtime/releases/download/${TYPE2_RUNTIME_VERSION}/runtime-${arch[process.arch]}`;
}

async function main() {
  if (await isDownloaded()) {
    console.log("type2-runtime already downloaded");
    return;
  }

  await fs.mkdir(distDir, { recursive: true });
  const url = getDownloadURL();
  const result = await retryFetch(url);

  // ✅ ① HTTP 状态校验
  if (!result.ok) {
    throw new Error(
      `Failed to download type2-runtime: ${result.status} ${result.statusText}`,
    );
  }

  const data = await result.bytes();

  // ✅ ② ELF 魔数校验（非常重要）
  if (
    data.length < 4 ||
    data[0] !== 0x7f ||
    data[1] !== 0x45 || // E
    data[2] !== 0x4c || // L
    data[3] !== 0x46    // F
  ) {
    throw new Error(
      "Downloaded type2-runtime is not an ELF binary (maybe HTML or error page)",
    );
  }

  // ✅ ③ 写文件时直接给执行权限
  await fs.writeFile(runtimePath, data, { mode: 0o755 });
  await fs.chmod(runtimePath, 0o755);

  await fs.writeFile(versionFilePath, TYPE2_RUNTIME_VERSION);
}

if (process.platform === "linux") {
  await main();
}
