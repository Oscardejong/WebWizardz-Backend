import Result from "./Result";
import { FileInfo } from "./FileInfo";

export function isFileValid(fileInfo?: FileInfo): Result {

  if (fileInfo) {

  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const { mimetype, size } = fileInfo;

  if (!validImageTypes.includes(mimetype)) {
    return new Result(false, `Invalid file type: ${mimetype}`);
  }

  if (size > 50 * 1024 * 1024) { // 5MB limit
    return new Result(false, "File is too large (maximum is 50MB).");
  }

}
  return new Result(true, "File is valid.");
}
