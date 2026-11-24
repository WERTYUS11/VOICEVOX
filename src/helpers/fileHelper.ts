import type { ResultError } from "@/type/result";

/** ファイル書き込み時のエラーメッセージを生成する */
// instanceof ResultErrorで生まれるResultError<any>を受け取れるようにするため、anyを許容する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateWriteErrorMessage(writeFileResult: ResultError<any>) {
  if (typeof writeFileResult.code === "string") {
    const code = writeFileResult.code?.toUpperCase();

    if (code?.startsWith("ENOSPC")) {
      return "磁盘空间不足。";
    }

    if (code?.startsWith("EACCES")) {
      return "没有访问文件的权限。";
    }

    if (code?.startsWith("EBUSY")) {
      return "文件已被打开。";
    }

    if (code?.startsWith("ENOENT")) {
      return "找不到指定的文件或文件夹。";
    }
  }

  return `因某些原因失败。${writeFileResult.message}`;
}
