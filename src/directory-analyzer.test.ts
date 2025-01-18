import { DirectoryAnalyzer } from "./directory-analyzer";
import fs from "fs";

jest.mock("fs");
jest.mock("glob", () => ({
  globSync: jest.fn(() => []),
}));

describe("DirectoryAnalyzer", () => {
  const mockDirectoryPath = "/mock/path";
  const mockFiles = [
    "/mock/path/file1.txt",
    "/mock/path/file2.js",
    "/mock/path/file3.txt",
  ];

  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
    (require("glob").globSync as jest.Mock).mockReturnValue(mockFiles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate if the directory is valid", () => {
    const analyzer = new DirectoryAnalyzer({
      directoryPath: mockDirectoryPath,
    });
    expect(analyzer.isDirectoryValid()).toBe(true);
  });

  it("should return the correct files count", () => {
    const analyzer = new DirectoryAnalyzer({
      directoryPath: mockDirectoryPath,
    });
    expect(analyzer.getFilesCount()).toBe(mockFiles.length);
  });

  it("should analyze and return the correct file types", () => {
    const analyzer = new DirectoryAnalyzer({
      directoryPath: mockDirectoryPath,
    });
    const result = analyzer.analyze();
    expect(result).toEqual({
      ".txt": { extension: ".txt", count: 2, percentage: 66.66666666666666 },
      ".js": { extension: ".js", count: 1, percentage: 33.33333333333333 },
    });
  });

  it("should handle empty directory", () => {
    (require("glob").globSync as jest.Mock).mockReturnValue([]);
    const analyzer = new DirectoryAnalyzer({
      directoryPath: mockDirectoryPath,
    });
    const result = analyzer.analyze();
    expect(result).toEqual({});
  });

  it("should handle non-existent directory", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const analyzer = new DirectoryAnalyzer({
      directoryPath: mockDirectoryPath,
    });
    expect(analyzer.isDirectoryValid()).toBe(false);
  });
});
