
import Result from "./Result";
import WebsiteType from "./WebsiteType";
import Status from "./Status";
import { FileInfo } from "./FileInfo";

class Website {
  private name: string;
  private status: Status;
  private type: WebsiteType;
  private fileInfo?: FileInfo;

  constructor(name: string, status: Status, type: WebsiteType, fileInfo?: FileInfo) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error("Invalid website name: must be a non-empty string.");
    }
    if (!Object.values(Status).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    if (!Object.values(WebsiteType).includes(type)) {
      throw new Error(`Invalid website type: ${type}`);
    }

    this.name = name;
    this.status = status;
    this.type = type;
    this.fileInfo = fileInfo;
  }

  public getName(): string {
    return this.name;
  }

  public getStatus(): Status {
    return this.status;
  }

  public getType(): WebsiteType {
    return this.type;
  }

  public getFileInfo(): FileInfo | undefined {
    return this.fileInfo;
  }

  public updateFileInfo(newFileInfo: FileInfo): void {
    this.fileInfo = newFileInfo;
  }
}

export default Website;
