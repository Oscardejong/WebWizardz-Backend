import { isFileValid } from "../domain/WebsiteCheckFile";
import { FileInfo } from "../domain/FileInfo";

describe("isFileValid", () => {

  it("should return success Result if no fileInfo provided", () => {
    const result = isFileValid(undefined);
    expect(result.success).toBe(true);
    expect(result.message).toBe("File is valid.");
  });

  it("should return failure Result if file type is invalid", () => {
    const fileInfo: FileInfo = {
      path: "uploads/invalid/file.pdf",
      originalname: "file.pdf",
      size: 1000,
      mimetype: "application/pdf",
      uploadedat: new Date(),
    };

    const result = isFileValid(fileInfo);

    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid file type");
  });

  it("should return failure Result if file size is too large", () => {
    const fileInfo: FileInfo = {
      path: "uploads/images/large-image.jpg",
      originalname: "large-image.jpg",
      size: 51 * 1024 * 1024, // 6MB
      mimetype: "image/jpeg",
      uploadedat: new Date(),
    };

    const result = isFileValid(fileInfo);

    expect(result.success).toBe(false);
    expect(result.message).toBe("File is too large (maximum is 50MB).");
  });

  it("should return success Result for valid file type and size", () => {
    const fileInfo: FileInfo = {
      path: "uploads/images/photo.png",
      originalname: "photo.png",
      size: 1024 * 1024, // 1MB
      mimetype: "image/png",
      uploadedat: new Date(),
    };

    const result = isFileValid(fileInfo);

    expect(result.success).toBe(true);
    expect(result.message).toBe("File is valid.");
  });
});
